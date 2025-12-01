import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AppStatusContainer from '../AppStatus';
import * as actions from '../../actions';

jest.mock('../../actions', () => ({
  hideAppStatus: jest.fn(),
}));

describe('AppStatus Container', () => {
  it('renders', () => {
    const mockState = {
      AppStatus: {
        status: 'appStatus',
      },
    };

    renderWithRedux(<AppStatusContainer />, {
      preloadedState: mockState,
      useGlobalStore: false,
    });

    expect(screen.getByTestId('AppStatus-appStatus')).toBeInTheDocument();
  });

  it('sends the correct action when hideAppStatus is called', async () => {
    const user = userEvent.setup();
    actions.hideAppStatus.mockReturnValue({ type: 'HIDE_APP_STATUS' });

    const mockState = {
      AppStatus: {
        status: 'validationError',
        message: 'Test validation error',
      },
    };

    renderWithRedux(<AppStatusContainer />, {
      preloadedState: mockState,
      useGlobalStore: false,
    });

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(actions.hideAppStatus).toHaveBeenCalled();
  });
});
