import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import {
  defaultProps,
  mockPermissions,
} from '@kitman/modules/src/shared/MatchReport/src/utils/matchReportTestUtils';

import MatchReportHeaderMUI from '../MatchReportHeaderMUI';

// Mock the hooks
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');

describe('MatchReportHeaderMUI', () => {
  const mockLeagueOperationsDefault = {
    isLeague: false,
    isOfficial: false,
  };

  const renderComponent = ({
    props = defaultProps,
    leagueOpsProps = mockLeagueOperationsDefault,
    permissions = mockPermissions,
  }) => {
    useLeagueOperations.mockReturnValue(leagueOpsProps);
    usePermissions.mockReturnValue({
      permissions,
    });
    renderWithRedux(<MatchReportHeaderMUI {...props} />);
  };

  describe('Event Information Display', () => {
    it('renders event title correctly', () => {
      renderComponent({});

      expect(
        screen.getByText('U16 KL Toronto v U17 KL Atlanta')
      ).toBeInTheDocument();
    });

    it('displays the subtitle information', () => {
      renderComponent({});
      expect(
        screen.getByText(
          'Mar 1, 2025 7:15pm Europe/Dublin | Stadium Name | Match no. 12345'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Permissions', () => {
    it('does not render buttons when user lacks manageMatchReport permission', () => {
      const noPermissions = {
        leagueGame: {
          manageMatchReport: false,
        },
      };

      renderComponent({ permissions: noPermissions });

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Officials View Buttons', () => {
    it('renders Save and Submit buttons for officials', () => {
      renderComponent({ leagueOpsProps: { isOfficial: true } });

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Submit' })
      ).toBeInTheDocument();
    });

    it('calls handleOnSaveReport when Save button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOpsProps: { isOfficial: true } });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(defaultProps.handleOnSaveReport).toHaveBeenCalledTimes(1);
      expect(defaultProps.handleOnSaveReport).not.toHaveBeenCalledWith({
        isSubmit: true,
      });
    });

    it('calls handleOnSaveReport with isSubmit true when Submit button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOpsProps: { isOfficial: true } });

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(defaultProps.handleOnSaveReport).toHaveBeenCalledWith({
        isSubmit: true,
      });
    });

    it('disables buttons when areHeaderButtonsDisabled is true', () => {
      renderComponent({
        props: { ...defaultProps, areHeaderButtonsDisabled: true },
        leagueOpsProps: { isOfficial: true },
      });

      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    describe('mobile view', () => {
      beforeEach(() => {
        window.innerWidth = 500;
      });
      afterEach(() => {
        window.innerWidth = 1400;
      });

      it('renders the appropriate mobile buttons with their respective icons', () => {
        renderComponent({ leagueOpsProps: { isOfficial: true } });

        expect(
          screen.queryByRole('button', { name: 'Save' })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: 'Submit' })
        ).not.toBeInTheDocument();

        expect(screen.getAllByRole('button').length).toEqual(2);
      });
    });
  });

  describe('League Admin View Buttons', () => {
    it('renders Edit button when not in edit mode', () => {
      renderComponent({
        leagueOpsProps: { isLeague: true },
      });

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Cancel' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Save' })
      ).not.toBeInTheDocument();
    });

    it('calls enableEditMode when Edit button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        leagueOpsProps: { isLeague: true },
      });

      await user.click(screen.getByRole('button', { name: 'Edit' }));

      expect(defaultProps.enableEditMode).toHaveBeenCalledTimes(1);
    });

    it('renders Cancel and Save buttons when in edit mode', () => {
      renderComponent({
        props: { ...defaultProps, isEditMode: true },
        leagueOpsProps: { isLeague: true },
      });

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Edit' })
      ).not.toBeInTheDocument();
    });

    it('calls handleRevertingReportChanges when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: { ...defaultProps, isEditMode: true },
        leagueOpsProps: { isLeague: true },
      });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(defaultProps.handleRevertingReportChanges).toHaveBeenCalledTimes(
        1
      );
    });

    it('calls handleSaveReport when Save button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: {
          ...defaultProps,
          isEditMode: true,
          areHeaderButtonsDisabled: false,
        },
        leagueOpsProps: { isLeague: true },
      });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(defaultProps.handleOnSaveReport).toHaveBeenCalledWith({
        isSubmit: true,
      });
    });

    describe('mobile view', () => {
      beforeEach(() => {
        window.innerWidth = 500;
      });
      afterEach(() => {
        window.innerWidth = 1400;
      });

      it('renders the appropriate mobile buttons with their respective icons when not in edit mode', () => {
        renderComponent({ leagueOpsProps: { isLeague: true } });

        expect(
          screen.queryByRole('button', { name: 'Edit' })
        ).not.toBeInTheDocument();

        expect(screen.getAllByRole('button').length).toEqual(1);
      });

      it('renders the appropriate mobile buttons with their respective icons when  in edit mode', () => {
        renderComponent({
          props: { ...defaultProps, isEditMode: true },
          leagueOpsProps: { isLeague: true },
        });

        expect(
          screen.queryByRole('button', { name: 'Edit' })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: 'Save' })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: 'Cancel' })
        ).not.toBeInTheDocument();

        expect(screen.getAllByRole('button').length).toEqual(2);
      });
    });
  });
});
