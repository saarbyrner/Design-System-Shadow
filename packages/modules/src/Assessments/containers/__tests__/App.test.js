import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import mockedStore from '../../redux/utils/mockedStore';
import AppContainer from '../App';

describe('App Container', () => {
  it('renders the correct view based on the viewType from the store', () => {
    const preloadedState = {
      ...mockedStore,
      viewType: 'GRID',
      assessments: [{ id: 1, name: 'Assessment 1', items: [] }],
      appState: {
        ...mockedStore.appState,
        assessmentsRequestStatus: 'SUCCESS',
        selectedAthlete: 1,
      },
    };

    window.featureFlags['assessments-grid-view'] = true;

    renderWithRedux(<AppContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Assessment 1')).toBeInTheDocument();
    // Check the absence of the header with grid view FF
    expect(
      screen.queryByRole('heading', { name: /#sport_specific__athletes/i })
    ).not.toBeInTheDocument();
  });

  it('renders the ListView when the feature flag is disabled', () => {
    const preloadedState = {
      ...mockedStore,
      viewType: 'GRID',
      appState: {
        ...mockedStore.appState,
        assessmentsRequestStatus: 'SUCCESS',
      },
    };

    window.featureFlags['assessments-grid-view'] = false;

    renderWithRedux(<AppContainer />, {
      preloadedState,
      useGlobalStore: false,
    });
    // Check that the header is present with the grid view FF disabled
    expect(
      screen.getByRole('heading', {
        name: /#sport_specific__athletes/i,
      })
    ).toBeInTheDocument();
  });
});
