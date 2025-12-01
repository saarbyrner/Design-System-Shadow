import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import App from '../App';
import mockedStore from '../../redux/utils/mockedStore';

describe('App component', () => {
  const baseProps = {
    viewType: 'LIST',
  };

  const mockedState = {
    ...mockedStore,
    assessmentTemplates: [{ id: 1, name: 'Template 1' }],
    assessments: [
      {
        id: 1,
        name: 'Assessment 1',
        items: [],
        assessment_template: { id: 1, name: 'Template 1' },
      },
    ],
    appState: {
      filteredTemplates: [1],
      assessmentsRequestStatus: 'SUCCESS',
    },
  };

  it('renders without crashing', () => {
    // This test primarily confirms that App and its children render without crashing
    renderWithRedux(<App {...baseProps} />, {
      preloadedState: mockedStore,
      useGlobalStore: false,
    });
    expect(document.querySelector('.assessments')).toBeInTheDocument();
  });

  it('renders the list view', () => {
    renderWithRedux(<App {...baseProps} viewType="LIST" />, {
      preloadedState: mockedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('Assessment 1')).toBeInTheDocument();
  });

  describe('when assessments-grid-view is enabled', () => {
    beforeEach(() => {
      window.featureFlags['assessments-grid-view'] = true;
    });

    afterEach(() => {
      window.featureFlags['assessments-grid-view'] = false;
    });

    it('renders the AppHeader', () => {
      renderWithRedux(<App {...baseProps} />, {
        preloadedState: mockedStore,
        useGlobalStore: false,
      });
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('adds the assessments--assessments-grid-view-enabled class to the root div', () => {
      const { container } = renderWithRedux(<App {...baseProps} />, {
        preloadedState: mockedStore,
        useGlobalStore: false,
      });
      expect(container.firstChild).toHaveClass(
        'assessments--assessments-grid-view-enabled'
      );
    });

    it('renders the assessments view when viewType is LIST', () => {
      renderWithRedux(<App {...baseProps} viewType="LIST" />, {
        preloadedState: mockedState,
        useGlobalStore: false,
      });
      expect(screen.getByText('Assessment 1')).toBeInTheDocument();
    });

    it('renders the assessments view when viewType is GRID', () => {
      renderWithRedux(<App {...baseProps} viewType="GRID" />, {
        preloadedState: mockedState,
        useGlobalStore: false,
      });
      expect(screen.getByText('Assessment 1')).toBeInTheDocument();
    });

    it('renders the template view when viewType is TEMPLATE', () => {
      renderWithRedux(<App {...baseProps} viewType="TEMPLATE" />, {
        preloadedState: mockedState,
        useGlobalStore: false,
      });

      expect(screen.getByRole('tab', { name: 'Athlete' })).toBeInTheDocument();
    });
  });
});
