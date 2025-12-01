import { screen, within, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import {
  useGetClinicalImpressionsBodyAreasQuery,
  useGetReportColumnsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import clinicalImpressionsData from '@kitman/services/src/mocks/handlers/medical/clinicalImpressions/data.mock';
import { data as mockColumns } from '@kitman/services/src/mocks/handlers/medical/getReportColumns';
import { exportTimeLossBodyPartReport } from '@kitman/services/src/services/medical';
import TimeLossBodyPartReportExport from '../TimeLossBodyPartReportExport';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetClinicalImpressionsBodyAreasQuery: jest.fn(),
  useGetReportColumnsQuery: jest.fn(),
}));

jest.mock('@kitman/services/src/services/medical', () => {
  const original = jest.requireActual('@kitman/services/src/services/medical');
  return {
    ...original,
    exportTimeLossBodyPartReport: jest.fn(),
  };
});

const originalSport = window.organisationSport;

const expectedResult = {
  id: 884,
  name: 'Test report',
  export_type: 'injury_report_export',
  created_at: '2023-12-15T16:41:01+00:00',
  attachments: [],
  status: 'pending',
};

const closeSettingsSpy = jest.fn();
const onExportStartedSuccessSpy = jest.fn();

const defaultProps = {
  isSettingsOpen: true,
  closeSettings: closeSettingsSpy,
  onExportStartedSuccess: onExportStartedSuccessSpy,
  reportSettingsKey: 'RosterOverview|TimeLossBodyPartReport',
  squadId: 100,
  t: i18nextTranslateStub(),
};

const store = storeFake({
  medicalApi: {},
});

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <Provider store={store}>
        <TimeLossBodyPartReportExport {...props} />
      </Provider>
    </LocalizationProvider>
  );

describe('Time Loss Body Part Report Export', () => {
  beforeEach(() => {
    exportTimeLossBodyPartReport.mockResolvedValue(expectedResult);
    window.organisationSport = 'nfl';
    useGetClinicalImpressionsBodyAreasQuery.mockReturnValue({
      data: clinicalImpressionsData.clinical_impression_body_areas,
      isSuccess: true,
    });
    useGetReportColumnsQuery.mockReturnValue({
      data: mockColumns,
      isSuccess: true,
    });
  });

  afterEach(() => {
    exportTimeLossBodyPartReport.mockClear();
    jest.clearAllMocks();
    window.organisationSport = originalSport;
  });

  it('displays correct options in sidepanel', async () => {
    const { user } = renderComponent();

    expect(
      screen.getByText('Time Loss Report (Body Part)')
    ).toBeInTheDocument();

    ['Squads', 'Date range'].forEach((field) => {
      expect(screen.getByLabelText(field)).toBeInTheDocument();
    });

    expect(screen.queryByText('Issue Type')).not.toBeInTheDocument();
    ['All Issues', 'Injuries', 'Illnesses'].forEach((issueType) =>
      expect(
        screen.queryByRole('radio', { name: issueType })
      ).not.toBeInTheDocument()
    );

    const radioGroups = screen.getAllByRole('radiogroup');
    expect(radioGroups.length).toEqual(1);

    const radios = within(radioGroups[0]).getAllByRole('radio');
    expect(radios).toHaveLength(3);

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

    // Need to select date range
    expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled();
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
        (column) => {
          expect(
            screen.getByRole('checkbox', { name: column })
          ).toBeInTheDocument();
        }
      );
    });
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

  it('calls the closeSettings and onDownloadSuccess callback on download', async () => {
    const { user } = renderComponent();

    const dateRangePicker = screen.getAllByRole('textbox')[1];

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: '06/04/2024' },
    });

    let downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeDisabled(); // Need to select date range

    fireEvent.change(dateRangePicker, {
      target: { value: '28/11/2023 – 29/11/2023' },
    });

    downloadButton = screen.getByRole('button', { name: 'Download' });

    expect(downloadButton).toBeEnabled();

    await user.click(downloadButton);

    expect(exportTimeLossBodyPartReport).toHaveBeenCalledWith({
      issueTypes: [],
      population: [
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
      columns: mockColumns.map(({ value }) => value),
      filters: {
        date_ranges: [
          {
            end_time: '2023-11-29T23:59:59+00:00',
            start_time: '2023-11-28T00:00:00+00:00',
          },
        ],
        include_created_by_prior_club: false,
        coding: undefined,
      },
      format: 'csv',
      includePastPlayers: false, // Include past players: no
    });

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });

  it('requests xlsx format and correct coding when changing export format to xlsx and select a body part', async () => {
    const { user } = renderComponent();

    // Select a Body Part
    const bodyPartOption1Text =
      clinicalImpressionsData.clinical_impression_body_areas[0].name;
    const bodyPartDropdown = screen.getByLabelText('Body Part');
    await user.click(bodyPartDropdown);
    await user.click(screen.getByText(bodyPartOption1Text));

    // Change export format
    const radioGroups = screen.getAllByRole('radiogroup');
    expect(radioGroups.length).toEqual(1);

    const radios = within(radioGroups[0]).getAllByRole('radio');
    expect(radios).toHaveLength(3);

    expect(radios.at(0).value).toEqual('csv');
    expect(radios.at(1).value).toEqual('xlsx');
    expect(radios.at(2).value).toEqual('pdf');

    expect(radios.at(1)).not.toBeChecked();

    await user.click(radios.at(1));

    expect(radios.at(1)).toBeChecked();

    // Select date range
    const dateRangePicker = screen.getAllByRole('textbox')[1];

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: '28/11/2023 – 29/11/2023' },
    });

    const downloadButton = screen.getByRole('button', { name: 'Download' });

    expect(downloadButton).toBeEnabled();

    await user.click(downloadButton);

    expect(exportTimeLossBodyPartReport).toHaveBeenCalledWith({
      issueTypes: [],
      population: [
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
      columns: mockColumns.map(({ value }) => value),
      filters: {
        date_ranges: [
          {
            end_time: '2023-11-29T23:59:59+00:00',
            start_time: '2023-11-28T00:00:00+00:00',
          },
        ],
        include_created_by_prior_club: false,
        coding: {
          clinical_impressions: {
            body_area_ids: [1],
          },
        },
      },
      format: 'xlsx',
      includePastPlayers: false, // Include past players: no
    });

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });

  it('changes columns submitted on unchecking checkboxes', async () => {
    const { user } = renderComponent();

    // Change columns
    await user.click(screen.getByText('Columns'));
    const column2Checkbox = screen.getByRole('checkbox', {
      name: 'Column 2', // Column 2
    });
    expect(column2Checkbox).toBeInTheDocument();
    expect(column2Checkbox).toBeChecked();
    await user.click(column2Checkbox);
    expect(column2Checkbox).not.toBeChecked();

    // Select a date range
    const dateRangePicker = screen.getAllByRole('textbox')[1];

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: '28/11/2023 – 29/11/2023' },
    });

    const downloadButton = screen.getByRole('button', { name: 'Download' });

    expect(downloadButton).toBeEnabled();

    await user.click(downloadButton);

    expect(exportTimeLossBodyPartReport).toHaveBeenCalledWith({
      issueTypes: [],
      population: [
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
      columns: mockColumns
        .filter(({ value }) => value !== 'column_2')
        .map(({ value }) => value),
      filters: {
        date_ranges: [
          {
            end_time: '2023-11-29T23:59:59+00:00',
            start_time: '2023-11-28T00:00:00+00:00',
          },
        ],
        include_created_by_prior_club: false,
        coding: undefined,
      },
      format: 'xlsx',
      includePastPlayers: false, // Include past players: no
    });

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });
});
