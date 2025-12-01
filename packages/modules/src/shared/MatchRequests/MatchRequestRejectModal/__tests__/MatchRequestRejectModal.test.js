import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as denyOptions } from '@kitman/services/src/mocks/handlers/leaguefixtures/getUserEventRequestRejectReasonsHandler';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import MatchRequestRejectModal from '../index';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('MatchRequestRejectModal', () => {
  const denyOptionsFormatted = denyOptions.map((option) => ({
    value: option.id,
    label: option.type_name,
    requiresText: option.require_additional_input,
  }));

  const defaultProps = {
    isOpen: true,
    rejectOptions: denyOptionsFormatted,
    onReject: jest.fn(),
    closeModal: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const componentRender = () => {
    usePreferences.mockReturnValue({
      preferences: {
        scout_access_management: true,
      },
    });

    render(<MatchRequestRejectModal {...defaultProps} />);
  };

  describe('render', () => {
    it('renders the modal', () => {
      componentRender();
      expect(screen.getByText('Reject Access')).toBeInTheDocument();
      expect(screen.getByText('Reason')).toBeInTheDocument();

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('clicking cancel closes the modal', async () => {
      const user = userEvent.setup();
      componentRender();

      await user.click(screen.getByText('Cancel'));
      expect(defaultProps.closeModal).toHaveBeenCalled();
    });

    it('selecting an option and clicking save calls onReject', async () => {
      const user = userEvent.setup();
      componentRender();

      await user.click(screen.getByLabelText('Reason'));
      await user.click(screen.getByText('Conflict of interest'));
      await user.click(screen.getByText('Save'));
      expect(defaultProps.onReject).toHaveBeenCalledWith({
        label: 'Conflict of interest',
        requiresText: 0,
        value: 2,
      });
    });

    it('selecting Other and entering a custom reason and clicking save calls onReject', async () => {
      const user = userEvent.setup();
      componentRender();

      await user.click(screen.getByLabelText('Reason'));
      await user.click(screen.getByText('Other'));

      expect(screen.getByText('Other Reason')).toBeInTheDocument();
      await user.type(screen.getAllByDisplayValue('')[1], 'Test Reason 5');
      await user.click(screen.getByText('Save'));
      expect(defaultProps.onReject).toHaveBeenCalledWith({
        label: 'Test Reason 5',
        value: 3,
        requiresText: 1,
      });
    });
  });
});
