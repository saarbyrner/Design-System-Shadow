// @flow
import { useState } from 'react';
import classNames from 'classnames';
import i18n from '@kitman/common/src/utils/i18n';
import _cloneDeep from 'lodash/cloneDeep';
import { TrackEvent, isColourDark } from '@kitman/common/src/utils';
import { getTimePeriodName } from '@kitman/common/src/utils/status_utils';
import type { DateRange } from '@kitman/common/src/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { SquadAthletes } from '@kitman/components/src/types';
import { AppStatus, ErrorBoundary, TooltipMenu } from '@kitman/components';
import {
  getSelectedItems,
  isSelectionEmpty,
} from '@kitman/components/src/AthleteSelector/utils';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { backgroundColorValueMap } from '../utils';

type Props = {
  backgroundColor: string,
  canManageDashboard: boolean,
  userName: string,
  isPreview: boolean,
  name?: string,
  onDelete: Function,
  onDuplicate: Function,
  onEdit: Function,
  orgLogo?: string,
  orgName: string,
  hideOrgDetails?: boolean,
  selectedDateRange?: DateRange,
  selectedPopulation: Object,
  selectedTimePeriod?: string,
  showOrgLogo: boolean,
  showOrgName: boolean,
  squadAthletes: SquadAthletes,
  squadName: string,
  squads: Array<Squad>,
  widgetId?: number,
};

function HeaderWidget(props: Props) {
  const isDashboardUIUpgradeFF =
    window.getFlag('rep-dashboard-ui-upgrade');

  const [feedbackModalStatus, setFeebackModalStatus] = useState(null);
  const [feedbackModalMessage, setFeebackModalMessage] = useState(null);

  const pivotDateRange =
    props.selectedDateRange &&
    !!props.selectedDateRange.start_date &&
    !!props.selectedDateRange.end_date;
  const pivotTimePeriod = !!props.selectedTimePeriod;

  const hasDarkBackground = isColourDark(props.backgroundColor);
  const isTransparent =
    props.backgroundColor === backgroundColorValueMap.transparent;

  const showWhiteFont = hasDarkBackground && !isTransparent;
  const showBlackFont = !hasDarkBackground || isTransparent;

  // returns the selected custom date range or selected time period
  // from the 'Date Range' tab of the pivot sliding panel
  const getPivotedDate = () => {
    if (pivotDateRange || pivotTimePeriod) {
      return getTimePeriodName(props.selectedTimePeriod, {
        startDate:
          props.selectedDateRange && props.selectedDateRange.start_date,
        endDate: props.selectedDateRange && props.selectedDateRange.end_date,
      });
    }

    return '';
  };

  const getWidgetMenu = () => {
    const editWidget = {
      description: i18n.t('Edit Widget'),
      icon: 'icon-edit',
      onClick: () => {
        TrackEvent('Edit widget header', 'Click', 'Edit widget header');
        props.onEdit(
          props.widgetId,
          props.name,
          _cloneDeep(props.selectedPopulation),
          props.backgroundColor,
          props.showOrgLogo,
          props.showOrgName,
          props.hideOrgDetails
        );
      },
    };

    const duplicateWidget = {
      description: i18n.t('Duplicate Widget'),
      icon: 'icon-duplicate',
      onClick: () => {
        TrackEvent('Graph Dashboard', 'Click', 'Duplicate widget header');
        props.onDuplicate();
      },
    };

    const deleteWidget = {
      description: i18n.t('Delete'),
      icon: 'icon-bin',
      onClick: () => {
        TrackEvent('Edit widget header', 'Click', 'Delete widget header');
        setFeebackModalStatus('confirm');
        setFeebackModalMessage(i18n.t('Delete Header widget?'));
      },
    };

    const iconColor = showBlackFont ? 'headerWidget--blackFont' : '';

    return (
      <TooltipMenu
        placement="bottom-end"
        offset={[10, 10]}
        menuItems={[editWidget, duplicateWidget, deleteWidget]}
        onVisibleChange={(isVisible) => {
          if (isVisible) {
            TrackEvent(
              'Meat ball menu header widget',
              'Click',
              'Open header widget menu'
            );
          } else {
            TrackEvent(
              'Meat ball menu header widget',
              'Click',
              'Close header widget menu'
            );
          }
        }}
        tooltipTriggerElement={
          <button type="button" className="headerWidget__widgetMenu">
            <i
              className={
                isDashboardUIUpgradeFF
                  ? `icon-hamburger-circled-dots ${iconColor}`
                  : 'icon-more'
              }
            />
          </button>
        }
        kitmanDesignSystem
      />
    );
  };

  const classes = classNames('headerWidget', {
    'headerWidget--pivoted':
      pivotDateRange ||
      pivotTimePeriod ||
      !isSelectionEmpty(props.selectedPopulation),
    'headerWidget--whiteFont': showWhiteFont,
    'headerWidget--blackFont': showBlackFont,
  });

  const showWidgetMenu = !props.isPreview && props.canManageDashboard;

  return (
    <ErrorBoundary>
      <div className={classes} style={{ background: props.backgroundColor }}>
        {props.showOrgLogo ? (
          <img className="headerWidget__logo" src={props.orgLogo} alt="" />
        ) : null}
        <div className="headerWidget__leftDetails">
          <span className="headerWidget__name">{props.name}</span>
          <span className="headerWidget__pivotDate">{getPivotedDate()}</span>
          <span className="headerWidget__reportDate">
            {`${i18n.t('Report Date')}: ${
              window.featureFlags['standard-date-formatting']
                ? DateFormatter.formatStandard({ date: moment() })
                : moment(Date.now()).format('D MMM YYYY')
            }`}
          </span>
        </div>
        <div className="headerWidget__rightDetails">
          {!props.hideOrgDetails && (
            <>
              <span className="headerWidget__orgSquad">
                {props.showOrgName
                  ? `${props.orgName} - ${props.squadName}`
                  : `${props.squadName}`}
              </span>
              <span className="headerWidget__pivotAthletes">
                {getSelectedItems(
                  props.selectedPopulation,
                  props.squadAthletes,
                  props.squads
                )}
              </span>
              <span className="headerWidget__currentUser">
                {`${i18n.t('Report by')}: ${props.userName}`}
              </span>
            </>
          )}
        </div>

        {/* check permission */}
        {showWidgetMenu && (
          <div className="headerWidget__rightDetails--action">
            {getWidgetMenu()}
          </div>
        )}
      </div>
      <AppStatus
        status={feedbackModalStatus}
        message={feedbackModalMessage}
        confirmButtonText={i18n.t('Delete')}
        hideConfirmation={() => {
          setFeebackModalStatus(null);
          setFeebackModalMessage(null);
        }}
        close={() => {
          setFeebackModalStatus(null);
          setFeebackModalMessage(null);
        }}
        confirmAction={() => {
          props.onDelete();
        }}
      />
    </ErrorBoundary>
  );
}

HeaderWidget.defaultProps = {
  backgroundColor: '#ffffff',
  isPreview: false,
  name: '',
  selectedTimePeriod: '',
};

export default HeaderWidget;
