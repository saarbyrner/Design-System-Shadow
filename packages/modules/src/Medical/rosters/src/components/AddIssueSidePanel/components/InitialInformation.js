// @flow
import moment from 'moment';
import { useEffect, useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type { ConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion/types';
import type { MedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import type { ChronicIssues } from '@kitman/services/src/services/medical/getAthleteChronicIssues';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import {
  DatePicker,
  InputTextField,
  RichTextEditor,
  Select,
} from '@kitman/components';
import { Box } from '@kitman/playbook/components';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { AthleteIssues } from '@kitman/modules/src/Medical/shared/types/medical';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import SquadSelector from '@kitman/modules/src/Medical/shared/components/SquadSelector';
import IssueExaminationDatePicker from '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/components/codingSystems/components/IssueExaminationDatePicker';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getEditorStateFromValue,
  getIssueTitle,
} from '../../../../../shared/utils';

import style from '../AddIssueSidePanelStyle';

type CommonProps = {
  fieldLabel: Function,
  isVisible: boolean,
  isDisabled?: ?boolean,
  isInvalid: boolean,
};

type IssueTypeProps = CommonProps & {
  selectedIssueType: string,
  onSelectIssueType: Function,
};

export type AthleteIDProps = CommonProps & {
  squadAthletesOptions: Array<Object>,
  onAthleteChange: Function,
  value: number,
};

type PreviousIssueProps = CommonProps & {
  value: string,
  isLoading: boolean,
  onSelectPreviousIssue: Function,
  selectedIssueType: string,
  athletePreviousIssues: AthleteIssues,
  isRecurrenceOutsideSystemEnabled: boolean,
};

type continuationIssueProps = CommonProps & {
  value: string,
  isLoading: boolean,
  onSelectContinuationIssue: Function,
  athletePreviousOrganisationIssues: AthleteIssues,
  isContinuationOutsideSystemEnabled: boolean,
};

type OccurrenceDateProps = CommonProps & {
  selectedExaminationDate: string,
  selectedDiagnosisDate: string,
  maxPermittedOnsetDate: string,
  earliestPermittedOnsetDate: string,
  onSelectOccurrenceDate: Function,
};

type IssueTitleProps = {
  isFocused: boolean,
  setIsFocused: Function,
  onSetTitle: Function,
  value: string,
};

type NoteEditorProps = {
  onUpdateNote: Function,
  value: string,
  ref: any,
};

type ReportedDateProps = CommonProps & {
  reportedDate: string,
  onSelectReportedDate: Function,
};

export type SquadProps = CommonProps & {
  squadId: number,
  onSelectSquad: (squadId: ?number) => void,
};

type ChronicIssuesProps = CommonProps & {
  isOnsetDateInvalid: boolean,
  onSelectChronicIssue: Function,
  chronicIssues: ChronicIssues,
  selectedChronicIssue: string | number,
  chronicConditionOnsetDate: string,
  onChronicConditionOnsetDate: Function,
};

type Props = {
  athleteData: AthleteData,
  onSelectExaminationDate: (date: string) => void,
  onSelectExaminationDate: (date: string) => void,
  isPastAthlete: boolean,
  issueTypeProps: IssueTypeProps,
  athleteIDProps: AthleteIDProps,
  previousIssueProps: PreviousIssueProps,
  continuationIssueProps: continuationIssueProps,
  occurrenceDateProps: OccurrenceDateProps,
  examinationDateProps: { isInvalid: boolean },
  issueTitleProps: IssueTitleProps,
  noteEditorProps: NoteEditorProps,
  selectedAthlete: number,
  issueIsARecurrence: boolean,
  issueIsAContinuation: boolean,
  reportedDateProps: ReportedDateProps,
  squadProps: SquadProps,
  permissions: {
    medical: MedicalPermissions,
    concussion: ConcussionPermissions,
  },
  chronicIssuesProps: ChronicIssuesProps,
};

const showPlayerMovementDatePicker = () => {
  return (
    window.featureFlags['player-movement-entity-injury'] &&
    window.featureFlags['player-movement-entity-illness'] &&
    window.featureFlags['player-movement-aware-datepicker']
  );
};

const InitialInformation = (props: I18nProps<Props>) => {
  const transformIssueToSelectOption = (issue) => ({
    label: getIssueTitle(issue, true),
    value: issue.id,
  });

  const issueExaminationDetails = useMemo(
    () => ({
      occurrenceDate: props.occurrenceDateProps.selectedDiagnosisDate,
      examinationDate: props.occurrenceDateProps.selectedExaminationDate,
    }),
    [
      props.occurrenceDateProps.selectedDiagnosisDate,
      props.occurrenceDateProps.selectedExaminationDate,
    ]
  );

  const buildIssueOptions = (issues: AthleteIssues) => {
    const options = [];

    if (props.issueIsARecurrence && issues.closed_issues) {
      options.push({
        label: props.t('Prior injury/illness'),
        options: issues.closed_issues
          ? issues.closed_issues.map(transformIssueToSelectOption)
          : [],
      });
    }

    if (
      props.issueIsAContinuation &&
      issues?.open_issues &&
      issues?.open_issues.length > 0
    ) {
      options.push({
        label: props.t('Open injuries/ illnesses from previous organization'),
        options: issues.open_issues?.map((openIssue) =>
          transformIssueToSelectOption(openIssue)
        ),
      });
    }

    if (
      (props.previousIssueProps?.isRecurrenceOutsideSystemEnabled &&
        props.issueIsARecurrence) ||
      props.issueIsAContinuation
    ) {
      // this is a placeholder value for injuries before the athlete was in the scope of the EMR
      // (think pre-professional or at an org not part of iP)
      options.push({
        label: props.t('No prior injury record in EMR'),
        value: -1,
      });
    }

    return options;
  };

  const { organisation } = useOrganisation();
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const codingSystemIsClinicalImpressions =
    organisation.coding_system_key === codingSystemKeys.CLINICAL_IMPRESSIONS;

  useEffect(() => {
    props.noteEditorProps.ref?.current?.update(
      getEditorStateFromValue(props.noteEditorProps.value || '')
    );
  }, [isEditingNotes]);

  const getFormattedText = (athleteIssue: Object) => {
    return `${formatStandard({
      date: moment(athleteIssue.reported_date),
      showTime: false,
    })} - ${athleteIssue?.full_pathology}`;
  };

  const renderIssueTypeSelector = () => {
    const isChronicInjuryFeatureFlag =
      window.featureFlags['chronic-injury-illness'];

    const getClinicalImpressionOptions = () => {
      const options = [
        { label: props.t('New injury/illness'), value: 'INJURY' },
        {
          label: props.t('Injury/Illness recurrence'),
          value: 'INJURY_RECURRENCE',
        },
      ];
      if (isChronicInjuryFeatureFlag) {
        options.push({
          label: props.t('Chronic Injury/Illness'),
          value: 'CHRONIC_INJURY_OCCURRENCE',
        });
      }
      if (window.featureFlags['continuation-injury-player-movement']) {
        options.push({
          label: props.t('Continuation injury/ illness'),
          value: 'INJURY_CONTINUATION',
        });
      }
      return options;
    };

    const getIssueTypeOptions = () => {
      const options = [
        { label: props.t('New injury'), value: 'INJURY' },
        { label: props.t('New illness'), value: 'ILLNESS' },
        {
          label: props.t('Injury recurrence'),
          value: 'INJURY_RECURRENCE',
        },
        {
          label: props.t('Illness recurrence'),
          value: 'ILLNESS_RECURRENCE',
        },
      ];
      if (isChronicInjuryFeatureFlag) {
        options.push({
          label: props.t('Chronic Injury/Illness'),
          value: 'CHRONIC_INJURY_OCCURRENCE',
        });
      }
      if (window.featureFlags['continuation-injury-player-movement']) {
        options.push(
          {
            label: props.t('Injury continuation'),
            value: 'INJURY_CONTINUATION',
          },
          {
            label: props.t('Illness continuation'),
            value: 'ILLNESS_CONTINUATION',
          }
        );
      }

      return options;
    };

    // Clinical Impressions (CI Codes) treat all codes as "injuries"
    const selectOptions = codingSystemIsClinicalImpressions
      ? getClinicalImpressionOptions()
      : getIssueTypeOptions();

    return (
      <Select
        appendToBody
        value={props.issueTypeProps.selectedIssueType}
        invalid={props.issueTypeProps.isInvalid}
        label={props.issueTypeProps.fieldLabel}
        options={selectOptions}
        onChange={props.issueTypeProps.onSelectIssueType}
      />
    );
  };

  const chronicInjuryOccurrence =
    props.issueTypeProps.selectedIssueType === 'CHRONIC_INJURY_OCCURRENCE';

  const isPriorNoChronicOption =
    props.chronicIssuesProps.selectedChronicIssue === 'NoPriorChronicRecorded';

  const isChronicCondition =
    props.issueTypeProps.selectedIssueType === 'CHRONIC_INJURY';

  const renderAthleteSelector = () => {
    return (
      <Select
        appendToBody
        value={props.athleteIDProps.value}
        invalid={props.athleteIDProps.isInvalid}
        label={props.athleteIDProps.fieldLabel}
        options={props.athleteIDProps.squadAthletesOptions}
        onChange={props.athleteIDProps.onAthleteChange}
        isDisabled={props.athleteIDProps.isDisabled}
        showAutoWidthDropdown
      />
    );
  };

  const getEarliestAvailableDate = () => {
    // Original behaviour to persist = if isChronicCondition, date = null. Otherwise date = earliestPermittedOnsetDate
    // Updated behaviour = if isChronicCondition and FF is on date = earliestPermittedOnsetDate
    // ...below achieves this

    if (
      isChronicCondition &&
      !window.featureFlags['player-movement-entity-chronic-condition']
    ) {
      return null;
    }

    return props.occurrenceDateProps.earliestPermittedOnsetDate;
  };

  const renderReportedDatePicker = () => {
    return (
      <DatePicker
        label={props.reportedDateProps.fieldLabel}
        name="reportedDate"
        invalid={props.reportedDateProps.isInvalid}
        onDateChange={props.reportedDateProps.onSelectReportedDate}
        value={props.reportedDateProps.reportedDate}
        minDate={
          window.featureFlags['player-movement-entity-injury'] &&
          window.featureFlags['player-movement-entity-illness']
            ? props.occurrenceDateProps.earliestPermittedOnsetDate
            : props.occurrenceDateProps.selectedDiagnosisDate
        }
        maxDate={props.occurrenceDateProps.maxPermittedOnsetDate}
        disableFutureDates
        kitmanDesignSystem
      />
    );
  };
  const renderReportedDatePickerNew = () => {
    const minDate =
      window.featureFlags['player-movement-entity-injury'] &&
      window.featureFlags['player-movement-entity-illness']
        ? undefined
        : props.occurrenceDateProps.selectedDiagnosisDate;

    return (
      <MovementAwareDatePicker
        athleteId={props.athleteIDProps.value}
        value={moment(props.reportedDateProps.reportedDate)}
        onChange={props.reportedDateProps.onSelectReportedDate}
        name="reportedDate"
        inputLabel={props.reportedDateProps.fieldLabel}
        isInvalid={props.reportedDateProps.isInvalid}
        minDate={minDate && moment(minDate)}
        disableFuture
        kitmanDesignSystem
      />
    );
  };

  const renderSquadSelector = () => (
    <SquadSelector
      label={props.t('Occurred in Squad')}
      athleteId={props.athleteIDProps.value}
      value={props.squadProps.squadId}
      onChange={(squadId) => props.squadProps.onSelectSquad(squadId)}
      isInvalid={props.squadProps.isInvalid}
      prePopulate
      fullWidth
    />
  );

  const renderOccurenceDatePicker = () => {
    return (
      <DatePicker
        maxDate={props.occurrenceDateProps.maxPermittedOnsetDate}
        minDate={getEarliestAvailableDate()}
        label={props.occurrenceDateProps.fieldLabel}
        name="diagnosisDate"
        invalid={props.occurrenceDateProps.isInvalid}
        onDateChange={props.occurrenceDateProps.onSelectOccurrenceDate}
        value={props.occurrenceDateProps.selectedDiagnosisDate}
        disabled={!!props.occurrenceDateProps.isDisabled}
        disableFutureDates
        kitmanDesignSystem
      />
    );
  };

  const renderOccurenceDatePickerNew = () => {
    if (
      window.getFlag('pm-editing-examination-and-date-of-injury') &&
      !codingSystemIsClinicalImpressions
    ) {
      return (
        <Box sx={{ gridColumn: '1/3' }}>
          <IssueExaminationDatePicker
            athleteId={props.athleteIDProps.value}
            athleteData={props.athleteData}
            examinationDateProps={{
              selectedDiagnosisDate:
                props.occurrenceDateProps.selectedDiagnosisDate,
              selectedExaminationDate:
                props.occurrenceDateProps.selectedExaminationDate,
              diagnosisDateIsInvalid: props.occurrenceDateProps.isInvalid,
              examinationDateIsInvalid: props.examinationDateProps.isInvalid,
            }}
            isEditMode={false}
            getFieldLabel={props.t}
            maxPermittedExaminationDate={
              props.occurrenceDateProps.maxPermittedOnsetDate
            }
            onChangeOccurrenceDate={
              props.occurrenceDateProps.onSelectOccurrenceDate
            }
            onChangeExaminationDate={props.onSelectExaminationDate}
            type="issue"
            details={issueExaminationDetails}
          />
        </Box>
      );
    }
    return (
      <MovementAwareDatePicker
        athleteId={props.athleteIDProps.value}
        value={moment(props.occurrenceDateProps.selectedDiagnosisDate)}
        onChange={props.occurrenceDateProps.onSelectOccurrenceDate}
        name="diagnosisDate"
        inputLabel={props.occurrenceDateProps.fieldLabel}
        disabled={!!props.occurrenceDateProps.isDisabled}
        isInvalid={props.occurrenceDateProps.isInvalid}
        disableFuture
        kitmanDesignSystem
      />
    );
  };

  const renderIssueTitle = () => {
    return (
      <InputTextField
        label={props.t('Title')}
        value={props.issueTitleProps.value}
        focused={props.issueTitleProps.isFocused}
        onFocus={() => props.issueTitleProps.setIsFocused(true)}
        onBlur={() => props.issueTitleProps.setIsFocused(false)}
        onChange={(e) => props.issueTitleProps.onSetTitle(e.target.value)}
        maxLengthCounterPosition="bottom"
        maxLengthCounterContent={
          <div css={style.counterContentDiv}>
            {props.t('{{remainingCharacters}} characters remaining', {
              remainingCharacters: 191 - props.issueTitleProps.value?.length,
            })}
          </div>
        }
        optional
        kitmanDesignSystem
      />
    );
  };

  const renderPreviousIssueSelector = () => {
    return (
      <div css={[style.fullWidth]}>
        <Select
          appendToBody
          value={props.previousIssueProps.value}
          invalid={props.previousIssueProps.isInvalid}
          isLoading={props.previousIssueProps.isLoading}
          label={props.previousIssueProps.fieldLabel}
          options={buildIssueOptions(
            props.previousIssueProps?.athletePreviousIssues
          )}
          onChange={props.previousIssueProps.onSelectPreviousIssue}
          isDisabled={!props.selectedAthlete}
        />
      </div>
    );
  };

  const renderContinuationIssueSelector = () => {
    return (
      <div css={[style.fullWidth]}>
        <Select
          appendToBody
          value={props.continuationIssueProps.value}
          invalid={props.continuationIssueProps.isInvalid}
          isLoading={props.continuationIssueProps.isLoading}
          label={props.continuationIssueProps.fieldLabel}
          options={buildIssueOptions(
            props.continuationIssueProps?.athletePreviousOrganisationIssues
          )}
          onChange={props.continuationIssueProps.onSelectContinuationIssue}
          isDisabled={!props.selectedAthlete}
        />
      </div>
    );
  };

  const renderNoteEditor = () => {
    return (
      <div css={[style.fullWidth]}>
        <div css={style.divider} />
        <RichTextEditor
          label={props.t('Initial notes')}
          onChange={(note) => {
            setIsEditingNotes(true);
            props.noteEditorProps.onUpdateNote(note);
          }}
          forwardedRef={props.noteEditorProps.ref}
          kitmanDesignSystem
          optionalText={props.t('Optional')}
          canSetExternally={!isEditingNotes}
        />
      </div>
    );
  };

  const renderChronicInjurySelect = () => {
    const noPriorChronicOption = [
      {
        label: props.t('No prior chronic condition recorded in EMR'),
        value: 'NoPriorChronicRecorded',
      },
    ];
    const mapChronicOptions = props.chronicIssuesProps.chronicIssues.map(
      (issue) => {
        return {
          label: getFormattedText(issue),
          value: issue.id,
        };
      }
    );
    return (
      <div
        css={[style.fullWidth, style.margintop]}
        className="ChronicInjurySelect"
      >
        <Select
          appendToBody
          data-testid="chronicIssues|IssueSelect"
          value={props.chronicIssuesProps.selectedChronicIssue}
          options={[...noPriorChronicOption, ...mapChronicOptions]}
          onChange={props.chronicIssuesProps.onSelectChronicIssue}
          placeholder={props.t('Select chronic condition')}
          label={props.chronicIssuesProps.fieldLabel}
          invalid={props.chronicIssuesProps.isInvalid}
          isDisabled={!props.athleteIDProps.value}
        />
      </div>
    );
  };

  const renderChronicOnsetDate = () => {
    return (
      <div
        css={[style.fullWidth, style.rowIndentedNoMargin, style.flexAndMargin]}
        className="ChronicInjurySelect"
      >
        <DatePicker
          label={props.t('Chronic condition onset date')}
          name="chronicOnsetDate"
          onDateChange={props.chronicIssuesProps.onChronicConditionOnsetDate}
          value={props.chronicIssuesProps.chronicConditionOnsetDate}
          invalid={props.chronicIssuesProps.isOnsetDateInvalid}
          maxDate={props.occurrenceDateProps.selectedDiagnosisDate}
          minDate={getEarliestAvailableDate()}
          disableFutureDates
          kitmanDesignSystem
        />
      </div>
    );
  };

  return (
    <div>
      <div css={[style.form]}>
        {props.issueTypeProps.isVisible &&
          !isChronicCondition &&
          renderIssueTypeSelector()}
        {props.athleteIDProps.isVisible && renderAthleteSelector()}
        {props.issueIsAContinuation &&
          props.continuationIssueProps.isVisible &&
          renderContinuationIssueSelector()}
        {props.occurrenceDateProps.isVisible &&
          !showPlayerMovementDatePicker() &&
          renderOccurenceDatePicker()}
        {props.occurrenceDateProps.isVisible &&
          showPlayerMovementDatePicker() &&
          renderOccurenceDatePickerNew()}
        {window.featureFlags['injury-illness-name'] && renderIssueTitle()}
        {window.featureFlags['nfl-injury-flow-fields'] &&
          !showPlayerMovementDatePicker() &&
          props.reportedDateProps.isVisible &&
          renderReportedDatePicker()}
        {window.featureFlags['nfl-injury-flow-fields'] &&
          showPlayerMovementDatePicker() &&
          props.reportedDateProps.isVisible &&
          renderReportedDatePickerNew()}
        {!isChronicCondition && renderSquadSelector()}
        {props.issueIsARecurrence &&
          props.previousIssueProps.isVisible &&
          renderPreviousIssueSelector()}
        {chronicInjuryOccurrence && renderChronicInjurySelect()}
        {isPriorNoChronicOption &&
          chronicInjuryOccurrence &&
          renderChronicOnsetDate()}
        {props.permissions.medical.notes.canCreate &&
          !props.isPastAthlete &&
          renderNoteEditor()}
      </div>
    </div>
  );
};

export const InitialInformationTranslated =
  withNamespaces()(InitialInformation);
export default InitialInformation;
