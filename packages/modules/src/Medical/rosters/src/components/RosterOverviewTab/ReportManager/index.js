// @flow
import { useState, useEffect, useRef, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import i18n from '@kitman/common/src/utils/i18n';
import { TextButton, TooltipMenu } from '@kitman/components';
import { Box } from '@kitman/playbook/components';
import { getInjuryReport } from '@kitman/services/src/services/medical';
import moment from 'moment';
import structuredClone from 'core-js/stable/structured-clone';
import { transforms } from 'json2csv';
import { formatShort } from '@kitman/common/src/utils/dateFormatter';
import { getEventName } from '@kitman/common/src/utils/workload';
import downloadCSV from '@kitman/common/src/utils/downloadCSV';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetPreferencesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { AthleteDemographicReportTranslated as AthleteDemographicReport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/AthleteDemographicReport';
import { AthleteEmergencyContactsReportTranslated as AthleteEmergencyContactsReport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/AthleteEmergencyContactsReport';
import { RehabReportTranslated as RehabReport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/RehabReport';
import { InjuryReportTranslated as InjuryReport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/InjuryReport';
import { CoachesReportTranslated as CoachesReport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/CoachesReport';
import { LongitudinalAnkleProphylacticFormReportTranslated as LongitudinalAnkleProphylacticFormReport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/LongitudinalAnkleProphylacticFormReport';
import { ProphylacticAnkleSupportReportTranslated as ProphylacticAnkleSupportReport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/ProphylacticAnkleSupportReport';
import { InjuryDetailReportExportTranslated as InjuryDetailReportExport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/InjuryDetailReportExport';
import { InjuryMedicationReportExportTranslated as InjuryMedicationReportExport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/InjuryMedicationReportExport';
import { TimeLossAllActivitiesReportExportTranslated as TimeLossAllActivitiesReportExport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/TimeLossAllActivitiesReportExport';
import { TimeLossBodyPartReportExportTranslated as TimeLossBodyPartReportExport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/TimeLossBodyPartReportExport';
import { MedicalHistoryTranslated as MedicalHistory } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/MedicalHistory';
import { MedicationReportTranslated as MedicationReport } from '@kitman/modules/src/Medical/shared/components/MedicationsTab/components/MedicationsReportManager/MedicationReport';
import { MedicationsReportExportTranslated as MedicationsReportExport } from '@kitman/modules/src/Medical/shared/components/MedicationsTab/components/MedicationsReportManager/MedicationsReportExport';
import { InjurySurveillanceReportTranslated as InjurySurveillanceReport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/InjurySurveillanceReport';
import { Osha300ReportTranslated as Osha300Report } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/Osha300Report';
import { PlayerDetailReportTranslated as PlayerDetailReport } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/PlayerDetailReport';
import {
  getPathologyName,
  isV2MultiCodingSystem,
} from '@kitman/modules/src/Medical/shared/utils';
import {
  getErrorToast,
  stripMarkup,
} from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { getLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';

type Props = {
  squads: number[],
};

export const REPORT_KEY = {
  injury: 'injury',
  rehab: 'rehab',
  emergency_medical: 'emergency_medical',
  x_ray_game_day: 'x_ray_game_day',
  emergency_contacts: 'emergency_contacts',
  longitudinal_ankle_prophylactic_form: 'longitudinal_ankle_prophylactic_form',
  coaches: 'coaches',
  medications: 'medications',
  medications_report_export: 'medications_report_export',
  prophylactic_ankle_support_at: 'prophylactic_ankle_support_at',
  prophylactic_ankle_support_em: 'prophylactic_ankle_support_em',
  injury_detail_report_export: 'injury_detail_report_export',
  time_loss_all_activities_report_export:
    'time_loss_all_activities_report_export',
  time_loss_body_part_report_export: 'time_loss_body_part_report_export',
  injury_medication_report_export: 'injury_medication_report_export',
  medical_history: 'medical_history',
  logic_builder_medical_report: 'logic_builder_medical_report',
  osha_300_report: 'osha_300_report',
  player_detail_report: 'player_detail_report',
};

export type ReportKey = $Keys<typeof REPORT_KEY>;

// The report that is displayed when user hits cmd + p
const DEFAULT_REPORT = REPORT_KEY.rehab;

// Pathology, onset type, examination date, supplemental pathology are all common
const getCISpecificFields = (orgCI: CodingSystemKey) => {
  switch (orgCI) {
    case codingSystemKeys.OSICS_10:
      return [
        {
          label: i18n.t('Classification'),
          value: 'coding.osics_10.classification.name',
        },
        {
          label: i18n.t('Body area'),
          value: 'coding.osics_10.body_area.name',
        },
        {
          label: i18n.t('Code'),
          value: 'coding.osics_10.osics_code',
        },
        {
          label: i18n.t('Side'),
          value: 'coding.osics_10.side.name',
        },
      ];
    case codingSystemKeys.DATALYS:
      return [
        {
          label: i18n.t('Classification'),
          value: 'coding.datalys.datalys_classification.name',
        },
        {
          label: i18n.t('Body area'),
          value: 'coding.datalys.datalys_body_area.name',
        },
        {
          label: i18n.t('Tissue type'),
          value: 'coding.datalys.datalys_tissue_type.name',
        },
        {
          label: i18n.t('Side'),
          value: 'coding.datalys.side.name',
        },
      ];
    case codingSystemKeys.CLINICAL_IMPRESSIONS:
      return [
        {
          label: i18n.t('Primary Classification'),
          value:
            'coding.clinical_impressions.clinical_impression_classification.name',
        },
        {
          label: i18n.t('Primary Body Area'),
          value:
            'coding.clinical_impressions.clinical_impression_body_area.name',
        },
        {
          label: i18n.t('Primary Side'),
          value: 'coding.clinical_impressions.side.name',
        },
        {
          label: i18n.t('Primary Code'),
          value: 'coding.clinical_impressions.code',
        },
        {
          label: i18n.t('Secondary CI Code'),
          value:
            'coding.clinical_impressions.secondary_pathologies.record.pathology',
        },
        {
          label: i18n.t('Secondary Classification'),
          value:
            'coding.clinical_impressions.secondary_pathologies.record.clinical_impression_classification.name',
        },
        {
          label: i18n.t('Secondary Body Area'),
          value:
            'coding.clinical_impressions.secondary_pathologies.record.clinical_impression_body_area.name',
        },
        {
          label: i18n.t('Secondary Side'),
          value: 'coding.clinical_impressions.secondary_pathologies.side.name',
        },
        {
          label: i18n.t('Secondary Code'),
          value:
            'coding.clinical_impressions.secondary_pathologies.record.code',
        },
      ];
    case codingSystemKeys.ICD:
    default:
      return [];
  }
};

const ReportManager = ({ squads, t }: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const { data: organisation } = useGetOrganisationQuery();
  const {
    data: permissions = {
      ...DEFAULT_CONTEXT_VALUE.permissions,
    },
  }: { data: PermissionsType } = useGetPermissionsQuery();
  const {
    data: preferences = {
      osha_300_report: false,
    },
  }: { data: PreferenceType } = useGetPreferencesQuery();

  const { toasts, toastDispatch } = useToasts();

  const [activeReport, setActiveReport] = useState<ReportKey>(DEFAULT_REPORT);
  const [openReportSettings, setOpenReportSettings] =
    useState<null | ReportKey>(null);
  const [exportType, setExportType] = useState<'pdf' | 'csv'>('pdf');

  const printReport = (key: ReportKey) => {
    setActiveReport(key);
    // Wrapping the print in a timeout so the newly set active report
    // can render in the dom before triggering the window print
    setTimeout(() => {
      window.print();
    }, 0);
  };

  const availabilityConfig = {
    emergency_contacts: {
      isAvailable: window.featureFlags['emergency-contacts-report'],
    },
    emergency_medical: {
      isAvailable: window.featureFlags['emergency-medical-report'],
    },
    x_ray_game_day: {
      isAvailable: window.featureFlags['x-ray-game-day-report'],
    },
    injury: {
      isAvailable:
        window.featureFlags['nfl-injury-report'] &&
        permissions.medical.issues.canExport,
    },
    coaches: {
      isAvailable:
        window.featureFlags['nfl-coaches-report'] &&
        permissions.medical.issues.canExport,
    },
    rehab: {
      isAvailable:
        window.featureFlags['rehab-print-multi-player'] &&
        permissions.rehab.canView,
    },
    longitudinal_ankle_prophylactic_form: {
      isAvailable:
        window.featureFlags['nba-show-longitudinal-ankle-export'] &&
        permissions.medical.forms.canExport,
    },
    prophylactic_ankle_support_at: {
      isAvailable:
        window.featureFlags['nba-combined-ankle-export'] &&
        permissions.medical.forms.canExport,
    },
    prophylactic_ankle_support_em: {
      isAvailable:
        window.featureFlags['nba-combined-ankle-export'] &&
        permissions.medical.forms.canExport,
    },
    medications: {
      isAvailable:
        window.featureFlags['medications-report'] &&
        permissions.medical.medications.canView,
    },
    medications_report_export: {
      isAvailable:
        window.featureFlags['medications-report-export'] &&
        permissions.medical.medications.canView,
    },
    injury_detail_report_export: {
      isAvailable:
        window.featureFlags['nfl-injury-detail-report-export'] &&
        permissions.medical.issues.canExport,
    },
    time_loss_all_activities_report_export: {
      isAvailable:
        window.featureFlags['time-loss-activities-report-export'] &&
        permissions.medical.issues.canExport,
    },
    time_loss_body_part_report_export: {
      isAvailable:
        window.featureFlags['time-loss-body-area-report'] &&
        permissions.medical.issues.canExport,
    },
    injury_medication_report_export: {
      isAvailable:
        window.featureFlags['nfl-injury-medication-report-export'] &&
        permissions.medical.issues.canExport &&
        permissions.medical.medications.canView,
    },
    medical_history: {
      isAvailable:
        window.featureFlags['medical-bulk-export'] &&
        permissions.medical.issues.canExport,
    },
    logic_builder_medical_report: {
      isAvailable:
        window.featureFlags['injury-surveillance-report'] &&
        permissions.medical.issues.canExport,
    },
    osha_300_report: {
      isAvailable:
        permissions.medical.issues.canExport && preferences.osha_300_report,
    },
    player_detail_report: {
      isAvailable:
        window.featureFlags['pm-player-detail-report'] &&
        permissions.medical.issues.canExport &&
        permissions.settings.canViewSettingsAthletes,
    },
  };

  const isReportDrawerOpen = (key: ReportKey) => openReportSettings === key;

  const isReportActive = (key: ReportKey) =>
    availabilityConfig[key].isAvailable && activeReport === key;

  const squadRef = useRef(squads[0]);

  // refetching the squads report every time the squads update
  useEffect(() => {
    if (
      availabilityConfig.rehab.isAvailable &&
      squads.length === 1 &&
      squads[0] !== squadRef.current
    ) {
      squadRef.current = structuredClone(squads[0]);
    }
  }, [squads]);

  useEffect(() => {
    // Returns back to the default report after each print instance
    const listener = window.addEventListener('afterprint', () => {
      // need to wrap this in a timeout because of this bug -> https://github.com/facebook/react/issues/17918
      setTimeout(() => {
        setActiveReport(DEFAULT_REPORT);
      }, 0);
    });

    return () => window.removeEventListener('afterprint', listener);
  }, []);

  const onClickCSV = (today, data) => {
    const orgCI = organisation?.coding_system_key;
    const additionalCIFields = getCISpecificFields(orgCI);

    downloadCSV(`InjuryReport_${today}`, Object.values(data || {}).flat(), {
      transforms: [
        transforms.unwind({
          paths: [
            'squads',
            'coding.clinical_impressions.secondary_pathologies',
          ],
        }),
      ],
      fields: [
        { label: t('Name'), value: 'athlete.name' },
        { label: t('#'), value: 'squad_number' },
        { label: t('Pos'), value: 'position' },
        { label: t('Body Area'), value: 'body_area' },
        { label: t('Injury'), value: 'injury' },
        { label: t('Status'), value: 'status.description' },
        { label: t('Roster'), value: 'squads.name' },
        {
          label: t('Injury Date'),
          value: (row) => formatShort(moment(row?.occurrence_date)),
        },
        { label: t('Added by'), value: 'created_by.fullname' },
        {
          label: t('Date of Examination'),
          value: (row) => formatShort(moment(row?.examination_date)),
        },
        {
          label: t('Event'),
          value: (row) => {
            // eslint-disable-next-line no-nested-ternary
            return row?.training_session
              ? getEventName(row?.training_session?.event)
              : row?.game
              ? getEventName(row?.game?.event)
              : '';
          },
        },
        {
          label: t('Time of Injury'),
          value: 'occurrence_min',
        },
        {
          label: t('Session Completed'),
          value: (row) => (row?.session_completed ? t('Yes') : t('No')),
        },
        {
          label: t('Position When Injured'),
          value: 'position_when_injured',
        },
        {
          label: t('Mechanism'),
          value: 'activity',
        },
        {
          label: t('Pathology'),
          value: getPathologyName,
        },
        {
          label: t('Primary Mode'),
          value: 'onset',
        },
        {
          label: t('Contact type'),
          value: 'issue_contact_type.name',
        },
        {
          label: t('Modifications'),
          default: [],
          value: (row) => {
            const modifications = row.modifications;

            if (!modifications?.length) {
              return '';
            }

            return modifications.map(stripMarkup).join('\n---\n');
          },
        },
        ...additionalCIFields,
        {
          label: t('Latest Note'),
          value: (row) => {
            const latestNote = row.latest_note;

            if (!latestNote) {
              return latestNote;
            }

            return stripMarkup(latestNote);
          },
        },
      ],
    });
    toastDispatch({
      type: 'UPDATE_TOAST',
      toast: {
        id: 'injuryReportToast',
        title: 'Injury report CSV downloaded successfully.',
        status: 'SUCCESS',
      },
    });
  };

  const menuItems = [
    {
      key: REPORT_KEY.injury,
      description: i18n.t('Injury Report PDF'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.injury);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.injury,
      description: i18n.t('Injury Report CSV'),
      onClick: () => {
        toastDispatch({
          type: 'CREATE_TOAST',
          toast: {
            id: 'injuryReportToast',
            title: 'Downloading injury report CSV...',
            status: 'LOADING',
          },
        });
        getInjuryReport({ issueTypes: [], population: [] })
          .then((data) => {
            const today = formatShort(moment());
            onClickCSV(today, data);
          })
          .catch((error) => {
            toastDispatch({
              type: 'UPDATE_TOAST',
              toast: {
                id: 'injuryReportToast',
                ...getErrorToast(error),
              },
            });
          });
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.coaches,
      description: i18n.t('Coaches Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.coaches);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.rehab,
      description: i18n.t('Rehab Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.rehab);
      },
      isDisabled: !squads,
    },
    {
      key: REPORT_KEY.emergency_contacts,
      description: i18n.t('Emergency Contacts Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.emergency_contacts);
      },
      isDisabled: !squads,
    },
    {
      key: REPORT_KEY.emergency_medical,
      description: i18n.t('Emergency Medical Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.emergency_medical);
      },
      isDisabled: !squads,
    },
    {
      key: REPORT_KEY.x_ray_game_day,
      description: i18n.t('X-Ray Game Day Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.x_ray_game_day);
      },
      isDisabled: !squads,
    },
    {
      key: REPORT_KEY.medications,
      description: i18n.t('Medication Report PDF'),
      onClick: () => {
        setExportType('pdf');
        setOpenReportSettings(REPORT_KEY.medications);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.medications,
      description: i18n.t('Medication Report CSV'),
      onClick: () => {
        setExportType('csv');
        setOpenReportSettings(REPORT_KEY.medications);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.medications_report_export,
      description: i18n.t('Medication Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.medications_report_export);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.longitudinal_ankle_prophylactic_form,
      description: i18n.t('Longitudinal Ankle Prophylactic Form'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.longitudinal_ankle_prophylactic_form);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.prophylactic_ankle_support_at,
      description: i18n.t('Prophylactic Ankle Support (AT)'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.prophylactic_ankle_support_at);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.prophylactic_ankle_support_em,
      description: i18n.t('Prophylactic Ankle Support (EM)'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.prophylactic_ankle_support_em);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.injury_detail_report_export,
      description: i18n.t('Injury Detail Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.injury_detail_report_export);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.player_detail_report,
      description: i18n.t('Player Detail Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.player_detail_report);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.time_loss_all_activities_report_export,
      description: i18n.t('Time Loss (All Activities)'),
      onClick: () => {
        setOpenReportSettings(
          REPORT_KEY.time_loss_all_activities_report_export
        );
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.time_loss_body_part_report_export,
      description: i18n.t('Time Loss (Body Part)'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.time_loss_body_part_report_export);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.injury_medication_report_export,
      // renamed from Injury Medications Report to Appendix BB Report but key needs to remain the same
      description: i18n.t('Appendix BB Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.injury_medication_report_export);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.medical_history,
      description: i18n.t('Medical History'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.medical_history);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.logic_builder_medical_report,
      description: i18n.t('Logic Builder - Medical Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.logic_builder_medical_report);
      },
      isDisabled: false,
    },
    {
      key: REPORT_KEY.osha_300_report,
      description: i18n.t('OSHA 300 Report'),
      onClick: () => {
        setOpenReportSettings(REPORT_KEY.osha_300_report);
        trackEvent(
          performanceMedicineEventNames.clickDownloadOsha300Report,
          getLevelAndTab('team', tabHashes.OVERVIEW)
        );
      },
      isDisabled: false,
    },
  ]
    .filter(({ key }) => availabilityConfig[key].isAvailable)
    .map((item) => ({
      description: item.description,
      onClick: item.onClick,
      isDisabled: item.isDisabled,
    }));

  if (menuItems.length === 0) {
    return null;
  }

  const removeToast = (toastId) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id: toastId,
    });
  };

  const getDemographicReportHiddenOptions = () => {
    const hiddenOptions = ['date_of_birth']; // Short date of birth is preferred
    if (!permissions.medical?.allergies?.canView) {
      hiddenOptions.push('allergies');
    }

    if (!permissions.medical?.alerts?.canView) {
      hiddenOptions.push('athlete_medical_alerts');
    }

    return hiddenOptions;
  };

  return (
    <>
      {menuItems.length > 1 && (
        <TooltipMenu
          appendToParent
          placement="bottom-end"
          offset={[0, 5]}
          menuItems={menuItems}
          tooltipTriggerElement={
            <TextButton
              text={t('Download')}
              iconAfter="icon-chevron-down"
              type="secondary"
              kitmanDesignSystem
            />
          }
          kitmanDesignSystem
        />
      )}
      {menuItems.length === 1 && (
        <TextButton
          type="secondary"
          text={menuItems[0].description}
          onClick={menuItems[0].onClick}
          isDisabled={menuItems[0].isDisabled}
          kitmanDesignSystem
        />
      )}
      <Box>
        {availabilityConfig.injury.isAvailable && (
          <div data-testid="InjuryReportComponent">
            <InjuryReport
              squadId={squads[0]}
              isReportActive={isReportActive(REPORT_KEY.injury)}
              printReport={() => printReport(REPORT_KEY.injury)}
              isSettingsOpen={isReportDrawerOpen(REPORT_KEY.injury)}
              closeSettings={() => setOpenReportSettings(null)}
            />
          </div>
        )}
        {availabilityConfig.coaches.isAvailable && (
          <div data-testid="CoachesReportComponent">
            <CoachesReport
              squads={squads}
              isReportActive={isReportActive(REPORT_KEY.coaches)}
              printReport={() => printReport(REPORT_KEY.coaches)}
              isSettingsOpen={isReportDrawerOpen(REPORT_KEY.coaches)}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|CoachesReport"
            />
          </div>
        )}
        {availabilityConfig.rehab.isAvailable && (
          <div data-testid="RehabReportComponent">
            <RehabReport
              squadId={squads[0]}
              isReportActive={isReportActive(REPORT_KEY.rehab)}
              printReport={() => printReport(REPORT_KEY.rehab)}
              isSettingsOpen={isReportDrawerOpen(REPORT_KEY.rehab)}
              closeSettings={() => setOpenReportSettings(null)}
            />
          </div>
        )}
        {availabilityConfig.emergency_medical.isAvailable && (
          <div data-testid="AthleteEmergencyMedicalReportComponent">
            <AthleteDemographicReport
              squadId={squads[0]}
              isReportActive={isReportActive(REPORT_KEY.emergency_medical)}
              printReport={() => printReport(REPORT_KEY.emergency_medical)}
              isSettingsOpen={isReportDrawerOpen(REPORT_KEY.emergency_medical)}
              closeSettings={() => setOpenReportSettings(null)}
              reportTitle={t('Emergency Medical Report')}
              reportSettingsKey="emergency_medical"
              hideOptions={getDemographicReportHiddenOptions()}
              sortKeys={{ primary: 'lastname', secondary: 'firstname' }}
            />
          </div>
        )}
        {availabilityConfig.x_ray_game_day.isAvailable && (
          <div data-testid="AthleteXRayReportComponent">
            <AthleteDemographicReport
              squadId={squads[0]}
              isReportActive={isReportActive(REPORT_KEY.x_ray_game_day)}
              printReport={() => printReport(REPORT_KEY.x_ray_game_day)}
              isSettingsOpen={isReportDrawerOpen(REPORT_KEY.x_ray_game_day)}
              closeSettings={() => setOpenReportSettings(null)}
              reportTitle={t('X-Ray Game Day Report')}
              reportSettingsKey="x_ray_game_day"
              hideOptions={getDemographicReportHiddenOptions()}
              sortKeys={{ primary: 'lastname', secondary: 'firstname' }}
            />
          </div>
        )}
        {availabilityConfig.emergency_contacts.isAvailable && (
          <div data-testid="AthleteEmergencyContactsReportComponent">
            <AthleteEmergencyContactsReport
              squadId={squads[0]}
              isReportActive={isReportActive(REPORT_KEY.emergency_contacts)}
              printReport={() => printReport(REPORT_KEY.emergency_contacts)}
              isSettingsOpen={isReportDrawerOpen(REPORT_KEY.emergency_contacts)}
              closeSettings={() => setOpenReportSettings(null)}
              reportTitle={t('Emergency Contacts Report')}
              reportSettingsKey="emergency_contacts"
              hideOptions={[]}
              sortKeys={{ primary: 'lastname', secondary: 'firstname' }}
            />
          </div>
        )}
        {availabilityConfig.longitudinal_ankle_prophylactic_form
          .isAvailable && (
          <div data-testid="LongitudinalAnkleProphylacticFormReport">
            <LongitudinalAnkleProphylacticFormReport
              squadId={squads[0]}
              isSettingsOpen={isReportDrawerOpen(
                REPORT_KEY.longitudinal_ankle_prophylactic_form
              )}
              closeSettings={() => setOpenReportSettings(null)}
              reportTitle={t('Longitudinal Ankle Prophylactic Form')}
              reportSettingsKey="longitudinal_ankle_prophylactic_form"
            />
          </div>
        )}
        {availabilityConfig.prophylactic_ankle_support_at.isAvailable && (
          <div data-testid="ProphylacticAnkleSupportReportAT">
            <ProphylacticAnkleSupportReport
              formKey="nba-ankle-at-2334-v1"
              isSettingsOpen={isReportDrawerOpen(
                REPORT_KEY.prophylactic_ankle_support_at
              )}
              closeSettings={() => setOpenReportSettings(null)}
              reportTitle={t('Prophylactic Ankle Support (Athletic Trainer)')}
              reportSettingsKey="prophylactic_ankle_support_at"
            />
          </div>
        )}
        {availabilityConfig.prophylactic_ankle_support_em.isAvailable && (
          <div data-testid="ProphylacticAnkleSupportReportEM">
            <ProphylacticAnkleSupportReport
              formKey="nba-ankle-em-2324-v2"
              isSettingsOpen={isReportDrawerOpen(
                REPORT_KEY.prophylactic_ankle_support_em
              )}
              closeSettings={() => setOpenReportSettings(null)}
              reportTitle={t('Prophylactic Ankle Support (Equipment Manager)')}
              reportSettingsKey="prophylactic_ankle_support_em"
            />
          </div>
        )}
        {availabilityConfig.medications.isAvailable && (
          <div data-testid="MedicationsReportComponent">
            <MedicationReport
              squadId={squads[0]}
              exportType={exportType}
              isReportActive={isReportActive(REPORT_KEY.medications)}
              printReport={() => printReport(REPORT_KEY.medications)}
              isSettingsOpen={isReportDrawerOpen(REPORT_KEY.medications)}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|MedicationsReport"
            />
          </div>
        )}
        {availabilityConfig.medications_report_export.isAvailable && (
          <div data-testid="MedicationsReportExportComponent">
            <MedicationsReportExport
              squadId={squads[0]}
              isSettingsOpen={isReportDrawerOpen(
                REPORT_KEY.medications_report_export
              )}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|MedicationsReportExport"
            />
          </div>
        )}
        {availabilityConfig.injury_detail_report_export.isAvailable && (
          <div data-testid="InjuryDetailReportExport">
            <InjuryDetailReportExport
              squadId={squads[0]}
              isSettingsOpen={isReportDrawerOpen(
                REPORT_KEY.injury_detail_report_export
              )}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|InjuryDetailReportExport"
              isV2MultiCodingSystem={isV2MultiCodingSystem(
                organisation.coding_system_key
              )}
            />
          </div>
        )}
        {availabilityConfig.player_detail_report.isAvailable && (
          <div data-testid="PlayerDetailReport">
            <PlayerDetailReport
              squadId={squads[0]}
              isSettingsOpen={isReportDrawerOpen(
                REPORT_KEY.player_detail_report
              )}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|PlayerDetailReport"
            />
          </div>
        )}
        {availabilityConfig.time_loss_all_activities_report_export
          .isAvailable && (
          <div data-testid="TimeLossAllActivitiesReportExport">
            <TimeLossAllActivitiesReportExport
              squadId={squads[0]}
              isSettingsOpen={isReportDrawerOpen(
                REPORT_KEY.time_loss_all_activities_report_export
              )}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|TimeLossAllActivitiesReportExport"
            />
          </div>
        )}
        {availabilityConfig.time_loss_body_part_report_export.isAvailable && (
          <div data-testid="TimeLossBodyPartReportExport">
            <TimeLossBodyPartReportExport
              squadId={squads[0]}
              isSettingsOpen={isReportDrawerOpen(
                REPORT_KEY.time_loss_body_part_report_export
              )}
              isV2MultiCodingSystem={isV2MultiCodingSystem(
                organisation.coding_system_key
              )}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|TimeLossBodyPartReportExport"
            />
          </div>
        )}
        {availabilityConfig.injury_medication_report_export.isAvailable && (
          <div data-testid="InjuryMedicationReportExport">
            <InjuryMedicationReportExport
              squadId={squads[0]}
              isSettingsOpen={isReportDrawerOpen(
                REPORT_KEY.injury_medication_report_export
              )}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|InjuryMedicationReportExport"
            />
          </div>
        )}
        {availabilityConfig.medical_history.isAvailable && (
          <div data-testid="MedicalHistory">
            <MedicalHistory
              squadId={squads[0]}
              isSettingsOpen={isReportDrawerOpen(REPORT_KEY.medical_history)}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|MedicalHistory"
            />
          </div>
        )}
        {availabilityConfig.logic_builder_medical_report.isAvailable && (
          <div data-testid="InjurySurveillanceReport">
            <InjurySurveillanceReport
              isOpen={isReportDrawerOpen(
                REPORT_KEY.logic_builder_medical_report
              )}
              onClose={() => setOpenReportSettings(null)}
            />
          </div>
        )}
        {availabilityConfig.osha_300_report.isAvailable && (
          <div data-testid="Osha300Report">
            <Osha300Report
              isSettingsOpen={isReportDrawerOpen(REPORT_KEY.osha_300_report)}
              closeSettings={() => setOpenReportSettings(null)}
              reportSettingsKey="RosterOverview|Osha300Report"
            />
          </div>
        )}
        <ToastDialog toasts={toasts} onCloseToast={removeToast} />
      </Box>
    </>
  );
};

export const ReportManagerTranslated: ComponentType<Props> =
  withNamespaces()(ReportManager);
export default ReportManager;
