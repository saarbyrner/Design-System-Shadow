// @flow
import { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import useFavouritesGroup from '@kitman/components/src/GroupedDropdown/hooks';
import {
  DatePicker,
  Dropdown,
  FileUploadField,
  FormValidator,
  GroupedDropdown,
  IconButton,
  InputNumeric,
  InputText,
  LegacyModal as Modal,
  RichTextEditor,
  Textarea,
  TextButton,
  TimePicker,
  TooltipMenu,
} from '@kitman/components';
import type { GroupedDropdownItem } from '@kitman/components/src/types';
import type { Attachment } from '@kitman/common/src/types/Annotation';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Athlete, RehabSessionAttribute, RehabTemplate } from './types';

type Props = {
  athlete: ?Athlete,
  athletes?: Array<{ id: number, name: string }>,
  attachedFiles: Array<?Attachment>,
  isOpen: boolean,
  noteContent: string,
  onAddRehabAttribute: Function,
  onClickCloseModal: Function,
  onClickSaveRehabSession: Function,
  onRemoveRehabAttribute: Function,
  onSelectAthlete?: Function,
  onSelectPractitioner: Function,
  onSelectTimezone: Function,
  onSelectRehabExercise: Function,
  onSelectRehabReason: Function,
  onSetRehabSets: Function,
  onSetRehabReps: Function,
  onUpdateFiles: Function,
  onUpdateRehabNoteText: Function,
  onUpdateRehabNoteAttribute: Function,
  reasonOptions: Array<GroupedDropdownItem>,
  selectedPractitioner: number,
  selectedTimezone: string,
  onUpdateRehabNoteRichText: Function,
  onAddRehabAttributes: Function,
  rehabAttributes: Array<RehabSessionAttribute>,
  rehabExerciseOptions: Array<GroupedDropdownItem>,
  users: Array<{ id: number, name: string }>,
  defaultDurationMinutes?: number,
};

const templateRehabAttributes: Array<RehabTemplate> = [
  {
    title: 'Ankle Sprain-Phase 1',
    attributes: [
      {
        rehab_exercise_id: 1,
        sets: 2,
        reps: 15,
        weight: null,
        reason: 'general',
        issue_type: null,
        issue_id: null,
        note: '',
      },
      {
        rehab_exercise_id: 2,
        sets: 2,
        reps: 30,
        weight: null,
        reason: 'general',
        issue_type: null,
        issue_id: null,
        note: '',
      },
      {
        rehab_exercise_id: 3,
        sets: 1,
        reps: 15,
        weight: null,
        reason: 'general',
        issue_type: null,
        issue_id: null,
        note: '',
      },
    ],
  },
  {
    title: 'ACL-PostOp - Phase 2',
    attributes: [
      {
        rehab_exercise_id: 4,
        sets: 1,
        reps: 10,
        weight: null,
        reason: 'general',
        issue_type: null,
        issue_id: null,
        note: '',
      },
      {
        rehab_exercise_id: 5,
        sets: 3,
        reps: 12,
        weight: null,
        reason: 'general',
        issue_type: null,
        issue_id: null,
        note: '',
      },
      {
        rehab_exercise_id: 6,
        sets: 1,
        reps: 20,
        weight: null,
        reason: 'general',
        issue_type: null,
        issue_id: null,
        note: '',
      },
    ],
  },
];

const formatDate = (date: moment): string => {
  return date.format('YYYY-MM-DD');
};

