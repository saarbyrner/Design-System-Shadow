import { render, screen } from '@testing-library/react';
import ToggleSwitch from '..';

describe('<ToggleSwitch />', () => {
  it('renderes correctly with default props', () => {
    render(<ToggleSwitch />);

    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('sets as unchecked when is disabled', () => {
    render(<ToggleSwitch isDisabled />);

    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('renders a label if one is passed', () => {
    render(<ToggleSwitch label="test label" />);

    expect(
      screen.getByRole('switch').parentNode.parentNode.querySelector('label')
    ).toHaveClass('toggleSwitch__label');
    expect(
      screen.getByRole('switch').parentNode.parentNode.querySelector('label')
    ).toHaveTextContent('test label');
  });

  it('has the correct class if right is passed in for the labelPlacement prop', () => {
    render(<ToggleSwitch label="test label" labelPlacement="right" />);

    expect(screen.getByRole('switch').parentNode.parentNode).toHaveClass(
      'toggleSwitch--labelRight'
    );
  });
});
