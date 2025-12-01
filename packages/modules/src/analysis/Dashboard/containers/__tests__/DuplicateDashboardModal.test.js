import { screen, fireEvent } from '@testing-library/react';
import $ from 'jquery';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import * as dashboardHooks from '../../redux/services/dashboard';
import DuplicateDashboardModalContainer from '../DuplicateDashboardModal';

jest.mock('../../redux/services/dashboard', () => ({
  ...jest.requireActual('../../redux/services/dashboard'),
  useGetActiveSquadQuery: jest.fn(),
  useGetPermittedSquadsQuery: jest.fn(),
}));

describe('DuplicateDashboardModal Container', () => {
  const containerProps = {};
  let ajaxSpy;

  const defaultState = {
    duplicateDashboardModal: {
      dashboardName: '',
      isOpen: true,
      status: null,
      selectedSquad: { id: null, name: '' },
      activeSquad: { id: 123, name: 'Test Squad' },
    },
    dashboard: {
      activeDashboard: { id: 456, name: 'Test Dashboard' },
    },
  };

  beforeEach(() => {
    ajaxSpy = jest.spyOn($, 'ajax');
    ajaxSpy.mockImplementation(() => Promise.resolve({ id: 123 }));

    dashboardHooks.useGetActiveSquadQuery.mockReturnValue({
      data: { id: 123, name: 'Test Squad' },
    });
    dashboardHooks.useGetPermittedSquadsQuery.mockReturnValue({
      data: [{ id: 123, name: 'Test Squad' }],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sets props correctly', () => {
    renderWithStore(
      <DuplicateDashboardModalContainer {...containerProps} />,
      {},
      defaultState
    );

    expect(screen.getByText('Duplicate Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Dashboard Name')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('allows changing dashboard name', () => {
    renderWithStore(
      <DuplicateDashboardModalContainer {...containerProps} />,
      {},
      defaultState
    );

    const nameInput = screen.getByLabelText('Dashboard Name');
    fireEvent.change(nameInput, { target: { value: 'Test 999' } });

    expect(nameInput.value).toBe('Test 999');
  });

  it('handles cancel button click', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <DuplicateDashboardModalContainer {...containerProps} />,
      {},
      defaultState
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(ajaxSpy).toHaveBeenCalledTimes(4);
  });
});
