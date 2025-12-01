import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render, screen } from '@testing-library/react';
import { capitalize } from 'lodash';
import userEvent from '@testing-library/user-event';

import ConfirmationModal from '../StatusChangeConfirmationModal';
import { getModalTranslations } from '../utils/helpers';

describe('<ConfirmationModal />', () => {
  const t = i18nextTranslateStub();
  const activeUser = {
    is_active: true,
    fullname: 'Prof. Oak',
  };

  const props = {
    shouldShowModal: true,
    closeModal: jest.fn(),
    onConfirm: jest.fn(),
    t,
    user: activeUser,
  };

  const modalTranslations = getModalTranslations(t);

  it('should show the modal for an active user', async () => {
    render(<ConfirmationModal {...props} />);

    expect(
      await screen.findByText(`Deactivate ${activeUser.fullname}`)
    ).toBeInTheDocument();

    expect(
      screen.getByText(`${activeUser.fullname} will not have access to IP`)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: capitalize(modalTranslations.deactivate),
      })
    ).toBeInTheDocument();
  });

  it('should show the modal for an inactive user', async () => {
    render(
      <ConfirmationModal
        {...props}
        user={{ ...activeUser, is_active: false }}
      />
    );

    expect(
      await screen.findByText(`Activate ${activeUser.fullname}`)
    ).toBeInTheDocument();

    expect(
      screen.getByText(`${activeUser.fullname} will have access to IP`)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: capitalize(modalTranslations.activate),
      })
    ).toBeInTheDocument();
  });

  it("should trigger the buttons' callbacks", async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...props} />);

    await user.click(
      screen.getByRole('button', {
        name: capitalize(modalTranslations.deactivate),
      })
    );

    expect(props.onConfirm).toHaveBeenCalled();

    await user.click(
      screen.getByRole('button', {
        name: modalTranslations.cancel,
      })
    );

    expect(props.closeModal).toHaveBeenCalled();
  });
});
