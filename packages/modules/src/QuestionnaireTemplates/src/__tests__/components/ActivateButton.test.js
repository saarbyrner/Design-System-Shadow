import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivateButton from '../../components/ActivateButton';

describe('Questionnaire Templates <ActivateButton /> component', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders the button correctly', () => {
    render(<ActivateButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays the correct class for the active state', () => {
    render(<ActivateButton isActive />);

    const button = screen.getByRole('button');

    // Check for the specific class associated with the active icon
    expect(button).toHaveClass('icon-tick-active');
  });

  it('displays the correct class for the inactive state', () => {
    render(<ActivateButton isActive={false} />);

    const button = screen.getByRole('button');

    // Check for the specific class associated with the inactive icon
    expect(button).toHaveClass('icon-tick');
  });

  it('calls the toggleActive callback when clicked', async () => {
    const toggleActiveMock = jest.fn();

    render(<ActivateButton toggleActive={toggleActiveMock} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(toggleActiveMock).toHaveBeenCalledTimes(1);
  });

  it('is visually disabled and does not call the callback when the disabled prop is true', async () => {
    const toggleActiveMock = jest.fn();

    render(<ActivateButton disabled toggleActive={toggleActiveMock} />);

    const button = screen.getByRole('button');

    // Check that the button has the disabled class.
    // Note: The component does not use the native `disabled` attribute.
    expect(button).toHaveClass(
      'questionnaireTemplates__activateButton--disabled'
    );

    // Attempt to click the button
    await user.click(button);

    // Verify the callback was not called because the component's internal logic prevents it.
    expect(toggleActiveMock).not.toHaveBeenCalled();
  });
});
