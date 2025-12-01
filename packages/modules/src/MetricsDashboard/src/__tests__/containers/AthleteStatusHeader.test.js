import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  buildStatuses,
  buildTemplates,
} from '@kitman/common/src/utils/test_utils';
import { statusesToIds, statusesToMap } from '@kitman/common/src/utils';
import AthleteStatusHeader from '../../containers/AthleteStatusHeader';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const statuses = buildStatuses(10);

describe('Dashboard Statuses Header Container', () => {
  let store;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    store = storeFake({
      canManageDashboard: true,
      dashboards: {
        all: buildTemplates(5),
        currentId: 1,
      },
      statuses: {
        ids: statusesToIds(statuses),
        byId: statusesToMap(statuses),
        available: [],
        reorderedIds: [],
      },
      alarmDefinitions: {},
    });
    store.dispatch = dispatchSpy;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <AthleteStatusHeader />
        </I18nextProvider>
      </Provider>
    );

    // Check that the component renders by looking for the main container element
    expect(document.querySelector('.athleteStatusHeader')).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <AthleteStatusHeader />
        </I18nextProvider>
      </Provider>
    );

    // Since we can't directly test props in RTL, we test the rendered output
    // that results from those props being passed correctly

    // Check that statuses are rendered (statusOrder and statusMap props working)
    const statusElements = document.querySelectorAll(
      '.athleteStatusHeader__status'
    );
    expect(statusElements).toHaveLength(statuses.length);

    // Check that status names are rendered correctly (from statusMap)
    statuses.forEach((status) => {
      expect(document.body).toHaveTextContent(status.name);
    });

    // Check that the main container is rendered
    expect(document.querySelector('.athleteStatusHeader')).toBeInTheDocument();

    // Check that the statuses container is rendered
    expect(
      document.querySelector('.athleteStatusHeader__statusesContainer')
    ).toBeInTheDocument();
  });
});
