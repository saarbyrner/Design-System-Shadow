// @flow
import { withNamespaces } from 'react-i18next';
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { ExportsItem, ExportType } from '@kitman/common/src/types/Exports';
import type { Cell } from '@kitman/components/src/DataGrid';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { DataGrid, TextButton } from '@kitman/components';
import DisclaimerPopupModal from '@kitman/modules/src/DisclaimerPopupModal/src/DisclaimerPopupModal';
import {
  getDisclaimerContent,
  DISCLAIMER_TYPE,
} from '@kitman/modules/src/DisclaimerPopupModal/utils';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import style from '../styles';

type Props = {
  isNextPageAvailable: boolean,
  onTriggerExport: Function,
  onRefreshList: Function,
  fetchedData: Array<ExportsItem>,
  isLoading: boolean,
  fetchMoreItems: Function,
};

const ExportList = (props: I18nProps<Props>) => {
  const [rows, setRows] = useState([]);
  const { permissions } = usePermissions();
  const { organisation } = useOrganisation();

  const [showNFLDisclaimerOnExport, setShowNFLDisclaimerOnExport] =
    useState<boolean>(false);

  const isLoginOrganisation =
    organisation?.organisation_type === 'login_organisation';

  const showNFLDisclaimer =
    window.featureFlags['nfl-disclaimer-popup-player-medical-record'];

  const nflDisclaimerOnLoadLocalStorage = 'ExportsPage|NFLDisclaimer|OnLoad';

  const columns = [
    {
      id: 'name',
      content: props.t('Name'),
      isHeader: true,
    },
    {
      id: 'export_type',
      content: props.t('Export Type'),
      isHeader: true,
    },
    {
      id: 'created_at',
      content: props.t('Created Date & Time'),
      isHeader: true,
    },
    {
      id: 'download_link',
      content: props.t('Download link'),
      isHeader: true,
    },
    {
      id: 'status',
      content: props.t('Status'),
      isHeader: true,
    },
  ];

  const getStatusIndicator = (
    itemStatus: $PropertyType<ExportsItem, 'status'>
  ) => {
    if (itemStatus === 'pending' || itemStatus === 'running') {
      return (
        <span
          css={{
            // $FlowIgnore[invalid-computed-prop]
            [style.statusIndicator]: style.inProgressStatus,
          }}
        >
          {props.t('In progress')}
        </span>
      );
    }
    if (itemStatus === 'completed') {
      return (
        <span
          css={{
            // $FlowIgnore[invalid-computed-prop]
            [style.statusIndicator]: style.successStatus,
          }}
        >
          {props.t('Completed')}
        </span>
      );
    }
    if (itemStatus === 'errored') {
      return (
        <span
          css={{
            // $FlowIgnore[invalid-computed-prop]
            [style.statusIndicator]: style.errorStatus,
          }}
        >
          {props.t('Error')}
        </span>
      );
    }

    if (itemStatus === 'expired') {
      return (
        <span
          css={{
            // $FlowIgnore[invalid-computed-prop]
            [style.statusIndicator]: style.expiredStatus,
          }}
        >
          {props.t('Expired')}
        </span>
      );
    }
    return null;
  };

  const getExportTypeText = (exportType: ExportType) => {
    switch (exportType) {
      case 'diagnostic_billing': {
        return props.t('Diagnostic Billing');
      }
      case 'exposure_quality_check':
      case 'diagnostics_report':
      case 'medication_records':
      case 'hap_authorization_status':
      case 'hap_covid_branch':
      case 'concussion_baseline_audit':
      case 'participant_exposure':
      case 'null_data_report': {
        return props.t('Quality Reports');
      }
      case 'treatment_billing': {
        return props.t('Treatment Billing');
      }
      case 'athlete_medical_export': {
        return props.t('Medical Export');
      }
      case 'nfl_player_detail_report': {
        return props.t('Player Detail Export');
      }
      case 'multi_document': {
        return props.t('Multi Document Export');
      }
      case 'governance_export': {
        return props.t('Governance Export');
      }
      case 'registration_players_export': {
        return props.t('Registration Player Export');
      }
      case 'registration_staff_export': {
        return props.t('Registration Staff Export');
      }
      case 'yellow_cards_export':
      case 'red_cards_export':
      case 'mls_athlete_cards_export':
      case 'mls_staff_cards_export': {
        return props.t('Card Export');
      }
      case 'injury_detail_export': {
        return props.t('Injury Detail Export');
      }
      case 'injury_medication_export': {
        return props.t('Injury Medication Export');
      }
      case 'time_loss_all_activity_export': {
        return props.t('Time Loss (All activities) Export');
      }
      case 'injury_report_export':
      case 'bulk_injury_medication_report_export': {
        return props.t('Injury Report Export');
      }
      case 'bulk_athlete_medical_export': {
        return props.t('Medical Export');
      }
      case 'medications_report_export': {
        return props.t('Medications Report Export');
      }
      case 'osha_report_export': {
        return props.t('OSHA Report Export');
      }
      case 'match_report_export': {
        return props.t('Match Report Export');
      }
      case 'match_monitor_report_export': {
        return props.t('Match Monitor Export');
      }
      case 'homegrown_plus_9': {
        return props.t('Homegrown +9 Export');
      }
      case 'homegrown_45': {
        return props.t('Homegrown 45 Export');
      }
      case 'homegrown_post_formation': {
        return props.t('Post-formation Export');
      }
      case 'homegrown_export': {
        return props.t('Homegrown Export');
      }
      case 'injuries_summary_export':
      case 'issue_summary': {
        return props.t('Injury Analysis Export');
      }
      case 'scout_access_export': {
        return props.t('Visiting scout attendees export');
      }
      case 'scout_attendee_export': {
        return props.t('Internal scout schedule export');
      }
      case 'payment_export': {
        return props.t('Payment Export');
      }
      default: {
        return '';
      }
    }
  };

  const getRowCellContent = (columnCell: Cell, exportedItem: ExportsItem) => {
    switch (columnCell.id) {
      case 'name': {
        return exportedItem.name;
      }
      case 'export_type': {
        return getExportTypeText(exportedItem.export_type);
      }
      case 'created_at': {
        return DateFormatter.formatStandard({
          date: moment(exportedItem.created_at),
          showTime: true,
        });
      }
      case 'download_link': {
        return (
          <span css={style.downloadLink}>
            {exportedItem.status === 'completed' ? (
              <>
                <i className="icon-link" />
                <a
                  href={exportedItem.attachments[0]?.url || ''}
                  title={exportedItem.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={
                    (exportedItem.attachments?.length > 0 &&
                      exportedItem.attachments[0]?.filename
                        ?.split('/')
                        .pop()) ||
                    exportedItem.name
                  }
                >
                  {props.t('Link')}
                </a>
              </>
            ) : (
              <span>--</span>
            )}
          </span>
        );
      }
      case 'status': {
        return getStatusIndicator(exportedItem.status);
      }
      default: {
        return null;
      }
    }
  };

  const buildRowCells = (exportedItem: ExportsItem) => {
    const itemCells = [];
    columns.forEach((columnCell) => {
      itemCells.push({
        id: columnCell.id,
        content: getRowCellContent(columnCell, exportedItem),
      });
    });
    return itemCells;
  };

  const buildRows = () => {
    return props.fetchedData?.map((exportedItem) => {
      return {
        id: exportedItem.id,
        cells: buildRowCells(exportedItem),
      };
    });
  };

  useEffect(() => {
    setRows(buildRows());
  }, [props.fetchedData]);

  // A login organisation is not a real organisation, so no permissions are available
  // To get around this, when an athlete logs in to this 'org' they need
  // to be able to run an export.
  // However, if an athlete does log into a real org, then the existing permission check needs to remain
  const canRenderExportActions = (): boolean => {
    return (
      window.featureFlags['athlete-run-medical-export'] &&
      (isLoginOrganisation || permissions?.user?.canExportOwnMedicalData)
    );
  };

  return (
    <div css={style.container}>
      <div css={style.header}>
        <h6>{props.t('Your Exports')}</h6>

        {canRenderExportActions() && (
          <div css={style.actionButtons}>
            <TextButton
              text={props.t('Refresh List')}
              type="default"
              onClick={props.onRefreshList}
              kitmanDesignSystem
            />
            <TextButton
              text={
                showNFLDisclaimer
                  ? props.t('Generate Medical Record')
                  : props.t('Export')
              }
              type="primary"
              onClick={
                showNFLDisclaimer
                  ? () => setShowNFLDisclaimerOnExport(true)
                  : props.onTriggerExport
              }
              kitmanDesignSystem
            />
          </div>
        )}
      </div>
      <DataGrid
        columns={columns}
        rows={rows}
        isFullyLoaded={!props.isNextPageAvailable && !props.isLoading}
        fetchMoreData={props.fetchMoreItems}
        isTableEmpty={props.fetchedData?.length === 0}
        emptyTableText={props.t('No exports have been made.')}
        scrollOnBody
      />
      {showNFLDisclaimer &&
        ((getIsLocalStorageAvailable() &&
          !window.localStorage?.getItem(nflDisclaimerOnLoadLocalStorage)) ||
          !getIsLocalStorageAvailable()) && (
          <DisclaimerPopupModal
            primaryActionDisabledByDefault
            disclaimer={getDisclaimerContent(
              DISCLAIMER_TYPE.NFL_PLAYER_DISCLAIMER_ON_LOAD
            )}
            localStorageKey={nflDisclaimerOnLoadLocalStorage}
          />
        )}
      {showNFLDisclaimer && showNFLDisclaimerOnExport && (
        <DisclaimerPopupModal
          primaryActionDisabledByDefault
          disclaimer={getDisclaimerContent(
            DISCLAIMER_TYPE.NFL_PLAYER_DISCLAIMER_ON_EXPORT
          )}
          onPrimaryAction={() => {
            setShowNFLDisclaimerOnExport(false);
            props.onTriggerExport();
          }}
        />
      )}
    </div>
  );
};

export const ExportListTranslated = withNamespaces()(ExportList);
export default ExportList;
