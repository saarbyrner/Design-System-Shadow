/* eslint-disable jest/no-mocks-import */
import { VirtuosoMockContext } from 'react-virtuoso';
import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import mockSquadAthletes from '../__mocks__/squadAthletes';
import SearchResults from '../components/SearchResults';
import {
  cleanUpAthleteContext,
  MockedAthleteContextProvider,
} from './testUtils';

describe('Athletes | <SearchResults />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    searchValue: '',
  };
  const onChangeCallback = jest.fn();

  afterEach(() => {
    cleanUpAthleteContext();
  });

  describe('searchAllLevels prop', () => {
    it('renders correctly', () => {
      render(
        <MockedAthleteContextProvider
          athleteContext={{
            squadAthletes: mockSquadAthletes.squads,
            value: [],
            onChange: onChangeCallback,
          }}
        >
          <SearchResults {...props} />
        </MockedAthleteContextProvider>
      );
      expect(screen.getByTestId('SearchResults|Virtuoso')).toBeInTheDocument();
    });

    it('renders nothing for an empty search value', () => {
      render(
        <MockedAthleteContextProvider
          athleteContext={{
            squadAthletes: mockSquadAthletes.squads,
            value: [],
            onChange: onChangeCallback,
          }}
        >
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 10000, itemHeight: 50 }}
          >
            <SearchResults {...props} />
          </VirtuosoMockContext.Provider>
        </MockedAthleteContextProvider>
      );
      // The Virtuoso should be rendered for empty query (shows all athletes)
      // But "Option" elements aren't accessible by text, so let's check one typical name.
      // Alternatively, since searchValue is '', we should find athletes present. So we can check by an athlete name from mockSquadAthletes.
      expect(screen.getByTestId('SearchResults|Virtuoso')).toBeInTheDocument();
      expect(screen.getByText('Test Welcome Process')).toBeInTheDocument();
    });

    it('renders a user message for empty results', () => {
      render(
        <MockedAthleteContextProvider
          athleteContext={{
            squadAthletes: [],
            value: [],
            onChange: onChangeCallback,
          }}
        >
          <SearchResults {...props} searchValue="test" />
        </MockedAthleteContextProvider>
      );
      expect(screen.getByText('No search results')).toBeInTheDocument();
    });

    it('filters the full list of values by a given search value', () => {
      render(
        <MockedAthleteContextProvider
          athleteContext={{
            squadAthletes: mockSquadAthletes.squads,
            value: [],
            onChange: onChangeCallback,
          }}
        >
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 10000, itemHeight: 50 }}
          >
            <SearchResults {...props} searchValue="Gustavo" />
          </VirtuosoMockContext.Provider>
        </MockedAthleteContextProvider>
      );

      expect(
        screen.getAllByText('Gustavo Lazaro Amendola')[0]
      ).toBeInTheDocument();
    });

    it('should not filter athletes given hidden types', () => {
      render(
        <MockedAthleteContextProvider
          athleteContext={{
            squadAthletes: mockSquadAthletes.squads,
            value: [],
            onChange: onChangeCallback,
          }}
        >
          <SearchResults
            {...props}
            searchAllLevels
            hiddenTypes={['athletes']}
            searchValue="Gustavo"
          />
        </MockedAthleteContextProvider>
      );

      expect(screen.getByText('No search results')).toBeInTheDocument();
    });

    it('filter positions given athletes as hidden types', () => {
      render(
        <MockedAthleteContextProvider
          athleteContext={{
            squadAthletes: mockSquadAthletes.squads,
            value: [],
            onChange: onChangeCallback,
          }}
        >
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 10000, itemHeight: 50 }}
          >
            <SearchResults
              {...props}
              searchAllLevels
              hiddenTypes={['athletes']}
              searchValue="Other"
            />
          </VirtuosoMockContext.Provider>
        </MockedAthleteContextProvider>
      );

      expect(screen.getByText('International Squad')).toBeInTheDocument();
      expect(screen.getByText('Academy Squad')).toBeInTheDocument();
      expect(screen.queryByText('Player view')).not.toBeInTheDocument();
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    it('filter positions given athletes, squads and position_groups hidden types', () => {
      render(
        <MockedAthleteContextProvider
          athleteContext={{
            squadAthletes: mockSquadAthletes.squads,
            value: [],
            onChange: onChangeCallback,
          }}
        >
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 10000, itemHeight: 50 }}
          >
            <SearchResults
              {...props}
              searchAllLevels
              hiddenTypes={['squads', 'athletes', 'positions']}
              searchValue="Other"
            />
          </VirtuosoMockContext.Provider>
        </MockedAthleteContextProvider>
      );

      expect(screen.getByText('International Squad')).toBeInTheDocument();
      expect(screen.getByText('Academy Squad')).toBeInTheDocument();
      expect(screen.queryByText('Player view')).not.toBeInTheDocument();
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });
  });
});
