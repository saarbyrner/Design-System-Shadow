import { Provider } from 'react-redux';
import { render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import userEvent from '@testing-library/user-event';
import {
  mockedDiagnosticContextValue,
  mockedCovidDiagnosticContextValue,
  mockedMedicationDiagnosticContextValue,
  mockedDiagnosticWithAnnotationContextValue,
  mockedRedoxDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import Header from '../Header';

const props = {
  playerOptions: [],
  categoryOptions: [],
  t: i18nextTranslateStub(),
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  addDiagnosticSidePanel: {
    isOpen: false,
  },
});

const renderWithProviders = (
  passedDiagnosticContext,
  permissions = mockedDefaultPermissionsContextValue.permissions,
  passedProps = props
) => {
  render(
    <Provider store={store}>
      <MockedPermissionContextProvider
        permissionsContext={{
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
              ...permissions.medical,
            },
          },
        }}
      >
        <MockedDiagnosticContextProvider
          diagnosticContext={passedDiagnosticContext}
        >
          <Header {...passedProps} />
        </MockedDiagnosticContextProvider>
      </MockedPermissionContextProvider>
    </Provider>
  );
};

describe('redox flow', () => {
  beforeEach(() => {
    window.featureFlags = {
      'edit-diagnostic-redox': true,
      'redox-iteration-1': true,
      redox: true,
    };
    const fakeDate = new Date('2025-06-15T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    window.featureFlags = {};
  });

  const renderWithHiddenFilters = (hiddenFilters = []) => {
    render(
      <Provider store={store}>
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                diagnostics: {
                  canView: true,
                  canCreate: true,
                  canEdit: true,
                  canArchive: true,
                },
              },
            },
          }}
        >
          <MockedDiagnosticContextProvider
            diagnosticContext={mockedRedoxDiagnosticContextValue}
          >
            <Header {...props} hiddenFilters={hiddenFilters} />
          </MockedDiagnosticContextProvider>
        </MockedPermissionContextProvider>
      </Provider>
    );
  };

  it('does render Edit button', async () => {
    renderWithHiddenFilters([]);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('does not render Edit button when hidden', async () => {
    renderWithHiddenFilters(['add_diagnostic_button']);

    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });
});

