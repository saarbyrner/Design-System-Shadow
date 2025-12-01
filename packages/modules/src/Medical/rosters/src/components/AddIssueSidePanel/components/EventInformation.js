// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { EventType } from '@kitman/common/src/types/Event';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import {
  useGetPresentationTypesQuery,
  useGetIssueContactTypesQuery,
  useGetInjuryMechanismsQuery,
  useGetPermittedSquadsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import type { InjuryMechanisms } from '@kitman/services/src/services/medical/getInjuryMechanisms';
import type { IssueContactTypes } from '@kitman/services/src/services/medical/getIssueContactTypes';
import {
  DatePicker,
  SegmentedControl,
  InputNumeric,
  Select,
  SelectAndFreetext,
  Textarea,
  TimePicker,
} from '@kitman/components';
import { Alert } from '@kitman/playbook/components';
import SquadSelector from '@kitman/modules/src/Medical/shared/components/SquadSelector';

import type {
  AthleteIDProps,
  SquadProps,
} from '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/components/InitialInformation';
import { getSelectOptions } from '@kitman/components/src/SelectAndFreetext';
import type {
  DetailedGameEventOption,
  DetailedTrainingSessionEventOption,
} from '@kitman/modules/src/Medical/shared/types';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../AddIssueSidePanelStyle';
import { mapParentAndChildrenToOptions } from '../../../../../shared/utils';

type CommonProps = {
  fieldLabel: Function,
  isVisible: boolean,
  isDisabled?: ?boolean,
  isInvalid: boolean,
  textareaLabel?: ?string,
};

type OccurrenceDateProps = CommonProps & {
  selectedDiagnosisDate: string,
  onSelectDiagnosisDate: Function,
};

type GameIDProps = CommonProps & {
  value: string,
  isOptional: boolean,
  options: Array<Object>,
  gameOptions: Array<DetailedGameEventOption>,
  trainingOptions: Array<DetailedTrainingSessionEventOption>,
  onSelectEvent: Function,
};

type ActivityIDProps = CommonProps & {
  options: Array<Object>,
  value: string,
  onSelectActivity: Function,
  freeText: string,
  onFreetextChange: (string) => void,
  isOtherVisible: boolean,
};

type PositionWhenInjuredProps = CommonProps & {
  value: string,
  options: Array<Object>,
  onSelectPositionWhenInjured: Function,
};

type SessionCompletedProps = CommonProps & {
  onSelect: Function,
  selectedSessionCompleted: string,
};

type TimeOfInjuryProps = CommonProps & {
  timeOfInjury: string,
  onSetTimeOfInjury: Function,
};

type mechanismDescriptionProps = CommonProps & {
  onChange: Function,
  value: string,
};

type PresentationTypeProps = CommonProps & {
  onSelect: Function,
  onUpdateFreeText: Function,
  selectedPresentationTypeFreeText: string,
  value: string,
};
type IssueContactTypeProps = CommonProps & {
  onSelect: Function,
  onUpdateFreeText: Function,
  value: string,
  selectedIssueContactFreeText: string,
};

type InjuryMechanismProps = CommonProps & {
  onSelect: Function,
  value: string,
  freeText: string,
  onFreetextChange: (string) => void,
};

type Props = {
  selectedEvent: ?string,
  occurrenceDateProps: OccurrenceDateProps,
  gameIDProps: GameIDProps,
  activityIDProps: ActivityIDProps,
  positionWhenInjuredProps: PositionWhenInjuredProps,
  athleteIDProps: AthleteIDProps,
  squadProps: SquadProps,
  isGameOrTraining: boolean,
  sessionCompletedProps: SessionCompletedProps,
  timeOfInjuryProps: TimeOfInjuryProps,
  mechanismDescriptionProps: mechanismDescriptionProps,
  presentationTypeProps: PresentationTypeProps,
  issueContactTypeProps: IssueContactTypeProps,
  injuryMechanismProps: InjuryMechanismProps,
  isChronicIssue: boolean,
  isChronicCondition: boolean,
  issueIsAContinuation: boolean,
  examinationDate: string,
  earliestPermittedOnsetDate: string,
  eventType: EventType,
};

const localTimezone = document.getElementsByTagName('body')[0].dataset.timezone;

