/* eslint-disable react/sort-comp */
// @flow
import { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';

import {
  AppStatus,
  DateRangePicker,
  Dropdown,
  GroupedDropdown,
  LastXPeriodPicker,
  MultiSelectDropdown,
} from '@kitman/components';
import { buildEventTypeTimePeriodOptions } from '@kitman/modules/src/analysis/shared/utils';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { EVENT_TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type {
  DropdownItem,
  MultiSelectDropdownItem,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { DateRange } from '@kitman/common/src/types';
import { TrackEvent } from '@kitman/common/src/utils';
import type {
  TrainingSession,
  Game,
  EventBreakdown,
} from '@kitman/modules/src/analysis/shared/types';
import type { Drill } from '@kitman/modules/src/analysis/GraphComposer/src/types';

type Props = {
  graphGroup?: string,
  metricIndex: number,
  populateTrainingSessions: Function,
  populateGames: Function,
  trainingSessions: Array<TrainingSession>,
  games: Array<Game>,
  drills: Array<Drill>,
  eventTypeTimePeriod: ?string,
  updateDateRange: Function,
  populateDrills: Function,
  updateSelectedGames: Function,
  updateSelectedTrainingSessions: Function,
  updateEventBreakdown: Function,
  populateDrillsForm: Function,
  selectedGames: Array<Game>,
  selectedTrainingSessions: Array<TrainingSession>,
  eventBreakdown: ?EventBreakdown,
  dateRange: DateRange,
  turnaroundList: Array<Turnaround>,
  timePeriodLength: ?number,
  onUpdateTimePeriodLength: Function,
  lastXTimePeriod: 'weeks' | 'days',
  onUpdateLastXTimePeriod: Function,
};

class SessionDateRange extends Component<I18nProps<Props>> {
  componentDidMount() {
    // we have to populate events when editing an existing graph to allow
    // the game/training session dropdown to show the value
    if (this.props.dateRange) {
      if (this.props.eventTypeTimePeriod === 'game') {
        this.props.populateGames(this.props.metricIndex, this.props.dateRange);
      }
      if (this.props.eventTypeTimePeriod === 'training_session') {
        this.props.populateTrainingSessions(
          this.props.metricIndex,
          this.props.dateRange
        );
      }
    }
  }

  handleDateRangeChange(newDateRange: DateRange) {
    if (
      this.props.graphGroup === 'longitudinal' ||
      this.props.graphGroup === 'summary_bar' ||
      this.props.graphGroup === 'value_visualisation'
    ) {
      this.props.updateDateRange(newDateRange);
    } else {
      this.props.updateDateRange(this.props.metricIndex, newDateRange);
    }
    if (this.props.eventTypeTimePeriod === 'training_session') {
      this.props.populateTrainingSessions(this.props.metricIndex, newDateRange);
    }
    if (this.props.eventTypeTimePeriod === 'game') {
      this.props.populateGames(this.props.metricIndex, newDateRange);
    }
  }

  handleSessionChange(
    sessionType: 'game' | 'training_session',
    eventIds: Array<number>,
    selectionType: ?'SINGLE_SELECT'
  ) {
    if (sessionType === 'game') {
      this.props.updateSelectedGames(
        this.props.metricIndex,
        eventIds,
        selectionType
      );
    } else {
      this.props.updateSelectedTrainingSessions(
        this.props.metricIndex,
        eventIds,
        selectionType
      );
      // This feature is not fully implemented, so we disable it for now
      // this.props.populateDrills(this.props.metricIndex, eventIds);
    }
  }

  getGameOptions(): Array<DropdownItem | MultiSelectDropdownItem> {
    const allowMultipleSelection =
      this.props.graphGroup === 'longitudinal' ||
      this.props.graphGroup === 'summary_bar';

    return this.props.games && this.props.games.length > 0
      ? this.props.games.map((game) =>
          allowMultipleSelection
            ? {
                id: game.id.toString(),
                name: `${game.opponent_team_name} (${
                  window.featureFlags['standard-date-formatting']
                    ? DateFormatter.formatStandard({
                        date: moment(
                          game.date,
                          DateFormatter.dateTransferFormat
                        ),
                      })
                    : moment(
                        game.date,
                        DateFormatter.dateTransferFormat
                      ).format('D MMM YYYY')
                })`,
              }
            : {
                id: game.id,
                title: `${game.opponent_team_name} (${
                  window.featureFlags['standard-date-formatting']
                    ? DateFormatter.formatStandard({
                        date: moment(
                          game.date,
                          DateFormatter.dateTransferFormat
                        ),
                      })
                    : moment(
                        game.date,
                        DateFormatter.dateTransferFormat
                      ).format('D MMM YYYY')
                })`,
              }
        )
      : [];
  }

  gameDayPlusMinusInfoBuilder(session: TrainingSession) {
    let gameDayPlusMinusInfo = '(';
    if (session.game_day_plus) {
      gameDayPlusMinusInfo += `+${session.game_day_plus}`;
    }
    if (session.game_day_plus && session.game_day_minus) {
      gameDayPlusMinusInfo += `, `;
    }
    if (session.game_day_minus) {
      gameDayPlusMinusInfo += `-${session.game_day_minus}`;
    }
    gameDayPlusMinusInfo += `)`;
    return gameDayPlusMinusInfo;
  }

  formatMultiSelectOption(session: TrainingSession) {
    const dropdownItem = {
      id: session.id.toString(),
      name: `${session.session_type_name} - ${
        window.featureFlags['standard-date-formatting']
          ? DateFormatter.formatStandard({
              date: moment(session.date, DateFormatter.dateTransferFormat),
            })
          : moment(session.date, DateFormatter.dateTransferFormat).format(
              'MMM D, YYYY'
            )
      }`,
    };

    if (session.game_day_plus || session.game_day_minus) {
      // $FlowFixMe
      dropdownItem.description = this.gameDayPlusMinusInfoBuilder(session);
    }

    return dropdownItem;
  }

  formatDropdownOption(session: TrainingSession) {
    const dropdownItem = {
      id: session.id.toString(),
      title: `${session.session_type_name} - ${
        window.featureFlags['standard-date-formatting']
          ? DateFormatter.formatStandard({
              date: moment(session.date, DateFormatter.dateTransferFormat),
            })
          : moment(session.date, DateFormatter.dateTransferFormat).format(
              'MMM D, YYYY'
            )
      }`,
    };
    if (session.game_day_plus || session.game_day_minus) {
      // $FlowFixMe
      dropdownItem.description = this.gameDayPlusMinusInfoBuilder(session);
    }

    return dropdownItem;
  }

  getTrainingSessionOptions(): Array<DropdownItem | MultiSelectDropdownItem> {
    const allowMultipleSelection =
      this.props.graphGroup === 'longitudinal' ||
      this.props.graphGroup === 'summary_bar';

    return this.props.trainingSessions && this.props.trainingSessions.length > 0
      ? this.props.trainingSessions.map((session) =>
          allowMultipleSelection
            ? this.formatMultiSelectOption(session)
            : this.formatDropdownOption(session)
        )
      : [];
  }

  renderDateRangePicker() {
    const labelClasses = classNames('sessionDateRange__label', {
      'sessionDateRange__label--disabled':
        this.props.graphGroup !== 'summary' && this.props.metricIndex > 0,
    });
    const dateRangePickerEl = (
      <div className="col-xl-3">
        <label className={labelClasses} htmlFor="marker_marker_date">
          {this.props.t('Date Range')}
        </label>
        <DateRangePicker
          turnaroundList={this.props.turnaroundList}
          onChange={(newDateRange) => {
            if (
              this.props.graphGroup === 'longitudinal' ||
              this.props.graphGroup === 'summary_bar' ||
              this.props.graphGroup === 'value_visualisation'
            ) {
              this.props.updateDateRange(newDateRange);
            } else {
              this.props.updateDateRange(this.props.metricIndex, newDateRange);
            }
          }}
          value={this.props.dateRange}
          position="center"
          disabled={
            this.props.graphGroup !== 'summary' && this.props.metricIndex > 0
          }
          allowFutureDate={window.getFlag('reporting-future-dates')}
        />
      </div>
    );

    return dateRangePickerEl;
  }

  renderLastXDaysPicker() {
    return (
      <LastXPeriodPicker
        onPeriodLengthChange={(value) =>
          this.props.onUpdateTimePeriodLength(value)
        }
        onTimePeriodChange={(value) =>
          this.props.onUpdateLastXTimePeriod(value)
        }
        timePeriod={this.props.lastXTimePeriod}
        periodLength={this.props.timePeriodLength}
        radioName={`rollingDateRadios__${this.props.metricIndex}`}
        customClass="sessionDateRange__rollingDatePicker"
        disabled={
          this.props.graphGroup !== 'summary' && this.props.metricIndex > 0
        }
        metricIndex={this.props.metricIndex}
      />
    );
  }

  renderEventTypeFields() {
    const isSessionSelected =
      this.props.eventTypeTimePeriod === 'game' ||
      this.props.eventTypeTimePeriod === 'training_session';

    const labelClasses = classNames('sessionDateRange__label', {
      'sessionDateRange__label--disabled':
        this.props.graphGroup !== 'summary' && this.props.metricIndex > 0,
    });

    return (
      isSessionSelected && (
        <>
          <div className="col-xl-3">
            <label className={labelClasses} htmlFor="marker_marker_date">
              {this.props.t('Date Range')}
            </label>
            <DateRangePicker
              turnaroundList={this.props.turnaroundList}
              onChange={(newDateRange) =>
                this.handleDateRangeChange(newDateRange)
              }
              value={this.props.dateRange}
              position="center"
              disabled={
                this.props.graphGroup !== 'summary' &&
                this.props.metricIndex > 0
              }
              allowFutureDate={window.getFlag('reporting-future-dates')}
            />
          </div>
          <div className="col-xl-3">
            {this.props.eventTypeTimePeriod === 'game' &&
              this.renderGameDropdown()}
            {this.props.eventTypeTimePeriod === 'training_session' &&
              this.renderTrainingSessionDropdown()}
          </div>
        </>
      )
    );
  }

  trackSessionDateDropdown(itemName: string) {
    switch (itemName) {
      case 'This Pre-season':
        TrackEvent('Graph Builder', 'Click', 'This Pre Season');
        break;
      case 'This In-season':
        TrackEvent('Graph Builder', 'Click', 'This In Season');
        break;
      default:
        TrackEvent('Graph Builder', 'Click', itemName);
        break;
    }
  }

  trackSessionBreakdownDropdown(breakdownTypeId: EventBreakdown) {
    const isGame = this.props.eventTypeTimePeriod === 'game';
    if (breakdownTypeId === 'SUMMARY') {
      TrackEvent(
        'Graph Builder',
        'Click',
        isGame ? 'Game Summary' : 'Training Summary'
      );
    } else if (breakdownTypeId === 'DRILLS') {
      TrackEvent(
        'Graph Builder',
        'Click',
        isGame ? 'Game Breakdown' : 'Training Breakdown'
      );
    }
  }

  renderSessionBreakdownSelect() {
    const isTrainingSession =
      this.props.eventTypeTimePeriod === 'training_session';
    const isGame = this.props.eventTypeTimePeriod === 'game';

    const isSessionSelected = () => {
      if (isTrainingSession) {
        return !this.props.selectedTrainingSessions.length;
      }
      if (isGame) {
        return !this.props.selectedGames.length;
      }
      return false;
    };

    const hasMultipleSessionSelected = () => {
      if (isTrainingSession) {
        return this.props.selectedTrainingSessions.length > 1;
      }
      if (isGame) {
        return this.props.selectedGames.length > 1;
      }
      return false;
    };

    const items = [
      {
        id: 'SUMMARY',
        title: this.props.t('Session Summary'),
      },
    ];

    const isSessionSummaryOnly =
      this.props.graphGroup === 'summary' ||
      this.props.graphGroup === 'summary_bar' ||
      this.props.graphGroup === 'value_visualisation';

    if (!isSessionSummaryOnly) {
      items.push({
        id: 'DRILLS',
        title: this.props.t('Session Breakdown'),
      });
    }
    return isTrainingSession || isGame ? (
      <div className="col-xl-3 sessionDateRange__breakdown">
        <Dropdown
          onChange={(breakdownTypeId) => {
            this.props.updateEventBreakdown(
              this.props.metricIndex,
              breakdownTypeId
            );
            this.trackSessionBreakdownDropdown(breakdownTypeId);
          }}
          items={items}
          label={this.props.t('Session Breakdown')}
          disabled={
            isSessionSummaryOnly ||
            isSessionSelected() ||
            hasMultipleSessionSelected() ||
            this.props.metricIndex > 0
          }
          value={this.props.eventBreakdown || ''}
        />
      </div>
    ) : null;
  }

  renderGameDropdown() {
    const allowMultipleSelection =
      this.props.graphGroup === 'longitudinal' ||
      this.props.graphGroup === 'summary_bar';

    return allowMultipleSelection ? (
      <MultiSelectDropdown
        label={this.props.t('Games')}
        listItems={this.getGameOptions()}
        selectedItems={this.props.selectedGames.map((selectedGame) =>
          selectedGame.id.toString()
        )}
        onItemSelect={(checkbox) => {
          let gameSelection =
            this.props.selectedGames.map((selectedGame) => selectedGame.id) ||
            [];
          if (checkbox.checked) {
            gameSelection.push(parseInt(checkbox.id, 10));
          } else {
            gameSelection = gameSelection.filter(
              (selectedGame) => selectedGame !== parseInt(checkbox.id, 10)
            );
          }
          this.handleSessionChange('game', gameSelection);
        }}
        disabled={
          this.props.graphGroup !== 'summary' && this.props.metricIndex > 0
        }
        customClass={
          this.props.selectedGames.length === 0
            ? 'dropdownWrapper--validationFailure'
            : ''
        }
        hasSearch
        emptyText={this.props.t('No games available for date range.')}
      />
    ) : (
      <Dropdown
        onChange={(gameId) =>
          this.handleSessionChange('game', [gameId], 'SINGLE_SELECT')
        }
        emptyText={this.props.t('No games available for date range.')}
        searchable
        displayEmptyText
        items={this.getGameOptions()}
        label={this.props.t('Games')}
        disabled={
          this.props.graphGroup !== 'summary' && this.props.metricIndex > 0
        }
        value={
          this.props.selectedGames &&
          this.props.selectedGames.length > 0 &&
          this.props.selectedGames[0]
            ? this.props.selectedGames[0].id
            : ''
        }
      />
    );
  }

  renderTrainingSessionDropdown() {
    const allowMultipleSelection =
      this.props.graphGroup === 'longitudinal' ||
      this.props.graphGroup === 'summary_bar';

    return allowMultipleSelection ? (
      <MultiSelectDropdown
        label={this.props.t('Training Sessions')}
        listItems={this.getTrainingSessionOptions()}
        hasSelectAll
        onSelectAll={(allItems) => {
          const allItemIds = allItems.map((item) => parseInt(item.id, 10));
          let trainingSessionSelection =
            this.props.selectedTrainingSessions.map(
              (selectedTrainingSession) => selectedTrainingSession.id
            ) || [];

          if (trainingSessionSelection.length === 0) {
            // all items unchecked, check all
            trainingSessionSelection = [...allItemIds];
          } else {
            // all items checked OR some items checked, uncheck all
            trainingSessionSelection = [];
          }

          this.handleSessionChange(
            'training_session',
            trainingSessionSelection
          );
        }}
        selectedItems={this.props.selectedTrainingSessions.map(
          (selectedTrainingSession) => selectedTrainingSession.id.toString()
        )}
        onItemSelect={(checkbox) => {
          let trainingSessionSelection =
            this.props.selectedTrainingSessions.map(
              (selectedTrainingSession) => selectedTrainingSession.id
            ) || [];
          if (checkbox.checked) {
            trainingSessionSelection.push(parseInt(checkbox.id, 10));
          } else {
            trainingSessionSelection = trainingSessionSelection.filter(
              (selectedTrainingSession) =>
                selectedTrainingSession !== parseInt(checkbox.id, 10)
            );
          }
          this.handleSessionChange(
            'training_session',
            trainingSessionSelection
          );
        }}
        disabled={
          this.props.graphGroup !== 'summary' && this.props.metricIndex > 0
        }
        customClass={
          this.props.selectedTrainingSessions.length === 0
            ? 'dropdownWrapper--validationFailure'
            : ''
        }
        hasSearch
        emptyText={this.props.t(
          'No training sessions available for date range.'
        )}
      />
    ) : (
      <Dropdown
        onChange={(trainingSessionId) =>
          this.handleSessionChange(
            'training_session',
            [trainingSessionId],
            'SINGLE_SELECT'
          )
        }
        items={this.getTrainingSessionOptions()}
        label={this.props.t('Training Sessions')}
        emptyText={this.props.t(
          'No training sessions available for date range.'
        )}
        searchable
        displayEmptyText
        disabled={
          this.props.graphGroup !== 'summary' && this.props.metricIndex > 0
        }
        value={
          this.props.selectedTrainingSessions &&
          this.props.selectedTrainingSessions.length > 0 &&
          this.props.selectedTrainingSessions[0]
            ? this.props.selectedTrainingSessions[0].id.toString()
            : ''
        }
      />
    );
  }

  render() {
    return (
      <>
        <div className="col-xl-3">
          <GroupedDropdown
            label={this.props.t('Sessions / Periods')}
            options={buildEventTypeTimePeriodOptions()}
            onChange={(item) => {
              this.props.populateDrillsForm(
                this.props.metricIndex,
                item.key_name
              );
              this.trackSessionDateDropdown(item.name);
            }}
            type="use_id"
            value={this.props.eventTypeTimePeriod || ''}
            isDisabled={
              this.props.graphGroup !== 'summary' && this.props.metricIndex > 0
            }
          />
        </div>
        {this.props.eventTypeTimePeriod ===
          EVENT_TIME_PERIODS.customDateRange && this.renderDateRangePicker()}
        {this.props.eventTypeTimePeriod === EVENT_TIME_PERIODS.lastXDays &&
          this.renderLastXDaysPicker()}
        {(this.props.eventTypeTimePeriod === EVENT_TIME_PERIODS.game ||
          this.props.eventTypeTimePeriod ===
            EVENT_TIME_PERIODS.trainingSession) && (
          <div className="sessionDateRange__eventTypeFields">
            {this.renderEventTypeFields()}
            {this.renderSessionBreakdownSelect()}
          </div>
        )}
        <AppStatus />
      </>
    );
  }
}

export const SessionDateRangeTranslated = withNamespaces()(SessionDateRange);
export default SessionDateRange;
