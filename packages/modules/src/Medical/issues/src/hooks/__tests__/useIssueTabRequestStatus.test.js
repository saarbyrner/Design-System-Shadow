import { screen, render, act, waitFor } from '@testing-library/react';
import { useIssueTabRequestStatus } from '../useIssueTabRequestStatus';
import MockedIssueTabRequestStatusContextProvider from '../utils/mocks';

describe('useIssueTabRequestStatus', () => {
  it('renders children with default context value', () => {
    const TestComponent = () => {
      const { issueTabRequestStatus, isIssueTabLoading } =
        useIssueTabRequestStatus();

      return (
        <div>
          <p data-testid="status">{issueTabRequestStatus}</p>
          <p data-testid="isLoading">{isIssueTabLoading.toString()}</p>
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('status')).toHaveTextContent('DORMANT');
    expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
  });

  it('returns loading state when expected', async () => {
    const TestComponent = () => {
      const { issueTabRequestStatus, isIssueTabLoading } =
        useIssueTabRequestStatus();

      return (
        <div>
          <p data-testid="status">{issueTabRequestStatus}</p>
          <p data-testid="isLoading">{isIssueTabLoading.toString()}</p>
        </div>
      );
    };

    await act(async () => {
      render(
        <MockedIssueTabRequestStatusContextProvider
          issueTabRequestStatusContext={{
            issueTabRequestStatus: 'PENDING',
            isIssueTabLoading: true,
            updateIssueTabRequestStatus: jest.fn(),
          }}
        >
          <TestComponent />
        </MockedIssueTabRequestStatusContextProvider>
      );
    });

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('PENDING')
    );
    expect(screen.getByTestId('isLoading')).toHaveTextContent('true');
  });
});
