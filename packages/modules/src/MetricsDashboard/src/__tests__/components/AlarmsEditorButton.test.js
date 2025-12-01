import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { AlarmsEditorButton } from '../../components/AlarmsEditorButton';

const baseProps = () => ({
  alarmCount: 0,
  alarmsForStatus: [],
  show: jest.fn(),
  setAlarms: jest.fn(),
  t: i18nextTranslateStub(),
});

describe('<AlarmsEditorButton/>', () => {
  it('renders', () => {
    const props = baseProps();
    render(<AlarmsEditorButton {...props} />);
    expect(screen.getByText('Alarms')).toBeInTheDocument();
  });

  describe('when there are no alarms', () => {
    it('shows base button text', () => {
      const props = baseProps();
      render(<AlarmsEditorButton {...props} />);
      expect(screen.getByText('Alarms')).toBeInTheDocument();
    });
  });

  describe('when there are some alarms', () => {
    it('shows count text', () => {
      const props = { ...baseProps(), alarmCount: 3 };
      render(<AlarmsEditorButton {...props} />);
      expect(screen.getByText('Alarms (3 Alarms defined)')).toBeInTheDocument();
    });
  });

  describe('click behavior', () => {
    it('invokes show and setAlarms with provided alarms', async () => {
      const user = userEvent.setup();
      const alarmsForStatus = [{ id: 'a1' }];
      const props = {
        ...baseProps(),
        alarmCount: 1,
        alarmsForStatus,
      };
      render(<AlarmsEditorButton {...props} />);
      const button = screen.getByText(/Alarms/);
      await user.click(button);
      expect(props.show).toHaveBeenCalledTimes(1);
      expect(props.setAlarms).toHaveBeenCalledWith(alarmsForStatus);
    });
  });
});
