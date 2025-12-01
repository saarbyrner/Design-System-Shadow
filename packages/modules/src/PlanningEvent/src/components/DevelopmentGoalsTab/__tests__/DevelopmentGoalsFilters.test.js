import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { data as mockEventDevelopmentGoals } from '@kitman/services/src/mocks/handlers/planningHub/getEventDevelopmentGoals';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DevelopmentGoalsFilters from '../DevelopmentGoalsFilters';

jest.mock(
  '@kitman/common/src/hooks/useDebouncedCallback',
  () => (callback) => callback
);

describe('<DevelopmentGoalsFilters />', () => {
  let user;
  const onFilterByItem = jest.fn();
  const onFilterBySearch = jest.fn();

  const props = {
    eventDevelopmentGoals: mockEventDevelopmentGoals,
    areCoachingPrinciplesEnabled: true,
    t: i18nextTranslateStub(),
    onFilterByItem,
    onFilterBySearch,
  };

  beforeEach(() => {
    user = userEvent.setup();
    onFilterByItem.mockClear();
    onFilterBySearch.mockClear();
  });

  const renderComponent = (overrideProps = {}) => {
    return render(<DevelopmentGoalsFilters {...props} {...overrideProps} />);
  };

  it('renders the correct filters and allows interaction', async () => {
    renderComponent();

    const desktopFiltersContainer = document.querySelector(
      '.developmentGoalsFilters--desktop'
    );

    const { getByPlaceholderText, getByText } = within(desktopFiltersContainer);

    // Search filter
    const searchInput = getByPlaceholderText('Search');
    expect(searchInput).toBeInTheDocument();
    await fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(onFilterBySearch).toHaveBeenCalledWith('test search');

    // Athlete filter
    const athleteSelect = getByText('Athlete');
    await selectEvent.select(athleteSelect, 'John Doe');
    expect(onFilterByItem).toHaveBeenCalledWith('athlete', [1]);

    // Positions filter
    const positionSelect = getByText('Positions');
    await selectEvent.select(positionSelect, 'Back');
    expect(onFilterByItem).toHaveBeenCalledWith('position', [1]);

    // Type filter
    const typeSelect = getByText('Type');
    await selectEvent.select(typeSelect, 'Tecnical');
    expect(onFilterByItem).toHaveBeenCalledWith('development_goal_type', [1]);

    // Principle filter
    const principleSelect = getByText('Principle');
    await selectEvent.select(principleSelect, 'Long pass');
    expect(onFilterByItem).toHaveBeenCalledWith('principle', [1]);
  });

  it('does not render the principles filter when disabled', () => {
    renderComponent({ areCoachingPrinciplesEnabled: false });

    const desktopFiltersContainer = document.querySelector(
      '.developmentGoalsFilters--desktop'
    );
    const { queryByText } = within(desktopFiltersContainer);
    expect(queryByText('Principle')).not.toBeInTheDocument();
  });

  describe('mobile view', () => {
    it('renders filters in a side panel and can be opened', async () => {
      renderComponent();

      const mobileFiltersContainer = document.querySelector(
        '.developmentGoalsFilters--desktop'
      );

      const { getByText } = within(mobileFiltersContainer);

      const filtersButton = screen.getByRole('button', { name: /Filters/i });
      expect(filtersButton).toBeInTheDocument();

      // Panel should be closed initially
      expect(document.querySelector('.slidingPanel__title')).not.toBeVisible();

      await user.click(filtersButton);

      // Panel should be open
      expect(document.querySelector('.slidingPanel__title')).toBeVisible();

      // Check one of the filters inside the panel
      const athleteSelect = getByText('Athlete');
      await selectEvent.select(athleteSelect, 'John Doe');
      expect(onFilterByItem).toHaveBeenCalledWith('athlete', [1]);
    });
  });
});
