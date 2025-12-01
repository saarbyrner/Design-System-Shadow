import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockEmailLogs } from '@kitman/services/src/services/notifications/searchEmails/mock';
import EmailDataGrid from '../EmailDataGrid';
import { columns } from '../../grid/config';

const i18nT = i18nextTranslateStub();
describe('EmailDataGrid', () => {
  const renderComponent = ({
    emails = [],
    isLoading = false,
    meta = {},
    setPage = jest.fn(),
    onRowClick = jest.fn(),
  } = {}) => {
    return render(
      <EmailDataGrid
        t={i18nT}
        emails={emails}
        isLoading={isLoading}
        meta={meta}
        setPage={setPage}
        onRowClick={onRowClick}
      />
    );
  };

  it('renders the grid headers correctly', () => {
    renderComponent();
    columns.forEach((column) => {
      expect(
        screen.getByRole('columnheader', { name: column.headerName })
      ).toBeInTheDocument();
    });
  });

  it('renders the row data correctly', () => {
    renderComponent({ emails: mockEmailLogs });
    mockEmailLogs.forEach((email, index) => {
      const row = screen.getAllByRole('row')[index + 1]; // skips the header row
      const withinRow = within(row);
      expect(withinRow.getByText(email.subject)).toBeInTheDocument();

      expect(withinRow.getByText(email.trigger_kind)).toBeInTheDocument();
      expect(
        withinRow.getByText(
          email.message_status === 'errored' ? 'Failure' : 'Sent'
        )
      ).toBeInTheDocument();
      expect(withinRow.getByText(email.kind)).toBeInTheDocument();
      expect(withinRow.getByText(email.recipient)).toBeInTheDocument();
    });
  });

  it('renders the number of rows correctly', () => {
    renderComponent({ emails: mockEmailLogs });
    expect(screen.getAllByRole('row')).toHaveLength(mockEmailLogs.length + 1); // +1 for the header row
  });

  it('renders the "No emails found" message when there are no emails', () => {
    renderComponent({ emails: [] });
    expect(screen.getByText('No emails found')).toBeInTheDocument();
  });

  it('does not render the "No emails found" message when there are emails', () => {
    renderComponent({ emails: mockEmailLogs });
    expect(screen.queryByText('No emails found')).not.toBeInTheDocument();
  });

  it('renders the pagination controls if total count is greater than 0', () => {
    renderComponent({ meta: { total_count: 10 } });
    expect(screen.getByLabelText(/pagination/i)).toBeInTheDocument();
  });

  it('does not render the pagination controls if total count is 0', () => {
    renderComponent({ meta: { total_count: 0 } });
    expect(screen.queryByLabelText(/pagination/i)).not.toBeInTheDocument();
  });

  it('renders the "N/A" value when the value is null', () => {
    const [firstEmail, ...restEmails] = mockEmailLogs;
    renderComponent({ emails: [{ ...firstEmail, kind: null }, ...restEmails] });
    const row = screen.getAllByRole('row')[1];
    const withinRow = within(row);
    expect(withinRow.getByText('N/A')).toBeInTheDocument();
  });

  it('calls the onRowClick prop when a row is clicked', async () => {
    const user = userEvent.setup();
    const onRowClick = jest.fn();
    renderComponent({
      emails: mockEmailLogs,
      onRowClick,
    });
    const row = screen.getAllByRole('row')[1];
    await user.click(row);
    expect(onRowClick).toHaveBeenCalledWith(mockEmailLogs[0]);
  });
});
