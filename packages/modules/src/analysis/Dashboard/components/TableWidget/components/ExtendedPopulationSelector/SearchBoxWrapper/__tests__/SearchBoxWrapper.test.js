import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import SearchBoxWrapper from '..';

describe('<SearchBoxWrapper />', () => {
  const i18nT = i18nextTranslateStub();
  const mockProps = {
    t: i18nT,
  };

  it('renders a searchbox', () => {
    render(
      <SearchBoxWrapper {...mockProps}>
        {({ searchValue }) => <div>{searchValue}</div>}
      </SearchBoxWrapper>
    );

    const input = screen.getByPlaceholderText('Search');

    expect(input).toBeInTheDocument();
  });

  it('passes the search value to children using renderprops', async () => {
    const user = userEvent.setup();

    const renderChildren = jest.fn();
    render(
      <SearchBoxWrapper {...mockProps}>{renderChildren}</SearchBoxWrapper>
    );

    const SEARCH_TEXT = 'search children';

    await user.type(screen.getByPlaceholderText('Search'), SEARCH_TEXT);

    expect(renderChildren).toHaveBeenLastCalledWith(
      expect.objectContaining({ searchValue: SEARCH_TEXT })
    );
    expect(renderChildren).toHaveBeenCalledTimes(SEARCH_TEXT.length + 1);
  });
});
