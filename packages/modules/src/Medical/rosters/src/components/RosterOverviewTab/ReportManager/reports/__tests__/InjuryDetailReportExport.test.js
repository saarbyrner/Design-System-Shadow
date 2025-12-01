import { screen, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';
import { VirtuosoMockContext } from 'react-virtuoso';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import {
  useGetMedicalIssuesQuery,
  useGetClinicalImpressionsBodyAreasQuery,
  useGetReportColumnsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import clinicalImpressionsData from '@kitman/services/src/mocks/handlers/medical/clinicalImpressions/data.mock';
import { medicalIssuesCI } from '@kitman/services/src/mocks/handlers/medical/getMedicalIssues';
import { data as mockColumns } from '@kitman/services/src/mocks/handlers/medical/getReportColumns';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/medical/exportInjuryDetailReport';
import { exportInjuryDetailReport } from '@kitman/services/src/services/medical';
import {
  useGetBodyAreasMultiCodingV2Query,
  useGetPathologiesMultiCodingV2Query,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import bodyAreasMultiCodingV2Mock from '@kitman/services/src/mocks/handlers/medical/pathologies/data.mock';
import pathologiesMultiCodingV2Mock from '@kitman/services/src/mocks/handlers/medical/pathologies/osiics15Pathologies.mock';
import InjuryDetailReportExport from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/InjuryDetailReportExport';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetMedicalIssuesQuery: jest.fn(),
  useGetClinicalImpressionsBodyAreasQuery: jest.fn(),
  useGetReportColumnsQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetBodyAreasMultiCodingV2Query: jest.fn(),
    useGetPathologiesMultiCodingV2Query: jest.fn(),
  })
);

jest.mock('@kitman/services/src/services/medical/exportInjuryDetailReport');
jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/services/src/services/medical', () => {
  const original = jest.requireActual('@kitman/services/src/services/medical');
  return {
    ...original,
    exportInjuryDetailReport: jest.fn(),
  };
});

const closeSettingsSpy = jest.fn();
const onExportStartedSuccessSpy = jest.fn();
const defaultProps = {
  squadId: 100,
  isSettingsOpen: true,
  closeSettings: closeSettingsSpy,
  onExportStartedSuccess: onExportStartedSuccessSpy,
  reportSettingsKey: 'RosterOverview|InjuryDetailReport',
  isV2MultiCodingSystem: false,
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <Provider
        store={storeFake({
          medicalApi: {},
          medicalSharedApi: {
            queries: {
              getBodyAreasMultiCodingV2: {
                data: bodyAreasMultiCodingV2Mock,
                status: 'fulfilled',
              },
              getPathologiesMultiCodingV2: {
                data: pathologiesMultiCodingV2Mock,
                status: 'fulfilled',
              },
            },
          },
        })}
      >
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 40 }}
        >
          <InjuryDetailReportExport {...props} />
        </VirtuosoMockContext.Provider>
      </Provider>
    </LocalizationProvider>
  );

