import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import AthleteDemographicReport from '../AthleteDemographicReport';

jest.mock('@kitman/common/src/utils/downloadCSV');

describe('AthleteDemographicReport', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const closeSettingsSpy = jest.fn();
  const printReportSpy = jest.fn();
  const onDownloadCSVSuccessSpy = jest.fn();
  const props = {
    isReportActive: false, // True will display Printable
    isSettingsOpen: true,
    closeSettings: closeSettingsSpy,
    printReport: printReportSpy,
    onDownloadCSVSuccess: onDownloadCSVSuccessSpy,
    squadId: 100,
    reportTitle: 'Emergency Medical Report',
    reportSettingsKey: 'emergency_medical',
    hideOptions: ['date_of_birth'], // Short date of birth is preferred
    sortKeys: { primary: 'lastname', secondary: 'firstname' },
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalApi: {},
  });

  it('displays correct options in sidepanel', async () => {
    render(
      <Provider store={store}>
        <AthleteDemographicReport {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Emergency Medical Report')
      ).toBeInTheDocument();
    });
    const title = screen.getByTestId('sliding-panel|title');
    expect(title).toHaveTextContent('Emergency Medical Report');

    expect(screen.getByLabelText('Squads')).toBeInTheDocument();

    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(2); // Main & Settings

    // Main checkboxes
    const checkboxes1 = within(lists[0]).getAllByRole('checkbox');
    const expectedCheckboxNames = [
      'Player Name',
      'Jersey Number',
      'NFL ID',
      'Position (Full Name)',
      'Position (Abbreviation)',
      'Date of Birth',
      'Height',
      'Weight (lbs)',
      'Weight (kgs)',
      'Allergies',
      'Medical Alerts',
    ];
    expect(checkboxes1).toHaveLength(expectedCheckboxNames.length);
    expectedCheckboxNames.forEach((name) => {
      expect(
        within(lists[0]).getByRole('checkbox', { name })
      ).toBeInTheDocument();
    });

    // Settings checkboxes
    const expectedSettingsCheckboxNames = ['Show Severity', 'Download CSV'];
    const checkboxes2 = within(lists[1]).getAllByRole('checkbox');
    expect(checkboxes2).toHaveLength(expectedSettingsCheckboxNames.length);

    expectedSettingsCheckboxNames.forEach((name) => {
      expect(
        within(lists[1]).getByRole('checkbox', { name })
      ).toBeInTheDocument();
    });
  });

  it('displays squad selector when no squadId', async () => {
    render(
      <Provider store={store}>
        <AthleteDemographicReport {...props} squadId={null} />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Emergency Medical Report')
      ).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
  });

  it('does not display hidden options in sidepanel', async () => {
    render(
      <Provider store={store}>
        <AthleteDemographicReport
          {...props}
          hideOptions={['allergies', 'athlete_medical_alerts']}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Emergency Medical Report')
      ).toBeInTheDocument();
    });
    const title = screen.getByTestId('sliding-panel|title');
    expect(title).toHaveTextContent('Emergency Medical Report');

    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(2); // Main & Settings

    expect(
      within(lists[0]).queryByRole('checkbox', { name: 'Allergies' })
    ).not.toBeInTheDocument();
    expect(
      within(lists[0]).queryByRole('checkbox', { name: 'Medical Alerts' })
    ).not.toBeInTheDocument();
  });

  it('calls the closeSettings callback on cancel button', async () => {
    render(
      <Provider store={store}>
        <AthleteDemographicReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Emergency Medical Report')
      ).toBeInTheDocument();
    });

    const closeButton = screen.getAllByRole('button')[0];
    await userEvent.click(closeButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings callback on close sidepanel', async () => {
    render(
      <Provider store={store}>
        <AthleteDemographicReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Emergency Medical Report')
      ).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings and printReport callback on download', async () => {
    render(
      <Provider store={store}>
        <AthleteDemographicReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Emergency Medical Report')
      ).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await userEvent.click(downloadButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(printReportSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the onDownloadCSVSuccess and printReport callback on csv download', async () => {
    render(
      <Provider store={store}>
        <AthleteDemographicReport {...props} />
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText('Emergency Medical Report')
      ).toBeInTheDocument();
    });
    const downloadCSVCheckbox = screen.getByRole('checkbox', {
      name: 'Download CSV',
    });
    expect(downloadCSVCheckbox).not.toBeChecked();
    await userEvent.click(downloadCSVCheckbox);
    expect(downloadCSVCheckbox).toBeChecked();

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    await userEvent.click(downloadButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onDownloadCSVSuccessSpy).toHaveBeenCalledTimes(1);
  });
});
