import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { buildAthletes } from '@kitman/common/src/utils/test_utils';
import AlarmForm from '../../containers/AlarmForm';

describe('Alarm Form Container', () => {
  const athletes = buildAthletes(5);

  const defaultState = {
    alarmDefinitionsForStatus: {
      alarms: [
        {
          alarm_id: '5e3b5427-bbc3-11e6-b8cc-438769327787',
          alarm_type: 'numeric',
          applies_to_squad: true,
          colour: 'colour1',
          condition: 'equals',
          value: '1.0',
          positions: [],
          position_groups: [],
          athletes: [],
        },
      ],
    },
    alarmSquadSearch: {
      positions: {
        70: 'Tight-head Prop',
        71: 'Hooker',
        72: 'Loose-head Prop',
      },
      positionOrder: [70, 71, 72],
      positionGroups: {
        25: 'Forward',
        26: 'Back',
        27: 'Other',
      },
      positionGroupOrder: [25, 26, 27],
      athletes,
      athleteOrder: [],
      fake_alarm_id: {
        positionMatches: [],
        positionGroupMatches: [],
        athleteMatches: [],
        isSearching: false,
        searchTerm: '',
      },
    },
  };

  const defaultProps = {
    alarm_id: 'fake_alarm_id',
    applies_to_squad: true,
    athletes: [],
    colour: 'colour1',
    condition: 'less_than',
    position: 0,
    position_groups: [],
    positions: [],
    type: 'number',
    unit: '',
    value: 5,
    show_on_mobile: false,
    t: (key) => key,
  };

  it('renders', () => {
    renderWithRedux(<AlarmForm {...defaultProps} />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    expect(
      screen.getByRole('heading', { name: 'Alarm 1' })
    ).toBeInTheDocument();
  });
});
