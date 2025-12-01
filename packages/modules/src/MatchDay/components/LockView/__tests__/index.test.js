import { render, screen } from '@testing-library/react';
import LockView from '..';

describe('LockView', () => {
  const children = <div>Some content</div>;

  it('renders children when isEnabled is false', () => {
    render(<LockView isEnabled={false}>{children}</LockView>);
    expect(screen.getByText('Some content')).toBeInTheDocument();
    expect(screen.queryByTestId('LockClockIcon')).not.toBeInTheDocument();
  });

  it('renders the lock icon and text when isEnabled is true', () => {
    render(
      <LockView isEnabled text="Content is locked">
        {children}
      </LockView>
    );
    expect(screen.getByTestId('LockClockIcon')).toBeInTheDocument();
    expect(screen.getByText('Content is locked')).toBeInTheDocument();
  });
});
