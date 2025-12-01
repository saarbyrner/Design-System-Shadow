// @flow
import { useState } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import {
  Checkbox,
  DatePicker,
  Dropdown,
  InputNumeric,
  InputText,
  TimePicker,
} from '@kitman/components';
import { AdvancedEventOptionsTranslated as AdvancedEventOptions } from '@kitman/modules/src/AdvancedEventOptions';

import type { DropdownItem } from '@kitman/components/src/types';
import type {
  Fixture,
  GameFormData,
} from '@kitman/modules/src/GameModal/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

export type Props = {
  gameFormData: GameFormData,
  fixture: Fixture,
  seasonMarkerRange: Array<string>,
  localTimezone: string,
  time: ?Object,
  defaultTime: ?Object,
  score: string,
  opponentScore: string,
  duration: string,
  surfaceType: string,
  surfaceQuality: string,
  weather: string,
  temperature: string,
  isGameActive: boolean,
  handleScoreChange: Function,
  handleOpponentScoreChange: Function,
  onChange: ({ [string]: string }) => void,
  handleTimezoneChange: Function,
  handleTimeChange: Function,
  handleDurationChange: Function,
  handleSurfaceTypeChange: Function,
  handleSurfaceQualityChange: Function,
  handleWeatherChange: Function,
  handleTemperatureChange: Function,
};