describe('Injury Detail Report', () => {
  const originalSport = window.organisationSport;

  beforeEach(() => {
    window.organisationSport = 'nfl';
    exportInjuryDetailReport.mockResolvedValue(mockedExportResponse);
    useGetMedicalIssuesQuery.mockReturnValue({
      data: medicalIssuesCI.results,
      isSuccess: true,
    });
    useGetClinicalImpressionsBodyAreasQuery.mockReturnValue({
      data: clinicalImpressionsData.clinical_impression_body_areas,
      isSuccess: true,
    });
    useGetReportColumnsQuery.mockReturnValue({
      data: mockColumns,
      isSuccess: true,
    });
    useGetBodyAreasMultiCodingV2Query.mockReturnValue({
      data: bodyAreasMultiCodingV2Mock,
      isSuccess: true,
    });
    useGetPathologiesMultiCodingV2Query.mockReturnValue({
      data: pathologiesMultiCodingV2Mock,
      isSuccess: true,
    });
  });

  afterEach(() => {
    window.organisationSport = originalSport;
    exportInjuryDetailReport.mockClear();
    jest.clearAllMocks();
  });

  it('displays correct options in sidepanel', async () => {
    const { user } = renderComponent();

    expect(screen.getByText('Injury Detail Report')).toBeInTheDocument();

    ['Squads', 'Date range'].forEach((field) => {
      expect(screen.getByLabelText(field)).toBeInTheDocument();
    });

    expect(screen.queryByText('Issue Type')).not.toBeInTheDocument();
    ['All Issues', 'Injuries', 'Illnesses'].forEach((issueType) =>
      expect(
        screen.queryByRole('radio', { name: issueType })
      ).not.toBeInTheDocument()
    );

    expect(screen.getByText('Injury Status')).toBeInTheDocument();
    ['All', 'Active', 'Resolved'].forEach((issueType) =>
      expect(screen.getByRole('radio', { name: issueType })).toBeInTheDocument()
    );

    ['CSV', 'XLSX', 'PDF'].forEach((exportFormat) => {
      expect(
        screen.getByRole('radio', { name: exportFormat })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText('Columns'));

    mockColumns.forEach(({ label: name }) => {
      const checkbox = screen.getByRole('checkbox', { name });
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] nfl-include-prior-club-issues ON', () => {
    beforeEach(() => {
      window.featureFlags['nfl-include-prior-club-issues'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-include-prior-club-issues'] = false;
    });

    it('displays correct options in sidepanel', async () => {
      renderComponent();

      ['Include Created by Prior Club', 'Include Past players'].forEach(
        (name) => {
          const checkbox = screen.getByRole('checkbox', { name });
          expect(checkbox).toBeInTheDocument();
        }
      );
    });
  });

  it('renders BodyPartsFieldMultiCodingV2 when isV2MultiCodingSystem is true', () => {
    renderComponent({ ...defaultProps, isV2MultiCodingSystem: true });
    expect(screen.getByLabelText('Body Part')).toBeInTheDocument();
  });

  it('renders CIBodyParts when isV2MultiCodingSystem is false', () => {
    renderComponent({ ...defaultProps, isV2MultiCodingSystem: false });
    expect(screen.getByLabelText('Body Part')).toBeInTheDocument();
  });

  it('displays correct options in sidepanel for non nfl org', async () => {
    window.organisationSport = 'rugby';

    renderComponent();

    expect(screen.getByText('Issue Type')).toBeInTheDocument();
    ['All Issues', 'Injuries', 'Illnesses'].forEach((issueType) =>
      expect(screen.getByRole('radio', { name: issueType })).toBeInTheDocument()
    );
  });

  it('displays squad selector when no squadId', async () => {
    renderComponent({ ...defaultProps, squadId: null });

    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
  });

  it('calls the closeSettings callback on cancel button', async () => {
    const { user } = renderComponent();

    await user.click(screen.getAllByRole('button')[0]);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings callback on close sidepanel', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings and onExportStartedSuccess callback on download', async () => {
    const { user } = renderComponent();

    const dateRangePicker = screen.getAllByRole('textbox')[1];

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: '06/04/2024' },
    });

    let downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeDisabled(); // Need to select both a start and end date

    fireEvent.change(dateRangePicker, {
      target: { value: '01/05/2024 – 29/05/2024' },
    });

    downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeEnabled();
    await user.click(downloadButton);

    expect(exportInjuryDetailReport).toHaveBeenCalledWith(
      [],
      [
        {
          all_squads: false,
          applies_to_squad: false,
          athletes: [],
          context_squads: [100],
          position_groups: [],
          positions: [],
          squads: [100],
        },
      ],
      mockColumns.map(({ value }) => value),
      {
        date_ranges: [
          {
            start_time: '2024-05-01T00:00:00+00:00',
            end_time: '2024-05-29T23:59:59+00:00',
          },
        ],
        include_created_by_prior_club: false,
        resolved: undefined,
      },
      false, // Include past players: no
      'csv'
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });

  it('includes coding filter when codes or body parts selected', async () => {
    const { user } = renderComponent();

    // Change export column selections
    await user.click(screen.getByText('Columns'));
    const radioGroups = screen.getAllByRole('radiogroup');
    expect(radioGroups).toHaveLength(2); // Injury Status Radio List, export format

    const column2Checkbox = screen.getByRole('checkbox', {
      name: 'Column 2', // Column 2
    });
    expect(column2Checkbox).toBeInTheDocument();
    expect(column2Checkbox).toBeChecked();
    await user.click(column2Checkbox);
    expect(column2Checkbox).not.toBeChecked();

    // Select some CI codes
    const codeOption1Text = `${medicalIssuesCI.results[0].code} ${medicalIssuesCI.results[0].pathology}`;
    const select1 = screen.getByLabelText('CI Code');
    await user.click(select1);
    await user.click(screen.getByText(codeOption1Text));

    // Select some Body Parts
    const bodyPartOption1Text =
      clinicalImpressionsData.clinical_impression_body_areas[1].name;
    const select2 = screen.getByLabelText('Body Part');
    await user.click(select2);
    await user.click(screen.getByText(bodyPartOption1Text));

    const dateRangePicker = screen.getAllByRole('textbox')[1];

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: '01/05/2024 – 29/05/2024' },
    });

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await user.click(downloadButton);

    expect(exportInjuryDetailReport).toHaveBeenCalledWith(
      [],
      [
        {
          all_squads: false,
          applies_to_squad: false,
          athletes: [],
          context_squads: [100],
          position_groups: [],
          positions: [],
          squads: [100],
        },
      ],
      mockColumns
        .filter(({ value }) => value !== 'column_2')
        .map(({ value }) => value),
      {
        coding: {
          clinical_impressions: {
            body_area_ids: [2],
            codes: ['608821'],
          },
        },
        date_ranges: [
          {
            start_time: '2024-05-01T00:00:00+00:00',
            end_time: '2024-05-29T23:59:59+00:00',
          },
        ],
        include_created_by_prior_club: false,
        resolved: undefined,
      },
      false, // Include past players: no
      'csv'
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);

    // Reset the 'remembered' checkbox for further tests
    await user.click(column2Checkbox);
  });

  it('includes coding_system_pathologies filter when isV2MultiCodingSystem pathologies or body parts selected', async () => {
    const { user } = renderComponent({
      ...defaultProps,
      isV2MultiCodingSystem: true,
    });

    // Change export column selections
    await user.click(screen.getByText('Columns'));
    const radioGroups = screen.getAllByRole('radiogroup');
    expect(radioGroups).toHaveLength(2); // Injury Status Radio List, export format

    const column2Checkbox = screen.getByRole('checkbox', {
      name: 'Column 2', // Column 2
    });
    expect(column2Checkbox).toBeInTheDocument();
    expect(column2Checkbox).toBeChecked();
    await user.click(column2Checkbox);
    expect(column2Checkbox).not.toBeChecked();

    // Select some codes
    const codeOption1Text = `${pathologiesMultiCodingV2Mock[0].code} ${pathologiesMultiCodingV2Mock[0].pathology}`;
    const select1 = screen.getByLabelText('Pathologies');
    await user.click(select1);
    await user.click(screen.getByText(codeOption1Text));

    // Select some Body Parts
    const bodyPartOption1Text =
      clinicalImpressionsData.clinical_impression_body_areas[1].name;
    const select2 = screen.getByLabelText('Body Part');
    await user.click(select2);
    await user.click(screen.getByText(bodyPartOption1Text));

    const dateRangePicker = screen.getAllByRole('textbox')[1];

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: '01/05/2024 – 29/05/2024' },
    });

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await user.click(downloadButton);

    expect(exportInjuryDetailReport).toHaveBeenCalledWith(
      [],
      [
        {
          all_squads: false,
          applies_to_squad: false,
          athletes: [],
          context_squads: [100],
          position_groups: [],
          positions: [],
          squads: [100],
        },
      ],
      mockColumns
        .filter(({ value }) => value !== 'column_2')
        .map(({ value }) => value),
      {
        coding: undefined,
        coding_system_pathologies: {
          body_area_ids: [21],
          codes: ['GVI'],
        },

        date_ranges: [
          {
            start_time: '2024-05-01T00:00:00+00:00',
            end_time: '2024-05-29T23:59:59+00:00',
          },
        ],
        include_created_by_prior_club: false,
        resolved: undefined,
      },
      false, // Include past players: no
      'csv'
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);

    // Reset the 'remembered' checkbox for further tests
    await user.click(column2Checkbox);
  });
});
