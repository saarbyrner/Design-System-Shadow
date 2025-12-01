import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import $ from 'jquery';
import RenameDashboardModal from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('Analytical Dashboard <RenameDashboardModal /> component', () => {
  const props = {
    dashboard: {
      id: 4,
      name: 'Dashboard Name',
    },
    isModalOpen: true,
    onClickCloseButton: jest.fn(),
    onDashboardUpdate: jest.fn(),
    onRequestSuccess: jest.fn(),
    t: (key) => key,
  };

  let mockTrackEvent;
  let ajaxSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTrackEvent = jest.fn();
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
    ajaxSpy = jest.spyOn($, 'ajax');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders', () => {
    renderWithStore(<RenameDashboardModal {...props} />);

    expect(screen.getByText('Rename Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('calls the correct prop on close', async () => {
    const user = userEvent.setup();
    renderWithStore(<RenameDashboardModal {...props} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(props.onClickCloseButton).toHaveBeenCalledTimes(1);
  });

  it('opens the rename modal when clicking the edit button', () => {
    renderWithStore(<RenameDashboardModal {...props} />);

    expect(screen.getByDisplayValue('Dashboard Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rename' })).toBeInTheDocument();
  });

  it('calls trackEvent with "Edit Dashboard" when rename is clicked', async () => {
    const user = userEvent.setup();

    const deferred = $.Deferred();
    ajaxSpy.mockImplementation(() => deferred.resolve());

    renderWithStore(<RenameDashboardModal {...props} />);

    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    fireEvent.change(nameInput, { target: { value: 'New Dashboard Name' } });

    const renameButton = screen.getByRole('button', { name: 'Rename' });
    await user.click(renameButton);

    expect(mockTrackEvent).toHaveBeenCalledWith('Edit Dashboard');
  });

  describe('When confirming the name change and the request succeed', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      ajaxSpy.mockImplementation(() => deferred.resolve());
    });

    it('sends the correct request', async () => {
      const user = userEvent.setup();
      renderWithStore(<RenameDashboardModal {...props} />);

      const nameInput = screen.getByLabelText('Name');
      await user.clear(nameInput);
      fireEvent.change(nameInput, { target: { value: 'New Dashboard Name' } });

      const renameButton = screen.getByRole('button', { name: 'Rename' });
      await user.click(renameButton);

      // Verify the correct AJAX request was made
      expect(ajaxSpy).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/analysis/dashboard/4',
        contentType: 'application/json',
        data: JSON.stringify({
          id: 4,
          name: 'New Dashboard Name',
        }),
      });

      // Verify callbacks are called
      await waitFor(() => {
        expect(props.onRequestSuccess).toHaveBeenCalledTimes(1);
        expect(props.onDashboardUpdate).toHaveBeenCalledWith({
          id: 4,
          name: 'New Dashboard Name',
        });
      });
    });
  });

  describe('When confirming the name change and the request fails', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      ajaxSpy.mockImplementation(() => deferred.reject());
    });

    it('shows an error message', async () => {
      const user = userEvent.setup();
      renderWithStore(<RenameDashboardModal {...props} />);

      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'New Dashboard Name' } });

      const renameButton = screen.getByRole('button', { name: 'Rename' });
      await user.click(renameButton);

      // Wait for error state to be shown
      await waitFor(() => {
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });

      expect(screen.getByText('Rename Dashboard')).toBeInTheDocument();
    });
  });
});
