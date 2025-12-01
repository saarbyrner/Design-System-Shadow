import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical';

import SearchBarFilter from '../SearchBarFilter';

const defaultPermissions = {
  medical: {
    ...defaultMedicalPermissions,
  },
};

const defaultProps = {
  placeholder: 'Search placeholder',
  onValidation: jest.fn(),
};

const renderTestComponent = (permissions = defaultPermissions, props) =>
  render(
    <MockedPermissionContextProvider
      permissionsContext={{ ...DEFAULT_CONTEXT_VALUE, permissions }}
    >
      <SearchBarFilter {...{ ...defaultProps, ...props }} />
    </MockedPermissionContextProvider>
  );

describe('<SearchBarFilter />', () => {
  it('renders the placeholder value', async () => {
    renderTestComponent();
    await waitFor(() => {
      const placeholderValue =
        screen.getByPlaceholderText('Search placeholder');
      expect(placeholderValue).toBeInTheDocument();
    });
  });

  it('fires onValidation prop when user types', async () => {
    renderTestComponent();

    await waitFor(() => screen.getByPlaceholderText('Search placeholder'));

    await userEvent.type(screen.getByRole('textbox'), 'New Test Search Value');
    expect(defaultProps.onValidation).toHaveBeenCalledWith(
      'New Test Search Value'
    );
  });
});
