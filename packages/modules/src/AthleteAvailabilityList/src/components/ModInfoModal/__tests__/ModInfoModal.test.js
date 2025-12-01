import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import ModInfoModal from '../index';

jest.mock('../../../containers/AppStatus', () => {
  return jest.fn(() => null);
});

jest.mock('@kitman/components', () => {
  const actualMoment = jest.requireActual('moment');

  return {
    LegacyModal: jest.fn((props) => (
      <div data-testid="mock-modal" {...props}>
        {props.title && <h4>{props.title}</h4>}
        {props.children}
        <button type="button" onClick={props.close}>
          Close
        </button>
      </div>
    )),
    Textarea: jest.fn((props) => (
      <textarea
        data-testid="mock-textarea"
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        aria-label={props.label}
      />
    )),
    TextButton: jest.fn((props) => (
      <button
        data-testid="mock-textbutton"
        onClick={props.onClick}
        type="button"
      >
        {props.text}
      </button>
    )),
    DatePicker: jest.fn((props) => (
      <input
        data-testid="mock-datepicker-input"
        onChange={(e) =>
          props.onDateChange(actualMoment(e.target.value).toDate())
        }
        value={
          props.value ? actualMoment(props.value).format('YYYY-MM-DD') : ''
        }
        aria-label={props.label}
      />
    )),
    FormValidator: jest.fn((props) => (
      <form
        data-testid="mock-form"
        onSubmit={(e) => {
          e.preventDefault();
          props.successAction();
        }}
      >
        {props.children}
      </form>
    )),
  };
});

setI18n(i18n);

describe('ModInfoModal', () => {
  let user;
  const mockCloseModal = jest.fn();
  const mockUpdateModInfoText = jest.fn();
  const mockUpdateModInfoRtp = jest.fn();
  const mockSaveModInfo = jest.fn();

  const defaultProps = {
    isOpen: true,
    athleteId: 'athlete-123',
    closeModal: mockCloseModal,
    modInfoData: {
      info: '',
      rtp: '',
    },
    updateModInfoText: mockUpdateModInfoText,
    updateModInfoRtp: mockUpdateModInfoRtp,
    saveModInfo: mockSaveModInfo,
    t: (key) => key,
  };

  beforeEach(() => {
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-15T18:00:00Z'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderComponent = (props = {}) => {
    return renderWithRedux(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <ModInfoModal {...defaultProps} {...props} />
      </LocalizationProvider>
    );
  };

  it('renders the component when open', () => {
    renderComponent();
    expect(screen.getByText('Change Modification/Info')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Modifications/Info' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'RTP Date' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls the correct callback when the mod/info text is changed', async () => {
    renderComponent();
    const textarea = screen.getByRole('textbox', {
      name: 'Modifications/Info',
    });
    fireEvent.change(textarea, { target: { value: 'A new text.' } });
    expect(mockUpdateModInfoText).toHaveBeenCalledWith('A new text.');
  });

  it('calls the correct callback when the rtp date is changed', async () => {
    renderComponent();
    const dateInput = screen.getByTestId('mock-datepicker-input');
    const testDate = moment('2019-04-15').toDate();

    fireEvent.change(dateInput, { target: { value: '2019-04-15' } });

    expect(mockUpdateModInfoRtp).toHaveBeenCalledWith(testDate);
  });

  it('calls saveModInfo and closeModal when the save button is clicked', async () => {
    renderComponent({
      modInfoData: { info: 'Some info', rtp: moment('2025-06-10').toDate() },
    });
    const form = screen.getByTestId('mock-form');
    fireEvent.submit(form);

    expect(mockSaveModInfo).toHaveBeenCalledWith(
      defaultProps.athleteId,
      expect.objectContaining({
        info: 'Some info',
        rtp: expect.any(Date),
      })
    );
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('calls closeModal when the cancel button is clicked', async () => {
    renderComponent();
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);
    expect(mockCloseModal).toHaveBeenCalledWith(null, defaultProps.isOpen);
  });
});
