import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import {
  renderWithProvider,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import store from '../../../redux/store';
import ReportsTab from '..';

// DelayedLoadingFeedback is mocked because it contains
// a timeout that complicates testing this component

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('<ReportsTab />', () => {
  const mockedPermissionsContextValue = {
    permissions: {
      medical: {
        ...defaultMedicalPermissions,
        issues: {
          canExport: true,
        },
      },
    },
    permissionsRequestStatus: 'SUCCESS',
  };

  const props = {
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    window.featureFlags['export-page'] = true;
  });

  afterEach(() => {
    window.featureFlags['export-page'] = false;
  });

  it('displays the correct title and roster select options', async () => {
    renderWithProvider(<ReportsTab {...props} />, store);

    // Wait till the header is shown
    const header = await screen.findByRole('banner');

    // Display the title properly
    expect(screen.getByText('Reports')).toBeInTheDocument();

    await waitFor(() => {
      // Display the select options
      selectEvent.openMenu(header.querySelector('.kitmanReactSelect input'));
      expect(screen.getByText('International Squad')).toBeInTheDocument();
      expect(screen.getByText('Academy Squad')).toBeInTheDocument();
    });
  });

  it('displays the success feedback when exporting the quality reports', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the first report action is shown
    const firstReportsAction = await screen.findByRole('button', {
      name: 'Exposure Quality Check',
    });

    // Click the first report action
    await userEvent.click(firstReportsAction);

    // Wait the success feedback is shown
    const successFeedback = await screen.findByText('Export successful');
    expect(successFeedback.parentNode.querySelector('p')).toHaveTextContent(
      'You can find the download link here:'
    );
    const exportLink = successFeedback.parentNode.querySelector('a');
    expect(exportLink).toHaveTextContent('Exports');
    expect(exportLink).toHaveAttribute('href', '/settings/exports');
  });

  it('displays the error feedback when exporting the quality reports and the request fails', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Stub the request to simulate a failing request
    server.use(
      rest.post('/export_jobs/exposure_quality_check', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the first report action is shown
    const firstReportsAction = await screen.findByRole('button', {
      name: 'Exposure Quality Check',
    });

    // Click the first report action
    await userEvent.click(firstReportsAction);

    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
    });
  });

  it('displays the success feedback when exporting the diagnostics records', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the second report action is shown
    const secondReportsAction = await screen.findByRole('button', {
      name: 'Diagnostic Records',
    });

    // Click the second report action
    await userEvent.click(secondReportsAction);

    // Wait the success feedback is shown
    const successFeedback = await screen.findByText('Export successful');
    expect(successFeedback.parentNode.querySelector('p')).toHaveTextContent(
      'You can find the download link here:'
    );
    const exportLink = successFeedback.parentNode.querySelector('a');
    expect(exportLink).toHaveTextContent('Exports');
    expect(exportLink).toHaveAttribute('href', '/settings/exports');
  });

  it('displays the error feedback when exporting the diagnostics records and the request fails', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Stub the request to simulate a failing request
    server.use(
      rest.post('/export_jobs/diagnostics_report', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the second report action is shown
    const secondReportsAction = await screen.findByRole('button', {
      name: 'Diagnostic Records',
    });

    // Click the second report action
    await userEvent.click(secondReportsAction);

    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
    });
  });

  it('displays the success feedback when exporting the medication records', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the third report action is shown
    const thirdReportsAction = await screen.findByRole('button', {
      name: 'Medication Records',
    });

    // Click the third report action
    await userEvent.click(thirdReportsAction);

    // Wait the success feedback is shown
    const successFeedback = await screen.findByText('Export successful');
    expect(successFeedback.parentNode.querySelector('p')).toHaveTextContent(
      'You can find the download link here:'
    );
    const exportLink = successFeedback.parentNode.querySelector('a');
    expect(exportLink).toHaveTextContent('Exports');
    expect(exportLink).toHaveAttribute('href', '/settings/exports');
  });

  it('displays the error feedback when exporting the medication records and the request fails', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Stub the request to simulate a failing request
    server.use(
      rest.post('/export_jobs/medication_records', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the third report action is shown
    const thirdReportsAction = await screen.findByRole('button', {
      name: 'Medication Records',
    });

    // Click the third report action
    await userEvent.click(thirdReportsAction);

    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
    });
  });

  it('displays the success feedback when exporting the null data report', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the fourth report action is shown
    const fourthReportsAction = await screen.findByRole('button', {
      name: 'Null Data & Logic Check Report',
    });

    // Click the fourth report action
    await userEvent.click(fourthReportsAction);

    // Wait the success feedback is shown
    const successFeedback = await screen.findByText('Export successful');
    expect(successFeedback.parentNode.querySelector('p')).toHaveTextContent(
      'You can find the download link here:'
    );
    const exportLink = successFeedback.parentNode.querySelector('a');
    expect(exportLink).toHaveTextContent('Exports');
    expect(exportLink).toHaveAttribute('href', '/settings/exports');
  });

  it('displays the error feedback when exporting the null data report and the request fails', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Stub the request to simulate a failing request
    server.use(
      rest.post('/export_jobs/null_data_report', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the fourth report action is shown
    const fourthReportsAction = await screen.findByRole('button', {
      name: 'Null Data & Logic Check Report',
    });

    // Click the fourth report action
    await userEvent.click(fourthReportsAction);

    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
    });
  });

  it('displays the success feedback when exporting the HAP authorization status', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the fifth report action is shown
    const fifthReportsAction = await screen.findByRole('button', {
      name: 'HAP Authorization Status',
    });

    // Click the fifth report action
    await userEvent.click(fifthReportsAction);

    // Wait the success feedback is shown
    const successFeedback = await screen.findByText('Export successful');
    expect(successFeedback.parentNode.querySelector('p')).toHaveTextContent(
      'You can find the download link here:'
    );
    const exportLink = successFeedback.parentNode.querySelector('a');
    expect(exportLink).toHaveTextContent('Exports');
    expect(exportLink).toHaveAttribute('href', '/settings/exports');
  });

  it('displays the error feedback when exporting the HAP authorization status and the request fails', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Stub the request to simulate a failing request
    server.use(
      rest.post('/export_jobs/hap_authorization_status', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the fifth report action is shown
    const fifthReportsAction = await screen.findByRole('button', {
      name: 'HAP Authorization Status',
    });

    // Click the fifth report action
    await userEvent.click(fifthReportsAction);

    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
    });
  });

  it('displays the success feedback when exporting the Concussion Baseline Audit', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the sixth report action is shown
    const sixthReportsAction = await screen.findByRole('button', {
      name: 'Concussion Baseline Audit',
    });

    // Click the sixth report action
    await userEvent.click(sixthReportsAction);

    // Wait the success feedback is shown
    const successFeedback = await screen.findByText('Export successful');
    expect(successFeedback.parentNode.querySelector('p')).toHaveTextContent(
      'You can find the download link here:'
    );
    const exportLink = successFeedback.parentNode.querySelector('a');
    expect(exportLink).toHaveTextContent('Exports');
    expect(exportLink).toHaveAttribute('href', '/settings/exports');
  });

  it('displays the error feedback when exporting the Concussion Baseline Audit and the request fails', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Stub the request to simulate a failing request
    server.use(
      rest.post('/export_jobs/concussion_baseline_audit', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the sixth report action is shown
    const sixthReportsAction = await screen.findByRole('button', {
      name: 'Concussion Baseline Audit',
    });

    // Click the sixth report action
    await userEvent.click(sixthReportsAction);

    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
    });
  });

  it('displays the success feedback when exporting the HAP Participant Exposure', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the seventh report action is shown
    const seventhReportsAction = await screen.findByRole('button', {
      name: 'HAP Participant Exposure',
    });

    // Click the seventh report action
    await userEvent.click(seventhReportsAction);

    // Wait the success feedback is shown
    const successFeedback = await screen.findByText('Export successful');
    expect(successFeedback.parentNode.querySelector('p')).toHaveTextContent(
      'You can find the download link here:'
    );
    const exportLink = successFeedback.parentNode.querySelector('a');
    expect(exportLink).toHaveTextContent('Exports');
    expect(exportLink).toHaveAttribute('href', '/settings/exports');
  });

  it('displays the error feedback when exporting the HAP Participant Exposure and the request fails', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Stub the request to simulate a failing request
    server.use(
      rest.post('/export_jobs/participant_exposure', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the seventh report action is shown
    const seventhReportsAction = await screen.findByRole('button', {
      name: 'HAP Participant Exposure',
    });

    // Click the seventh report action
    await userEvent.click(seventhReportsAction);

    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
    });
  });

  it('displays the success feedback when exporting the HAP Covid Branch', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the eighth report action is shown
    const eighthReportsAction = await screen.findByRole('button', {
      name: 'HAP Covid Branch',
    });

    // Click the eighth report action
    await userEvent.click(eighthReportsAction);

    // Wait the success feedback is shown
    const successFeedback = await screen.findByText('Export successful');
    expect(successFeedback.parentNode.querySelector('p')).toHaveTextContent(
      'You can find the download link here:'
    );
    const exportLink = successFeedback.parentNode.querySelector('a');
    expect(exportLink).toHaveTextContent('Exports');
    expect(exportLink).toHaveAttribute('href', '/settings/exports');
  });

  it('displays the error feedback when exporting the HAP Covid Branch and the request fails', async () => {
    renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <ReportsTab {...props} />
      </MockedPermissionContextProvider>,
      store
    );

    // Wait till the header is shown
    await screen.findByRole('banner');

    // Stub the request to simulate a failing request
    server.use(
      rest.post('/export_jobs/hap_covid_branch', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    // Click Quality Reports button to display the reports actions
    await userEvent.click(
      screen.getByRole('button', { name: 'Quality Reports' })
    );

    // Wait till the eighth report action is shown
    const eighthReportsAction = await screen.findByRole('button', {
      name: 'HAP Covid Branch',
    });

    // Click the eighth report action
    await userEvent.click(eighthReportsAction);

    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
    });
  });
});
