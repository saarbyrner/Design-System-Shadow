// @flow
import React from 'react';
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  DatePicker,
  IconButton,
  InputNumeric,
  Select,
  Textarea,
  TextButton,
  TimePicker,
  RichTextEditor,
} from '@kitman/components';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '../../../../types';
import type { CreateTreatmentState } from '../../../../types/medical/TreatmentSessions';
import EditTreatmentFieldContainer, {
  EditTreatmentFieldDateContainer,
  EditTreatmentFieldTimeContainer,
  EditTreatmentFieldTimezoneContainer,
  EditTreatmentFieldReasonContainer,
} from '../../../../containers/EditTreatmentField';
import getStyles from './styles';

type Props = {
  athleteId: number,
  athleteData: ?AthleteData,
  editedTreatment: CreateTreatmentState,
  initialDataRequestStatus: RequestStatus,
  isDeleteAthleteDisabled: boolean,
  isInvalid: boolean,
  onClickAddTreatment: Function,
  onClickRemoveAthlete: Function,
  onClickRemoveTreatment: Function,
  onClickRemoveAllTreatments: Function,
  staffUsers: Array<Option>,
  treatmentSessionOptions: Object,
};

const EditTreatmentCard = (props: I18nProps<Props>) => {
  const style = getStyles();

  const handleSelectBodyArea = (bodyArea) => {
    const selectedBodyAreas = bodyArea;
    let selectedItemIndex = -1;
    const selectedItem = props.treatmentSessionOptions.bodyAreaOptions.find(
      (bao, index) => {
        selectedItemIndex = index;
        return (
          JSON.stringify(bao.value) ===
          selectedBodyAreas[selectedBodyAreas.length - 1]
        );
      }
    );

    if (selectedItem) {
      const reversedSlice = props.treatmentSessionOptions.bodyAreaOptions
        .slice(0, selectedItemIndex)
        .reverse();
      const bodyAreaParent = reversedSlice.find((item) => item.isGroupOption);
      const bodyAreaParentId = selectedItem?.isGroupOption
        ? null
        : bodyAreaParent?.value;

      if (bodyAreaParentId && !bodyArea.includes(bodyAreaParentId)) {
        selectedBodyAreas.push(JSON.stringify(bodyAreaParentId));
      }
    }

    return selectedBodyAreas;
  };

  if (props.initialDataRequestStatus === 'PENDING') {
    return (
      <div css={style.editTreatmentContent}>
        <div css={style.loadingText}>{props.t('Loading')} ...</div>
      </div>
    );
  }

  if (props.initialDataRequestStatus === 'FAILURE') {
    return (
      <div css={style.editTreatmentContent}>
        <AppStatus status="error" />
      </div>
    );
  }

  return (
    <div css={style.editTreatmentContent}>
      <>
        <div css={style.editAthleteDetails}>
          <img
            css={style.editAthleteAvatar}
            src={props.athleteData?.avatar_url}
            alt={props.athleteData?.fullname}
          />
          <div css={style.athleteInfoContainer}>
            <span css={style.editAthleteName}>
              {props.athleteData?.fullname}
            </span>
            <span css={style.editAthletePosition}>
              {props.athleteData?.position}
            </span>
          </div>
        </div>

        <div css={style.editTreatmentDate}>
          <EditTreatmentFieldDateContainer
            athleteId={props.athleteId}
            fieldKey="date"
            render={(value, onChange) => (
              <DatePicker
                label={props.t('Date')}
                onDateChange={(date) => onChange(moment(date).toISOString())}
                value={moment(value).format('YYYY-MM-DD')}
                kitmanDesignSystem
              />
            )}
          />
        </div>

        <div css={style.editTreatmentPractitioner}>
          <EditTreatmentFieldContainer
            athleteId={props.athleteId}
            fieldKey="user_id"
            render={(value, onChange) => (
              <Select
                label={props.t('Practitioner')}
                onChange={onChange}
                value={value}
                options={props.staffUsers}
              />
            )}
          />
        </div>

        <div css={style.editStartTime}>
          <EditTreatmentFieldTimeContainer
            athleteId={props.athleteId}
            fieldKey="start_time"
            render={(value, onChange) => (
              <TimePicker
                label={props.t('Start time')}
                onChange={(time) => onChange(moment(time).toISOString())}
                value={moment(value)}
                kitmanDesignSystem
              />
            )}
          />
        </div>

        <div css={style.editEndTime}>
          <EditTreatmentFieldTimeContainer
            athleteId={props.athleteId}
            fieldKey="end_time"
            render={(value, onChange) => (
              <TimePicker
                label={props.t('End time')}
                onChange={(time) => onChange(moment(time).toISOString())}
                value={moment(value)}
                kitmanDesignSystem
              />
            )}
          />
        </div>

        <div css={style.editTimezone}>
          <EditTreatmentFieldTimezoneContainer
            athleteId={props.athleteId}
            fieldKey="timezone"
            render={(value, onChange) => (
              <Select
                appendToBody
                label={props.t('Timezone')}
                options={moment.tz.names().map((tzName) => ({
                  value: tzName,
                  label: tzName,
                }))}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </div>

        <div css={style.removeAthlete}>
          <IconButton
            icon="icon-bin"
            isTransparent
            onClick={props.onClickRemoveAthlete}
            isDisabled={props.isDeleteAthleteDisabled}
          />
        </div>

        <div css={style.editTreatmentNote}>
          <EditTreatmentFieldContainer
            athleteId={props.athleteId}
            fieldKey="annotation_attributes.content"
            render={(value, onChange) => (
              <RichTextEditor
                label={props.t('Note')}
                value={value || ''}
                onChange={onChange}
                kitmanDesignSystem
              />
            )}
          />
        </div>

        {props.isInvalid &&
          props.editedTreatment.end_time &&
          moment(props.editedTreatment.end_time).isSame(
            moment(props.editedTreatment.start_time),
            'minute'
          ) && (
            <span css={style.endTimeErrorMessage}>
              {props.t('End time cannot be the same as start time')}
            </span>
          )}

        {props.isInvalid &&
          props.editedTreatment.end_time &&
          !moment(props.editedTreatment.end_time).isSame(
            moment(props.editedTreatment.start_time),
            'day'
          ) && (
            <span css={style.endTimeWarningMessage}>
              {props.t('Ends next day')}
            </span>
          )}

        <span css={style.editTreatmentModalityLabel}>
          {props.t('Modality')}
        </span>
        <span css={style.editTreatmentReasonLabel}>{props.t('Reason')}</span>
        <span css={style.editTreatmentBodyAreaLabel}>
          {props.t('Body area')}
        </span>
        <span css={style.editTreatmentDurationLabel}>
          {props.t('Duration')}
        </span>
        <span css={style.editTreatmentCommentLabel}>{props.t('Comment')}</span>
        {window.featureFlags['replicate-treatments-clear-actions'] && (
          <span
            css={style.removeAllTreatmentsLabel}
            onClick={props.onClickRemoveAllTreatments}
          >
            {props.t('Clear all')}
          </span>
        )}

        {props.editedTreatment.treatments_attributes.map((treatment, index) => {
          return (
            // no other option but to use index for the key here for now
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={index}>
              <div css={style.editTreatmentModality}>
                <EditTreatmentFieldContainer
                  athleteId={props.athleteId}
                  fieldKey={`treatments_attributes[${index}].treatment_modality_id`}
                  render={(value, onChange) => (
                    <Select
                      appendToBody
                      isGrouped
                      value={value}
                      options={props.treatmentSessionOptions.modalityOptions}
                      onChange={onChange}
                      invalid={
                        props.isInvalid && !treatment.treatment_modality_id
                      }
                    />
                  )}
                />
              </div>

              <div css={style.editTreatmentReason}>
                <EditTreatmentFieldReasonContainer
                  athleteId={props.athleteId}
                  index={index}
                  render={(value, onChange) => (
                    <Select
                      appendToBody
                      isGrouped
                      value={value}
                      options={props.treatmentSessionOptions.reasonOptions}
                      onChange={(selectedReason) => {
                        onChange(selectedReason);
                      }}
                      invalid={props.isInvalid && !treatment.reason}
                    />
                  )}
                />
              </div>

              <div css={style.editTreatmentBodyAreas}>
                <EditTreatmentFieldContainer
                  athleteId={props.athleteId}
                  fieldKey={`treatments_attributes[${index}].treatment_body_areas_attributes`}
                  render={(value, onChange) => (
                    <Select
                      appendToBody
                      isMulti
                      value={value}
                      options={props.treatmentSessionOptions.bodyAreaOptions.map(
                        (option) => {
                          return {
                            ...option,
                            value: JSON.stringify(option.value),
                          };
                        }
                      )}
                      onChange={(selectedBodyAreas) => {
                        const bodyAreas =
                          handleSelectBodyArea(selectedBodyAreas);
                        onChange(bodyAreas);
                      }}
                    />
                  )}
                />
              </div>

              <div css={style.editTreatmentDuration}>
                <EditTreatmentFieldContainer
                  athleteId={props.athleteId}
                  fieldKey={`treatments_attributes[${index}].duration`}
                  render={(value, onChange) => (
                    <InputNumeric
                      name="duration"
                      value={value}
                      onChange={onChange}
                      descriptor={props.t('mins')}
                      kitmanDesignSystem
                    />
                  )}
                />
              </div>

              <div css={style.editTreatmentComment}>
                <EditTreatmentFieldContainer
                  athleteId={props.athleteId}
                  fieldKey={`treatments_attributes[${index}].note`}
                  render={(value, onChange) => (
                    <Textarea
                      label=""
                      value={value}
                      onChange={onChange}
                      maxLimit={65535}
                      kitmanDesignSystem
                      t={props.t}
                    />
                  )}
                />
              </div>

              <div css={style.removeTreatment}>
                <IconButton
                  icon="icon-close"
                  isTransparent
                  onClick={() => props.onClickRemoveTreatment(index)}
                />
              </div>
            </React.Fragment>
          );
        })}
        <div css={style.addTreatment}>
          <TextButton
            iconBefore="icon-add"
            isTransparent
            onClick={props.onClickAddTreatment}
            kitmanDesignSystem
          />
        </div>
      </>
    </div>
  );
};

export const EditTreatmentCardTranslated: ComponentType<Props> =
  withNamespaces()(EditTreatmentCard);
export default EditTreatmentCard;
