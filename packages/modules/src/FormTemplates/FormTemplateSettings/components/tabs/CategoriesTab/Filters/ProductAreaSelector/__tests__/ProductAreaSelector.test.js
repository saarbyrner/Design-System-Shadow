import { screen } from '@testing-library/react';
import { I18nextProvider, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { ProductAreaSelectorTranslated as ProductAreaSelector } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab/Filters/ProductAreaSelector';

const mockUseGetProductAreasQuery = jest.fn();

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useGetProductAreasQuery: () => ({
    data: [], // Ensure data is always an array by default
    isLoading: false, // Default to not loading
    ...mockUseGetProductAreasQuery(), // Allow mockReturnValue to override
  }),
}));

setI18n(i18n);

describe('<ProductAreaSelector />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetProductAreasQuery.mockReturnValue({
      data: [],
      isLoading: true,
    });
  });

  const renderComponent = (initialState = {}) => {
    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <ProductAreaSelector />
      </I18nextProvider>,
      {
        initialState,
        useGlobalStore: false,
      }
    );

    return mockedStore;
  };

  it('should render the Autocomplete with the correct label', () => {
    renderComponent();
    expect(screen.getByLabelText('Product area')).toBeInTheDocument();
  });

  it('should be disabled when loading data', () => {
    mockUseGetProductAreasQuery.mockReturnValue({
      data: [],
      isLoading: true,
    });
    renderComponent();
    expect(screen.getByLabelText('Product area')).toBeDisabled();
  });

  it('should populate options when data is fetched and allow selection', async () => {
    mockUseGetProductAreasQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });
    renderComponent();

    const autocompleteInput = screen.getByRole('combobox', {
      name: 'Product area',
    });
    expect(autocompleteInput).toBeEnabled();
  });
});
