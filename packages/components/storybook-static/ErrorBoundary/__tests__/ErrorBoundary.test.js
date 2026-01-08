import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../index';

describe('<ErrorBoundary /> component', () => {
  const props = {
    t: (key) => key,
  };

  it('Renders the component', () => {
    render(
      <ErrorBoundary {...props}>
        <div data-testid="ErrorBoundaryContent" />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('ErrorBoundaryContent')).toBeInTheDocument();
  });
});
