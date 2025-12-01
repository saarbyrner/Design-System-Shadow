import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PlayerSelection from '..';

describe('PlayerSelection', () => {
  const squads = [
    {
      id: 1,
      name: 'Squad 1',
      position_groups: [
        {
          id: 1,
          name: 'Position Group 1',
          positions: [
            {
              id: 1,
              name: 'Position 1',
              athletes: [
                {
                  id: 1,
                  fullname: 'John Doe',
                  avatar_url: 'https://example.com/avatar.png',
                  availability: 'available',
                  designation: 'Primary',
                },
              ],
            },
            {
              id: 4,
              name: 'Position 4',
              athletes: [
                {
                  id: 4,
                  fullname: 'Athlete 4',
                  avatar_url: 'https://example.com/avatar.png',
                  availability: 'available',
                },
              ],
            },
          ],
        },
        {
          id: 3,
          name: 'Position Group 3',
          positions: [
            {
              id: 3,
              name: 'Position 3',
              athletes: [
                {
                  id: 3,
                  fullname: 'Athlete 3',
                  avatar_url: 'https://example.com/avatar.png',
                  availability: 'available',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Squad 2',
      position_groups: [
        {
          id: 2,
          name: 'Position Group 2',
          positions: [
            {
              id: 2,
              name: 'Position 2',
              athletes: [
                {
                  id: 2,
                  fullname: 'John Wick',
                  avatar_url: 'https://example.com/avatar.png',
                  availability: 'available',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const selection = {
    athletes: [],
  };

  const defaultProps = {
    squads,
    gameActivities: [],
    selection,
    onSelectionChanged: jest.fn(),
    movedAthletes: [],
    maxSelectedAthletes: 18,
    isImportedGame: false,
    showPlayerAddedError: false,
    setShowPlayerAddedError: jest.fn(),
    t: i18nextTranslateStub(),
    hideAvailabilityStatus: false,
  };

  const renderComponent = (props = defaultProps) =>
    render(<PlayerSelection {...props} />);

  describe('initial render', () => {
    beforeEach(() => {
      renderComponent({ ...defaultProps, isImportedGame: true });
    });

    test('renders squad names', () => {
      expect(screen.getByText('Squad 1')).toBeInTheDocument();
      expect(screen.getByText('Squad 2')).toBeInTheDocument();
    });

    test('renders position group names', () => {
      expect(screen.getByText('Position Group 1')).toBeInTheDocument();
      expect(screen.getByText('Position Group 2')).toBeInTheDocument();
      expect(screen.getByText('Position Group 3')).toBeInTheDocument();
    });

    test('renders athlete names', () => {
      const athleteNameElement = screen.getByText('John Doe');
      expect(athleteNameElement).toBeInTheDocument();
    });

    test('selects an athlete when clicked', () => {
      fireEvent.click(screen.getByText('John Doe'));
      expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['1'],
      });
    });

    test('expands and collapses a squad when clicked', () => {
      const accordionTitle = screen.getByText('Squad 1');
      fireEvent.click(accordionTitle);
      const accordionContent = screen.getAllByTestId('accordion-content')[0];
      expect(accordionContent).toHaveStyle({
        display: 'block',
      });
      fireEvent.click(accordionTitle);
      expect(accordionContent).toHaveStyle({
        display: 'none',
      });
    });

    test('selects entire squad when "Select entire squad" is clicked', () => {
      const selectAllLink = screen.getAllByText('Select entire squad')[0];
      fireEvent.click(selectAllLink);

      expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['1', '4', '3'],
      });
    });

    test('clears entire squad when "Clear" is clicked', () => {
      const clearAllLink = screen.getAllByText('Clear')[0];
      fireEvent.click(clearAllLink);

      expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: [],
      });
    });

    it('renders athlete position name with its designation', () => {
      const athleteNameElement = screen.getByText('Position 1 - Primary');
      expect(athleteNameElement).toBeInTheDocument();
    });
  });

  describe('NFL - renders the moved athletes', () => {
    const movedAthletes = [
      { id: 1, firstname: 'Test NFL', lastname: 'Infra' },
      { id: 2, firstname: 'Johnny', lastname: 'Football' },
    ];
    beforeEach(() => {
      renderComponent({ ...defaultProps, movedAthletes });
    });
    test('renders moved athlete names', () => {
      movedAthletes.forEach(({ firstname, lastname }) => {
        expect(
          screen.getByText(`${firstname} ${lastname}`)
        ).toBeInTheDocument();
      });
    });

    test('selects an athlete when clicked', async () => {
      movedAthletes.forEach(({ id, firstname, lastname }) => {
        fireEvent.click(screen.getByText(`${firstname} ${lastname}`));
        expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
          athletes: [`${id}`],
        });
      });
    });

    test('selects all moved athletes when "Select all moved athletes" is clicked', () => {
      const selectAllLink = screen.getByText('Select all moved athletes');
      fireEvent.click(selectAllLink);

      expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['1', '2'],
      });
    });

    test('clears all moved athletes squad when "Clear" is clicked', () => {
      const clearAllLink = screen.getAllByText('Clear')[1];
      fireEvent.click(clearAllLink);

      expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: [],
      });
    });
  });

  describe('render with game activities', () => {
    const mockActivities = [
      { absolute_minute: 0, relation_id: null, kind: 'goal', athlete_id: 1 },
      {
        absolute_minute: 50,
        relation_id: null,
        kind: 'goal',
        athlete_id: 4,
      },
    ];

    it('does not remove players with activities when clearing selections', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        selection: { athletes: ['1', '2', '4'] },
        gameActivities: mockActivities,
      });

      await user.click(screen.getAllByText('Clear')[1]);
      expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['1', '4'],
      });
    });

    it('does not remove players with activities when deselecting position groups', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        selection: { athletes: ['1', '2', '4'] },
        gameActivities: mockActivities,
      });

      await user.click(screen.getByText('Position Group 2'));
      await user.click(screen.getByText('Position Group 2'));
      expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['1', '4'],
      });
    });

    describe('Imported Game - render player added error', () => {
      it('displays the error when adding a player over the cap', async () => {
        renderComponent({
          ...defaultProps,
          selection: { athletes: ['1', '4'] },
          isImportedGame: true,
          maxSelectedAthletes: 2,
        });

        await userEvent.click(screen.getByText('John Wick'));
        expect(defaultProps.setShowPlayerAddedError).toHaveBeenCalledWith(true);
      });

      it('does not display the error when having multiple selections of the same player if under max still', async () => {
        renderComponent({
          ...defaultProps,
          selection: { athletes: ['1', '1'] },
          isImportedGame: true,
          maxSelectedAthletes: 3,
        });
        await userEvent.click(screen.getAllByText('Select entire squad')[0]);
        expect(defaultProps.setShowPlayerAddedError).not.toHaveBeenCalled();
      });

      it('removes the error when removing a player that was over the cap', async () => {
        renderComponent({
          ...defaultProps,
          selection: { athletes: ['1', '2', '4'] },
          gameActivities: mockActivities,
          showPlayerAddedError: true,
          isImportedGame: true,
          maxSelectedAthletes: 2,
        });
        await userEvent.click(screen.getByText('John Wick'));
        expect(defaultProps.setShowPlayerAddedError).toHaveBeenCalledWith(
          false
        );
      });
    });
  });

  describe('render with game statuses', () => {
    const disciplineSquads = [
      {
        ...squads[0],
        position_groups: [
          {
            ...squads[0].position_groups[0],
            positions: [
              {
                ...squads[0].position_groups[0].positions[0],
                athletes: [
                  {
                    ...squads[0].position_groups[0].positions[0].athletes[0],
                    game_status: {
                      status: 'available',
                      selectable: true,
                      description: '',
                    },
                  },
                ],
              },
              {
                ...squads[0].position_groups[0].positions[1],
                athletes: [
                  {
                    ...squads[0].position_groups[0].positions[1].athletes[0],
                    game_status: {
                      status: 'ineligible',
                      selectable: false,
                      description: 'Ineligible - Yellow card',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    it('renders the eligibility statuses', () => {
      renderComponent({ ...defaultProps, squads: disciplineSquads });
      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.getByText('Ineligible')).toBeInTheDocument();
    });

    it('renders the ineligible tooltip', async () => {
      const user = userEvent.setup();
      renderComponent({ ...defaultProps, squads: disciplineSquads });
      await user.hover(screen.getByText('Ineligible'));
      expect(
        await screen.findByText('Ineligible - Yellow card')
      ).toBeInTheDocument();
    });

    it('does not allow ineligible players to be selected', async () => {
      const user = userEvent.setup();
      renderComponent({ ...defaultProps, squads: disciplineSquads });
      await user.click(screen.getByText('Select entire squad'));
      expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['1'],
      });
      await user.click(screen.getByText('Position Group 1'));
      expect(defaultProps.onSelectionChanged).toHaveBeenCalledWith({
        athletes: ['1'],
      });
      defaultProps.onSelectionChanged.mockReset();
      await user.click(screen.getByText('Athlete 4'));
      expect(defaultProps.onSelectionChanged).not.toHaveBeenCalled();
    });

    it('does not render availability status if it is hidden', async () => {
      renderComponent({
        ...defaultProps,
        squads: disciplineSquads,
        hideAvailabilityStatus: true,
      });
      expect(screen.queryByText('Unavailable')).not.toBeInTheDocument();
    });
  });

  describe('disabled position grouping', () => {
    it('does not render groups', () => {
      renderComponent({ ...defaultProps, disablePositionGrouping: true });

      expect(screen.queryByText('Position Group 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Position Group 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Position Group 3')).not.toBeInTheDocument();
    });
  });
});
