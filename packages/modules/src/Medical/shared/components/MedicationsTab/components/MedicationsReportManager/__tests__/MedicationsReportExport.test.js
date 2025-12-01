import { screen, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { organisationAssociations } from '@kitman/common/src/variables';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { exportMedicationsReport } from '@kitman/services/src/services/medical';
import MedicationsReportExport from '@kitman/modules/src/Medical/shared/components/MedicationsTab/components/MedicationsReportManager/MedicationsReportExport';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
}));

jest.mock('@kitman/services/src/services/medical', () => ({
  ...jest.requireActual('@kitman/services/src/services/medical'),
  exportMedicationsReport: jest.fn(),
}));

const expectedContent = {
  exportFormat: ['PDF', 'CSV'],
  columns: [
    'Player Name',
    'Reason',
    'Medication',
    'Start date',
    'End date',
    'NFL Player ID',
    'Injury Date',
    'Dosage',
    'Quantity',
    'Type',
    'Dispenser',
  ],
  settings: ['Include all active medications'],
};

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
const props = {
  squadId: 100,
  isSettingsOpen: true,
  closeSettings: closeSettingsSpy,
  onExportStartedSuccess: onExportStartedSuccessSpy,
  reportSettingsKey: 'RosterOverview|MedicationExport',
  t: i18nextTranslateStub(),
};

const store = storeFake({
  globalApi: {},
  medicalApi: {},
});

const renderComponent = () =>
  renderWithUserEventSetup(
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <Provider store={store}>
        <MedicationsReportExport {...props} />
      </Provider>
    </LocalizationProvider>
  );

describe('Medication Export', () => {
  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: { association_name: organisationAssociations.nfl },
    });
    exportMedicationsReport.mockResolvedValue(expectedResult);
  });

  afterEach(() => {
    exportMedicationsReport.mockClear();
    jest.clearAllMocks();
  });
  it('displays correct options in side panel', async () => {
    renderComponent();

    ['Squads', 'Date range'].forEach((field) => {
      expect(screen.getByLabelText(field)).toBeInTheDocument();
    });

    expect(screen.getByText('Export format')).toBeInTheDocument();
    expectedContent.exportFormat.forEach((format) => {
      expect(screen.getByRole('radio', { name: format })).toBeInTheDocument();
    });

    expect(screen.getByText('Columns')).toBeInTheDocument();
    expectedContent.columns.forEach((name) => {
      expect(screen.getByRole('checkbox', { name })).toBeInTheDocument();
      if (expectedContent.columns.slice(0, 3).includes(name)) {
        /* eslint-disable jest/no-conditional-expect */
        expect(screen.getByRole('checkbox', { name })).toBeDisabled();
        expect(screen.getByRole('checkbox', { name })).toBeChecked();
      }
    });

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expectedContent.settings.forEach((name) => {
      expect(screen.getByRole('checkbox', { name })).toBeInTheDocument();
    });
  });

  it('displays correct options in side panel for non nfl org', async () => {
    useGetOrganisationQuery.mockReturnValue({
      data: { association_name: 'not-nfl' },
    });

    renderComponent();

    expect(screen.queryByText('NFL Player ID')).not.toBeInTheDocument();
  });

  it('displays squad selector when no squadId', async () => {
    renderComponent();

    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
  });

  it('calls the closeSettings callback on cancel button', async () => {
    const { user } = renderComponent();

    await user.click(screen.getAllByRole('button')[0]);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings callback on close side panel', async () => {
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
      target: { value: '01/05/2024 – 29/05/2024' },
    });

    downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeEnabled();
    await user.click(downloadButton);

    expect(exportMedicationsReport).toHaveBeenCalledWith({
      columns: [
        'player_name',
        'reason',
        'medication',
        'start_date',
        'end_date',
      ],
      filters: {
        report_range: {
          start_date: '2024-05-01T00:00:00+00:00',
          end_date: '2024-05-29T00:00:00+00:00',
        },
        include_all_active: false,
        archived: false,
      },
      format: 'pdf',
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
    });

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });

  it('changes columns submitted on unchecking checkboxes', async () => {
    const { user } = renderComponent();

    const dateRangePicker = screen.getAllByRole('textbox')[1];

    expect(dateRangePicker).toBeInTheDocument();
    fireEvent.change(dateRangePicker, {
      target: { value: '06/04/2024 – 10/04/2024' },
    });

    await user.click(
      screen.getByRole('radio', {
        name: 'CSV',
      })
    );

    const dosageCheckbox = screen.getByRole('checkbox', {
      name: 'Dosage',
    });
    expect(dosageCheckbox).toBeInTheDocument();
    expect(dosageCheckbox).not.toBeChecked();
    await user.click(dosageCheckbox);

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await user.click(downloadButton);

    expect(exportMedicationsReport).toHaveBeenCalledWith({
      columns: [
        'player_name',
        'reason',
        'medication',
        'start_date',
        'end_date',
        'dosage',
      ],
      filters: {
        report_range: {
          start_date: '2024-04-06T00:00:00+00:00',
          end_date: '2024-04-10T00:00:00+00:00',
        },
        include_all_active: false,
        archived: false,
      },
      format: 'csv',
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
    });

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });
});
