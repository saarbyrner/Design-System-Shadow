// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import {
  exportDiagnosticsRecords,
  exportMedicationRecords,
  exportNullDataReport,
  exportQualityReports,
  exportHapAuthStatus,
  exportParticipantExposure,
  exportConcussionBaselineAudit,
  exportHapCovidBranch,
} from '@kitman/services';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ReportsFilter } from '../../../../shared/types';
import ReportsFilters from '../../containers/ReportsFilters';
import useExports from '../../../../shared/hooks/useExports';

const style = {
  wrapper: css`
    min-height: 600px;
  `,
};

type Props = {};

const ReportsTab = (props: I18nProps<Props>) => {
  const [filter, setFilter] = useState<ReportsFilter>({
    squads: [],
    date_range: null,
  });

  const { permissions } = usePermissions();
  const isExportEnabled = permissions.medical.issues.canExport;
  const {
    requestStatus: exportRequestStatus,
    exportReports,
    toasts,
    isToastDisplayed,
    closeToast,
  } = useExports(filter, isExportEnabled);

  const reportParams = {
    dateRange: filter.date_range,
    squadIds: filter.squads,
  };

  return (
    <div css={style.wrapper}>
      <ReportsFilters
        filter={filter}
        onChangeFilter={(updatedFilter) => setFilter(updatedFilter)}
        isExporting={exportRequestStatus === 'PENDING' || isToastDisplayed}
        onClickQualityReports={() =>
          exportReports(() =>
            exportQualityReports({
              ...reportParams,
              name: props.t('Exposure Quality Check'),
            })
          )
        }
        onClickDiagnosticsRecords={() =>
          exportReports(() =>
            exportDiagnosticsRecords({
              ...reportParams,
              name: props.t('Diagnostic Records'),
            })
          )
        }
        onClickMedicationRecords={() =>
          exportReports(() =>
            exportMedicationRecords({
              ...reportParams,
              name: props.t('Medication Records'),
            })
          )
        }
        onClickNullDataReport={() =>
          exportReports(() =>
            exportNullDataReport({
              ...reportParams,
              name: props.t('Null Data & Logic Check Report'),
            })
          )
        }
        onClickHapAuthStatus={() =>
          exportReports(() =>
            exportHapAuthStatus({
              ...reportParams,
              name: props.t('HAP Authorization Status'),
            })
          )
        }
        onClickConcussionBaselineAudit={() =>
          exportReports(() =>
            exportConcussionBaselineAudit({
              ...reportParams,
              name: props.t('Concussion Baseline Audit'),
            })
          )
        }
        onClickParticipantExposure={() =>
          exportReports(() =>
            exportParticipantExposure({
              ...reportParams,
              name: props.t('HAP Participant Exposure'),
            })
          )
        }
        onClickHapCovidBranch={() =>
          exportReports(() =>
            exportHapCovidBranch({
              ...reportParams,
              name: props.t('HAP Covid Branch'),
            })
          )
        }
      />
      <ToastDialog toasts={toasts} onCloseToast={closeToast} />
    </div>
  );
};

export const ReportsTabTranslated: ComponentType<Props> =
  withNamespaces()(ReportsTab);
export default ReportsTab;
