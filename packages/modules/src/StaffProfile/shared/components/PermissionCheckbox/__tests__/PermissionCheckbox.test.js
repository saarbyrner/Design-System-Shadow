import { render, screen } from '@testing-library/react';
import PermissionCheckbox from '@kitman/modules/src/StaffProfile/shared/components/PermissionCheckbox';

const props = {
  checked: true,
  handleChange: () => {},
  permissionName: 'Add Alerts',
  permissionKey: 'add-alerts',
  description: 'Some description',
};

describe('<PermissionCheckbox/>', () => {
  it('renders checkbox checked when checked is true', async () => {
    render(<PermissionCheckbox {...props} />);

    expect(screen.getByText(props.permissionName)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();
    expect(checkbox).toBeEnabled();
  });

  it('renders checkbox not checked when checked is false', async () => {
    render(<PermissionCheckbox {...props} checked={false} />);

    expect(screen.getByText(props.permissionName)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeEnabled();
  });

  it('renders disabled checkbox when the prop is passed', async () => {
    render(<PermissionCheckbox {...props} disabled />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });
});
