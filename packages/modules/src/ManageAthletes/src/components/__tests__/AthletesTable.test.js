import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useExportSidePanel from '@kitman/modules/src/HumanInput/hooks/useExportSidePanel';
import {
  useGetPermissionsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  defaultStore,
  renderTestComponent,
  storeFake,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { initialState } from '@kitman/modules/src/HumanInput/shared/redux/slices/humanInputSlice';
import { useFetchExportableElementsQuery } from '@kitman/services/src/services/exports/generic';
import {
  MockedManageAthletesContextProvider,
  mockedManageAthletesContextValue,
} from '../../contexts/mocks';
import AthletesTable from '../AthletesTable';

jest.mock('@kitman/modules/src/HumanInput/hooks/useExportSidePanel');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/services/src/services/exports/generic');
describe('<AthletesTable />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useExportSidePanel.mockImplementation(() => {
      return {
        isExportSidePanelOpen: false,
        handleCloseExportSidePanel: jest.fn(),
        handleOpenExportSidePanel: jest.fn(),
      };
    });
    useFetchExportableElementsQuery.mockReturnValue({
      data: {},
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { canAssignLabels: false, canViewLabels: false } },
      isSuccess: true,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: { squads: [] },
      isSuccess: true,
    });
  });

  it('displays the table with the correct content', () => {
    renderTestComponent(
      defaultStore,
      <MockedManageAthletesContextProvider
        manageAthletesContext={mockedManageAthletesContextValue}
      >
        <AthletesTable {...props} />{' '}
      </MockedManageAthletesContextProvider>
    );

    const table = screen.getByRole('table');

    const tableRows = table.querySelectorAll('tr');
    const [firstRow, secondRow, thirdRow] = tableRows;

    // First row - table headers
    const tableHeaders = firstRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Athlete');
    expect(tableHeaders[1]).toHaveTextContent('Username');
    expect(tableHeaders[2]).toHaveTextContent('Position');
    expect(tableHeaders[3]).toHaveTextContent('Squads');
    expect(tableHeaders[4]).toHaveTextContent('Creation Date');

    // Second row
    const secondRowCells = secondRow.querySelectorAll('td');

    const secondRowAthleteCell = secondRowCells[0];
    expect(secondRowAthleteCell).toHaveTextContent('John Doe');

    const secondRowAthleteCellAvatar =
      secondRowAthleteCell.querySelector('img');
    expect(secondRowAthleteCellAvatar).toHaveAttribute(
      'src',
      'www.avatar-url.com'
    );

    expect(secondRowCells[1]).toHaveTextContent('joDoe');
    expect(secondRowCells[2]).toHaveTextContent('Fullback');
    expect(secondRowCells[3]).toHaveTextContent('International Squad');
    expect(secondRowCells[4]).toHaveTextContent('April 14, 2015');

    // Third row
    const thirdRowCells = thirdRow.querySelectorAll('td');

    const thirdRowAthleteCell = thirdRowCells[0];
    expect(thirdRowAthleteCell).toHaveTextContent('Jane Doe');

    const thirdRowAthleteCellAvatar = thirdRowAthleteCell.querySelector('img');
    expect(thirdRowAthleteCellAvatar).toHaveAttribute(
      'src',
      'www.avatar-url.com'
    );

    expect(thirdRowCells[0]).toHaveTextContent('Jane Doe');
    expect(thirdRowCells[1]).toHaveTextContent('jaDoe');
    expect(thirdRowCells[2]).toHaveTextContent('Fullback');
    expect(thirdRowCells[3]).toHaveTextContent(
      'International Squad, Academy Squad'
    );
    expect(thirdRowCells[4]).toHaveTextContent('June 12, 2017');
  });

  it('displays the correct message when no active athletes', () => {
    renderTestComponent(
      defaultStore,
      <MockedManageAthletesContextProvider
        manageAthletesContext={{
          ...mockedManageAthletesContextValue,
          athletes: [],
        }}
      >
        <AthletesTable {...props} />
      </MockedManageAthletesContextProvider>
    );

    expect(screen.getByText('No active athletes found')).toBeInTheDocument();
  });

  it('displays the correct message when no inactive athletes', () => {
    renderTestComponent(
      defaultStore,
      <MockedManageAthletesContextProvider
        manageAthletesContext={{
          ...mockedManageAthletesContextValue,
          athletes: [],
          viewType: 'INACTIVE',
        }}
      >
        <AthletesTable {...props} />
      </MockedManageAthletesContextProvider>
    );

    expect(screen.getByText('No inactive athletes found')).toBeInTheDocument();
  });

  describe('labels-and-groups FF', () => {
    beforeEach(() => {
      window.setFlag('labels-and-groups', true);
    });

    afterEach(() => {
      window.setFlag('labels-and-groups', false);
    });
    it('renders the labels as a column when permission is true', () => {
      useGetPermissionsQuery.mockReturnValue({
        data: { settings: { canAssignLabels: true, canViewLabels: true } },
        isSuccess: true,
      });
      renderTestComponent(
        defaultStore,
        <MockedManageAthletesContextProvider
          manageAthletesContext={mockedManageAthletesContextValue}
        >
          <AthletesTable {...props} />{' '}
        </MockedManageAthletesContextProvider>
      );

      // Label column header
      expect(screen.getByText('Labels')).toBeInTheDocument();

      // Labels tags
      expect(
        screen.getByText(
          mockedManageAthletesContextValue.athletes[0].labels[0].name
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          mockedManageAthletesContextValue.athletes[0].labels[1].name
        )
      ).toBeInTheDocument();
    });

    it('does not render labels if view permission is false', () => {
      renderTestComponent(
        defaultStore,
        <MockedManageAthletesContextProvider
          manageAthletesContext={mockedManageAthletesContextValue}
        >
          <AthletesTable {...props} />{' '}
        </MockedManageAthletesContextProvider>
      );

      // Label column header
      expect(screen.queryByText('Labels')).not.toBeInTheDocument();
    });

    it('renders the checkboxes when permission is true', () => {
      useGetPermissionsQuery.mockReturnValue({
        data: { settings: { canAssignLabels: true, canViewLabels: true } },
        isSuccess: true,
      });
      renderTestComponent(
        defaultStore,
        <MockedManageAthletesContextProvider
          manageAthletesContext={mockedManageAthletesContextValue}
        >
          <AthletesTable {...props} />{' '}
        </MockedManageAthletesContextProvider>
      );

      expect(screen.getAllByRole('checkbox').length).toEqual(
        mockedManageAthletesContextValue.athletes.length
      );
    });

    it('does not render checkboxes if admin permission is false', () => {
      renderTestComponent(
        defaultStore,
        <MockedManageAthletesContextProvider
          manageAthletesContext={mockedManageAthletesContextValue}
        >
          <AthletesTable {...props} />{' '}
        </MockedManageAthletesContextProvider>
      );

      expect(screen.queryAllByRole('checkbox').length).toEqual(0);
    });
  });

  describe('form-based-athlete-profile FF', () => {
    const athleteProfileStore = storeFake({
      humanInputSlice: initialState,
      genericExportsSlice: { exportableFields: [] },
    });
    it('show ExportSidePanel when feature flag is on', () => {
      window.featureFlags['form-based-athlete-profile'] = true;
      useExportSidePanel.mockImplementation(() => {
        return {
          isExportSidePanelOpen: true,
          handleCloseExportSidePanel: jest.fn(),
          handleOpenExportSidePanel: jest.fn(),
        };
      });

      renderTestComponent(
        athleteProfileStore,
        <MockedManageAthletesContextProvider
          manageAthletesContext={mockedManageAthletesContextValue}
        >
          <AthletesTable {...props} />{' '}
        </MockedManageAthletesContextProvider>
      );

      expect(
        screen.getByRole('button', { name: 'Export' })
      ).toBeInTheDocument();
    });

    it('hide ExportSidePanel when feature flag is off', () => {
      window.featureFlags['form-based-athlete-profile'] = false;
      useExportSidePanel.mockImplementation(() => {
        return {
          isExportSidePanelOpen: true,
          handleCloseExportSidePanel: jest.fn(),
          handleOpenExportSidePanel: jest.fn(),
        };
      });

      renderTestComponent(
        athleteProfileStore,
        <MockedManageAthletesContextProvider
          manageAthletesContext={mockedManageAthletesContextValue}
        >
          <AthletesTable {...props} />{' '}
        </MockedManageAthletesContextProvider>
      );

      expect(
        screen.queryByRole('button', { name: 'Export' })
      ).not.toBeInTheDocument();
    });
  });
});
