import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetPreferencesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetActivitySourceOptionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';

import ActivityModule from '../ActivityModule';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetPreferencesQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useFetchOrganisationQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
  coachingPrinciples: {
    isEnabled: true,
  },
});

const MOCK_DATA = {
  activityTypes: [
    {
      id: 1,
      name: 'Attacking',
      event_activity_type_category: null,
      squads: [
        {
          id: 2731,
          name: '1st team',
        },
      ],
    },
  ],
  principles: [
    {
      id: 1,
      name: 'Principle 1',
      squads: [
        {
          id: 2731,
          name: '1st team',
        },
      ],
      principle_types: [
        {
          id: 3,
          name: 'Physical',
        },
      ],
      phases: [],
      principle_categories: [],
    },
  ],
  phases: [],
  principleTypes: [
    {
      id: 3,
      sport_id: 2,
      sport: {
        id: 2,
        perma_id: 'rugby_union',
        name: 'Rugby Union',
        duration: 80,
      },
      name: 'Physical',
    },
  ],
  principleCategories: [],
  drillLabels: [
    {
      id: 2,
      name: 'Attack drill',
      squads: [
        {
          id: 2731,
          name: '1st team',
        },
      ],
      archived: false,
    },
  ],
  activityTypeCategories: [],
};

describe('analysis dashboard | <ActivityModule />', () => {
  afterAll(() => {
    window.featureFlags = {};
  });

  beforeEach(() => {
    useGetPreferencesQuery.mockReturnValue({
      data: { enable_activity_type_category: false },
    });

    useGetActivitySourceOptionsQuery.mockReturnValue({
      data: MOCK_DATA,
    });
  });

  const mockProps = {
    isPanelOpen: true,
    panelType: 'column',
    columnTitle: 'Test column title',
    rowTitle: 'Test row title',
    hideColumnTitle: false,
    selectedActivitySource: {
      ids: [],
      type: '',
    },
    onSetActivitySource: jest.fn(),
    onSetCalculation: jest.fn(),
    onSetColumnTitle: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderWithProvider = (props = mockProps) => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 2000, itemHeight: 40 }}
      >
        <Provider store={defaultStore}>
          <ActivityModule {...props} />
        </Provider>
      </VirtuosoMockContext.Provider>
    );
  };

  it('renders the ActivityModule component', () => {
    renderWithProvider();

    expect(screen.getByLabelText('Activity Source')).toBeInTheDocument();
  });

  it('renders the Activity source data options', async () => {
    renderWithProvider();

    const user = userEvent.setup();

    await user.click(screen.getByLabelText('Activity Source'));

    expect(screen.getByText('Principles')).toBeVisible();
    expect(screen.getByText('Activity Types')).toBeVisible();
    expect(screen.getByText('Principle Types')).toBeVisible();
    expect(screen.getByText('Principle Categories')).toBeVisible();
    expect(screen.getByText('Principle Phases')).toBeVisible();
    expect(screen.getByText('Drill Label')).toBeVisible();
    // requires preference to be enabled
    expect(
      screen.queryByText('Activity Type Category')
    ).not.toBeInTheDocument();
  });

  describe('when isActivityTypeCategoriesEnabled preference is true', () => {
    beforeEach(() => {
      useGetPreferencesQuery.mockReturnValue({
        data: { enable_activity_type_category: true },
      });
    });

    it('renders Activity Type Category is Activity Source options', async () => {
      renderWithProvider();

      const user = userEvent.setup();

      await user.click(screen.getByLabelText('Activity Source'));

      expect(screen.getByText('Activity Type Category')).toBeVisible();
    });
  });

  it('renders the data source options once an activity source is selected', async () => {
    renderWithProvider({
      ...mockProps,
      selectedActivitySource: {
        ids: [],
        type: 'Principle',
      },
    });

    const user = userEvent.setup();

    await user.click(screen.getByLabelText('Principles'));

    expect(screen.getByText('Principle 1')).toBeVisible();
  });

  it('calls onSetActivitySource when a data source is selected', async () => {
    renderWithProvider({
      ...mockProps,
      selectedActivitySource: {
        ids: [],
        type: 'Principle',
      },
    });
    const user = userEvent.setup();

    await user.click(screen.getByLabelText('Principles'));

    await user.click(screen.getByText('Principle 1'));

    expect(mockProps.onSetActivitySource).toHaveBeenCalledWith(
      [1],
      'Principle',
      undefined
    );
  });

  it('populates the activity value from selectedActivitySource', () => {
    renderWithProvider({
      ...mockProps,
      selectedActivitySource: {
        ids: [1],
        type: 'Principle',
      },
    });

    // two results for 'Principles' - one for the activity source selector
    // and one for the principles selector
    const principlesText = screen.getAllByText('Principles');
    expect(principlesText[0]).toBeInTheDocument();
    expect(principlesText[1]).toBeInTheDocument();
    expect(screen.getByText('Principle 1')).toBeInTheDocument();
  });

  it('renders the calculation module', () => {
    renderWithProvider();

    expect(screen.getByLabelText('Calculation')).toBeInTheDocument();
  });

  it('renders the column title field columnTitle value', () => {
    renderWithProvider();

    expect(screen.getByLabelText('Column Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Column Title')).toHaveDisplayValue(
      'Test column title'
    );
  });

  it('renders the column title field prefilled from props', () => {
    renderWithProvider({ ...mockProps, columnTitle: 'Principle 1 | Count' });

    expect(screen.getByLabelText('Column Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Column Title')).toHaveDisplayValue(
      'Principle 1 | Count'
    );
  });

  it('renders an empty title when panelType === column without titles', () => {
    renderWithProvider({
      ...mockProps,
      columnTitle: null,
      rowTitle: null,
      panelType: 'column',
    });
    const title = screen.getByLabelText('Column Title');
    expect(title).toHaveDisplayValue('');
  });

  it('renders row title when panelType === row', () => {
    renderWithProvider({ ...mockProps, panelType: 'row' });
    const title = screen.getByLabelText('Row Title');
    expect(title).toHaveDisplayValue('Test row title');
  });

  it('renders an empty title when panelType === row without titles', () => {
    renderWithProvider({
      ...mockProps,
      columnTitle: null,
      rowTitle: null,
      panelType: 'row',
    });
    const title = screen.getByLabelText('Row Title');
    expect(title).toHaveDisplayValue('');
  });

  it('hides the column title field when hideColumnTitle is true', () => {
    renderWithProvider({ ...mockProps, hideColumnTitle: true });

    expect(screen.queryByLabelText('Column Title')).not.toBeInTheDocument();
  });

  it('calls onSetColumnTitle when a new input is entered', async () => {
    renderWithProvider({ ...mockProps, columnTitle: '', rowTitle: '' });

    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Column Title'), 'X');

    expect(mockProps.onSetColumnTitle).toHaveBeenCalledTimes(1);
    expect(mockProps.onSetColumnTitle).toHaveBeenCalledWith('X');
  });
});
