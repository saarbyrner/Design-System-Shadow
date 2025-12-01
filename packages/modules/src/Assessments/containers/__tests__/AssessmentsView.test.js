import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import mockStore from '@kitman/modules/src/Assessments/redux/utils/mockedStore';
import AssessmentsViewContainer from '../AssessmentsView';

describe('AssessmentsView Container', () => {
  it('renders the list view components when viewType is LIST', () => {
    const preloadedState = {
      ...mockStore,
      assessments: [{ id: 1, name: 'Assessment 1', items: [] }],
      athletes: [{ id: 123, fullname: 'Test Athlete' }],
      appState: {
        filteredTemplates: [],
        assessmentsRequestStatus: 'SUCCESS',
      },
    };

    renderWithRedux(<AssessmentsViewContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Assessment 1')).toBeInTheDocument();
  });
});
