import { screen, render } from '@testing-library/react';
import * as Redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {
  useSaveSingleAthleteConsentMutation,
  useUpdateSingleAthleteConsentMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { CONSENT_STATUS } from '@kitman/common/src/types/Consent';
import ActionsCell from '@kitman/modules/src/ConditionalFields/shared/components/Cells/ActionsCell';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);
jest.mock('@kitman/common/src/hooks/useEventTracking');

const mockDispatch = jest.fn();

const props = {
  athleteId: 1,
  consentStatus: CONSENT_STATUS.Consented,
  t: i18nextTranslateStub(),
};
describe('<ActionsCell />', () => {
  beforeEach(() => {
    useSaveSingleAthleteConsentMutation.mockReturnValue([{}, {}]);
    useUpdateSingleAthleteConsentMutation.mockReturnValue([{}, {}]);
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
    jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);
  });
  it('Should render', () => {
    render(<ActionsCell {...props} />);
    expect(screen.getByTestId('MoreVertIcon')).toBeInTheDocument();
  });
  it('Should open the popover when clicked', async () => {
    const user = userEvent.setup();
    render(<ActionsCell {...props} />);
    const IconButton = screen.getByTestId('MoreVertIcon');
    await user.click(IconButton);
    expect(screen.getByText('New consent range')).toBeInTheDocument();
  });
  it('Should open the calendar when New consent range is clicked', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ActionsCell {...props} />
      </LocalizationProvider>
    );
    const IconButton = screen.getByTestId('MoreVertIcon');
    await user.click(IconButton);
    expect(screen.getByText('New consent range')).toBeInTheDocument();

    await user.click(screen.getByText('New consent range'));
    expect(screen.getByText('Select date range')).toBeInTheDocument();
  });
  it('Should contain Revoke action when status is Consented', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ActionsCell {...props} />
      </LocalizationProvider>
    );
    const IconButton = screen.getByTestId('MoreVertIcon');
    await user.click(IconButton);
    expect(screen.queryByText('Revoke')).toBeInTheDocument();
  });
  it('Should not contain Revoke action when status is not Consented', async () => {
    const user = userEvent.setup();
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ActionsCell {...props} consentStatus={CONSENT_STATUS.NotConsented} />
      </LocalizationProvider>
    );
    const IconButton = screen.getByTestId('MoreVertIcon');
    await user.click(IconButton);
    expect(screen.queryByText('Revoke')).not.toBeInTheDocument();
  });
});
