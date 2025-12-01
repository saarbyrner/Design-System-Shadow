import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useListFormCategoriesQuery } from '@kitman/services/src/services/formTemplates';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { formCategoriesMock } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/getCategories';

import Filters from '..';
import {
  REDUCER_KEY,
  initialState,
} from '../../../redux/slices/formTemplatesSlice';
import { getFiltersTranslations } from '../../utils/helpers';

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useListFormCategoriesQuery: jest.fn(),
}));
describe('<Filters />', () => {
  const initialData = {
    formCategories: formCategoriesMock,
  };

  beforeEach(() => {
    useListFormCategoriesQuery.mockReturnValue({ data: initialData });
  });

  const renderComponent = (state) => {
    const { mockedStore } = renderWithRedux(<Filters />, {
      mockedStore: { dispatch: jest.fn(() => {}) }, // Mock dispatch with a no-op function
      useGlobalStore: false,
      preloadedState: { [REDUCER_KEY]: state },
    });
    return mockedStore;
  };

  const translations = getFiltersTranslations();
  const chosenCategory = formCategoriesMock[0];
  const otherCategory = formCategoriesMock[1];
  it('should select a category properly', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent(initialState);

    // Select
    await user.click(screen.getByLabelText(translations.category));

    expect(
      screen.getByRole('option', { name: otherCategory.name })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('option', { name: chosenCategory.name })
    );

    // the select menu should have been closed
    expect(
      screen.queryByRole('option', { name: otherCategory.name })
    ).not.toBeInTheDocument();

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: chosenCategory,
      type: `${REDUCER_KEY}/setCategoryFilter`,
    });
  });

  it('should deselect a category properly', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent({
      ...initialState,
      filters: {
        ...initialState.filters,
        category: String(chosenCategory.name),
        formCategoryId: chosenCategory.id,
      },
    });

    expect(screen.getByLabelText(translations.category)).toHaveValue(
      chosenCategory.name
    );

    // The clear button in Autocomplete
    await user.click(screen.getByTitle(/clear/i));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: null,
      type: `${REDUCER_KEY}/setCategoryFilter`,
    });
  });

  it('should render search properly', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent(initialState);

    const searchQuery = 'Pika';

    await user.type(screen.getByLabelText(translations.search), searchQuery);

    await waitFor(
      () => {
        expect(mockedStore.dispatch).toHaveBeenCalledWith({
          payload: searchQuery,
          type: `${REDUCER_KEY}/setSearchQuery`,
        });
      },
      { timeout: 500 }
    );
  });
});
