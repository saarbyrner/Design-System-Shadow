import { screen, fireEvent, waitFor } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { SearchFilterTranslated as SearchFilter } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab/Filters/SearchFilter';
import {
  REDUCER_KEY,
  setSearchQueryFilter,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplateSettingsSlice';

setI18n(i18n);

describe('<SearchFilter />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderComponent = () => {
    const { mockedStore } = renderWithRedux(<SearchFilter />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: {
          isFormCategoryDrawerOpen: false,
          formCategoryDrawerMode: 'CREATE',
          selectedFormCategoryId: null,
          filters: {
            productArea: null,
            searchQuery: 'Initial Query',
          },
        },
      },
    });

    return mockedStore;
  };

  it('should render the text field with the correct label', () => {
    renderComponent();

    expect(screen.getByLabelText('Search categories')).toBeInTheDocument();
  });

  it('should initialize with the search query from Redux state', () => {
    renderComponent();

    expect(
      screen.getByRole('textbox', {
        name: /search categories/i,
      })
    ).toHaveValue('Initial Query');
  });

  it('should update input value on change and dispatch action after debounce', async () => {
    const mockedStore = renderComponent();
    const searchInput = screen.getByLabelText('Search categories');

    fireEvent.change(searchInput, { target: { value: 'Test Query' } });

    expect(searchInput).toHaveValue('Test Query');

    // Action should not be dispatched immediately
    expect(mockedStore.dispatch).not.toHaveBeenCalled();

    // Fast-forward time by 500ms (debounce time)
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        setSearchQueryFilter('Test Query')
      );
    });
  });
});
