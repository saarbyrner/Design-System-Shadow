import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import AthleteAndStaffSelector from '..';

const squad1 = {
  id: 'S01',
  name: 'squad1',
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
              firstname: 'Athlete',
              lastname: '1',
              fullname: 'Athlete 1',
              user_id: 'uid1',
            },
            {
              id: '2',
              firstname: 'Athlete',
              lastname: '2',
              fullname: 'Athlete 2',
              user_id: 'uid2',
            },
          ],
        },
        {
          id: '2',
          name: 'Position 2',
          athletes: [
            {
              id: '3',
              firstname: 'Athlete',
              lastname: '3',
              fullname: 'Athlete 3',
              user_id: 'uid3',
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
              firstname: 'Athlete',
              lastname: '4',
              fullname: 'Athlete 4',
              user_id: 'uid4',
            },
          ],
        },
      ],
    },
  ],
};

const squad2 = {
  id: 'S02',
  name: 'squad2',
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
              firstname: 'Athlete',
              lastname: '1',
              fullname: 'Athlete 1',
              user_id: 'uid1',
            },
            {
              id: '5',
              firstname: 'Searchable Athlete',
              lastname: '5',
              fullname: 'Searchable Athlete 5',
              user_id: 'uid5',
            },
          ],
        },
      ],
    },
  ],
};

const emptyAthletesAndStaffSelection = {
  athletes: [],
  staff: [],
};

const staff = [
  {
    id: 'uidStaff1',
    firstname: 'staff',
    lastname: 'member 1',
    username: 'staff1',
  },
  {
    id: 'uidStaff2',
    firstname: 'staff',
    lastname: 'member 2',
    username: 'staff2',
  },
  {
    id: 'uidStaff3',
    firstname: 'staff',
    lastname: 'member 3',
    username: 'staff3',
  },
  {
    id: 'uidStaff4',
    firstname: 'Searchable',
    lastname: 'member 4',
    username: 'staff4',
  },
];

const initialProps = {
  squads: [squad1, squad2],
  staff,
  useUserIdsForAthletes: true,
  selection: emptyAthletesAndStaffSelection,
  onSelectionChanged: jest.fn(),
  t: (t) => t,
};

