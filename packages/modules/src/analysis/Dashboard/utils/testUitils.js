/* eslint-disable no-console */
/* eslint-disable no-undef */
// @flow
import type { Component } from 'react';
import { Provider } from 'react-redux';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import getStore, { getInitialStore } from '../redux/store';
import type { Store } from '../redux/types/store';
import { emptyInitialData } from '../Dashboard';

// $FlowIgnore[cannot-resolve-name] this file is designed to be run in test files, so jest is defined
jest.mock('jspdf', () => {
  const mockAddPage = jest.fn();
  const mockAddImage = jest.fn();
  const mockPDFOutput = jest.fn();
  const mockURIString = 'uristringmock';
  return {
    jsPDF: jest.fn().mockImplementation(() => {
      return {
        addPage: mockAddPage,
        addImage: mockAddImage,
        output: mockPDFOutput.mockReturnValue(mockURIString),
      };
    }),
  };
});

/**
 * Suppressing the following error
 *
 * "Unexpected key "turnaroundList" found in previous state received by the reducer. Expected to find one of the known reducer keys instead: "dashboard", "dashboardApi", "chartBuilderApi", "chartBuilder", "medicalApi", "duplicateDashboardModal", "duplicateWidgetModal", "graphLinksModal", "headerWidgetModal", "profileWidgetModal", "notesWidgetSettingsModal", "notesWidget", "tableWidget", "tableWidgetModal", "actionsWidgetModal", "annotation", "staticData", "dashboardList", "printBuilder", "noteDetailModal", "injuryRiskMetrics", "developmentGoalForm", "coachingPrinciples". Unexpected keys will be ignored."
 *
 * The turnaroundList is fetched before the redux store is init'd and then stored
 * on the root level of the reducer.
 *
 * The error is thrown by combineReducers as it does not expect turnaroundList because
 * it is not defined at the root reducer. See more here https://github.com/reduxjs/redux/issues/2427
 */

const originalWarn = console.error.bind(console.error);
// $FlowIgnore[cannot-resolve-name] this file is designed to be run in test files, so beforeAll is globally defined
beforeAll(() => {
  // $FlowIgnore[cannot-write]
  console.error = (msg) =>
    !msg.toString().includes('Unexpected key') && originalWarn(msg);
});

// $FlowIgnore[cannot-resolve-name] this file is designed to be run in test files, so afterAll is globally defined
afterAll(() => {
  // $FlowIgnore[cannot-write]
  console.error = originalWarn;
});

// END error suppress

const initialState = getInitialStore(emptyInitialData);
export const getWrapper = (preloadedState: Store, wrapper: ?Function) => {
  const AppReduxWrapper = ({ children }: { children: Node }) => {
    if (typeof wrapper === 'function') {
      return (
        <Provider store={getStore(null, preloadedState)}>
          {wrapper({ children })}
        </Provider>
      );
    }
    return (
      <Provider store={getStore(null, preloadedState)}>{children}</Provider>
    );
  };

  return AppReduxWrapper;
};

/**
 * This function wraps the rtl render function, but adds the wrapper needed for the template dashboard
 *
 * @param {Node} ComponentToRender Component to render
 * @param {RenderOptions} opts react testing library render options excluding the wrapper
 * @param {GlobalStore} preloadedState the redux state that will be loaded into the store
 * @returns React testing library render return
 */
export const renderWithStore = (
  ComponentToRender: Component<any>,
  opts: RenderOptions,
  preloadedState?: Store = {}
) => {
  return render(ComponentToRender, {
    ...opts,
    wrapper: getWrapper({ ...initialState, ...preloadedState }, opts?.wrapper),
  });
};
