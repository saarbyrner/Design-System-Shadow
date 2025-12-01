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
  fieldKey: 'exportFormat',
  label: 'Export format',
  options: [
    {
      value: 'pdf',
      name: 'PDF',
    },
    {
      value: 'csv',
      name: 'CSV',
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
      <ExportSettings.CommonFields.Mui.RadioList {...props} />
    </ExportSettings>
  );

describe('<RadioList />', () => {
  it('renders a list of radio buttons with a label', () => {
    renderComponent();

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
    defaultProps.options.forEach((item) => {
      expect(
        screen.getByRole('radio', { name: item.name })
      ).toBeInTheDocument();
    });
  });

  it('can select an option listed in the radio group and store it in the form state', async () => {
    expect.hasAssertions();

    const { user } = renderComponent();

    await user.click(
      screen.getByRole('radio', { name: defaultProps.options[0].name })
    );

    await clickDownload(user);

    expectFormState(mockOnSave, {
      exportFormat: defaultProps.options[0].value,
    });

    mockOnSave.mockClear();

    await user.click(
      screen.getByRole('radio', { name: defaultProps.options.at(-1).name })
    );

    await clickDownload(user);

    expectFormState(mockOnSave, {
      exportFormat: defaultProps.options.at(-1).value,
    });
  });

  it('supports caching', async () => {
    expect.hasAssertions();

    const settingsKey = 'CommonFields.RadioList|Cache';

    const { user, ...component } = renderComponent(
      {
        ...defaultProps,
        isCached: true,
      },
      settingsKey
    );

    await userEvent.click(
      screen.getByRole('radio', { name: defaultProps.options[0].name })
    );

    await clickDownload(user);

    expectFormState(mockOnSave, {
      exportFormat: defaultProps.options[0].value,
    });

    // Unmounting component to make sure state is clean
    mockOnSave.mockClear();
    component.unmount();

    renderComponent({ ...defaultProps, isCached: true }, settingsKey);

    await clickDownload(user);

    expectFormState(mockOnSave, {
      exportFormat: defaultProps.options[0].value,
    });
  });
});
