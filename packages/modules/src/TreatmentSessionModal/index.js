// @flow
import { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment-timezone';
import _findIndex from 'lodash/findIndex';
import { withNamespaces } from 'react-i18next';
import useFavouritesGroup from '@kitman/components/src/GroupedDropdown/hooks';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import {
  DatePicker,
  Dropdown,
  FileUploadArea,
  FormValidator,
  GroupedDropdown,
  IconButton,
  InputNumeric,
  InputText,
  LegacyModal as Modal,
  MultiSelectDropdown,
  RichTextEditor,
  Textarea,
  TextButton,
  TimePicker,
  TooltipMenu,
} from '@kitman/components';
import type {
  GroupedDropdownItem,
  MultiSelectDropdownItem,
} from '@kitman/components/src/types';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Athlete, TreatmentAttribute, TreatmentTemplate } from './types';

type Props = {
  athlete: ?Athlete,
  athletes?: Array<{ id: number, name: string }>,
  attachedFiles: Array<AttachedFile>,
  bodyAreaOptions: Array<MultiSelectDropdownItem>,
  isOpen: boolean,
  noteContent: string,
  onAddTreatmentAttribute: Function,
  onClickCloseModal: Function,
  onClickSaveTreatmentSession: Function,
  onRemoveTreatmentAttribute: Function,
  onSelectAthlete?: Function,
  onSelectBodyArea: Function,
  onSelectPractitioner: Function,
  onSelectTimezone: Function,
  onSelectTreatmentModality: Function,
  onSelectTreatmentReason: Function,
  onSetTreatmentDuration: Function,
  onUnselectBodyArea: Function,
  onUnselectParentBodyArea: Function,
  onUpdateFiles: Function,
  onUpdateTreatmentNoteText: Function,
  onUpdateTreatmentNoteAttribute: Function,
  reasonOptions: Array<GroupedDropdownItem>,
  selectedPractitioner: number,
  selectedTimezone: string,
  onUpdateTreatmentNoteRichText: Function,
  onAddTreatmentAttributes: Function,
  treatmentAttributes: Array<TreatmentAttribute>,
  treatmentModalityOptions: Array<GroupedDropdownItem>,
  users: Array<{ id: number, name: string }>,
  defaultDurationMinutes?: number,
};

const formatDate = (date: moment): string => {
  return date.format('YYYY-MM-DD');
};

