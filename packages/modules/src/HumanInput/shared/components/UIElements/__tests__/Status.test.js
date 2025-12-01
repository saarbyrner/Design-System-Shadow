import { screen, render } from '@testing-library/react';
import Status from '../Status';

describe('<Status/>', () => {
  it('renders', () => {
    render(<Status />);
    // I know using getByTestId is frowned upon, but it's an MUI icon that will change in a future iteration
    // there's no other way to test this unfortunately
    expect(screen.getByTestId('DonutLargeIcon')).toBeInTheDocument();
  });

  it('renders the INVALID icon', () => {
    render(<Status status="INVALID" />);
    expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
  });

  it('renders the VALID icon', () => {
    render(<Status status="VALID" />);
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
  });
});
