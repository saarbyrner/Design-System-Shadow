import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  useGetNotificationTriggersQuery,
  useUpdateNotificationTriggersMutation,
  useBulkUpdateNotificationTriggersMutation,
} from '@kitman/services/src/services/OrganisationSettings/Notifications';
import Notifications from '../index';

jest.mock('@kitman/services/src/services/OrganisationSettings/Notifications');

const mockApiData = [
  {
    id: 1,
    area: 'event',
    type: 'on_create',
    description: 'Receive notifications when a new event is created.',
    enabled_channels: { staff: ['email', 'push'], athlete: ['email'] },
  },
  {
    id: 2,
    area: 'event',
    type: 'on_update',
    description: 'Receive notifications when event is updated.',
    enabled_channels: { staff: ['email', 'push'], athlete: ['email'] },
  },
  {
    id: 3,
    area: 'forms',
    type: 'on_submit',
    description: 'Receive notifications when a form is submitted.',
    enabled_channels: { staff: ['push'], athlete: [] },
  },
];

describe('<Notifications /> component', () => {
  const mockUpdateTrigger = jest.fn();
  const mockBulkUpdateTrigger = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useGetNotificationTriggersQuery.mockReturnValue({
      data: mockApiData,
      isLoading: false,
    });

    useUpdateNotificationTriggersMutation.mockReturnValue([
      mockUpdateTrigger,
      { isLoading: false },
    ]);

    useBulkUpdateNotificationTriggersMutation.mockReturnValue([
      mockBulkUpdateTrigger,
      { isLoading: false },
    ]);

    mockUpdateTrigger.mockResolvedValue({ unwrap: () => Promise.resolve() });
    mockBulkUpdateTrigger.mockResolvedValue({
      unwrap: () => Promise.resolve(),
    });
  });

  it('renders skeleton rows when data is loading', () => {
    useGetNotificationTriggersQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    renderWithRedux(<Notifications t={i18nextTranslateStub()} />, {
      useGlobalStore: false,
    });
    expect(screen.getByRole('grid')).toHaveClass(
      'MuiDataGrid-main--hasSkeletonLoadingOverlay'
    );
  });

  it('renders the aggregated row and other rows correctly', async () => {
    renderWithRedux(<Notifications t={i18nextTranslateStub()} />, {
      useGlobalStore: false,
    });

    expect(
      await screen.findByText('Calendar notifications')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Receive notifications when a new event is created')
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('gridcell', {
        name: /receive notifications when a form is submitted\./i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/configure notifications for calendar/i)
    ).toBeInTheDocument();
  });

  it('calls bulkUpdate mutation when the target select is changed on an aggregated row', async () => {
    const user = userEvent.setup();
    renderWithRedux(<Notifications t={i18nextTranslateStub()} />, {
      useGlobalStore: false,
    });

    const emailTargetSelect = screen.getAllByLabelText('Who')[2];
    expect(emailTargetSelect).toHaveTextContent('All');

    await user.click(emailTargetSelect);
    await user.click(screen.getByRole('option', { name: 'Staff' }));

    expect(mockBulkUpdateTrigger).toHaveBeenCalledTimes(1);
    expect(mockBulkUpdateTrigger).toHaveBeenCalledWith({
      requestBody: {
        notification_trigger: {
          trigger_type: 'event',
          enabled_channels: {
            staff: ['email', 'push'],
            athlete: [],
          },
        },
      },
    });
  });

  it('reverts the UI state if the update mutation fails', async () => {
    const user = userEvent.setup();

    // Mock the mutation to simulate an API failure.
    mockUpdateTrigger.mockImplementation(() => ({
      unwrap: () => Promise.reject(new Error('Simulated API Error')),
    }));

    renderWithRedux(<Notifications t={i18nextTranslateStub()} />, {
      useGlobalStore: false,
    });

    const formsRow = screen
      .getByRole('gridcell', {
        name: /receive notifications when a form is submitted\./i,
      })
      .closest('div[role="row"]');

    const pushCell = within(formsRow).getAllByRole('gridcell')[3];
    const pushSwitch = within(pushCell).getByRole('checkbox');

    expect(pushSwitch).toBeChecked();

    await user.click(pushSwitch);

    // Wait for the API call to be made and the subsequent UI reversal.
    await waitFor(() => {
      expect(mockUpdateTrigger).toHaveBeenCalledTimes(1);
    });

    // Check that the switch has reverted to its original checked state.
    expect(pushSwitch).toBeChecked();
  });

  it('calls single update mutation when select is changed on a non-aggregated row', async () => {
    const user = userEvent.setup();
    renderWithRedux(<Notifications t={i18nextTranslateStub()} />, {
      useGlobalStore: false,
    });

    const formsRow = screen
      .getByRole('gridcell', {
        name: /receive notifications when a form is submitted\./i,
      })
      .closest('div[role="row"]');

    const pushCell = within(formsRow).getAllByRole('gridcell')[3];
    const pushSelectButton = within(pushCell).getByRole('button');

    expect(pushSelectButton).toHaveTextContent('Staff');

    await user.click(pushSelectButton);
    await user.click(screen.getByRole('option', { name: 'All' }));

    await waitFor(() => {
      expect(mockUpdateTrigger).toHaveBeenCalledTimes(1);
    });

    expect(mockBulkUpdateTrigger).not.toHaveBeenCalled();
    expect(mockUpdateTrigger).toHaveBeenCalledWith({
      id: 3,
      requestBody: {
        notification_trigger: {
          enabled_channels: {
            staff: ['push'],
            athlete: ['push'],
          },
        },
      },
    });
  });
});
