import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Dropdown from '../index';

describe('Dropdown component', () => {
  const defaultProps = {
    value: null,
    items: [
      {
        title: 'Item 1',
        id: 'item_1',
      },
      {
        title: 'Item 2',
        id: 'item_2',
      },
      {
        title: 'Item 3',
        id: 'item_3',
      },
    ],
    onClickClear: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) => {
    return render(<Dropdown {...props} />);
  };

  it('renders', () => {
    const { container } = renderComponent();
    expect(container.querySelector('.dropdown')).toBeInTheDocument();
  });

  it('has the correct class when invalid is true', () => {
    const { container } = renderComponent({ ...defaultProps, invalid: true });
    expect(container.querySelector('.dropdown')).toHaveClass('hasError');
  });

  it('renders a list of provided items', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();

    // Open dropdown
    await user.click(screen.getByRole('button'));

    // Check if all items are rendered
    defaultProps.items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });

    // Check the right amount of items
    const menuItems = container.querySelectorAll('.customDropdown__menu li');
    expect(menuItems).toHaveLength(3);
  });

  it('Clicking an item fires the callback and passes the item id', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderComponent({ ...defaultProps, onChange });

    // Open dropdown and click second item
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Item 2'));

    expect(onChange).toHaveBeenCalledWith('item_2');
  });

  describe('when label is provided', () => {
    const updatedProps = {
      ...defaultProps,
      label: 'Label Text',
      tooltipSettings: {
        placement: 'bottom-start',
        content: <div className="tooltipOverlay">Overlay text</div>,
        tooltipTriggerElement: <span>Tooltip trigger element</span>,
      },
    };

    it('displays the label text provided', () => {
      renderComponent(updatedProps);
      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });

    it('displays the tooltip trigger element', () => {
      renderComponent(updatedProps);
      expect(screen.getByText('Tooltip trigger element')).toBeInTheDocument();
    });

    it('displays the tooltip overlay with the text provided when the tooltip trigger element is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(updatedProps);

      await user.hover(screen.getByText('Tooltip trigger element'));

      expect(await screen.findByText('Overlay text')).toBeInTheDocument();
    });
  });

  it('sets the value if provided', () => {
    const { container } = renderComponent({
      ...defaultProps,
      value: 'item_1',
      items: [
        { title: 'Item 1', id: 'item_1' },
        { title: 'Item 2', id: 'item_2' },
        { title: 'Item 3', id: 'item_3' },
      ],
    });

    expect(screen.getByRole('button')).toHaveTextContent('Item 1');
    expect(container.querySelector('input')).toHaveValue('item_1');
  });

  describe('when there is a value', () => {
    it('shows the selected item in the dropdown', async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({
        ...defaultProps,
        value: 'item_2',
      });

      await user.click(screen.getByRole('button'));

      const selectedItem = container.querySelector(
        '.customDropdown__item--selected'
      );
      expect(selectedItem).toHaveTextContent('Item 2');
    });
  });

  describe('when the value is not in the items list', () => {
    it('doesnt display the value as text when not found in items and not in the dropdown', async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({
        ...defaultProps,
        value: 'item_4',
      });

      expect(screen.getByRole('button')).not.toHaveTextContent('item_4');

      await user.click(screen.getByRole('button'));

      const selectedItem = container.querySelector(
        '.customDropdown__item--selected'
      );
      expect(selectedItem).not.toBeInTheDocument();
    });
  });

  describe('when the value is an empty string', () => {
    it('handles empty string value', () => {
      renderComponent({ ...defaultProps, value: '' });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('when the value is undefined', () => {
    it('handles undefined value', () => {
      renderComponent({ ...defaultProps, value: undefined });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  it('is disabled when disabled is set to true', () => {
    renderComponent({ ...defaultProps, disabled: true });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables the search bar if the searchable prop is false', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent({
      ...defaultProps,
      items: [
        { title: 'Item 1', id: 'item_1' },
        { title: 'Item 2', id: 'item_2' },
      ],
      searchable: false,
    });

    await user.click(screen.getByRole('button'));

    const searchBar = container.querySelector('.customDropdown__inputFilter');
    expect(searchBar).not.toBeInTheDocument();
  });

  it('enables the search bar if the searchable prop is true', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent({
      ...defaultProps,
      items: [
        { title: 'Item 1', id: 'item_1' },
        { title: 'Item 2', id: 'item_2' },
      ],
      searchable: true,
    });

    await user.click(screen.getByRole('button'));

    const searchBar = container.querySelector('.customDropdown__inputFilter');
    expect(searchBar).toBeInTheDocument();
  });

  it('only shows the items meeting the search term', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent({
      ...defaultProps,
      items: [
        { title: 'Item 1', id: 'item_1' },
        { title: 'Foo Item', id: 'item_2' },
      ],
      searchable: true,
    });

    await user.click(screen.getByRole('button'));

    const searchInput = container.querySelector(
      '.customDropdown__inputFilter input'
    );
    await user.type(searchInput, 'Foo');

    expect(screen.getByText('Foo Item')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  it('shows all the items if the search condition is empty', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent({
      ...defaultProps,
      items: [
        { title: 'Item 1', id: 'item_1' },
        { title: 'Item 2', id: 'item_2' },
      ],
      searchable: true,
    });

    await user.click(screen.getByRole('button'));

    const searchInput = container.querySelector(
      '.customDropdown__inputFilter input'
    );
    await user.clear(searchInput);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('ignores the spaces at both end of the search condition', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent({
      ...defaultProps,
      items: [
        { title: 'Item 1', id: 'item_1' },
        { title: 'Item 2', id: 'item_2' },
      ],
      searchable: true,
    });

    await user.click(screen.getByRole('button'));

    const searchInput = container.querySelector(
      '.customDropdown__inputFilter input'
    );
    await user.type(searchInput, '   item 2       ');

    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  it('shows an error message if none of the items meet the search condition', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent({
      ...defaultProps,
      items: [
        { title: 'Item 1', id: 'item_1' },
        { title: 'Item 2', id: 'item_2' },
      ],
      searchable: true,
    });

    await user.click(screen.getByRole('button'));

    const searchInput = container.querySelector(
      '.customDropdown__inputFilter input'
    );
    const searchValue = '!£0qP ';
    await user.type(searchInput, searchValue);

    const expectedMessage = `No results matched "${searchValue
      .trim()
      .toLocaleLowerCase()}"`;
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('ignores the validation when ignoreValidation is true', () => {
    const { container } = renderComponent({
      ...defaultProps,
      ignoreValidation: true,
    });
    const hiddenInput = container.querySelectorAll('input')[0];
    expect(hiddenInput).toHaveAttribute('data-ignore-validation', 'true');
  });

  describe('when the item list is empty', () => {
    it("doesn't render any item", async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({ ...defaultProps, items: [] });

      await user.click(screen.getByRole('button'));

      const items = container.querySelectorAll('.customDropdown__item');
      expect(items).toHaveLength(0);
    });
  });

  describe('when the dropdown is optional', () => {
    it("renders a 'None' option", async () => {
      const user = userEvent.setup();
      renderComponent({ ...defaultProps, optional: true });

      await user.click(screen.getByRole('button'));

      expect(screen.getAllByText('None').length).toEqual(2);
    });

    describe('when the item list is empty', () => {
      it("doesn't render the option separator", async () => {
        const user = userEvent.setup();
        const { container } = renderComponent({
          ...defaultProps,
          optional: true,
          items: [],
        });

        await user.click(screen.getByRole('button'));

        const separator = container.querySelector(
          '.customDropdown__optionSeparator'
        );
        expect(separator).not.toBeInTheDocument();
      });
    });

    describe('when the the value is null', () => {
      it("the 'None' option is selected", async () => {
        const user = userEvent.setup();
        const { container } = renderComponent({
          ...defaultProps,
          value: null,
          optional: true,
        });

        await user.click(screen.getByRole('button'));

        const noneOption = container.querySelector(
          '.customDropdown__item--selected'
        );
        expect(noneOption).toHaveTextContent('None');
      });
    });

    describe("when clicking the option 'None'", () => {
      it('call onChange with null', async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();
        renderComponent({ ...defaultProps, onChange, optional: true });

        await user.click(screen.getByRole('button'));
        await user.click(screen.getAllByText('None')[1]);

        expect(onChange).toHaveBeenCalledWith(null);
      });
    });

    describe('when hiddenNoneOption is true', () => {
      it('does not display the None option', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          optional: true,
          hiddenNoneOption: true,
        });

        await user.click(screen.getByRole('button'));

        expect(screen.queryByText('None')).not.toBeInTheDocument();
      });
    });
  });

  describe('when displayEmptyText is true and there are no items in options', () => {
    it('displays the default empty message', async () => {
      const user = userEvent.setup();
      renderComponent({ ...defaultProps, items: [], displayEmptyText: true });

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('No items available')).toBeInTheDocument();
    });

    describe('when the emptyText is also provided', () => {
      it('displays the given empty message', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          items: [],
          displayEmptyText: true,
          emptyText: 'There are no game options available.',
        });

        await user.click(screen.getByRole('button'));

        expect(
          screen.getByText('There are no game options available.')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when clearBtn is true', () => {
    it('calls onClickClear when clicking the clear button', async () => {
      const user = userEvent.setup();

      const { container } = renderComponent({
        ...defaultProps,
        clearBtn: true,
      });

      const clearButton = container.querySelector('.customDropdown__clear');
      await user.click(clearButton);

      expect(clearButton).toBeInTheDocument();
      expect(defaultProps.onClickClear).toHaveBeenCalledTimes(1);
    });
  });
});
