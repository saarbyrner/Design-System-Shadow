// @flow
import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import {
  SlidingPanelResponsive,
  TextButton,
  Select,
  DatePicker,
  CheckboxList,
  ToggleSwitch,
} from '@kitman/components';
import Checkbox from '@kitman/components/src/Checkbox';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEnrichedAthletesIssues from '../../hooks/useEnrichedAthletesIssues';
import type { RequestStatus } from '../../types';
import style from './styles';

export type Props = {
  isOpen: boolean,
  onClose: Function,
  onExportAthleteIssuesData: Function,
  athleteId: number,
  selectedIssue?: IssueOccurrenceRequested,
  selectedIssueType?: string,
};

const InjuryExportSidePanel = ({
  isOpen,
  onClose,
  onExportAthleteIssuesData,
  athleteId,
  selectedIssue,
  selectedIssueType,
  t,
}: I18nProps<Props>) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedEntityFilters, setSelectedEntityFilters] = useState([]);
  const [selectedSecondaryFilters, setSelectedSecondaryFilters] = useState([]);
  const [isInjuryCheckSelected, setIsInjuryCheckSelected] = useState(true);
  const [isToggleOn, setIsToggleOn] = useState(true);
  const [isPrinterFriendlyToggleOn, setIsPrinterFriendlyToggleOn] =
    useState(false);
  const [isEmailNotificationToggleOn, setIsEmailNotificationToggleOn] =
    useState(true);
  const [associatedInjuryIllnessValues, setAssociatedInjuryIllnessValues] =
    useState([]);
  const [requestIssuesStatus, setRequestIssuesStatus] =
    useState<RequestStatus>(null);

  const { enrichedAthleteIssues, fetchAthleteIssues } =
    useEnrichedAthletesIssues({
      athleteId: isOpen && athleteId ? athleteId : null,
      useOccurrenceId: true,
    });

  const toggleFilters = useMemo(
    () => [
      { label: 'Maintenance', value: 'maintenances', isDisabled: !isToggleOn },
      {
        label: 'Medical flags',
        value: 'parent_allergies',
        isDisabled: !isToggleOn,
        nestedOptions: [
          {
            label: 'Medical Alerts',
            value: 'medical_alerts',
            isDisabled: !isToggleOn,
          },
          { label: 'Allergies', value: 'allergies', isDisabled: !isToggleOn },
        ],
      },
    ],
    [isToggleOn]
  );

  useEffect(() => {
    if (isOpen) {
      if (selectedIssue && selectedIssueType) {
        const issueIdToString = `${selectedIssueType}_${selectedIssue.id}`;
        setAssociatedInjuryIllnessValues([issueIdToString]);
      } else {
        setRequestIssuesStatus('PENDING');
        fetchAthleteIssues({
          selectedAthleteId: athleteId,
          useOccurrenceIdValue: true,
          includeDetailedIssue: false,
          issueFilter: null,
          includeIssue: true,
          includeGrouped: true,
        }).then(() => setRequestIssuesStatus('SUCCESS'));
      }
    }
  }, [isOpen, startDate, endDate]);

  const exportEntitiesOptions = useMemo(
    () => [
      {
        value: 'include_entities_not_related_to_any_issue',
        label: t('Non-injury data'),
      },
      {
        label: t('Notes'),
        value: 'notes',
        nestedOptions: [
          {
            label: t('Medical notes'),
            value: 'OrganisationAnnotationTypes::Medical',
          },
          {
            label: t('Nutrition notes'),
            value: 'OrganisationAnnotationTypes::Nutrition',
          },
          {
            label: t('Diagnostic notes'),
            value: 'OrganisationAnnotationTypes::Diagnostic',
          },
          {
            label: t('Procedure notes'),
            value: 'OrganisationAnnotationTypes::Procedure',
          },
          {
            label: t('Rehab notes'),
            value: 'OrganisationAnnotationTypes::RehabSession',
          },
          {
            label: t('Daily Status notes'),
            value: 'OrganisationAnnotationTypes::DailyStatusNote',
          },
        ],
      },
      { label: t('Diagnostics'), value: 'diagnostics' },
      { label: t('Procedures'), value: 'procedures' },
      { label: t('Files'), value: 'files' },
      { label: t('Medications'), value: 'medications' },
      { label: t('Rehab'), value: 'rehab_sessions' },
      ...(window.getFlag('medical-form-pdf-export-enabled')
        ? [{ label: t('Forms'), value: 'forms' }]
        : []),
    ],
    [t]
  );

  const athleteExport = () => {
    const unrelatedEntities = isToggleOn;
    const isPrinterFriendly = isPrinterFriendlyToggleOn;
    const skipNotification = !isEmailNotificationToggleOn;
    const injuryIllnessValues = associatedInjuryIllnessValues?.length
      ? associatedInjuryIllnessValues.map((issue) => {
          const [issueType, issueId] = issue.split('_');
          const updateIssueType =
            issueType === 'ChronicInjury' ? 'chronic' : issueType.toLowerCase();
          return {
            issue_id: parseInt(issueId, 10),
            issue_type: updateIssueType,
          };
        })
      : null;

    const dateRange = startDate &&
      endDate && {
        start_date: moment(startDate).format(dateTransferFormat),
        end_date: moment(endDate).format(dateTransferFormat),
      };

    const selectedFilters = [
      ...selectedEntityFilters,
      ...selectedSecondaryFilters,
    ].filter(
      (option) => typeof option === 'string' && !option.includes('parent')
    );

    const { selectedOtherNotes, entityFilters } = selectedFilters.reduce(
      (accumulator, element) => {
        if (
          typeof element === 'string' &&
          element.includes('OrganisationAnnotationTypes')
        ) {
          accumulator.selectedOtherNotes.push(element);
        } else {
          accumulator.entityFilters.push(element);
        }
        return accumulator;
      },
      { selectedOtherNotes: [], entityFilters: [] }
    );

    const entityFiltersExist = entityFilters.length > 0;
    const selectedOtherNotesExist = selectedOtherNotes.length > 0;

    onExportAthleteIssuesData(
      dateRange,
      injuryIllnessValues,
      entityFiltersExist ? entityFilters : null,
      selectedOtherNotesExist ? selectedOtherNotes : null,
      unrelatedEntities,
      isPrinterFriendly,
      skipNotification
    );
    onClose();
  };

  const renderToggle = () => (
    <ToggleSwitch
      isSwitchedOn={isToggleOn}
      toggle={() => {
        setIsToggleOn(!isToggleOn);
        if (isToggleOn) {
          setSelectedSecondaryFilters([]);
        }
      }}
      label={t('Non-injury data')}
      labelPlacement="left"
      kitmanDesignSystem
    />
  );
  const renderEmailNotificationToggle = () => (
    <ToggleSwitch
      isSwitchedOn={isEmailNotificationToggleOn}
      toggle={() => {
        setIsEmailNotificationToggleOn(!isEmailNotificationToggleOn);
      }}
      label={t('Receive email notification')}
      labelPlacement="left"
      kitmanDesignSystem
    />
  );

  const renderIsPrinterFriendlyToggle = () => (
    <ToggleSwitch
      isSwitchedOn={isPrinterFriendlyToggleOn}
      toggle={() => {
        setIsPrinterFriendlyToggleOn(!isPrinterFriendlyToggleOn);
      }}
      label={t('Printer friendly version')}
      labelPlacement="left"
      kitmanDesignSystem
    />
  );

  const renderDatePicker = () => {
    return (
      <div
        data-testid="InjuryExportPanel|DateRangeSelector"
        css={style.dateRangeSelector}
      >
        <DatePicker
          label={t('Start date')}
          onDateChange={(date) => setStartDate(date)}
          value={startDate}
          maxDate={moment(endDate)}
          clearBtn
          kitmanDesignSystem
        />

        <DatePicker
          label={t('End date')}
          onDateChange={(date) => setEndDate(date)}
          todayHighlight
          value={endDate}
          maxDate={moment()}
          minDate={moment(startDate)}
          clearBtn
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderInjurySelect = () => {
    return (
      <div
        data-testid="InjuryExportPanel|InjurySelector"
        css={style.injuryIllnessSelector}
      >
        <Select
          label={t('Injury / illness')}
          onChange={(ids) => setAssociatedInjuryIllnessValues(ids)}
          value={associatedInjuryIllnessValues}
          options={enrichedAthleteIssues || []}
          actionsLabel="Injuries"
          selectAllGroups
          isMulti
          allowSelectAll
          allowClearAll
          isClearable
          isDisabled={requestIssuesStatus === 'PENDING' || selectedIssue}
          invalid={false}
          appendToBody
        />
      </div>
    );
  };

  return (
    <div css={style.sidePanel}>
      <SlidingPanelResponsive
        isOpen={isOpen}
        title={t('Export player')}
        onClose={() => onClose()}
        width={460}
      >
        <div css={style.content}>
          {selectedIssue ? renderInjurySelect() : renderDatePicker()}
          <div className="planningSettingsTable__checkboxList">
            <h6>
              {selectedIssue
                ? t('Linked entities included in export')
                : t('Entities included in export')}
            </h6>
            {!selectedIssue ? (
              <>
                <li className="checkboxList__item">
                  <Checkbox
                    id="item_injury"
                    toggle={() =>
                      setIsInjuryCheckSelected(!isInjuryCheckSelected)
                    }
                    isChecked={isInjuryCheckSelected}
                    label={t(`Injury`)}
                    isDisabled={false}
                    kitmanDesignSystem
                  />
                </li>
                {isInjuryCheckSelected ? (
                  <div css={style.nestedSection}>
                    {renderInjurySelect()}
                    {renderToggle()}
                  </div>
                ) : (
                  <div css={style.alertBox}>
                    <i className="icon-info" />
                    <span>
                      {t(
                        'This export would exclude all injuries and also all entities that are linked to injuries.'
                      )}
                    </span>
                  </div>
                )}
              </>
            ) : (
              renderDatePicker()
            )}
            <CheckboxList
              data-testid="SelectFilter|CheckboxList"
              items={exportEntitiesOptions}
              values={selectedEntityFilters}
              onChange={(updatedEntityFilters) =>
                setSelectedEntityFilters(updatedEntityFilters)
              }
              selectAllOptions
              kitmanDesignSystem
            />
            {selectedIssue && renderToggle()}
            <CheckboxList
              data-testid="SelectFilter|CheckboxList"
              items={toggleFilters}
              values={selectedSecondaryFilters}
              onChange={(updatedEntityFilters) =>
                setSelectedSecondaryFilters(updatedEntityFilters)
              }
              selectAllOptions
              clearAllOptions={!isToggleOn}
              kitmanDesignSystem
            />
          </div>
          {renderIsPrinterFriendlyToggle()}
          {renderEmailNotificationToggle()}
        </div>
        <div css={style.actions}>
          <TextButton
            onClick={athleteExport}
            text={t('Export')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
      </SlidingPanelResponsive>
    </div>
  );
};

export const InjuryExportSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(InjuryExportSidePanel);
export default InjuryExportSidePanel;
