import { screen, within, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { exportInjuryMedicationReport } from '@kitman/services/src/services/medical';
import InjuryMedicationReportExport from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/InjuryMedicationReportExport';

jest.mock('@kitman/services/src/services/medical/exportInjuryMedicationReport');
jest.mock('@kitman/services/src/services/medical', () => ({
  ...jest.requireActual('@kitman/services/src/services/medical'),
  exportInjuryMedicationReport: jest.fn(),
}));

const expectedResult = {
  id: 884,
  name: 'Test report',
  export_type: 'injury_report_export',
  created_at: '2023-12-15T16:41:01+00:00',
  attachments: [],
  status: 'pending',
};

const originalSport = window.organisationSport;

const closeSettingsSpy = jest.fn();
const onExportStartedSuccessSpy = jest.fn();
const defaultProps = {
  isSettingsOpen: true,
  closeSettings: closeSettingsSpy,
  onExportStartedSuccess: onExportStartedSuccessSpy,
  reportSettingsKey: 'RosterOverview|TimeLossAllActivitiesReport',
  squadId: 100,
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <Provider store={storeFake({ medicalApi: {} })}>
        <InjuryMedicationReportExport {...props} />
      </Provider>
    </LocalizationProvider>
  );

describe('Injury Medication Report', () => {
  beforeEach(() => {
    exportInjuryMedicationReport.mockResolvedValue(expectedResult);
    window.organisationSport = 'nfl';
  });

  afterEach(() => {
    window.organisationSport = originalSport;
    exportInjuryMedicationReport.mockClear();
    jest.clearAllMocks();
  });

  it('displays correct options in sidepanel', async () => {
    renderComponent();

    expect(screen.getByText('Appendix BB Report')).toBeInTheDocument();

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
    expect(radios).toHaveLength(2);

    ['XLSX', 'PDF'].forEach((exportFormat) => {
      expect(
        screen.getByRole('radio', { name: exportFormat })
      ).toBeInTheDocument();
    });

    [
      // settings
      'Include Past players',
      'Export player files individually',
      // columns
      'Identity of Diagnosis',
      'Initial Date of Diagnosis by Club Physician',
      'Prescribed Medication',
    ].forEach((column) => {
      expect(
        screen.getByRole('checkbox', { name: column })
      ).toBeInTheDocument();
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

      [
        'Include Created by Prior Club',
        'Include Past players',
        'Export player files individually',
      ].forEach((column) => {
        expect(
          screen.getByRole('checkbox', { name: column })
        ).toBeInTheDocument();
      });
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
    expect(downloadButton).toBeDisabled(); // Need to select both a start and end date

    fireEvent.change(dateRangePicker, {
      target: { value: '28/11/2023 – 29/11/2023' },
    });

    downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeEnabled();
    await user.click(downloadButton);

    expect(exportInjuryMedicationReport).toHaveBeenCalledWith(
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
      ['issue_name', 'issue_date', 'medications'],
      {
        date_ranges: [
          {
            end_time: '2023-11-29T23:59:59+00:00',
            start_time: '2023-11-28T00:00:00+00:00',
          },
        ],
        include_created_by_prior_club: false,
        export_player_files_individually: false,
      },
      false, // Include past players: no
      'xlsx'
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });

  it('changes columns submitted on unchecking checkboxes', async () => {
    const { user } = renderComponent();

    const issueNameCheckbox = screen.getByRole('checkbox', {
      name: 'Identity of Diagnosis',
    });

    expect(issueNameCheckbox).toBeInTheDocument();
    expect(issueNameCheckbox).toBeChecked();

    await user.click(issueNameCheckbox);

    expect(issueNameCheckbox).not.toBeChecked();

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await user.click(downloadButton);

    expect(exportInjuryMedicationReport).toHaveBeenCalledWith(
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
      [
        // 'issue_name', unchecked
        'issue_date',
        'medications',
      ],
      {
        date_ranges: [
          {
            end_time: '2023-11-29T23:59:59+00:00',
            start_time: '2023-11-28T00:00:00+00:00',
          },
        ],
        include_created_by_prior_club: false,
        export_player_files_individually: false,
      },
      false, // Include past players: no
      'xlsx'
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });
});
