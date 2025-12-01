import i18n from 'i18next';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen, render } from '@testing-library/react';
import useApproveRegistration from '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration';

import Actions from '../components/Actions';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration'
);

const props = {
  t: i18nT,
};

describe('<Actions/>', () => {
  it('renders', () => {
    useApproveRegistration.mockReturnValue({
      approvalOptions: [
        { value: 'approve', label: 'Approve' },
        { value: 'reject', label: 'Reject' },
      ],
    });
    render(<Actions {...props} />);
    const submit = screen.getByRole('button', { name: 'Submit' });
    expect(submit).toBeInTheDocument();
  });

  describe('isSubmitStatusDisabled', () => {
    it('is correctly disabled when it should be', () => {
      useApproveRegistration.mockReturnValue({
        isSubmitStatusDisabled: true,
      });
      render(<Actions {...props} />);
      const submit = screen.getByRole('button', { name: 'Submit' });
      expect(submit).toBeDisabled();
    });

    it('is correctly enabled when it should be', () => {
      useApproveRegistration.mockReturnValue({
        isSubmitStatusDisabled: false,
      });
      render(<Actions {...props} />);
      const submit = screen.getByRole('button', { name: 'Submit' });
      expect(submit).toBeEnabled();
    });
  });
  describe('onApproveRegistration', () => {
    it('calls the correct action when click', async () => {
      const onApproveRegistrationMock = jest.fn();
      const user = userEvent.setup();

      useApproveRegistration.mockReturnValue({
        isSubmitStatusDisabled: false,
        onApproveRegistration: onApproveRegistrationMock,
      });
      render(<Actions {...props} />);
      const submit = screen.getByRole('button', { name: 'Submit' });
      await user.click(submit);
      expect(onApproveRegistrationMock).toHaveBeenCalled();
    });
  });
});