const EventInformation = (props: I18nProps<Props>) => {
  const { data: presentationTypes = [] } = useGetPresentationTypesQuery(null, {
    skip: !props.presentationTypeProps.isVisible,
  });
  const { data: issueContactTypes = [] }: { data: IssueContactTypes } =
    useGetIssueContactTypesQuery(null, {
      skip: !props.issueContactTypeProps.isVisible,
    });
  const { data: injuryMechanisms = [] }: { data: InjuryMechanisms } =
    useGetInjuryMechanismsQuery(null, {
      skip: !props.injuryMechanismProps.isVisible,
    });
  const { data: permittedSquads = [] } = useGetPermittedSquadsQuery();

  const isNFLInjuryFlowFields = window.featureFlags['nfl-injury-flow-fields'];

  const showPlayerMovementDatePicker = () => {
    return window.featureFlags['player-movement-aware-datepicker'];
  };

  const renderExaminationDate = () => {
    return (
      <div css={[style.row, style.topRow, style.eventOnsetRow]}>
        <DatePicker
          label={props.occurrenceDateProps.fieldLabel}
          name="diagnosisDate"
          onDateChange={props.occurrenceDateProps.onSelectDiagnosisDate}
          value={props.occurrenceDateProps.selectedDiagnosisDate}
          disableFutureDates
          invalid={props.occurrenceDateProps.isInvalid}
          maxDate={props.examinationDate}
          minDate={props.earliestPermittedOnsetDate}
          kitmanDesignSystem
        />
        {props.occurrenceDateProps.isInvalid && (
          <span css={style.eventOnsetError}>
            {props.t(
              'Onset date cannot be after the examination date, please update examination date'
            )}
          </span>
        )}
      </div>
    );
  };

  const renderSquadSelector = () => (
    <div css={[style.row, style.squadSelector]}>
      <SquadSelector
        label={props.t('Occurred in Squad')}
        athleteId={props.athleteIDProps.value}
        value={props.squadProps.squadId}
        onChange={(squadId) => props.squadProps.onSelectSquad(squadId)}
        isInvalid={props.squadProps.isInvalid}
      />
    </div>
  );

  const renderDatePickerNew = () => {
    const ensureMoment = (date) => {
      return date && !moment.isMoment(date) ? moment(date, 'YYYY-MM-DD') : date;
    };

    const diagnosisDate = ensureMoment(
      props.occurrenceDateProps.selectedDiagnosisDate
    );
    const maxDate = ensureMoment(props.examinationDate);

    return (
      <MovementAwareDatePicker
        athleteId={props.athleteIDProps.value}
        value={diagnosisDate}
        onChange={(date) => {
          props.occurrenceDateProps.onSelectDiagnosisDate(
            moment(date).format('YYYY-MM-DD')
          );
        }}
        name="diagnosisDate"
        inputLabel={props.occurrenceDateProps.fieldLabel}
        isInvalid={props.occurrenceDateProps.isInvalid}
        maxDate={maxDate}
        kitmanDesignSystem
      />
    );
  };

  const renderSquadMismatchDisclaimer = () => {
    const [eventId, eventType] = props.gameIDProps.value.split('_');

    let eventSquad = null;
    if (eventType === 'game') {
      eventSquad = props.gameIDProps.gameOptions.find(
        (option) => option.value === parseInt(eventId, 10)
      )?.squad;
    } else {
      eventSquad = props.gameIDProps.trainingOptions.find(
        (option) => option.value === parseInt(eventId, 10)
      )?.squad;
    }

    const occurredInSquad = permittedSquads.find(
      (squads) => squads.id === props.squadProps.squadId
    );

    if (
      eventSquad &&
      occurredInSquad &&
      ['game', 'training'].includes(eventType) &&
      occurredInSquad?.id !== eventSquad?.id
    ) {
      return (
        <Alert severity="info">
          {props.t(
            'The event chosen belongs to {{eventSquad}}. The injury will be reported as occurring for {{squad}}.',
            { eventSquad: eventSquad.name, squad: occurredInSquad?.name }
          )}
        </Alert>
      );
    }

    return null;
  };

  const renderGameTrainingSelect = () => {
    return (
      <>
        <div css={[style.row, style.eventRow]}>
          <Select
            appendToBody
            value={props.gameIDProps.value}
            invalid={props.gameIDProps.isInvalid}
            label={props.gameIDProps.fieldLabel}
            options={props.gameIDProps.options}
            onChange={props.gameIDProps.onSelectEvent}
            // Enable Optional <label> for issues of type: Illness
            optional={!!props.gameIDProps.isOptional || props.isChronicIssue}
            isDisabled={props.gameIDProps.isDisabled}
          />
        </div>
        {props.gameIDProps.value && renderSquadMismatchDisclaimer()}
      </>
    );
  };

  const renderActivityIdSelect = () => (
    <div css={style.flexCol}>
      <SelectAndFreetext
        selectLabel={props.activityIDProps.fieldLabel}
        textareaLabel={props.activityIDProps.textareaLabel}
        selectedField={props.activityIDProps.value}
        onSelectedField={props.activityIDProps.onSelectActivity}
        currentFreeText={props.activityIDProps.freeText}
        onUpdateFreeText={props.activityIDProps.onFreetextChange}
        invalidFields={props.activityIDProps.isInvalid}
        options={props.activityIDProps.options}
        featureFlag={isNFLInjuryFlowFields}
        showAutoWidthDropdown
        showOptionTooltip
      />
    </div>
  );

  const renderPositionWhenInjuredSelect = () => {
    return (
      <Select
        appendToBody
        value={props.positionWhenInjuredProps.value}
        invalid={props.positionWhenInjuredProps.isInvalid}
        label={props.positionWhenInjuredProps.fieldLabel}
        options={props.positionWhenInjuredProps.options}
        onChange={props.positionWhenInjuredProps.onSelectPositionWhenInjured}
      />
    );
  };

  const renderMechanismDescription = () => {
    return (
      <Textarea
        label={props.t(
          'Additional Description of Injury Mechanism/Circumstances'
        )}
        value={props.mechanismDescriptionProps.value}
        onChange={props.mechanismDescriptionProps.onChange}
        optionalText={props.t('Optional')}
        kitmanDesignSystem
      />
    );
  };

  const renderSessionCompletedControl = () => {
    return (
      <SegmentedControl
        buttons={[
          { name: props.t('Yes'), value: 'YES' },
          { name: props.t('No'), value: 'NO' },
        ]}
        label={props.sessionCompletedProps.fieldLabel}
        maxWidth={130}
        onClickButton={props.sessionCompletedProps.onSelect}
        selectedButton={props.sessionCompletedProps.selectedSessionCompleted}
      />
    );
  };

  const renderTimeOfInjuryField = () => {
    return window.featureFlags['injury-onset-time-selector'] ? (
      <div css={style.marginTop4}>
        <TimePicker
          value={
            props.timeOfInjuryProps.timeOfInjury
              ? moment.tz(props.timeOfInjuryProps.timeOfInjury, localTimezone)
              : null
          }
          label={props.timeOfInjuryProps.fieldLabel}
          onChange={(time) => {
            props.timeOfInjuryProps.onSetTimeOfInjury(
              moment(time).format(dateTransferFormat)
            );
          }}
          kitmanDesignSystem
        />
      </div>
    ) : (
      <InputNumeric
        kitmanDesignSystem
        label={props.timeOfInjuryProps.fieldLabel}
        name="injuryTime"
        onChange={props.timeOfInjuryProps.onSetTimeOfInjury}
        value={props.timeOfInjuryProps.timeOfInjury}
      />
    );
  };

  const renderPresentationTypeSelect = () => {
    const mapPresentationTypes = getSelectOptions(presentationTypes);
    return (
      <div css={style.flexCol}>
        <SelectAndFreetext
          showAutoWidthDropdown
          selectLabel={props.presentationTypeProps.fieldLabel}
          textareaLabel={props.presentationTypeProps.textareaLabel}
          selectedField={props.presentationTypeProps.value}
          onSelectedField={props.presentationTypeProps.onSelect}
          currentFreeText={
            props.presentationTypeProps.selectedPresentationTypeFreeText
          }
          onUpdateFreeText={props.presentationTypeProps.onUpdateFreeText}
          invalidFields={props.presentationTypeProps.isInvalid}
          options={mapPresentationTypes}
          featureFlag={isNFLInjuryFlowFields}
        />
      </div>
    );
  };

  const renderIssueContactType = () => (
    <div css={style.flexCol}>
      <SelectAndFreetext
        selectedField={props.issueContactTypeProps.value}
        invalidFields={props.issueContactTypeProps.isInvalid}
        selectLabel={props.issueContactTypeProps.fieldLabel}
        textareaLabel={props.issueContactTypeProps.textareaLabel}
        currentFreeText={
          props.issueContactTypeProps.selectedIssueContactFreeText
        }
        onUpdateFreeText={props.issueContactTypeProps.onUpdateFreeText}
        options={mapParentAndChildrenToOptions(issueContactTypes)}
        onSelectedField={props.issueContactTypeProps.onSelect}
        featureFlag={isNFLInjuryFlowFields}
        groupBy="submenu"
        showAutoWidthDropdown
        selectContainerStyle={style.widthFull}
      />
    </div>
  );

  const renderInjuryMechanismField = () => (
    <div css={style.flexCol}>
      <SelectAndFreetext
        selectLabel={props.injuryMechanismProps.fieldLabel}
        textareaLabel={props.injuryMechanismProps.textareaLabel}
        selectedField={props.injuryMechanismProps.value}
        onSelectedField={props.injuryMechanismProps.onSelect}
        currentFreeText={props.injuryMechanismProps.freeText}
        onUpdateFreeText={props.injuryMechanismProps.onFreetextChange}
        invalidFields={props.injuryMechanismProps.isInvalid}
        options={mapParentAndChildrenToOptions(injuryMechanisms)}
        featureFlag={isNFLInjuryFlowFields}
        groupBy="submenu"
        showAutoWidthDropdown
        selectContainerStyle={style.widthFull}
      />
    </div>
  );

  const renderContinuationDisclaimer = () => {
    let disclaimerText = '';
    switch (props.eventType) {
      case 'game':
        disclaimerText = props.t('Game from a previous organization');
        break;
      case 'training':
        disclaimerText = props.t(
          'Training session from a previous organization'
        );
        break;
      default:
        disclaimerText = props.t('Other event from a previous organization');
    }

    return (
      <div>
        <div css={style.section}>
          <h3 css={style.sectionTitle}>{props.t('Event information')}</h3>

          <div
            data-testid="EventInformation|disclaimer"
            css={style.continuationIssueEventDisclaimer}
          >
            {disclaimerText}
          </div>
        </div>
      </div>
    );
  };

  const renderNFLView = () => (
    <>
      {props.isGameOrTraining && (
        <>
          <div css={[style.row]}>
            {props.activityIDProps.isVisible && renderActivityIdSelect()}
            {props.positionWhenInjuredProps.isVisible &&
              renderPositionWhenInjuredSelect()}
          </div>
          <div css={[style.row]}>{renderMechanismDescription()}</div>
          <div css={[style.row]}>
            {props.presentationTypeProps.isVisible &&
              renderPresentationTypeSelect()}
          </div>
          {props.issueContactTypeProps.isVisible && (
            <div css={[style.row]}>{renderIssueContactType()}</div>
          )}
          {props.injuryMechanismProps.isVisible && (
            <div css={[style.row]}>{renderInjuryMechanismField()}</div>
          )}
        </>
      )}
    </>
  );

  const renderNonNFLView = () => (
    <>
      {props.selectedEvent && (
        <>
          {props.activityIDProps.isOtherVisible && props.isGameOrTraining && (
            <div css={style.paddingTop16}>{renderActivityIdSelect()}</div>
          )}
          {props.selectedEvent !== 'other' && props.isGameOrTraining && (
            <>
              <div css={[style.row]}>
                {props.activityIDProps.isVisible && renderActivityIdSelect()}
                {props.positionWhenInjuredProps.isVisible &&
                  renderPositionWhenInjuredSelect()}
              </div>
              <div css={[style.row, style.sessionCompletedRow]}>
                {props.sessionCompletedProps.isVisible &&
                  renderSessionCompletedControl()}
                {props.timeOfInjuryProps.isVisible && renderTimeOfInjuryField()}
              </div>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <div>
      {props.issueIsAContinuation && renderContinuationDisclaimer()}
      <div
        data-testid="EventInformation|fields"
        css={[style.section, style.heightFull]}
      >
        {props.occurrenceDateProps.isVisible &&
          (showPlayerMovementDatePicker() ? (
            <div css={style.datepickerWrapper}>{renderDatePickerNew()}</div>
          ) : (
            renderExaminationDate()
          ))}
        {props.gameIDProps.isVisible && renderGameTrainingSelect()}
        {!props.isChronicCondition && renderSquadSelector()}
        {isNFLInjuryFlowFields ? renderNFLView() : renderNonNFLView()}
      </div>
    </div>
  );
};

export const EventInformationTranslated = withNamespaces()(EventInformation);
export default EventInformation;
