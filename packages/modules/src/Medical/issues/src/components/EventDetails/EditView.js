// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import type { EventType } from '@kitman/common/src/types/Event';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { InjuryMechanisms } from '@kitman/services/src/services/medical/getInjuryMechanisms';
import {
  DatePicker,
  SegmentedControl,
  Select,
  SelectAndFreetext,
  Textarea,
  TimePicker,
  InputNumeric,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import { getSelectOptions } from '@kitman/components/src/SelectAndFreetext';
import type { ActivityGroups } from '@kitman/services/src/services/medical/getActivityGroups';
import type { PositionGroups } from '@kitman/services/src/services/getPositionGroups';
import type { IssueContactTypes } from '@kitman/services/src/services/medical/getIssueContactTypes';
import type { PresentationTypes } from '@kitman/services/src/services/medical/getPresentationTypes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  OrganisationStatus,
  Period,
} from '@kitman/modules/src/Medical/shared/types/medical/Constraints';
import { isOtherClassedEvent } from '@kitman/modules/src/Medical/issues/src/components/EventDetails/Utils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import {
  getGameAndTrainingOptions,
  getPositionOptions,
  getActivityGroupOptions,
  getSortedEventOptions,
  mapParentAndChildrenToOptions,
  checkOptionRequiresTextField,
  isChronicIssue,
  getAdditionalEventOptions,
} from '../../../../shared/utils';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import type { DetailedGameAndTrainingOptions } from '../../../../shared/types/medical/GameAndTrainingOptions';
import type { Details } from '.';
import style, { editConditionalStyles } from './styles/editView';
import AthleteConstraints from '../../../../shared/components/AthleteConstraints';

type Props = {
  examinationDate: string,
  reportedDate: string,
  gameAndTrainingOptions: DetailedGameAndTrainingOptions,
  activityGroups: ActivityGroups,
  positionGroups: PositionGroups,
  injuryMechanisms: InjuryMechanisms,
  getFieldLabel: Function,
  details: Details,
  onSelectEvent: (eventId: number | string, eventType: EventType) => void,
  onSelectIssueDate: (date: string) => void,
  onSelectDetail: (detailType: string, detailValue: string | number) => void,
  organisation: Organisation,
  isValidationCheckAllowed: boolean,
  isRequestPending: boolean,
  isFieldVisible: Function,
  isGameOrTraining: boolean,
  issueContactTypes: IssueContactTypes,
  presentationTypes: PresentationTypes,
};

const localTimezone = document.getElementsByTagName('body')[0].dataset.timezone;

export const determineMaxIssueDate = (
  examinationDate: string,
  reportedDate: string,
  organisationStatus: OrganisationStatus,
  lastActivePeriod: Period
): ?string => {
  if (!window.featureFlags['medical-allow-update-injury-date']) {
    // maintain existing behaviour
    return examinationDate;
  }

  if (window.featureFlags['examination-date']) {
    return examinationDate || reportedDate;
  }

  if (organisationStatus === 'PAST_ATHLETE') {
    return lastActivePeriod.end;
  }

  return undefined;
};

