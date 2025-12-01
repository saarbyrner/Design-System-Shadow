import { render, screen } from '@testing-library/react';
import ModalContent from '../../components/ModalContent';

jest.mock(
  '@kitman/modules/src/MetricsDashboard/src/containers/AlarmForm',
  () =>
    function AlarmFormMock() {
      return <div data-testid="alarm-form" />;
    }
);

const baseProps = () => ({
  statusId: 'uuid',
  alarms: [
    { alarm_id: '1234', show_on_mobile: false },
    { alarm_id: '12345', show_on_mobile: false },
  ],
  status: {
    localised_unit: 'kg',
    name: 'Game Minutes',
    description: 'Last from today',
    type: 'number',
    summary: 'last',
  },
  closeModal: jest.fn(),
  createNewAlarm: jest.fn(),
  saveAlarmDefinitions: jest.fn(),
  toggleSelectAllForMobile: jest.fn(),
  confirmDeleteAllAlarms: jest.fn(),
  t: (k, opts) =>
    opts && opts.alarmsCount ? `${opts.alarmsCount} Alarms defined` : k,
});

describe('<ModalContent />', () => {
  it('displays the status name', () => {
    render(<ModalContent {...baseProps()} />);
    expect(
      screen.getByText('Game Minutes', {
        selector: 'p.modalContent--alarmEditor__statusName',
      })
    ).toBeInTheDocument();
  });

  it('displays suggested threshold for risk metrics', () => {
    const props = baseProps();
    props.status = { ...props.status, injury_risk_threshold: 34.56 };
    render(<ModalContent {...props} />);
    expect(screen.getByText(/Suggested threshold:/i)).toHaveTextContent(
      '34.56%'
    );
  });

  it('displays status description and unit', () => {
    render(<ModalContent {...baseProps()} />);
    const statusPara = screen.getByText('Game Minutes', {
      selector: 'p.modalContent--alarmEditor__statusName',
    });
    expect(statusPara).toHaveTextContent('(kg)');
    expect(statusPara).toHaveTextContent('Last from today');
  });

  it('calls closeModal on Cancel click', async () => {
    const props = baseProps();
    render(<ModalContent {...props} />);
    await screen.getByRole('button', { name: 'Cancel' }).click();
    expect(props.closeModal).toHaveBeenCalled();
  });

  it('shows disclaimer when multiple alarms', () => {
    render(<ModalContent {...baseProps()} />);
    expect(
      screen.getByText(/Alarms are listed in priority order/i)
    ).toBeInTheDocument();
  });

  it('hides disclaimer when single alarm', () => {
    const props = baseProps();
    props.alarms = [{ alarm_id: '1234', show_on_mobile: false }];
    render(<ModalContent {...props} />);
    expect(
      screen.queryByText(/Alarms are listed in priority order/i)
    ).not.toBeInTheDocument();
  });

  it('hides disclaimer when no alarms', () => {
    const props = baseProps();
    props.alarms = [];
    render(<ModalContent {...props} />);
    expect(
      screen.queryByText(/Alarms are listed in priority order/i)
    ).not.toBeInTheDocument();
  });

  it('shows Select All checkbox when alarms exist', () => {
    render(<ModalContent {...baseProps()} />);
    expect(
      screen.getByText(/Select All "Show On Coach App"/i)
    ).toBeInTheDocument();
  });

  it('hides Select All checkbox when no alarms', () => {
    const props = baseProps();
    props.alarms = [];
    render(<ModalContent {...props} />);
    expect(
      screen.queryByText(/Select All "Show On Coach App"/i)
    ).not.toBeInTheDocument();
  });

  it('select all checkbox partially checked when one alarm mobile enabled', () => {
    const props = baseProps();
    props.alarms = [
      { alarm_id: '1234', show_on_mobile: false },
      { alarm_id: '12345', show_on_mobile: true },
    ];
    render(<ModalContent {...props} />);
    const checkbox = document.querySelector(
      '.modalContent--alarmEditor__selectAllForMobile'
    );
    expect(checkbox.querySelector('div')).toBeInTheDocument();
  });

  it('calls toggleSelectAllForMobile with ids that are already enabled when partially checked clicked', () => {
    const props = baseProps();
    props.alarms = [
      { alarm_id: '1234', show_on_mobile: false },
      { alarm_id: '12345', show_on_mobile: true },
    ];
    render(<ModalContent {...props} />);
    const mc = document.querySelector(
      '.modalContent--alarmEditor__selectAllForMobile div'
    );
    mc.click();
    expect(props.toggleSelectAllForMobile).toHaveBeenCalledWith(['12345']);
  });

  it('select all checkbox empty when all disabled and click passes empty array', () => {
    const props = baseProps();
    props.alarms = [
      { alarm_id: '1234', show_on_mobile: false },
      { alarm_id: '12345', show_on_mobile: false },
    ];
    render(<ModalContent {...props} />);
    const mc = document.querySelector(
      '.modalContent--alarmEditor__selectAllForMobile div'
    );
    mc.click();
    expect(props.toggleSelectAllForMobile).toHaveBeenCalledWith([]);
  });

  it('select all checkbox all checked when all enabled and click passes all ids', () => {
    const props = baseProps();
    props.alarms = [
      { alarm_id: '1234', show_on_mobile: true },
      { alarm_id: '12345', show_on_mobile: true },
    ];
    render(<ModalContent {...props} />);
    const mc = document.querySelector(
      '.modalContent--alarmEditor__selectAllForMobile div'
    );
    mc.click();
    expect(props.toggleSelectAllForMobile).toHaveBeenCalledWith([
      '1234',
      '12345',
    ]);
  });

  it('renders delete all alarms button when alarms exist', () => {
    render(<ModalContent {...baseProps()} />);
    expect(screen.getByText('Delete All Alarms')).toBeInTheDocument();
  });

  it('hides delete all alarms button when no alarms', () => {
    const props = baseProps();
    props.alarms = [];
    render(<ModalContent {...props} />);
    expect(screen.queryByText('Delete All Alarms')).not.toBeInTheDocument();
  });
});
