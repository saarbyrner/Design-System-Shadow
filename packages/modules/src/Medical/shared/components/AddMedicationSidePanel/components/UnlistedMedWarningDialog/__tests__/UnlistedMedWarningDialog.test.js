import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import UnlistedMedWarningDialog from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/UnlistedMedWarningDialog';

describe('<UnlistedMedWarningDialog />', () => {
  const cancelCallback = jest.fn();
  const confirmCallback = jest.fn();

  const props = {
    isOpen: true,
    onCancel: cancelCallback,
    onConfirm: confirmCallback,

    t: i18nextTranslateStub(),
  };

  it('renders the medication values', async () => {
    render(<UnlistedMedWarningDialog {...props} />);
    expect(screen.getByText('Unlisted Medication Warning')).toBeInTheDocument();
    expect(
      screen.getByText(
        'As this is an unlisted medication please take extra care when logging.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Drug to drug and drug allergy checks will not be performed for this medication.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
  });

  it('calls to onCancel on clicking cancel', async () => {
    const user = userEvent.setup();
    render(<UnlistedMedWarningDialog {...props} />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    await expect(cancelCallback).toHaveBeenCalledTimes(1);
  });

  it('calls to onConfirm on clicking Accept', async () => {
    const user = userEvent.setup();
    render(<UnlistedMedWarningDialog {...props} />);
    const acceptButton = screen.getByRole('button', { name: 'Accept' });
    await user.click(acceptButton);

    await expect(confirmCallback).toHaveBeenCalledTimes(1);
  });
});
