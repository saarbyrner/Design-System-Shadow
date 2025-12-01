import { screen } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { useGetReportColumnsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/medical/exportInjuryDetailReport';
import { exportPlayerDetailReport } from '@kitman/services/src/services/medical';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { useExportSettings } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Context';
import PlayerDetailReport from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/PlayerDetailReport';

jest.mock(
  '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Context',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Context'
    ),
    useExportSettings: jest.fn(),
  })
);

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetReportColumnsQuery: jest.fn(),
}));

jest.mock('@kitman/services/src/services/medical', () => {
  const original = jest.requireActual('@kitman/services/src/services/medical');
  return {
    ...original,
    exportPlayerDetailReport: jest.fn(),
  };
});

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useExports');
jest.mock(
  '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog',
  () => () => null
);

const closeSettingsSpy = jest.fn();
const onExportStartedSuccessSpy = jest.fn();
const mockTrackEvent = jest.fn();

const defaultProps = {
  squadId: 100,
  isSettingsOpen: true,
  closeSettings: closeSettingsSpy,
  onExportStartedSuccess: onExportStartedSuccessSpy,
  reportSettingsKey: 'RosterOverview|PlayerDetailReport',
  t: i18nextTranslateStub(),
};

const initialFormStateWithRequiredFields = {
  population: [{ id: 1, name: 'Squad 1' }],
  columns: ['athlete_name', 'nfl_id'],
  includePastPlayers: false,
  exportFormat: 'csv',
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <Provider store={storeFake({ medicalApi: {}, globalApi: {} })}>
        <PlayerDetailReport {...props} />
      </Provider>
    </LocalizationProvider>
  );

describe('Player Detail Report', () => {
  beforeEach(() => {
    exportPlayerDetailReport.mockResolvedValue(mockedExportResponse);
    useGetReportColumnsQuery.mockReturnValue({
      data: [],
      isSuccess: true,
    });
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
    useExports.mockReturnValue({
      exportReports: jest
        .fn()
        .mockImplementation(async (exportFn, successCb) => {
          try {
            await exportFn();
            if (successCb) successCb();
          } catch (error) {
            // NOSONAR
            // Error handling is simulated, ensuring successCb is not called on error.
          }
        }),
      toasts: [],
      closeToast: jest.fn(),
    });
    useExportSettings.mockReturnValue({
      isSaveDisabled: false,
      formState: {
        ...initialFormStateWithRequiredFields,
        includePastPlayers: false,
      },
      setFieldValue: jest.fn(),
      onSave: jest.fn().mockImplementation(async () => {
        mockTrackEvent(
          performanceMedicineEventNames.playerDetailReportExported,
          {
            'File Type': initialFormStateWithRequiredFields.exportFormat,
            'Player Inclusion':
              initialFormStateWithRequiredFields.includePastPlayers
                ? 'include_past_players'
                : 'active_players_only',
          }
        );
        await useExports().exportReports(
          () =>
            exportPlayerDetailReport(
              initialFormStateWithRequiredFields.population,
              initialFormStateWithRequiredFields.columns,
              {},
              initialFormStateWithRequiredFields.includePastPlayers,
              initialFormStateWithRequiredFields.exportFormat
            ),
          onExportStartedSuccessSpy
        );
      }),
      onCancel: closeSettingsSpy,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the report settings and defaults', async () => {
    renderComponent();

    expect(screen.getByText('Player Detail Report')).toBeInTheDocument();
    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
    expect(screen.getByLabelText('Include Past players')).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'CSV' })).toBeChecked();
  });

  it('disables download button when isSaveDisabled is true', async () => {
    useExportSettings.mockReturnValue({
      isSaveDisabled: true,
      formState: {},
      setFieldValue: jest.fn(),
      onSave: jest.fn(),
      onCancel: closeSettingsSpy,
    });
    renderComponent();
    const downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeDisabled();
  });

  it('enables download button when isSaveDisabled is false', async () => {
    renderComponent();
    const downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeEnabled();
  });

  it('calls onCancel when the cancel button is clicked', async () => {
    const { user } = renderComponent();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls onSave, tracks the event, and calls exportPlayerDetailReport with correct payload when the download button is clicked', async () => {
    const { user } = renderComponent();
    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(mockTrackEvent).toHaveBeenCalledWith(
      performanceMedicineEventNames.playerDetailReportExported,
      {
        'File Type': initialFormStateWithRequiredFields.exportFormat,
        'Player Inclusion':
          initialFormStateWithRequiredFields.includePastPlayers
            ? 'include_past_players'
            : 'active_players_only',
      }
    );

    expect(exportPlayerDetailReport).toHaveBeenCalledWith(
      initialFormStateWithRequiredFields.population,
      initialFormStateWithRequiredFields.columns,
      {},
      initialFormStateWithRequiredFields.includePastPlayers,
      initialFormStateWithRequiredFields.exportFormat
    );
  });

  it('handles API errors during export', async () => {
    exportPlayerDetailReport.mockRejectedValueOnce(new Error('API Error'));
    const { user } = renderComponent();
    await user.click(screen.getByRole('button', { name: 'Download' }));
    expect(onExportStartedSuccessSpy).not.toHaveBeenCalled();
  });
});