const EditView = (props: I18nProps<Props>) => {
  const { issueType, issue, isChronicIssue: isChronic } = useIssue();

  const codingSystemIsCI =
    props.organisation?.coding_system_key ===
    codingSystemKeys.CLINICAL_IMPRESSIONS;

  const showPlayerMovementDatePicker =
    window.featureFlags['player-movement-entity-injury'] &&
    window.featureFlags['player-movement-entity-illness'] &&
    window.featureFlags['player-movement-aware-datepicker'];

  const shouldRenderDateOfInjuryDatePicker =
    window.featureFlags['pm-editing-examination-and-date-of-injury'] !== true ||
    codingSystemIsCI;
  const isInjury = issueType === 'Injury';
  const isNFLInjuryFlowFields = window.featureFlags['nfl-injury-flow-fields'];

  const eventOptions = useMemo(() => {
    // Filter any entries that don't have a date
    // NOTE: This will remove "Other", "Unlisted Game" and "Unlisted Training Session" entries

    const options = getSortedEventOptions(
      getGameAndTrainingOptions(
        {
          games: props.gameAndTrainingOptions.games.filter(
            (game) => game.game_date
          ),
          training_sessions:
            props.gameAndTrainingOptions.training_sessions.filter(
              (session) => session.training_date
            ),
        },

        isChronicIssue(issueType)
      )
    );
    // Add other items manually, since they don't have a date property
    options.push(
      ...getAdditionalEventOptions(
        props.gameAndTrainingOptions.other_events || []
      )
    );

    return options;
  }, [props.gameAndTrainingOptions, issueType]);
  const mechanismOptions = useMemo(
    () =>
      getActivityGroupOptions(props.activityGroups, props.details.eventType),
    [props.activityGroups, props.details.eventType]
  );
  const positionOptions = useMemo(
    () => getPositionOptions(props.positionGroups),
    [props.positionGroups]
  );

  const injuryMechanismOptions = mapParentAndChildrenToOptions(
    props.injuryMechanisms
  );
  const presentationOptions = getSelectOptions(props.presentationTypes);

  const getEventTypeDetails = () => {
    if (!props.details.eventType) {
      return null;
    }

    if (isOtherClassedEvent(props.details.eventType)) {
      return `other_${props.details.eventType.toLocaleLowerCase()}`;
    }

    return props.details.eventId
      ? `${props.details.eventId}_${props.details.eventType}`
      : `unlisted_${props.details.eventType.toLowerCase()}`;
  };

  const onChangeEvent = (value) => {
    const [id, type]: [string, EventType] = value.split('_');
    const isNonListedEvent = id === 'unlisted' || id === 'other';
    // with non listed events, it is needed to send an empty string as event id
    if (isNonListedEvent) {
      props.onSelectEvent('', type);
      return;
    }

    props.onSelectEvent(+id, type);
  };

  const getTimeValue = () => {
    const difference = moment(props.details.issueDate).diff(
      moment(props.details.issueDate).startOf('day')
    );

    // Assuming a value at the start of the day is no time set
    if (difference === 0) {
      return null;
    }

    return moment.tz(props.details.issueDate, localTimezone);
  };

  const onDateOfEventFieldChange = (selectedDate) => {
    let newDate = selectedDate;
    const timeValue = getTimeValue();

    // If the time of value has been set, we make sure its maintained in the new date
    if (timeValue !== null) {
      const momentSelectedDate = moment(selectedDate);
      momentSelectedDate.set({
        hour: timeValue.get('hour'),
        minute: timeValue.get('minute'),
        second: timeValue.get('second'),
        millisecond: timeValue.get('millisecond'),
      });

      newDate = momentSelectedDate.toDate();
    }

    props.onSelectIssueDate(newDate.toISOString());

    /*
     * If the new date of injury is after the report date, we must also update
     * the reported date. The injury cannot be reported before it occurred
     */
    if (moment(newDate).isAfter(moment(props.details.reportedDate))) {
      props.onSelectDetail('reportedDate', newDate.toISOString());
    }

    /*
     * If the new date of injury is after the examination date, we must also update
     * the examination date. The injury cannot be examined before it occurred
     */
    if (
      window.featureFlags['medical-allow-update-injury-date'] &&
      window.featureFlags['examination-date'] &&
      props.examinationDate &&
      moment(newDate).isAfter(moment(props.examinationDate))
    ) {
      props.onSelectDetail('examinationDate', newDate.toISOString());
    }
  };

  const renderDateOfEventField = () => {
    const athleteId = issue.athlete_id;

    return (
      <div css={style.issueDate}>
        <AthleteConstraints athleteId={athleteId}>
          {({ isLoading, organisationStatus, lastActivePeriod }) => (
            <DatePicker
              label={
                isInjury
                  ? props.t('Date of injury')
                  : props.t('Date of illness')
              }
              name={isInjury ? 'injuryDate' : 'illnessDate'}
              onDateChange={onDateOfEventFieldChange}
              value={props.details.issueDate}
              minDate={lastActivePeriod.start}
              maxDate={determineMaxIssueDate(
                props.examinationDate,
                props.reportedDate,
                organisationStatus,
                lastActivePeriod
              )}
              disableFutureDates
              kitmanDesignSystem
              disabled={isLoading || props.isRequestPending}
            />
          )}
        </AthleteConstraints>
      </div>
    );
  };

  const renderDateOfEventFieldNew = () => {
    return (
      <MovementAwareDatePicker
        athleteId={issue.athlete_id}
        value={moment(props.details.issueDate)}
        onChange={onDateOfEventFieldChange}
        inputLabel={
          isInjury ? props.t('Date of injury') : props.t('Date of illness')
        }
        name={isInjury ? 'injuryDate' : 'illnessDate'}
        disabled={props.isRequestPending}
        disableFuture
        kitmanDesignSystem
      />
    );
  };

  const renderReportedDateField = () => {
    const athleteId = issue.athlete_id;

    return (
      <div css={style.issueDate}>
        <AthleteConstraints athleteId={athleteId}>
          {({ isLoading, organisationStatus, lastActivePeriod }) => (
            <DatePicker
              label={props.t('Reported date')}
              name="reportedDate"
              onDateChange={(date) =>
                props.onSelectDetail('reportedDate', date.toISOString())
              }
              value={props.details.reportedDate}
              minDate={props.details.issueDate}
              maxDate={
                organisationStatus === 'PAST_ATHLETE'
                  ? lastActivePeriod.end
                  : null
              }
              disableFutureDates
              kitmanDesignSystem
              disabled={props.isRequestPending || isLoading}
              displayValidationText
              invalid={
                props.isValidationCheckAllowed && !props.details.reportedDate
              }
            />
          )}
        </AthleteConstraints>
      </div>
    );
  };

  const renderReportedDateFieldNew = () => {
    const minDate = props.details.issueDate;

    return (
      <MovementAwareDatePicker
        athleteId={issue.athlete_id}
        value={moment(props.details.reportedDate)}
        onChange={(date) =>
          props.onSelectDetail('reportedDate', date.toISOString())
        }
        name="reportedDate"
        inputLabel={props.t('Reported date')}
        disabled={props.isRequestPending}
        isInvalid={
          props.isValidationCheckAllowed && !props.details.reportedDate
        }
        minDate={minDate && moment(minDate)}
        disableFuture
        kitmanDesignSystem
      />
    );
  };

  const renderPresentationTypeField = () => (
    <SelectAndFreetext
      selectLabel={props.t('Presentation')}
      textareaLabel={props.t('If Other Presentation, Specify:')}
      selectedField={props.details.presentationTypeId}
      onSelectedField={(presentationTypeId) =>
        props.onSelectDetail('presentationTypeId', presentationTypeId)
      }
      currentFreeText={
        props.details.presentationTypeFreeText
          ? props.details.presentationTypeFreeText
          : ''
      }
      onUpdateFreeText={(presentationFreetext) =>
        props.onSelectDetail('presentationTypeFreeText', presentationFreetext)
      }
      invalidFields={
        props.isValidationCheckAllowed && !props.details.presentationTypeId
      }
      options={presentationOptions}
      featureFlag={window.featureFlags['nfl-injury-flow-fields']}
      disabled={!props.presentationTypes.length}
      selectContainerStyle={style.freeTextSelectionsLong}
      textAreaContainerStyle={style.freeTextValuesLong}
      displayValidationText
    />
  );

  const renderIssueContactTypeField = () => (
    <SelectAndFreetext
      selectedField={props.details.issueContactType}
      selectLabel={props.t('Contact Type')}
      textareaLabel={props.t('If Contact With Other, Specify:')}
      options={mapParentAndChildrenToOptions(props.issueContactTypes)}
      onSelectedField={(issueContactType) =>
        props.onSelectDetail('issueContactType', issueContactType)
      }
      currentFreeText={
        props.details.issueContactFreetext
          ? props.details.issueContactFreetext
          : ''
      }
      onUpdateFreeText={(issueContactFreetext) =>
        props.onSelectDetail('issueContactFreetext', issueContactFreetext)
      }
      invalidFields={
        props.isValidationCheckAllowed && !props.details.issueContactType
      }
      featureFlag={window.featureFlags['nfl-injury-flow-fields']}
      groupBy="submenu"
      disabled={!props.issueContactTypes.length}
      selectContainerStyle={style.freeTextSelectionsLong}
      textAreaContainerStyle={style.freeTextValuesLong}
      displayValidationText
    />
  );

  const renderInjuryMechanismField = () => (
    <SelectAndFreetext
      selectLabel={props.getFieldLabel('injury_mechanism')}
      textareaLabel={props.t('If Other Player Activity, Specify:')}
      selectedField={props.details.injuryMechanism}
      onSelectedField={(injuryMechanism) =>
        props.onSelectDetail('injuryMechanism', injuryMechanism)
      }
      currentFreeText={
        props.details.injuryMechanismFreetext
          ? props.details.injuryMechanismFreetext
          : ''
      }
      onUpdateFreeText={(injuryMechanismFreetext) =>
        props.onSelectDetail('injuryMechanismFreetext', injuryMechanismFreetext)
      }
      invalidFields={
        props.isValidationCheckAllowed && !props.details.injuryMechanism
      }
      options={injuryMechanismOptions}
      featureFlag={window.featureFlags['nfl-injury-flow-fields']}
      disabled={!props.injuryMechanisms.length}
      groupBy="submenu"
      selectContainerStyle={style.freeTextSelections}
      textAreaContainerStyle={style.freeTextValues}
      displayValidationText
    />
  );

  const renderPrimaryMechanismField = () => (
    <SelectAndFreetext
      selectLabel={props.t('Mechanism')}
      textareaLabel={props.t('If Other Mechanism, Specify:')}
      selectedField={props.details.mechanismId}
      onSelectedField={(mechanismId) =>
        props.onSelectDetail('mechanismId', mechanismId)
      }
      currentFreeText={
        props.details.mechanismFreetext ? props.details.mechanismFreetext : ''
      }
      onUpdateFreeText={(mechanismFreetext) =>
        props.onSelectDetail('mechanismFreetext', mechanismFreetext)
      }
      invalidFields={
        props.isValidationCheckAllowed && !props.details.mechanismId
      }
      disabled={props.isRequestPending}
      options={mechanismOptions}
      featureFlag={window.featureFlags['nfl-injury-flow-fields']}
      selectContainerStyle={style.freeTextSelections}
      textAreaContainerStyle={style.freeTextValues}
      displayValidationText
    />
  );

  const renderPositionField = () => (
    <div
      css={
        editConditionalStyles(
          checkOptionRequiresTextField(
            mechanismOptions,
            props.details.mechanismId ? props.details.mechanismId : ''
          )
        ).freetextPresent
      }
    >
      <Select
        appendToBody
        value={props.details.positionId}
        label={props.t('Position')}
        options={positionOptions}
        onChange={(positionId) =>
          props.onSelectDetail('positionId', positionId)
        }
        invalid={props.isValidationCheckAllowed && !props.details.positionId}
        isDisabled={props.isRequestPending}
        displayValidationText
      />
    </div>
  );

  const renderTimeOfInjury = () => (
    <div css={style.freeTextSelections}>
      {window.featureFlags['injury-onset-time-selector'] ? (
        <TimePicker
          value={getTimeValue()}
          label={props.t('Time of injury')}
          onChange={(time) => {
            const newDate = time.clone();

            // if the initial date is null, this means that there was no time
            // on the occurrence date and the time passed from the TimePicker
            // is today. In this case we need to get the date month and year from
            // the occurrence date and assign them to the new time value
            if (getTimeValue() === null) {
              const issueDate = moment(props.details.issueDate);

              newDate.set({
                year: issueDate.get('year'),
                month: issueDate.get('month'),
                date: issueDate.get('date'),
              });
            }

            props.onSelectDetail(
              'issueDate',
              newDate.format(DateFormatter.dateTransferFormat)
            );
          }}
          disabled={props.isRequestPending}
          kitmanDesignSystem
          invalid={props.isValidationCheckAllowed && !getTimeValue()}
          displayValidationText
        />
      ) : (
        <InputNumeric
          kitmanDesignSystem
          label={props.t('Time of injury')}
          name="injuryTime"
          onChange={(injuryTimeId) =>
            props.onSelectDetail('injuryTime', injuryTimeId)
          }
          value={props.details.injuryTime}
          disabled={props.isRequestPending}
          isInvalid={
            props.isValidationCheckAllowed && !props.details.injuryTime
          }
          displayValidationText
        />
      )}
    </div>
  );

  const renderNFLView = () => (
    <>
      {props.isFieldVisible('presentation_type') &&
        renderPresentationTypeField()}
      {props.isFieldVisible('issue_contact_type') &&
        renderIssueContactTypeField()}
      {props.isFieldVisible('injury_mechanism') && renderInjuryMechanismField()}
      <div css={style.mechanismDescription}>
        <Textarea
          value={props.details.mechanismDescription}
          appendToBody
          label={props.t(
            'Additional description of injury mechanism/circumstances'
          )}
          onChange={(text) =>
            props.onSelectDetail('mechanismDescription', text)
          }
          isDisabled={props.isRequestPending}
          kitmanDesignSystem
          optionalText={props.t('Optional')}
        />
      </div>
    </>
  );

  const renderNonNFLView = () => (
    <>
      {props.isFieldVisible('session_completed') && (
        <div css={style.sessionStatus}>
          <SegmentedControl
            selectedButton={props.details.sessionStatus}
            buttons={[
              {
                name: props.t('Yes'),
                value: 'yes',
                isDisabled: props.isRequestPending,
              },
              {
                name: props.t('No'),
                value: 'no',
                isDisabled: props.isRequestPending,
              },
            ]}
            label={props.t('Session completed')}
            maxWidth={400}
            onClickButton={(sessionStatusId) =>
              props.onSelectDetail('sessionStatus', sessionStatusId)
            }
          />
        </div>
      )}
      {renderTimeOfInjury()}
    </>
  );

  const renderDatePickerComponent = () => {
    if (shouldRenderDateOfInjuryDatePicker) {
      if (showPlayerMovementDatePicker) {
        return renderDateOfEventFieldNew();
      }
      return renderDateOfEventField();
    }
    return null;
  };

  return (
    <div css={style.viewWrapper}>
      {renderDatePickerComponent()}

      {isNFLInjuryFlowFields &&
        props.isFieldVisible('reported_date') &&
        (showPlayerMovementDatePicker
          ? renderReportedDateFieldNew()
          : renderReportedDateField())}

      {(!isChronic ||
        !window.featureFlags['chronic-conditions-updated-fields']) && (
        <>
          <div css={style.event}>
            <Select
              appendToBody
              value={getEventTypeDetails()}
              label={props.t('Event')}
              options={eventOptions}
              onChange={onChangeEvent}
              invalid={props.isValidationCheckAllowed && !getEventTypeDetails()}
              isDisabled={props.isRequestPending}
              displayValidationText
            />
          </div>
          {isInjury && props.isGameOrTraining && (
            <>
              {renderPrimaryMechanismField()}
              {renderPositionField()}
              {isNFLInjuryFlowFields ? renderNFLView() : renderNonNFLView()}
            </>
          )}
        </>
      )}
    </div>
  );
};

export const EditViewTranslated = withNamespaces()(EditView);
export default EditView;
