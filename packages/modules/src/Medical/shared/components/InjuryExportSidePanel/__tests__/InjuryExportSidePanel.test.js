import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import InjuryExportSidePanel from '..';

describe('<InjuryExportSidePanel />', () => {
  const props = {
    isOpen: true,
    athleteData: {},
    athleteId: 1,
    onClose: jest.fn(),
    onExportAthleteIssuesData: jest.fn(),
    t: i18nextTranslateStub(),
    entityFilters: [
      'notes',
      'diagnostics',
      'procedures',
      'files',
      'medications',
    ],
  };

  const renderComponent = (customProps = {}) =>
    render(
      <MockedPermissionContextProvider permissionsContext={{}}>
        <InjuryExportSidePanel {...props} {...customProps} />
      </MockedPermissionContextProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    props.onExportAthleteIssuesData.mockClear();
  });

  afterEach(() => {
    cleanup(); // Ensure DOM is reset
  });

  const checkExportPayload = ({ isPrinterFriendly, skipNotification }) => {
    return expect(props.onExportAthleteIssuesData).toHaveBeenCalledWith(
      null, // dateRange
      null, // injuryIllnessValues
      expect.arrayContaining(props.entityFilters), // entityFilters
      expect.anything(), // selectedOtherNotes
      expect.anything(), // unrelatedEntities
      isPrinterFriendly !== undefined && isPrinterFriendly, // isPrinterFriendly
      skipNotification !== undefined && skipNotification // skipNotification
    );
  };

  const getSwitchByLabel = (labelText) => {
    const label = screen.getByText(labelText);
    const switchInput = label.parentNode.querySelector('input');
    return switchInput;
  };

  const clickExportButton = async (user) => {
    const exportButton = screen.getByRole('button', { name: /export/i });
    await user.click(exportButton);
  };

  it('renders the Injury Export Side Panel', async () => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={{
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                canExport: true,
              },
            },
          },
        }}
      >
        <InjuryExportSidePanel {...props} />
      </MockedPermissionContextProvider>
    );

    await screen.findByText('Export player');

    expect(
      screen.getByTestId('InjuryExportPanel|DateRangeSelector')
    ).toBeInTheDocument();
  });

  // ** Receive Email notification toggle switch **
  it('defaults email notification toggle to on', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailSwitch = getSwitchByLabel('Receive email notification');

    // Verify its on by default
    expect(emailSwitch).toHaveAttribute('aria-checked', 'true');
    expect(emailSwitch).toBeChecked();

    // Click toggle to turn it off
    await user.click(emailSwitch);

    // Ensure the toggle is now unchecked
    expect(emailSwitch).not.toBeChecked();
  });

  it('passes skipNotification = TRUE when switch is toggled OFF', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailSwitch = getSwitchByLabel('Receive email notification');

    // Verify its on
    expect(emailSwitch).toHaveAttribute('aria-checked', 'true');
    expect(emailSwitch).toBeChecked();

    // Click toggle to turn it off
    await user.click(emailSwitch);

    // Click export and trigger athleteExport and in there OnExportAthleteIssuesData is called
    await clickExportButton(user);

    checkExportPayload({ skipNotification: true });

    // Ensure the toggle is still unchecked
    expect(emailSwitch).not.toBeChecked();
  });

  it('passes skipNotification = FALSE when switch is toggled ON', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailSwitch = getSwitchByLabel('Receive email notification');

    // Verify its on
    expect(emailSwitch).toHaveAttribute('aria-checked', 'true');
    expect(emailSwitch).toBeChecked();

    // Click export without toggling the switch off - trigger athleteExport and OnExportAthleteIssuesData
    await clickExportButton(user);

    // Ensure that onExportAthleteIssuesData is called with skipNotification = false
    checkExportPayload({ skipNotification: false });

    // Ensure the toggle still checked
    expect(emailSwitch).toBeChecked();
  });

  // ** Request Printer friendly toggle switch **
  it('defaults isPrinterFriendly to OFF', () => {
    renderComponent();

    const printerFriendlySwitch = getSwitchByLabel('Printer friendly version');

    // Check default state
    expect(printerFriendlySwitch).toHaveAttribute('aria-checked', 'false');
    expect(printerFriendlySwitch).not.toBeChecked();
  });

  it('passes isPrinterFriendly = TRUE when toggle is ON', async () => {
    const user = userEvent.setup();
    renderComponent();

    const printerFriendlySwitch = getSwitchByLabel('Printer friendly version');

    // Click toggle
    await user.click(printerFriendlySwitch);

    // Click export and trigger athleteExport and in there OnExportAthleteIssuesData is called
    await clickExportButton(user);

    // Ensure true is passed
    checkExportPayload({ isPrinterFriendly: true });
  });

  it('passes isPrinterFriendly = FALSE when toggle is OFF', async () => {
    const user = userEvent.setup();
    renderComponent();

    const printerFriendlySwitch = getSwitchByLabel('Printer friendly version');

    // Ensure switch is OFF
    expect(printerFriendlySwitch).not.toBeChecked();

    // Click export and trigger athleteExport and in there OnExportAthleteIssuesData is called
    await clickExportButton(user);

    // Ensure false is passed
    checkExportPayload({ isPrinterFriendly: false });
  });

  describe('[FEATURE FLAG] medical-form-pdf-export-enabled ON', () => {
    beforeEach(() => {
      window.featureFlags['medical-form-pdf-export-enabled'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-form-pdf-export-enabled'] = false;
    });

    it('displays Forms checkbox option in sidepanel', async () => {
      renderComponent();
      await screen.findByText('Export player');

      const optionsList = screen.getAllByRole('list');
      const checkboxes = within(optionsList[0]).getAllByRole('checkbox');
      const expectedCheckboxNames = [
        'Non-injury data',
        'Notes',
        'Diagnostics',
        'Procedures',
        'Files',
        'Medications',
        'Rehab',
        'Forms',
      ];

      expect(checkboxes).toHaveLength(expectedCheckboxNames.length);

      expectedCheckboxNames.forEach((name) => {
        const checkbox = within(optionsList[0]).getByRole('checkbox', { name });
        expect(checkbox).toBeInTheDocument();
      });
    });
  });

  describe('[FEATURE FLAG] medical-form-pdf-export-enabled OFF', () => {
    beforeEach(() => {
      window.featureFlags['medical-form-pdf-export-enabled'] = false;
    });

    it('does not displays Forms checkbox option in sidepanel', async () => {
      renderComponent();
      await screen.findByText('Export player');

      const optionsList = screen.getAllByRole('list')[0];
      const checkboxes = within(optionsList).getAllByRole('checkbox');
      const expectedCheckboxNames = [
        'Non-injury data',
        'Notes',
        'Diagnostics',
        'Procedures',
        'Files',
        'Medications',
        'Rehab',
      ];

      expect(checkboxes).toHaveLength(expectedCheckboxNames.length);
      expectedCheckboxNames.forEach((name) => {
        const checkbox = within(optionsList).getByRole('checkbox', { name });
        expect(checkbox).toBeInTheDocument();
      });
    });
  });
});
