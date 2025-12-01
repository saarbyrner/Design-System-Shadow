// @flow
import _isEqual from 'lodash/isEqual';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import structuredClone from 'core-js/stable/structured-clone';
import { withNamespaces } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  GameActivity,
  GameActivityStorage,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { clearPeriodActivities } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import { onUpdatedFormation } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import {
  setSelectedGameFormat,
  setSelectedFormation,
  setFormationCoordinates,
  setTeam,
  setActiveEventSelection,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';
import type {
  Formation,
  PitchViewInitialState,
} from '@kitman/common/src/types/PitchView';

import styles from './styles';
import { GameFormatSelectTranslated as GameFormatSelect } from '../GameFormatSelect';
import { FormationSelectTranslated as FormationSelect } from '../FormationSelect';
import { FormationChangeConfirmationModalTranslated as FormationChangeConfirmationModal } from '../FormationChangeConfirmationModal';
import {
  groupFormationsByGameFormat,
  getClearedTeam,
  getNextCoords,
} from '../GameEventsTab/utils';
import useGameEventsModal from '../../hooks/useGameEventsModal';

type Props = {
  hasPeriodStarted: boolean,
  gameFormats: Array<OrganisationFormat>,
  formations: Array<Formation>,
  isLastPeriodSelected: boolean,
  currentPeriod: GamePeriod,
  isDmrLocked?: boolean,
};

const FormationSelector = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const {
    field,
    selectedFormation,
    selectedGameFormat,
    team,
    pitchActivities,
  } = useSelector<PitchViewInitialState>(
    (state) => state.planningEvent.pitchView
  );

  const [formationsGroupedByGameFormat, setFormationsGroupedByGameFormat] =
    useState<{ [key: number]: Formation[] }>({});
  const [pendingChange, setPendingChange] = useState<{
    gameFormat: OrganisationFormat | null,
    formation: Formation | null,
  }>({
    gameFormat: null,
    formation: null,
  });
  const [showFormationChangeModal, setShowFormationChangeModal] =
    useState<boolean>(false);
  const modal = useGameEventsModal();

  // Group formations by game format
  useEffect(() => {
    if (!isEmpty(props.gameFormats) && props.formations) {
      setFormationsGroupedByGameFormat(
        groupFormationsByGameFormat(props.gameFormats, props.formations)
      );
    }
  }, [props.formations, props.gameFormats]);

  useEffect(() => {
    if (pendingChange.gameFormat || pendingChange.formation) {
      setShowFormationChangeModal(true);
    }
  }, [pendingChange]);

  const onConfirmFormationChange = async () => {
    const format = pendingChange.gameFormat;
    const updatedFormation = format
      ? formationsGroupedByGameFormat[format.number_of_players][0]
      : pendingChange.formation;
    if (format) {
      dispatch(setSelectedGameFormat(format));
    }
    dispatch(setSelectedFormation(updatedFormation));

    const coordinates = await getNextCoords(field.id, +updatedFormation?.id);

    dispatch(setFormationCoordinates(coordinates));
    const updatedActivities = onUpdatedFormation(
      gameActivities,
      props.currentPeriod,
      updatedFormation
    );
    dispatch(
      setUnsavedGameActivities(
        clearPeriodActivities({
          gameActivities: updatedActivities,
          currentPeriod: props.currentPeriod,
          isLastPeriodSelected: props.isLastPeriodSelected,
        })
      )
    );

    if (Object.keys(team.inFieldPlayers).length > 0) {
      dispatch(setTeam(getClearedTeam(team)));
    }
    setPendingChange({ gameFormat: null, formation: null });
    setShowFormationChangeModal(false);
  };

  const removeFormationComplete = () => {
    const currentActivities = structuredClone(gameActivities);
    const formationCompleteCheck = (activity: GameActivity) =>
      activity.kind === eventTypes.formation_complete &&
      +activity.absolute_minute ===
        props.currentPeriod?.absolute_duration_start &&
      !activity.delete;

    const formationCompleteIndex = currentActivities.findIndex((activity) =>
      formationCompleteCheck(activity)
    );

    if (currentActivities[formationCompleteIndex]?.id) {
      currentActivities[formationCompleteIndex] = {
        ...currentActivities[formationCompleteIndex],
        delete: true,
      };
      dispatch(setUnsavedGameActivities(currentActivities));
    } else {
      dispatch(
        setUnsavedGameActivities(
          gameActivities.filter(
            (activity) =>
              !_isEqual(activity, currentActivities[formationCompleteIndex])
          )
        )
      );
    }
  };

  const changeName = useMemo(() => {
    if (pendingChange.gameFormat) {
      return pendingChange.gameFormat.name;
    }
    if (pendingChange.formation) {
      return pendingChange.formation.name;
    }
    return '';
  }, [pendingChange]);

  const onConfirmClearField = () => {
    // clear all period activities and close modal
    dispatch(
      setUnsavedGameActivities(
        clearPeriodActivities({
          gameActivities,
          currentPeriod: props.currentPeriod,
          isLastPeriodSelected: props.isLastPeriodSelected,
        })
      )
    );
    dispatch(setTeam(getClearedTeam(team)));
    dispatch(setActiveEventSelection(''));
  };

  const renderClearPeriodModal = () => {
    modal.show({
      title: props.t('Clear Starting Lineup'),
      content: props.t(
        `Are you sure you want to clear the starting lineup from this period?`
      ),
      onConfirm: () => {
        onConfirmClearField();
        modal.hide();
      },
    });
  };

  return (
    <div data-testid="FormationSelector">
      <div css={styles.wrapper}>
        {!props.hasPeriodStarted && selectedFormation && (
          <>
            <GameFormatSelect
              selectedGameFormat={selectedGameFormat}
              setPendingGameFormat={(gameFormat) =>
                setPendingChange({ gameFormat, formation: null })
              }
              gameFormats={props.gameFormats}
            />
            <FormationSelect
              formationsGroupedByGameFormat={formationsGroupedByGameFormat}
              selectedGameFormat={selectedGameFormat}
              selectedFormation={selectedFormation}
              setPendingFormation={(formation) =>
                setPendingChange({ formation, gameFormat: null })
              }
              isDisabled={props.isDmrLocked}
            />
          </>
        )}
        <div
          className={props.hasPeriodStarted ? 'clearButtonArea' : ''}
          css={styles.clearFormationButton}
        >
          <TextButton
            onClick={
              props.hasPeriodStarted
                ? removeFormationComplete
                : renderClearPeriodModal
            }
            text={
              props.hasPeriodStarted ? props.t('Edit lineup') : props.t('Clear')
            }
            type="secondary"
            isDisabled={
              (props.hasPeriodStarted && pitchActivities.length > 0) ||
              props.isDmrLocked
            }
            kitmanDesignSystem
          />
        </div>
      </div>
      <FormationChangeConfirmationModal
        show={showFormationChangeModal}
        setShow={setShowFormationChangeModal}
        name={
          pendingChange.gameFormat
            ? props.t('game format')
            : props.t('formation')
        }
        changeName={changeName}
        onConfirm={onConfirmFormationChange}
      />
      {modal.renderModal()}
    </div>
  );
};

export const FormationSelectorTranslated = withNamespaces()(FormationSelector);
export default FormationSelector;
