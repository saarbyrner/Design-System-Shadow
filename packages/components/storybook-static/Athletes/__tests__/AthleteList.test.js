/* eslint-disable jest/no-mocks-import */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { VirtuosoMockContext } from 'react-virtuoso';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import squadAthletes, {
  reducedSquadAthletes,
} from '../__mocks__/squadAthletes';
import AthleteList from '../components/AthleteList';
import { MockedAthleteContextProvider } from './testUtils';

const hooks = require('../hooks');

describe('Athletes | <AthleteList />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    selectedSquadId: 8,
  };
  const onChangeCallback = jest.fn();
  const onSelectAllClickCallback = jest.fn();
  const onClearAllClickCallback = jest.fn();

  const defaultAthleteContext = {
    squadAthletes: reducedSquadAthletes,
    value: [],
    onChange: onChangeCallback,
    isMulti: true,
  };

  const renderAthleteList = (
    componentProps = {},
    contextValue = defaultAthleteContext
  ) => {
    return render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <MockedAthleteContextProvider athleteContext={contextValue}>
          <AthleteList {...props} {...componentProps} />
        </MockedAthleteContextProvider>
      </VirtuosoMockContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderAthleteList();

    expect(screen.getByTestId('AthleteList|Virtuoso')).toBeInTheDocument();
  });

  it('renders the athlete list based on supplied squadId', () => {
    renderAthleteList();

    // Check squad heading
    const groupHeadings = screen.getAllByTestId('List.GroupHeading|title');
    expect(groupHeadings[0]).toHaveTextContent('International Squad');

    // Check position group heading (subheading)
    expect(groupHeadings[1]).toHaveTextContent('Forward');

    // Check that options are rendered - these are rendered as List.Option components
    // Forward (position group option)
    const forwardOptions = screen.getAllByText('Forward');
    expect(forwardOptions.length).toBeGreaterThan(0);

    // Loose-head Prop (position option) - appears as title and subtitle, so check for title
    const looseHeadPropTitles = screen.getAllByTestId('List.Option|title');
    const looseHeadPropTitle = looseHeadPropTitles.find(
      (el) => el.textContent === 'Loose-head Prop'
    );
    expect(looseHeadPropTitle).toBeInTheDocument();

    // Athlete options
    expect(screen.getByText('Test Welcome Process')).toBeInTheDocument();
    expect(screen.getByText('Welcome Process Take Two')).toBeInTheDocument();
  });

  describe('when clicking the actions on squad level', () => {
    const squadLevelContext = {
      squadAthletes: [squadAthletes.squads[2]],
      isMulti: true,
      onSelectAllClick: onSelectAllClickCallback,
      onClearAllClick: onClearAllClickCallback,
      value: [],
      onChange: onChangeCallback,
    };

    it('calls the correct callback with all squad athletes', async () => {
      const user = userEvent.setup();
      renderAthleteList({ selectedSquadId: 262 }, squadLevelContext);

      const allSquadAthletes = [
        {
          type: 'athletes',
          id: 43975,
          name: 'API Tester',
          fullname: 'API Tester',
          firstname: 'API',
          lastname: 'Tester',
          avatar_url: null,
          position: { type: 'positions', id: 71, name: 'Hooker' },
          positionGroup: {
            type: 'position_groups',
            id: 25,
            name: 'Forward',
          },
        },
        {
          type: 'athletes',
          id: 27280,
          name: 'Gustavo Lazaro Amendola',
          fullname: 'Gustavo Lazaro Amendola',
          firstname: 'Gustavo',
          lastname: 'Lazaro Amendola',
          avatar_url: null,
          position: { type: 'positions', id: 71, name: 'Hooker' },
          positionGroup: {
            type: 'position_groups',
            id: 25,
            name: 'Forward',
          },
        },
        {
          type: 'athletes',
          id: 17856,
          name: 'John Fitzgerald Kennedy',
          fullname: 'John Fitzgerald Kennedy',
          firstname: 'John Fitzgerald',
          lastname: 'Kennedy',
          avatar_url: null,
          position: { type: 'positions', id: 70, name: 'Tight-head Prop' },
          positionGroup: {
            type: 'position_groups',
            id: 25,
            name: 'Forward',
          },
        },
        {
          type: 'athletes',
          id: 41505,
          name: 'Ryan Hicks',
          fullname: 'Ryan Hicks',
          firstname: 'Ryan',
          lastname: 'Hicks',
          avatar_url: null,
          position: { type: 'positions', id: 70, name: 'Tight-head Prop' },
          positionGroup: {
            type: 'position_groups',
            id: 25,
            name: 'Forward',
          },
        },
        {
          type: 'athletes',
          id: 57816,
          name: 'Sinead Dolan',
          fullname: 'Sinead Dolan',
          firstname: 'Sinead',
          lastname: 'Dolan',
          avatar_url: null,
          position: { type: 'positions', id: 77, name: 'Scrum Half' },
          positionGroup: { type: 'position_groups', id: 26, name: 'Back' },
        },
        {
          type: 'athletes',
          id: 1161,
          name: 'Stephen Smith',
          fullname: 'Stephen Smith',
          firstname: 'Stephen',
          lastname: 'Smith',
          avatar_url: null,
          position: { type: 'positions', id: 82, name: 'Fullback' },
          positionGroup: { type: 'position_groups', id: 26, name: 'Back' },
        },
      ];

      // Find and click Select all button (first one is squad level)
      const selectAllButtons = screen.getAllByRole('button', {
        name: 'Select all',
      });
      await user.click(selectAllButtons[0]);
      expect(onSelectAllClickCallback).toHaveBeenCalledWith(
        allSquadAthletes,
        262
      );

      // Find and click Clear all button (first one is squad level)
      const clearAllButtons = screen.getAllByRole('button', {
        name: 'Clear all',
      });
      await user.click(clearAllButtons[0]);
      expect(onClearAllClickCallback).toHaveBeenCalledWith(
        allSquadAthletes,
        262
      );
    });
  });

  it('renders the back button and calls callback when click', async () => {
    const user = userEvent.setup();
    const onClickBack = jest.fn();
    renderAthleteList({ onClickBack });

    const backButton = screen.getByTestId('AthleteList|Back');
    expect(backButton).toHaveTextContent('Squads');

    await user.click(backButton);

    expect(onClickBack).toHaveBeenCalledTimes(1);
  });

  it('calls the context onChange callback when clicked', async () => {
    const user = userEvent.setup();
    renderAthleteList();

    // Click on Forward (position group option) - find the option, not the heading
    const forwardOptions = screen.getAllByText('Forward');
    // Find the one that's an option (has role="button" or is in a SquadList|Option)
    const forwardOptionElement =
      forwardOptions.find(
        (el) =>
          el.closest('[role="button"]') ||
          el.closest('[data-testid="SquadList|Option"]')
      ) || forwardOptions[forwardOptions.length - 1];
    const forwardOption =
      forwardOptionElement.closest('[role="button"]') ||
      forwardOptionElement.closest('[data-testid="SquadList|Option"]');
    await user.click(forwardOption);

    expect(onChangeCallback).toHaveBeenLastCalledWith([
      {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [25],
        positions: [],
        athletes: [],
        squads: [],
        users: [],
        context_squads: [],
        segments: [],
        labels: [],
      },
    ]);

    // Click on Loose-head Prop (position) - find the title, not the subtitle
    const looseHeadPropTitles = screen.getAllByTestId('List.Option|title');
    const looseHeadPropTitle = looseHeadPropTitles.find(
      (el) => el.textContent === 'Loose-head Prop'
    );
    const looseHeadPropOption =
      looseHeadPropTitle.closest('[role="button"]') ||
      looseHeadPropTitle.closest('[data-testid="SquadList|Option"]');
    await user.click(looseHeadPropOption);

    expect(onChangeCallback).toHaveBeenLastCalledWith([
      {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [72],
        athletes: [],
        squads: [],
        users: [],
        context_squads: [],
        segments: [],
        labels: [],
      },
    ]);

    // Click on Test Welcome Process (athlete)
    const athleteText = screen.getByText('Test Welcome Process');
    const athleteOption =
      athleteText.closest('[role="button"]') ||
      athleteText.closest('[data-testid="SquadList|Option"]');
    await user.click(athleteOption);

    expect(onChangeCallback).toHaveBeenLastCalledWith([
      {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [],
        athletes: [33196],
        squads: [],
        users: [],
        context_squads: [],
        segments: [],
        labels: [],
      },
    ]);
  });

  describe('for a list with a single squad', () => {
    const singleSquadContext = {
      squadAthletes: [squadAthletes.squads[0]],
      value: [],
      onChange: onChangeCallback,
      isMulti: true,
    };

    it('doesnt render the back button for one squad', () => {
      renderAthleteList({}, singleSquadContext);

      expect(screen.queryByTestId('AthleteList|Back')).not.toBeInTheDocument();
    });
  });

  describe('enableAllGroupSelection', () => {
    const enableAllGroupSelectionContext = {
      squadAthletes: [squadAthletes.squads[2]],
      isMulti: true,
      onSelectAllClick: onSelectAllClickCallback,
      onClearAllClick: onClearAllClickCallback,
      value: [],
      onChange: onChangeCallback,
    };

    it('select and clear all button for non-hidden types', async () => {
      const user = userEvent.setup();
      renderAthleteList(
        {
          enableAllGroupSelection: true,
          selectedSquadId: 262,
          hiddenTypes: ['squads', 'athletes', 'position_groups'],
        },
        enableAllGroupSelectionContext
      );

      // Find the Forward position group heading to get its buttons
      const groupHeadings = screen.getAllByTestId('List.GroupHeading|title');
      const forwardHeading = groupHeadings.find(
        (heading) => heading.textContent === 'Forward'
      );
      expect(forwardHeading).toBeInTheDocument();

      // Find the parent container that holds both the heading and the buttons
      // The structure is: div > div (heading) + div (buttons container)
      const forwardHeadingContainer =
        forwardHeading.parentElement?.parentElement;
      expect(forwardHeadingContainer).toBeInTheDocument();

      const forwardSelectAllButton = within(forwardHeadingContainer).getByRole(
        'button',
        { name: 'Select all' }
      );
      const forwardClearAllButton = within(forwardHeadingContainer).getByRole(
        'button',
        { name: 'Clear all' }
      );

      // Click Select all for the Forward position group
      await user.click(forwardSelectAllButton);
      expect(onSelectAllClickCallback).toHaveBeenCalledWith(
        [
          { type: 'positions', id: 71, name: 'Hooker' },
          { type: 'positions', id: 70, name: 'Tight-head Prop' },
        ],
        262
      );

      // Click Clear all for the Forward position group
      await user.click(forwardClearAllButton);
      expect(onClearAllClickCallback).toHaveBeenCalledWith(
        [
          { type: 'positions', id: 71, name: 'Hooker' },
          { type: 'positions', id: 70, name: 'Tight-head Prop' },
        ],
        262
      );
    });
  });

  it('hides positions and position groups when hidden types are supplied', () => {
    renderAthleteList({
      hiddenTypes: ['squads', 'positions', 'position_groups'],
    });

    // Squad heading should still be visible
    const groupHeadings = screen.getAllByTestId('List.GroupHeading|title');
    expect(groupHeadings[0]).toHaveTextContent('International Squad');

    // Position group heading is still rendered (groupContent always renders it)
    // but position group and position options should be hidden
    // Only athletes should be visible
    expect(screen.getByText('Test Welcome Process')).toBeInTheDocument();
    expect(screen.getByText('Welcome Process Take Two')).toBeInTheDocument();

    // Position group options should not be visible
    const forwardOptions = screen.getAllByText('Forward');
    // Forward should only appear as a heading, not as an option
    const forwardAsOption = forwardOptions.find((el) =>
      el.closest('[data-testid="SquadList|Option"]')
    );
    expect(forwardAsOption).toBeUndefined();

    // Position options should not be visible
    const looseHeadPropTitles = screen.getAllByTestId('List.Option|title');
    const looseHeadPropTitle = looseHeadPropTitles.find(
      (el) => el.textContent === 'Loose-head Prop'
    );
    expect(looseHeadPropTitle).toBeUndefined();
  });

  describe('List.Option onClick behavior', () => {
    it('should call onClick only once', async () => {
      const user = userEvent.setup();
      const mockOnClick = jest.fn();

      const useOptionSelectStub = jest.fn().mockReturnValue({
        onClick: mockOnClick,
        isSelected: jest.fn(),
        selectMultiple: jest.fn(),
        deselectMultiple: jest.fn(),
      });

      const originalUseOptionSelect = hooks.useOptionSelect;
      hooks.useOptionSelect = useOptionSelectStub;

      renderAthleteList();

      // Find the Forward option (not the heading)
      const forwardOptions = screen.getAllByText('Forward');
      // Find the one that's an option (has role="button" or is in a SquadList|Option)
      const forwardOptionElement =
        forwardOptions.find(
          (el) =>
            el.closest('[role="button"]') ||
            el.closest('[data-testid="SquadList|Option"]')
        ) || forwardOptions[forwardOptions.length - 1];
      const forwardOption =
        forwardOptionElement.closest('[role="button"]') ||
        forwardOptionElement.closest('[data-testid="SquadList|Option"]');
      await user.click(forwardOption);

      expect(mockOnClick).toHaveBeenCalledTimes(1);

      hooks.useOptionSelect = originalUseOptionSelect;
    });
  });

  it('renders the default subtitle (Group) for group options', () => {
    renderAthleteList();

    // Find the Forward option (position group) and get its subtitle
    const forwardOptions = screen.getAllByText('Forward');
    // Find the one that's an option (has role="button" or is in a SquadList|Option)
    const forwardOption =
      forwardOptions.find(
        (el) =>
          el.closest('[role="button"]') ||
          el.closest('[data-testid="SquadList|Option"]')
      ) || forwardOptions[forwardOptions.length - 1];
    const subtitle = forwardOption
      .closest('[data-testid="SquadList|Option"]')
      ?.querySelector('[data-testid="List.Option|subTitle"]');

    expect(subtitle).toHaveTextContent('(Group)');
  });

  it('renders the custom subtitle when provided', () => {
    const customSubtitle = '(Custom Subtitle)';
    renderAthleteList({ subtitle: customSubtitle });

    // Find the Forward option (position group) and get its subtitle
    const forwardOptions = screen.getAllByText('Forward');
    // Find the one that's an option (has role="button" or is in a SquadList|Option)
    const forwardOption =
      forwardOptions.find(
        (el) =>
          el.closest('[role="button"]') ||
          el.closest('[data-testid="SquadList|Option"]')
      ) || forwardOptions[forwardOptions.length - 1];
    const subtitle = forwardOption
      .closest('[data-testid="SquadList|Option"]')
      ?.querySelector('[data-testid="List.Option|subTitle"]');

    expect(subtitle).toHaveTextContent(customSubtitle);
  });
});
