import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AssessmentsListContainer from '../AssessmentsList';

describe('AssessmentsList Container', () => {
  const basePreloadedState = {
    assessments: [],
    assessmentTemplates: [],
    appState: {
      selectedAthlete: 2,
      assessmentsRequestStatus: null,
      filteredTemplates: [], // No filter by default
      nextAssessmentId: 123,
    },
    toasts: [],
  };

  describe('when the data is fully loaded', () => {
    it('shows the "Add form" button when no assessments exist and no filter is active', () => {
      const fullyLoadedState = {
        ...basePreloadedState,
        appState: {
          ...basePreloadedState.appState,
          assessmentsRequestStatus: 'SUCCESS',
          nextAssessmentId: null,
          filteredTemplates: [],
        },
      };

      renderWithRedux(<AssessmentsListContainer />, {
        preloadedState: fullyLoadedState,
        useGlobalStore: false,
      });

      // Find the specific "Add form" button rendered by the getNoAssessmentContent function
      const noAssessmentButton = screen.getByText(
        (content, element) =>
          element.textContent === 'Add form' &&
          element.classList.contains(
            'assessmentsNoAssessment__addAssessmentBtnLabel'
          )
      );

      expect(noAssessmentButton).toBeInTheDocument();
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    it('shows the correct message when no assessments match an active filter', () => {
      const fullyLoadedStateWithFilter = {
        ...basePreloadedState,
        appState: {
          ...basePreloadedState.appState,
          assessmentsRequestStatus: 'SUCCESS',
          nextAssessmentId: null,
          filteredTemplates: [1, 2],
        },
      };

      renderWithRedux(<AssessmentsListContainer />, {
        preloadedState: fullyLoadedStateWithFilter,
        useGlobalStore: false,
      });

      expect(
        screen.getByText('No forms meet filter criteria')
      ).toBeInTheDocument();
    });
  });
});
