import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cloneDeep from 'lodash/cloneDeep';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthleteSelector from '..';

describe('<AthleteSelector /> component', () => {
  const squadAthletes = {
    position_groups: [
      {
        id: '1',
        name: 'Position Group 1',
        positions: [
          {
            id: '1',
            name: 'Position 1',
            athletes: [
              {
                id: '1',
                fullname: 'Athlete 1',
              },
              {
                id: '2',
                fullname: 'Athlete 2',
              },
            ],
          },
          {
            id: '2',
            name: 'Position 2',
            athletes: [
              {
                id: '3',
                fullname: 'Athlete 3',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        name: 'Position Group 2',
        positions: [
          {
            id: '3',
            name: 'Position 3',
            athletes: [
              {
                id: '4',
                fullname: 'Athlete 4',
              },
            ],
          },
        ],
      },
    ],
  };

  const squads = [
    {
      id: '1',
      name: 'Squad 1',
    },
    {
      id: '2',
      name: 'Squad 2',
    },
  ];

  const emptySquadAthletesSelection = {
    applies_to_squad: false,
    position_groups: [],
    positions: [],
    athletes: [],
    all_squads: false,
    squads: [],
  };

  const initialProps = {
    squadAthletes,
    squads,
    selectedSquadAthletes: emptySquadAthletesSelection,
    onSelectSquadAthletes: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to find checkbox by label text when there might be multiple matches
  const getCheckboxByLabel = (labelText) => {
    const labels = screen.getAllByText(labelText);
    // Find the label that is actually a checkbox label (has a sibling checkbox)
    const label = labels.find((lbl) => {
      const checkbox = lbl
        .closest('.reactCheckbox')
        ?.querySelector('[role="checkbox"]');
      return checkbox !== null;
    });
    if (!label) {
      throw new Error(`Could not find checkbox with label "${labelText}"`);
    }
    const reactCheckbox = label.closest('.reactCheckbox');
    if (!reactCheckbox) {
      throw new Error(
        `Could not find .reactCheckbox parent for label "${labelText}"`
      );
    }
    return reactCheckbox.querySelector('[role="checkbox"]');
  };

  it('renders correctly', () => {
    render(<AthleteSelector {...initialProps} />);
    expect(screen.getByTestId('DropdownWrapper')).toBeInTheDocument();
  });

  it('renders the label', () => {
    render(<AthleteSelector {...initialProps} label="Dropdown label" />);

    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const label = dropdownWrapper.querySelector('label');
    expect(label).toHaveTextContent('Dropdown label');
  });

  it('renders the position groups name', async () => {
    const user = userEvent.setup();
    render(<AthleteSelector {...initialProps} />);

    // Open dropdown to see content
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    const positionGroupNames = screen.getAllByText('Position Group 1');
    expect(positionGroupNames.length).toBeGreaterThan(0);
    const positionGroup2Names = screen.getAllByText('Position Group 2');
    expect(positionGroup2Names.length).toBeGreaterThan(0);
  });

  it('renders the position groups checkboxes', async () => {
    const user = userEvent.setup();
    render(<AthleteSelector {...initialProps} />);

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    // Check for position group checkboxes by their labels
    const positionGroup1Texts = screen.getAllByText('Position Group 1');
    expect(positionGroup1Texts.length).toBeGreaterThan(0);
    const positionGroup2Texts = screen.getAllByText('Position Group 2');
    expect(positionGroup2Texts.length).toBeGreaterThan(0);
    const groupLabels = screen.getAllByText('(group)');
    expect(groupLabels.length).toBeGreaterThan(0);
  });

  it('renders the positions checkboxes', async () => {
    const user = userEvent.setup();
    render(<AthleteSelector {...initialProps} />);

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    expect(screen.getByText('Position 1')).toBeInTheDocument();
    expect(screen.getByText('Position 2')).toBeInTheDocument();
    expect(screen.getByText('Position 3')).toBeInTheDocument();
  });

  it('renders the athletes checkboxes', async () => {
    const user = userEvent.setup();
    render(<AthleteSelector {...initialProps} />);

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    expect(screen.getByText('Athlete 1')).toBeInTheDocument();
    expect(screen.getByText('Athlete 2')).toBeInTheDocument();
    expect(screen.getByText('Athlete 3')).toBeInTheDocument();
  });

  it('renders the squads checkboxes', async () => {
    const user = userEvent.setup();
    render(<AthleteSelector {...initialProps} />);

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    expect(screen.getByText('#sport_specific__All_Squads')).toBeInTheDocument();
    expect(screen.getByText('Squad 1')).toBeInTheDocument();
    expect(screen.getByText('Squad 2')).toBeInTheDocument();
  });

  it("doesn't render the button when showDropdownButton is false", () => {
    render(<AthleteSelector {...initialProps} showDropdownButton={false} />);

    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const button = dropdownWrapper.querySelector('button');
    expect(button).not.toBeInTheDocument();
  });

  it("doesn't render the squad list when squads is null", async () => {
    const user = userEvent.setup();
    render(<AthleteSelector {...initialProps} squads={null} />);

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    expect(screen.queryByText('Squad 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Squad 2')).not.toBeInTheDocument();
  });

  describe('when a entire squad is selected', () => {
    const selectedSquadAthletes = {
      ...emptySquadAthletesSelection,
      applies_to_squad: true,
    };

    it('has a valid selection', () => {
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      expect(dropdownWrapper).not.toHaveClass(
        'dropdownWrapper--validationFailure'
      );
    });

    it('renders the entire squad checkbox checked', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const entireSquadTexts = screen.getAllByText(
        '#sport_specific__Entire_Squad'
      );
      const entireSquadCheckbox = entireSquadTexts
        .find((text) => text.closest('.reactCheckbox'))
        ?.closest('.reactCheckbox');
      expect(entireSquadCheckbox).toHaveClass('reactCheckbox--checked');
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking the entire squad checkbox', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find and click the entire squad checkbox
      const entireSquadCheckbox = screen.getByRole('checkbox', {
        name: /#sport_specific__Entire_Squad \(group\)/i,
      });
      await user.click(entireSquadCheckbox);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      });
    });
  });

  describe('when a position group is selected', () => {
    const selectedSquadAthletes = {
      ...emptySquadAthletesSelection,
      position_groups: ['1'],
    };

    it('has a valid selection', () => {
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      expect(dropdownWrapper).not.toHaveClass(
        'dropdownWrapper--validationFailure'
      );
    });

    it('renders the position group checkbox checked', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const positionGroupTexts = screen.getAllByText('Position Group 1');
      const positionGroupCheckbox = positionGroupTexts
        .find((text) => text.closest('.reactCheckbox'))
        ?.closest('.reactCheckbox');
      expect(positionGroupCheckbox).toHaveClass('reactCheckbox--checked');
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking the position group checkbox', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find Position Group 1 checkbox
      const checkboxes = screen.getAllByRole('checkbox');
      const positionGroupCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        return (
          label?.textContent?.includes('Position Group 1') &&
          label?.textContent?.includes('(group)')
        );
      });
      expect(positionGroupCheckbox).toBeDefined();
      await user.click(positionGroupCheckbox);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: ['1'],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      });
    });
  });

  describe('when a position is selected', () => {
    const selectedSquadAthletes = {
      ...emptySquadAthletesSelection,
      positions: ['1'],
    };

    it('has a valid selection', () => {
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      expect(dropdownWrapper).not.toHaveClass(
        'dropdownWrapper--validationFailure'
      );
    });

    it('renders the position checkbox checked', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const positionTexts = screen.getAllByText('Position 1');
      const positionCheckbox = positionTexts
        .find(
          (text) =>
            text.closest('.reactCheckbox') &&
            !text
              .closest('.reactCheckbox')
              ?.querySelector('.reactCheckbox__label')
              ?.textContent?.includes('Position Group')
        )
        ?.closest('.reactCheckbox');
      expect(positionCheckbox).toHaveClass('reactCheckbox--checked');
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking the position checkbox', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find Position 1 checkbox
      const checkboxes = screen.getAllByRole('checkbox');
      const positionCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        const labelText = label?.textContent || '';
        return (
          labelText.includes('Position 1') &&
          labelText.includes('(group)') &&
          !labelText.includes('Position Group')
        );
      });
      expect(positionCheckbox).toBeDefined();
      // Click the parent reactCheckbox div to trigger the toggle
      const reactCheckboxDiv = positionCheckbox.closest('.reactCheckbox');
      expect(reactCheckboxDiv).toBeDefined();
      await user.click(reactCheckboxDiv);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: ['1'],
        athletes: [],
        all_squads: false,
        squads: [],
      });
    });
  });

  describe('when an athlete is selected', () => {
    const selectedSquadAthletes = {
      ...emptySquadAthletesSelection,
      athletes: ['1'],
    };

    it('has a valid selection', () => {
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      expect(dropdownWrapper).not.toHaveClass(
        'dropdownWrapper--validationFailure'
      );
    });

    it('renders the athlete checkbox checked', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const athleteTexts = screen.getAllByText('Athlete 1');
      const athleteCheckbox = athleteTexts
        .find((text) => text.closest('.reactCheckbox'))
        ?.closest('.reactCheckbox');
      expect(athleteCheckbox).toHaveClass('reactCheckbox--checked');
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking the athlete checkbox', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find Athlete 1 checkbox - use getAllByRole to avoid title text
      const checkboxes = screen.getAllByRole('checkbox');
      const athleteCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        return label?.textContent === 'Athlete 1';
      });
      expect(athleteCheckbox).toBeDefined();
      // Click the parent reactCheckbox div to trigger the toggle
      const reactCheckboxDiv = athleteCheckbox.closest('.reactCheckbox');
      expect(reactCheckboxDiv).toBeDefined();
      await user.click(reactCheckboxDiv);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: ['1'],
        all_squads: false,
        squads: [],
      });
    });
  });

  describe('when All Squads is selected', () => {
    const selectedSquadAthletes = {
      ...emptySquadAthletesSelection,
      all_squads: true,
    };

    it('has a valid selection', () => {
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      expect(dropdownWrapper).not.toHaveClass(
        'dropdownWrapper--validationFailure'
      );
    });
  });

  describe('when a squad is selected', () => {
    const selectedSquadAthletes = {
      ...emptySquadAthletesSelection,
      squads: ['1'],
    };

    it('has a valid selection', () => {
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={selectedSquadAthletes}
        />
      );

      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      expect(dropdownWrapper).not.toHaveClass(
        'dropdownWrapper--validationFailure'
      );
    });
  });

  describe('when nothing is selected', () => {
    it('has an invalid selection', () => {
      render(
        <AthleteSelector
          {...initialProps}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
        />
      );

      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      expect(dropdownWrapper).toHaveClass('dropdownWrapper--validationFailure');
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking the entire squad checkbox', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Click entire squad checkbox
      const entireSquadCheckbox = screen.getByRole('checkbox', {
        name: /#sport_specific__Entire_Squad \(group\)/i,
      });
      await user.click(entireSquadCheckbox);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: true,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      });
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking a position group checkbox', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find Position Group 1 checkbox
      const checkboxes = screen.getAllByRole('checkbox');
      const positionGroupCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        return (
          label?.textContent?.includes('Position Group 1') &&
          label?.textContent?.includes('(group)')
        );
      });
      expect(positionGroupCheckbox).toBeDefined();
      await user.click(positionGroupCheckbox);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [1],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      });
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking a position checkbox', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find Position 1 checkbox
      const checkboxes = screen.getAllByRole('checkbox');
      const positionCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        const labelText = label?.textContent || '';
        return (
          labelText.includes('Position 1') &&
          labelText.includes('(group)') &&
          !labelText.includes('Position Group')
        );
      });
      expect(positionCheckbox).toBeDefined();
      // Click the parent reactCheckbox div to trigger the toggle
      const reactCheckboxDiv = positionCheckbox.closest('.reactCheckbox');
      expect(reactCheckboxDiv).toBeDefined();
      await user.click(reactCheckboxDiv);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: [1],
        athletes: [],
        all_squads: false,
        squads: [],
      });
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking an athlete checkbox', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Click Athlete 1 checkbox
      const athleteCheckbox = getCheckboxByLabel('Athlete 1');
      await user.click(athleteCheckbox);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: [1],
        all_squads: false,
        squads: [],
      });
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking Select All (in entire squad)', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find and click Select All button in entire squad section
      const selectAllButtons = screen.getAllByText('Select All');
      await user.click(selectAllButtons[0]);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: ['1', '2', '3', '4'],
        all_squads: false,
        squads: [],
      });
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking Clear (in entire squad)', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={{
            applies_to_squad: true,
            position_groups: ['1', '2'],
            positions: ['1', '2'],
            athletes: ['1', '2', '3', '4'],
            all_squads: true,
            squads: ['1', '2'],
          }}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find and click Clear button in entire squad section
      const clearButtons = screen.getAllByText('Clear');
      await user.click(clearButtons[0]);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: true,
        position_groups: ['1', '2'],
        positions: ['1', '2'],
        athletes: [],
        all_squads: true,
        squads: ['1', '2'],
      });
    });

    it('calls onSelectSquadAthletes with the correct argument when clicking Select All (in a position group)', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find and click Select All button in position group section
      const selectAllButtons = screen.getAllByText('Select All');
      await user.click(selectAllButtons[1]);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: ['1', '2', '3'],
        all_squads: false,
        squads: [],
      });
    });
  });

  it('calls onSelectSquadAthletes with the correct argument when clicking Clear (in a position group)', async () => {
    const user = userEvent.setup();
    const onSelectSquadAthletes = jest.fn();
    render(
      <AthleteSelector
        {...initialProps}
        onSelectSquadAthletes={onSelectSquadAthletes}
        selectedSquadAthletes={{
          applies_to_squad: true,
          position_groups: ['1', '2'],
          positions: ['1', '2'],
          athletes: ['1', '2', '3', '4'],
          all_squads: true,
          squads: ['1', '2'],
        }}
      />
    );

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    // Find and click Clear button in position group section
    const clearButtons = screen.getAllByText('Clear');
    await user.click(clearButtons[1]);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: true,
      position_groups: ['1', '2'],
      positions: ['1', '2'],
      athletes: ['4'],
      all_squads: true,
      squads: ['1', '2'],
    });
  });

  it("calls onSelectSquadAthletes with the correct argument when clicking the 'All Squads' checkbox", async () => {
    const user = userEvent.setup();
    const onSelectSquadAthletes = jest.fn();
    render(
      <AthleteSelector
        {...initialProps}
        onSelectSquadAthletes={onSelectSquadAthletes}
        selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
      />
    );

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    // Click All Squads checkbox
    const allSquadsCheckbox = screen.getByRole('checkbox', {
      name: /#sport_specific__All_Squads \(group\)/i,
    });
    await user.click(allSquadsCheckbox);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: true,
      squads: [],
    });
  });

  it('calls onSelectSquadAthletes with the correct argument when clicking Select All (in a the squad section)', async () => {
    const user = userEvent.setup();
    const onSelectSquadAthletes = jest.fn();
    render(
      <AthleteSelector
        {...initialProps}
        onSelectSquadAthletes={onSelectSquadAthletes}
        selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
      />
    );

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    // Find and click Select All button in squad section (last Select All button)
    const selectAllButtons = screen.getAllByText('Select All');
    await user.click(selectAllButtons[selectAllButtons.length - 1]);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: ['1', '2'],
    });
  });

  it('calls onSelectSquadAthletes with the correct argument when clicking Clear (in a the squad section)', async () => {
    const user = userEvent.setup();
    const onSelectSquadAthletes = jest.fn();
    render(
      <AthleteSelector
        {...initialProps}
        onSelectSquadAthletes={onSelectSquadAthletes}
        selectedSquadAthletes={{
          applies_to_squad: true,
          position_groups: ['1', '2'],
          positions: ['1', '2'],
          athletes: ['1', '2', '3', '4'],
          all_squads: true,
          squads: ['1', '2'],
        }}
      />
    );

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    // Find and click Clear button in squad section (last Clear button)
    const clearButtons = screen.getAllByText('Clear');
    await user.click(clearButtons[clearButtons.length - 1]);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: true,
      position_groups: ['1', '2'],
      positions: ['1', '2'],
      athletes: ['1', '2', '3', '4'],
      all_squads: true,
      squads: [],
    });
  });

  it('calls onSelectSquadAthletes with the correct argument when clicking a squad checkbox', async () => {
    const user = userEvent.setup();
    const onSelectSquadAthletes = jest.fn();
    render(
      <AthleteSelector
        {...initialProps}
        onSelectSquadAthletes={onSelectSquadAthletes}
        selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
      />
    );

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    // Click Squad 1 checkbox - find it by label text
    const checkboxes = screen.getAllByRole('checkbox');
    const squadCheckbox = checkboxes.find((cb) => {
      const label = cb
        .closest('.reactCheckbox')
        ?.querySelector('.reactCheckbox__label');
      return label?.textContent === 'Squad 1';
    });
    expect(squadCheckbox).toBeDefined();
    await user.click(squadCheckbox);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: ['1'],
    });
  });

  describe('filtering', () => {
    it('filters correctly accross position groups, positions, athletes and squads', async () => {
      const user = userEvent.setup();
      render(<AthleteSelector {...initialProps} />);

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Type in search input
      const searchBar = screen.getByRole('search').querySelector('input');
      fireEvent.change(searchBar, { target: { value: '1' } });

      // Check that filtered items are visible
      const positionGroup1Texts = screen.getAllByText('Position Group 1');
      expect(positionGroup1Texts.length).toBeGreaterThan(0);
      expect(screen.getByText('Position 1')).toBeInTheDocument();
      expect(screen.getByText('Athlete 1')).toBeInTheDocument();
      expect(screen.getByText('Squad 1')).toBeInTheDocument();

      // Check that non-matching items are not visible (check for the checkbox item, not the group name)
      const entireSquadCheckbox = screen.queryByRole('checkbox', {
        name: /#sport_specific__Entire_Squad/i,
      });
      expect(entireSquadCheckbox).not.toBeInTheDocument();
    });

    it('filters correctly the position groups', async () => {
      const user = userEvent.setup();
      render(<AthleteSelector {...initialProps} />);

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Type in search input
      const searchBar = screen.getByRole('search').querySelector('input');
      fireEvent.change(searchBar, { target: { value: 'iOn groUp 2' } });

      const positionGroup2Texts = screen.getAllByText('Position Group 2');
      expect(positionGroup2Texts.length).toBeGreaterThan(0);
      // expect(screen.queryByText('#sport_specific__Entire_Squad')).not.toBeInTheDocument();
      expect(screen.queryByText('Position 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Athlete 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Squad 1')).not.toBeInTheDocument();
    });

    it('filters correctly the positions', async () => {
      const user = userEvent.setup();
      render(<AthleteSelector {...initialProps} />);

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Type in search input
      const searchBar = screen.getByRole('search').querySelector('input');
      fireEvent.change(searchBar, { target: { value: 'iOn 2' } });

      expect(screen.getByText('Position 2')).toBeInTheDocument();
      // Check that filtered items are not visible (header/group names may still be visible)
      const entireSquadCheckbox = screen.queryByRole('checkbox', {
        name: /#sport_specific__Entire_Squad/i,
      });
      expect(entireSquadCheckbox).not.toBeInTheDocument();
      // Check that Position Group 1 checkbox is not visible (header text may still be visible)
      const positionGroup1Checkbox = screen.queryByRole('checkbox', {
        name: /Position Group 1/i,
      });
      expect(positionGroup1Checkbox).not.toBeInTheDocument();
      expect(screen.queryByText('Athlete 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Squad 1')).not.toBeInTheDocument();
    });

    it('filters correctly the athletes', async () => {
      const user = userEvent.setup();
      render(<AthleteSelector {...initialProps} />);

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Type in search input
      const searchBar = screen.getByRole('search').querySelector('input');
      fireEvent.change(searchBar, { target: { value: 'aThleTE 2' } });

      expect(screen.getByText('Athlete 2')).toBeInTheDocument();
      // Check that filtered items are not visible (header/group names may still be visible)
      const entireSquadCheckbox = screen.queryByRole('checkbox', {
        name: /#sport_specific__Entire_Squad/i,
      });
      expect(entireSquadCheckbox).not.toBeInTheDocument();
      // Check that Position Group 1 checkbox is not visible (header text may still be visible)
      const positionGroup1Checkbox = screen.queryByRole('checkbox', {
        name: /Position Group 1/i,
      });
      expect(positionGroup1Checkbox).not.toBeInTheDocument();
      expect(screen.queryByText('Position 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Squad 1')).not.toBeInTheDocument();
    });

    it('filters correctly entire squad', async () => {
      const user = userEvent.setup();
      render(<AthleteSelector {...initialProps} />);

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Type in search input
      const searchBar = screen.getByRole('search').querySelector('input');
      fireEvent.change(searchBar, { target: { value: 'tIre_SQua' } });

      const entireSquadTexts = screen.getAllByText(
        '#sport_specific__Entire_Squad'
      );
      expect(entireSquadTexts.length).toBeGreaterThan(0);
      // Check that filtered items are not visible as checkboxes
      const positionGroup1Checkbox = screen.queryByRole('checkbox', {
        name: /Position Group 1/i,
      });
      expect(positionGroup1Checkbox).not.toBeInTheDocument();
      expect(screen.queryByText('Position 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Athlete 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Squad 1')).not.toBeInTheDocument();
    });

    it('filters correctly All Squads', async () => {
      const user = userEvent.setup();
      render(<AthleteSelector {...initialProps} />);

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Type in search input
      const searchBar = screen.getByRole('search').querySelector('input');
      fireEvent.change(searchBar, {
        target: { value: '#sport_specific__All_Squads' },
      });

      expect(
        screen.getByText('#sport_specific__All_Squads')
      ).toBeInTheDocument();
      // Check that filtered items are not visible as checkboxes
      const positionGroup1Checkbox = screen.queryByRole('checkbox', {
        name: /Position Group 1/i,
      });
      expect(positionGroup1Checkbox).not.toBeInTheDocument();
      expect(screen.queryByText('Position 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Athlete 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Squad 1')).not.toBeInTheDocument();
    });

    it('filters correctly the squads', async () => {
      const user = userEvent.setup();
      render(<AthleteSelector {...initialProps} />);

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Type in search input
      const searchBar = screen.getByRole('search').querySelector('input');
      fireEvent.change(searchBar, { target: { value: 'sQuaD 2' } });

      expect(screen.getByText('Squad 2')).toBeInTheDocument();
      // Check that filtered items are not visible (header/group names may still be visible)
      const entireSquadCheckbox = screen.queryByRole('checkbox', {
        name: /#sport_specific__Entire_Squad/i,
      });
      expect(entireSquadCheckbox).not.toBeInTheDocument();
      // Check that Position Group 1 checkbox is not visible (header text may still be visible)
      const positionGroup1Checkbox = screen.queryByRole('checkbox', {
        name: /Position Group 1/i,
      });
      expect(positionGroup1Checkbox).not.toBeInTheDocument();
      expect(screen.queryByText('Position 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Athlete 1')).not.toBeInTheDocument();
    });
  });

  it('shows the selected items', () => {
    const selectedSquadAthletes = {
      applies_to_squad: true,
      position_groups: ['1'],
      positions: ['1'],
      athletes: ['1'],
      all_squads: true,
      squads: ['1'],
    };

    render(
      <AthleteSelector
        {...initialProps}
        selectedSquadAthletes={selectedSquadAthletes}
      />
    );

    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const title = dropdownWrapper.querySelector('.dropdownWrapper__title');
    expect(title).toHaveTextContent(
      '#sport_specific__Entire_Squad, Position Group 1, Position 1, Athlete 1, #sport_specific__All_Squads, Squad 1'
    );
  });

  it('hides the clear all and select all buttons', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AthleteSelector {...initialProps} singleSelection />
    );

    // Open dropdown to see the athleteSelector div
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    const athleteSelector = container.querySelector('.athleteSelector');
    expect(athleteSelector).toHaveClass('athleteSelector--singleSelection');
  });

  it('renders checkboxes with a radio style', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AthleteSelector {...initialProps} singleSelection />
    );

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    // Check that checkboxes have radio style class
    const checkboxes = container.querySelectorAll('.reactCheckbox--radioStyle');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('calls onSelectSquadAthletes with only one selection when clicking an item', async () => {
    const user = userEvent.setup();
    const onSelectSquadAthletes = jest.fn();
    render(
      <AthleteSelector
        {...initialProps}
        onSelectSquadAthletes={onSelectSquadAthletes}
        singleSelection
      />
    );

    // Open dropdown
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    // Select Entire Squad
    const entireSquadCheckbox = screen.getByRole('checkbox', {
      name: /#sport_specific__Entire_Squad \(group\)/i,
    });
    await user.click(entireSquadCheckbox);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: true,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
      labels: [],
      segments: [],
    });

    // Select a Position Group
    const checkboxes = screen.getAllByRole('checkbox');
    const positionGroupCheckbox = checkboxes.find((cb) => {
      const label = cb
        .closest('.reactCheckbox')
        ?.querySelector('.reactCheckbox__label');
      return (
        label?.textContent?.includes('Position Group 1') &&
        label?.textContent?.includes('(group)')
      );
    });
    await user.click(positionGroupCheckbox);

    // Clear previous calls and check the new call
    onSelectSquadAthletes.mockClear();
    await user.click(positionGroupCheckbox);

    // Check the call (should be called once with the new selection)
    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [1],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
      labels: [],
      segments: [],
    });

    // Select a Position
    const positionCheckbox = checkboxes.find((cb) => {
      const label = cb
        .closest('.reactCheckbox')
        ?.querySelector('.reactCheckbox__label');
      return (
        label?.textContent?.includes('Position 1') &&
        label?.textContent?.includes('(group)') &&
        !label?.textContent?.includes('Position Group')
      );
    });
    await user.click(positionCheckbox);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [1],
      athletes: [],
      all_squads: false,
      squads: [],
      labels: [],
      segments: [],
    });

    // Select an Athlete
    const athleteCheckbox = getCheckboxByLabel('Athlete 1');
    await user.click(athleteCheckbox);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [1],
      all_squads: false,
      squads: [],
      labels: [],
      segments: [],
    });

    // Select all Squads
    const allSquadsCheckbox = screen.getByRole('checkbox', {
      name: /#sport_specific__All_Squads \(group\)/i,
    });
    await user.click(allSquadsCheckbox);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: true,
      squads: [],
      labels: [],
      segments: [],
    });

    // Select a Squad
    const squadCheckboxes = screen.getAllByRole('checkbox');
    const squadCheckbox = squadCheckboxes.find((cb) => {
      const label = cb
        .closest('.reactCheckbox')
        ?.querySelector('.reactCheckbox__label');
      return label?.textContent === 'Squad 1';
    });
    expect(squadCheckbox).toBeDefined();
    await user.click(squadCheckbox);

    expect(onSelectSquadAthletes).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: ['1'],
      labels: [],
      segments: [],
    });
  });

  it('shows only the athletes when onlyAthletes is true', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AthleteSelector {...initialProps} onlyAthletes />
    );

    // Open dropdown to see the athleteSelector div
    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
    await user.click(header);

    const athleteSelector = container.querySelector('.athleteSelector');
    expect(athleteSelector).toHaveClass('athleteSelector--onlyAthletes');
  });

  describe('when entire squad is disabled', () => {
    const disabledSquadAthletes = {
      ...emptySquadAthletesSelection,
      applies_to_squad: true,
    };

    it('renders the entire squad checkbox disabled', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const entireSquadCheckbox = screen.getByRole('checkbox', {
        name: /#sport_specific__Entire_Squad \(group\)/i,
      });
      expect(entireSquadCheckbox).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onSelectSquadAthletes when clicking the entire squad checkbox', async () => {
      const user = userEvent.setup();
      const onSelectedSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
          onSelectSquadAthletes={onSelectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const entireSquadCheckbox = screen.getByRole('checkbox', {
        name: /#sport_specific__Entire_Squad \(group\)/i,
      });
      await user.click(entireSquadCheckbox);

      expect(onSelectedSquadAthletes).not.toHaveBeenCalled();
    });
  });

  describe('when a position group is disabled', () => {
    const disabledSquadAthletes = {
      ...emptySquadAthletesSelection,
      position_groups: ['1'],
    };

    it('renders the position group checkbox disabled', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const checkboxes = screen.getAllByRole('checkbox');
      const positionGroupCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        return label?.textContent?.includes('Position Group 1');
      });
      expect(positionGroupCheckbox).toBeDefined();
      expect(positionGroupCheckbox).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onSelectSquadAthletes when clicking the position group checkbox', async () => {
      const user = userEvent.setup();
      const onSelectedSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
          onSelectSquadAthletes={onSelectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const checkboxes = screen.getAllByRole('checkbox');
      const positionGroupCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        return label?.textContent === 'Position Group 1';
      });
      await user.click(positionGroupCheckbox);

      expect(onSelectedSquadAthletes).not.toHaveBeenCalled();
    });
  });

  describe('when a position is disabled', () => {
    const disabledSquadAthletes = {
      ...emptySquadAthletesSelection,
      positions: ['1'],
    };

    it('renders the position checkbox disabled', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const checkboxes = screen.getAllByRole('checkbox');
      const positionCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        return (
          label?.textContent?.includes('Position 1') &&
          !label?.textContent?.includes('Position Group')
        );
      });
      expect(positionCheckbox).toBeDefined();
      expect(positionCheckbox).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onSelectSquadAthletes when clicking the position checkbox', async () => {
      const user = userEvent.setup();
      const onSelectedSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
          onSelectSquadAthletes={onSelectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const checkboxes = screen.getAllByRole('checkbox');
      const positionCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        return label?.textContent === 'Position 1';
      });
      await user.click(positionCheckbox);

      expect(onSelectedSquadAthletes).not.toHaveBeenCalled();
    });
  });

  describe('when an athlete is disabled', () => {
    const disabledSquadAthletes = {
      ...emptySquadAthletesSelection,
      athletes: ['1'],
    };

    it('renders the athlete checkbox as disabled', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const athleteCheckbox = getCheckboxByLabel('Athlete 1');
      expect(athleteCheckbox).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onSelectSquadAthletes when clicking the athlete checkbox', async () => {
      const user = userEvent.setup();
      const onSelectedSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
          onSelectSquadAthletes={onSelectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const athleteCheckbox = getCheckboxByLabel('Athlete 1');
      await user.click(athleteCheckbox);

      expect(onSelectedSquadAthletes).not.toHaveBeenCalled();
    });

    it('excludes disabled athletes when clicking Select All (in entire squad)', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();

      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
          disabledSquadAthletes={disabledSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const selectAllButtons = screen.getAllByText('Select All');
      await user.click(selectAllButtons[0]);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: ['2', '3', '4'],
        all_squads: false,
        squads: [],
      });
    });

    it('excludes disabled athletes when clicking Select All (in a position group)', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();

      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
          disabledSquadAthletes={disabledSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const selectAllButtons = screen.getAllByText('Select All');
      await user.click(selectAllButtons[1]);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: ['2', '3'],
        all_squads: false,
        squads: [],
      });
    });
  });

  describe('when All Squads is disabled', () => {
    const disabledSquadAthletes = {
      ...emptySquadAthletesSelection,
      all_squads: true,
    };

    it('renders the All Squads checkbox as disabled', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const allSquadsCheckbox = screen.getByRole('checkbox', {
        name: /#sport_specific__All_Squads \(group\)/i,
      });
      expect(allSquadsCheckbox).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onSelectSquadAthletes when clicking the athlete checkbox', async () => {
      const user = userEvent.setup();
      const onSelectedSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
          onSelectSquadAthletes={onSelectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const allSquadsCheckbox = screen.getByRole('checkbox', {
        name: /#sport_specific__All_Squads \(group\)/i,
      });
      await user.click(allSquadsCheckbox);

      expect(onSelectedSquadAthletes).not.toHaveBeenCalled();
    });
  });

  describe('when a squad is disabled', () => {
    const disabledSquadAthletes = {
      ...emptySquadAthletesSelection,
      squads: ['1'],
    };

    it('renders the All Squads checkbox as disabled', async () => {
      const user = userEvent.setup();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find Squad 1 checkbox by label text
      const checkboxes = screen.getAllByRole('checkbox');
      const squadCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        return label?.textContent === 'Squad 1';
      });
      expect(squadCheckbox).toBeDefined();
      expect(squadCheckbox).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onSelectSquadAthletes when clicking the athlete checkbox', async () => {
      const user = userEvent.setup();
      const onSelectedSquadAthletes = jest.fn();
      render(
        <AthleteSelector
          {...initialProps}
          disabledSquadAthletes={disabledSquadAthletes}
          onSelectSquadAthletes={onSelectedSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      // Find Squad 1 checkbox by label text
      const checkboxes = screen.getAllByRole('checkbox');
      const squadCheckbox = checkboxes.find((cb) => {
        const label = cb
          .closest('.reactCheckbox')
          ?.querySelector('.reactCheckbox__label');
        return label?.textContent === 'Squad 1';
      });
      expect(squadCheckbox).toBeDefined();
      await user.click(squadCheckbox);

      expect(onSelectedSquadAthletes).not.toHaveBeenCalled();
    });

    it('excludes disabled squads with the correct argument when clicking Select All (in a the squad section)', async () => {
      const user = userEvent.setup();
      const onSelectSquadAthletes = jest.fn();

      render(
        <AthleteSelector
          {...initialProps}
          onSelectSquadAthletes={onSelectSquadAthletes}
          selectedSquadAthletes={cloneDeep(emptySquadAthletesSelection)}
          disabledSquadAthletes={disabledSquadAthletes}
        />
      );

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      const selectAllButtons = screen.getAllByText('Select All');
      await user.click(selectAllButtons[selectAllButtons.length - 1]);

      expect(onSelectSquadAthletes).toHaveBeenCalledWith({
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: ['2'],
      });
    });

    it('renders the loading state for squadAthletes', async () => {
      const user = userEvent.setup();
      render(<AthleteSelector {...initialProps} isFetchingSquadAthletes />);

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      expect(screen.getByText('Loading positions...')).toBeInTheDocument();
    });

    it('renders the loading state for squads', async () => {
      const user = userEvent.setup();
      render(<AthleteSelector {...initialProps} isFetchingSquads />);

      // Open dropdown
      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const header = dropdownWrapper.querySelector('.dropdownWrapper__header');
      await user.click(header);

      expect(screen.getByText('Loading squads...')).toBeInTheDocument();
    });
  });
});
