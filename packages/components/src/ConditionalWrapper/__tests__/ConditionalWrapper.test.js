import { render, screen } from '@testing-library/react';
import ConditionalWrapper from '..';

describe('ConditionalWrapper', () => {
  const defaultProps = {
    wrapper: (children) => <div data-testid="wrapper">{children}</div>,
    children: <h1>This is a child</h1>,
  };

  it('should render wrapper if condition is true', () => {
    render(<ConditionalWrapper {...defaultProps} condition />);

    expect(screen.getByText('This is a child')).toBeInTheDocument();
    expect(screen.getByTestId('wrapper')).toBeInTheDocument();
  });

  it('should only render children if condition is false', () => {
    render(<ConditionalWrapper {...defaultProps} condition={false} />);

    expect(screen.getByText('This is a child')).toBeInTheDocument();
    expect(screen.queryByTestId('wrapper')).not.toBeInTheDocument();
  });
});
