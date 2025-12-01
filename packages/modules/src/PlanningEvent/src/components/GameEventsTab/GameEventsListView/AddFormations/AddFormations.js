// @flow
import { Fragment, useState, useEffect, useMemo } from 'react';
import _isEqual from 'lodash/isEqual';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { InputTextField, Select, TextButton } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import type { Formation } from '@kitman/modules/src/PlanningEvent/src/services/formations';
import type { GamePeriodDuration } from '@kitman/modules/src/PlanningEvent/types';
import type { GameActivityForm } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { findMostRecentFormationsForPeriod } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import {
  filterFormationOptions,
  formatFormationsToDropdownOptions,
  getMaxMinForEventActivities,
} from '../../utils';

type Props = {
  period: ?GamePeriod,
  formationChanges: Array<GameActivity>,
  formationChangeUpdates: GameActivityForm[],
  formations: Array<Formation>,
  gameActivities: GameActivity[],
  onUpdate: Function,
  periodDuration: GamePeriodDuration,
  showErrors: number,
  pitchViewEnabled: boolean,
  hasPeriodStarted: boolean,
};

const style = {
  content: css`
    margin-bottom: 20px;
  `,
  formGrid: css`
    display: grid;
    grid-gap: 8px 10px;
    grid-template-columns: 1fr 48px 24px;
    align-items: end;
  `,
  formationPitchViewDisplay: css`
    display: flex;
    flex-direction: column;

    .formation-info-area {
      margin-bottom: 10px;
    }
  `,
  emptyMessage: css`
    padding: 16px 24px;
    text-align: center;
  `,
  deleteButton: css`
    background: transparent;
    border: 0;
    color: ${colors.s16};
    font-size: 16px;
    padding: 0;
    margin-bottom: 8px;

    &:hover {
      cursor: pointer;
    }

    :disabled {
      opacity: 0;

      &:hover {
        cursor: default;
      }
    }
  `,
};

