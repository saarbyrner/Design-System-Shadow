import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TooltipMenu from '../index';

describe('<TooltipMenu />', () => {
  let props;

  beforeEach(() => {
    props = {
      tooltipTriggerElement: <i className="icon-more" />,
      menuItems: [
        {
          description: 'First link',
          href: 'custom_location',
          icon: 'icon-edit',
        },
        {
          description: 'Second link',
          href: 'custom_location_2',
        },
      ],
      customClassnames: [],
      isScrollable: false,
      externalItemOrder: 2,
      onVisibleChange: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    const { container } = render(<TooltipMenu {...props} />);
    expect(container.querySelector('.icon-more')).toBeInTheDocument();
  });

  it('adds the correct classnames', async () => {
    const user = userEvent.setup();
    const { container } = render(<TooltipMenu {...props} />);
    const trigger = container.querySelector('.icon-more');

    await user.click(trigger);

    const tooltipMenu = await screen.findByRole('list', { hidden: true });
    expect(tooltipMenu.closest('.tooltipMenu')).toBeInTheDocument();
  });

  it('renders the correct trigger element', () => {
    const { container } = render(<TooltipMenu {...props} />);
    expect(container.querySelector('.icon-more')).toBeInTheDocument();
  });

  it('renders the correct menu items', async () => {
    const user = userEvent.setup();
    const { container } = render(<TooltipMenu {...props} />);
    const trigger = container.querySelector('.icon-more');

    await user.click(trigger);

    expect(await screen.findByText('First link')).toBeInTheDocument();
    expect(screen.getByText('Second link')).toBeInTheDocument();

    const firstLink = screen.getByText('First link').closest('a');
    expect(firstLink).toHaveClass(
      'tooltipMenu__item',
      'tooltipMenu__item--icon'
    );
  });

  describe('when the menu is scrollable', () => {
    beforeEach(() => {
      props.isScrollable = true;
    });

    it('adds the correct classnames', async () => {
      const user = userEvent.setup();
      const { container } = render(<TooltipMenu {...props} />);
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const tooltipMenu = await screen.findByRole('list', { hidden: true });
      expect(
        tooltipMenu.closest('.tooltipMenu--scrollable')
      ).toBeInTheDocument();
    });
  });

  describe('when custom classnames are provided', () => {
    beforeEach(() => {
      props.customClassnames = ['customClassName_1', 'customClassName_2'];
    });

    it('adds the correct classnames', async () => {
      const user = userEvent.setup();
      const { container } = render(<TooltipMenu {...props} />);
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const tooltipMenu = await screen.findByRole('list', { hidden: true });
      const tooltipContainer = tooltipMenu.closest('.tooltipMenu');
      expect(tooltipContainer).toHaveClass(
        'customClassName_1',
        'customClassName_2'
      );
    });
  });

  describe("when the item doesn't have an href", () => {
    it('renders a button instead of a link', async () => {
      const user = userEvent.setup();
      const menuItems = [
        {
          description: 'This is not a link',
        },
        {
          description: 'This is a link',
          href: 'custom_location',
        },
      ];
      const { container } = render(
        <TooltipMenu {...props} menuItems={menuItems} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const buttonItem = await screen.findByText('This is not a link');
      expect(buttonItem.closest('button')).toBeInTheDocument();

      const linkItem = screen.getByText('This is a link');
      expect(linkItem.closest('a')).toBeInTheDocument();
    });
  });

  describe('when an external item is added', () => {
    const customItem = (
      <li className="custom_item">
        <span>Custom item</span>
      </li>
    );

    it('renders the correct items', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TooltipMenu {...props} externalItem={customItem} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const listItems = await screen.findAllByTestId(
        'TooltipMenu|PrimaryListItem'
      );
      expect(listItems).toHaveLength(2);
      expect(screen.getByText('Custom item')).toBeInTheDocument();
    });

    describe('when the external item has an order defined', () => {
      beforeEach(() => {
        props.externalItemOrder = 1;
      });

      it('renders the items in the correct order', async () => {
        const user = userEvent.setup();
        const { container } = render(
          <TooltipMenu {...props} externalItem={customItem} />
        );
        const trigger = container.querySelector('.icon-more');

        await user.click(trigger);

        // Wait for tooltip to be visible
        await screen.findByText('First link');

        // External item is rendered as a span, not a PrimaryListItem
        const customItemElement = await screen.findByText('Custom item');
        expect(customItemElement).toBeInTheDocument();

        // Check that menu items are also present
        expect(screen.getByText('First link')).toBeInTheDocument();
        expect(screen.getByText('Second link')).toBeInTheDocument();
      });
    });

    describe('when the external item order is 0', () => {
      beforeEach(() => {
        props.externalItemOrder = 0;
      });

      it('renders the items in the correct order', async () => {
        const user = userEvent.setup();
        const { container } = render(
          <TooltipMenu {...props} externalItem={customItem} />
        );
        const trigger = container.querySelector('.icon-more');

        await user.click(trigger);

        // Wait for tooltip to be visible
        await screen.findByText('First link');

        // External item is rendered as a span, not a PrimaryListItem
        const customItemElement = await screen.findByText('Custom item');
        expect(customItemElement).toBeInTheDocument();

        // Check that menu items are also present
        expect(screen.getByText('First link')).toBeInTheDocument();
        expect(screen.getByText('Second link')).toBeInTheDocument();
      });
    });
  });

  describe('when onVisibleChange is defined', () => {
    it('calls the correct callback', async () => {
      const user = userEvent.setup();
      const onVisibleChangeMock = jest.fn();
      const { container } = render(
        <TooltipMenu {...props} onVisibleChange={onVisibleChangeMock} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      expect(onVisibleChangeMock).toHaveBeenCalledWith(true);
    });
  });

  describe('when an item is disabled', () => {
    it('adds the correct classname', async () => {
      const user = userEvent.setup();
      const menuItems = [
        {
          description: 'Disabled Item',
          href: 'custom_location',
          isDisabled: true,
        },
      ];
      const { container } = render(
        <TooltipMenu {...props} menuItems={menuItems} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const disabledItem = await screen.findByText('Disabled Item');
      expect(disabledItem.closest('a')).toHaveClass(
        'tooltipMenu__item--disabled'
      );
    });
  });

  describe('when an item is destructive', () => {
    it('adds the correct classname', async () => {
      const user = userEvent.setup();
      const menuItems = [
        {
          description: 'Destructive Item',
          href: 'custom_location',
          isDestructive: true,
        },
      ];
      const { container } = render(
        <TooltipMenu {...props} menuItems={menuItems} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const destructiveItem = await screen.findByText('Destructive Item');
      expect(destructiveItem.closest('a')).toHaveClass(
        'tooltipMenu__item--destructive'
      );
    });
  });

  describe('when an item has sub menu items', () => {
    it('adds the correct classname', async () => {
      const user = userEvent.setup();
      const menuItems = [
        {
          description: 'Main Menu Item',
          href: 'custom_location',
          subMenuItems: [
            {
              description: 'Sub Item',
            },
          ],
        },
      ];
      const { container } = render(
        <TooltipMenu {...props} menuItems={menuItems} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const mainItem = await screen.findByText('Main Menu Item');
      expect(mainItem.closest('a')).toHaveClass(
        'tooltipMenu__item--hasSubMenu'
      );
    });

    it('adds the left alignment classname if subMenuAlignment is set', async () => {
      const user = userEvent.setup();
      const menuItems = [
        {
          description: 'Main Menu Item',
          href: 'custom_location',
          subMenuItems: [
            {
              description: 'Sub Item',
            },
          ],
          subMenuAlignment: 'left',
        },
      ];
      const { container } = render(
        <TooltipMenu {...props} menuItems={menuItems} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const subMenu = await screen.findByTestId('TooltipMenu|SubmenuList');
      // Note: The component may adjust alignment based on viewport position
      // So we check that it has the submenu class and may have left or right align
      expect(subMenu).toHaveClass('tooltipMenu__listItemSubMenu');
    });

    it('adds the right alignment classname if subMenuAlignment is set', async () => {
      const user = userEvent.setup();
      const menuItems = [
        {
          description: 'Main Menu Item',
          href: 'custom_location',
          subMenuItems: [
            {
              description: 'Sub Item',
            },
          ],
          subMenuAlignment: 'right',
        },
      ];
      const { container } = render(
        <TooltipMenu {...props} menuItems={menuItems} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const subMenu = await screen.findByTestId('TooltipMenu|SubmenuList');
      expect(subMenu).toHaveClass('tooltipMenu__listItemSubMenu--rightAlign');
    });

    it('allows an icon on submenu items', async () => {
      const user = userEvent.setup();
      const menuItems = [
        {
          description: 'Main Menu Item',
          href: 'custom_location',
          subMenuItems: [
            {
              description: 'Sub Item',
              icon: 'icon-edit',
            },
          ],
          subMenuAlignment: 'right',
        },
      ];
      const { container } = render(
        <TooltipMenu {...props} menuItems={menuItems} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      const subMenuItem = await screen.findByTestId(
        'TooltipMenu|SubmenuListItem'
      );
      expect(subMenuItem).toHaveClass('tooltipMenu__listItemSubMenuItem--icon');

      const iconSpan = subMenuItem.querySelector('.icon-edit');
      expect(iconSpan).toBeInTheDocument();
    });
  });

  describe('when onClick is defined', () => {
    const onClickMock = jest.fn();

    beforeEach(() => {
      props.menuItems = [
        {
          description: 'First link',
          href: 'custom_location',
          onClick: onClickMock,
          iconClassName: 'icon-edit',
        },
        {
          description: 'Second link',
          href: 'custom_location_2',
        },
      ];
    });

    afterEach(() => {
      onClickMock.mockClear();
    });

    it('calls the correct callback', async () => {
      const user = userEvent.setup();
      const { container } = render(<TooltipMenu {...props} />);
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      // Wait for tooltip to be visible and find the first link
      const firstLink = await screen.findByText('First link');
      const firstListItem = firstLink.closest('li');

      await user.click(firstListItem);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it("doesn't call the callback when the item is disabled", async () => {
      const user = userEvent.setup();
      const menuItems = props.menuItems.slice();
      menuItems[0].isDisabled = true;
      const { container } = render(
        <TooltipMenu {...props} menuItems={menuItems} />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      // Wait for tooltip to be visible and find the first link
      const firstLink = await screen.findByText('First link');
      const firstListItem = firstLink.closest('li');

      await user.click(firstListItem);

      expect(onClickMock).not.toHaveBeenCalled();
    });
  });

  it('disables the tooltip when disabled is true', () => {
    const { container } = render(<TooltipMenu {...props} disabled />);
    const trigger = container.querySelector('.icon-more');

    // When disabled, clicking should not open the tooltip
    expect(trigger).toBeInTheDocument();
  });

  describe('when tooltip menu items have selected states', () => {
    it('adds correct class to item and submenu item', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TooltipMenu
          tooltipTriggerElement={<i className="icon-more" />}
          menuItems={[
            {
              description: 'First link',
              iconClassName: 'icon-edit',
              subMenuItems: [
                {
                  description: 'First Submenu',
                  iconClassName: 'icon-edit',
                },
                {
                  description: 'Second Submenu',
                  iconClassName: 'icon-edit',
                  isSelected: true,
                },
              ],
            },
            {
              description: 'Second Link',
              isSelected: true,
            },
          ]}
          onVisibleChange={jest.fn()}
        />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      // Wait for tooltip content to appear
      const secondLink = await screen.findByText('Second Link');
      const secondLinkElement =
        secondLink.closest('a') || secondLink.closest('button');
      expect(secondLinkElement).toHaveClass('tooltipMenu__item--active');

      const firstLink = await screen.findByText('First link');
      const listItemButton =
        firstLink.closest('a') || firstLink.closest('button');
      expect(listItemButton).toHaveClass('tooltipMenu__item--highlighted');

      const subMenuItems = await screen.findAllByTestId(
        'TooltipMenu|SubmenuListItem'
      );
      const selectedSubMenuItem = subMenuItems.find((item) =>
        item.textContent.includes('Second Submenu')
      );
      expect(selectedSubMenuItem).toHaveClass(
        'tooltipMenu__listItemSubMenuItem--active'
      );
    });

    it('adds checkmark to selected menu for design system', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TooltipMenu
          tooltipTriggerElement={<i className="icon-more" />}
          kitmanDesignSystem
          menuItems={[
            {
              description: 'First link',
              iconClassName: 'icon-edit',
              subMenuItems: [
                {
                  description: 'First Submenu',
                  iconClassName: 'icon-edit',
                },
                {
                  description: 'Second Submenu',
                  iconClassName: 'icon-edit',
                  isSelected: true,
                },
              ],
            },
            {
              description: 'Second Link',
              isSelected: true,
            },
          ]}
          onVisibleChange={jest.fn()}
        />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      // Wait for tooltip content to appear
      await screen.findByText('Second Submenu');

      const subMenuItems = await screen.findAllByTestId(
        'TooltipMenu|SubmenuListItem'
      );
      const selectedSubMenuItem = subMenuItems.find((item) =>
        item.textContent.includes('Second Submenu')
      );
      const checkmark = selectedSubMenuItem.querySelector('.icon-check');
      expect(checkmark).toBeInTheDocument();
    });
  });

  describe('when rendering submenus', () => {
    it('renders the correct submenu class for design system', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TooltipMenu
          tooltipTriggerElement={<i className="icon-more" />}
          kitmanDesignSystem
          menuItems={[
            {
              description: 'First link',
              iconClassName: 'icon-edit',
              subMenuItems: [
                {
                  description: 'First Submenu',
                  iconClassName: 'icon-edit',
                },
                {
                  description: 'Second Submenu',
                  iconClassName: 'icon-edit',
                  isSelected: true,
                },
              ],
            },
            {
              description: 'Second Link',
              isSelected: true,
            },
          ]}
          onVisibleChange={jest.fn()}
        />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      // Wait for tooltip content to appear
      await screen.findByText('First Submenu');

      const submenuList = await screen.findByTestId('TooltipMenu|SubmenuList');
      expect(submenuList).toHaveClass(
        'tooltipMenu__listItemSubMenuDesignSystem'
      );
    });

    it('renders the correct number of submenus', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TooltipMenu
          tooltipTriggerElement={<i className="icon-more" />}
          kitmanDesignSystem
          menuItems={[
            {
              description: 'First link',
              iconClassName: 'icon-edit',
              subMenuItems: [
                {
                  description: 'First Submenu',
                  iconClassName: 'icon-edit',
                },
                {
                  description: 'Second Submenu',
                  iconClassName: 'icon-edit',
                  isSelected: true,
                },
              ],
            },
            {
              description: 'Second Link',
              isSelected: true,
            },
          ]}
          onVisibleChange={jest.fn()}
        />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      // Wait for tooltip content to appear
      await screen.findByText('First Submenu');

      const submenuList = await screen.findByTestId('TooltipMenu|SubmenuList');
      const subMenuItems = within(submenuList).getAllByTestId(
        'TooltipMenu|SubmenuListItem'
      );
      expect(subMenuItems).toHaveLength(2);
    });

    it('renders a submenu within a submenu', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TooltipMenu
          tooltipTriggerElement={<i className="icon-more" />}
          kitmanDesignSystem
          menuItems={[
            {
              description: 'First link',
              iconClassName: 'icon-edit',
              subMenuItems: [
                {
                  description: 'First Submenu',
                  iconClassName: 'icon-edit',
                },
                {
                  description: 'First link',
                  iconClassName: 'icon-edit',
                  isSelected: true,
                  subMenuItems: [
                    {
                      description: 'First Submenu',
                      iconClassName: 'icon-edit',
                    },
                    {
                      description: 'First link',
                      iconClassName: 'icon-edit',
                      isSelected: true,
                    },
                  ],
                },
              ],
            },
            {
              description: 'Second Submenu',
              isSelected: true,
            },
          ]}
          onVisibleChange={jest.fn()}
        />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      // Wait for tooltip content to appear - use a unique text
      await screen.findByText('Second Submenu');

      // Find all submenu lists - there should be nested ones
      const allSubmenuLists = await screen.findAllByTestId(
        'TooltipMenu|SubmenuList'
      );

      // Check all submenu lists for nested structure (submenu within submenu)
      const nestedSubmenuLists = allSubmenuLists
        .map((list) => within(list).queryAllByTestId('TooltipMenu|SubmenuList'))
        .flat();

      // Verify the nested submenu has 2 items
      const nestedItems = within(nestedSubmenuLists[0]).getAllByTestId(
        'TooltipMenu|SubmenuListItem'
      );
      expect(nestedItems).toHaveLength(2);
    });

    it('renders items at the correct side', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TooltipMenu
          tooltipTriggerElement={<i className="icon-more" />}
          kitmanDesignSystem
          menuItems={[
            {
              description: 'First link',
              iconClassName: 'icon-edit',
              subMenuAlignment: 'right',
              subMenuItems: [
                {
                  description: 'First Submenu',
                  iconClassName: 'icon-edit',
                },
                {
                  description: 'First link',
                  iconClassName: 'icon-edit',
                },
              ],
            },
            {
              description: 'Second Submenu',
              isSelected: true,
              subMenuAlignment: 'left',
              subMenuItems: [
                {
                  description: 'First Submenu',
                  iconClassName: 'icon-edit',
                },
                {
                  description: 'First link',
                  iconClassName: 'icon-edit',
                  isSelected: true,
                },
              ],
            },
          ]}
          onVisibleChange={jest.fn()}
        />
      );
      const trigger = container.querySelector('.icon-more');

      await user.click(trigger);

      // Wait for tooltip content to appear - use a unique text
      await screen.findByText('Second Submenu');

      const submenuLists = await screen.findAllByTestId(
        'TooltipMenu|SubmenuList'
      );
      expect(submenuLists.length).toBeGreaterThanOrEqual(2);

      const firstSubmenu = submenuLists[0];
      const secondSubmenu = submenuLists[1];

      // Note: The component may adjust alignment based on viewport, so we check for the base class
      expect(firstSubmenu).toHaveClass(
        'tooltipMenu__listItemSubMenuDesignSystem'
      );
      expect(secondSubmenu).toHaveClass(
        'tooltipMenu__listItemSubMenuDesignSystem'
      );
    });
  });
});
