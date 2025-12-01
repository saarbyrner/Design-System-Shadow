import { screen } from '@testing-library/react';
import { I18nextProvider, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { SettingsTranslated as Settings } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/Settings';
import { useListFormCategories } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/hooks/useListFormCategories';
import { paginatedFormCategoriesData } from '@kitman/services/src/services/formTemplates/api/mocks/data/formCategories.mock';

jest.mock(
  '@kitman/modules/src/FormTemplates/FormTemplateSettings/hooks/useListFormCategories'
);

setI18n(i18n);

describe('<FormTemplateSettings />', () => {
  beforeEach(() => {
    useListFormCategories.mockReturnValue({
      rows: paginatedFormCategoriesData.data,
      isLoading: false,
      meta: paginatedFormCategoriesData.pagination,
    });
  });

  const renderComponent = () => {
    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <Settings />
      </I18nextProvider>,
      {
        useGlobalStore: false,
        preloadedState: {
          formTemplateSettings: {
            isFormCategoryDrawerOpen: false,
            formCategoryDrawerMode: 'CREATE',
            selectedFormCategoryId: null,
          },
        },
      }
    );
  };
  it('should display the page properly', () => {
    renderComponent();

    // Check for Header
    expect(screen.getByText('Settings')).toBeInTheDocument();

    // Check for Tab
    expect(screen.getByRole('tab', { name: 'Categories' })).toBeInTheDocument();
  });
});
