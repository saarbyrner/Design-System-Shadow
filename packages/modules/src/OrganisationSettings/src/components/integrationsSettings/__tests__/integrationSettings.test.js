import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import IntegrationsSettings from '../index';

describe('Organisation Settings <IntegrationSettings /> component', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      activeIntegrations: [],
      fetchActiveIntegrations: jest.fn(),
      fetchAvailableIntegrations: jest.fn(),
      onClickAddIntegration: jest.fn(),
      onClickUnlinkIntegration: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the correct title and calls fetch actions on mount', () => {
    render(<IntegrationsSettings {...baseProps} />);

    expect(
      screen.getByRole('heading', { name: 'Integrations' })
    ).toBeInTheDocument();
    expect(baseProps.fetchActiveIntegrations).toHaveBeenCalledTimes(1);
    expect(baseProps.fetchAvailableIntegrations).toHaveBeenCalledTimes(1);
  });

  it('renders a "No integrations set up" message when there are no active integrations', () => {
    render(<IntegrationsSettings {...baseProps} />);

    expect(screen.getByText('No integrations set up')).toBeInTheDocument();
    // A table should not be present
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('calls onClickAddIntegration when the Add button is clicked', async () => {
    const user = userEvent.setup();

    render(<IntegrationsSettings {...baseProps} />);

    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.click(addButton);

    expect(baseProps.onClickAddIntegration).toHaveBeenCalledTimes(1);
  });

  describe('when there are active integrations', () => {
    const activeIntegrations = [
      {
        id: 1,
        name: 'push',
        expiry_date: '2019-09-23T23:59:59+01:00',
        unlink_url: 'delete/push',
      },
      {
        id: 2,
        name: 'fitbit',
        expiry_date: '2020-10-15T12:00:00+01:00',
        unlink_url: 'delete/fitbit',
      },
    ];

    beforeEach(() => {
      baseProps.activeIntegrations = activeIntegrations;
    });

    it('renders a table with the active integrations', () => {
      render(<IntegrationsSettings {...baseProps} />);

      expect(
        screen.queryByText('No integrations set up')
      ).not.toBeInTheDocument();

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Check for headers
      expect(
        within(table).getByRole('columnheader', { name: 'Name' })
      ).toBeInTheDocument();
      expect(
        within(table).getByRole('columnheader', { name: 'Expiry Date' })
      ).toBeInTheDocument();

      // Check for row content
      const rows = within(table).getAllByRole('row');
      expect(rows).toHaveLength(3); // 1 header + 2 data rows
      expect(within(rows[1]).getByText('push')).toBeInTheDocument();
      expect(within(rows[2]).getByText('fitbit')).toBeInTheDocument();
    });

    it('calls onClickUnlinkIntegration with correct arguments when Unlink is clicked', async () => {
      const user = userEvent.setup();

      render(<IntegrationsSettings {...baseProps} />);
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      const firstRow = rows[1];

      // Find the "Unlink" button/cell in the first data row
      const unlinkButton = within(firstRow).getByRole('cell', {
        name: 'Unlink',
      });

      await user.click(unlinkButton);

      expect(baseProps.onClickUnlinkIntegration).toHaveBeenCalledTimes(1);
      expect(baseProps.onClickUnlinkIntegration).toHaveBeenCalledWith(
        activeIntegrations[0].id,
        activeIntegrations[0].unlink_url
      );
    });
  });
});
