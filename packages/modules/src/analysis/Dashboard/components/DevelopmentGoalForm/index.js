// @flow
import { useState, useEffect } from 'react';
import moment from 'moment';
import _cloneDeep from 'lodash/cloneDeep';
import _forOwn from 'lodash/forOwn';
import { withNamespaces } from 'react-i18next';

import {
  AppStatus,
  DatePicker,
  Select,
  SlidingPanel,
  Textarea,
  TextButton,
} from '@kitman/components';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SelectOption } from '@kitman/components/src/types';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import style from './style';

export type DevelopmentGoalFormType = {
  id: ?number,
  athlete_id: ?number,
  description: string,
  development_goal_type_ids: Array<number>,
  principle_ids: Array<number>,
  start_time: ?string,
  close_time: ?string,
  copy_to_athlete_ids: Array<number>,
};

type FormValidation = {
  athlete_id: { isValid: boolean, showError: boolean },
  description: { isValid: boolean, showError: boolean },
  development_goal_type_ids: { isValid: boolean, showError: boolean },
  principle_ids: { isValid: boolean, showError: boolean },
  start_time: { isValid: boolean, showError: boolean },
};

type Props = {
  initialFormData: DevelopmentGoalFormType,
  developmentGoalTypes: Array<SelectOption>,
  principles: Array<SelectOption>,
  athletes: Array<SelectOption>,
  isOpen: boolean,
  areCoachingPrinciplesEnabled: boolean,
  developmentGoalTerminology: ?string,
  requestStatus: 'FAILURE' | 'LOADING' | null,
  onClickCloseSidePanel: Function,
  onValidationSuccess: Function,
};

const initialFormValidation = (initialFormData) =>
  _cloneDeep({
    athlete_id: {
      isValid: Boolean(initialFormData.athlete_id),
      showError: false,
    },
    description: {
      isValid: Boolean(initialFormData.description),
      showError: false,
    },
    development_goal_type_ids: {
      isValid: initialFormData.development_goal_type_ids.length > 0,
      showError: false,
    },
    principle_ids: { isValid: true, showError: false },
    start_time: {
      isValid: Boolean(initialFormData.start_time),
      showError: false,
    },
  });

