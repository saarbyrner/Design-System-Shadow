// @flow
import { useState, useEffect } from 'react';
import moment from 'moment';
import $ from 'jquery';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import _xor from 'lodash/xor';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { colors } from '@kitman/common/src/variables';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import { exportTreatmentBilling } from '@kitman/services';
import { AppStatus } from '@kitman/components';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../contexts/IssueContext';
import type { RequestStatus, TreatmentFilter } from '../../types';
import type { CreateTreatmentState } from '../../types/medical/TreatmentSessions';
import useTreatments from '../../hooks/useTreatments';
import AddTreatmentsSidePanel from '../../containers/AddTreatmentsSidePanel';
import MedicalSidePanels from '../../containers/MedicalSidePanels';
import SelectAthletesSidePanel from '../../containers/SelectAthletesSidePanel';
import {
  getDefaultTreatmentFilters,
  defaultTreatmentBillingFileName,
} from '../../utils';
import TreatmentFilters from '../../containers/TreatmentFilters';
import TreatmentsCardList from '../../containers/TreatmentCardList';
import useExports from '../../hooks/useExports';
import useSessionMedicalFilters from '../../hooks/useSessionMedicalFilters';

type Props = {
  athleteId?: number,
  athleteData?: AthleteData,
  athleteName?: string,
  issueId?: string | null,
  reloadAthleteData?: (boolean) => void,
  staffUsers: Array<Option>,
  hiddenFilters?: Array<string>,
  scopeToLevel?: string,
  isMedicalDocumentPanelOpen?: boolean,
  setIsMedicalDocumentPanelOpen?: (boolean) => void,
  isMedicalFilePanelOpen?: boolean,
  setIsMedicalFilePanelOpen?: (boolean) => void,
};

const style = {
  wrapper: css`
    min-height: 540px;
  `,
  noTreatmentsText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,
};

