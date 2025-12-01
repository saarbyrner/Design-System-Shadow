import { screen, within, waitFor } from '@testing-library/react';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import CoachesReport from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/CoachesReport';

describe('CoachesReport', () => {
  beforeEach(() => {
    window.featureFlags = { 'coaches-report-v2': false };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const closeSettingsSpy = jest.fn();
  const onDownloadCSVSuccessSpy = jest.fn();
  const onPrintReportSpy = jest.fn();

  const defaultProps = {
    isReportActive: false,
    isSettingsOpen: true,
    closeSettings: closeSettingsSpy,
    printReport: onPrintReportSpy,
    onDownloadCSVSuccess: onDownloadCSVSuccessSpy,
    reportSettingsKey: 'RosterOverview|CoachesReport',
    squads: [100],
    t: i18nextTranslateStub(),
  };

  const store = storeFake({
    globalApi: {},
    medicalApi: {},
  });

  const renderComponent = (props = defaultProps) =>
    renderWithUserEventSetup(
      <Provider store={store}>
        <CoachesReport {...props} />
      </Provider>
    );

  it('renders export format type radio buttons when coaches-report-v2 ON', async () => {
    window.featureFlags = { 'coaches-report-v2': true };

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });

    const exportTypeRadioButtonContainer = screen.getByTestId(
      'coachesReportV2ExportControls'
    );
    expect(
      within(exportTypeRadioButtonContainer).getByText('Export as')
    ).toBeInTheDocument();

    // Radio labels
    expect(
      within(exportTypeRadioButtonContainer).getAllByRole('radio')[0].parentNode
        .parentNode
    ).toHaveTextContent('CSV');
    expect(
      within(exportTypeRadioButtonContainer).getAllByRole('radio')[1].parentNode
        .parentNode
    ).toHaveTextContent('PDF');

    // CSV is the default type
    expect(
      within(exportTypeRadioButtonContainer).getAllByRole('radio')[0]
    ).toBeChecked();
    expect(
      within(exportTypeRadioButtonContainer).getAllByRole('radio')[1]
    ).not.toBeChecked();

    expect(
      within(exportTypeRadioButtonContainer).getAllByRole('radio')
    ).toHaveLength(2);
  });

  it('does not render the export format type radio buttons when coaches-report-v2 OFF', async () => {
    window.featureFlags = { 'coaches-report-v2': false };

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });

    const exportTypeRadioButtonContainer = screen.queryByTestId(
      'coachesReportV2ExportControls'
    );
    expect(exportTypeRadioButtonContainer).not.toBeInTheDocument();
  });

  it('displays correct options in sidepanel when coaches-report-v2 ON', async () => {
    window.featureFlags = { 'coaches-report-v2': true };

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });
    const title = screen.getByTestId('sliding-panel|title');
    expect(title).toHaveTextContent('Coaches Report');

    expect(screen.getByLabelText('Grouping')).toBeInTheDocument();

    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(2); // Main & Settings

    // Main checkboxes
    const checkboxes1 = within(lists[0]).getAllByRole('checkbox');
    const expectedCheckboxNames = [
      'Athlete Name',
      'Availability',
      'Open Injuries',
      'Last Coaches Note',
      'Position',
      'Squads',
      'Unavalable since',
    ];
    expect(checkboxes1).toHaveLength(expectedCheckboxNames.length);
    expectedCheckboxNames.forEach((name) => {
      expect(
        within(lists[0]).getByRole('checkbox', { name })
      ).toBeInTheDocument();
    });

    // Settings checkboxes
    const expectedSettingsCheckboxNames = [
      'Exclude players with no notes',
      'Only include most recent injury',
    ];
    const checkboxes2 = within(lists[1]).getAllByRole('checkbox');
    expect(checkboxes2).toHaveLength(expectedSettingsCheckboxNames.length);

    expectedSettingsCheckboxNames.forEach((name) => {
      expect(
        within(lists[1]).getByRole('checkbox', { name })
      ).toBeInTheDocument();
    });

    const excludePlayersWithNoNotesCheckbox = screen.getByRole('checkbox', {
      name: 'Exclude players with no notes',
    });
    expect(excludePlayersWithNoNotesCheckbox).not.toBeChecked();

    const onlyIncludeMostRecentInjuryCheckbox = screen.getByRole('checkbox', {
      name: 'Only include most recent injury',
    });
    expect(onlyIncludeMostRecentInjuryCheckbox).not.toBeChecked();
  });

  it('displays correct options in sidepanel when coaches-report-v2 OFF', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });
    const title = screen.getByTestId('sliding-panel|title');
    expect(title).toHaveTextContent('Coaches Report');

    expect(screen.getByLabelText('Grouping')).toBeInTheDocument();

    expect(screen.getByLabelText('Sorting')).toBeInTheDocument();

    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(2); // Main & Settings

    // Main checkboxes
    const checkboxes1 = within(lists[0]).getAllByRole('checkbox');
    const expectedCheckboxNames = [
      'Player Name',
      'Issue Name',
      'Onset Date',
      'Player ID',
      'Jersey Number',
      'Position',
      'Pathology',
      'Body Part',
      'Side',
      'Comment',
      'Injury Status',
      'Latest Note',
    ];
    expect(checkboxes1).toHaveLength(expectedCheckboxNames.length);
    expectedCheckboxNames.forEach((name) => {
      expect(
        within(lists[0]).getByRole('checkbox', { name })
      ).toBeInTheDocument();
    });

    expect(
      within(lists[0]).getByRole('checkbox', { name: 'Player Name' })
    ).toHaveAttribute('aria-disabled', 'true');

    expect(
      within(lists[0]).getByRole('checkbox', { name: 'Player Name' })
    ).toBeChecked();

    expect(
      within(lists[0]).getByRole('checkbox', { name: 'Issue Name' })
    ).toBeEnabled();
    expect(
      within(lists[0]).getByRole('checkbox', { name: 'Issue Name' })
    ).not.toHaveAttribute('aria-disabled', 'true');

    expect(
      within(lists[0]).getByRole('checkbox', { name: 'Onset Date' })
    ).toBeEnabled();
    expect(
      within(lists[0]).getByRole('checkbox', { name: 'Onset Date' })
    ).not.toHaveAttribute('aria-disabled', 'true');

    // Settings checkboxes
    const expectedSettingsCheckboxNames = [
      'Exclude non-injured players',
      'Only include worst injuries',
      'Row styling',
      'Download CSV',
    ];
    const checkboxes2 = within(lists[1]).getAllByRole('checkbox');
    expect(checkboxes2).toHaveLength(expectedSettingsCheckboxNames.length);

    expectedSettingsCheckboxNames.forEach((name) => {
      expect(
        within(lists[1]).getByRole('checkbox', { name })
      ).toBeInTheDocument();
    });

    const downloadCSVCheckbox = screen.getByRole('checkbox', {
      name: 'Download CSV',
    });
    expect(downloadCSVCheckbox).not.toBeChecked();

    const onlyIncludeWorstInjuriesCheckbox = screen.getByRole('checkbox', {
      name: 'Only include worst injuries',
    });
    expect(onlyIncludeWorstInjuriesCheckbox).not.toBeChecked();

    const excludeNonInjuredCheckbox = screen.getByRole('checkbox', {
      name: 'Exclude non-injured players',
    });
    expect(excludeNonInjuredCheckbox).toBeChecked();

    const rowStylingCheckbox = screen.getByRole('checkbox', {
      name: 'Row styling',
    });
    expect(rowStylingCheckbox).toBeChecked();
  });

  it('calls the closeSettings callback on cancel button', async () => {
    const { user } = renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });

    const closeButton = screen.getAllByRole('button')[0];
    await user.click(closeButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings callback on close sidepanel', async () => {
    const { user } = renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings and printReport callback on download', async () => {
    const { user } = renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });

    const downloadCSVCheckbox = screen.getByRole('checkbox', {
      name: 'Download CSV',
    });
    expect(downloadCSVCheckbox).not.toBeChecked();

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await user.click(downloadButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onPrintReportSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings callback on download when CSV selected coaches-report-v2 ON', async () => {
    window.featureFlags = { 'coaches-report-v2': true };

    const { user } = renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });

    const exportTypeRadioButtonContainer = screen.getByTestId(
      'coachesReportV2ExportControls'
    );
    expect(
      within(exportTypeRadioButtonContainer).getByText('Export as')
    ).toBeInTheDocument();

    // Radio labels
    expect(
      within(exportTypeRadioButtonContainer).getAllByRole('radio')[0].parentNode
        .parentNode
    ).toHaveTextContent('CSV');

    await user.click(
      within(exportTypeRadioButtonContainer).getAllByRole('radio')[0].parentNode
    );

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await user.click(downloadButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings callback on download when PDF selected coaches-report-v2 ON', async () => {
    window.featureFlags = { 'coaches-report-v2': true };

    const { user } = renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });

    const exportTypeRadioButtonContainer = screen.getByTestId(
      'coachesReportV2ExportControls'
    );
    expect(
      within(exportTypeRadioButtonContainer).getByText('Export as')
    ).toBeInTheDocument();

    // Radio labels
    expect(
      within(exportTypeRadioButtonContainer).getAllByRole('radio')[1].parentNode
        .parentNode
    ).toHaveTextContent('PDF');

    await user.click(
      within(exportTypeRadioButtonContainer).getAllByRole('radio')[1].parentNode
    );

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await user.click(downloadButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings and onDownloadCSVSuccess callback on download when CSV selected and coaches-report-v2 OFF', async () => {
    const { user } = renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Coaches Report')).toBeInTheDocument();
    });

    const downloadCSVCheckbox = screen.getByRole('checkbox', {
      name: 'Download CSV',
    });
    expect(downloadCSVCheckbox).not.toBeChecked();
    await user.click(downloadCSVCheckbox);
    expect(downloadCSVCheckbox).toBeChecked();

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await user.click(downloadButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onDownloadCSVSuccessSpy).toHaveBeenCalledTimes(1);
  });
});
