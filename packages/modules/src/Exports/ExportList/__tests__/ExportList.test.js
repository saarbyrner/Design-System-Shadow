import { render, screen } from '@testing-library/react';
import moment from 'moment-timezone';
import '@testing-library/jest-dom';
import { data as mockedData } from '@kitman/services/src/mocks/handlers/exports/getExportBilling';
import {
  renderWithProvider,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import { defaultUserPermissions } from '@kitman/common/src/contexts/PermissionsContext/user';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import userEvent from '@testing-library/user-event';
import ExportList from '..';

jest.mock('@kitman/common/src/utils', () => {
  const originalModule = jest.requireActual('@kitman/common/src/utils');
  return {
    ...originalModule,
    getIsLocalStorageAvailable: jest.fn(),
  };
});

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({});

describe('<ExportList />', () => {
  const props = {
    fetchedData: mockedData.data,
    isLoading: false,
    onTriggerExport: jest.fn(),
    onRefreshList: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
    });
  });

  beforeEach(() => {
    window.organisationSport = 'nfl';
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  const getColumnNameByIndex = (index) => {
    switch (index) {
      case 0:
        return 'Name';
      case 1:
        return 'Export Type';
      case 2:
        return 'Created Date & Time';
      case 3:
        return 'Download link';
      case 4:
        return 'Status';
      default:
        return '';
    }
  };

  it('displays the table with the correct content', () => {
    render(<ExportList {...props} />);

    const table = screen.getByRole('table');
    const tableRows = table.querySelectorAll('tr');
    const [
      firstRow,
      secondRow,
      thirdRow,
      fourthRow,
      fifthRow,
      sixthRow,
      seventhRow,
      eighthRow,
      ninthRow,
      tenthRow,
      eleventhRow,
      twelfthRow,
      thirteenthRow,
      fourteenthRow,
      fifteenthRow,
      sixteenthRow,
      seventeenthRow,
      eighteenthRow,
      nineteenthRow,
      twentiethRow,
      twentyFirstRow,
      twentySecondRow,
      twentyThirdRow,
      twentyFourthRow,
      twentyFifthRow,
    ] = tableRows;

    // First row - table headers
    const tableHeaders = firstRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Name');
    expect(tableHeaders[1]).toHaveTextContent('Export Type');
    expect(tableHeaders[2]).toHaveTextContent('Created Date & Time');
    expect(tableHeaders[3]).toHaveTextContent('Download link');
    expect(tableHeaders[4]).toHaveTextContent('Status');

    // Second row
    const secondRowCells = secondRow.querySelectorAll('td');
    expect(secondRowCells[0]).toHaveTextContent('Mocked diagnostic billing');
    expect(secondRowCells[1]).toHaveTextContent('Diagnostic Billing');
    expect(secondRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(secondRowCells[3]).toHaveTextContent('--');
    expect(secondRowCells[4]).toHaveTextContent('In progress');

    // Third row
    const thirdRowCells = thirdRow.querySelectorAll('td');
    expect(thirdRowCells[0]).toHaveTextContent('Mocked treatment billing');
    expect(thirdRowCells[1]).toHaveTextContent('Treatment Billing');
    expect(thirdRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(thirdRowCells[3]).toHaveTextContent('--');
    expect(thirdRowCells[4]).toHaveTextContent('Error');

    // Fourth row
    const fourthRowCells = fourthRow.querySelectorAll('td');
    expect(fourthRowCells[0]).toHaveTextContent('Mocked quality reports');
    expect(fourthRowCells[1]).toHaveTextContent('Quality Reports');
    expect(fourthRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(fourthRowCells[3]).toHaveTextContent('--');
    expect(fourthRowCells[4]).toHaveTextContent('In progress');

    // Fifth row
    const fifthRowCells = fifthRow.querySelectorAll('td');
    expect(fifthRowCells[0]).toHaveTextContent('Mocked second quality reports');
    expect(fifthRowCells[1]).toHaveTextContent('Quality Reports');
    expect(fifthRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(fifthRowCells[3]).toHaveTextContent('Link');
    expect(fifthRowCells[4]).toHaveTextContent('Completed');

    // Sixth row
    const sixthRowCells = sixthRow.querySelectorAll('td');
    expect(sixthRowCells[0]).toHaveTextContent('Mocked diagnostics records');
    expect(sixthRowCells[1]).toHaveTextContent('Quality Reports');
    expect(sixthRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(sixthRowCells[3]).toHaveTextContent('Link');
    expect(sixthRowCells[4]).toHaveTextContent('Completed');

    // Seventh row
    const seventhRowCells = seventhRow.querySelectorAll('td');
    expect(seventhRowCells[0]).toHaveTextContent('Mocked medication records');
    expect(seventhRowCells[1]).toHaveTextContent('Quality Reports');
    expect(seventhRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(seventhRowCells[3]).toHaveTextContent('Link');
    expect(seventhRowCells[4]).toHaveTextContent('Completed');

    // Eighth row
    const eighthRowCells = eighthRow.querySelectorAll('td');
    expect(eighthRowCells[0]).toHaveTextContent('Mocked null data report');
    expect(eighthRowCells[1]).toHaveTextContent('Quality Reports');
    expect(eighthRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(eighthRowCells[3]).toHaveTextContent('Link');
    expect(eighthRowCells[4]).toHaveTextContent('Completed');

    // Ninth row
    const ninthRowCells = ninthRow.querySelectorAll('td');
    expect(ninthRowCells[0]).toHaveTextContent(
      'Mocked HAP Authorization Status'
    );
    expect(ninthRowCells[1]).toHaveTextContent('Quality Reports');
    expect(ninthRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(ninthRowCells[3]).toHaveTextContent('Link');
    expect(ninthRowCells[4]).toHaveTextContent('Completed');

    // Tenth row
    const tenthRowCells = tenthRow.querySelectorAll('td');
    expect(tenthRowCells[0]).toHaveTextContent(
      'Mocked Concussion Baseline Audit'
    );
    expect(tenthRowCells[1]).toHaveTextContent('Quality Reports');
    expect(tenthRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(tenthRowCells[3]).toHaveTextContent('Link');
    expect(tenthRowCells[4]).toHaveTextContent('Completed');

    // Eleventh row
    const eleventhRowCells = eleventhRow.querySelectorAll('td');
    expect(eleventhRowCells[0]).toHaveTextContent(
      'Mocked HAP Participant Exposure Report'
    );
    expect(eleventhRowCells[1]).toHaveTextContent('Quality Reports');
    expect(eleventhRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(eleventhRowCells[3]).toHaveTextContent('Link');
    expect(eleventhRowCells[4]).toHaveTextContent('Completed');

    // Twelfth row
    const twelfthRowCells = twelfthRow.querySelectorAll('td');
    expect(twelfthRowCells[0]).toHaveTextContent(
      'Mocked HAP Covid Branch Report'
    );
    expect(twelfthRowCells[1]).toHaveTextContent('Quality Reports');
    expect(twelfthRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(twelfthRowCells[3]).toHaveTextContent('Link');
    expect(twelfthRowCells[4]).toHaveTextContent('Completed');

    // Thirteenth row
    const thirteenthRowCells = thirteenthRow.querySelectorAll('td');
    expect(thirteenthRowCells[0]).toHaveTextContent('Mocked Multi Doc Report');
    expect(thirteenthRowCells[1]).toHaveTextContent('Multi Document Export');
    expect(thirteenthRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(thirteenthRowCells[3]).toHaveTextContent('Link');
    expect(thirteenthRowCells[4]).toHaveTextContent('Completed');

    // Fourteenth row
    const fourteenthRowCells = fourteenthRow.querySelectorAll('td');
    expect(fourteenthRowCells[0]).toHaveTextContent('Mocked Governance Export');
    expect(fourteenthRowCells[1]).toHaveTextContent('Governance Export');
    expect(fourteenthRowCells[2]).toHaveTextContent('Sep 2, 2022 8:14 AM');
    expect(fourteenthRowCells[3]).toHaveTextContent('Link');
    expect(fourteenthRowCells[4]).toHaveTextContent('Completed');

    // fifteenth row
    const fifteenthRowCells = fifteenthRow.querySelectorAll('td');
    expect(fifteenthRowCells[0]).toHaveTextContent(
      'Mocked Athlete Cards Export'
    );
    expect(fifteenthRowCells[1]).toHaveTextContent('Card Export');
    expect(fifteenthRowCells[3]).toHaveTextContent('Link');
    expect(fifteenthRowCells[4]).toHaveTextContent('Completed');

    // sixteenth row
    const sixteenthRowCells = sixteenthRow.querySelectorAll('td');
    expect(sixteenthRowCells[0]).toHaveTextContent('Mocked Staff Cards Export');
    expect(sixteenthRowCells[1]).toHaveTextContent('Card Export');
    expect(sixteenthRowCells[3]).toHaveTextContent('Link');
    expect(sixteenthRowCells[4]).toHaveTextContent('Completed');

    // seventeenth row
    const seventeenthRowCells = seventeenthRow.querySelectorAll('td');
    expect(seventeenthRowCells[0]).toHaveTextContent(
      'Mocked Injury Detail Export'
    );
    expect(seventeenthRowCells[1]).toHaveTextContent('Injury Detail Export');
    expect(seventeenthRowCells[3]).toHaveTextContent('Link');
    expect(seventeenthRowCells[4]).toHaveTextContent('Completed');

    // eighteenth row
    const eighteenthRowCells = eighteenthRow.querySelectorAll('td');
    expect(eighteenthRowCells[0]).toHaveTextContent(
      'Mocked Injury Medication Export'
    );
    expect(eighteenthRowCells[1]).toHaveTextContent('Injury Medication Export');
    expect(eighteenthRowCells[3]).toHaveTextContent('Link');
    expect(eighteenthRowCells[4]).toHaveTextContent('Completed');

    // nineteenth row
    const nineteenthRowCells = nineteenthRow.querySelectorAll('td');
    expect(nineteenthRowCells[0]).toHaveTextContent('Mocked Time loss Export');
    expect(nineteenthRowCells[1]).toHaveTextContent(
      'Time Loss (All activities) Export'
    );
    expect(nineteenthRowCells[3]).toHaveTextContent('Link');
    expect(nineteenthRowCells[4]).toHaveTextContent('Completed');

    // twentieth row
    const twentiethRowCells = twentiethRow.querySelectorAll('td');
    expect(twentiethRowCells[0]).toHaveTextContent(
      'Mocked Injury Report Export'
    );
    expect(twentiethRowCells[1]).toHaveTextContent('Injury Report Export');
    expect(twentiethRowCells[3]).toHaveTextContent('Link');
    expect(twentiethRowCells[4]).toHaveTextContent('Completed');

    // twenty-first row
    const twentyFirstRowCells = twentyFirstRow.querySelectorAll('td');
    expect(twentyFirstRowCells[0]).toHaveTextContent(
      'Mocked Bulk Injury Report Export'
    );
    expect(twentyFirstRowCells[1]).toHaveTextContent('Injury Report Export');
    expect(twentyFirstRowCells[3]).toHaveTextContent('Link');
    expect(twentyFirstRowCells[4]).toHaveTextContent('Completed');

    // twenty-second row
    const twentySecondRowCells = twentySecondRow.querySelectorAll('td');
    expect(twentySecondRowCells[0]).toHaveTextContent(
      'Mocked OSHA Report Export'
    );
    expect(twentySecondRowCells[1]).toHaveTextContent('OSHA Report Export');
    expect(twentySecondRowCells[3]).toHaveTextContent('Link');
    expect(twentySecondRowCells[4]).toHaveTextContent('Completed');

    // twenty-third row
    const twentyThirdRowCells = twentyThirdRow.querySelectorAll('td');
    expect(twentyThirdRowCells[0]).toHaveTextContent(
      'Mocked Issue Summary Export'
    );
    expect(twentyThirdRowCells[1]).toHaveTextContent('Injury Analysis Export');
    expect(twentyThirdRowCells[3]).toHaveTextContent('Link');
    expect(twentyThirdRowCells[4]).toHaveTextContent('Completed');

    // twenty-fourth row
    const twentyFourthRowCells = twentyFourthRow.querySelectorAll('td');
    expect(twentyFourthRowCells[0]).toHaveTextContent(
      'Mocked Injuries Summary Export'
    );
    expect(twentyFourthRowCells[1]).toHaveTextContent('Injury Analysis Export');
    expect(twentyFourthRowCells[3]).toHaveTextContent('Link');
    expect(twentyFourthRowCells[4]).toHaveTextContent('Completed');

    // twenty-fifth row
    const twentyFifthRowCells = twentyFifthRow.querySelectorAll('td');
    expect(twentyFifthRowCells[0]).toHaveTextContent(
      'Mocked NFL Player Detail Report'
    );
    expect(twentyFifthRowCells[1]).toHaveTextContent('Player Detail Export');
    expect(twentyFifthRowCells[3]).toHaveTextContent('Link');
    expect(twentyFifthRowCells[4]).toHaveTextContent('Completed');

    // check data-mobile-label is set
    tableRows.forEach((row) => {
      const columns = row.querySelectorAll('td');
      columns.forEach((column, index) => {
        const columnName = getColumnNameByIndex(index);
        if (columnName === '') {
          return;
        }
        expect(column).toHaveAttribute('data-mobile-label', columnName);
      });
    });
  });

  describe('[permissions] permissions.user.canExportOwnMedicalData', () => {
    const mockedPermissionsContextValue = {
      permissions: {
        user: {
          ...defaultUserPermissions,
          canExportOwnMedicalData: true,
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    };

    beforeEach(() => {
      window.featureFlags['athlete-run-medical-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['athlete-run-medical-export'] = false;
    });

    it('renders the Export button and calls correct callback', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} />
        </MockedPermissionContextProvider>,
        {
          default: () => {},
          subscribe: () => {},
          dispatch: () => {},
          getState: () => {},
        }
      );

      expect(
        screen.getByRole('button', { name: /export/i })
      ).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: /export/i }));

      expect(props.onTriggerExport).toHaveBeenCalled();
    });

    it('enables the export button when all export jobs are completed', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} fetchedData={props.fetchedData.slice(3, 5)} />
        </MockedPermissionContextProvider>,
        {
          default: () => {},
          subscribe: () => {},
          dispatch: () => {},
          getState: () => {},
        }
      );

      expect(screen.getByRole('button', { name: /export/i })).toBeEnabled();
    });

    it('enables the export button when some export jobs are not completed', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} fetchedData={props.fetchedData.slice(0, 3)} />
        </MockedPermissionContextProvider>,
        {
          default: () => {},
          subscribe: () => {},
          dispatch: () => {},
          getState: () => {},
        }
      );

      expect(screen.getByRole('button', { name: /export/i })).toBeEnabled();
    });

    it('renders the Refresh List button and calls correct', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} />
        </MockedPermissionContextProvider>,
        {
          default: () => {},
          subscribe: () => {},
          dispatch: () => {},
          getState: () => {},
        }
      );

      expect(
        screen.getByRole('button', { name: /refresh list/i })
      ).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole('button', { name: /refresh list/i })
      );

      expect(props.onRefreshList).toHaveBeenCalled();
    });
  });

  describe('[feature-flag] nfl-disclaimer-popup-player-medical-record', () => {
    const mockedPermissionsContextValue = {
      permissions: {
        user: {
          ...defaultUserPermissions,
          canExportOwnMedicalData: true,
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    };

    beforeEach(() => {
      window.featureFlags['athlete-run-medical-export'] = true;
      window.featureFlags['nfl-disclaimer-popup-player-medical-record'] = true;
    });

    afterEach(() => {
      window.featureFlags['athlete-run-medical-export'] = false;
      window.featureFlags['nfl-disclaimer-popup-player-medical-record'] = false;
    });

    it('renders a disclaimer popup modal when nfl-disclaimer-popup-player-medical-record is true', async () => {
      window.featureFlags['nfl-disclaimer-popup-player-medical-record'] = true;
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} />
        </MockedPermissionContextProvider>,
        defaultStore
      );

      expect(screen.getByText('Disclaimer')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /I agree/i, hidden: true })
      ).toBeInTheDocument();
    });

    it('does not renders a disclaimer popup modal when nfl-disclaimer-popup-player-medical-record is false', async () => {
      window.featureFlags['nfl-disclaimer-popup-player-medical-record'] = false;
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} />
        </MockedPermissionContextProvider>,
        defaultStore
      );

      expect(screen.queryByText('Disclaimer')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /I agree/i, hidden: true })
      ).not.toBeInTheDocument();
    });

    it('renders the Export button, displays the disclaimer and calls correct callback', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} />
        </MockedPermissionContextProvider>,
        defaultStore
      );

      expect(
        screen.getByRole('button', {
          name: /Generate Medical Record/i,
          hidden: true,
        })
      ).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole('button', {
          name: /Generate Medical Record/i,
          hidden: true,
        })
      );

      expect(screen.getAllByText('Disclaimer')).toHaveLength(2);

      expect(
        screen.getByRole('button', { name: /I acknowledge/i, hidden: true })
      ).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole('button', { name: /I acknowledge/i, hidden: true })
      );

      expect(props.onTriggerExport).toHaveBeenCalled();

      expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    });

    it('shows the second disclaimer when clicking on Generate Medical Record again', async () => {
      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} />
        </MockedPermissionContextProvider>,
        defaultStore
      );

      const generateMedicalRecordButton = screen.getByRole('button', {
        name: /Generate Medical Record/i,
        hidden: true,
      });

      expect(generateMedicalRecordButton).toBeInTheDocument();

      await userEvent.click(generateMedicalRecordButton);

      expect(screen.getAllByText('Disclaimer')).toHaveLength(2);

      await userEvent.click(
        screen.getByRole('button', {
          name: /I acknowledge/i,
          hidden: true,
        })
      );

      expect(screen.getByText('Disclaimer')).toBeInTheDocument();

      await userEvent.click(generateMedicalRecordButton);

      expect(screen.getAllByText('Disclaimer')).toHaveLength(2);

      await userEvent.click(
        screen.getByRole('button', {
          name: /I acknowledge/i,
          hidden: true,
        })
      );

      expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    });

    it('does not show the disclaimer if present in localStorage', async () => {
      getIsLocalStorageAvailable.mockReturnValue(true);
      jest
        .spyOn(window.localStorage, 'getItem')
        .mockReturnValue(
          JSON.stringify({ 'ExportsPage|NFLDisclaimer|OnLoad': true })
        );

      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} />
        </MockedPermissionContextProvider>,
        defaultStore
      );

      expect(screen.queryByText('Disclaimer')).not.toBeInTheDocument();
    });

    it('shows the disclaimer if localStorage is not available', async () => {
      getIsLocalStorageAvailable.mockReturnValue(false);

      renderWithProvider(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ExportList {...props} />
        </MockedPermissionContextProvider>,
        defaultStore
      );

      expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    });
  });
});

