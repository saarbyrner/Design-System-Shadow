import { screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import MessageToast from '@kitman/modules/src/Messaging/src/components/MessageToast';
import { TOAST_TYPE } from '@kitman/components/src/Toast/types';
import { updateNotificationLevel } from '@kitman/modules/src/Messaging/src/utils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@kitman/common/src/contexts/TwilioClientContext', () => ({
  useTwilioClient: jest.fn().mockReturnValue({ twilioClient: {} }),
}));

jest.mock('@kitman/modules/src/Messaging/src/utils', () => ({
  ...jest.requireActual('@kitman/modules/src/Messaging/src/utils'),
  updateNotificationLevel: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useEventTracking');

const defaultProps = {
  toast: {
    id: 1,
    title: 'Message title',
    description: 'Message description',
    type: TOAST_TYPE.MESSAGE,
    metadata: {
      time: '14:30 PM',
      channelSid: 'CH123',
    },
  },
  onClose: jest.fn(),
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(<MessageToast {...props} />);

describe('<MessageToast />', () => {
  let navigateMock;
  let dispatchMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useNavigate.mockReturnValue(navigateMock);
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders the toast correctly', () => {
    renderComponent();

    expect(screen.getByText(defaultProps.toast.title)).toBeInTheDocument();
    expect(
      screen.getByText(defaultProps.toast.description)
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Mute')).toBeInTheDocument();
    expect(screen.getByText('14:30 PM')).toBeInTheDocument();
  });

  it('calls the correct callback when clicking the close button', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByLabelText('Close'));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledWith(1);
  });

  it('calls the correct callback when trigger the redirect option', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByText('1 new message'));

    expect(navigateMock).toHaveBeenCalledWith('/messaging');
    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });

  it('calls the correct callback when mute the notifications button', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByLabelText('Mute'));

    expect(updateNotificationLevel).toHaveBeenCalledTimes(1);
  });

  describe('Toast removal delay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('applies the DefaultRemovalDelay of 5 seconds', () => {
      renderComponent();
      expect(screen.getByText(defaultProps.toast.title)).toBeInTheDocument();
      expect(defaultProps.onClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(5000);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledWith(defaultProps.toast.id);
    });
  });
});
