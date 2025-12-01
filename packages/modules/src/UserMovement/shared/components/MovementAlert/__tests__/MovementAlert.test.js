import { screen, render } from '@testing-library/react';
import { Button } from '@kitman/playbook/components';

import MovementAlert from '..';

const props = {
  severity: 'error',
  config: {
    title: 'A title',
    message: null,
  },
  action: null,
};

describe('<MovementAlert/>', () => {
  it('renders the alert', () => {
    render(<MovementAlert {...props} />);
    expect(screen.getByText(/A title/i)).toBeInTheDocument();
  });

  it('renders the alert message', () => {
    render(
      <MovementAlert
        {...props}
        config={{
          title: 'A title',
          message: 'a message',
        }}
      />
    );
    expect(screen.getByText(/A title/i)).toBeInTheDocument();
    expect(screen.getByText(/a message/i)).toBeInTheDocument();
  });

  it('renders the alert action', () => {
    render(
      <MovementAlert
        {...props}
        config={{
          title: 'A title',
          message: 'a message',
        }}
        action={<Button>My button</Button>}
      />
    );
    expect(screen.getByText(/A title/i)).toBeInTheDocument();
    expect(screen.getByText(/a message/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'My button' })
    ).toBeInTheDocument();
  });
});
