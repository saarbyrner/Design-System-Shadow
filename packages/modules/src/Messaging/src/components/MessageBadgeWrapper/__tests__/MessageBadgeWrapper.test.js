import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MessageBadgeWrapper from '../index';

const defaultProps = {
  children: <div data-testid="child-component">Test Child</div>,
};

const mockStore = configureStore({
  reducer: {
    messagingSlice: (
      state = {
        totalUnread: 5,
      }
    ) => state,
  },
});

const TestWrapper = ({ children }) => (
  <Provider store={mockStore}>{children}</Provider>
);

describe('<MessageBadgeWrapper /> component', () => {
  describe('when FF cp-messaging-notifications is enabled', () => {
    beforeEach(() => {
      window.setFlag('cp-messaging-notifications', true);
      window.setFlag('single-page-application', true);
    });

    it('renders Badge component with unread message counter', () => {
      render(
        <TestWrapper>
          <MessageBadgeWrapper {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
      expect(screen.getByText(5)).toBeInTheDocument();
    });
  });

  describe('when FF cp-messaging-notifications is disabled', () => {
    beforeEach(() => {
      window.setFlag('cp-messaging-notifications', false);
      window.setFlag('single-page-application', true);
    });

    it('does not render Badge component', () => {
      render(
        <TestWrapper>
          <MessageBadgeWrapper {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
      expect(screen.queryByText(5)).not.toBeInTheDocument();
    });
  });
});
