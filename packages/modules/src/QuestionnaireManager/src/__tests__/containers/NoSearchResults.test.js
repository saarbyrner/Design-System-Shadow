import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  groupAthletesByName,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByPosition,
  groupAthletesByPositionGroup,
} from '@kitman/common/src/utils';
import { buildAthletes, buildVariables } from '../test_utils';
import NoSearchResultsContainer from '../../containers/NoSearchResults';

describe('QuestionnaireManager <NoSearchResults /> Container', () => {
  let preloadedState;
  const athletes = buildAthletes(5);
  const variables = buildVariables(5);

  beforeEach(() => {
    const groupedAthletes = {
      position: groupAthletesByPosition(athletes),
      positionGroup: groupAthletesByPositionGroup(athletes),
      availability: groupAthletesByAvailability(athletes),
      last_screening: groupAthletesByScreening(athletes),
      name: groupAthletesByName(athletes),
    };

    // Define a base preloaded state for the Redux store
    preloadedState = {
      athletes: {
        all: athletes,
        grouped: groupedAthletes,
        currentlyVisible: groupedAthletes.name,
        groupBy: 'name',
        searchTerm: '',
        squadFilter: null,
      },
      variables: {
        currentlyVisible: variables,
      },
      squadOptions: {
        squads: [
          { name: 'Leinster Senior', id: 8 },
          { name: 'Leinster A', id: 'leinster_a' },
        ],
      },
    };
  });

  describe('when there are no visible athletes', () => {
    beforeEach(() => {
      preloadedState.athletes.currentlyVisible = null;
    });

    it('renders with the correct message for "All Squads"', () => {
      preloadedState.athletes.searchTerm = 'xyz';
      renderWithRedux(<NoSearchResultsContainer />, {
        useGlobalStore: false,
        preloadedState,
      });

      // The component should be visible and show the correct message
      expect(
        screen.getByText(/There are no results found for/i)
      ).toBeInTheDocument();
      expect(screen.getByText('xyz')).toBeInTheDocument();
      expect(screen.getByText('All Squads')).toBeInTheDocument();
    });

    it('renders with the correct message for a selected squad and no search term', () => {
      preloadedState.athletes.squadFilter = 8;
      renderWithRedux(<NoSearchResultsContainer />, {
        useGlobalStore: false,
        preloadedState,
      });

      expect(
        screen.getByText(/There are no results found for/i)
      ).toBeInTheDocument();
      expect(screen.getByText('Leinster Senior')).toBeInTheDocument();
    });

    it('renders with the correct message and subtext when a search term is used with a squad filter', () => {
      preloadedState.athletes.searchTerm = 'xyz';
      preloadedState.athletes.squadFilter = 8;
      renderWithRedux(<NoSearchResultsContainer />, {
        useGlobalStore: false,
        preloadedState,
      });

      expect(
        screen.getByText(/There are no results found for/i)
      ).toBeInTheDocument();
      expect(screen.getByText('xyz')).toBeInTheDocument();
      expect(screen.getByText('Leinster Senior')).toBeInTheDocument();
      expect(
        screen.getByText('Please check if you have spelt the name correctly.')
      ).toBeInTheDocument();
    });
  });
});
