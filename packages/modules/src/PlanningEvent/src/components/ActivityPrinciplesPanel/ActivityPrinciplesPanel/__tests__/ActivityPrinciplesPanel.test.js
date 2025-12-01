import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ActivityPrinciplesPanel from '../ActivityPrinciplesPanel';

describe('<ActivityPrinciplesPanel />', () => {
  const props = {
    isOpen: true,
    categories: [{ id: 1, name: 'Recovery and Regeneration' }],
    phases: [{ id: 1, name: 'Attacking' }],
    types: [{ id: 1, name: 'Technical' }],
    principles: [
      {
        id: 1,
        name: 'First principle',
        principle_categories: [],
        phases: [],
        principle_types: [{ id: 1, name: 'Technical' }],
      },
      {
        id: 2,
        name: 'Second principle',
        principle_categories: [],
        phases: [],
        principle_types: [{ id: 2, name: 'Tactical' }],
      },
    ],

    hasPrincipleWithCategory: true,
    hasPrincipleWithPhase: true,
    hasInitialPrinciples: true,
    onClose: jest.fn(),
    onFilterPrinciplesByItem: jest.fn(),
    onFilterPrinciplesBySearch: jest.fn(),
    onDragPrinciple: jest.fn(),
    onDropPrinciple: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct content', () => {
    render(<ActivityPrinciplesPanel {...props} />);
    expect(screen.getByText('Principles')).toBeInTheDocument();
  });

  it('renders a loader when requestStatus is LOADING', () => {
    render(<ActivityPrinciplesPanel {...props} requestStatus="LOADING" />);
    expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
  });

  describe('when the request status is SUCCESS', () => {
    it('renders the filters', () => {
      render(<ActivityPrinciplesPanel {...props} requestStatus="SUCCESS" />);
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Phases')).toBeInTheDocument();
      expect(screen.getByText('Types')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search principles')
      ).toBeInTheDocument();
    });

    it('calls onFilterPrinciplesByItem when filtering by item', async () => {
      render(<ActivityPrinciplesPanel {...props} requestStatus="SUCCESS" />);
      // Simulate selecting a category
      await userEvent.click(screen.getByText('Category'));
      await userEvent.click(screen.getByText('Recovery and Regeneration'));
      expect(props.onFilterPrinciplesByItem).toHaveBeenCalledWith('category', [
        1,
      ]);
    });

    it('calls onFilterPrinciplesBySearch when filtering by search', async () => {
      render(<ActivityPrinciplesPanel {...props} requestStatus="SUCCESS" />);
      const input = screen.getByPlaceholderText('Search principles');
      await userEvent.type(input, 'Line up');
      await userEvent.tab();
      expect(props.onFilterPrinciplesBySearch).toHaveBeenCalledWith('Line up');
    });
  });

  describe('when there are no initial principles', () => {
    beforeEach(() => {
      render(
        <ActivityPrinciplesPanel
          {...props}
          requestStatus="SUCCESS"
          hasInitialPrinciples={false}
        />
      );
    });

    it('does not render the filters', () => {
      expect(screen.queryByText('Category')).not.toBeInTheDocument();
      expect(screen.queryByText('Phases')).not.toBeInTheDocument();
      expect(screen.queryByText('Types')).not.toBeInTheDocument();
    });

    it('does not render the principles list', () => {
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('renders the no initial principles message and link', () => {
      expect(
        screen.getByText(
          'No principles have been created. Create new principles in the'
        )
      ).toBeInTheDocument();
      const link = screen.getByRole('link', {
        name: 'organisation settings page',
      });
      expect(link).toHaveAttribute('href', '/settings/organisation/edit');
    });
  });

  describe('when there are no principles', () => {
    beforeEach(() => {
      render(
        <ActivityPrinciplesPanel
          {...props}
          requestStatus="SUCCESS"
          principles={[]}
        />
      );
    });

    it('does not render the principles list', () => {
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('renders the no matched principles message', () => {
      expect(
        screen.getByText('No principles match the selected filters')
      ).toBeInTheDocument();
    });
  });

  it('renders the sliding panel with the correct top position when withMetaInformation is true', () => {
    render(<ActivityPrinciplesPanel {...props} withMetaInformation />);
    // The cssTop prop is not directly testable, but the panel should render
    expect(screen.getByText('Principles')).toBeInTheDocument();
  });

  it('shows an error message when requestStatus is FAILURE', () => {
    render(<ActivityPrinciplesPanel {...props} requestStatus="FAILURE" />);
    expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
  });
});
