// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import $ from 'jquery';
import { AppStatus, DateRangePicker, Dropdown } from '@kitman/components';
import type { DateRange } from '@kitman/common/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { TrainingSession, Game } from '@kitman/common/src/types/Workload'; // MOVE THAT
import type { I18nProps } from '@kitman/common/src/types/i18n';

import {
  getDefaultDateRange,
  getGamesDropdownItems,
  getTraininsgSessionDropdownItems,
} from './utils';

type Props = {
  sessionType: 'Game' | 'TrainingSession',
  initialDateRange: DateRange,
  sessionId: number,
  turnaroundList: Array<Turnaround>,
  onChange: (number) => void,
};

const SessionSelector = (props: I18nProps<Props>) => {
  const [dateRange, setDateRange] = useState(
    props.initialDateRange || getDefaultDateRange()
  );
  const [sessions, setSessions]: [Array<Game | TrainingSession>, Function] =
    useState([]);
  const [requestStatus, setRequestStatus] = useState();

  const fetchSessionList = () => {
    setRequestStatus('LOADING');
    let url;
    if (props.sessionType === 'Game') {
      url = '/workloads/games';
    } else if (props.sessionType === 'TrainingSession') {
      url = '/workloads/training_sessions';
    }

    return $.ajax({
      method: 'GET',
      url,
      data: { start_date: dateRange.start_date, end_date: dateRange.end_date },
      success: (response) => {
        setRequestStatus('SUCCESS');
        setSessions(response);
      },
      error: () => {
        setRequestStatus('ERROR');
      },
    });
  };

  useEffect(() => {
    const xhr = fetchSessionList();

    return () => {
      xhr.abort(); // Cancel the request on unmount
    };
  }, [dateRange]);

  const getEmptyText = () => {
    if (props.sessionType === 'Game') {
      return props.t('No games available for date range.');
    }

    if (props.sessionType === 'TrainingSession') {
      return props.t('No sessions available for date range');
    }

    return '';
  };

  const getSessionLabel = () => {
    if (props.sessionType === 'Game') {
      return props.t('#sport_specific__Games');
    }

    if (props.sessionType === 'TrainingSession') {
      return props.t('Training Sessions');
    }

    return '';
  };

  const getSessionsDropdownItems = () => {
    if (props.sessionType === 'Game') {
      // $FlowFixMe sessions is a list of game
      return getGamesDropdownItems(sessions);
    }

    if (props.sessionType === 'TrainingSession') {
      // $FlowFixMe sessions is a list of training session
      return getTraininsgSessionDropdownItems(sessions);
    }

    return [];
  };

  return (
    <div className="sessionSelector">
      <label className="sessionSelector__label">{props.t('Date Range')}</label>
      <DateRangePicker
        turnaroundList={props.turnaroundList}
        onChange={(selectedDateRange) => setDateRange(selectedDateRange)}
        value={dateRange}
        position="center"
      />
      <Dropdown
        onChange={(sessionId) => props.onChange(sessionId)}
        emptyText={getEmptyText()}
        items={getSessionsDropdownItems()}
        label={getSessionLabel()}
        value={props.sessionId}
        disabled={requestStatus === 'LOADING'}
        searchable
        displayEmptyText
      />

      {requestStatus === 'ERROR' && <AppStatus status="error" />}
    </div>
  );
};

export default SessionSelector;
export const SessionSelectorTranslated = withNamespaces()(SessionSelector);
