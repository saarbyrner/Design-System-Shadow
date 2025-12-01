import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AcuteChronicSettings } from '../AcuteChronicSettings';

jest.mock('react-i18next', () => ({
  withNamespaces: () => (Comp) => (p) => <Comp t={(k) => k} {...p} />,
}));
jest.mock('@kitman/components', () => ({
  Checkbox: ({ id, label, isChecked, toggle }) => (
    <label>
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={(e) => toggle({ checked: e.target.checked })}
      />
      {label}
    </label>
  ),
}));

describe('AcuteChronicSettings', () => {
  const baseProps = () => ({
    onSettingsChange: jest.fn(),
    settings: { summary: { ratio: true, acute: false, chronic: false } },
    t: (k) => k,
  });

  it('renders with three checkboxes and correct initial state', () => {
    render(<AcuteChronicSettings {...baseProps()} />);
    const ratio = screen.getByLabelText('Ratio');
    const acute = screen.getByLabelText('Acute');
    const chronic = screen.getByLabelText('Chronic');
    expect(ratio).toBeInTheDocument();
    expect(acute).toBeInTheDocument();
    expect(chronic).toBeInTheDocument();
    expect(ratio).toBeChecked();
    expect(acute).not.toBeChecked();
    expect(chronic).not.toBeChecked();
  });

  it('updates checkboxes when settings change', () => {
    const { rerender } = render(<AcuteChronicSettings {...baseProps()} />);
    expect(screen.getByLabelText('Ratio')).toBeChecked();
    expect(screen.getByLabelText('Acute')).not.toBeChecked();
    expect(screen.getByLabelText('Chronic')).not.toBeChecked();
    const updated = baseProps();
    updated.settings = {
      summary: { ratio: true, acute: false, chronic: true },
    };
    rerender(<AcuteChronicSettings {...updated} />);
    expect(screen.getByLabelText('Ratio')).toBeChecked();
    expect(screen.getByLabelText('Acute')).not.toBeChecked();
    expect(screen.getByLabelText('Chronic')).toBeChecked();
  });

  it('calls onSettingsChange when checkboxes change', async () => {
    const props = baseProps();
    render(<AcuteChronicSettings {...props} />);
    const chronic = screen.getByLabelText('Chronic');
    await userEvent.click(chronic);
    expect(props.onSettingsChange).toHaveBeenCalledTimes(1);
    expect(props.onSettingsChange).toHaveBeenCalledWith({
      summary: { ratio: true, acute: false, chronic: true },
    });
  });

  it('will not call onSettingsChange when attempting to uncheck last checked', async () => {
    const props = baseProps();
    render(<AcuteChronicSettings {...props} />);
    const ratio = screen.getByLabelText('Ratio');
    await userEvent.click(ratio); // attempt to uncheck sole true checkbox
    expect(props.onSettingsChange).not.toHaveBeenCalled();
    expect(ratio).toBeChecked();
  });
});
