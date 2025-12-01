// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton, InputTextField, SlidingPanel } from '@kitman/components';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { InputNumericTranslated as InputNumeric } from '@kitman/components/src/InputNumeric';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import type { GameActivityForm } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import type { GamePeriodDuration } from '@kitman/modules/src/PlanningEvent/types';
import type { Formation } from '@kitman/modules/src/PlanningEvent/src/services/formations';
import styles from '@kitman/modules/src/PlanningEvent/src/components/style';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { AddFormationsTranslated as AddFormation } from '../AddFormations/AddFormations';

type Props = {
  period: ?GamePeriod,
  onAdd: Function,
  onUpdate: Function,
  isOpen: boolean,
  closeModal: Function,
  nextPeriodNumber: number,
  gameActivities: Array<GameActivity>,
  formationChanges: Array<GameActivity>,
  formations: Array<Formation>,
  disableDurationEdit: boolean,
  lastPeriodDuration: number,
  periodDuration: GamePeriodDuration,
  gameDuration: number,
  pitchViewEnabled: boolean,
  hasPeriodStarted: boolean,
};

const style = {
  content: css`
    width: 100%;
    padding: 0px 20px;
    overflow: auto;
    height: 100%;
  `,
  formRow: css`
    margin-bottom: 16px;
  `,
  durationRow: css`
    display: flex;
    justify-content: flex-start;
  `,
  titleInput: css`
    width: 240px;
    margin-right: 10px;
  `,
  minInput: css`
    width: 140px;
    margin-right: 20px;
  `,
  slidingPanelAction: css`
    background-color: ${colors.white};
    border-top: 1px solid ${colors.neutral_300};
    align-items: center;
    display: flex;
    height: 80px;
    justify-content: space-between;
    text-align: center;
    width: 100%;
    z-index: 1000;
    position: absolute;
    bottom: 0;
    padding: 0px 20px;
  `,
};

