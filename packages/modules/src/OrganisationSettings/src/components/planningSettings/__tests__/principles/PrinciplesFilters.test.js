import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PrinciplesFilters from '../../principles/PrinciplesFilters';
import {
  mockCategories,
  mockPhases,
  mockTypes,
  mockSquads,
} from '../../utils/mocks';

describe('<PrinciplesFilters />', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      view: 'PRESENTATION',
      categories: mockCategories,
      phases: mockPhases,
      types: mockTypes,
      squads: mockSquads,
      onFilterByItem: jest.fn(),
      onFilterBySearch: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders all filters with their correct placeholders and options', async () => {
    render(<PrinciplesFilters {...baseProps} />);

    // The search input appears twice in the DOM, once for desktop and once for mobile.
    expect(screen.getAllByPlaceholderText('Search principles')).toHaveLength(2);

    // Filters appear twice in the DOM, once for desktop and once for mobile.
    expect(screen.getAllByText('Category')).toHaveLength(2);
    expect(screen.getAllByText('Phases of play')).toHaveLength(2);
    expect(screen.getAllByText('Type')).toHaveLength(2);
    expect(screen.getAllByText('Squad')).toHaveLength(2);

    // Verify options are present in one of the dropdowns by clicking the first instance
    await user.click(screen.getAllByText('Category')[0]);
    expect(
      await screen.findByText('Recovery and Regeneration')
    ).toBeInTheDocument();
  });

  it('renders the mobile filters button and opens the panel on click', async () => {
    render(<PrinciplesFilters {...baseProps} />);

    // The mobile-only button is always in the DOM but may be hidden by CSS.
    // We can still interact with it.
    const mobileFilterButton = screen.getAllByText('Filters')[0];
    expect(mobileFilterButton).toBeInTheDocument();

    await user.click(mobileFilterButton);

    // The panel should now be visible
    expect(await screen.findAllByText('Filters')).toHaveLength(2);
  });

  describe('when props.view is EDIT', () => {
    it('disables all the filters', () => {
      render(<PrinciplesFilters {...baseProps} view="EDIT" />);

      screen.getAllByPlaceholderText('Search principles').forEach((input) => {
        expect(input).toBeDisabled();
      });

      // Check that the custom Select components are disabled
      screen.getAllByText('Category').forEach((el) => {
        expect(el.nextElementSibling).toBeDisabled();
      });
      screen.getAllByText('Phases of play').forEach((el) => {
        expect(el.nextElementSibling).toBeDisabled();
      });
      screen.getAllByText('Type').forEach((el) => {
        expect(el.nextElementSibling).toBeDisabled();
      });
      screen.getAllByText('Squad').forEach((el) => {
        expect(el.nextElementSibling).toBeDisabled();
      });
    });
  });

  describe('when filtering', () => {
    it('calls onFilterBySearch with the entered characters after debounce', async () => {
      jest.useFakeTimers();

      render(<PrinciplesFilters {...baseProps} />);

      const searchInput =
        screen.getAllByPlaceholderText('Search principles')[0];

      // Use the new user instance that is aware of the fake timers
      fireEvent.change(searchInput, {
        target: { value: 'Li' },
      });

      // Fast-forward time to trigger the debounce
      jest.runAllTimers();

      expect(baseProps.onFilterBySearch).toHaveBeenCalledWith('Li');

      jest.useRealTimers();
    });

    it('calls onFilterByItem when selecting a category', async () => {
      render(<PrinciplesFilters {...baseProps} />);

      // Target the first instance of the category filter
      const categoryFilter = screen.getAllByText('Category')[0];

      await user.click(categoryFilter);
      await user.click(await screen.findByText('Recovery and Regeneration'));

      expect(baseProps.onFilterByItem).toHaveBeenCalledTimes(1);
      expect(baseProps.onFilterByItem).toHaveBeenCalledWith('category', [1]);
    });

    it('calls onFilterByItem when selecting a phase', async () => {
      render(<PrinciplesFilters {...baseProps} />);

      const phasesFilter = screen.getAllByText('Phases of play')[0];

      await user.click(phasesFilter);
      await user.click(await screen.findByText('Defending'));

      expect(baseProps.onFilterByItem).toHaveBeenCalledTimes(1);
      expect(baseProps.onFilterByItem).toHaveBeenCalledWith('phase', [2]);
    });

    it('calls onFilterByItem when selecting a type', async () => {
      render(<PrinciplesFilters {...baseProps} />);

      const typesFilter = screen.getAllByText('Type')[0];

      await user.click(typesFilter);
      await user.click(await screen.findByText('Tactical'));

      expect(baseProps.onFilterByItem).toHaveBeenCalledTimes(1);
      expect(baseProps.onFilterByItem).toHaveBeenCalledWith('type', [2]);
    });

    it('calls onFilterByItem when selecting a squad', async () => {
      render(<PrinciplesFilters {...baseProps} />);

      const squadsFilter = screen.getAllByText('Squad')[0];

      await user.click(squadsFilter);
      await user.click(await screen.findByText('Academy Squad'));

      expect(baseProps.onFilterByItem).toHaveBeenCalledTimes(1);
      expect(baseProps.onFilterByItem).toHaveBeenCalledWith('squad', [73]);
    });
  });
});
