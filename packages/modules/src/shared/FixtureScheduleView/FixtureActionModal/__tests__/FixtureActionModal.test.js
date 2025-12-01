import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { fixtureReports, menuButtonTypes } from '../../helpers';
import FixtureActionModal from '../index';

describe('FixtureActionModal', () => {
  const defaultProps = {
    reportType: fixtureReports.matchReport,
    actionType: menuButtonTypes.unlock,
    id: 1,
    isLoading: false,
    clearActionInfo: jest.fn(),
    onFixtureMenuActionSuccess: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const componentRender = (props = defaultProps) =>
    render(<FixtureActionModal {...props} />);

  describe('default render', () => {
    it('renders the modal with the default properties', () => {
      componentRender({
        ...defaultProps,
        actionType: '',
      });

      expect(
        screen.queryByText('Unlock match report?')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Unlock match monitor report?')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Withdraw request?')).not.toBeInTheDocument();
      expect(screen.queryByText('Reset match report?')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Reset match monitor report?')
      ).not.toBeInTheDocument();

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  describe('Unlock report version render', () => {
    describe('unlock match report modal', () => {
      it('renders the unlock modal and title', () => {
        componentRender();
        expect(screen.getByText('Unlock match report?')).toBeInTheDocument();
        expect(
          screen.getByText(
            'If you unlock this report, the report will become editable for the assigned officials.'
          )
        ).toBeInTheDocument();

        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Unlock')).toBeInTheDocument();
      });

      it('allows the user to execute the unlock button actions', async () => {
        const user = userEvent.setup();
        componentRender();
        await user.click(screen.getByText('Cancel'));
        expect(defaultProps.clearActionInfo).toHaveBeenCalled();
        await user.click(screen.getByText('Unlock'));
        expect(defaultProps.onFixtureMenuActionSuccess).toHaveBeenCalled();
      });
    });

    describe('unlock match monitor report modal', () => {
      it('renders the unlock modal and title', () => {
        componentRender({
          ...defaultProps,
          reportType: fixtureReports.matchMonitorReport,
        });
        expect(
          screen.getByText('Unlock match monitor report?')
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            'If you unlock this report, the report will become editable for the assigned match monitors.'
          )
        ).toBeInTheDocument();

        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Unlock')).toBeInTheDocument();
      });
    });
  });

  describe('Reset report version render', () => {
    describe('Reset match report modal', () => {
      it('renders the reset modal and title', () => {
        componentRender({ ...defaultProps, actionType: menuButtonTypes.reset });
        expect(screen.getByText('Reset match report?')).toBeInTheDocument();
        expect(
          screen.getByText(
            'If you reset this report, the report will revert to its initial default state.'
          )
        ).toBeInTheDocument();

        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Reset')).toBeInTheDocument();
      });
    });

    describe('Reset match monitor report modal', () => {
      it('renders the reset modal and title', () => {
        componentRender({
          ...defaultProps,
          reportType: fixtureReports.matchMonitorReport,
          actionType: menuButtonTypes.reset,
        });
        expect(
          screen.getByText('Reset match monitor report?')
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            'If you reset this report, the report will revert to its initial default state.'
          )
        ).toBeInTheDocument();

        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Reset')).toBeInTheDocument();
      });
    });
  });

  describe('Withdraw request version render', () => {
    it('renders the reset modal and title', () => {
      componentRender({
        ...defaultProps,
        actionType: menuButtonTypes.withdraw,
      });
      expect(screen.getByText('Withdraw request?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'This removes the scout from the game, revoking their access. To regain access, another request must be submitted.'
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });
});
