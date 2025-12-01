import { screen } from '@testing-library/react';
import { I18nextProvider, setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import CategoriesTab from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab';
import { useListFormCategories } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/hooks/useListFormCategories';
import { paginatedFormCategoriesData } from '@kitman/services/src/services/formTemplates/api/mocks/data/formCategories.mock';
import {
  formTemplateSettingsReducer,
  initialState as formTemplateSettingsInitialState,
  REDUCER_KEY as FORM_TEMPLATE_SETTINGS_REDUCER_KEY,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplateSettingsSlice';

jest.mock(
  '@kitman/modules/src/FormTemplates/FormTemplateSettings/hooks/useListFormCategories'
);

setI18n(i18n);

describe('<CategoriesTab />', () => {
  const renderComponent = (preloadedState = {}) => {
    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <CategoriesTab />
      </I18nextProvider>,
      {
        useGlobalStore: false,
        preloadedState,
      }
    );
    return mockedStore;
  };
  beforeEach(() => {
    useListFormCategories.mockReturnValue({
      rows: paginatedFormCategoriesData.data,
      isLoading: false,
      meta: paginatedFormCategoriesData.pagination,
    });

    // Initialize the state using the reducer
    const state = {
      [FORM_TEMPLATE_SETTINGS_REDUCER_KEY]: formTemplateSettingsReducer(
        formTemplateSettingsInitialState,
        { type: '@@INIT' }
      ),
    };
    renderComponent(state);
  });
  it('should display the page properly', () => {
    // Component is rendered in beforeEach

    // Check for filter components
    expect(screen.getByLabelText('Search categories')).toBeInTheDocument();
    const autocompleteInput = screen.getByRole('combobox', {
      name: 'Product area',
    });
    expect(autocompleteInput).toBeInTheDocument();

    // Check for DataGrid headers
    expect(
      screen.getByRole('columnheader', { name: 'Category' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Product area' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Created on' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Last updated' })
    ).toBeInTheDocument();

    // Check for some mock data in the grid
    const firstRow = paginatedFormCategoriesData.data[0];
    const thirdRow = paginatedFormCategoriesData.data[2];

    expect(
      screen.getByRole('cell', { name: firstRow.name })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'medical' })).toHaveLength(2);
    expect(
      screen.getByRole('cell', { name: thirdRow.productArea })
    ).toBeInTheDocument();

    // Check for the Create button
    expect(
      screen.getByRole('button', { name: 'Create Category' })
    ).toBeInTheDocument();
  });
});
