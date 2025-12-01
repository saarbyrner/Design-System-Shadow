import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import $ from 'jquery';
import AddDashboardModal from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

const mockLocationAssign = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    assign: mockLocationAssign,
  },
  writable: true,
});

describe('Analytical Dashboard <AddDashboardModal /> component', () => {
  const mockTrackEvent = jest.fn();
  let ajaxSpy;

  const props = {
    isModalOpen: true,
    canSeeHiddenVariables: false,
    isDashboardHidden: false,
    newDashboardName: '',
    onRequestSuccess: jest.fn(),
    onClickCloseButton: jest.fn(),
    onDashboardNameChange: jest.fn(),
    onToggleHideDashboard: jest.fn(),
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
    ajaxSpy = jest.spyOn($, 'ajax');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders AddDashboardModal', () => {
    renderWithStore(<AddDashboardModal {...props} />);

    expect(screen.getByText('New Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('calls the correct prop when updating the name', async () => {
    const user = userEvent.setup();
    renderWithStore(<AddDashboardModal {...props} />);

    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    fireEvent.change(nameInput, { target: { value: 'Dashboard Name' } });

    expect(props.onDashboardNameChange).toHaveBeenCalledWith('Dashboard Name');
  });

  it('calls the correct prop when closing the modal', async () => {
    const user = userEvent.setup();
    renderWithStore(<AddDashboardModal {...props} />);

    const closeButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(closeButton);

    expect(props.onClickCloseButton).toHaveBeenCalledTimes(1);
  });

  it('calls trackEvent with "Create Analysis Dashboard" when a dashboard is created', async () => {
    const user = userEvent.setup();

    const deferred = $.Deferred();
    ajaxSpy.mockImplementation(() => deferred.resolve({ id: 32 }));

    renderWithStore(<AddDashboardModal {...props} />);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'New Dashboard' } });

    const createButton = screen.getByRole('button', { name: 'Create' });
    await user.click(createButton);

    expect(mockTrackEvent).toHaveBeenCalledWith('Create Analysis Dashboard');
  });

  describe('When confirming and the request succeeds', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      ajaxSpy.mockImplementation(() => deferred.resolve({ id: 32 }));
    });

    it('sends the correct request and redirects the user', async () => {
      const user = userEvent.setup();
      renderWithStore(<AddDashboardModal {...props} />);

      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'Dashboard Name' } });

      const confirmButton = screen.getByRole('button', { name: 'Create' });
      await user.click(confirmButton);

      // Verify AJAX call was made with correct parameters
      expect(ajaxSpy).toHaveBeenCalledWith({
        method: 'POST',
        url: '/analysis/dashboard',
        contentType: 'application/json',
        data: JSON.stringify({
          name: 'Dashboard Name',
          layout: {},
          is_hidden: false,
        }),
      });

      await waitFor(() => {
        expect(props.onRequestSuccess).toHaveBeenCalledTimes(1);
      });

      const appStatus = screen.getByTestId('AppStatus-success');
      expect(appStatus).toHaveClass('appStatus--success');

      // Verify redirect
      expect(mockLocationAssign).toHaveBeenCalledWith('/analysis/dashboard/32');
    });

    describe('When canSeeHiddenVariables is true and the confirm request is successful', () => {
      it('sends the correct request and redirects the user', async () => {
        const user = userEvent.setup();
        renderWithStore(<AddDashboardModal {...props} isDashboardHidden />);

        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, {
          target: { value: 'Dashboard Name' },
        });

        const confirmButton = screen.getByRole('button', { name: 'Create' });
        await user.click(confirmButton);

        // Verify AJAX call was made with correct parameters (hidden dashboard)
        expect(ajaxSpy).toHaveBeenCalledWith({
          method: 'POST',
          url: '/analysis/dashboard',
          contentType: 'application/json',
          data: JSON.stringify({
            name: 'Dashboard Name',
            layout: {},
            is_hidden: true,
          }),
        });

        await waitFor(() => {
          const appStatus = screen.getByTestId('AppStatus-success');
          expect(appStatus).toHaveClass('appStatus--success');
        });

        // Verify redirect
        expect(mockLocationAssign).toHaveBeenCalledWith(
          '/analysis/dashboard/32'
        );
      });
    });
  });

  describe('When confirming and the request fails', () => {
    beforeEach(() => {
      // Mock failed AJAX response
      const deferred = $.Deferred();
      ajaxSpy.mockImplementation(() => deferred.reject());
    });

    it('shows an error message', async () => {
      const user = userEvent.setup();
      renderWithStore(<AddDashboardModal {...props} />);

      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, {
        target: { value: 'Dashboard Name' },
      });

      const confirmButton = screen.getByRole('button', { name: 'Create' });
      await user.click(confirmButton);
      await waitFor(() => {
        const appStatus = screen.getByTestId('AppStatus-error');
        expect(appStatus).toHaveClass('appStatus--error');
      });
    });
  });

  describe('When canSeeHiddenVariables is true', () => {
    it('shows the hide dashboard checkbox', () => {
      renderWithStore(<AddDashboardModal {...props} canSeeHiddenVariables />);

      expect(screen.getByLabelText('Hide dashboard')).toBeInTheDocument();
    });

    it('calls the correct prop when toggling hide dashboard', async () => {
      const user = userEvent.setup();
      renderWithStore(<AddDashboardModal {...props} canSeeHiddenVariables />);

      const hideCheckbox = screen.getByLabelText('Hide dashboard');
      await user.click(hideCheckbox);

      expect(props.onToggleHideDashboard).toHaveBeenCalledWith(true);
    });
  });

  describe('When modal is closed', () => {
    it('does not render modal content', () => {
      renderWithStore(<AddDashboardModal {...props} isModalOpen={false} />);

      expect(screen.queryByText('New Dashboard')).not.toBeInTheDocument();
    });
  });
});