function DevelopmentGoalForm(props: I18nProps<Props>) {
  const { trackEvent } = useEventTracking();
  const [form, setForm] = useState<DevelopmentGoalFormType>(
    props.initialFormData
  );
  const [showCopyToAthleteSelect, setShowCopyToAthleteSelect] = useState(
    props.initialFormData.copy_to_athlete_ids.length > 0
  );
  const [formValidation, setFormValidation] = useState<FormValidation>(
    initialFormValidation(props.initialFormData)
  );

  useEffect(() => {
    if (props.isOpen === true) {
      setForm(props.initialFormData);
      setFormValidation(initialFormValidation(props.initialFormData));
      setShowCopyToAthleteSelect(
        props.initialFormData.copy_to_athlete_ids.length > 0
      );
    }
  }, [props.isOpen, props.initialFormData]);

  const formMode = form.id ? 'EDIT' : 'CREATE';

  const showAllErrors = () =>
    setFormValidation((prevFormValidation) => {
      const updatedFormValidation = { ...prevFormValidation };
      _forOwn(updatedFormValidation, (value, field) => {
        updatedFormValidation[field].showError = true;
      });
      return updatedFormValidation;
    });

  const onClickSave = () => {
    let isFormValid = true;
    _forOwn(formValidation, (value, field) => {
      if (!formValidation[field].isValid) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      showAllErrors();
      return;
    }

    props.onValidationSuccess(form);

    if (formMode === 'CREATE') {
      trackEvent('Add development goal');
    }
  };

  const getPanelTitle = () => {
    if (formMode === 'CREATE') {
      return props.developmentGoalTerminology
        ? props.t('Add {{item}}', {
            item: props.developmentGoalTerminology,
          })
        : props.t('Add Development Goal');
    }

    return props.developmentGoalTerminology
      ? props.t('Edit {{item}}', {
          item: props.developmentGoalTerminology,
        })
      : props.t('Edit Development Goal');
  };

  return (
    <SlidingPanel
      title={getPanelTitle()}
      isOpen={props.isOpen}
      togglePanel={props.onClickCloseSidePanel}
    >
      <div css={style.content}>
        <div css={style.fieldRow} data-testid="DevelopmentGoalForm|AthleteRow">
          <Select
            label={props.t('Athlete')}
            options={props.athletes}
            value={form.athlete_id}
            onChange={(id) => {
              setForm((prevForm) => ({ ...prevForm, athlete_id: id }));
              setFormValidation((prevFormValidation) => ({
                ...prevFormValidation,
                athlete_id: {
                  isValid: true,
                  showError: false,
                },
              }));
            }}
            isDisabled={
              formMode === 'EDIT' || props.requestStatus === 'LOADING'
            }
            invalid={
              formValidation.athlete_id.showError &&
              !formValidation.athlete_id.isValid
            }
          />
        </div>
        {formMode === 'CREATE' && (
          <div
            css={style.fieldRow}
            data-testid="DevelopmentGoalForm|CopyToAthleteRow"
          >
            {!showCopyToAthleteSelect ? (
              <TextButton
                text={props.t('Copy to more athletes')}
                type="link"
                onClick={() => setShowCopyToAthleteSelect(true)}
                kitmanDesignSystem
              />
            ) : (
              <>
                <Select
                  label={props.t('Copy to more athletes')}
                  options={props.athletes.map((positionGroup) => ({
                    ...positionGroup,
                    options: positionGroup.options?.filter(
                      (athlete) => athlete.value !== form.athlete_id
                    ),
                  }))}
                  onChange={(ids) =>
                    setForm((prevForm) => ({
                      ...prevForm,
                      copy_to_athlete_ids: ids,
                    }))
                  }
                  value={form.copy_to_athlete_ids}
                  isDisabled={props.requestStatus === 'LOADING'}
                  isMulti
                  menuPosition="fixed"
                  appendToBody
                />
                <p css={style.fieldWarningText}>
                  {props.developmentGoalTerminology
                    ? props.t(
                        'Copying to more athletes will create separate versions of the {{item}}.',
                        {
                          item: props.developmentGoalTerminology,
                        }
                      )
                    : props.t(
                        'Copying to more athletes will create separate versions of the Development Goal.'
                      )}
                </p>
              </>
            )}
          </div>
        )}
        <div css={style.fieldRow}>
          <Textarea
            label={
              props.developmentGoalTerminology || props.t('Development goal')
            }
            onChange={(text) => {
              setForm((prevForm) => ({ ...prevForm, description: text }));
              setFormValidation((prevFormValidation) => ({
                ...prevFormValidation,
                description: {
                  isValid: Boolean(text),
                  showError: false,
                },
              }));
            }}
            value={form.description}
            onBlur={() =>
              setFormValidation((prevFormValidation) => ({
                ...prevFormValidation,
                description: {
                  isValid: prevFormValidation.description.isValid,
                  showError: true,
                },
              }))
            }
            invalid={
              formValidation.description.showError &&
              !formValidation.description.isValid
            }
            disabled={props.requestStatus === 'LOADING'}
            kitmanDesignSystem
          />
        </div>
        <div css={style.fieldRow} data-testid="DevelopmentGoalForm|TypeRow">
          <Select
            label={props.t('Type')}
            options={props.developmentGoalTypes}
            onChange={(ids) => {
              setForm((prevForm) => ({
                ...prevForm,
                development_goal_type_ids: ids,
              }));
              setFormValidation((prevFormValidation) => ({
                ...prevFormValidation,
                development_goal_type_ids: {
                  isValid: true,
                  showError: true,
                },
              }));
            }}
            value={form.development_goal_type_ids}
            invalid={
              formValidation.development_goal_type_ids.showError &&
              !formValidation.development_goal_type_ids.isValid
            }
            isDisabled={props.requestStatus === 'LOADING'}
            isMulti
            menuPosition="fixed"
            appendToBody
          />
        </div>
        {props.areCoachingPrinciplesEnabled && (
          <div
            css={style.fieldRow}
            data-testid="DevelopmentGoalForm|PrincipleRow"
          >
            <Select
              label={props.t('Principle(s)')}
              options={props.principles}
              onChange={(ids) => {
                setForm((prevForm) => ({ ...prevForm, principle_ids: ids }));
                setFormValidation((prevFormValidation) => ({
                  ...prevFormValidation,
                  principle_ids: {
                    isValid: true,
                    showError: true,
                  },
                }));
              }}
              value={form.principle_ids}
              invalid={
                formValidation.principle_ids.showError &&
                !formValidation.principle_ids.isValid
              }
              isDisabled={props.requestStatus === 'LOADING'}
              isMulti
              optional
              menuPosition="fixed"
              appendToBody
            />
          </div>
        )}
        <div css={[style.fieldRow, style.dateFieldRow]}>
          <DatePicker
            label={props.t('Start date')}
            name="startDate"
            onDateChange={(date) => {
              setForm((prevForm) => ({
                ...prevForm,
                start_time: moment(date)
                  .startOf('day')
                  .format(dateTransferFormat),
              }));
              setFormValidation((prevFormValidation) => ({
                ...prevFormValidation,
                start_time: {
                  isValid: true,
                  showError: true,
                },
              }));
            }}
            value={form.start_time ? moment(form.start_time) : null}
            invalid={
              formValidation.start_time.showError &&
              !formValidation.start_time.isValid
            }
            maxDate={form.close_time ? moment(form.close_time) : undefined}
            disabled={props.requestStatus === 'LOADING'}
            kitmanDesignSystem
          />
          <DatePicker
            label={props.t('Close date')}
            name="closeDate"
            onDateChange={(date) => {
              setForm((prevForm) => ({
                ...prevForm,
                close_time: date
                  ? moment(date).endOf('day').format(dateTransferFormat)
                  : null,
              }));
            }}
            value={form.close_time ? moment(form.close_time) : null}
            minDate={form.start_time ? moment(form.start_time) : undefined}
            disabled={props.requestStatus === 'LOADING'}
            kitmanDesignSystem
            clearBtn
            optional
          />
        </div>
      </div>

      <div className="slidingPanelActions" css={style.footer}>
        <TextButton
          onClick={props.onClickCloseSidePanel}
          text={props.t('Cancel')}
          type="subtle"
          isDisabled={props.requestStatus === 'LOADING'}
          kitmanDesignSystem
        />
        <TextButton
          onClick={onClickSave}
          text={props.t('Save')}
          type="primary"
          isDisabled={props.requestStatus === 'LOADING'}
          kitmanDesignSystem
        />
      </div>
      {props.requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </SlidingPanel>
  );
}

export default DevelopmentGoalForm;
export const DevelopmentGoalFormTranslated =
  withNamespaces()(DevelopmentGoalForm);
