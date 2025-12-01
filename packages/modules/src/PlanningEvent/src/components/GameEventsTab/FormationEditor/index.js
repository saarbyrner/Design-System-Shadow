// @flow
import { DndContext } from '@dnd-kit/core';
import { useEffect, useReducer } from 'react';
import { withNamespaces } from 'react-i18next';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import { isEmpty } from 'lodash';
import getFormationPositionsCoordinates from '@kitman/services/src/services/planning/getFormationPositionsCoordinates';
import { colors } from '@kitman/common/src/variables';
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Divider,
  Alert,
  Modal,
  IconButton,
} from '@kitman/playbook/components';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormationEditorContext, {
  initialState,
} from '@kitman/modules/src/PlanningEvent/src/contexts/FormationEditorContext';
import type {
  FormationCoordinates,
  Formation,
  Position,
  Coordinate,
} from '@kitman/common/src/types/PitchView';
import { GameFormatSelectTranslated as GameFormatSelect } from '@kitman/modules/src/PlanningEvent/src/components/GameFormatSelect';
import { FormationSelectTranslated as FormationSelect } from '@kitman/modules/src/PlanningEvent/src/components/FormationSelect';
import { updateFormationPositionViews } from '@kitman/services/src/services/planning';
import type { PositionViewUpdates } from '@kitman/services/src/services/planning/updateFormationPositionViews';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { useLazyGetGameFieldsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/gameFieldsApi';
import { LoadingSpinner } from '@kitman/components';
import Pitch from './Pitch';
import styles from './styles';
import { groupFormationsByGameFormat } from '../utils';
import reducer, { actionTypes } from './reducer';
import positions from './positions';

type FormationEditorProps = {
  open: boolean,
  onClose: () => void,
  sport: 'soccer',
  formations: Array<Formation>,
  gameFormats: Array<OrganisationFormat>,
};

const FormationEditor = (props: I18nProps<FormationEditorProps>) => {
  const { sport, formations, gameFormats } = props;
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    formations,
    gameFormats,
  });
  const { toasts, toastDispatch } = useToasts();

  useEffect(() => {
    if (!isEmpty(gameFormats) && formations) {
      dispatch({
        type: actionTypes.SET_FORMATIONS_GROUPED_BY_GAME_FORMAT,
        payload: groupFormationsByGameFormat(gameFormats, formations),
      });
    }
  }, [formations, gameFormats]);

  const [getGameFields] = useLazyGetGameFieldsQuery();

  useEffect(() => {
    if (props.open) {
      getGameFields().then(({ data = [] }) => {
        if (data?.length > 0) {
          dispatch({
            type: actionTypes.SET_FIELD,
            payload: data[0],
          });
        }
      });
    }
  }, [props.open, getGameFields]);

  useEffect(() => {
    if (props.open && formations.length > 0 && state.field.id) {
      const foundGameFormat = gameFormats?.find(
        (gameFormat) => gameFormat.number_of_players === 11
      );
      const foundFormation = formations?.find(
        (formation) => formation.number_of_players === 11
      );

      if (foundGameFormat && foundFormation) {
        getFormationPositionsCoordinates({
          fieldId: state.field.id,
          formationId: foundFormation.id,
        }).then((data) => {
          const coordinates: FormationCoordinates = {};
          data.forEach((coordinate) => {
            const xy = `${coordinate.x}_${coordinate.y}`;
            coordinates[xy] = coordinate;
          });
          dispatch({
            type: actionTypes.SET_FORMATION_COORDINATES,
            payload: coordinates,
          });
          dispatch({
            type: actionTypes.SET_FORMATION_COORDINATES_COPY,
            payload: coordinates,
          });
          dispatch({
            type: actionTypes.SET_SELECTED_GAME_FORMAT,
            payload: foundGameFormat,
          });
          dispatch({
            type: actionTypes.SET_SELECTED_FORMATION,
            payload: foundFormation,
          });
        });
      }
    }
  }, [props.open, formations, gameFormats, state.field.id]);

  const getAndSetFormationCoordinates = async (formationId: number) => {
    const data = await getFormationPositionsCoordinates({
      fieldId: state.field.id,
      formationId,
    });

    const coordinates: FormationCoordinates = {};
    data.forEach((coordinate) => {
      const xy = `${coordinate.x}_${coordinate.y}`;
      coordinates[xy] = coordinate;
    });
    dispatch({
      type: actionTypes.SET_FORMATION_COORDINATES,
      payload: coordinates,
    });
    dispatch({
      type: actionTypes.SET_FORMATION_COORDINATES_COPY,
      payload: coordinates,
    });
    dispatch({
      type: actionTypes.SET_ACTIVE_COORDINATE_ID,
      payload: undefined,
    });
    dispatch({
      type: actionTypes.SET_UPDATE_LIST,
      payload: { undo: [], redo: [] },
    });
  };

  const onChangeGameFormat = (format: OrganisationFormat) => {
    const foundFormation = formations?.find(
      (formation) => formation.number_of_players === format.number_of_players
    );
    if (foundFormation) {
      dispatch({ type: actionTypes.SET_SELECTED_GAME_FORMAT, payload: format });
      dispatch({
        type: actionTypes.SET_SELECTED_FORMATION,
        payload: foundFormation,
      });

      getAndSetFormationCoordinates(foundFormation.id);
    }
  };

  const onChangeFormation = (formation: Formation) => {
    dispatch({ type: actionTypes.SET_SELECTED_FORMATION, payload: formation });
    getAndSetFormationCoordinates(formation.id);
  };

  const onUndo = () => {
    dispatch({
      type: actionTypes.SET_ACTIVE_COORDINATE_ID,
      payload: undefined,
    });

    const updatedFormationCoordinates = { ...state.formationCoordinatesCopy };
    const lastItem = state.updateList.undo.slice(-1)[0];
    const currentCoordinateId = `${lastItem.to.x}_${lastItem.to.y}`;
    const nextCoordinateId = `${lastItem.from.x}_${lastItem.from.y}`;

    let previousPosition = updatedFormationCoordinates[currentCoordinateId];

    previousPosition = {
      ...previousPosition,
      position: lastItem.from.position,
      x: lastItem.from.x,
      y: lastItem.from.y,
    };

    delete previousPosition.dirty;
    delete updatedFormationCoordinates[currentCoordinateId];

    dispatch({
      type: actionTypes.SET_FORMATION_COORDINATES_COPY,
      payload: {
        ...updatedFormationCoordinates,
        [nextCoordinateId]: previousPosition,
      },
    });
    dispatch({
      type: actionTypes.SET_UPDATE_LIST,
      payload: {
        undo: state.updateList.undo.slice(0, -1),
        redo: [lastItem, ...state.updateList.redo],
      },
    });
  };

  const onRedo = () => {
    dispatch({
      type: actionTypes.SET_ACTIVE_COORDINATE_ID,
      payload: undefined,
    });

    const updatedFormationCoordinates = { ...state.formationCoordinatesCopy };
    const firstItem = state.updateList.redo[0];
    const currentCoordinateId = `${firstItem.from.x}_${firstItem.from.y}`;
    const nextCoordinateId = `${firstItem.to.x}_${firstItem.to.y}`;

    let nextPosition = updatedFormationCoordinates[currentCoordinateId];

    nextPosition = {
      ...nextPosition,
      position: firstItem.to.position,
      x: firstItem.to.x,
      y: firstItem.to.y,
      dirty: true,
    };

    delete updatedFormationCoordinates[currentCoordinateId];

    dispatch({
      type: actionTypes.SET_FORMATION_COORDINATES_COPY,
      payload: {
        ...updatedFormationCoordinates,
        [nextCoordinateId]: nextPosition,
      },
    });
    dispatch({
      type: actionTypes.SET_UPDATE_LIST,
      payload: {
        undo: [...state.updateList.undo, firstItem],
        redo: state.updateList.redo.slice(1),
      },
    });
  };

  const onChangePositionName = (position: Position) => {
    if (state.activeCoordinateId) {
      const previousPosition =
        state.formationCoordinatesCopy[state.activeCoordinateId];
      const newPosition = {
        ...state.formationCoordinatesCopy[state.activeCoordinateId],
        position,
        dirty: true,
      };

      dispatch({
        type: actionTypes.SET_FORMATION_COORDINATES_COPY,
        payload: {
          ...state.formationCoordinatesCopy,
          [state.activeCoordinateId]: newPosition,
        },
      });
      dispatch({
        type: actionTypes.SET_UPDATE_LIST,
        payload: {
          ...state.updateList,
          undo: [
            ...state.updateList.undo,
            {
              from: previousPosition,
              to: newPosition,
            },
          ],
        },
      });
      dispatch({
        type: actionTypes.SET_ACTIVE_COORDINATE_ID,
        payload: undefined,
      });
      dispatch({
        type: actionTypes.SET_HIGHLIGHT_POSITION_ID,
        payload: undefined,
      });
    }
  };

  const onSaveFormation = async () => {
    if (state.selectedFormation?.id) {
      try {
        dispatch({ type: actionTypes.SET_IS_SAVING_FORMATION, payload: true });

        const updatesToCommit: PositionViewUpdates = {
          formation_position_views: [],
        };

        Object.values(state.formationCoordinatesCopy)
          .filter(
            // $FlowFixMe dirty is an optional property
            (update) => update.dirty
          )
          // $FlowFixMe unsavedChange is of type Coordinate
          .forEach((unsavedChange: Coordinate) => {
            updatesToCommit.formation_position_views.push(
              {
                id: unsavedChange.id,
                x: unsavedChange.x,
              },
              {
                id: unsavedChange.id,
                y: unsavedChange.y,
              }
            );

            if (unsavedChange.position?.id) {
              updatesToCommit.formation_position_views.push({
                id: unsavedChange.id,
                position_id: unsavedChange.position.id,
              });
            }
          });

        await updateFormationPositionViews(updatesToCommit);
        const updatedData = await updateFormationPositionViews(updatesToCommit);

        if (!updatedData?.length) {
          throw new Error('No positions was updated.');
        }

        await getAndSetFormationCoordinates(state.selectedFormation.id);
        dispatch({ type: actionTypes.SET_IS_SAVING_FORMATION, payload: false });

        toastDispatch({
          type: 'CREATE_TOAST',
          toast: {
            id: 'save_formation_position_views',
            title: props.t('Formation updated.'),
            status: 'SUCCESS',
          },
        });
      } catch {
        dispatch({ type: actionTypes.SET_IS_SAVING_FORMATION, payload: false });
        toastDispatch({
          type: 'CREATE_TOAST',
          toast: {
            id: 'save_formation_position_views',
            title: props.t(
              "We couldn't update your formation, please try again."
            ),
            status: 'ERROR',
          },
        });
      }
    }
  };

  return (
    <FormationEditorContext.Provider value={{ state, dispatch }}>
      <Modal
        keepMounted={false}
        open={props.open}
        onClose={props.onClose}
        sx={styles.modal}
      >
        <DndContext>
          <Stack
            direction="column"
            justifyContent="space-between"
            style={{
              backgroundColor: colors.white,
              borderRadius: 3,
            }}
          >
            <Stack direction="column">
              {/* HEADER */}
              <Box>
                <Typography
                  sx={{ fontSize: 20, fontWeight: 600 }}
                  p={2}
                  color={colors.grey_300}
                >
                  {window.featureFlags['show-position-view-ids'] &&
                  state.selectedFormation?.id
                    ? props.t('Update formation id: {{selectedFormationId}}', {
                        selectedFormationId: state.selectedFormation.id,
                      })
                    : props.t('Update formation')}
                </Typography>
                <Divider />
              </Box>
              {/* BODY */}
              <Box css={styles.pitchWrapper} p={2}>
                <Box data-testid="pitch-container" className="pitch">
                  <Stack direction="row" justifyContent="space-between">
                    <Stack
                      direction="column"
                      justifyContent="space-between"
                      flex={1}
                    >
                      {state.selectedFormation?.id ? (
                        <>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            mb={4}
                          >
                            <Stack direction="row">
                              <GameFormatSelect
                                selectedGameFormat={state.selectedGameFormat}
                                setPendingGameFormat={onChangeGameFormat}
                                gameFormats={gameFormats}
                              />
                              <FormationSelect
                                formationsGroupedByGameFormat={
                                  state.formationsGroupedByGameFormat
                                }
                                selectedGameFormat={state.selectedGameFormat}
                                selectedFormation={state.selectedFormation}
                                setPendingFormation={onChangeFormation}
                              />
                            </Stack>

                            <Stack direction="row" gap={1}>
                              <IconButton
                                aria-label="undo"
                                disableRipple
                                disabled={!state.updateList.undo.length}
                                onClick={onUndo}
                              >
                                <UndoIcon />
                              </IconButton>
                              <IconButton
                                aria-label="redo"
                                disableRipple
                                disabled={!state.updateList.redo.length}
                                onClick={onRedo}
                              >
                                <RedoIcon />
                              </IconButton>
                            </Stack>
                          </Stack>
                          <Stack
                            flex={1}
                            justifyContent="center"
                            alignItems="center"
                            style={{ width: '100%' }}
                          >
                            <Pitch sport={sport} />
                          </Stack>
                        </>
                      ) : (
                        <Stack
                          flex={1}
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                          gap={4}
                          style={{ width: '100%' }}
                        >
                          <CircularProgress size={32} />
                          <Typography variant="string">
                            {props.t('Loading pitch view')}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                    <Stack direction="column" flex={1} pl={3}>
                      <Stack
                        direction="row"
                        mb={2}
                        justifyContent="space-between"
                      >
                        <Typography
                          sx={{ fontSize: 18, fontWeight: 600, padding: 0 }}
                          color={colors.grey_200}
                        >
                          {props.t('Assign position')}
                        </Typography>
                      </Stack>
                      <Alert severity="info">
                        {props.t(
                          'Drag or click a position on the pitch to assign a new position or update its name'
                        )}
                      </Alert>
                      <Stack direction="column" flex={1} overflow="auto" pt={1}>
                        {positions.map((position) => {
                          return (
                            <Typography
                              data-testid="position-with-abbreviation"
                              key={position.id}
                              disabled={
                                !state.activeCoordinateId ? true : undefined
                              }
                              onClick={() => onChangePositionName(position)}
                              onMouseEnter={() =>
                                state.activeCoordinateId &&
                                dispatch({
                                  type: actionTypes.SET_HIGHLIGHT_POSITION_ID,
                                  payload: +position.id,
                                })
                              }
                              onMouseLeave={() =>
                                dispatch({
                                  type: actionTypes.SET_HIGHLIGHT_POSITION_ID,
                                  payload: undefined,
                                })
                              }
                              sx={styles.positionName(state.activeCoordinateId)}
                            >
                              {position.name} ({position.abbreviation})
                            </Typography>
                          );
                        })}
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </Stack>
            {/* FOOTER */}
            <Box>
              <Divider />
              <Stack direction="row" justifyContent="end" gap={2} p={2}>
                <Button variant="text" onClick={props.onClose}>
                  {props.t('Cancel')}
                </Button>
                <Button
                  variant="contained"
                  onClick={onSaveFormation}
                  disabled={
                    !state.updateList.undo.length || state.isSavingFormation
                  }
                >
                  {state.isSavingFormation && (
                    <>
                      <LoadingSpinner color={colors.white} />{' '}
                    </>
                  )}
                  {props.t('Save')}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DndContext>
      </Modal>
      <ToastDialog
        toasts={toasts}
        onCloseToast={(toastId) =>
          toastDispatch({
            type: 'REMOVE_TOAST_BY_ID',
            id: toastId,
          })
        }
      />
    </FormationEditorContext.Provider>
  );
};

export const FormationEditorTranslated = withNamespaces()(FormationEditor);
export default FormationEditor;
