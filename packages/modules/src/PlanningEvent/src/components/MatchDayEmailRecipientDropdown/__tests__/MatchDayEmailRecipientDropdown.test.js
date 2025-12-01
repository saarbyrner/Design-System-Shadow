import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import getEmailRecipients from '@kitman/services/src/services/notifications/getEmailRecipients';
import getParticipants from '@kitman/services/src/services/notifications/getParticipants';
import mockedEmailRecipients from '@kitman/services/src/services/notifications/getEmailRecipients/mock';
import mockedParticipants from '@kitman/services/src/services/notifications/getParticipants/mock';
import MatchDayEmailRecipientDropdown from '..';

jest.mock('@kitman/services/src/services/notifications/getEmailRecipients');
jest.mock('@kitman/services/src/services/notifications/getParticipants');

const props = {
  t: i18nextTranslateStub(),
  selectedRecipients: [],
  mode: 'DMN',
  onChange: () => {},
  isTeamNotificationsFlow: true,
};

describe('<MatchDayEmailRecipientDropdown />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getEmailRecipients.mockResolvedValueOnce(mockedEmailRecipients);
    getParticipants.mockResolvedValueOnce(mockedParticipants);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders successfully', async () => {
    render(<MatchDayEmailRecipientDropdown {...props} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Mailing List')).toBeInTheDocument();
    });
  });
  it('calls onChange to set selected recipients when the component is mounted', async () => {
    const mockOnChange = jest.fn();
    render(
      <MatchDayEmailRecipientDropdown {...props} onChange={mockOnChange} />
    );
    await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
    expect(mockOnChange).toHaveBeenCalled();
  });
  it('calls onChange when a recipient is clicked', async () => {
    const mockOnChange = jest.fn();
    render(
      <MatchDayEmailRecipientDropdown {...props} onChange={mockOnChange} />
    );
    await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
    userEvent.click(screen.getByLabelText('Mailing List'));
    userEvent.click(
      await screen.findByText('walterwhite@ididntcookthemeth.com')
    );
    expect(mockOnChange).toHaveBeenCalled();
  });

  it.each([
    {
      expectedCall: getParticipants,
      isTeamNotificationsFlow: false,
      mode: 'DMR',
    },
    {
      expectedCall: getEmailRecipients,
      isTeamNotificationsFlow: true,
      mode: 'DMR',
    },
    {
      expectedCall: getEmailRecipients,
      isTeamNotificationsFlow: false,
      mode: 'DMN',
    },
    {
      expectedCall: getEmailRecipients,
      isTeamNotificationsFlow: true,
      mode: 'DMN',
    },
  ])(
    'calls the correct endpoint when isTeamNotificationsFlow is $isTeamNotificationsFlow and mode is $mode',
    async ({ isTeamNotificationsFlow, mode, expectedCall }) => {
      render(
        <MatchDayEmailRecipientDropdown
          {...props}
          isTeamNotificationsFlow={isTeamNotificationsFlow}
          mode={mode}
        />
      );
      await waitFor(() => expect(expectedCall).toHaveBeenCalled());
    }
  );
});
