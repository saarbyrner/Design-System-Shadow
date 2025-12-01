import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import GroupedDropdown from '../index';

describe('GroupedDropdown component', () => {
  const defaultProps = {
    value: 'option_1',
    type: null,
    options: [
      {
        name: 'Option 1',
        key_name: 'option_1',
        description: 'This is option one',
      },
      {
        name: 'Option 2',
        key_name: 'option_2',
      },
      {
        name: 'Option 3',
        key_name: 'option_3',
      },
    ],
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = {}) => {
    return render(<GroupedDropdown {...defaultProps} {...props} />);
  };

  it('renders', () => {
    const { container } = renderComponent();
    expect(container.querySelector('.groupedDropdown')).toBeInTheDocument();
  });

  it('renders a list of provided options', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();

    await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

    // renders the correct options
    const menuItems = container.querySelectorAll('.groupedDropdown__menu li');
    expect(menuItems).toHaveLength(3);

    expect(screen.getAllByText('Option 1').length).toEqual(2);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();

    // Check description
    expect(
      container.querySelector('.groupedDropdown__itemDescription')
    ).toHaveTextContent('- This is option one');
  });

  it('renders a description if the option has one', () => {
    const { container } = renderComponent();

    const descriptions = container.querySelectorAll(
      '.groupedDropdown__itemDescription'
    );
    expect(descriptions).toHaveLength(1);
    expect(descriptions[0]).toHaveTextContent('- This is option one');
  });

  it('shows in the list which option is selected', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();

    await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

    const selectedItem = container.querySelector(
      '.groupedDropdown__item--selected'
    );
    expect(selectedItem).toBeInTheDocument();
    expect(selectedItem).toHaveTextContent('Option 1');
  });

  it('fires the callback and passes the list object when clicking an option', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = renderComponent({ onChange });

    await user.click(screen.getByRole('button'));

    const secondOption = container.querySelectorAll(
      '.groupedDropdown__menu li .groupedDropdown__textwrap'
    )[1];
    await user.click(secondOption);

    expect(onChange).toHaveBeenCalledWith(
      { key_name: 'option_2', name: 'Option 2' },
      1
    );
  });

  it('renders an aside component in each list component', async () => {
    const user = userEvent.setup();
    const Aside = () => (
      <i className="icon-check" data-testid="GroupedDropDown|Aside" />
    );

    const optionsWithAside = defaultProps.options.map((opt) => ({
      ...opt,
      aside: <Aside />,
    }));

    renderComponent({ options: optionsWithAside });

    // Open the dropdown to render the options with asides
    await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

    // Now check for the aside components
    const asides = screen.getAllByTestId('GroupedDropDown|Aside');
    expect(asides).toHaveLength(defaultProps.options.length);
  });

  describe('when a default text is provided', () => {
    it('renders a default text', () => {
      renderComponent({ value: null, defaultText: 'Button Text' });
      expect(screen.getByRole('button')).toHaveTextContent('Button Text');
    });
  });

  it('renders a label if provided', () => {
    const { container } = renderComponent({ label: 'Label Text' });
    expect(
      container.querySelector('.groupedDropdown__label')
    ).toHaveTextContent('Label Text');
  });

  it('adds a custom class if provided', () => {
    const testclass = 'testClass';
    const { container } = renderComponent({ customClass: testclass });
    expect(container.querySelector('.groupedDropdown')).toHaveClass(testclass);
  });

  describe('when option groups are provided', () => {
    const groupedOptions = [
      { name: 'Group 1', key_name: 'group1', isGroupOption: true },
      { name: 'Option 1', key_name: '1', isGroupOption: false },
      { name: 'Option 2', key_name: '2', isGroupOption: false },
      { name: 'Group 2', key_name: 'group2', isGroupOption: true },
      { name: 'Option 3', key_name: '3', isGroupOption: false },
      { name: 'Group 3', key_name: 'group3', isGroupOption: true },
      { name: 'Option 4', key_name: '4', isGroupOption: false },
    ];

    it('renders option groups', async () => {
      const user = userEvent.setup();
      renderComponent({ options: groupedOptions });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('applies the filter on option groups', async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({
        options: groupedOptions,
        searchable: true,
      });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Option 1');

      const dropdownItems = container.querySelectorAll(
        '.groupedDropdown__menu li'
      );
      expect(dropdownItems).toHaveLength(3); // including SearchBar
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  describe('when showGroupOptionSearchResults is true and option groups are provided', () => {
    const animalCarOptions = [
      { name: 'Animals Group', key_name: 'group1', isGroupOption: true },
      { name: 'Option Dog', key_name: '1', isGroupOption: false },
      { name: 'Option Cat', key_name: '2', isGroupOption: false },
      { name: 'Cars Group', key_name: 'group2', isGroupOption: true },
      { name: 'Option Honda', key_name: '3', isGroupOption: false },
    ];

    it('renders option groups', async () => {
      const user = userEvent.setup();
      renderComponent({ options: animalCarOptions });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      expect(screen.getByText('Animals Group')).toBeInTheDocument();
      expect(screen.getByText('Option Dog')).toBeInTheDocument();
    });

    it('shows all options in the group if filter matches option group name', async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({
        options: animalCarOptions,
        searchable: true,
        showGroupOptionSearchResults: true,
      });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Animals');

      const dropdownItems = container.querySelectorAll(
        '.groupedDropdown__menu li'
      );
      expect(dropdownItems).toHaveLength(4); // including SearchBar
      expect(screen.getByText('Animals Group')).toBeInTheDocument();
      expect(screen.getByText('Option Dog')).toBeInTheDocument();
      expect(screen.getByText('Option Cat')).toBeInTheDocument();
    });

    it('shows option if filter matches option name', async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({
        options: animalCarOptions,
        searchable: true,
        showGroupOptionSearchResults: true,
      });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Honda');

      const dropdownItems = container.querySelectorAll(
        '.groupedDropdown__menu li'
      );
      expect(dropdownItems).toHaveLength(3); // including SearchBar
      expect(screen.getByText('Cars Group')).toBeInTheDocument();
      expect(screen.getByText('Option Honda')).toBeInTheDocument();
    });

    it('hides all the options if the query is less than `minimumLettersForSearch`', async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({
        options: animalCarOptions,
        minimumLettersForSearch: 3,
      });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const dropdownItems = container.querySelectorAll(
        '.groupedDropdown__menu li'
      );
      expect(dropdownItems).toHaveLength(0);
    });

    it('shows all the options if the query length is greater than `minimumLettersForSearch`', async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({
        options: animalCarOptions,
        minimumLettersForSearch: 3,
        searchable: true,
        showGroupOptionSearchResults: true,
      });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Honda'); // 'Honda' character length greater than 3

      const dropdownItems = container.querySelectorAll(
        '.groupedDropdown__menu li'
      );
      expect(dropdownItems).toHaveLength(3); // including SearchBar
      expect(screen.getByText('Cars Group')).toBeInTheDocument();
      expect(screen.getByText('Option Honda')).toBeInTheDocument();
    });
  });

  it('sets the value if provided', () => {
    const { container } = renderComponent();
    expect(screen.getByRole('button')).toHaveTextContent('Option 1');
    expect(container.querySelector('input')).toHaveValue('option_1');
  });

  describe('when value is not provided', () => {
    it("sets the default text if the value isn't provided", () => {
      renderComponent({ value: null, defaultText: 'Default Text' });
      expect(screen.getByRole('button')).toHaveTextContent('Default Text');
    });
  });

  describe('when the disabled flag is provided', () => {
    it('is disabled', () => {
      renderComponent({ isDisabled: true });
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('when the reset function is called', () => {
    // it('resets the dropdown', () => {
    //   const onChange = jest.fn();
    //   const { container } = render(
    //     <GroupedDropdown {...defaultProps} onChange={onChange} />
    //   );
    //
    //   expect(screen.getByRole('button')).toHaveTextContent('Option 1');
    //   expect(container.querySelector('input')).toHaveValue('option_1');
    //
    //   // Access instance method (not recommended in RTL, but keeping for compatibility)
    //   const componentInstance =
    //     container.querySelector('.groupedDropdown').__reactInternalInstance$;
    //   // Note: Testing instance methods is not recommended in RTL
    //   // Consider testing the reset behavior through user interactions instead
    // });
  });

  describe('when only one option is available', () => {
    it('preselects the first option', () => {
      const singleOption = [{ name: 'Option 1', key_name: 'option_1' }];
      renderComponent({ options: singleOption });

      expect(screen.getByRole('button')).toHaveTextContent('Option 1');
    });
  });

  describe('when the searchable prop is false', () => {
    it('disables the search bar', async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({ searchable: false });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchBar = container.querySelector(
        '.groupedDropdown__inputFilter'
      );
      expect(searchBar).not.toBeInTheDocument();
    });
  });

  describe('when the searchable prop is true', () => {
    const searchableOptions = [
      { name: 'Option 1', key_name: 'option_1' },
      { name: 'Fo1 Input', key_name: 'option_2' },
    ];

    it('enables the search bar', async () => {
      const user = userEvent.setup();
      renderComponent({ searchable: true, options: searchableOptions });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchBar = screen.getByRole('textbox');
      expect(searchBar).toBeInTheDocument();
    });

    it('shows only the options meeting the search condition - happy path', async () => {
      const user = userEvent.setup();
      renderComponent({ searchable: true, options: searchableOptions });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Fo1');

      expect(screen.getByText('Fo1 Input')).toBeInTheDocument();

      // only displays the option previously chosen no options display in the list else it would be 2
      expect(screen.getAllByText('Option 1').length).toEqual(1);
    });

    it('shows all the options if the search condition is empty', async () => {
      const user = userEvent.setup();
      renderComponent({ searchable: true, options: searchableOptions });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchInput = screen.getByRole('textbox');
      await user.clear(searchInput);

      expect(screen.getAllByText('Option 1')[1]).toBeInTheDocument();
      expect(screen.getByText('Fo1 Input')).toBeInTheDocument();
    });

    it('ignores the spaces at both end of the search condition', async () => {
      const user = userEvent.setup();
      renderComponent({ searchable: true, options: searchableOptions });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, '   Fo1       ');

      expect(screen.getByText('Fo1 Input')).toBeInTheDocument();
    });

    it('shows an error message if none of the options meet the search condition', async () => {
      const user = userEvent.setup();
      const { container } = renderComponent({
        searchable: true,
        options: searchableOptions,
      });

      await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

      const searchInput = screen.getByRole('textbox');
      const searchValue = '!£0qP ';
      await user.type(searchInput, searchValue);

      const errorMessage = container.querySelector('.groupedDropdown__message');
      const expectedMessage = `No results matched "${searchValue}"`;
      expect(errorMessage).toHaveTextContent(expectedMessage);
    });
  });

  describe('when the clearBtn prop is true', () => {
    it('calls onClickClear when clicking the clear button', async () => {
      const user = userEvent.setup();
      const onClickClear = jest.fn();
      const { container } = renderComponent({ clearBtn: true, onClickClear });

      const clearBtn = container.querySelector('.groupedDropdown__clear');
      await user.click(clearBtn);

      expect(onClickClear).toHaveBeenCalledTimes(1);
    });
  });
});