describe('<ExportList/> - login organisation', () => {
  const props = {
    fetchedData: mockedData.data,
    isLoading: false,
    onTriggerExport: jest.fn(),
    onRefreshList: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    window.featureFlags['athlete-run-medical-export'] = true;
  });

  afterEach(() => {
    window.featureFlags['athlete-run-medical-export'] = false;
  });
  const renderWithLoginOrganisation = (organisation = { id: 37 }) => {
    return renderWithProvider(
      <MockedOrganisationContextProvider
        organisationContext={{
          organisation,
          organisationRequestStatus: 'SUCCESS',
        }}
      >
        <MockedPermissionContextProvider
          permissionsContext={{
            permissions: {},
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <ExportList {...props} />
        </MockedPermissionContextProvider>
      </MockedOrganisationContextProvider>,
      defaultStore
    );
  };

  const getTheButton = (name) => {
    return screen.getByRole('button', { name });
  };

  it('does not render the actions if not a login org', () => {
    renderWithLoginOrganisation();

    expect(() => getTheButton('Export')).toThrow();
    expect(() => getTheButton('Refresh List')).toThrow();
  });

  it('does render the actions if the current org is a login org', () => {
    renderWithLoginOrganisation({
      id: 37,
      organisation_type: 'login_organisation',
    });

    expect(getTheButton('Export')).toBeInTheDocument();
    expect(getTheButton('Refresh List')).toBeInTheDocument();
  });
});
