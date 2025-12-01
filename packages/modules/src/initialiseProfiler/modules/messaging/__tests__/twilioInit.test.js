import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Client } from '@twilio/conversations';
import { useGetInitialContextQuery } from '@kitman/modules/src/Messaging/src/redux/services/messaging';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useTwilioClient } from '@kitman/common/src/contexts/TwilioClientContext';
import { isNotificationEnabled } from '../utils';
import { TwilioInitialiser } from '..';

jest.mock('@twilio/conversations');
jest.mock('@kitman/services/src/services/messaging/getInitialData');
jest.mock('@kitman/modules/src/Messaging/src/redux/slices/messagingSlice');
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  isNotificationEnabled: jest.fn(),
}));
jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  usePermissions: jest.fn(),
}));
jest.mock('@kitman/modules/src/Messaging/src/redux/services/messaging', () => ({
  useGetInitialContextQuery: jest.fn(),
}));
jest.mock('@kitman/common/src/contexts/TwilioClientContext', () => ({
  useTwilioClient: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    messaging: (state = {}) => state,
  },
});

const mockClient = {
  on: jest.fn(),
  removeAllListeners: jest.fn(),
  shutdown: jest.fn(),
};
const mockResponse = {
  context: JSON.stringify({ token: '123' }),
};

const TestWrapper = ({ children }) => (
  <Provider store={mockStore}>{children}</Provider>
);
const mockSetTwilioClient = jest.fn();

describe('TwilioInitialiser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Client.mockImplementation(() => mockClient);
    useGetInitialContextQuery.mockReturnValue({
      data: mockResponse,
      isSuccess: true,
    });
    useTwilioClient.mockReturnValue({ setTwilioClient: mockSetTwilioClient });
  });

  describe('when canViewMessaging permission is false', () => {
    beforeEach(() => {
      jest.spyOn(Client, 'mockImplementation');
      usePermissions.mockReturnValue({
        permissions: {
          messaging: {
            canViewMessaging: false,
          },
        },
      });
    });
    it('does not initialize the Client', () => {
      render(
        <TestWrapper>
          <TwilioInitialiser />
        </TestWrapper>
      );
      expect(Client).not.toHaveBeenCalled();
    });
  });
  describe('when canViewMessaging permission is true', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          messaging: {
            canViewMessaging: true,
          },
        },
      });
      jest.spyOn(Client, 'mockImplementation');
    });
    it('initialise the Client', () => {
      render(
        <TestWrapper>
          <TwilioInitialiser />
        </TestWrapper>
      );
      expect(Client).toHaveBeenCalled();
    });
    it('subscribe to client events', async () => {
      render(
        <TestWrapper>
          <TwilioInitialiser />
        </TestWrapper>
      );
      await waitFor(() => {
        expect(mockClient.on).toHaveBeenCalledWith(
          'initFailed',
          expect.any(Function)
        );
      });

      expect(mockClient.on).toHaveBeenCalledWith(
        'initialized',
        expect.any(Function)
      );
      expect(mockClient.on).toHaveBeenCalledWith(
        'conversationUpdated',
        expect.any(Function)
      );
      expect(mockClient.on).toHaveBeenCalledWith(
        'conversationLeft',
        expect.any(Function)
      );
      expect(mockClient.on).toHaveBeenCalledWith(
        'messageAdded',
        expect.any(Function)
      );
    });
    it('calls setTwilioClient on successful initialization', async () => {
      render(
        <TestWrapper>
          <TwilioInitialiser />
        </TestWrapper>
      );

      const initializedCallback = mockClient.on.mock.calls.find(
        (call) => call[0] === 'initialized'
      )[1];

      initializedCallback();

      await waitFor(() => {
        expect(mockSetTwilioClient).toHaveBeenCalledWith(mockClient);
      });
    });
    it('calls isNotificationEnabled on successful initialization', async () => {
      render(
        <TestWrapper>
          <TwilioInitialiser />
        </TestWrapper>
      );

      const initializedCallback = mockClient.on.mock.calls.find(
        (call) => call[0] === 'messageAdded'
      )[1];

      initializedCallback();

      await waitFor(() => {
        expect(isNotificationEnabled).toHaveBeenCalled();
      });
    });
    it('cleans up client on unmount', async () => {
      const { unmount } = render(
        <TestWrapper>
          <TwilioInitialiser />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockClient.on).toHaveBeenCalled();
      });

      unmount();

      expect(mockClient.removeAllListeners).toHaveBeenCalled();
      expect(mockClient.shutdown).toHaveBeenCalled();
    });
  });

  describe('when isSuccess is false', () => {
    beforeEach(() => {
      useGetInitialContextQuery.mockReturnValue({
        data: null,
        isSuccess: false,
      });
    });
    it('does not initialize the Client', () => {
      render(
        <TestWrapper>
          <TwilioInitialiser />
        </TestWrapper>
      );
      expect(Client).not.toHaveBeenCalled();
    });
  });
});