describe('[permissions] default permissions', () => {
  beforeEach(() => {
    const fakeDate = new Date('2025-06-15T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the correct content for standard diagnostic types', () => {
    renderWithProviders(mockedDiagnosticContextValue);

    expect(
      screen.getByRole('heading', { name: 'Diagnostic details' })
    ).toBeInTheDocument();

    const list = screen.getAllByRole('list');
    const firstListItem = within(list[0]).getAllByRole('listitem');

    expect(
      within(firstListItem[0]).getByText('Diagnostic type:')
    ).toBeInTheDocument();
    expect(
      within(firstListItem[0]).getByText('3D Analysis')
    ).toBeInTheDocument();

    expect(within(firstListItem[1]).getByText('Reason:')).toBeInTheDocument();
    expect(within(firstListItem[1]).getByText('--')).toBeInTheDocument(); // No diagnostic_reason.name value
  });

  it('renders the correct content for covid diagnostic types', () => {
    renderWithProviders(mockedCovidDiagnosticContextValue);

    expect(
      screen.getByRole('heading', { name: 'Diagnostic details' })
    ).toBeInTheDocument();

    const list = screen.getAllByRole('list');

    const firstListItem = within(list[0]).getAllByRole('listitem');
    expect(
      within(firstListItem[0]).getByText('Diagnostic type:')
    ).toBeInTheDocument();
    expect(
      within(firstListItem[0]).getByText('Covid-19 Antibody Test')
    ).toBeInTheDocument();

    expect(within(firstListItem[1]).getByText('Reason:')).toBeInTheDocument();
    expect(within(firstListItem[1]).getByText('--')).toBeInTheDocument();

    const secondListItem = within(list[1]).getAllByRole('listitem');
    expect(
      within(secondListItem[0]).getByText('Test result:')
    ).toBeInTheDocument();
    expect(
      within(secondListItem[0]).getByText('Not Detected')
    ).toBeInTheDocument();

    expect(
      within(secondListItem[1]).getByText('Covid test date:')
    ).toBeInTheDocument();
    expect(
      within(secondListItem[1]).getByText('Jul 4, 2022')
    ).toBeInTheDocument();

    const thirdListItem = within(list[2]).getAllByRole('listitem');
    expect(
      within(thirdListItem[0]).getByText('Test type:')
    ).toBeInTheDocument();
    expect(within(thirdListItem[0]).getByText('--')).toBeInTheDocument();
    expect(
      within(thirdListItem[1]).getByText('Reference:')
    ).toBeInTheDocument();
    expect(within(thirdListItem[1]).getByText('--')).toBeInTheDocument();
  });

  it('renders the correct content for medication diagnostic type', () => {
    renderWithProviders(mockedMedicationDiagnosticContextValue);

    expect(
      screen.getByRole('heading', { name: 'Diagnostic details' })
    ).toBeInTheDocument();

    const list = screen.getAllByRole('list');
    const firstListItem = within(list[0]).getAllByRole('listitem');

    expect(
      within(firstListItem[0]).getByText('Diagnostic type:')
    ).toBeInTheDocument();
    expect(
      within(firstListItem[0]).getByText('Medication')
    ).toBeInTheDocument();

    expect(within(firstListItem[1]).getByText('Reason:')).toBeInTheDocument();
    expect(within(firstListItem[1]).getByText('--')).toBeInTheDocument();

    const secondListItem = within(list[1]).getAllByRole('listitem');

    expect(
      within(secondListItem[0]).getByText('Frequency:')
    ).toBeInTheDocument();
    expect(
      within(secondListItem[0]).getByText('Twice a day')
    ).toBeInTheDocument();

    expect(within(secondListItem[1]).getByText('Dosage:')).toBeInTheDocument();
    expect(within(secondListItem[1]).getByText('2')).toBeInTheDocument();

    const thirdListItem = within(list[2]).getAllByRole('listitem');

    expect(within(thirdListItem[0]).getByText('Type:')).toBeInTheDocument();
    expect(within(thirdListItem[0]).getByText('Panadol')).toBeInTheDocument();

    expect(
      within(thirdListItem[1]).getByText('Completed:')
    ).toBeInTheDocument();
    expect(within(thirdListItem[1]).getByText('false')).toBeInTheDocument();

    const fourthListItem = within(list[3]).getAllByRole('listitem');
    expect(
      within(fourthListItem[0]).getByText('Medication start date:')
    ).toBeInTheDocument();
    expect(
      within(fourthListItem[0]).getByText('Jul 24, 2022')
    ).toBeInTheDocument();

    expect(
      within(fourthListItem[1]).getByText('Medication end date:')
    ).toBeInTheDocument();
    expect(
      within(fourthListItem[1]).getByText('Jun 15, 2025')
    ).toBeInTheDocument();

    const fifthListItem = within(list[4]).getAllByRole('listitem');

    expect(within(fifthListItem[0]).getByText('Note:')).toBeInTheDocument();
    expect(
      within(fifthListItem[0]).getByText(
        'They should take the medication twice a day'
      )
    ).toBeInTheDocument();
  });

  it('does not render the actions when diagnostic is medication', () => {
    renderWithProviders(mockedMedicationDiagnosticContextValue);

    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  describe('when the medical-diagnostics-iteration-3-billing-cpt flag is on', () => {
    beforeEach(() => {
      window.featureFlags['medical-diagnostics-iteration-3-billing-cpt'] = true;
    });

    afterEach(() => {
      window.featureFlags[
        'medical-diagnostics-iteration-3-billing-cpt'
      ] = false;
    });

    it('renders the correct content', () => {
      renderWithProviders(mockedDiagnosticContextValue);

      expect(
        screen.getByRole('heading', { name: 'Diagnostic details' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Billing info' })
      ).toBeInTheDocument();

      const list = screen.getAllByRole('list');

      const diagnosticDetailsList = within(list[0]).getAllByRole('listitem');
      expect(
        within(diagnosticDetailsList[0]).getByText('Diagnostic type:')
      ).toBeInTheDocument();
      expect(
        within(diagnosticDetailsList[0]).getByText('3D Analysis')
      ).toBeInTheDocument();

      expect(
        within(diagnosticDetailsList[1]).getByText('Reason:')
      ).toBeInTheDocument();
      expect(
        within(diagnosticDetailsList[1]).getByText('--')
      ).toBeInTheDocument();

      const billingInfoList = within(list[1]).getAllByRole('listitem');
      expect(
        within(billingInfoList[0]).getByText('CPT code:')
      ).toBeInTheDocument();
      expect(within(billingInfoList[0]).getByText('ABC12')).toBeInTheDocument();

      expect(
        within(billingInfoList[1]).getByText('Billable:')
      ).toBeInTheDocument();
      expect(within(billingInfoList[1]).getByText('Yes')).toBeInTheDocument();

      const billingAmountsList = within(list[2]).getAllByRole('listitem');
      expect(
        within(billingAmountsList[0]).getByText('Amount paid by insurance:')
      ).toBeInTheDocument();
      expect(
        within(billingAmountsList[0]).getByText('100')
      ).toBeInTheDocument();

      expect(
        within(billingAmountsList[1]).getByText('Amount paid by athlete:')
      ).toBeInTheDocument();
      expect(within(billingAmountsList[1]).getByText('20')).toBeInTheDocument();
    });

    it('does not render the actions', () => {
      renderWithProviders(mockedDiagnosticContextValue);

      expect(
        screen.queryByRole('button', { name: 'Edit' })
      ).not.toBeInTheDocument();
    });

    describe('[feature-flag] diagnostics-billing-extra-fields flag is on', () => {
      beforeEach(() => {
        window.featureFlags['diagnostics-billing-extra-fields'] = true;
      });

      afterEach(() => {
        window.featureFlags['diagnostics-billing-extra-fields'] = false;
      });

      it('renders the correct content', () => {
        renderWithProviders(mockedDiagnosticContextValue);

        expect(
          screen.getByRole('heading', { name: 'Diagnostic details' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { name: 'Billing info' })
        ).toBeInTheDocument();

        const list = screen.getAllByRole('list');
        const diagnosticDetailsList = within(list[0]).getAllByRole('listitem');

        expect(
          within(diagnosticDetailsList[0]).getByText('Diagnostic type:')
        ).toBeInTheDocument();
        expect(
          within(diagnosticDetailsList[0]).getByText('3D Analysis')
        ).toBeInTheDocument();

        expect(
          within(diagnosticDetailsList[1]).getByText('Reason:')
        ).toBeInTheDocument();
        expect(
          within(diagnosticDetailsList[1]).getByText('--')
        ).toBeInTheDocument();

        const billingInfoList = within(list[1]).getAllByRole('listitem');

        expect(
          within(billingInfoList[0]).getByText('CPT code:')
        ).toBeInTheDocument();
        expect(
          within(billingInfoList[0]).getByText('ABC12')
        ).toBeInTheDocument();

        expect(
          within(billingInfoList[1]).getByText('Billable:')
        ).toBeInTheDocument();
        expect(within(billingInfoList[1]).getByText('Yes')).toBeInTheDocument();

        const billingAmountList = within(list[2]).getAllByRole('listitem');

        expect(
          within(billingAmountList[0]).getByText('Amount charged:')
        ).toBeInTheDocument();
        expect(
          within(billingAmountList[0]).getByText('--')
        ).toBeInTheDocument();

        expect(
          within(billingAmountList[1]).getByText('Discount/ reduction:')
        ).toBeInTheDocument();
        expect(
          within(billingAmountList[1]).getByText('--')
        ).toBeInTheDocument();

        expect(
          within(billingAmountList[2]).getByText('Amount insurance paid:')
        ).toBeInTheDocument();
        expect(
          within(billingAmountList[2]).getByText('100')
        ).toBeInTheDocument();

        const billingAmountList2 = within(list[3]).getAllByRole('listitem');

        expect(
          within(billingAmountList2[0]).getByText('Amount due:')
        ).toBeInTheDocument();
        expect(
          within(billingAmountList2[0]).getByText('--')
        ).toBeInTheDocument();

        expect(
          within(billingAmountList2[1]).getByText('Amount athlete paid:')
        ).toBeInTheDocument();
        expect(
          within(billingAmountList2[1]).getByText('20')
        ).toBeInTheDocument();

        expect(
          within(billingAmountList2[2]).getByText('Date paid:')
        ).toBeInTheDocument();
        expect(
          within(billingAmountList2[2]).getByText('--')
        ).toBeInTheDocument();
      });
    });
  });

  it('renders the correct content for diagnostics with annotations', () => {
    renderWithProviders(mockedDiagnosticWithAnnotationContextValue);

    expect(
      screen.getByRole('heading', { name: 'Diagnostic details' })
    ).toBeInTheDocument();

    const list = screen.getAllByRole('list');
    const firstListItem = within(list[0]).getAllByRole('listitem');

    expect(
      within(firstListItem[0]).getByText('Diagnostic type:')
    ).toBeInTheDocument();
    expect(
      within(firstListItem[0]).getByText('Cardiac Data')
    ).toBeInTheDocument();

    expect(within(firstListItem[1]).getByText('Reason:')).toBeInTheDocument();
    expect(within(firstListItem[1]).getByText('--')).toBeInTheDocument();
  });
});

describe('[permissions] permissions.medical.diagnostics.canCreate', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const fakeDate = new Date('2025-06-15T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the correct content for medication diagnostic type', () => {
    renderWithProviders(mockedMedicationDiagnosticContextValue, {
      medical: { diagnostics: { canCreate: true } },
    });

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Diagnostic details' })
    ).toBeInTheDocument();

    const list = screen.getAllByRole('list');
    const diagnosticsItem = within(list[0]).getAllByRole('listitem');

    expect(
      within(diagnosticsItem[0]).getByText('Diagnostic type:')
    ).toBeInTheDocument();
    expect(
      within(diagnosticsItem[0]).getByText('Medication')
    ).toBeInTheDocument();

    expect(within(diagnosticsItem[1]).getByText('Reason:')).toBeInTheDocument();
    expect(within(diagnosticsItem[1]).getByText('--')).toBeInTheDocument();

    const scheduleItem = within(list[1]).getAllByRole('listitem');
    expect(within(scheduleItem[0]).getByText('Frequency:')).toBeInTheDocument();
    expect(
      within(scheduleItem[0]).getByText('Twice a day')
    ).toBeInTheDocument();

    expect(within(scheduleItem[1]).getByText('Dosage:')).toBeInTheDocument();
    expect(within(scheduleItem[1]).getByText('2')).toBeInTheDocument();

    const medicationItem = within(list[2]).getAllByRole('listitem');
    expect(within(medicationItem[0]).getByText('Type:')).toBeInTheDocument();
    expect(within(medicationItem[0]).getByText('Panadol')).toBeInTheDocument();

    expect(
      within(medicationItem[1]).getByText('Completed:')
    ).toBeInTheDocument();
    expect(within(medicationItem[1]).getByText('false')).toBeInTheDocument();

    const datesItem = within(list[3]).getAllByRole('listitem');
    expect(
      within(datesItem[0]).getByText('Medication start date:')
    ).toBeInTheDocument();
    expect(within(datesItem[0]).getByText('Jul 24, 2022')).toBeInTheDocument();

    expect(
      within(datesItem[1]).getByText('Medication end date:')
    ).toBeInTheDocument();
    expect(within(datesItem[1]).getByText('Jun 15, 2025')).toBeInTheDocument();

    const notesItem = within(list[4]).getAllByRole('listitem');
    expect(within(notesItem[0]).getByText('Note:')).toBeInTheDocument();
    expect(
      within(notesItem[0]).getByText(
        'They should take the medication twice a day'
      )
    ).toBeInTheDocument();
  });

  it('renders correct actions when diagnostic is medication', async () => {
    renderWithProviders(mockedMedicationDiagnosticContextValue, {
      medical: { diagnostics: { canCreate: true } },
    });

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const discardButton = screen.getByRole('button', {
      name: 'Discard changes',
    });
    expect(discardButton).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
  });

  describe('when the medical-diagnostics-iteration-3-billing-cpt flag is on', () => {
    beforeEach(() => {
      window.featureFlags['medical-diagnostics-iteration-3-billing-cpt'] = true;
    });

    afterEach(() => {
      window.featureFlags[
        'medical-diagnostics-iteration-3-billing-cpt'
      ] = false;
    });

    it('renders correct actions', async () => {
      renderWithProviders(mockedDiagnosticContextValue, {
        medical: { diagnostics: { canCreate: true } },
      });

      const editButton = screen.getByRole('button', { name: 'Edit' });
      await user.click(editButton);

      const discardButton = screen.getByRole('button', {
        name: 'Discard changes',
      });
      expect(discardButton).toBeInTheDocument();

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeInTheDocument();
    });
  });

  describe('when the diagnostics-multiple-cpt and medical-diagnostics-iteration-3-billing-cpt flags are on', () => {
    beforeEach(() => {
      window.featureFlags['medical-diagnostics-iteration-3-billing-cpt'] = true;
      window.featureFlags['diagnostics-multiple-cpt'] = true;
    });

    afterEach(() => {
      window.featureFlags[
        'medical-diagnostics-iteration-3-billing-cpt'
      ] = false;
      window.featureFlags['diagnostics-multiple-cpt'] = false;
    });

    it('renders medical details and correct actions', async () => {
      renderWithProviders(mockedDiagnosticContextValue, {
        medical: { diagnostics: { canCreate: true } },
      });

      const editButton = screen.getByRole('button', { name: 'Edit' });
      await user.click(editButton);

      const list = screen.getAllByRole('list');
      const additionalInfoItem = within(list[1]).getAllByRole('listitem');
      expect(
        within(additionalInfoItem[0]).getByText('Practitioner:')
      ).toBeInTheDocument();
      expect(within(additionalInfoItem[0]).getByText('--')).toBeInTheDocument();

      expect(
        within(additionalInfoItem[1]).getByText('Location:')
      ).toBeInTheDocument();
      expect(within(additionalInfoItem[1]).getByText('--')).toBeInTheDocument();

      expect(
        within(additionalInfoItem[2]).getByText('Date of diagnostic:')
      ).toBeInTheDocument();
      expect(
        within(additionalInfoItem[2]).getByText('May 15, 2022')
      ).toBeInTheDocument();

      const removeCPTButton = within(list[2]).getByRole('button');
      expect(removeCPTButton).toBeInTheDocument();

      const addAnotherButton = screen.getByRole('button', {
        name: 'Add another',
      });
      expect(addAnotherButton).toBeInTheDocument();
    });
  });

  describe('does not render Edit button for uneditable Diagnostic status', () => {
    beforeEach(() => {
      window.featureFlags[
        'medical-diagnostics-iteration-3-billing-cpt'
      ] = false;
      window.featureFlags['diagnostics-multiple-cpt'] = false;
    });

    it('renders correct actions', () => {
      const preliminaryDiagnosticContext = {
        ...mockedDiagnosticContextValue,
        diagnostic: {
          ...mockedDiagnosticContextValue.diagnostic,
          status: { text: 'Preliminary', value: 'preliminary' },
        },
      };
      renderWithProviders(preliminaryDiagnosticContext, {
        medical: { diagnostics: { canCreate: true } },
      });

      expect(
        screen.queryByRole('button', { name: 'Edit' })
      ).not.toBeInTheDocument();
    });
  });

  describe('renders Edit button for appropriate Diagnostic status', () => {
    beforeEach(() => {
      window.featureFlags['medical-diagnostics-iteration-3-billing-cpt'] = true;
    });

    afterEach(() => {
      window.featureFlags[
        'medical-diagnostics-iteration-3-billing-cpt'
      ] = false;
    });

    it('renders correct actions', () => {
      const completeDiagnosticContext = {
        ...mockedDiagnosticContextValue,
        diagnostic: {
          ...mockedDiagnosticContextValue.diagnostic,
          status: { text: 'Complete', value: 'complete' },
        },
      };
      renderWithProviders(completeDiagnosticContext, {
        medical: { diagnostics: { canCreate: true } },
      });

      const editButton = screen.getByRole('button', { name: 'Edit' });
      expect(editButton).toBeInTheDocument();
    });
  });
});
