import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';

import AppStatusContainer from '@kitman/modules/src/AthleteInjury/athleteIssueEditor/src/containers/AppStatus';
import getInjuryData from '@kitman/modules/src/AthleteInjury/utils/InjuryData';

setI18n(i18n);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('App Status Container', () => {
  let store;
  let initialState;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    window.featureFlags = {};

    initialState = {
      ModalData: {
        athleteName: 'John Do',
        osicsPathologyOptions: [],
        osicsClassificationOptions: [],
        bodyAreaOptions: [],
        sideOptions: [],
        activityGroupOptions: [],
        gameOptions: [],
        trainingSessionOptions: [],
        positionGroupOptions: [],
        injuryStatusOptions: [],
      },
      IssueData: getInjuryData(),
      AppStatus: {
        status: 'success',
        message: 'Status message',
      },
    };
    store = storeFake(initialState);
    store.dispatch = dispatchSpy;
  });

  it('renders', () => {
    render(
      <Provider store={store}>
        <AppStatusContainer />
      </Provider>
    );
    expect(screen.getByTestId('AppStatus-success')).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    render(
      <Provider store={store}>
        <AppStatusContainer />
      </Provider>
    );

    // The status prop determines the data-testid
    expect(
      screen.getByTestId(`AppStatus-${initialState.AppStatus.status}`)
    ).toBeInTheDocument();
    // The message prop is rendered as text
    expect(
      screen.getByText(initialState.AppStatus.message)
    ).toBeInTheDocument();
  });
});
