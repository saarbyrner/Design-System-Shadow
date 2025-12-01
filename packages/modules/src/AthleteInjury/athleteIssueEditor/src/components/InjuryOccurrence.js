// @flow
import type { Node } from 'react';

import { Component } from 'react';
import moment from 'moment';
import type {
  DropdownItem,
  GroupedDropdownItem,
} from '@kitman/components/src/types';
import { withNamespaces } from 'react-i18next';
import {
  DatePicker,
  Dropdown,
  GroupedDropdown,
  InputNumeric,
  Checkbox,
} from '@kitman/components';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  activityGroupOptions: Array<Object>,
  gameOptions: Array<Object>,
  periodOptions: Array<Object>,
  trainingSessionOptions: Array<DropdownItem>,
  positionGroupOptions: Array<GroupedDropdownItem>,
  formMode: 'EDIT' | 'CREATE',
  formType: 'INJURY' | 'ILLNESS',

  periodTerm: ?string,
  activityType: string,
  activity_id: string,
  occurrenceDate: string,
  game: string,
  gameTime: string,
  periodId: number,
  trainingSession: string,
  positionGroupId: string,
  isSessionCompleted: boolean,
  isFetchingGameAndTrainingOptions: boolean,
  priorResolvedDate?: string,
  isDisabled: boolean,

  getGameAndTrainingOptions: Function,
  updateOccurrenceDate: Function,
  updateActivity: Function,
  updateTrainingSession: Function,
  updateGame: Function,
  updatePeriod: Function,
  updateGameTime: Function,
  updatePositionGroup: Function,
  updateSessionCompleted: Function,
};

class InjuryOccurrence extends Component<I18nProps<Props>> {
  // Get the game and training options on the first load.
  componentDidMount() {
    if (this.props.formMode === 'CREATE') {
      this.props.getGameAndTrainingOptions(moment().format(dateTransferFormat));
    } else {
      this.props.getGameAndTrainingOptions(
        moment(this.props.occurrenceDate).format(dateTransferFormat)
      );
    }
  }

  onGameChange(gameId: string) {
    const selectedGame = this.props.gameOptions.filter(
      (game) => String(game.id) === String(gameId)
    );
    const gameDate = selectedGame.length > 0 ? selectedGame[0].date : null;

    this.props.updateGame(gameId, gameDate);
  }

  renderEventSection(formType: 'INJURY' | 'ILLNESS', eventSection: Node) {
    return formType === 'INJURY' && eventSection ? (
      <div className="row athleteIssueEditor__row">{eventSection}</div>
    ) : null;
  }

  renderActivityField(formType: 'INJURY' | 'ILLNESS') {
    return formType === 'INJURY' ? (
      <div className="col-lg-4 athleteIssueEditor__activityField">
        <GroupedDropdown
          label={this.props.t('Activity')}
          options={this.props.activityGroupOptions}
          onChange={(activity) =>
            this.props.updateActivity(activity.id, activity.type)
          }
          value={this.props.activity_id}
          isDisabled={this.props.isDisabled}
          searchable
        />
      </div>
    ) : null;
  }

  renderPeriodSelect() {
    return window.featureFlags['injury-game-period'] ? (
      <div className="col-lg-3">
        <Dropdown
          label={this.props.periodTerm || this.props.t('Period')}
          name="athleteIssueEditor_period_dropdown"
          items={this.props.periodOptions}
          onChange={(periodId) => this.props.updatePeriod(periodId)}
          value={this.props.periodId}
          disabled={
            this.props.isFetchingGameAndTrainingOptions || this.props.isDisabled
          }
        />
      </div>
    ) : null;
  }