const AddFormations = (props: I18nProps<Props>) => {
  const pitchViewPeriodHasStarted =
    props.pitchViewEnabled && props.hasPeriodStarted;

  const getInitialFormData = (formationChanges) => {
    if (formationChanges.length === 0) {
      return [
        {
          minute: props.periodDuration.min,
          absolute_minute: props.periodDuration.min,
          relation_id: null,
          kind: eventTypes.formation_change,
          validation: {
            minute: {
              valid: true,
              showError: false,
            },
            relation_id: {
              valid: true,
              showError: false,
            },
          },
        },
      ];
    }

    return formationChanges.map((formationChange) => ({
      id: formationChange.id,
      minute: formationChange.minute,
      absolute_minute: formationChange.absolute_minute,
      relation_id: formationChange.relation?.id,
      validation: {
        minute: {
          valid: true,
          showError: false,
        },
        relation_id: {
          valid: true,
          showError: false,
        },
      },
    }));
  };

  const [formationChangeUpdates, setFormationChangeUpdates] = useState<
    Array<GameActivityForm>
  >(getInitialFormData(props.formationChanges));

  const [formationChangeDeletions, setFormationChangeDeletions] = useState<
    Array<GameActivityForm>
  >([]);

  const formationsDropdownOptions = useMemo(
    () =>
      formatFormationsToDropdownOptions(
        props.formations,
        props.hasPeriodStarted,
        props.formationChanges
      ),
    [props.formations, props.hasPeriodStarted, props.formationChanges]
  );

  useEffect(() => {
    setFormationChangeUpdates(getInitialFormData(props.formationChanges));
  }, [props.formationChanges]);

  useEffect(() => {
    props.onUpdate(formationChangeUpdates, formationChangeDeletions);
  }, [formationChangeUpdates, formationChangeDeletions]);

  const showFieldError = (index, fieldName) =>
    setFormationChangeUpdates((prevFormationChangeUpdates) => {
      const updatedForm = [...prevFormationChangeUpdates];
      updatedForm[index].validation[fieldName].showError = true;
      return updatedForm;
    });

  useEffect(() => {
    formationChangeUpdates.forEach((a, index) => {
      showFieldError(index, 'relation_id');
    });
  }, [props.showErrors]);

  const addFormationChange = () =>
    setFormationChangeUpdates((prevFormationChangeUpdates) => {
      let newEventTime;

      if (pitchViewPeriodHasStarted) {
        // Get the most recent pitch movement events absolute minute time
        newEventTime = getMaxMinForEventActivities(
          [...props.gameActivities, ...prevFormationChangeUpdates],
          null,
          true
        );

        // IF the retrieved time is the same as the most recent formation changes absolute_minute then increment
        // the new time by 1 so they are not the same.
        if (
          newEventTime ===
          +prevFormationChangeUpdates[prevFormationChangeUpdates.length - 1]
            .absolute_minute
        )
          newEventTime += 1;
      } else {
        newEventTime = props.periodDuration.min;
      }

      return [
        ...prevFormationChangeUpdates,
        {
          kind: eventTypes.formation_change,
          minute: newEventTime,
          absolute_minute: newEventTime,
          validation: {
            minute: {
              valid: true,
              showError: false,
            },
            relation_id: {
              valid: false,
              showError: false,
            },
          },
          game_activities: pitchViewPeriodHasStarted ? [] : null,
        },
      ];
    });

  const setFormationChangeMinute = (formationChangeIndex, minute) => {
    let isValid = false;

    const isNumeric = !Number.isNaN(parseFloat(minute));

    const combinedFormationChanges = [
      ...props.formationChanges,
      ...props.formationChangeUpdates,
    ];

    const defaultMinuteCheck =
      minute >= props.periodDuration.min &&
      minute <= props.periodDuration.max &&
      isNumeric;

    isValid = pitchViewPeriodHasStarted
      ? defaultMinuteCheck &&
        minute >
          +findMostRecentFormationsForPeriod(
            combinedFormationChanges.filter(
              (_, index) =>
                !_isEqual(
                  combinedFormationChanges[index],
                  combinedFormationChanges[formationChangeIndex]
                )
            ),
            props.period
          )[0]?.absolute_minute
      : defaultMinuteCheck;

    setFormationChangeUpdates((prevActivityUpdates) => {
      const updatedForm = [...prevActivityUpdates];
      updatedForm[formationChangeIndex].minute = minute;
      updatedForm[formationChangeIndex].absolute_minute = minute;
      updatedForm[formationChangeIndex].validation.minute.valid = isValid;
      updatedForm[formationChangeIndex].validation.minute.showError = !isValid;

      return updatedForm;
    });
  };

  const setFormationChangeFormation = (formationChangeIndex, formationId) =>
    setFormationChangeUpdates((prevActivityUpdates) => {
      const updatedForm = [...prevActivityUpdates];
      updatedForm[formationChangeIndex].relation_id = formationId;
      updatedForm[formationChangeIndex].validation.relation_id.valid =
        formationId !== null;
      updatedForm[formationChangeIndex].validation.relation_id.showError = true;

      return updatedForm;
    });

  const removeFormationChange = (formationChangeIndex) => {
    const deletedFormationChange = formationChangeUpdates[formationChangeIndex];

    // Add the item to the list of deletion if it is a saved item
    if (deletedFormationChange.id) {
      setFormationChangeDeletions((prevFormationChangeDeletions) => [
        ...prevFormationChangeDeletions,
        { ...deletedFormationChange, delete: true },
      ]);
    }

    // Remove the item from the list of updates
    setFormationChangeUpdates((prevFormationChangeUpdates) =>
      prevFormationChangeUpdates.filter(
        (el, index) => index !== formationChangeIndex
      )
    );
  };

  const checkIfFormationHasPendingUpdate = () =>
    !!formationChangeUpdates.find(
      (update) => !update?.relation?.id && !update.relation_id
    );

  const checkIfMostRecentActivity = (currentFormation: GameActivityForm) => {
    const currentFormationChanges = [...formationChangeUpdates];
    currentFormationChanges.shift();
    const filteredUnSavedFormations = currentFormationChanges.filter(
      (activity) => !activity.id
    );

    if (filteredUnSavedFormations.length === 0) {
      const currentGameActivity = props.gameActivities.find(
        (activity) => activity.id === currentFormation.id
      );
      // Returning the most recent pitch movement change activity that is not the current game activity
      return !_isEqual(
        props.gameActivities
          .sort((a, b) => +b.absolute_minute - +a.absolute_minute)
          .find((activity) =>
            [
              eventTypes.switch,
              eventTypes.sub,
              eventTypes.formation_change,
            ].includes(activity.kind)
          ),
        currentGameActivity
      );
    }

    return !_isEqual(
      filteredUnSavedFormations[filteredUnSavedFormations.length - 1],
      currentFormation
    );
  };

  return (
    <>
      <div css={style.content}>
        <div
          css={
            props.pitchViewEnabled && !props.hasPeriodStarted
              ? style.formationPitchViewDisplay
              : style.formGrid
          }
        >
          {formationChangeUpdates.map((formationChange, index) => {
            const minuteValidation =
              formationChange.validation.minute.showError &&
              !formationChange.validation.minute.valid;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={index}>
                <div className="formation-info-area">
                  <Select
                    label={props.t('Formation')}
                    placeholder={props.t('Formation')}
                    options={formationsDropdownOptions}
                    onChange={(formationId) =>
                      setFormationChangeFormation(index, formationId)
                    }
                    onBlur={() => showFieldError(index, 'relation_id')}
                    invalid={
                      formationChange.validation.relation_id.showError &&
                      !formationChange.validation.relation_id.valid
                    }
                    value={formationChange.relation_id}
                    isDisabled={
                      props.pitchViewEnabled &&
                      props.hasPeriodStarted &&
                      (!index || checkIfMostRecentActivity(formationChange))
                    }
                    filterOption={filterFormationOptions}
                  />
                </div>
                {(!props.pitchViewEnabled || pitchViewPeriodHasStarted) && (
                  <>
                    <div
                      data-testid={
                        minuteValidation && 'invalid_minute_property'
                      }
                    >
                      <InputTextField
                        label={props.t('Minute')}
                        value={formationChange.absolute_minute.toString()}
                        onChange={(e) =>
                          setFormationChangeMinute(index, e.target.value)
                        }
                        invalid={minuteValidation}
                        disabled={
                          props.pitchViewEnabled &&
                          (!index || checkIfMostRecentActivity(formationChange))
                        }
                        onBlur={() => showFieldError(index, 'minute')}
                        inputType="number"
                        kitmanDesignSystem
                      />
                    </div>
                    <button
                      onClick={() => removeFormationChange(index)}
                      type="button"
                      css={style.deleteButton}
                      className="icon-bin"
                      disabled={
                        props.pitchViewEnabled &&
                        (!index || checkIfMostRecentActivity(formationChange))
                      }
                      data-testid="AddFormation|DeleteButton"
                    />
                  </>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {(!props.pitchViewEnabled || pitchViewPeriodHasStarted) && (
        <footer>
          <TextButton
            onClick={() => addFormationChange()}
            text={props.t('Add formation')}
            type="secondary"
            kitmanDesignSystem
            isDisabled={
              props.pitchViewEnabled && checkIfFormationHasPendingUpdate()
            }
            data-testid="AddFormation|AddButton"
          />
        </footer>
      )}
    </>
  );
};

export const AddFormationsTranslated = withNamespaces()(AddFormations);
export default AddFormations;
