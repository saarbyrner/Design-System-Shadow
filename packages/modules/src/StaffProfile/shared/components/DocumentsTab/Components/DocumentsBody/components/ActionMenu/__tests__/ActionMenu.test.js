import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { setI18n } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';

import { ActionMenuTranslated as ActionMenu } from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentsBody/components/ActionMenu';

setI18n(i18n);

describe('<ActionMenu/>', () => {
  const props = {
    id: 1,
  };

  it('renders edit menu item when clicking icon button', async () => {
    renderWithProviders(<ActionMenu {...props} />);

    const actionButton = screen.getByRole('button', {
      name: 'options-button',
    });

    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toBeEnabled();

    await userEvent.click(actionButton);

    const editMenu = screen.getByText('Edit');
    const archiveMenu = screen.getByText('Archive');

    expect(editMenu).toBeInTheDocument();
    expect(archiveMenu).toBeInTheDocument();
  });
});