  render() {
    const sessionCompletedCheckbox = (
      <div
        className={`${
          window.featureFlags['injury-game-period'] ? 'col-lg-3' : 'col-lg-4'
        } athleteIssueEditor__sessionCompletedField`}
      >
        <Checkbox
          label={this.props.t('Session completed')}
          id="isSessionCompletedField"
          isChecked={this.props.isSessionCompleted}
          toggle={(checkbox) =>
            this.props.updateSessionCompleted(checkbox.checked)
          }
          isLabelPositionedOnTheLeft
          isDisabled={this.props.isDisabled}
          name="athleteIssueEditor__sessionCompletedField"
        />
      </div>
    );

    const trainingSessionSection = (
      <>
        <div className="col-lg-4 athleteIssueEditor__trainingSession">
          <Dropdown
            label={this.props.t('Training Session')}
            name="athleteIssueEditor_training_session_dropdown"
            items={this.props.trainingSessionOptions}
            onChange={(trainingSessionId) =>
              this.props.updateTrainingSession(trainingSessionId)
            }
            value={this.props.trainingSession}
            disabled={
              this.props.isFetchingGameAndTrainingOptions ||
              this.props.isDisabled
            }
            searchable
          />
        </div>
        {sessionCompletedCheckbox}
        <div className="w-100" />
        <div className="col-lg-4 athleteIssueEditor__position">
          <GroupedDropdown
            label={this.props.t('#sport_specific__Position_when_Injured')}
            options={this.props.positionGroupOptions}
            onChange={(positionGroup) =>
              this.props.updatePositionGroup(positionGroup.key_name)
            }
            value={this.props.positionGroupId}
            isDisabled={this.props.isDisabled}
          />
        </div>
      </>
    );

    const gameSection = (
      <>
        <div className="col-lg-4">
          <Dropdown
            label={this.props.t('Game')}
            name="athleteIssueEditor_game_dropdown"
            items={this.props.gameOptions}
            onChange={(gameId) => this.onGameChange(gameId)}
            value={this.props.game}
            disabled={
              this.props.isFetchingGameAndTrainingOptions ||
              this.props.isDisabled
            }
            searchable
          />
        </div>
        {this.renderPeriodSelect()}
        <div className="col-lg-2">
          <InputNumeric
            label={this.props.t('Time')}
            descriptor="mins"
            value={this.props.gameTime}
            onChange={(gameTime) => this.props.updateGameTime(gameTime)}
            name="athleteIssueEditor_time_input"
            optional
            disabled={this.props.isDisabled}
            t={(key) => key}
          />
        </div>
        {sessionCompletedCheckbox}
        <div className="w-100" />
        <div className="col-lg-4 athleteIssueEditor__position">
          <GroupedDropdown
            label={this.props.t('#sport_specific__Position_when_Injured')}
            options={this.props.positionGroupOptions}
            onChange={(positionGroup) =>
              this.props.updatePositionGroup(positionGroup.key_name)
            }
            value={this.props.positionGroupId}
            isDisabled={this.props.isDisabled}
          />
        </div>
      </>
    );

    let eventSection;
    if (this.props.activityType === 'game') {
      eventSection = gameSection;
    } else if (this.props.activityType === 'training') {
      eventSection = trainingSessionSection;
    } else {
      eventSection = null;
    }

    const titleClass = `
      col-lg-12
      athleteIssueEditor__sectionTitle
      ${
        this.props.isDisabled
          ? 'athleteIssueEditor__sectionTitle--disabled'
          : ''
      }
    `;

    return (
      <>
        <div className="row athleteIssueEditor__row">
          <h5 className={titleClass}>{this.props.t('Event')}</h5>
          <div className="col-lg-4">
            <DatePicker
              label={
                this.props.formType === 'INJURY'
                  ? this.props.t('Date of Injury')
                  : this.props.t('Date of Illness')
              }
              onDateChange={(newDate) => {
                this.props.getGameAndTrainingOptions(
                  moment(newDate).format(dateTransferFormat)
                );
                this.props.updateOccurrenceDate(newDate);
              }}
              name="InjuryOccurrenceDate"
              value={this.props.occurrenceDate}
              disabled={
                this.props.isFetchingGameAndTrainingOptions ||
                this.props.isDisabled
              }
              minDate={
                !this.props.isDisabled ? this.props.priorResolvedDate : null
              }
              disableFutureDates
            />
          </div>
          {this.renderActivityField(this.props.formType)}
        </div>
        {this.renderEventSection(this.props.formType, eventSection)}
      </>
    );
  }
}

export const InjuryOccurrenceTranslated = withNamespaces()(InjuryOccurrence);
export default InjuryOccurrence;
