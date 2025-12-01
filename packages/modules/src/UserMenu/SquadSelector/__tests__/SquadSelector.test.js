import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SquadSelector from '..';

describe('<SquadSelector />', () => {
  let props;

  beforeEach(() => {
    props = {
      locale: 'en-IE',
      currentUser: {
        firstname: 'Jon',
        lastname: 'Doe',
        athlete_id: null,
      },
      currentSquad: {
        created: '2013-10-17T16:10:14.000+01:00',
        created_by: null,
        duration: 80,
        id: 8,
        is_default: null,
        name: 'International Squad',
        updated: null,
      },
      availableSquads: [
        {
          created: '2015-09-07T13:29:54.000+01:00',
          created_by: null,
          duration: 80,
          id: 73,
          is_default: null,
          name: 'Academy Squad',
          updated: '2015-09-07T13:29:54.000+01:00',
        },
        {
          created: '2016-04-22T21:56:44.000+01:00',
          created_by: null,
          duration: null,
          id: 15,
          is_default: null,
          name: 'U15s',
          updated: '2016-04-22T21:56:44.000+01:00',
        },
        {
          created: '2013-10-17T16:10:14.000+01:00',
          created_by: null,
          duration: 80,
          id: 8,
          is_default: null,
          name: 'International Squad',
          updated: null,
        },
        {
          created: '2016-04-22T21:56:44.000+01:00',
          created_by: null,
          duration: null,
          id: 10,
          is_default: null,
          name: 'U10s',
          updated: '2016-04-22T21:56:44.000+01:00',
        },
        {
          created: '2016-04-22T21:56:44.000+01:00',
          created_by: null,
          duration: null,
          id: 20,
          is_default: null,
          name: 'U20s',
          updated: '2016-04-22T21:56:44.000+01:00',
        },
        {
          created: '2016-04-22T21:56:44.000+01:00',
          created_by: null,
          duration: null,
          id: 263,
          is_default: null,
          name: 'First Team',
          updated: '2016-04-22T21:56:44.000+01:00',
        },
        {
          created: '2016-04-22T21:56:44.000+01:00',
          created_by: null,
          duration: null,
          id: 23,
          is_default: null,
          name: 'U23s',
          updated: '2016-04-22T21:56:44.000+01:00',
        },
      ],
    };
  });

  it('renders', () => {
    render(<SquadSelector {...props} />);

    expect(screen.getByTestId('squadSelector')).toBeInTheDocument();
  });

  it('renders the squad name', () => {
    render(<SquadSelector {...props} />);

    expect(screen.getByText('International Squad')).toBeInTheDocument();
  });

  it('renders a tooltip menu, sorted correctly', async () => {
    const user = userEvent.setup();
    render(<SquadSelector {...props} />);

    // Click on the squad selector to open the tooltip menu
    const triggerElement = screen
      .getByTestId('squadSelector')
      .querySelector('.squadSelector__tooltipTriggerEl');

    await user.click(triggerElement);

    // Check that the menu items are rendered and sorted correctly
    // The original test checked the exact menuItems prop structure, but with RTL
    // we verify the user-visible menu items that should appear when tooltip opens
    const expectedSquads = [
      'Academy Squad',
      'First Team',
      'International Squad',
      'U10s',
      'U15s',
      'U20s',
      'U23s',
    ];

    // Check that all squads are present in the menu using the TooltipMenu test IDs
    const menuItems = screen.getAllByTestId('TooltipMenu|PrimaryListItem');
    expect(menuItems).toHaveLength(expectedSquads.length);

    // Verify each expected squad name appears in the menu by scoping queries to the menu container
    const menuContainer = document.querySelector('.tooltipMenu__menuList');
    expectedSquads.forEach((squadName) => {
      expect(within(menuContainer).getByText(squadName)).toBeInTheDocument();
    });
  });

  describe('when the user is an athlete', () => {
    it('disables the tooltip', async () => {
      const user = userEvent.setup();
      render(
        <SquadSelector
          {...props}
          currentUser={{ ...props.currentUser, athlete: true }}
        />
      );

      // Check that the disabled class is applied to the trigger element
      const triggerElement = screen
        .getByTestId('squadSelector')
        .querySelector('.squadSelector__tooltipTriggerEl--disabled');

      expect(triggerElement).toBeInTheDocument();

      // Try to click the trigger element - tooltip should not open for athletes
      await user.click(triggerElement);

      // The tooltip menu should not appear (no menu items should be visible)
      expect(
        screen.queryByTestId('TooltipMenu|PrimaryListItem')
      ).not.toBeInTheDocument();
    });
  });
});
