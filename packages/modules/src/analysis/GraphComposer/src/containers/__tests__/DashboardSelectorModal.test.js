import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import * as actions from '../../actions';
import DashboardSelectorModalContainer from '../DashboardSelectorModal';

jest.mock('../../actions', () => ({
  selectDashboard: jest.fn(),
  closeDashboardSelectorModal: jest.fn(),
  saveGraph: jest.fn(),
}));

describe('DashboardSelectorModal Container', () => {
  let mockState;

  beforeEach(() => {
    jest.clearAllMocks();

    actions.selectDashboard.mockImplementation((selectedDashboard) => ({
      type: 'SELECT_DASHBOARD',
      payload: { selectedDashboard },
    }));

    actions.closeDashboardSelectorModal.mockImplementation(() => ({
      type: 'CLOSE_DASHBOARD_SELECTOR_MODAL',
    }));

    actions.saveGraph.mockImplementation(() => ({
      type: 'SAVE_GRAPH',
    }));

    mockState = {
      DashboardSelectorModal: {
        isOpen: true,
        dashboardList: [
          {
            id: '4',
            title: 'Dashboard Name',
          },
          {
            id: '5',
            title: 'Other Dashboard Name',
          },
        ],
        selectedDashboard: '4',
      },
    };
  });

  it('renders', () => {
    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DashboardSelectorModalContainer />
      </I18nextProvider>,
      { preloadedState: mockState, useGlobalStore: false }
    );

    expect(screen.getByText('Save Graph')).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DashboardSelectorModalContainer />
      </I18nextProvider>,
      { preloadedState: mockState, useGlobalStore: false }
    );

    expect(screen.getByText('Save Graph')).toBeInTheDocument();
    expect(screen.getByText('Choose Dashboard')).toBeInTheDocument();
  });

  it('sends the correct action when onChange is called', async () => {
    const user = userEvent.setup();
    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DashboardSelectorModalContainer />
      </I18nextProvider>,
      { preloadedState: mockState, useGlobalStore: false }
    );

    const dropdownButton = screen.getByRole('button', {
      name: /Dashboard Name/i,
    });
    await user.click(dropdownButton);

    const dropdownItem = screen.getByText('Other Dashboard Name');
    await user.click(dropdownItem);

    const expectedAction = {
      type: 'SELECT_DASHBOARD',
      payload: {
        selectedDashboard: '5',
      },
    };

    expect(actions.selectDashboard).toHaveBeenCalledWith(
      expectedAction.payload.selectedDashboard
    );
  });

  it('sends the correct action when closeModal is called', async () => {
    const user = userEvent.setup();
    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DashboardSelectorModalContainer />
      </I18nextProvider>,
      { preloadedState: mockState, useGlobalStore: false }
    );
    const mockDispatch = jest.spyOn(mockedStore, 'dispatch');

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    const expectedAction = {
      type: 'CLOSE_DASHBOARD_SELECTOR_MODAL',
    };

    expect(actions.closeDashboardSelectorModal).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
