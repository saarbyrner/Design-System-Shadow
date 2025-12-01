import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import SelectComponents from '../Components';

describe('<SelectComponents.Label />', () => {
  const labelProps = {
    isDisabled: false,
    onClickIcon: jest.fn(),
  };

  it('the icon buttons exist', async () => {
    const props = {
      ...labelProps,
      label: 'My Label1',
      icon: 'icon-close',
    };
    const { container } = render(<SelectComponents.Label {...props} />);
    const hasIconButtonClass =
      container.querySelectorAll('.iconButton').length > 0;

    expect(hasIconButtonClass).toBeTruthy();
  });

  it('hide icon', async () => {
    const props = {
      label: 'My Label1',
    };
    const { container } = render(<SelectComponents.Label {...props} />);
    const hasIconButtonClass =
      container.querySelectorAll('.iconButton').length > 0;

    expect(hasIconButtonClass).toBeFalsy();
  });
});

describe('<SelectComponents.OptionalOrRequiredFlag />', () => {
  it('render optional text', () => {
    render(<SelectComponents.OptionalOrRequiredFlag optional />);

    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('render required text', () => {
    render(<SelectComponents.OptionalOrRequiredFlag required />);

    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});

describe('<SelectComponents.SearchInput />', () => {
  const mockProps = {
    value: '',
    onChange: jest.fn(),
    placeholder: 'Test Placeholder',
    onBlur: jest.fn(),
  };
  it('render SearchInput', async () => {
    render(<SelectComponents.SearchInput {...mockProps} />);

    expect(
      screen.getByPlaceholderText(mockProps.placeholder)
    ).toBeInTheDocument();
  });
});

describe('<SelectComponents.Submenu />', () => {
  const mockProps = {
    data: {
      label: 'Testing Label',
      options: [],
    },
    onChange: jest.fn(),
    isOpen: false,
    onOpen: jest.fn(),
    onHover: jest.fn(),
    onHoverExit: jest.fn(),
    currentValue: null,
    multiSelectSubMenu: false,
    showSubmenuActions: false,
    isMulti: false,
    asyncSubmenu: false,
    index: null,
    noOptionsMessage: 'Test No Options Message',
    errorLoadingMessage: 'Test No Error Loading Message',
    loadingMessage: 'Test Loading Message',
  };
  it('render Submenu', async () => {
    render(<SelectComponents.Submenu {...mockProps} />);

    expect(screen.getByText(mockProps.data.label)).toBeInTheDocument();
  });
});

describe('<SelectComponents.Root />', () => {
  it('render Root children', async () => {
    render(
      <SelectComponents.Root>
        <div>Testing</div>
      </SelectComponents.Root>
    );

    expect(screen.getByText('Testing')).toBeInTheDocument();
  });
});

describe('<SelectComponents.BackButton />', () => {
  const props = {
    label: 'Test Text',
    setSelectedParentOption: jest.fn(),
  };
  it('renders the given text as the back button', async () => {
    render(<SelectComponents.BackButton {...props} />);

    expect(screen.getByText(props.label)).toBeInTheDocument();
  });

  it('clicking the back button sets the parent option to null', async () => {
    render(<SelectComponents.BackButton {...props} />);

    await userEvent.click(screen.getByText(props.label));
    expect(props.setSelectedParentOption).toHaveBeenCalledWith(null);
  });
});

describe('<SelectComponents.PaginatedMenuList />', () => {
  const props = {
    filteredOptions: [
      { value: 1, label: 'Parent No Children' },
      {
        value: 2,
        label: 'Parent With Children',
        options: [
          { value: 3, label: 'Child' },
          { value: 4, label: 'Child 2' },
        ],
      },
    ],
    setSelectedParentOption: jest.fn(),
    selectProps: {
      onChange: jest.fn(),
      onMenuClose: jest.fn(),
    },
  };

  it('renders a page of parents properly', () => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <SelectComponents.PaginatedList {...props} />
      </VirtuosoMockContext.Provider>
    );

    expect(
      screen.getByText(props.filteredOptions[0].label)
    ).toBeInTheDocument();
    expect(
      screen.getByText(props.filteredOptions[1].label)
    ).toBeInTheDocument();
  });

  it('if an option with children is selected, the option is set as the selecte parent', async () => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <SelectComponents.PaginatedList {...props} />
      </VirtuosoMockContext.Provider>
    );

    await userEvent.click(screen.getByText(props.filteredOptions[1].label));

    expect(props.setSelectedParentOption).toHaveBeenCalledWith(
      props.filteredOptions[1]
    );
  });

  it('renders a page of children properly', () => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <SelectComponents.PaginatedList
          {...props}
          filteredOptions={props.filteredOptions[1].options}
        />
      </VirtuosoMockContext.Provider>
    );

    expect(
      screen.queryByText(props.filteredOptions[0].label)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(props.filteredOptions[1].label)
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(props.filteredOptions[1].options[0].label)
    ).toBeInTheDocument();
    expect(
      screen.getByText(props.filteredOptions[1].options[1].label)
    ).toBeInTheDocument();
  });

  it('if an option without children is selected, proper follow up calls are made', async () => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <SelectComponents.PaginatedList {...props} />
      </VirtuosoMockContext.Provider>
    );

    await userEvent.click(screen.getByText(props.filteredOptions[0].label));

    expect(props.setSelectedParentOption).toHaveBeenCalledWith(null);
    expect(props.selectProps.onChange).toHaveBeenCalledWith(
      props.filteredOptions[0]
    );
    expect(props.selectProps.onMenuClose).toHaveBeenCalled();
  });
});
