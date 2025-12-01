import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { UnsavedChangesModalTranslated as UnsavedChangesModal } from '../UnsavedChangesModal';

setI18n(i18n);

describe('UnsavedChangesModal', () => {
  const handleCloseModal = jest.fn();
  const handleDiscardChanges = jest.fn();

  it('renders', () => {
    render(
      <UnsavedChangesModal
        showModal
        handleCloseModal={handleCloseModal}
        handleDiscardChanges={handleDiscardChanges}
      />
    );

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to leave and discard the changes? Unsaved changes will be lost.'
      )
    ).toBeInTheDocument();

    const discardChangesButton = screen.getByRole('button', {
      name: 'Discard Changes',
    });

    expect(discardChangesButton).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(cancelButton).toBeInTheDocument();
  });
});
