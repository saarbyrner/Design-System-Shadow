import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ActivityPrinciplesMobilePanel from '../ActivityPrinciplesMobilePanel';

describe('<ActivityPrinciplesMobilePanel />', () => {
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
    eventSessionActivity: {
      athletes: [],
      duration: null,
      id: 1,
      principles: [
        {
          id: 1,
          name: 'First principle',
          principle_categories: [],
          phases: [],
          principle_types: [{ id: 1, name: 'Technical' }],
        },
      ],
      users: [],
    },
    hasPrincipleWithCategory: true,
    hasPrincipleWithPhase: true,
    hasInitialPrinciples: true,
    onFilterPrinciplesByItem: jest.fn(),
    onFilterPrinciplesBySearch: jest.fn(),
    onSave: jest.fn(),
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a loader when requestStatus is LOADING', () => {
    render(
      <ActivityPrinciplesMobilePanel {...props} requestStatus="LOADING" />
    );
    expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
  });

  describe('when requestStatus is SUCCESS', () => {
    it('renders the filters', () => {
      render(
        <ActivityPrinciplesMobilePanel {...props} requestStatus="SUCCESS" />
      );
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Phases')).toBeInTheDocument();
      expect(screen.getByText('Types')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search principles')
      ).toBeInTheDocument();
    });

    it('populates the checkbox list with the principles', () => {
      render(
        <ActivityPrinciplesMobilePanel {...props} requestStatus="SUCCESS" />
      );
      expect(screen.getByLabelText('First principle')).toBeInTheDocument();
      expect(screen.getByLabelText('Second principle')).toBeInTheDocument();
    });

    it('enables the save button after selecting', async () => {
      render(
        <ActivityPrinciplesMobilePanel {...props} requestStatus="SUCCESS" />
      );
      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeDisabled();

      const secondCheckbox = screen.getByLabelText('Second principle');
      await userEvent.click(secondCheckbox);

      expect(saveButton).toBeEnabled();
    });

    it('calls onFilterPrinciplesByItem when filtering by item', async () => {
      render(
        <ActivityPrinciplesMobilePanel {...props} requestStatus="SUCCESS" />
      );
      await userEvent.click(screen.getByText('Category'));
      await userEvent.click(screen.getByText('Recovery and Regeneration'));
      expect(props.onFilterPrinciplesByItem).toHaveBeenCalledWith('category', [
        1,
      ]);
    });

    it('calls onFilterPrinciplesBySearch when filtering by search', async () => {
      render(
        <ActivityPrinciplesMobilePanel {...props} requestStatus="SUCCESS" />
      );

      const input = screen.getByPlaceholderText('Search principles');
      await userEvent.type(input, 'Li');

      await userEvent.tab();
      expect(props.onFilterPrinciplesBySearch).toHaveBeenCalledWith('Li');
    });

    it('calls onSave and onClose with the expected params when saving', async () => {
      render(
        <ActivityPrinciplesMobilePanel {...props} requestStatus="SUCCESS" />
      );
      const secondCheckbox = screen.getByLabelText('Second principle');
      await userEvent.click(secondCheckbox);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await userEvent.click(saveButton);

      expect(props.onSave).toHaveBeenCalledWith([1, 2]);
      expect(props.onClose).toHaveBeenCalled();
    });

    it('calls onClose when clicking the close button', async () => {
      render(
        <ActivityPrinciplesMobilePanel {...props} requestStatus="SUCCESS" />
      );
      const closeButton = screen.getByRole('button', { name: '' }); // The close button has no accessible name
      await userEvent.click(closeButton);
      expect(props.onClose).toHaveBeenCalled();
    });
  });

  describe('when there are no initial principles', () => {
    it('does not render the filters or actions', () => {
      render(
        <ActivityPrinciplesMobilePanel
          {...props}
          requestStatus="SUCCESS"
          hasInitialPrinciples={false}
        />
      );
      expect(screen.queryByText('Category')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Save' })
      ).not.toBeInTheDocument();
    });

    it('renders the no initial principles message and link', () => {
      render(
        <ActivityPrinciplesMobilePanel
          {...props}
          requestStatus="SUCCESS"
          hasInitialPrinciples={false}
        />
      );
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

  it('renders the no matched principles message when there are no principles', () => {
    render(
      <ActivityPrinciplesMobilePanel
        {...props}
        requestStatus="SUCCESS"
        principles={[]}
      />
    );
    expect(
      screen.getByText('No principles match the selected filters')
    ).toBeInTheDocument();
  });

  it('shows an error message when requestStatus is FAILURE', () => {
    render(
      <ActivityPrinciplesMobilePanel {...props} requestStatus="FAILURE" />
    );
    expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
  });
});
