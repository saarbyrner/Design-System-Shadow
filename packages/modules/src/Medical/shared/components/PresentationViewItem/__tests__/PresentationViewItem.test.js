import { screen, render } from '@testing-library/react';
import PresentationViewItem from '../index';

describe('<InjuryPresentationViewItem />', () => {
  it('renders correctly when value is provided', () => {
    render(<PresentationViewItem label="Test Label" value="Test Value" />);

    expect(screen.getByText('Test Label:')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('renders correctly when value is not provided and highlightEmptyFields is true', () => {
    render(
      <PresentationViewItem label="Test Label" value="" highlightEmptyFields />
    );

    expect(screen.getByText('Test Label:')).toBeInTheDocument();
    expect(screen.getByTestId('ErrorOutlineIcon')).toBeInTheDocument();
  });

  it('renders correctly when value is not provided and highlightEmptyFields is false', () => {
    window.featureFlags['incomplete-injury-fields'] = false;
    render(<PresentationViewItem label="Test Label" value="" />);

    expect(screen.getByText('Test Label:')).toBeInTheDocument();
    expect(screen.queryByTestId('ErrorOutlineIcon')).not.toBeInTheDocument();
  });

  it('formats date values correctly', () => {
    render(<PresentationViewItem label="Date Label" value="2025-10-11" />);

    expect(screen.getByText('Date Label:')).toBeInTheDocument();
    expect(screen.getByText('Oct 11, 2025')).toBeInTheDocument();
  });

  it('does not format non-date string values', () => {
    render(<PresentationViewItem label="Non-Date Label" value="Not a date" />);

    expect(screen.getByText('Non-Date Label:')).toBeInTheDocument();
    expect(screen.getByText('Not a date')).toBeInTheDocument();
  });

  it('does not format invalid date strings', () => {
    render(
      <PresentationViewItem label="Invalid Date Label" value="2025-13-01" />
    );

    expect(screen.getByText('Invalid Date Label:')).toBeInTheDocument();
    expect(screen.getByText('2025-13-01')).toBeInTheDocument();
  });

  it('renders correctly with null value', () => {
    render(<PresentationViewItem label="Null Value" value={null} />);
    expect(screen.getByText('Null Value:')).toBeInTheDocument();
    expect(screen.queryByTestId('ErrorOutlineIcon')).not.toBeInTheDocument();
  });

  it('renders correctly with undefined value', () => {
    render(<PresentationViewItem label="Undefined Value" value={undefined} />);

    expect(screen.getByText('Undefined Value:')).toBeInTheDocument();
    expect(screen.queryByTestId('ErrorOutlineIcon')).not.toBeInTheDocument();
  });

  it('renders correctly with number value', () => {
    render(<PresentationViewItem label="Number Value" value={12345} />);
    expect(screen.getByText('Number Value:')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('renders correctly with empty string value', () => {
    render(<PresentationViewItem label="Empty String Value" value="" />);

    expect(screen.getByText('Empty String Value:')).toBeInTheDocument();
    expect(screen.queryByTestId('ErrorOutlineIcon')).not.toBeInTheDocument();
  });
});