const TreatmentsTab = (props: I18nProps<Props>) => {
  const controller = new AbortController();
  const { permissions } = usePermissions();

  const { issue, issueType, isChronicIssue } = useIssue();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const persistedFilters = _xor(['date_range', 'squads'], props.hiddenFilters);
  const [filter, setFilter] = useSessionMedicalFilters<TreatmentFilter>(
    () =>
      getDefaultTreatmentFilters({
        athleteId: props.athleteId || null,
        issueId: issue.id || null,
        issueType: issueType || null,
        isChronicIssue,
      }),
    persistedFilters,
    props.scopeToLevel
  );

  const [exportData, setExportData] = useState({});
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [selectedAthletes, setSelectedAthletes] = useState<Array<number>>([]);
  const exportAthleteTitle = props.athleteName ? `${props.athleteName}` : '';
  const formattedStartDate =
    filter.date_range !== null
      ? moment(filter.date_range.start_date).format('YYYYMMDD')
      : '';
  const formattedEndDate =
    filter.date_range !== null
      ? moment(filter.date_range.end_date).format('YYYYMMDD')
      : '';
  const exportDateRange =
    filter.date_range !== null
      ? `${exportAthleteTitle}_${formattedStartDate}-${formattedEndDate}`
      : `${exportAthleteTitle}`;
  const exportCSV = useCSVExport(exportDateRange, exportData.data, {
    fields: exportData.fields,
  });

  const isExportEnabled =
    window.featureFlags['export-billing-buttons-team-level'] &&
    permissions.medical.issues.canExport;
  const {
    requestStatus: exportRequestStatus,
    exportReports,
    toasts,
    isToastDisplayed,
    closeToast,
  } = useExports(filter, isExportEnabled);

  const { treatments, fetchTreatments, resetTreatments, resetNextPage } =
    useTreatments();

  useEffect(() => {
    if (exportData.data && exportData.fields) {
      exportCSV();
    }
  }, [exportData]);

  const getNextTreatments = useDebouncedCallback(
    ({
      resetList = false,
      abortSignal,
    }: { resetList: boolean, abortSignal: AbortSignal } = {}) => {
      if (resetList) {
        resetTreatments();
      }

      const updatedFilter = {
        ...filter,
        time_range:
          filter.date_range !== null
            ? {
                start_time: filter.date_range.start_date,
                end_time: filter.date_range.end_date,
              }
            : null,
        athlete_id: props.athleteId || filter.athlete_id || null,
      };

      if (typeof updatedFilter.date_range !== 'undefined') {
        // $FlowIgnore Flow doesn't like this delete, but should be safe to do
        delete updatedFilter.date_range;
      }
      setRequestStatus('PENDING');
      fetchTreatments(updatedFilter, resetList, abortSignal)
        .then(() => {
          setRequestStatus('SUCCESS');
        })
        .catch(() => {
          // If request is aborted, catch this, and put into PENDING state
          if (abortSignal.aborted) {
            setRequestStatus('PENDING');
          } else {
            setRequestStatus('FAILURE');
          }
        });
    },
    400
  );

  useEffect(() => {
    return () => {
      // Do any clean up including debounces
      getNextTreatments?.cancel?.();
    };
  }, [getNextTreatments]);

  const buildTreatments = () => {
    resetTreatments();
    resetNextPage();
    getNextTreatments({ resetList: true, abortSignal: controller.signal });
  };

  useEffect(() => {
    buildTreatments();

    return () => {
      controller.abort();
    };
  }, [filter, props.athleteId, issue]);

  const getTreatmentExportData = () => {
    if (props.athleteId) {
      $.ajax({
        method: 'POST',
        url: `/medical/athletes/${props.athleteId}/treatments/export`,
        contentType: 'application/json',
      }).then(({ data, fields }) => {
        setExportData({ data, fields });
      });
    }
  };

  const saveTreatments = (reviewedTreatments: {
    [athlete_id: number]: CreateTreatmentState,
  }) => {
    setRequestStatus('PENDING');

    // Have to parse the bodyAreaAttributes as they will be stringified here
    const treatmentsPayload = Object.values(reviewedTreatments).map(
      (treatment) => {
        return {
          ...treatment,
          // $FlowFixMe
          treatments_attributes: treatment.treatments_attributes.map(
            (attribute) => {
              return {
                ...attribute,
                treatment_body_areas_attributes:
                  attribute.treatment_body_areas_attributes.map(
                    (bodyAreaAttribute) => {
                      return JSON.parse(bodyAreaAttribute);
                    }
                  ),
              };
            }
          ),
        };
      }
    );

    $.ajax({
      method: 'POST',
      url: `/treatment_sessions/bulk_create`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        treatment_sessions: treatmentsPayload,
      }),
    })
      .done(() => {
        setRequestStatus('SUCCESS');
      })
      .fail(() => {
        setRequestStatus('FAILURE');
      });
  };

  return (
    <div css={style.wrapper}>
      <TreatmentFilters
        filter={filter}
        hiddenFilters={props.hiddenFilters}
        onChangeFilter={(updatedFilter) => setFilter(updatedFilter)}
        canSelectAthlete={!props.athleteId}
        isReviewMode={isReviewMode}
        isExporting={exportRequestStatus === 'PENDING' || isToastDisplayed}
        showDownloadTreatments={!!props.athleteId}
        onClickCancelReviewing={() => {
          setSelectedAthletes([]);
          setIsReviewMode(false);
        }}
        onClickDownloadTreatment={getTreatmentExportData}
        onClickSaveReviewing={(reviewedTreatments) => {
          saveTreatments(reviewedTreatments);
          setSelectedAthletes([]);
          setIsReviewMode(false);
          getNextTreatments({
            resetList: true,
            abortSignal: controller.signal,
          });
        }}
        onExportTreatmentBilling={() =>
          exportReports(() =>
            exportTreatmentBilling({
              dateRange: filter.date_range,
              squadIds: filter.squads,
              name: defaultTreatmentBillingFileName,
            })
          )
        }
      />
      <TreatmentsCardList
        isLoading={requestStatus === 'PENDING'}
        isReviewMode={isReviewMode}
        onReachingEnd={getNextTreatments}
        removeSelectedAthlete={(id) => {
          const newAthletes = selectedAthletes.filter(
            (athleteId) => athleteId !== id
          );

          setSelectedAthletes(newAthletes);
        }}
        selectedAthletes={selectedAthletes}
        showAthleteInformation={!props.athleteId}
        staffUsers={props.staffUsers}
        treatmentSessions={treatments}
      />
      {window.featureFlags['medical-global-add-button-fix'] &&
      props.scopeToLevel === 'issue' ? (
        <MedicalSidePanels
          athleteId={props.athleteId}
          athleteData={props.athleteData}
          issueId={props.issueId}
          reloadAthleteData={props.reloadAthleteData}
          isMedicalDocumentPanelOpen={props.isMedicalDocumentPanelOpen}
          setIsMedicalDocumentPanelOpen={props.setIsMedicalDocumentPanelOpen}
          isMedicalFilePanelOpen={props.isMedicalFilePanelOpen}
          setIsMedicalFilePanelOpen={props.setIsMedicalFilePanelOpen}
          onSidePanelAction={() =>
            getNextTreatments({
              resetList: true,
              abortSignal: controller.signal,
            })
          }
        />
      ) : (
        <AddTreatmentsSidePanel
          athleteId={props.athleteId}
          onSaveTreatment={() =>
            getNextTreatments({
              resetList: true,
              abortSignal: controller.signal,
            })
          }
        />
      )}
      <SelectAthletesSidePanel
        onReview={(athletes) => {
          setSelectedAthletes(athletes);
          setIsReviewMode(true);
        }}
      />
      {requestStatus === 'SUCCESS' && treatments.length === 0 && (
        <div css={style.noTreatmentsText}>
          {props.t('No treatments for this period')}
        </div>
      )}
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
      <ToastDialog toasts={toasts} onCloseToast={closeToast} />
    </div>
  );
};

export const TreatmentsTabTranslated: ComponentType<Props> =
  withNamespaces()(TreatmentsTab);
export default TreatmentsTab;
