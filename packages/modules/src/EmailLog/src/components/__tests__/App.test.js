import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axios } from '@kitman/common/src/utils/services';
import { mockEmailLogs } from '@kitman/services/src/services/notifications/searchEmails/mock';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import App from '../App';
import { useSearchEmailsQuery } from '../../redux/rtk/emailsApi';

jest.mock('@kitman/common/src/utils/services');
jest.mock('../../redux/rtk/emailsApi');

const defaultFilters = {
  kind: null,
  date_range: {
    end_date: null,
    start_date: null,
  },
  message_status: null,
  notificationable_id: null,
  notificationable_type: null,
  page: 1,
  per_page: 10,
  recipient: null,
  subject: null,
  version: null,
  trigger_kind: null,
};

describe('App', () => {
  const renderComponent = () => {
    useSearchEmailsQuery.mockReturnValue({
      emails: mockEmailLogs,
      isLoadingEmails: false,
      meta: {
        current_page: 1,
        next_page: null,
        prev_page: null,
        total_count: 3,
        total_pages: 1,
      },
    });

    jest.spyOn(axios, 'post');
    const i18nT = i18nextTranslateStub();
    return render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <App t={i18nT} />
      </LocalizationProvider>
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('opens up the details panel when a row is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    const row = screen.getAllByRole('row')[1];
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    await user.click(row);
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    expect(
      screen.getByText(mockEmailLogs[0].subject, { selector: 'h6' })
    ).toBeInTheDocument();
  });

  it('queries emails by type, date range, and status filters', async () => {
    const user = userEvent.setup();
    renderComponent();
    const typeSelect = screen.getByLabelText('Type', { selector: 'input' });
    await user.click(typeSelect);
    await user.click(screen.getByRole('option', { name: 'DMR' }));
    expect(typeSelect).toHaveValue('DMR');

    const dateRangeSelect = screen.getByLabelText('Sent date range', {
      selector: 'input',
    });
    fireEvent.change(dateRangeSelect, {
      target: { value: '01/01/2024 – 01/02/2024' },
    });
    expect(dateRangeSelect).toHaveValue('01/01/2024 – 01/02/2024');

    const statusSelect = screen.getByLabelText('Status', {
      selector: 'input',
    });
    await user.click(statusSelect);
    await user.click(screen.getByRole('option', { name: 'Failure' }));
    expect(statusSelect).toHaveValue('Failure');

    expect(useSearchEmailsQuery).toHaveBeenCalledWith(
      {
        ...defaultFilters,
        kind: 'dmr',
        date_range: {
          start_date: '2024-01-01T00:00:00+00:00',
          end_date: '2024-01-02T00:00:00+00:00',
        },
        message_status: 'errored',
      },
      expect.objectContaining({
        selectFromResult: expect.any(Function),
      })
    );
  });

  it('waits for 500ms before querying emails by recipient or subject', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderComponent();
    await act(async () => {
      const recipientInput = screen.getByLabelText('Search by recipient', {
        selector: 'input',
      });
      await user.type(recipientInput, 'test@test.com');
      expect(recipientInput).toHaveValue('test@test.com');
      expect(useSearchEmailsQuery).not.toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'test@test.com',
        }),
        expect.any(Object)
      );
      jest.advanceTimersByTime(300);
      expect(useSearchEmailsQuery).not.toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'test@test.com',
        }),
        expect.objectContaining({
          selectFromResult: expect.any(Function),
        })
      );

      jest.advanceTimersByTime(200);
      expect(useSearchEmailsQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'test@test.com',
        }),
        expect.any(Object)
      );
    });
    jest.useRealTimers();
  });
});