describe('<AthleteAndStaffSelector />', () => {
  it('renders the squad names and all staff as accordion labels', () => {
    render(<AthleteAndStaffSelector {...initialProps} />);
    expect(screen.getByText('squad1')).toBeInTheDocument();
    expect(screen.getByText('squad2')).toBeInTheDocument();
    expect(screen.getByText('All Staff')).toBeInTheDocument();
  });

  it('renders plus buttons for athletes if actionElement is set to PLUS_BUTTON', () => {
    render(
      <AthleteAndStaffSelector {...initialProps} actionElement="PLUS_BUTTON" />
    );
    const plusButton = screen.getByRole('button', { name: /squad1/i });
    expect(plusButton).toBeInTheDocument();
  });

  describe('when athletes are selected', () => {
    const withAthletesAlreadySelected = {
      athletes: ['uid1', 'uid2'],
      staff: [],
    };

    it('renders the expected checkboxes checked', () => {
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAlreadySelected}
          useUserIdsForAthletes
        />
      );
      const checkbox1 = container.querySelector(
        '[aria-labelledby="uid1_label"]'
      );
      expect(checkbox1).toHaveAttribute('aria-checked', 'true');
      const checkbox2 = container.querySelector(
        '[aria-labelledby="uid2_label"]'
      );
      expect(checkbox2).toHaveAttribute('aria-checked', 'true');
      const checkbox3 = container.querySelector(
        '[aria-labelledby="uid3_label"]'
      );
      expect(checkbox3).toHaveAttribute('aria-checked', 'false');
    });

    it('calls onSelectionChanged when selecting an athlete', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAlreadySelected}
          useUserIdsForAthletes
        />
      );
      const checkbox = container.querySelector(
        '[aria-labelledby="uid3_label"]'
      );
      await user.click(checkbox);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['uid1', 'uid2', 'uid3'],
        staff: [],
      });
    });

    it('calls onSelectionChanged when deselecting an athlete', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAlreadySelected}
          useUserIdsForAthletes
        />
      );
      const checkbox = container.querySelector(
        '[aria-labelledby="uid2_label"]'
      );
      await user.click(checkbox);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['uid1'],
        staff: [],
      });
    });

    it('calls onSelectionChanged when selecting an entire squad', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector {...initialProps} useUserIdsForAthletes />
      );
      const headerWithSelectAllElement = container.querySelector(
        '.athleteAndStaffSelector__entireSectionHeader'
      );
      const selectAll = headerWithSelectAllElement.querySelector(
        '.athleteAndStaffSelector__selectAll'
      );
      expect(selectAll).toBeInTheDocument();
      await user.click(selectAll);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['uid1', 'uid2', 'uid3', 'uid4'],
        staff: [],
      });
    });

    it('calls onSelectionChanged when clearing an entire squad', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAlreadySelected}
          useUserIdsForAthletes
        />
      );
      const headerWithSelectAllElement = container.querySelector(
        '.athleteAndStaffSelector__entireSectionHeader'
      );
      const clearAll = headerWithSelectAllElement.querySelector(
        '.athleteAndStaffSelector__clearAll'
      );
      expect(clearAll).toBeInTheDocument();
      await user.click(clearAll);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: [],
        staff: [],
      });
    });

    it('calls onSelectionChanged when selecting an position group', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector {...initialProps} useUserIdsForAthletes />
      );
      const headerWithSelectAllElement = container.querySelectorAll(
        '.athleteAndStaffSelector__section'
      );
      const selectAll = headerWithSelectAllElement[1].querySelector(
        '.athleteAndStaffSelector__selectAll'
      );
      expect(selectAll).toBeInTheDocument();
      await user.click(selectAll);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['uid4'],
        staff: [],
      });
    });

    it('calls onSelectionChanged when clear an position group', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAlreadySelected}
          useUserIdsForAthletes
        />
      );
      const headerWithSelectAllElement = container.querySelectorAll(
        '.athleteAndStaffSelector__section'
      );
      const selectAll = headerWithSelectAllElement[0].querySelector(
        '.athleteAndStaffSelector__clearAll'
      );
      expect(selectAll).toBeInTheDocument();
      await user.click(selectAll);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: [],
        staff: [],
      });
    });
  });

  describe('when staff are selected', () => {
    const withStaffAlreadySelected = {
      athletes: [],
      staff: ['uidStaff1', 'uidStaff2'],
    };

    it('renders the expected checkboxes checked', () => {
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withStaffAlreadySelected}
          actionElement="CHECKBOX"
        />
      );

      const checkbox1 = container.querySelector(
        '[aria-labelledby="uidStaff1_label"]'
      );
      expect(checkbox1).toHaveAttribute('aria-checked', 'true');
      const checkbox2 = container.querySelector(
        '[aria-labelledby="uidStaff2_label"]'
      );
      expect(checkbox2).toHaveAttribute('aria-checked', 'true');
      const checkbox3 = container.querySelector(
        '[aria-labelledby="uidStaff3_label"]'
      );
      expect(checkbox3).toHaveAttribute('aria-checked', 'false');
      const checkbox4 = container.querySelector(
        '[aria-labelledby="uidStaff4_label"]'
      );
      expect(checkbox4).toHaveAttribute('aria-checked', 'false');
    });

    it('calls onSelectionChanged when selecting a staff checkbox', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withStaffAlreadySelected}
          actionElement="CHECKBOX"
        />
      );
      const checkbox = container.querySelector(
        '[aria-labelledby="uidStaff3_label"]'
      );
      await user.click(checkbox);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: [],
        staff: ['uidStaff1', 'uidStaff2', 'uidStaff3'],
      });
    });

    it('calls onSelectionChanged when deselecting a staff checkbox', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withStaffAlreadySelected}
          actionElement="CHECKBOX"
        />
      );
      const checkbox = container.querySelector(
        '[aria-labelledby="uidStaff1_label"]'
      );
      await user.click(checkbox);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: [],
        staff: ['uidStaff2'],
      });
    });
  });

  describe('when athletes and staff are selected', () => {
    const withAthletesAndStaffAlreadySelected = {
      athletes: ['uid5'],
      staff: ['uidStaff2'],
    };

    it('appends to the selected athletes when selecting an entire position group for a squad', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAndStaffAlreadySelected}
          useUserIdsForAthletes
        />
      );
      const headerWithSelectAllElement = container.querySelector(
        '.athleteAndStaffSelector__entireSectionHeader'
      );
      const selectAll = headerWithSelectAllElement.querySelector(
        '.athleteAndStaffSelector__selectAll'
      );
      await user.click(selectAll);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['uid5', 'uid1', 'uid2', 'uid3', 'uid4'],
        staff: ['uidStaff2'],
      });
    });

    it('appends to the selected staff when selecting an entire position group for a squad', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAndStaffAlreadySelected}
          useUserIdsForAthletes
        />
      );
      const selectAllStaff = container.querySelector('#staffSelectAll');
      await user.click(selectAllStaff);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['uid5'],
        staff: ['uidStaff1', 'uidStaff2', 'uidStaff3', 'uidStaff4'],
      });
    });

    it('maintains the selection outside the position when clearing all staff', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAndStaffAlreadySelected}
          useUserIdsForAthletes
        />
      );
      const clearAllStaff = container.querySelector('#staffClearAll');
      await user.click(clearAllStaff);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['uid5'],
        staff: [],
      });
    });
  });

  describe('when singleSelection is true', () => {
    const withAthletesAndStaffAlreadySelected = {
      athletes: ['uid1', 'uid2'],
      staff: ['uidStaff1'],
    };
    it('does not show select all or clear all options', () => {
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAndStaffAlreadySelected}
          singleSelection
        />
      );
      expect(
        container.querySelector('.athleteAndStaffSelector__selectAll')
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('.athleteAndStaffSelector__clearAll')
      ).not.toBeInTheDocument();
    });

    it('clears athletes when a staff checkbox is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAndStaffAlreadySelected}
          singleSelection
        />
      );
      const checkbox = container.querySelector(
        '[aria-labelledby="uidStaff3_label"]'
      );
      await user.click(checkbox);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: [],
        staff: ['uidStaff3'],
      });
    });

    it('clears staff when an athlete checkbox is checked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AthleteAndStaffSelector
          {...initialProps}
          selection={withAthletesAndStaffAlreadySelected}
          singleSelection
        />
      );
      const checkbox = container.querySelector(
        '[aria-labelledby="uid3_label"]'
      );
      await user.click(checkbox);
      expect(initialProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['uid3'],
        staff: [],
      });
    });
  });

  describe('NFL — renders the moved athletes', () => {
    const movedAthletes = [
      { id: 1, firstname: 'Test NFL', lastname: 'Infra' },
      { id: 2, firstname: 'Johnny', lastname: 'Football' },
    ];
    let onSelectionChanged = jest.fn();

    afterEach(() => {
      onSelectionChanged = jest.fn();
    });

    it('renders moved athlete names', () => {
      render(
        <AthleteAndStaffSelector
          selection={{ athletes: [], staff: [] }}
          onSelectionChanged={onSelectionChanged}
          movedAthletes={movedAthletes}
          t={(key) => key}
        />
      );

      movedAthletes.forEach(({ firstname, lastname }) => {
        expect(
          screen.getByText(`${firstname} ${lastname}`)
        ).toBeInTheDocument();
      });
    });

    it('selects an athlete when clicked', async () => {
      const user = userEvent.setup();
      render(
        <AthleteAndStaffSelector
          selection={{ athletes: [], staff: [] }}
          onSelectionChanged={onSelectionChanged}
          movedAthletes={movedAthletes}
          t={(key) => key}
        />
      );

      // Using for...of loop instead of forEach method to prevent the errors
      // about overlapping `act` calls.
      // eslint-disable-next-line no-restricted-syntax
      for (const { id, firstname, lastname } of movedAthletes) {
        // eslint-disable-next-line no-await-in-loop
        await user.click(screen.getByText(`${firstname} ${lastname}`));

        expect(onSelectionChanged).toHaveBeenCalledWith({
          athletes: [`${id}`],
          staff: [],
        });
      }
    });

    it('selects all moved athletes when ‘Select all moved athletes’ button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <AthleteAndStaffSelector
          selection={{ athletes: [], staff: [] }}
          onSelectionChanged={onSelectionChanged}
          movedAthletes={movedAthletes}
          t={(key) => key}
        />
      );

      await user.click(screen.getByText('Select All'));

      expect(onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['1', '2'],
        staff: [],
      });
    });

    it('clears all moved athletes squad when ‘Clear’ button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <AthleteAndStaffSelector
          selection={{ athletes: [], staff: [] }}
          onSelectionChanged={onSelectionChanged}
          movedAthletes={movedAthletes}
          t={(key) => key}
        />
      );

      await user.click(screen.getByText('Clear'));

      expect(onSelectionChanged).toHaveBeenCalledWith({
        athletes: [],
        staff: [],
      });
    });

    it('selects an athlete when clicked and ‘singleSelection’ prop is passed', async () => {
      const user = userEvent.setup();
      render(
        <AthleteAndStaffSelector
          selection={{ athletes: [], staff: [] }}
          onSelectionChanged={onSelectionChanged}
          movedAthletes={movedAthletes}
          t={(key) => key}
          // singleSelection passes `id`s of athletes to
          // updateAthletesSelection rather than objects.
          singleSelection
        />
      );

      const { id, firstname, lastname } = movedAthletes[0];
      await user.click(screen.getByText(`${firstname} ${lastname}`));

      expect(onSelectionChanged).toHaveBeenCalledWith({
        athletes: [`${id}`],
        staff: [],
      });
    });
  });
});
