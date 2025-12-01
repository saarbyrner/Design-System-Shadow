import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import DateSelection from '@kitman/modules/src/ConditionalFields/shared/components/DateSelection';

const props = {
  onDateSelection: jest.fn(),
  t: i18nextTranslateStub(),
  onSave: jest.fn(),
  onCancel: jest.fn(),
  date: [null, null],
  isDateRange: true,
  children: <span>New Consent range</span>,
};
describe('<DateSelection />', () => {
  it('Modal opens on Button click', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateSelection {...props} />
      </LocalizationProvider>
    );
    const button = screen.getByText('New Consent range');
    await user.click(button);
    const modalContent = screen.getByText('Select date range');
    expect(modalContent).toBeInTheDocument();
  });

  it('Modal closes on Modal cancel button click', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateSelection {...props} />
      </LocalizationProvider>
    );
    const button = screen.getByText('New Consent range');
    await user.click(button);
    const modalCloseButton = screen.getByText('Cancel');
    await user.click(modalCloseButton);
    const modalContent = screen.queryByText('Select date range');
    expect(modalContent).not.toBeInTheDocument();
  });

  it('Revoke button is displayed when isDateRange is not defined or false', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateSelection {...props} isDateRange={false} date={null} />
      </LocalizationProvider>
    );
    const button = screen.getByText('New Consent range');
    await user.click(button);
    const revokeButton = screen.queryByText('Revoke');
    expect(revokeButton).toBeInTheDocument();
  });

  it('Display Revoke text on trigger button when children is defined with Revoke text', async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateSelection {...props} isDateRange={false} date={null}>
          <span>Revoke</span>
        </DateSelection>
      </LocalizationProvider>
    );
    const revokeAction = screen.getByText('Revoke');
    expect(revokeAction).toBeInTheDocument();
  });

  it('Date calendar is displayed when isDateRange is not defined or false', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateSelection {...props} isDateRange={false} date={null}>
          <span>Revoke</span>
        </DateSelection>
      </LocalizationProvider>
    );
    const button = screen.getByText('Revoke');
    await user.click(button);
    const modalContent = screen.getByText('Select date');
    expect(modalContent).toBeInTheDocument();
  });

  it('Revoke button is disabled when date is not selected', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateSelection {...props} isDateRange={false} date={null} />
      </LocalizationProvider>
    );
    const button = screen.getByText('New Consent range');
    await user.click(button);
    const revokeButton = screen.queryByText('Revoke');
    expect(revokeButton).toBeDisabled();
  });

  it('Save button is disabled when date range is not selected', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateSelection {...props} date={[null, null]} />
      </LocalizationProvider>
    );
    const button = screen.getByText('New Consent range');
    await user.click(button);
    const saveButton = screen.queryByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('Save button is not disabled when date range is not selected', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateSelection
          {...props}
          date={[
            moment('2018-05-20T23:59:59+01:00'),
            moment('2018-05-20T23:59:59+01:00'),
          ]}
        />
      </LocalizationProvider>
    );
    const button = screen.getByText('New Consent range');
    await user.click(button);
    const saveButton = screen.queryByText('Save');
    expect(saveButton).toBeEnabled();
  });

  it('On Cancel button click modal is closed', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateSelection {...props} />
      </LocalizationProvider>
    );
    const button = screen.getByText('New Consent range');
    await user.click(button);
    const cancelButton = screen.queryByText('Cancel');
    await user.click(cancelButton);
    const modalContent = screen.queryByText('Select date range');
    expect(modalContent).not.toBeInTheDocument();
  });
});
