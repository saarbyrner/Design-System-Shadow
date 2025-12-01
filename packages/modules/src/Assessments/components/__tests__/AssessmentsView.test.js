import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import mockedStore from '../../redux/utils/mockedStore';
import AssessmentsView from '../AssessmentsView';

describe('AssessmentsView component', () => {
  const props = {
    assessmentTemplates: [],
    filteredTemplates: [],
    onApplyTemplateFilter: jest.fn(),
  };

  const preloadedState = {
    ...mockedStore,
    assessments: [{ id: 1, name: 'Assessment 1', items: [] }],
    athletes: [{ id: 1, fullname: 'Test Athlete' }],
    appState: {
      ...mockedStore.appState,
      assessmentsRequestStatus: 'SUCCESS',
    },
  };

  beforeEach(() => {
    window.featureFlags['assessments-grid-view'] = true;
  });

  afterEach(() => {
    window.featureFlags['assessments-grid-view'] = false;
  });

  it('renders the assessments header', () => {
    renderWithRedux(<AssessmentsView {...props} viewType="LIST" />, {
      preloadedState,
      useGlobalStore: false,
    });
    // Check for a known element from the real AssessmentsHeader
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('renders the athlete list and the list view when the view type is LIST', () => {
    renderWithRedux(<AssessmentsView {...props} viewType="LIST" />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Test Athlete')).toBeInTheDocument();
    expect(screen.getByText('Assessment 1')).toBeInTheDocument();
    expect(screen.queryByTestId('grid-view-wrapper')).not.toBeInTheDocument();
  });

  it('renders the grid view without the athlete list when viewType is GRID', () => {
    const { container } = renderWithRedux(
      <AssessmentsView {...props} viewType="GRID" />,
      {
        preloadedState,
        useGlobalStore: false,
      }
    );

    expect(screen.queryByText('Test Athlete')).not.toBeInTheDocument();
    expect(screen.getByText('Assessment 1')).toBeInTheDocument();

    expect(container.querySelector('.assessmentsGridView')).toBeInTheDocument();
  });
});
