import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { AlarmsEditor } from '../../components/AlarmsEditor';

let capturedModalProps;
let capturedAppStatusProps;
let capturedModalContentProps;

jest.mock('@kitman/components', () => ({
  // Minimal Modal mock
  LegacyModal: (props) => {
    capturedModalProps = props;
    return <div data-testid="modal">{props.children}</div>;
  },
  AppStatus: (props) => {
    capturedAppStatusProps = props;
    return (
      <div data-testid="app-status">
        <span>{props.message}</span>
      </div>
    );
  },
}));

jest.mock('../../components/ModalContent', () => ({
  ModalContentTranslated: (props) => {
    capturedModalContentProps = props;
    return (
      <div data-testid="modal-content">
        <h5>Alarms</h5>
        <p>{props.status.name}</p>
      </div>
    );
  },
}));

const baseProps = () => ({
  statusId: 'uuid',
  alarms: [
    { alarm_id: 'a1', statusId: '1234' },
    { alarm_id: 'a2', statusId: '12345' },
  ],
  status: {
    localised_unit: 'kg',
    name: 'Game Minutes',
    description: 'Last from today',
  },
  createNewAlarm: jest.fn(),
  saveAlarmDefinitions: jest.fn(),
  modalIsOpen: true,
  modalStatus: null,
  modalMessage: 'message',
  closeModal: jest.fn(),
  confirmCloseModal: jest.fn(),
  toggleSelectAllForMobile: jest.fn(),
  cancelCloseModal: jest.fn(),
  confirmActionId: 'hideModal',
  deleteAllAlarms: jest.fn(),
  confirmDeleteAllAlarms: jest.fn(),
  t: i18nextTranslateStub(),
});

beforeEach(() => {
  capturedModalProps = undefined;
  capturedAppStatusProps = undefined;
  capturedModalContentProps = undefined;
});

describe('<AlarmsEditor/>', () => {
  it('renders modal when open', () => {
    const props = baseProps();
    render(<AlarmsEditor {...props} />);
    expect(screen.getByText('Game Minutes')).toBeInTheDocument();
    expect(screen.getByText('Alarms')).toBeInTheDocument();
    expect(capturedModalProps.isOpen).toBe(true);
    expect(capturedModalProps.close).toBe(props.confirmCloseModal);
  });

  it('passes correct props to ModalContent', () => {
    const props = baseProps();
    render(<AlarmsEditor {...props} />);
    expect(capturedModalContentProps.statusId).toBe(props.statusId);
    expect(capturedModalContentProps.alarms).toBe(props.alarms);
    expect(capturedModalContentProps.status).toBe(props.status);
    expect(capturedModalContentProps.createNewAlarm).toBe(props.createNewAlarm);
    expect(capturedModalContentProps.saveAlarmDefinitions).toBe(
      props.saveAlarmDefinitions
    );
    expect(capturedModalContentProps.toggleSelectAllForMobile).toBe(
      props.toggleSelectAllForMobile
    );
    expect(capturedModalContentProps.closeModal).toBe(props.closeModal);
  });

  it('passes correct props to AppStatus (hideModal confirmAction)', () => {
    const props = baseProps();
    render(<AlarmsEditor {...props} />);
    expect(capturedAppStatusProps.status).toBe(props.modalStatus);
    expect(capturedAppStatusProps.message).toBe(props.modalMessage);
    expect(capturedAppStatusProps.hideConfirmation).toBe(
      props.cancelCloseModal
    );
    expect(capturedAppStatusProps.confirmAction).toBe(props.closeModal);
    expect(capturedAppStatusProps.close).toBe(props.closeModal);
  });

  it('uses deleteAllAlarms as confirmAction when confirmActionId="deleteAllAlarms"', () => {
    const props = { ...baseProps(), confirmActionId: 'deleteAllAlarms' };
    render(<AlarmsEditor {...props} />);
    expect(capturedAppStatusProps.confirmAction).toBe(props.deleteAllAlarms);
  });
});
