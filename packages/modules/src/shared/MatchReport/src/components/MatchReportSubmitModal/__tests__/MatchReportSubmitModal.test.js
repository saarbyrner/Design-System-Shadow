import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import MatchReportSubmitModal from '../index';

describe('MatchReportSubmitModal', () => {
  const defaultProps = {
    showSaveReportModal: true,
    finalSubmitMode: false,
    saveStatus: '',
    handleOnClose: jest.fn(),
    handleOnSubmit: jest.fn(),
    t: i18nextTranslateStub(),
  };

  // React-modal only detects keycodes input so they have to be setup for userEvent to be properly usable with it.
  const keyCodes = {
    Escape: 27,
  };
  const patchKeyEvent = (e) => {
    Object.defineProperty(e, 'keyCode', {
      get: () => keyCodes[e.code] ?? 0,
    });
  };
  document.addEventListener('keydown', patchKeyEvent, { capture: true });

  const renderComponent = (props = defaultProps) =>
    render(<MatchReportSubmitModal {...props} />);

  describe('initial render', () => {
    it('renders the save report modal', () => {
      renderComponent();
      expect(screen.getByText('Save Report')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Any saved changes will be visible by the league admins and all officials assigned to the report.'
        )
      ).toBeInTheDocument();
    });

    it('renders the submit report modal', () => {
      renderComponent({ ...defaultProps, finalSubmitMode: true });
      expect(screen.getByText('Submit Report')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Once this report has been submitted, only league admins will have the ability to make changes.'
        )
      ).toBeInTheDocument();
    });

    it('allows the user to close the modal on escape', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.keyboard('[Escape]');
      expect(defaultProps.handleOnClose).toHaveBeenCalled();
    });

    it('allows the user to close the modal on clicking cancel', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByText('Cancel'));
      expect(defaultProps.handleOnClose).toHaveBeenCalled();
    });

    it('allows the user to click save and call the handleOnSubmit', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByText('Save'));
      expect(defaultProps.handleOnSubmit).toHaveBeenCalled();
    });
  });
});
