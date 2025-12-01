import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetNotificationTriggersQuery } from '@kitman/services/src/services/OrganisationSettings/Notifications';
import { EventNotificationsTranslated as EventNotifications } from '../index';

jest.mock(
  '@kitman/services/src/services/OrganisationSettings/Notifications',
  () => ({
    useGetNotificationTriggersQuery: jest.fn(),
  })
);

const mockUseGetNotificationTriggersQuery = useGetNotificationTriggersQuery;

const mockDefaultTriggers = [
  {
    area: 'event',
    enabled_channels: {
      staff: ['email'],
      athlete: ['push'],
    },
  },
];

const renderComponent = (props = {}) => {
  const defaultProps = {
    onUpdateNotificationChannels: jest.fn(),
    t: i18nextTranslateStub(),
  };
  return render(<EventNotifications {...defaultProps} {...props} />);
};

describe('<EventNotifications />', () => {
  let onUpdateMock;

  beforeEach(() => {
    onUpdateMock = jest.fn();
    mockUseGetNotificationTriggersQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockDefaultTriggers,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render states', () => {
    it('should render nothing while loading', () => {
      mockUseGetNotificationTriggersQuery.mockReturnValueOnce({
        isLoading: true,
      });
      const { container } = renderComponent();
      expect(container).toBeEmptyDOMElement();
    });

    it('should render nothing on error', () => {
      mockUseGetNotificationTriggersQuery.mockReturnValueOnce({
        isError: true,
      });
      const { container } = renderComponent();
      expect(container).toBeEmptyDOMElement();
    });

    it('should render the component with initial channels selected from API data', () => {
      renderComponent();

      const staffGroup = screen.getByText('Notify staff by').closest('div');
      const athleteGroup = screen
        .getByText('Notify athletes by')
        .closest('div');

      expect(
        within(staffGroup).getByRole('button', { name: 'Email' })
      ).toHaveClass('MuiChip-contained');
      expect(
        within(staffGroup).getByRole('button', { name: 'Push' })
      ).toHaveClass('MuiChip-secondary');

      expect(
        within(athleteGroup).getByRole('button', { name: 'Email' })
      ).toHaveClass('MuiChip-secondary');
      expect(
        within(athleteGroup).getByRole('button', { name: 'Push' })
      ).toHaveClass('MuiChip-containedPrimary');
    });
  });

  describe('User Interactions', () => {
    it('should not display the override alert on initial render', () => {
      renderComponent();
      expect(
        screen.queryByText('Selection applies to this event only')
      ).not.toBeInTheDocument();
    });

    it('should show alert and call onUpdateNotificationChannels when a chip is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ onUpdateNotificationChannels: onUpdateMock });

      onUpdateMock.mockClear();

      const staffGroup = screen.getByText('Notify staff by').closest('div');
      const pushChip = within(staffGroup).getByRole('button', { name: 'Push' });

      await user.click(pushChip);

      expect(
        screen.getByText('Selection applies to this event only')
      ).toBeInTheDocument();

      expect(onUpdateMock).toHaveBeenCalledTimes(1);
      expect(onUpdateMock).toHaveBeenCalledWith({
        staff: ['email', 'push'], // Default 'email' + new 'push'
        athlete: ['push'],
      });
    });
  });
});
