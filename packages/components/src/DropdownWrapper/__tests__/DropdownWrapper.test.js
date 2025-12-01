import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DropdownWrapper from '../index';

describe('DropdownWrapper Component', () => {
  const props = {
    onTypeSearchTerm: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the children correctly', async () => {
    render(
      <DropdownWrapper {...props}>
        <div className="child">Child</div>
      </DropdownWrapper>
    );

    const dropdownWrapperHeader = screen
      .getByTestId('DropdownWrapper')
      .querySelector('.dropdownWrapper__header');
    await userEvent.click(dropdownWrapperHeader);

    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('shows a label if one is passed', () => {
    render(<DropdownWrapper {...props} label="Test Label" />);

    expect(
      screen.getByTestId('DropdownWrapper').querySelector('label')
    ).toHaveTextContent('Test Label');
  });

  it('shows a title if one is passed', () => {
    render(<DropdownWrapper {...props} dropdownTitle="Dropdown title" />);

    expect(
      screen
        .getByTestId('DropdownWrapper')
        .querySelector('.dropdownWrapper__title')
    ).toHaveTextContent('Dropdown title');
  });

  it('renders the Optional text when passed isOptional', () => {
    render(<DropdownWrapper {...props} isOptional />);

    expect(
      screen
        .getByTestId('DropdownWrapper')
        .querySelector('.dropdownWrapper__optional')
    ).toBeInTheDocument();
  });

  it('opens when the user clicks the dropdown', async () => {
    render(<DropdownWrapper {...props} />);

    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    expect(dropdownWrapper).not.toHaveClass('dropdownWrapper--open');

    const dropdownWrapperHeader = dropdownWrapper.querySelector(
      '.dropdownWrapper__header'
    );
    await userEvent.click(dropdownWrapperHeader);

    expect(dropdownWrapper).toHaveClass('dropdownWrapper--open');
  });

  describe('when the dropdown is disabled', () => {
    it('renders a disabled dropdown', () => {
      render(<DropdownWrapper {...props} disabled />);

      expect(screen.getByTestId('DropdownWrapper')).toHaveClass(
        'dropdownWrapper--disabled'
      );
    });

    it("doesn't open when the user clicks the dropdown", async () => {
      render(<DropdownWrapper {...props} disabled />);

      const dropdownWrapper = screen.getByTestId('DropdownWrapper');
      const dropdownWrapperHeader = dropdownWrapper.querySelector(
        '.dropdownWrapper__header'
      );
      await userEvent.click(dropdownWrapperHeader);

      expect(dropdownWrapper).not.toHaveClass('dropdownWrapper--open');
    });
  });

  it('renders a SearchBar if passed hasSearch and is open', async () => {
    render(<DropdownWrapper {...props} hasSearch />);

    const dropdownWrapperHeader = screen
      .getByTestId('DropdownWrapper')
      .querySelector('.dropdownWrapper__header');
    await userEvent.click(dropdownWrapperHeader);

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('does not render the dropdown button when passed false for showDropdownButton', () => {
    render(<DropdownWrapper {...props} showDropdownButton={false} />);

    const dropdownWrapper = screen.getByTestId('DropdownWrapper');

    expect(
      dropdownWrapper.querySelector('.dropdownWrapper__header')
    ).not.toBeInTheDocument();
    expect(
      dropdownWrapper.querySelector('.dropdownWrapper__title')
    ).not.toBeInTheDocument();
    expect(
      dropdownWrapper.querySelector('.dropdownWrapper__caret')
    ).not.toBeInTheDocument();
  });

  it('applies the customClass', () => {
    render(
      <DropdownWrapper
        {...props}
        customClass="dropdownWrapper--validationFailure"
      />
    );

    expect(screen.getByTestId('DropdownWrapper')).toHaveClass(
      'dropdownWrapper--validationFailure'
    );
  });

  it('renders the ul when showDropdownButton is false', () => {
    render(<DropdownWrapper {...props} showDropdownButton={false} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders a SearchBar if passed hasSearch and showDropdownButton is false', () => {
    render(<DropdownWrapper {...props} hasSearch showDropdownButton={false} />);

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('calls onTypeSearchTerm when typing in the search bar', async () => {
    render(<DropdownWrapper {...props} hasSearch />);

    const dropdownWrapperHeader = screen
      .getByTestId('DropdownWrapper')
      .querySelector('.dropdownWrapper__header');
    await userEvent.click(dropdownWrapperHeader);

    const searchBar = screen.getByRole('listitem').querySelector('input');
    await userEvent.type(searchBar, 'a');

    expect(props.onTypeSearchTerm).toHaveBeenCalledWith('a');
  });

  it('renders the action buttons list item when passed hasApply', async () => {
    render(<DropdownWrapper {...props} hasApply />);

    const dropdownWrapper = screen.getByTestId('DropdownWrapper');
    const dropdownWrapperHeader = dropdownWrapper.querySelector(
      '.dropdownWrapper__header'
    );
    await userEvent.click(dropdownWrapperHeader);

    expect(
      dropdownWrapper.querySelector('.dropdownWrapper__actionButtons')
    ).toBeInTheDocument();
  });

  describe('when receives buttonSize', () => {
    it('sets the correct size of TextButton', async () => {
      render(<DropdownWrapper {...props} hasApply buttonSize="extraSmall" />);

      const dropdownWrapperHeader = screen
        .getByTestId('DropdownWrapper')
        .querySelector('.dropdownWrapper__header');
      await userEvent.click(dropdownWrapperHeader);

      expect(screen.getByRole('button')).toHaveClass('textButton--extraSmall');
    });
  });

  it('applies the correct style when maxHeight is given', async () => {
    render(<DropdownWrapper {...props} maxHeight="100" />);

    const dropdownWrapperHeader = screen
      .getByTestId('DropdownWrapper')
      .querySelector('.dropdownWrapper__header');
    await userEvent.click(dropdownWrapperHeader);

    expect(screen.getByRole('list')).toHaveStyle({
      maxHeight: '100px',
    });
  });
});