const AddPeriodPanel = (props: I18nProps<Props>) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showFormationErrors, setShowFormationErrors] = useState<number>(0);
  const [showFormationWarning, setShowFormationWarning] =
    useState<boolean>(false);

  const setInitialForm = (period) => {
    if (period == null) {
      setIsEditMode(false);
      return {
        name: `${props.t('Period')} ${props.nextPeriodNumber}`,
        duration: props.lastPeriodDuration,
        additional_duration: null,
        id: 0,
        order: 0,
      };
    }

    setIsEditMode(true);
    return period;
  };

  const [form, setForm] = useState<GamePeriod>(() =>
    setInitialForm(props.period)
  );
  const [formationChangeUpdates, setFormationChangeUpdates] = useState<
    Array<GameActivityForm>
  >([]);
  const [formationChangeDeletions, setFormationChangeDeletions] = useState<
    Array<GameActivityForm>
  >([]);
  const [isTitleInvalid, setIsTitleInvalid] = useState<boolean>(false);
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean>(false);

  useEffect(() => {
    setForm(setInitialForm(props.period));
  }, [props.period]);

  const addUpdatePeriod = () => {
    let isInvalid = false;

    if (form.name.trim() === '' || form.name.trim().length > 31) {
      setIsTitleInvalid(true);
      isInvalid = true;
    } else {
      setIsTitleInvalid(false); // reset
    }

    if (!form.duration) {
      setIsDurationInvalid(true);
      isInvalid = true;
    } else {
      setIsDurationInvalid(false); // reset
    }

    formationChangeUpdates.forEach((a) => {
      if (!a.validation.relation_id.valid) {
        isInvalid = true;
        setShowFormationErrors(Math.random()); // math.random is to cause component to reload
      }
      if (!a.validation.minute.valid) {
        isInvalid = true;
        setShowFormationErrors(Math.random()); // math.random is to cause component to reload
      }
    });

    if (!isInvalid) {
      if (form.id > 0) {
        props.onUpdate(
          form,
          formationChangeUpdates.filter((a) => a.relation_id !== null),
          formationChangeDeletions
        );
      } else {
        props.onAdd(
          form,
          formationChangeUpdates.filter((a) => a.relation_id !== null),
          formationChangeDeletions
        );
      }
    }
  };

  const resetModal = () => {
    setForm(setInitialForm(null));
    props.closeModal();
  };

  const setPeriodDuration = (duration: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      duration,
    }));
  };

  const setPeriodAdditionalDuration = (additionalDuration: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      additional_duration: additionalDuration,
    }));
  };

  const setPeriodTitle = (title) => {
    setForm((prevForm) => ({
      ...prevForm,
      name: title,
    }));
  };

  const onUpdateFormations = (
    formationChangeUpds: Array<GameActivityForm>,
    formationChangeDels: Array<GameActivityForm>
  ) => {
    const hasFormationChanged =
      props.pitchViewEnabled &&
      props.formationChanges.length > 0 &&
      formationChangeUpds[0].relation_id !==
        props.formationChanges[0]?.relation?.id;
    if (hasFormationChanged) setShowFormationWarning(true);
    setFormationChangeUpdates(formationChangeUpds);
    setFormationChangeDeletions(formationChangeDels);
  };

  const getPeriodDuration = (
    periodDuration: GamePeriodDuration
  ): GamePeriodDuration => {
    if (periodDuration) {
      return periodDuration;
    }

    // otherwise new period
    return {
      min: props.gameDuration,
      max: props.gameDuration + form.duration,
    };
  };

  const showFormationWarningArea = () => (
    <div className="formation_error" css={styles.errorNotificationContainer}>
      <span css={styles.removedPlayerErrorText}>
        <i className="icon-circled-error" />
        {props.t('Changing formation will remove athlete events!')}
      </span>
      <span
        onClick={() => setShowFormationWarning(false)}
        css={styles.dismissText}
      >
        {props.t('Dismiss')}
      </span>
    </div>
  );

  const checkIfFormationWithoutId = !!formationChangeUpdates.find(
    (formationUpdate) => !formationUpdate.relation_id
  );

  return (
    <SlidingPanel
      isOpen={props.isOpen}
      kitmanDesignSystem
      togglePanel={() => resetModal()}
      title={
        isEditMode ? props.t('Edit period details') : props.t('Add Period')
      }
    >
      <div css={style.content}>
        <div
          css={[style.formRow, style.titleInput]}
          data-testid={props.pitchViewEnabled && 'disabled_title_property'}
        >
          <InputTextField
            label={props.t('Title')}
            value={form.name}
            inputType="text"
            kitmanDesignSystem
            onChange={(e) => setPeriodTitle(e.target.value)}
            invalid={isTitleInvalid}
            data-testid="AddPeriodPanel|TitleInput"
            disabled={props.pitchViewEnabled}
          />
        </div>

        <div css={style.durationRow}>
          <div
            css={[style.formRow, style.minInput]}
            data-testid={
              ((isEditMode && props.disableDurationEdit) ||
                props.pitchViewEnabled) &&
              'disabled-duration-property'
            }
          >
            <InputNumeric
              label={props.t('Duration')}
              value={form.duration ?? undefined}
              kitmanDesignSystem
              onChange={(e) => setPeriodDuration(parseFloat(e))}
              invalid={isDurationInvalid}
              disabled={
                (isEditMode && props.disableDurationEdit) ||
                props.pitchViewEnabled
              }
              data-testid="AddPeriodPanel|DurationInput"
              descriptor={props.t('mins')}
            />
          </div>

          {!props.pitchViewEnabled && (
            <div
              css={[style.formRow, style.minInput]}
              data-testid={
                isEditMode &&
                props.disableDurationEdit &&
                'disabled_additional_time_property'
              }
            >
              <InputNumeric
                label={props.t('Additional time')}
                value={form?.additional_duration ?? undefined}
                kitmanDesignSystem
                onChange={(e) => setPeriodAdditionalDuration(parseFloat(e))}
                disabled={isEditMode && props.disableDurationEdit}
                data-testid="AddPeriodPanel|AdditionalDurationInput"
                descriptor={props.t('mins')}
              />
            </div>
          )}
        </div>

        <AddFormation
          period={props.period}
          formations={props.formations}
          formationChanges={props.formationChanges}
          gameActivities={props.gameActivities}
          formationChangeUpdates={formationChangeUpdates}
          onUpdate={(formationChanges, formationChangeDeletes) => {
            onUpdateFormations(formationChanges, formationChangeDeletes);
          }}
          periodDuration={getPeriodDuration(props.periodDuration)}
          showErrors={showFormationErrors}
          pitchViewEnabled={props.pitchViewEnabled}
          hasPeriodStarted={props.hasPeriodStarted}
        />
      </div>

      {props.pitchViewEnabled &&
        showFormationWarning &&
        showFormationWarningArea()}
      <div css={style.slidingPanelAction}>
        <TextButton
          text={props.t('Cancel')}
          onClick={() => resetModal()}
          type="secondary"
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Save')}
          onClick={() => addUpdatePeriod()}
          type="primary"
          isDisabled={checkIfFormationWithoutId}
          kitmanDesignSystem
          data-testid="AddPeriodPanel|Save"
        />
      </div>
    </SlidingPanel>
  );
};

export const AddPeriodPanelTranslated = withNamespaces()(AddPeriodPanel);
export default AddPeriodPanel;
