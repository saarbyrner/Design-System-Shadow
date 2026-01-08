/* eslint-disable jest/no-mocks-import */
import { render, screen } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import mockSquadAthletes from '../__mocks__/squadAthletes';
import AthletesBySquadSelector from '../components/AthletesBySquadSelector';
import {
  MockedAthleteContextProvider,
  cleanUpAthleteContext,
} from './testUtils';

describe('Athletes | <AthletesBySquadSelector />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    selectedSquadId: null,
    searchValue: '',
    onSquadClick: jest.fn(),
  };
  const onChangeCallback = jest.fn();

  afterEach(() => {
    cleanUpAthleteContext();
    jest.clearAllMocks();
  });

  const renderComponent = (componentProps = {}) => {
    return render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
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
            <AthletesBySquadSelector {...props} {...componentProps} />
          </VirtuosoMockContext.Provider>
        </MockedAthleteContextProvider>
      </VirtuosoMockContext.Provider>
    );
  };

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Squads')).toBeInTheDocument();
  });

  it('renders the squad list when there is no squad selected', () => {
    renderComponent();
    expect(screen.getByText('Squads')).toBeInTheDocument();
    expect(
      screen.queryByTestId('AthleteList|Virtuoso')
    ).not.toBeInTheDocument();
  });

  it('renders the athlete list when there is a squad selected', () => {
    renderComponent({ selectedSquadId: 8 });
    expect(screen.getByTestId('AthleteList|Virtuoso')).toBeInTheDocument();
  });
  it('renders the search results when there is a search value supplied', () => {
    renderComponent({ searchValue: 'Gustavo' });

    expect(screen.getByText('Search results')).toBeInTheDocument();
    // as there are multiple Gustavo Lazaro Amendola, we need to use getAllByText and get the first one
    expect(
      screen.getAllByText('Gustavo Lazaro Amendola')[0]
    ).toBeInTheDocument();
  });
});
