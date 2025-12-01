import { screen, within, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { exportTimeLossAllActivitiesReport } from '@kitman/services/src/services/medical';
import TimeLossAllActivitiesReportExport from '../TimeLossAllActivitiesReportExport';

jest.mock(
  '@kitman/services/src/services/medical/exportTimeLossAllActivitiesReport'
);
jest.mock('@kitman/services/src/services/medical', () => {
  const original = jest.requireActual('@kitman/services/src/services/medical');
  return {
    ...original,
    exportTimeLossAllActivitiesReport: jest.fn(),
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
  reportSettingsKey: 'RosterOverview|TimeLossAllActivitiesReport',
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
        <TimeLossAllActivitiesReportExport {...props} />
      </Provider>
    </LocalizationProvider>
  );

describe('Time Loss All Activities Report Export', () => {
  beforeEach(() => {
    exportTimeLossAllActivitiesReport.mockResolvedValue(expectedResult);
    window.organisationSport = 'nfl';
  });

  afterEach(() => {
    exportTimeLossAllActivitiesReport.mockClear();
    jest.clearAllMocks();
    window.organisationSport = originalSport;
  });

  it('displays correct options in sidepanel', async () => {
    const { user } = renderComponent();

    expect(
      screen.getByText('Time Loss Report (All activities)')
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

    [
      // settings
      'Demographics',
      'Include Past players',
      // columns
      'Injury Date',
      'Player id',
      'Player name',
      'Injury',
      'Return to full',
      'Games Out',
      'Practices Out',
      'OTAs Out',
      'Walkthroughs Out',
      'Mini-camps Out',
      'Activity at Time of Injury',
    ].forEach((column) => {
      expect(
        screen.getByRole('checkbox', { name: column })
      ).toBeInTheDocument();
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

      [
        'Demographics',
        'Include Created by Prior Club',
        'Include Past players',
      ].forEach((column) => {
        expect(
          screen.getByRole('checkbox', { name: column })
        ).toBeInTheDocument();
      });
    });
  });

  it('displays correct options in sidepanel for non nfl org', async () => {
    window.organisationSport = 'rugby';

    const { user } = renderComponent();

    expect(screen.getByText('Issue Type')).toBeInTheDocument();
    ['All Issues', 'Injuries', 'Illnesses'].forEach((issueType) =>
      expect(screen.getByRole('radio', { name: issueType })).toBeInTheDocument()
    );

    await user.click(screen.getByText('Columns'));

    [
      'Issue Date', // Instead of Injury Date
      'Athlete id', // Instead of Player id
    ].forEach((column) => {
      expect(
        screen.getByRole('checkbox', { name: column })
      ).toBeInTheDocument();
    });
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

    expect(exportTimeLossAllActivitiesReport).toHaveBeenCalledWith(
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
        'issue_date',
        'player_id',
        'player_name',
        'issue_name',
        'return_to_full',
        'games_missed',
        'practices_missed',
        'otas_missed',
        'walkthroughs_missed',
        'mini_camps_missed',
        'player_activity',
      ],
      {
        date_ranges: [
          {
            end_time: '2023-11-29T23:59:59+00:00',
            start_time: '2023-11-28T00:00:00+00:00',
          },
        ],
        include_created_by_prior_club: false,
      },
      'csv',
      false, // Include past players: no
      true // Include demographics: yes
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });

  it('requests xlsx format when changing export format to xlsx', async () => {
    const { user } = renderComponent();

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

    const dateRangePicker = screen.getAllByRole('textbox')[1];

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: '28/11/2023 – 29/11/2023' },
    });

    const downloadButton = screen.getByRole('button', { name: 'Download' });

    expect(downloadButton).toBeEnabled();

    await user.click(downloadButton);

    expect(exportTimeLossAllActivitiesReport).toHaveBeenCalledWith(
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
        'issue_date',
        'player_id',
        'player_name',
        'issue_name',
        'return_to_full',
        'games_missed',
        'practices_missed',
        'otas_missed',
        'walkthroughs_missed',
        'mini_camps_missed',
        'player_activity',
      ],
      {
        date_ranges: [
          {
            end_time: '2023-11-29T23:59:59+00:00',
            start_time: '2023-11-28T00:00:00+00:00',
          },
        ],
        include_created_by_prior_club: false,
      },
      'xlsx',
      false, // Include past players: no
      true // Include demographics: yes
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });

  it('changes columns submitted on unchecking checkboxes', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByText('Columns'));

    const playerNameCheckbox = screen.getByRole('checkbox', {
      name: 'Player name',
    });

    expect(playerNameCheckbox).toBeInTheDocument();

    expect(playerNameCheckbox).toBeChecked();

    await user.click(playerNameCheckbox);

    expect(playerNameCheckbox).not.toBeChecked();

    const dateRangePicker = screen.getAllByRole('textbox')[1];

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: '28/11/2023 – 29/11/2023' },
    });

    const downloadButton = screen.getByRole('button', { name: 'Download' });

    expect(downloadButton).toBeEnabled();

    await user.click(downloadButton);

    expect(exportTimeLossAllActivitiesReport).toHaveBeenCalledWith(
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
        'issue_date',
        'player_id',
        // 'player_name', unchecked
        'issue_name',
        'return_to_full',
        'games_missed',
        'practices_missed',
        'otas_missed',
        'walkthroughs_missed',
        'mini_camps_missed',
        'player_activity',
      ],
      {
        date_ranges: [
          {
            end_time: '2023-11-29T23:59:59+00:00',
            start_time: '2023-11-28T00:00:00+00:00',
          },
        ],
        include_created_by_prior_club: false,
      },
      'xlsx',
      false, // Include past players: no
      true // Include demographics: yes
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });
});
