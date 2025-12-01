import { render, screen } from '@testing-library/react';
import PACSButton from '..';

describe('<PACSButton />', () => {
  const props = {
    href: 'NFL.ambralink.someothervalue?maybesomequeryparams:ornot',
    textForButton: 'My button :-)',
    isRedoxOrg: true,
    diagnosticTabFormState: {},
  };

  it('renders button text', async () => {
    render(<PACSButton {...props} />);

    const buttonText = screen.getByRole('button', { name: 'My button :-)' });
    expect(buttonText.closest('button')).toBeEnabled();
  });

  it('renders the correct href', async () => {
    render(<PACSButton {...props} />);

    const button = screen.getByRole('button', { name: 'My button :-)' });

    expect(button.closest('a')).toHaveAttribute(
      'href',
      'NFL.ambralink.someothervalue?maybesomequeryparams:ornot'
    );
  });

  it('is disabled when a diagnostic is queued', async () => {
    render(
      <PACSButton
        {...props}
        diagnosticTabFormState={{
          queuedReconciledDiagnostics: [
            { diagnosticId: 666, athleteId: 123456 },
          ],
        }}
      />
    );
    const button = screen.getByRole('button', { name: 'My button :-)' });
    expect(button.closest('button')).toBeDisabled();
  });
});
