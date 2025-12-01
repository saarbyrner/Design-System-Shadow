import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockedPositionGroups } from '../../utils/mocks';
import AthletesFilters from '../AthletesFilters';

describe('<AthletesFilters />', () => {
  const props = {
    positionGroups: mockedPositionGroups,
    onSearch: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the search filter', () => {
    render(<AthletesFilters {...props} />);
    expect(
      screen.getByRole('search').closest('.athletesFilters__search')
    ).toBeInTheDocument();
  });

  it('does not render the side filters', () => {
    render(<AthletesFilters {...props} />);
    // query up the dom tree
    expect(
      screen.getByRole('search').closest('.athletesFilters__sideFilters')
    ).not.toBeInTheDocument();
    // query down the dom tree
    expect(
      screen.getByRole('search').querySelector('.athletesFilters__sideFilters')
    ).not.toBeInTheDocument();
  });

  it('calls props.onSearch with the added characters when typing on the search bar', async () => {
    render(<AthletesFilters {...props} />);
    const searchBar = screen.getByRole('search').querySelector('input');
    const newValue = 'john';

    await userEvent.type(searchBar, newValue);

    expect(props.onSearch).toHaveBeenCalledTimes(4);
    expect(props.onSearch).toHaveBeenNthCalledWith(1, 'j');
    expect(props.onSearch).toHaveBeenNthCalledWith(2, 'o');
    expect(props.onSearch).toHaveBeenNthCalledWith(3, 'h');
    expect(props.onSearch).toHaveBeenNthCalledWith(4, 'n');
    expect(props.onSearch).toHaveBeenLastCalledWith('n');
  });

  it('renders the side filters when areSideFiltersShowed is true', async () => {
    render(<AthletesFilters {...props} areSideFiltersShowed />);

    expect(
      screen
        .getByRole('search')
        .parentNode.parentNode.querySelector('.athletesFilters__sideFilters')
    ).toBeInTheDocument();
  });
});
