import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import ActivityPrinciplesFilters from '../ActivityPrinciplesFilters';

describe('<ActivityPrinciplesFilters />', () => {
  const defaultProps = {
    categories: [{ id: 1, name: 'Recovery and Regeneration' }],
    types: [{ id: 1, name: 'Technical' }],
    phases: [{ id: 1, name: 'Attacking' }],
    hasPrincipleWithCategory: true,
    hasPrincipleWithPhase: true,
    onFilterByItem: jest.fn(),
    onFilterBySearch: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the filters', () => {
    render(<ActivityPrinciplesFilters {...defaultProps} />);
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Phases')).toBeInTheDocument();
    expect(screen.getByText('Types')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search principles')
    ).toBeInTheDocument();
  });

  it('does not render the category filter when there are no categories', () => {
    render(<ActivityPrinciplesFilters {...defaultProps} categories={[]} />);
    expect(screen.queryByText('Category')).not.toBeInTheDocument();
  });

  it('does not render the category filter when hasPrincipleWithCategory is false', () => {
    render(
      <ActivityPrinciplesFilters
        {...defaultProps}
        hasPrincipleWithCategory={false}
      />
    );
    expect(screen.queryByText('Category')).not.toBeInTheDocument();
  });

  it('does not render the phase filter when there are no phases', () => {
    render(<ActivityPrinciplesFilters {...defaultProps} phases={[]} />);
    expect(screen.queryByText('Phases')).not.toBeInTheDocument();
  });

  it('does not render the phase filter when hasPrincipleWithPhase is false', () => {
    render(
      <ActivityPrinciplesFilters
        {...defaultProps}
        hasPrincipleWithPhase={false}
      />
    );
    expect(screen.queryByText('Phases')).not.toBeInTheDocument();
  });

  it('does not render the type filter when there are no types', () => {
    render(<ActivityPrinciplesFilters {...defaultProps} types={[]} />);
    expect(screen.queryByText('Types')).not.toBeInTheDocument();
  });

  it('shows search filter value when searchFilterChars is set', () => {
    render(
      <ActivityPrinciplesFilters
        {...defaultProps}
        searchFilterChars="Line up"
      />
    );
    expect(screen.getByPlaceholderText('Search principles')).toHaveValue(
      'Line up'
    );
  });

  it('calls onFilterByItem when filtering categories', async () => {
    render(<ActivityPrinciplesFilters {...defaultProps} />);

    await userEvent.click(screen.getByText('Category'));
    await userEvent.click(screen.getByText('Recovery and Regeneration'));
    expect(defaultProps.onFilterByItem).toHaveBeenCalledWith('category', [1]);
  });

  it('calls onFilterByItem when filtering phases', async () => {
    render(<ActivityPrinciplesFilters {...defaultProps} />);

    await userEvent.click(screen.getByText('Phases'));
    await userEvent.click(screen.getByText('Attacking'));
    expect(defaultProps.onFilterByItem).toHaveBeenCalledWith('phase', [1]);
  });

  it('calls onFilterByItem when filtering types', async () => {
    render(<ActivityPrinciplesFilters {...defaultProps} />);

    await userEvent.click(screen.getByText('Types'));
    await userEvent.click(screen.getByText('Technical'));
    expect(defaultProps.onFilterByItem).toHaveBeenCalledWith('type', [1]);
  });

  it('calls onFilterBySearch when typing in the search filter', async () => {
    render(<ActivityPrinciplesFilters {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search principles');
    await userEvent.type(input, 'Li');

    await userEvent.tab(); // move focus away to trigger blur

    expect(defaultProps.onFilterBySearch).toHaveBeenCalledWith('Li');
  });
});
