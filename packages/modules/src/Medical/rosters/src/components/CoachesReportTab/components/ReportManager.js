// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import { Button } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { CoachesReportTranslated as CoachesReport } from '../../RosterOverviewTab/ReportManager/reports/CoachesReport';

type Props = {
  squads: number[],
  dataGridCurrentDate: string,
};

type ReportKey = 'coaches';

const ReportManager = (props: I18nProps<Props>) => {
  const renderMuiExportBtn =
    window.featureFlags?.['coaches-report-v2'] ||
    window.featureFlags?.['coaches-report-refactor'];
  const [openReportSettings, setOpenReportSettings] =
    useState<null | ReportKey>(null);
  const [activeReport, setActiveReport] = useState<?ReportKey>();

  const printReport = (key: ReportKey) => {
    setActiveReport(key);
    // Wrapping the print in a timeout so the newly set active report
    // can render in the dom before triggering the window print
    setTimeout(() => {
      window.print();
    }, 0);
  };

  // NOTE: Feature flag nfl-coaches-report and export permission checked in parent component
  return (
    <>
      {renderMuiExportBtn ? (
        <Button
          size="large"
          color="primary"
          onClick={() => {
            setOpenReportSettings('coaches');
          }}
        >
          {props.t('Export')}
        </Button>
      ) : (
        <TextButton
          type="secondary"
          text={props.t('Export')}
          onClick={() => {
            setOpenReportSettings('coaches');
          }}
          isDisabled={false}
          kitmanDesignSystem
        />
      )}
      <div data-testid="CoachesReportComponent">
        <CoachesReport
          dataGridCurrentDate={props.dataGridCurrentDate}
          squads={props.squads}
          isReportActive={activeReport === 'coaches'}
          printReport={() => printReport('coaches')}
          isSettingsOpen={openReportSettings === 'coaches'}
          closeSettings={() => setOpenReportSettings(null)}
          reportSettingsKey="RosterOverview|CoachesReport"
        />
      </div>
    </>
  );
};

export const ReportManagerTranslated = withNamespaces()(ReportManager);
export default ReportManager;