const FixtureForm = (props: I18nProps<Props>) => {
  const [isDateInSeasonErrorShowing, setIsDateInSeasonErrorShowing] =
    useState(false);

  const handleValueChange = (attribute: string, value: any) => {
    const changes = {};
    changes[attribute] = value;

    props.onChange(changes);
  };

  const handleDropdownValueChange = (
    listName: string,
    attribute: string,
    attributeName: string,
    value: string
  ) => {
    const changes = {};
    changes[attribute] = value;

    const selectedItem = props.gameFormData[listName].find(
      (item) => item.id === value
    );
    changes[attributeName] = selectedItem ? selectedItem.title : '';

    props.onChange(changes);
  };

  // We don't look at the time because this is not a strict validation.
  // We disable the field if the fixture date is at least the day after today.
  // If the game is later on the day, they can still input a score.
  // If they don't input a score, it would still work as the field is optional.
  const isFixtureDateInFuture = (fixtureDate) => {
    return moment(fixtureDate).isAfter(moment().endOf('day'));
  };

  const formatDate = (date: moment): string => {
    return date.format('YYYY-MM-DD');
  };

  const handleDateChange = (value: string) => {
    setIsDateInSeasonErrorShowing(false);
    handleValueChange('date', formatDate(moment(value)));

    const startOfSeasonMarker = props.seasonMarkerRange[0];
    const endOfSeasonMarker = props.seasonMarkerRange[1];
    const isFixtureDateInSeason =
      moment(value).isAfter(moment(startOfSeasonMarker).startOf('day')) &&
      moment(value).isBefore(moment(endOfSeasonMarker).endOf('day'));
    if (!isFixtureDateInSeason) {
      setIsDateInSeasonErrorShowing(true);
    }

    if (isFixtureDateInFuture(value)) {
      props.handleScoreChange(null);
      props.handleOpponentScoreChange(null);
    }
  };

  const prepareDropdownOptions = (items: Array<DropdownItem>) => {
    if (!props.gameFormData.loaded)
      return [{ id: '', title: `${props.t('Loading')}...` }];

    return items;
  };

  return (
    <div className="gameModalFixtureForm">
      <div className="gameModalgameModalFixtureForm__section">
        <div className="row">
          <div
            className={classNames('col-md-4', {
              'gameModalFixtureForm--error': isDateInSeasonErrorShowing,
            })}
          >
            <DatePicker
              label={props.t('Date')}
              name="date"
              onDateChange={(value) => handleDateChange(value)}
              value={props.fixture.date || null}
              disabled={props.isGameActive}
            />
          </div>
          <div className="col-md-3">
            <TimePicker
              value={props.time}
              onChange={(data) => props.handleTimeChange(data)}
              disabled={props.isGameActive}
              defaultOpenValue={props.defaultTime}
            />
          </div>
          <div className="col-md-3">
            <Dropdown
              name="timezone"
              label={props.t('Timezone')}
              items={moment.tz.names().map((tzName) => ({
                id: tzName,
                title: tzName,
              }))}
              onChange={(data) => props.handleTimezoneChange(data)}
              value={props.localTimezone}
              disabled={props.isGameActive}
              searchable
            />
          </div>
          {isDateInSeasonErrorShowing && (
            <div className="gameModalForm__error">
              {props.t(
                'This Game is outside your current squad Season Markers. Please contact the admin team to re-configure your season markers.'
              )}
            </div>
          )}
        </div>

        <br />

        <div className="row">
          <div className="col-md-4 gameModalFixtureForm__organisationTeamIdWrapper">
            <Dropdown
              name="organisationTeamId"
              label={props.t('Team')}
              items={prepareDropdownOptions(
                props.gameFormData.organisationTeams
              )}
              onChange={(value) =>
                handleDropdownValueChange(
                  'organisationTeams',
                  'organisationTeamId',
                  'organisationTeamName',
                  value
                )
              }
              value={props.fixture.organisationTeamId.toString()}
              searchable
            />
          </div>

          <div className="col-md-1">
            <InputNumeric
              label={props.t('Score')}
              name="score"
              value={props.score}
              onChange={props.handleScoreChange}
              disabled={
                !props.fixture.date ||
                isFixtureDateInFuture(moment(props.fixture.date))
              }
              t={props.t}
            />
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-md-4 gameModalFixtureForm__teamIdWrapper">
            <Dropdown
              name="teamId"
              label={props.t('Opposition')}
              items={prepareDropdownOptions(props.gameFormData.teams)}
              onChange={(value) =>
                handleDropdownValueChange('teams', 'teamId', 'teamName', value)
              }
              value={props.fixture.teamId.toString()}
              searchable
            />
          </div>

          <div className="col-md-1">
            <InputNumeric
              label={props.t('Score')}
              name="opponentScore"
              value={props.opponentScore}
              onChange={props.handleOpponentScoreChange}
              disabled={
                !props.fixture.date ||
                isFixtureDateInFuture(moment(props.fixture.date))
              }
              t={props.t}
            />
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-md-4">
            <InputNumeric
              label={props.t('Duration')}
              name="duration"
              value={props.duration}
              onChange={(duration) => props.handleDurationChange(duration)}
              descriptor={props.t('mins')}
            />
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-md-4 gameModalFixtureForm__competitionIdWrapper">
            <Dropdown
              name="competitionId"
              label={props.t('Competition')}
              items={prepareDropdownOptions(props.gameFormData.competitions)}
              onChange={(value) =>
                handleDropdownValueChange(
                  'competitions',
                  'competitionId',
                  'competitionName',
                  value
                )
              }
              value={props.fixture.competitionId.toString()}
              searchable
            />
          </div>

          <div className="col-md-4 gameModalFixtureForm__roundNumberWrapper">
            <InputNumeric
              name="roundNumber"
              label={props.t('#sport_specific__Round_number')}
              onChange={(data) => handleValueChange('roundNumber', data)}
              value={props.fixture.roundNumber}
              optional
              t={props.t}
            />
          </div>

          <div className="col-md-4 gameModalFixtureForm__venueTypeIdWrapper">
            <Dropdown
              name="venueTypeId"
              label={props.t('Venue')}
              items={prepareDropdownOptions(props.gameFormData.venueTypes)}
              onChange={(value) =>
                handleDropdownValueChange(
                  'venueTypes',
                  'venueTypeId',
                  'venueTypeName',
                  value
                )
              }
              value={props.fixture.venueTypeId.toString()}
            />
          </div>
        </div>
      </div>

      <div className="gameModalFixtureForm__formSeparator" />

      {window.featureFlags['mls-emr-advanced-options'] && (
        <AdvancedEventOptions
          formData={props.gameFormData}
          surfaceType={props.surfaceType}
          surfaceQuality={props.surfaceQuality}
          weather={props.weather}
          temperature={props.temperature}
          handleSurfaceTypeChange={props.handleSurfaceTypeChange}
          handleSurfaceQualityChange={props.handleSurfaceQualityChange}
          handleWeatherChange={props.handleWeatherChange}
          handleTemperatureChange={props.handleTemperatureChange}
        />
      )}

      <div className="gameModalFixtureForm__formSeparator" />

      <div className="row">
        <div className="col-md-4 gameModalFixtureForm__turnaroundPrefixWrapper">
          <div className="gameModalFixtureForm__createTurnaroundMarkerWrapper">
            <Checkbox
              name="createTurnaroundMarker"
              id="createTurnaroundMarker"
              label={props.t('Create Turnaround Marker')}
              isChecked={props.fixture.createTurnaroundMarker}
              toggle={(data) => {
                handleValueChange('createTurnaroundMarker', data.checked);
              }}
            />
          </div>
          <InputText
            name="turnaround_prefix_optional"
            label={`${props.t('Turnaround prefix')} (${props.t('optional')})`}
            onValidation={(data) =>
              handleValueChange('turnaroundPrefix', data.value)
            }
            value={props.fixture.turnaroundPrefix}
            maxLength={2}
            showRemainingChars={false}
            showCharsLimitReached={false}
            disabled={!props.fixture.createTurnaroundMarker}
            t={props.t}
          />
        </div>
      </div>
    </div>
  );
};

export const FixtureFormTranslated = withNamespaces()(FixtureForm);
export default FixtureForm;
