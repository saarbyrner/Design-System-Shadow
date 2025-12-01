import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { organisationAssociations } from '@kitman/common/src/variables';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import downloadCSV from '@kitman/common/src/utils/downloadCSV';
import { defaultMedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';

import { Provider } from 'react-redux';
import MedicationReport from '../MedicationReport';

jest.mock('@kitman/common/src/hooks/useCSVExport');
jest.mock('@kitman/common/src/utils/downloadCSV');

const closeSettingsSpy = jest.fn();
const printReportSpy = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
});

describe('MedicationsTab | <MedicationReport />', () => {
  let jsdomPrint;
  const windowDotPrint = jest.fn();

  beforeEach(() => {
    jsdomPrint = window.print;
    jest.spyOn(window, 'print').mockImplementation(windowDotPrint);
  });

  afterEach(() => {
    window.print = jsdomPrint;
  });

  const defaultProps = {
    t: i18nextTranslateStub(),
    athlete: 1234,
    squadId: 1,
    exportType: 'pdf',
    isReportActive: true,
    printReport: printReportSpy,
    isSettingsOpen: true,
    closeSettings: closeSettingsSpy,
    reportSettingsKey: 'MedicationsTab|MedicationsReport',
  };

  const renderTestComponent = (
    props = {},
    associationName = organisationAssociations.nfl
  ) =>
    render(
      <Provider store={store}>
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { id: 1, association_name: associationName },
          }}
        >
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  medications: {
                    canView: true,
                  },
                },
              },
            }}
          >
            <MedicationReport {...{ ...defaultProps, ...props }} />
          </MockedPermissionContextProvider>
        </MockedOrganisationContextProvider>
      </Provider>
    );

  describe('when export settings side panel is open', () => {
    const waitForLoading = async () =>
      waitFor(() =>
        expect(
          screen.queryByRole('button', {
            name: 'Loading medication report data',
          })
        ).not.toBeInTheDocument()
      );

    it('renders the optional column checkboxes and date filters', async () => {
      renderTestComponent();
      await expect(screen.getByText('Start Date')).toBeInTheDocument();
      await expect(screen.getByText('End Date')).toBeInTheDocument();
      await expect(screen.getByText('Medication report')).toBeInTheDocument();
      await expect(screen.getByText('NFL Player ID')).toBeInTheDocument();
      await expect(screen.getByText('Injury Date')).toBeInTheDocument();
      await expect(screen.getByText('Dosage')).toBeInTheDocument();
      await expect(screen.getByText('Quantity')).toBeInTheDocument();
      await expect(screen.getByText('Type')).toBeInTheDocument();
      await expect(screen.getByText('Dispenser')).toBeInTheDocument();
    });

    it('renders buttons', async () => {
      renderTestComponent();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(3);
      const closeIcon = buttons[0];
      expect(closeIcon).toBeInTheDocument();
      const cancelButton = buttons[1];
      expect(cancelButton).toHaveTextContent('Cancel');
      const downloadButton = buttons[2];
      expect(downloadButton).toHaveTextContent('Download');
    });

    describe('prints report when download is pressed', () => {
      it('selects optional columns', async () => {
        renderTestComponent();
        const nflPlayerIdCheckbox = screen.getByRole('checkbox', {
          name: 'NFL Player ID',
        });
        const injuryDateCheckbox = screen.getByRole('checkbox', {
          name: 'Injury Date',
        });
        const dosageCheckbox = screen.getByRole('checkbox', {
          name: 'Dosage',
        });
        const quantityCheckbox = screen.getByRole('checkbox', {
          name: 'Quantity',
        });
        const typeCheckbox = screen.getByRole('checkbox', {
          name: 'Type',
        });
        const dispenserCheckbox = screen.getByRole('checkbox', {
          name: 'Dispenser',
        });
        await userEvent.click(nflPlayerIdCheckbox);
        expect(nflPlayerIdCheckbox).toBeChecked();
        await userEvent.click(injuryDateCheckbox);
        expect(injuryDateCheckbox).toBeChecked();
        await userEvent.click(dosageCheckbox);
        expect(dosageCheckbox).toBeChecked();
        await userEvent.click(quantityCheckbox);
        expect(quantityCheckbox).toBeChecked();
        await userEvent.click(typeCheckbox);
        expect(typeCheckbox).toBeChecked();
        await userEvent.click(dispenserCheckbox);
        expect(dispenserCheckbox).toBeChecked();
      });

      it('prints pdf report when download is pressed', async () => {
        renderTestComponent();
        const buttons = screen.getAllByRole('button');

        const downloadButton = buttons[2];
        expect(downloadButton).toHaveTextContent('Download');

        await userEvent.click(downloadButton);
        await waitForLoading();

        await expect(
          screen.queryByTestId('Printing|MedicationReports')
        ).toBeInTheDocument();

        expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
        expect(printReportSpy).toHaveBeenCalledTimes(1);
      });

      it('calls the csv export hook when CSV option is clicked', async () => {
        const onError = jest.fn();
        const onSuccess = jest.fn();

        useCSVExport.mockImplementation((filename, data, options) => {
          return () => downloadCSV(filename, data, options, onError, onSuccess);
        });

        renderTestComponent({ exportType: 'csv' });
        const buttons = screen.getAllByRole('button');
        await waitForLoading();

        const downloadButton = buttons[2];
        expect(downloadButton).toHaveTextContent('Download');

        await userEvent.click(downloadButton);

        expect(onSuccess).toHaveBeenCalled();
      });

      it('outputs the expected csv', async () => {
        const onError = jest.fn();
        const onSuccess = jest.fn();

        useCSVExport.mockImplementation((filename, data, options) => {
          return () => downloadCSV(filename, data, options, onError, onSuccess);
        });

        renderTestComponent({ exportType: 'csv' });
        const buttons = screen.getAllByRole('button');
        await waitForLoading();

        const injuryDateCheckbox = screen.getByRole('checkbox', {
          name: 'Injury Date',
        });
        const dosageCheckbox = screen.getByRole('checkbox', {
          name: 'Dosage',
        });
        const quantityCheckbox = screen.getByRole('checkbox', {
          name: 'Quantity',
        });
        const typeCheckbox = screen.getByRole('checkbox', {
          name: 'Type',
        });
        const dispenserCheckbox = screen.getByRole('checkbox', {
          name: 'Dispenser',
        });

        await userEvent.click(injuryDateCheckbox);
        expect(injuryDateCheckbox).not.toBeChecked();
        await userEvent.click(dosageCheckbox);
        expect(dosageCheckbox).not.toBeChecked();
        await userEvent.click(quantityCheckbox);
        expect(quantityCheckbox).not.toBeChecked();
        await userEvent.click(typeCheckbox);
        expect(typeCheckbox).not.toBeChecked();
        await userEvent.click(dispenserCheckbox);
        expect(dispenserCheckbox).not.toBeChecked();

        const downloadButton = buttons[2];
        expect(downloadButton).toHaveTextContent('Download');

        await userEvent.click(downloadButton);

        expect(onSuccess).toHaveBeenCalled();
        const prefix = 'data:text/csv;charset=utf-8,';
        const expectedEncodedCSV =
          '%22Player%20Name%22%2C%22Reason%22%2C%22Medication%22%2C%22Date%22%2C%22NFL%20Player%20ID%22%0A%22Adam%20Tester%22%2C%22Finger%20Fracture%2FMiddle%20Phalanx%2FDorsal%2FDislocation%2FClosed%20-%205th%20digit%20(small)%20%5BLeft%5D%22%2C%22diclofenac%20potassium%2050%20mg%20tablet%22%2C%2206%2F09%2F2023%22%2C%22NFL1234%22%0A%22Adam%20Tester%22%2C%22Shoulder%20Contusion%20%5BLeft%5D%22%2C%22no%20drug%20tablet%22%2C%2206%2F09%2F2023%22%2C%22NFL1234%22';
        expect(onSuccess).toHaveBeenCalledWith(prefix + expectedEncodedCSV);

        const expectedCSV =
          '"Player Name","Reason","Medication","Date","NFL Player ID"\n' +
          '"Adam Tester","Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Closed - 5th digit (small) [Left]","diclofenac potassium 50 mg tablet","06/09/2023","NFL1234"\n' +
          '"Adam Tester","Shoulder Contusion [Left]","no drug tablet","06/09/2023","NFL1234"';
        expect(decodeURIComponent(expectedEncodedCSV)).toEqual(expectedCSV);

        const nflPlayerIdCheckbox = screen.getByRole('checkbox', {
          name: 'NFL Player ID',
        });
        expect(nflPlayerIdCheckbox).toBeChecked();
        await userEvent.click(nflPlayerIdCheckbox);
        expect(nflPlayerIdCheckbox).not.toBeChecked();
      });
    });
    describe('When is NOT an NFL organisation', () => {
      it('renders the correct checkboxes', () => {
        renderTestComponent({}, 'Not the NFL association');

        expect(
          screen.queryByRole('checkbox', {
            name: 'NFL Player ID',
          })
        ).not.toBeInTheDocument();
      });

      it('outputs the expected csv', async () => {
        const onError = jest.fn();
        const onSuccess = jest.fn();

        useCSVExport.mockImplementation((filename, data, options) => {
          return () => downloadCSV(filename, data, options, onError, onSuccess);
        });

        renderTestComponent({ exportType: 'csv' }, 'Not the NFL association');
        const buttons = screen.getAllByRole('button');
        await waitForLoading();

        const dispenserCheckbox = screen.getByRole('checkbox', {
          name: 'Dispenser',
        });
        await userEvent.click(dispenserCheckbox);
        expect(dispenserCheckbox).toBeChecked();

        const downloadButton = buttons[2];
        expect(downloadButton).toHaveTextContent('Download');

        await userEvent.click(downloadButton);

        expect(onSuccess).toHaveBeenCalled();
        const prefix = 'data:text/csv;charset=utf-8,';
        const expectedEncodedCSV =
          '%22Player%20Name%22%2C%22Reason%22%2C%22Medication%22%2C%22Date%22%2C%22Dispenser%22%0A%22Adam%20Tester%22%2C%22Finger%20Fracture%2FMiddle%20Phalanx%2FDorsal%2FDislocation%2FClosed%20-%205th%20digit%20(small)%20%5BLeft%5D%22%2C%22diclofenac%20potassium%2050%20mg%20tablet%22%2C%2206%2F09%2F2023%22%2C%22Jane%20Doe%22%0A%22Adam%20Tester%22%2C%22Shoulder%20Contusion%20%5BLeft%5D%22%2C%22no%20drug%20tablet%22%2C%2206%2F09%2F2023%22%2C%22Injury%20Tester%22';
        expect(onSuccess).toHaveBeenCalledWith(prefix + expectedEncodedCSV);

        const expectedCSV =
          '"Player Name","Reason","Medication","Date","Dispenser"\n' +
          '"Adam Tester","Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Closed - 5th digit (small) [Left]","diclofenac potassium 50 mg tablet","06/09/2023","Jane Doe"\n' +
          '"Adam Tester","Shoulder Contusion [Left]","no drug tablet","06/09/2023","Injury Tester"';
        expect(decodeURIComponent(expectedEncodedCSV)).toEqual(expectedCSV);
      });
    });
  });
});
