import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';

import {
  ScoutAccessActionsMenuCell,
  getScoutAccessManagementActionsCell,
  getScoutAttendeesCell,
} from '../cellConfig';

describe('cellConfig', () => {
  describe('ScoutAccessActionsMenuCell', () => {
    const defaultProps = {
      event: { id: 1 },
      isVisible: true,
      doesHaveExternalAccessActions: false,
      handleMenuButtonAction: jest.fn(),
    };
    it('does render the cell if it is visible', () => {
      renderWithRedux(<ScoutAccessActionsMenuCell {...defaultProps} />, {
        useGlobalStore: false,
      });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('does not render the cell if it isnt visible', () => {
      renderWithRedux(
        <ScoutAccessActionsMenuCell {...defaultProps} isVisible={false} />,
        {
          useGlobalStore: false,
        }
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders the scout actions menu items when clicked', async () => {
      const user = userEvent.setup();
      renderWithRedux(<ScoutAccessActionsMenuCell {...defaultProps} />, {
        useGlobalStore: false,
      });
      await user.click(screen.getByRole('button'));
      expect(screen.getByText('Withdraw request')).toBeInTheDocument();
      await user.click(screen.getByText('Withdraw request'));

      expect(defaultProps.handleMenuButtonAction).toHaveBeenCalled();
    });

    it('renders the scout external access actions menu items when clicked with the external actions prop', async () => {
      const user = userEvent.setup();
      renderWithRedux(
        <ScoutAccessActionsMenuCell
          {...defaultProps}
          doesHaveExternalAccessActions
        />,
        {
          useGlobalStore: false,
        }
      );
      await user.click(screen.getByRole('button'));
      expect(screen.getByText('Request Access')).toBeInTheDocument();
    });
  });
  describe('getScoutAccessManagementActionsCell', () => {
    it('renders access status limited chips', async () => {
      const params = {
        value: {
          numberOfRequests: {
            total: 3,
            pending: 1,
            approved: 1,
            denied: 1,
            expired: 0,
            withdrawn: 0,
          },
        },
      };

      renderWithRedux(getScoutAccessManagementActionsCell(params, true), {
        useGlobalStore: false,
      });

      expect(screen.getByText('1 pending')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders access status limited chips - showing up approved chip', async () => {
      const params = {
        value: {
          numberOfRequests: {
            total: 2,
            pending: 0,
            approved: 1,
            denied: 1,
            expired: 0,
            withdrawn: 0,
          },
        },
      };

      renderWithRedux(getScoutAccessManagementActionsCell(params, true), {
        useGlobalStore: false,
      });

      expect(screen.getByText('1 approved')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('getScoutAttendeesCell', () => {
    it('renders limited users list', async () => {
      const params = {
        value: [
          {
            id: 1,
            firstname: 'TestName',
            lastname: 'TestSurname',
          },
          {
            id: 2,
            firstname: 'TestName2',
            lastname: 'TestSurname2',
          },
        ],
      };

      renderWithRedux(getScoutAttendeesCell(params), {
        useGlobalStore: false,
      });

      expect(screen.getByText('TestName TestSurname')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});