function TreatmentSessionModal(props: I18nProps<Props>) {
  const getDefaultTreatmentDate = () =>
    formatDate(moment().tz(props.selectedTimezone));

  const getDefaultStartTime = () =>
    moment().tz(props.selectedTimezone).startOf('hour');

  const getDefaultEndTime = () => {
    if (!window.featureFlags['update-time-picker']) {
      return null;
    }
    return getDefaultStartTime().add(props.defaultDurationMinutes, 'minutes');
  };

  const [treatmentDate, setTreatmentDate] = useState(getDefaultTreatmentDate);
  const [startTime, setStartTime] = useState(getDefaultStartTime);
  const [endTime, setEndTime] = useState(getDefaultEndTime);
  const [endTimeValid, setEndTimeValid] = useState(true);

  const updateDate = (date: moment) => {
    setTreatmentDate(formatDate(date));
    // Create base moments with correct date and timezone
    const baseStartTimeDate = moment.tz(date, props.selectedTimezone);
    const baseEndTimeDate = moment.tz(date, props.selectedTimezone);

    // Apply the current time from startTime on top
    baseStartTimeDate.set({
      hour: startTime.get('hour'),
      minute: startTime.get('minute'),
    });

    setStartTime(baseStartTimeDate);

    // Update endTime is exists
    if (endTime) {
      // Apply the current time from endTime on top
      baseEndTimeDate.set({
        hour: endTime.get('hour'),
        minute: endTime.get('minute'),
      });
      // If is before startTime we add a day to the date.
      // So if startTime as 23:50 (11:50pm) and baseEndTimeDate were 01:00 (1am)
      // Then endTime should be considered the next day
      if (baseEndTimeDate.isBefore(baseStartTimeDate)) {
        baseEndTimeDate.add(1, 'day');
      }
      setEndTime(baseEndTimeDate);
    }
  };

  const updateStartEndTime = (time: moment) => {
    const baseStartTimeDate = moment.tz(time, props.selectedTimezone);

    setStartTime(baseStartTimeDate);
    if (window.featureFlags['update-time-picker']) {
      const startPlusDuration = moment
        .tz(time, props.selectedTimezone)
        .add(props.defaultDurationMinutes, 'minutes');
      setEndTime(startPlusDuration);
    }
  };

  const updateEndTime = (time: moment) => {
    const timeSource = moment.tz(time, props.selectedTimezone);

    // Take copy of startTime
    const baseEndTimeDate = moment.tz(startTime, props.selectedTimezone);

    // Apply the time from timeSource
    baseEndTimeDate.set({
      hour: timeSource.get('hour'),
      minute: timeSource.get('minute'),
    });

    // If is before startTime we add a day to the date.
    // So if startTime as 23:50 (11:50pm) and baseEndTimeDate were 01:00 (1am)
    // Then endTime should be considered the next day
    if (baseEndTimeDate.isBefore(startTime)) {
      baseEndTimeDate.add(1, 'day');
    }
    setEndTime(baseEndTimeDate);
  };

  const updateTimezone = (timezone: string) => {
    // We don't convert/offset the time to the new timezone
    // Instead if it was 3pm in original timezone, make the new start time 3pm in the new timezone

    const startTimeWithTimezone = moment().tz(timezone);

    startTimeWithTimezone.set({
      year: startTime.get('year'),
      month: startTime.get('month'),
      date: startTime.get('date'),
      hour: startTime.get('hour'),
      minute: startTime.get('minute'),
      second: 0,
      millisecond: 0,
    });
    setStartTime(startTimeWithTimezone);

    if (endTime) {
      const endTimeWithTimezone = moment().tz(timezone);

      endTimeWithTimezone.set({
        year: endTime.get('year'),
        month: endTime.get('month'),
        date: endTime.get('date'),
        hour: endTime.get('hour'),
        minute: endTime.get('minute'),
        second: 0,
        millisecond: 0,
      });
      setEndTime(endTimeWithTimezone);
    }

    props.onSelectTimezone(timezone);
  };

  const favouritedModalityOptions = useFavouritesGroup(
    'treatmentSessionModal.treatmentModalityOptionFavourites',
    props.treatmentModalityOptions,
    props.t
  );

  const modalityOptions = window.featureFlags[
    'favourite-treatments-rehab-sessions'
  ]
    ? favouritedModalityOptions
    : props.treatmentModalityOptions;

  const templateTreatmentAttributes: Array<TreatmentTemplate> = [
    {
      title: 'Low Back Pain',
      attributes: [
        {
          treatment_modality_id: 10,
          duration: 20,
          reason: 'general',
          issue_type: null,
          issue_id: null,
          treatment_body_areas_attributes: [],
          note: '',
        },
        {
          treatment_modality_id: 15,
          duration: null,
          reason: 'general',
          issue_type: null,
          issue_id: null,
          treatment_body_areas_attributes: [],
          note: '',
        },
      ],
    },
    {
      title: 'AC Joint Sprain',
      attributes: [
        {
          treatment_modality_id: 42,
          duration: 15,
          reason: 'general',
          issue_type: null,
          issue_id: null,
          treatment_body_areas_attributes: [],
          note: '',
        },
        {
          treatment_modality_id: 114,
          duration: null,
          reason: 'general',
          issue_type: null,
          issue_id: null,
          treatment_body_areas_attributes: [],
          note: '',
        },
        {
          treatment_modality_id: 224,
          duration: null,
          reason: 'general',
          issue_type: null,
          issue_id: null,
          treatment_body_areas_attributes: [],
          note: '',
        },
      ],
    },
  ];

  const reasonDropdownOptions = [
    {
      key_name: '{"reason":"general","issue_type":null,"issue_id":null}',
      name: props.t('General Treatment'),
      description: props.t('unrelated to issue'),
    },
    {
      key_name: '{"reason":"recovery","issue_type":null,"issue_id":null}',
      name: props.t('Recovery'),
      description: props.t('unrelated to issue'),
    },
    {
      key_name: '{"reason":"preparation","issue_type":null,"issue_id":null}',
      name: props.t('Preparation'),
      description: props.t('unrelated to issue'),
    },
    ...props.reasonOptions,
  ];

  const endTimePickerClasses = classNames('treatmentSessionModal__endTime', {
    'treatmentSessionModal__endTime--error': !endTimeValid,
  });

  const validateEndTime = (input: Object) => {
    let isEndTimeValid = true;
    if (input.attr('name') === 'end_time') {
      if (startTime && endTime && !endTime.isSame(startTime, 'minute')) {
        setEndTimeValid(true);
      } else {
        setEndTimeValid(false);
        isEndTimeValid = false;
      }
    }
    return isEndTimeValid;
  };

  const handleSelectBodyPart = (bodyArea, treatmentIndex) => {
    const selectedItem = props.bodyAreaOptions.find(
      (bao) => bao.id === bodyArea.id
    );
    const selectedItemIndex = props.bodyAreaOptions.findIndex(
      (bao) => bao.id === bodyArea.id
    );
    const reversedSlice = props.bodyAreaOptions
      .slice(0, selectedItemIndex)
      .reverse();
    const bodyPartParent = reversedSlice.find((item) => item.isGroupOption);
    const bodyPartParentId = selectedItem?.isGroupOption
      ? null
      : bodyPartParent?.id;
    props.onSelectBodyArea(bodyArea.id, bodyPartParentId, treatmentIndex);
  };

  const handleUnselectBodyPart = (bodyArea, treatmentIndex) => {
    const unselectedItem = props.bodyAreaOptions.find(
      (bao) => bao.id === bodyArea.id
    );

    if (unselectedItem?.isGroupOption) {
      const unselectedItemIndex = props.bodyAreaOptions.findIndex(
        (bao) => bao.id === bodyArea.id
      );
      const nextGroupOptionIndex = _findIndex(
        props.bodyAreaOptions,
        'isGroupOption',
        unselectedItemIndex + 1
      );
      const bodyAreaIds = props.bodyAreaOptions
        .slice(unselectedItemIndex, nextGroupOptionIndex)
        .map((bodyAreaOption) => bodyAreaOption.id);
      props.onUnselectParentBodyArea(bodyAreaIds, treatmentIndex);
    } else {
      props.onUnselectBodyArea(bodyArea.id, treatmentIndex);
    }
  };

  const getReasonValue = (treatment) => {
    let value = '';
    if (treatment.reason || treatment.issue_type || treatment.issue_id) {
      value = JSON.stringify({
        reason: treatment.reason,
        issue_type: treatment.issue_type,
        issue_id: treatment.issue_id,
      });
    }
    return value;
  };

  const getDuration = () => {
    let duration = '';
    if (startTime && endTime) {
      duration = moment.duration(endTime.diff(startTime)).asMinutes();
      return `${Math.round(duration)} mins`;
    }
    return duration;
  };

  const resetForm = () => {
    setTreatmentDate(getDefaultTreatmentDate());
    setStartTime(getDefaultStartTime());
    setEndTime(getDefaultEndTime());
  };

  const onSave = () => {
    if (endTimeValid || !checkInvalidFileTitles(props.attachedFiles)) {
      if (endTime) {
        props.onClickSaveTreatmentSession(
          startTime.utc().format(),
          endTime.utc().format()
        );
        resetForm();
      }
    }
  };

  const areGroupedDropdownsOptional = !!props.athletes;

  const getInputNamesToIgnore = () => {
    const ignore = ['duration', 'treatmentSession_textarea', 'filepond'];

    if (areGroupedDropdownsOptional) {
      ignore.push('grouped_dropdown');
    }

    return ignore;
  };

  return (
    <Modal
      isOpen={props.isOpen}
      close={() => {
        props.onClickCloseModal();
        resetForm();
      }}
      width={850}
    >
      <div className="treatmentSessionModal">
        <h5 className="treatmentSessionModal__modalTitle">
          {props.athlete && `${props.athlete.fullname} `}
          <span className="treatmentSessionModal__modalTitle--new">
            {props.t('New Treatment Session')}
          </span>
        </h5>
        <FormValidator
          successAction={onSave}
          inputNamesToIgnore={getInputNamesToIgnore()}
          customValidation={validateEndTime}
        >
          <div className="treatmentSessionModal__sessionDetailsSection">
            <div className="treatmentSessionModal__row">
              {props.athletes && (
                <div className="treatmentSessionModal__athlete">
                  <Dropdown
                    items={props.athletes || []}
                    onChange={(value) => {
                      if (props.athletes) {
                        const athlete = props.athletes.find(
                          (entry) => entry.id === value
                        );
                        if (athlete && props.onSelectAthlete) {
                          props.onSelectAthlete({
                            id: value,
                            fullname: athlete.name,
                          });
                        }
                      }
                    }}
                    value={props.athlete ? props.athlete.id : ''}
                    label={props.t('Athlete')}
                    searchable
                  />
                </div>
              )}
              <div className="treatmentSessionModal__practitioner">
                <Dropdown
                  items={props.users || []}
                  onChange={props.onSelectPractitioner}
                  value={props.selectedPractitioner || ''}
                  label={props.t('Practitioner')}
                  searchable
                />
              </div>
            </div>
            <div className="treatmentSessionModal__row treatmentSessionModal__dateTimeRow">
              <div className="treatmentSessionModal__date">
                <DatePicker
                  name="date"
                  label={props.t('Date')}
                  onDateChange={(newDate) => {
                    updateDate(moment(newDate));
                  }}
                  value={treatmentDate}
                />
              </div>
              <div className="treatmentSessionModal__startTime">
                <TimePicker
                  name="start_time"
                  value={startTime}
                  label={props.t('Start Time')}
                  onChange={updateStartEndTime}
                />
              </div>
              <span className="treatmentSessionModal__timeDivider" />
              <div className={endTimePickerClasses}>
                <TimePicker
                  name="end_time"
                  value={endTime}
                  label={props.t('End Time')}
                  onChange={updateEndTime}
                />
                {!endTimeValid && (
                  <span className="treatmentSessionModal__endTime--errorMessage">
                    {props.t('End Time cannot be the same as Start Time')}
                  </span>
                )}
                {endTime && !endTime.isSame(startTime, 'day') && (
                  <span className="treatmentSessionModal__endTime--warningMessage">
                    {props.t('Ends next day')}
                  </span>
                )}
              </div>
              <div className="treatmentSessionModal__timezone">
                <Dropdown
                  name="timezone"
                  label={props.t('Timezone')}
                  items={moment.tz.names().map((tzName) => ({
                    id: tzName,
                    title: tzName,
                  }))}
                  onChange={updateTimezone}
                  value={props.selectedTimezone}
                  searchable
                />
              </div>
            </div>
            <div className="treatmentSessionModal__row">
              <div className="treatmentSessionModal__title">
                <InputText
                  label={props.t('Title')}
                  onValidation={() => {}}
                  value="Treatment Note"
                  showRemainingChars={false}
                  showCharsLimitReached={false}
                  maxLength={255}
                  disabled
                  t={props.t}
                />
              </div>
              <div className="treatmentSessionModal__totalDuration">
                <label className="treatmentSessionModal__label">
                  {props.t('Total Duration')}
                </label>
                <span className="treatmentSessionModal__totalDuration--time">
                  {getDuration()}
                </span>
              </div>
            </div>
          </div>
          {props.athlete && (
            <div className="treatmentSessionModal__treatmentsSection">
              <label className="treatmentSessionModal__label">
                {props.t('Treatments')}
              </label>
              {window.featureFlags['treatment-and-rehab-templates'] && (
                <TooltipMenu
                  placement="bottom-end"
                  offset={[10, 10]}
                  menuItems={templateTreatmentAttributes.map((template) => {
                    return {
                      description: template.title,
                      onClick: () => {
                        props.onAddTreatmentAttributes(template.attributes);
                      },
                    };
                  })}
                  kitmanDesignSystem
                  tooltipTriggerElement={
                    <span className="treatmentSessionModal__templateButton">
                      <TextButton
                        text={props.t('Add template treatment')}
                        type="primary"
                        onClick={() => {}}
                        kitmanDesignSystem
                      />
                    </span>
                  }
                />
              )}
              {props.treatmentAttributes.map((treatment, index) => {
                return (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="treatmentSessionModal__treatment"
                  >
                    <div className="treatmentSessionModal__row treatmentSessionModal__row--no-margin">
                      <div className="treatmentSessionModal__treatmentNumber">
                        {index + 1}
                      </div>
                      <div className="treatmentSessionModal__modality">
                        <GroupedDropdown
                          label={props.t('Modality')}
                          options={modalityOptions}
                          onChange={(modality) => {
                            props.onSelectTreatmentModality(
                              modality.key_name,
                              index
                            );
                          }}
                          searchable
                          showGroupOptionSearchResults={
                            window.featureFlags[
                              'treatment-tracker-iteration-two'
                            ]
                          }
                          value={treatment.treatment_modality_id}
                        />
                        {areGroupedDropdownsOptional && (
                          <span className="dropdownWrapper__optional">
                            {props.t('Optional')}
                          </span>
                        )}
                      </div>
                      <div className="treatmentSessionModal__bodyArea">
                        <MultiSelectDropdown
                          hasSearch
                          invalid={false}
                          isOptional
                          label={props.t('Body Area')}
                          listItems={props.bodyAreaOptions}
                          onItemSelect={(bodyArea) => {
                            if (bodyArea.checked) {
                              handleSelectBodyPart(bodyArea, index);
                            } else {
                              handleUnselectBodyPart(bodyArea, index);
                            }
                          }}
                          selectedItems={JSON.stringify(
                            treatment.treatment_body_areas_attributes
                          )}
                        />
                      </div>
                      <div className="treatmentSessionModal__removeTreatment">
                        {props.treatmentAttributes.length > 1 ? (
                          <IconButton
                            icon="icon-close"
                            onClick={() =>
                              props.onRemoveTreatmentAttribute(index)
                            }
                            isSmall
                            isTransparent
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="treatmentSessionModal__row">
                      <div className="treatmentSessionModal__reason">
                        <GroupedDropdown
                          label={props.t('Reason')}
                          options={[...reasonDropdownOptions]}
                          onChange={(reason) =>
                            props.onSelectTreatmentReason(
                              reason.key_name,
                              index
                            )
                          }
                          searchable
                          value={getReasonValue(treatment)}
                        />
                        {areGroupedDropdownsOptional && (
                          <span className="dropdownWrapper__optional">
                            {props.t('Optional')}
                          </span>
                        )}
                      </div>
                      <div className="treatmentSessionModal__duration">
                        <InputNumeric
                          label={props.t('Duration')}
                          name="duration"
                          value={treatment.duration}
                          onChange={(value) =>
                            props.onSetTreatmentDuration(value, index)
                          }
                          descriptor={props.t('mins')}
                          optional
                        />
                      </div>
                    </div>
                    {window.featureFlags['treatment-tracker-iteration-two'] && (
                      <div className="treatmentSessionModal__row treatmentSessionModal__row--notes">
                        <Textarea
                          label={props.t('Notes')}
                          value={treatment.note || ''}
                          onChange={(value) =>
                            props.onUpdateTreatmentNoteAttribute(value, index)
                          }
                          name="treatmentSession_noteAttribute"
                          maxLimit={65535}
                          optionalText={null}
                          t={props.t}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="treatmentSessionModal__addTreatment">
                <IconButton
                  icon="icon-add"
                  onClick={() => props.onAddTreatmentAttribute()}
                />
              </div>
            </div>
          )}
          <div className="treatmentSessionModal__noteSection">
            <div className="treatmentSessionModal__row">
              <div className="treatmentSessionModal__noteText">
                {window.featureFlags['rich-text-editor'] ? (
                  <RichTextEditor
                    label={props.t('Note text')}
                    onChange={props.onUpdateTreatmentNoteRichText}
                    value={props.noteContent || ''}
                  />
                ) : (
                  <Textarea
                    label={props.t('Notes')}
                    value={props.noteContent}
                    onChange={(value) => props.onUpdateTreatmentNoteText(value)}
                    name="treatmentSession_textarea"
                    maxLimit={65535}
                    optionalText={null}
                    t={props.t}
                  />
                )}
              </div>
            </div>
            <div className="treatmentSessionModal__fileUpload">
              <FileUploadArea
                showActionButton={false}
                testIdPrefix="TreatmentSessionModal"
                isFileError={false}
                areaTitle={props.t('Attach File(s)')}
                updateFiles={props.onUpdateFiles}
                attachedFiles={props.attachedFiles}
              />
            </div>
          </div>
          <div className="treatmentSessionModal__footer">
            <TextButton
              text={props.t('Save')}
              type="primary"
              onClick={() => {}}
              isSubmit
            />
          </div>
        </FormValidator>
      </div>
    </Modal>
  );
}

TreatmentSessionModal.defaultProps = {
  defaultDurationMinutes: 30,
};

export default TreatmentSessionModal;
export const TreatmentSessionModalTranslated = withNamespaces()(
  TreatmentSessionModal
);