function RehabSessionModal(props: I18nProps<Props>) {
  const getDefaultRehabDate = () =>
    formatDate(moment().tz(props.selectedTimezone));

  const getDefaultStartTime = () =>
    moment().tz(props.selectedTimezone).startOf('hour');

  const getDefaultEndTime = () => {
    if (!window.featureFlags['update-time-picker']) {
      return null;
    }
    return getDefaultStartTime().add(props.defaultDurationMinutes, 'minutes');
  };

  const [rehabDate, setRehabDate] = useState(getDefaultRehabDate);
  const [startTime, setStartTime] = useState(getDefaultStartTime);
  const [endTime, setEndTime] = useState(getDefaultEndTime);
  const [endTimeValid, setEndTimeValid] = useState(true);

  const updateDate = (date: moment) => {
    setRehabDate(formatDate(date));
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

  const favouriteExerciseOptions = useFavouritesGroup(
    'rehabSessionModal.exerciseOptionFavourites',
    props.rehabExerciseOptions,
    props.t
  );

  const exerciseOptions = window.featureFlags[
    'favourite-treatments-rehab-sessions'
  ]
    ? favouriteExerciseOptions
    : props.rehabExerciseOptions;

  const reasonDropdownOptions = [
    {
      key_name: '{"reason":"general","issue_type":null,"issue_id":null}',
      name: 'General Rehab',
      description: 'unrelated to issue',
    },
    {
      key_name: '{"reason":"recovery","issue_type":null,"issue_id":null}',
      name: 'Recovery',
      description: 'unrelated to issue',
    },
    {
      key_name: '{"reason":"preparation","issue_type":null,"issue_id":null}',
      name: 'Preparation',
      description: 'unrelated to issue',
    },
    ...props.reasonOptions,
  ];

  const endTimePickerClasses = classNames('rehabSessionModal__endTime', {
    'rehabSessionModal__endTime--error': !endTimeValid,
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

  const getReasonValue = (rehab) => {
    let value = '';
    if (rehab.reason || rehab.issue_type || rehab.issue_id) {
      value = JSON.stringify({
        reason: rehab.reason,
        issue_type: rehab.issue_type,
        issue_id: rehab.issue_id,
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
    setRehabDate(getDefaultRehabDate());
    setStartTime(getDefaultStartTime());
    setEndTime(getDefaultEndTime());
  };

  const onSave = () => {
    if (endTimeValid) {
      if (endTime) {
        props.onClickSaveRehabSession(
          startTime.utc().format(),
          endTime.utc().format()
        );
        resetForm();
      }
    }
  };

  const areGroupedDropdownsOptional = !!props.athletes;

  const getInputNamesToIgnore = () => {
    const ignore = [
      'sets',
      'reps',
      'rehabSession_noteAttribute',
      'rehabSession_textarea',
      'filepond',
    ];

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
      <div className="rehabSessionModal">
        <h5 className="rehabSessionModal__modalTitle">
          {props.athlete && `${props.athlete.fullname} `}
          <span className="rehabSessionModal__modalTitle--new">
            {props.t('New Rehab Session')}
          </span>
        </h5>
        <FormValidator
          successAction={() => onSave()}
          inputNamesToIgnore={getInputNamesToIgnore()}
          customValidation={validateEndTime}
        >
          <div className="rehabSessionModal__sessionDetailsSection">
            <div className="rehabSessionModal__row">
              {props.athletes && (
                <div className="rehabSessionModal__athlete">
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
              <div className="rehabSessionModal__practitioner">
                <Dropdown
                  items={props.users || []}
                  onChange={props.onSelectPractitioner}
                  value={props.selectedPractitioner || ''}
                  label={props.t('Practitioner')}
                  searchable
                />
              </div>
            </div>
            <div className="rehabSessionModal__row rehabSessionModal__dateTimeRow">
              <div className="rehabSessionModal__date">
                <DatePicker
                  name="date"
                  label={props.t('Date')}
                  onDateChange={(newDate) => {
                    updateDate(moment(newDate));
                  }}
                  value={rehabDate}
                />
              </div>
              <div className="rehabSessionModal__startTime">
                <TimePicker
                  name="start_time"
                  value={startTime}
                  label={props.t('Start Time')}
                  onChange={updateStartEndTime}
                />
              </div>
              <span className="rehabSessionModal__timeDivider" />
              <div className={endTimePickerClasses}>
                <TimePicker
                  name="end_time"
                  value={endTime}
                  label={props.t('End Time')}
                  onChange={updateEndTime}
                />
                {!endTimeValid && (
                  <span className="rehabSessionModal__endTime--errorMessage">
                    {props.t('End Time cannot be the same as Start Time')}
                  </span>
                )}
                {endTime && !endTime.isSame(startTime, 'day') && (
                  <span className="rehabSessionModal__endTime--warningMessage">
                    {props.t('Ends next day')}
                  </span>
                )}
              </div>
              <div className="rehabSessionModal__timezone">
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
            <div className="rehabSessionModal__row">
              <div className="rehabSessionModal__title">
                <InputText
                  label={props.t('Title')}
                  onValidation={() => {}}
                  value={props.t('Rehab Note')}
                  showRemainingChars={false}
                  showCharsLimitReached={false}
                  maxLength={255}
                  disabled
                  t={props.t}
                />
              </div>
              <div className="rehabSessionModal__totalDuration">
                <label className="rehabSessionModal__label">
                  {props.t('Total Duration')}
                </label>
                <span className="rehabSessionModal__totalDuration--time">
                  {getDuration()}
                </span>
              </div>
            </div>
          </div>
          {props.athlete && (
            <div className="rehabSessionModal__rehabsSection">
              <label className="rehabSessionModal__label">
                {props.t('Exercises')}
              </label>
              {window.featureFlags['treatment-and-rehab-templates'] && (
                <TooltipMenu
                  placement="bottom-end"
                  offset={[10, 10]}
                  menuItems={templateRehabAttributes.map((template) => {
                    return {
                      description: template.title,
                      onClick: () => {
                        props.onAddRehabAttributes(template.attributes);
                      },
                    };
                  })}
                  kitmanDesignSystem
                  tooltipTriggerElement={
                    <span className="rehabSessionModal__templateButton">
                      <TextButton
                        text={props.t('Add template exercises')}
                        type="primary"
                        onClick={() => {}}
                        kitmanDesignSystem
                      />
                    </span>
                  }
                />
              )}
              {props.rehabAttributes.map((rehab, index) => {
                return (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="rehabSessionModal__rehab"
                  >
                    <div className="rehabSessionModal__row rehabSessionModal__row--no-margin">
                      <div className="rehabSessionModal__rehabNumber">
                        {index + 1}
                      </div>
                      <div className="rehabSessionModal__exercise">
                        <GroupedDropdown
                          label={props.t('Exercise')}
                          options={exerciseOptions}
                          onChange={(exercise) => {
                            props.onSelectRehabExercise(
                              exercise.key_name,
                              index
                            );
                          }}
                          searchable
                          value={rehab.rehab_exercise_id}
                        />
                        {areGroupedDropdownsOptional && (
                          <span className="dropdownWrapper__optional">
                            {props.t('Optional')}
                          </span>
                        )}
                      </div>
                      <div className="rehabSessionModal__sets">
                        <InputNumeric
                          label={props.t('Sets')}
                          name="sets"
                          value={rehab.sets}
                          onChange={(value) =>
                            props.onSetRehabSets(value, index)
                          }
                          descriptor={props.t('sets')}
                          optional
                        />
                      </div>
                      <div className="rehabSessionModal__reps">
                        <InputNumeric
                          label={props.t('Reps')}
                          name="reps"
                          value={rehab.reps}
                          onChange={(value) =>
                            props.onSetRehabReps(value, index)
                          }
                          descriptor={props.t('reps')}
                          optional
                        />
                      </div>
                      <div className="rehabSessionModal__removeRehab">
                        {props.rehabAttributes.length > 1 ? (
                          <IconButton
                            icon="icon-close"
                            onClick={() => props.onRemoveRehabAttribute(index)}
                            isSmall
                            isTransparent
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="rehabSessionModal__row">
                      <div className="rehabSessionModal__reason">
                        <GroupedDropdown
                          label={props.t('Reason')}
                          options={[...reasonDropdownOptions]}
                          onChange={(reason) =>
                            props.onSelectRehabReason(reason.key_name, index)
                          }
                          searchable
                          value={getReasonValue(rehab)}
                          name="reason"
                        />
                        {areGroupedDropdownsOptional && (
                          <span className="dropdownWrapper__optional">
                            {props.t('Optional')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="rehabSessionModal__row rehabSessionModal__row--notes">
                      <Textarea
                        label={props.t('Notes')}
                        value={rehab.note || ''}
                        onChange={(value) =>
                          props.onUpdateRehabNoteAttribute(value, index)
                        }
                        name="rehabSession_noteAttribute"
                        maxLimit={65535}
                        optionalText={null}
                        t={props.t}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="rehabSessionModal__addRehab">
                <IconButton
                  icon="icon-add"
                  onClick={() => props.onAddRehabAttribute()}
                />
              </div>
            </div>
          )}
          <div className="rehabSessionModal__noteSection">
            <div className="rehabSessionModal__row">
              <div className="rehabSessionModal__noteText">
                {window.featureFlags['rich-text-editor'] ? (
                  <RichTextEditor
                    label={props.t('Note text')}
                    onChange={props.onUpdateRehabNoteRichText}
                    value={props.noteContent || ''}
                  />
                ) : (
                  <Textarea
                    label={props.t('Notes')}
                    value={props.noteContent}
                    onChange={(value) => props.onUpdateRehabNoteText(value)}
                    name="rehabSession_textarea"
                    maxLimit={65535}
                    optionalText={null}
                    t={props.t}
                  />
                )}
              </div>
            </div>
            <div className="rehabSessionModal__row">
              <div className="rehabSessionModal__fileUpload">
                <label className="rehabSessionModal__label">
                  {props.t('Attach File(s)')}
                </label>
                <FileUploadField
                  updateFiles={(files) => props.onUpdateFiles(files)}
                  files={props.attachedFiles}
                  removeUploadedFile={() => {}} // cant delete files
                />
              </div>
            </div>
          </div>
          <div className="rehabSessionModal__footer">
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

RehabSessionModal.defaultProps = {
  defaultDurationMinutes: 30,
};

export default RehabSessionModal;
export const RehabSessionModalTranslated = withNamespaces()(RehabSessionModal);
