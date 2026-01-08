// @flow
import { Component } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import uniqBy from 'lodash/uniqBy';
import classNames from 'classnames';
import { MultiSelect, Dropdown, TextButton } from '@kitman/components';
import groupByOptions from '@kitman/common/src/utils/groupByOptions';
import type {
  AlarmFilterOptions,
  AthleteFilterOptions,
  AvailabilityFilterOptions,
} from '@kitman/common/src/types/__common';
import type { GroupBy } from '@kitman/common/src/types/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import alarmFilterOptions from './resources/alarmFilterOptions';
import availabilityFilterOptions from './resources/availabilityFilterOptions';

// set the i18n instance
setI18n(i18n);

type Props = {
  athletes: Array<Object>,
  isExpanded: boolean,
  selectedGroupBy: GroupBy,
  selectedAlarmFilters?: Array<?AlarmFilterOptions>,
  showAlarmFilter?: boolean,
  selectedAvailabilityFilters?: Array<?AvailabilityFilterOptions>,
  showAvailabilityFilter?: boolean,
  selectedAthleteFilters: Array<?AthleteFilterOptions>,
  updateFilterOptions: (
    string,
    Array<?AlarmFilterOptions>,
    Array<?AthleteFilterOptions>,
    Array<?AvailabilityFilterOptions>
  ) => void,
};

type State = {
  selectedGroupBy: GroupBy,
  selectedAlarmFilters: Array<?AlarmFilterOptions>,
  selectedAthleteFilters: Array<?AthleteFilterOptions>,
  selectedAvailabilityFilters: Array<?AvailabilityFilterOptions>,
};

class AthleteFilters extends Component<I18nProps<Props>, State> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      selectedGroupBy: this.props.selectedGroupBy,
      selectedAlarmFilters: this.props.selectedAlarmFilters || [],
      selectedAthleteFilters: this.props.selectedAthleteFilters,
      selectedAvailabilityFilters: this.props.selectedAvailabilityFilters || [],
    };

    this.renderAlarmFilters = this.renderAlarmFilters.bind(this);
    this.renderAthletesFilters = this.renderAthletesFilters.bind(this);
    this.renderAvailabilityFilters = this.renderAvailabilityFilters.bind(this);
  }

  updateAlarmFilters(alarmFilters: Array<?AlarmFilterOptions>) {
    const newAlarmFilters = alarmFilters;
    this.setState({ selectedAlarmFilters: newAlarmFilters });
  }

  updateAthleteFilters(athleteFilters: Array<?AthleteFilterOptions>) {
    const newAthleteFilters = athleteFilters;
    this.setState({ selectedAthleteFilters: newAthleteFilters });
  }

  updateAvailabilityFilters(
    availabilityFilters: Array<?AvailabilityFilterOptions>
  ) {
    const newAvailabilityFilters = availabilityFilters;
    this.setState({ selectedAvailabilityFilters: newAvailabilityFilters });
  }

  renderAlarmFilters = () => {
    return this.props.showAlarmFilter !== false ? (
      <div className="athleteFilters__alarm_filterAthletes">
        <div className="athleteFilters__alarmInner">
          <MultiSelect
            name="AlarmFilterMultiselect"
            items={alarmFilterOptions()}
            // $FlowFixMe: String litteral incompatible with string
            selectedItems={this.state.selectedAlarmFilters}
            label={i18n.t('Filter Status')}
            onChange={
              // $FlowFixMe: String litteral incompatible with string
              (alarmFilters: Array<?AlarmFilterOptions>) =>
                this.updateAlarmFilters(alarmFilters)
            }
          />
        </div>
      </div>
    ) : null;
  };

  renderAthletesFilters = () => {
    const athleteNameOptions = uniqBy(
      this.props.athletes.map((athlete) => ({
        title: `${athlete.firstname} ${athlete.lastname}`,
        id: athlete.id,
      })),
      'title'
    );

    const athletePositionOptions = uniqBy(
      this.props.athletes.map((athlete) => ({
        title: athlete.position,
        id: athlete.positionId,
      })),
      'id'
    );

    const athletePositionGroupOptions = uniqBy(
      this.props.athletes.map((athlete) => ({
        title: athlete.positionGroup,
        id: athlete.positionGroupId,
      })),
      'title'
    );

    const filterOptions = [
      ...athletePositionGroupOptions,
      ...athletePositionOptions,
      ...athleteNameOptions,
    ];

    return (
      <div className="athleteFilters__athletes">
        <div className="athleteFilters__athletesInner">
          <MultiSelect
            name="AthleteFilterMultiselect"
            items={filterOptions}
            // $FlowFixMe: String litteral incompatible with string
            selectedItems={this.state.selectedAthleteFilters}
            label={i18n.t('#sport_specific__Filter_Athletes')}
            onChange={
              // $FlowFixMe: String litteral incompatible with string
              (athleteFilters: Array<?AthleteFilterOptions>) =>
                this.updateAthleteFilters(athleteFilters)
            }
          />
        </div>
      </div>
    );
  };

  renderAvailabilityFilters = () => {
    return this.props.showAvailabilityFilter ? (
      <div className="athleteFilters__availability_filterAthletes">
        <div className="athleteFilters__availabilityInner">
          <MultiSelect
            name="AvailabilityFilterMultiselect"
            items={availabilityFilterOptions()}
            // $FlowFixMe: String litteral incompatible with string
            selectedItems={this.state.selectedAvailabilityFilters}
            label={i18n.t('Filter Availability')}
            onChange={
              // $FlowFixMe: String litteral incompatible with string
              (availabilityFilters: Array<?AvailabilityFilterOptions>) =>
                this.updateAvailabilityFilters(availabilityFilters)
            }
          />
        </div>
      </div>
    ) : null;
  };

  render() {
    const classes = classNames('athleteFilters', {
      'athleteFilters--expanded': this.props.isExpanded === true,
    });

    return (
      <div className={classes}>
        <div className="athleteFilters__groupBy">
          <Dropdown
            items={groupByOptions()}
            value={this.state.selectedGroupBy}
            label={i18n.t('Group By')}
            onChange={(value: GroupBy) => {
              this.setState({ selectedGroupBy: value });
            }}
          />
        </div>
        {this.renderAlarmFilters()}
        {this.renderAthletesFilters()}
        {this.renderAvailabilityFilters()}
        <div className="float-right athleteFilters__btnContainer_filterAthletes">
          <TextButton
            type="primary"
            text={this.props.t('Apply')}
            onClick={() =>
              this.props.updateFilterOptions(
                this.state.selectedGroupBy,
                this.state.selectedAlarmFilters,
                this.state.selectedAthleteFilters,
                this.state.selectedAvailabilityFilters
              )
            }
          />
        </div>
      </div>
    );
  }
}

export const AthleteFiltersTranslated = withNamespaces()(AthleteFilters);
export default AthleteFilters;
