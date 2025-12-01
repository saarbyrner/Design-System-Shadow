import { screen, within, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import { exportOsha300Report } from '@kitman/services/src/services/medical';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/exports/exportOsha300Report';
import Osha300Report from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/Osha300Report';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/services/src/services/medical', () => ({
  ...jest.requireActual('@kitman/services/src/services/medical'),
  exportOsha300Report: jest.fn(),
}));

const mockTrackEvent = jest.fn();
const closeSettingsSpy = jest.fn();
const onExportStartedSuccessSpy = jest.fn();
const defaultProps = {
  squadId: 100,
  isSettingsOpen: true,
  closeSettings: closeSettingsSpy,
  onExportStartedSuccess: onExportStartedSuccessSpy,
  reportSettingsKey: 'RosterOverview|Osha300Report',
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <Provider store={storeFake({ medicalApi: {} })}>
        <Osha300Report {...props} />
      </Provider>
    </LocalizationProvider>
  );

describe('OSHA 300 Report', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
    exportOsha300Report.mockResolvedValue(mockedExportResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays correct options in sidepanel', async () => {
    renderComponent();

    expect(screen.getByText('OSHA 300 Report')).toBeInTheDocument();

    ['Date range'].forEach((field) => {
      expect(screen.getByLabelText(field)).toBeInTheDocument();
    });

    const radioGroups = screen.getAllByRole('radiogroup');
    expect(radioGroups.length).toEqual(1);

    const radios = within(radioGroups[0]).getAllByRole('radio');
    expect(radios).toHaveLength(3);

    ['CSV', 'XLSX', 'PDF'].forEach((exportFormat) => {
      expect(
        screen.getByRole('radio', { name: exportFormat })
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

      ['Include Created by Prior Club'].forEach((column) => {
        expect(
          screen.getByRole('checkbox', { name: column })
        ).toBeInTheDocument();
      });
    });
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

    const dateRangePicker = screen.getAllByRole('textbox')[0];

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

    expect(exportOsha300Report).toHaveBeenCalledWith({
      filters: {
        date_range: {
          start_time: '2024-05-01T00:00:00+00:00',
          end_time: '2024-05-29T23:59:59+00:00',
        },
        include_created_by_prior_club: false,
      },
      format: 'csv',
    });

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith('Export OSHA 300 Report', {
      level: 'team',
      tab: tabHashes.OVERVIEW,
    });
  });

  it('requests xlsx format when changing export format to xlsx', async () => {
    const { user } = renderComponent();

    const dateRangePicker = screen.getAllByRole('textbox')[0];

    expect(dateRangePicker).toBeInTheDocument();

    fireEvent.change(dateRangePicker, {
      target: { value: '28/11/2023 – 29/11/2023' },
    });

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

    const downloadButton = screen.getByRole('button', { name: 'Download' });

    expect(downloadButton).toBeEnabled();

    await user.click(downloadButton);

    expect(exportOsha300Report).toHaveBeenCalledWith({
      filters: {
        date_range: {
          start_time: '2023-11-28T00:00:00+00:00',
          end_time: '2023-11-29T23:59:59+00:00',
        },
        include_created_by_prior_club: false,
      },
      format: 'xlsx',
    });

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith('Export OSHA 300 Report', {
      level: 'team',
      tab: tabHashes.OVERVIEW,
    });
  });
});
