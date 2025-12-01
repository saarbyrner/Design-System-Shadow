import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';

const clickDownload = (user) =>
  user.click(screen.getByRole('button', { name: 'Download' }));

const expectFormState = (onSaveMock, formState) =>
  expect(onSaveMock).toHaveBeenCalledWith(
    formState,
    expect.anything() // will test updateStatus callback down the line
  );

const mockOnSave = jest.fn();

const defaultProps = {
  fieldKey: 'columns',
  label: 'Columns',
  items: [
    {
      value: 'injury_name',
      label: 'Injury name',
    },
    {
      value: 'injury_date',
      label: 'Date of injury',
    },
    {
      value: 'side',
      label: 'Body area or side',
    },
    {
      value: 'post_injury_days',
      label: 'Post injury days',
    },
  ],
  isCached: false,
};

const renderComponent = (props = defaultProps, settingsKey = null) =>
  renderWithUserEventSetup(
    <ExportSettings
      mui
      title="My Settings"
      onSave={mockOnSave}
      onCancel={() => {}}
      isOpen
      settingsKey={settingsKey}
    >
      <ExportSettings.CommonFields.Mui.CheckboxList {...props} />
    </ExportSettings>
  );

describe('<CheckboxList />', () => {
  it('renders a list of checkboxes with a label', () => {
    renderComponent();

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
    defaultProps.items.forEach((item) => {
      expect(
        screen.getByRole('checkbox', { name: item.label })
      ).toBeInTheDocument();
    });
  });

  it('can select items listed in the checkboxes and store them in the form state', async () => {
    expect.hasAssertions();

    const { user } = renderComponent();

    await user.click(
      screen.getByRole('checkbox', { name: defaultProps.items[0].label })
    );

    await clickDownload(user);

    expectFormState(mockOnSave, {
      columns: [defaultProps.items[0].value],
    });

    mockOnSave.mockClear();

    await user.click(
      screen.getByRole('checkbox', { name: defaultProps.items.at(-1).label })
    );

    await clickDownload(user);

    expectFormState(mockOnSave, {
      columns: [defaultProps.items[0].value, defaultProps.items.at(-1).value],
    });
  });

  it('supports caching', async () => {
    expect.hasAssertions();

    const settingsKey = 'CommonFields.CheckboxList|Cache';

    const { user, ...component } = renderComponent(
      {
        ...defaultProps,
        isCached: true,
      },
      settingsKey
    );

    await userEvent.click(
      screen.getByRole('checkbox', { name: defaultProps.items[0].label })
    );

    await clickDownload(user);

    expectFormState(mockOnSave, {
      columns: [defaultProps.items[0].value],
    });

    // Unmounting component to make sure state is clean
    mockOnSave.mockClear();
    component.unmount();

    renderComponent({ ...defaultProps, isCached: true }, settingsKey);

    await clickDownload(user);

    expectFormState(mockOnSave, {
      columns: [defaultProps.items[0].value],
    });
  });
});
