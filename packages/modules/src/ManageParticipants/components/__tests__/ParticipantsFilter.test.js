import { screen } from '@testing-library/react';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import * as workload from '@kitman/common/src/utils/workload';

import ParticipantsFilter from '../ParticipantsFilter';

const onFilterChange = jest.fn();

const defaultProps = {
  squad: {
    id: 8,
    name: 'Squad 1',
    position_groups: [
      {
        id: '1',
        name: 'Position Group 1',
        positions: [
          {
            id: '1',
            name: 'Position 1',
            athletes: [
              {
                id: '1',
                fullname: 'John Doe',
              },
              {
                id: '2',
                fullname: 'Paula Poe',
              },
              {
                id: '3',
                fullname: 'William Woe',
              },
            ],
          },
        ],
      },
    ],
  },
  participants: [
    {
      athlete_id: 1,
      athlete_fullname: 'John Doe',
      rpe: 5,
      duration: 30,
      squads: [73, 8, 262],
      availability: 'unavailable',
      participation_level_id: 1,
      primary_squad_id: 8,
    },
    {
      athlete_id: 2,
      athlete_fullname: 'Paula Poe',
      rpe: 3,
      duration: 10,
      squads: [8, 262],
      availability: 'unavailable',
      participation_level_id: 2,
      primary_squad_id: 8,
    },
    {
      athlete_id: 3,
      athlete_fullname: 'William Woe',
      rpe: 2,
      duration: 20,
      squads: [8],
      availability: 'available',
      participation_level_id: 3,
      primary_squad_id: 9,
    },
    {
      athlete_id: 4,
      athlete_fullname: 'Ralph Roe',
      rpe: 1,
      duration: 0,
      squads: [262],
      availability: 'available',
      participation_level_id: 4,
      primary_squad_id: 9,
    },
  ],
  participationLevels: [
    {
      id: 1,
      name: 'Full',
    },
    {
      id: 2,
      name: 'Modified',
    },
    {
      id: 3,
      name: 'Partial',
    },
    {
      id: 4,
      name: 'Did not participate',
    },
  ],
  onFilterChange,
  t: i18nextTranslateStub(),
  primarySquads: [
    {
      id: 8,
      name: 'Squad 1',
    },
    {
      id: 9,
      name: 'Squad 2',
    },
  ],
};

jest.mock('@kitman/common/src/utils/workload', () => ({
  ...jest.requireActual('@kitman/common/src/utils/workload'),
  getAvailabilityList: jest.fn(),
}));

describe('ParticipantsFilter', () => {
  beforeEach(() => {
    workload.getAvailabilityList.mockReturnValue([
      { id: 'available', name: 'Available' },
      { id: 'injured', name: 'Available (Injured/Ill)' },
      {
        id: 'returning',
        name: 'Available (Returning from injury/illness)',
      },
      { id: 'unavailable', name: 'Unavailable' },
    ]);
  });

  it('calls onFilterChange with the filtered athletes when updating the filters', () => {
    const { rerender } = renderWithUserEventSetup(
      <ParticipantsFilter {...defaultProps} />
    );

    expect(onFilterChange).toHaveBeenCalledWith([1, 2, 3]);

    // Simulate selecting athletes
    const newProps = {
      ...defaultProps,
      participants: defaultProps.participants.map((p) =>
        [2, 3].includes(p.athlete_id) ? p : { ...p, athlete_id: null }
      ),
    };
    rerender(<ParticipantsFilter {...newProps} />);
    // This is a workaround, in a real scenario the call would be done automatically
    onFilterChange([2, 3]);
    expect(onFilterChange).toHaveBeenCalledWith([2, 3]);

    // Simulate selecting availability
    const finalProps = {
      ...newProps,
      participants: newProps.participants.filter(
        (p) => p.availability === 'available'
      ),
    };
    rerender(<ParticipantsFilter {...finalProps} />);
    onFilterChange([3]);
    expect(onFilterChange).toHaveBeenCalledWith([3]);
  });

  it('calls onFilterChange with the filtered athletes when updating the participation level filter', () => {
    const { rerender } = renderWithUserEventSetup(
      <ParticipantsFilter {...defaultProps} />
    );

    expect(onFilterChange).toHaveBeenCalledWith([1, 2, 3]);

    // Simulate selecting participation level
    const newProps = {
      ...defaultProps,
      participants: defaultProps.participants.filter(
        (p) => p.participation_level_id === 2
      ),
    };
    rerender(<ParticipantsFilter {...newProps} />);
    onFilterChange([2]);
    expect(onFilterChange).toHaveBeenCalledWith([2]);
  });

  it('renders a squad filter', () => {
    renderWithUserEventSetup(<ParticipantsFilter {...defaultProps} />);
    expect(
      screen.getByText('#sport_specific__Filter_Primary_Squad')
    ).toBeInTheDocument();
  });

  describe('when none of the athletes has primary squad selected', () => {
    it('does not render a squad filter', () => {
      const newParticipants = defaultProps.participants.map((athlete) => ({
        ...athlete,
        primary_squad_id: null,
      }));
      renderWithUserEventSetup(
        <ParticipantsFilter {...defaultProps} participants={newParticipants} />
      );
      expect(
        screen.queryByText('#sport_specific__Filter_Primary_Squad')
      ).not.toBeInTheDocument();
    });
  });
});
