import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import mockedStore from '@kitman/modules/src/Assessments/redux/utils/mockedStore';
import ListView from '../../listView/ListView';

describe('ListView component', () => {
  let preloadedState;

  beforeEach(() => {
    preloadedState = {
      ...mockedStore,
      assessments: [{ id: 1, name: 'Sample Assessment', items: [] }],
      athletes: [{ id: 1, fullname: 'John Doe' }],
      appState: {
        ...mockedStore.appState,
        assessmentsRequestStatus: 'SUCCESS',
        selectedAthlete: 1,
      },
    };
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  it('renders the athlete list and the assessments list when feature flag is off', async () => {
    window.featureFlags['assessments-grid-view'] = false;

    renderWithRedux(<ListView />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(await screen.findByText('Sample Assessment')).toBeInTheDocument();
  });

  it('does not render the athlete list when feature flag is on', async () => {
    window.featureFlags['assessments-grid-view'] = true;

    renderWithRedux(<ListView />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(await screen.findByText('Sample Assessment')).toBeInTheDocument();

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
