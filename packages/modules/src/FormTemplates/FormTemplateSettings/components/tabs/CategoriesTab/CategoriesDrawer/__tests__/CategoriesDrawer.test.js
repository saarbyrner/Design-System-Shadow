import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  useGetProductAreasQuery,
  useCreateFormCategoryMutation,
  useUpdateFormCategoryMutation,
  useGetFormCategoryQuery,
} from '@kitman/services/src/services/formTemplates';
import { formCategoriesData } from '@kitman/services/src/services/formTemplates/api/mocks/data/formCategories.mock';
import {
  REDUCER_KEY as FORM_TEMPLATE_SETTINGS_REDUCER_KEY,
  initialState as formTemplateSettingsInitialState,
  setIsFormCategoryDrawerOpen,
  setFormCategoryDrawerMode,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplateSettingsSlice';
import { toastAddType } from '@kitman/modules/src/Toasts/toastsSlice';
import FormCategoryDrawer from '..';
import { getDrawerTranslations } from '../utils/helpers';

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useGetProductAreasQuery: jest.fn(),
  useCreateFormCategoryMutation: jest.fn(),
  useUpdateFormCategoryMutation: jest.fn(),
  useGetFormCategoryQuery: jest.fn(),
}));

const transformedProductAreasMock = formCategoriesData.map((category) => ({
  name: category.name,
  id: String(category.id),
}));

describe('<FormCategoryDrawer />', () => {
  const mockCreateFormCategory = jest.fn();
  const mockUpdateFormCategory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useGetProductAreasQuery.mockReturnValue({
      data: transformedProductAreasMock,
    });
    useCreateFormCategoryMutation.mockReturnValue([
      mockCreateFormCategory,
      { isLoading: false },
    ]);
    useUpdateFormCategoryMutation.mockReturnValue([
      mockUpdateFormCategory,
      { isLoading: false },
    ]);
    useGetFormCategoryQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
    });
    mockCreateFormCategory.mockResolvedValue({});
    mockUpdateFormCategory.mockResolvedValue({});
  });

  const renderComponent = (mode = 'CREATE', selectedCategoryId = null) => {
    const { mockedStore } = renderWithRedux(<FormCategoryDrawer />, {
      preloadedState: {
        [FORM_TEMPLATE_SETTINGS_REDUCER_KEY]: {
          ...formTemplateSettingsInitialState,
          isFormCategoryDrawerOpen: true,
          formCategoryDrawerMode: mode,
          selectedFormCategoryId: selectedCategoryId,
        },
      },
      useGlobalStore: false,
    });
    return mockedStore;
  };

  describe('CREATE mode', () => {
    it('should display the side panel properly', () => {
      const translations = getDrawerTranslations();
      renderComponent();
      expect(screen.getByText(translations.createCategory)).toBeInTheDocument();
      const createButton = screen.getByRole('button', {
        name: translations.createButton,
      });
      expect(createButton).toBeInTheDocument();
      // Button is enabled by default, disabled if inputs are empty
    });

    it('should call createFormCategory mutation and close on successful creation', async () => {
      const translations = getDrawerTranslations();
      const user = userEvent.setup();
      const mockedStore = renderComponent();

      const categoryNameInput = screen.getByLabelText(
        translations.categoryName
      );
      const productAreaSelect = screen.getByLabelText(
        translations.productAreaName
      );
      const createButton = screen.getByRole('button', {
        name: translations.createButton,
      });
      await user.click(productAreaSelect);
      await user.click(
        screen.getByRole('option', {
          name: transformedProductAreasMock[0].name,
        })
      );

      fireEvent.change(categoryNameInput, {
        target: { value: 'New Test Category' },
      });

      await user.click(createButton);

      expect(mockCreateFormCategory).toHaveBeenCalledWith({
        categoryName: 'New Test Category',
        productArea: transformedProductAreasMock[0].id,
      });

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          id: 'FORM_CATEGORY_DRAWER_CREATE_SUCCESS',
          status: 'SUCCESS',
          title: translations.createdFormCategorySuccessMessage,
          description: undefined,
        },
        type: toastAddType,
      });

      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        setIsFormCategoryDrawerOpen(false)
      );
      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        setFormCategoryDrawerMode('CREATE')
      );
    });

    it('should show error toast on failed creation', async () => {
      mockCreateFormCategory.mockRejectedValueOnce(new Error('Create failed'));
      const translations = getDrawerTranslations();
      const user = userEvent.setup();
      const mockedStore = renderComponent();

      fireEvent.change(screen.getByLabelText(translations.categoryName), {
        target: { value: 'Test Category' },
      });

      await user.click(screen.getByLabelText(translations.productAreaName));
      await user.click(
        screen.getByRole('option', {
          name: transformedProductAreasMock[0].name,
        })
      );
      await user.click(
        screen.getByRole('button', { name: translations.createButton })
      );

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          id: 'FORM_CATEGORY_DRAWER_CREATE_ERROR',
          status: 'ERROR',
          title: translations.createFormCategoryErrorMessage,
          description: undefined,
        },
        type: toastAddType,
      });
    });

    it('should dispatch close actions when close icon is clicked', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();

      await user.click(screen.getByTestId('CloseIcon'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        setIsFormCategoryDrawerOpen(false)
      );
      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        setFormCategoryDrawerMode('CREATE')
      );
    });

    it('should show helper texts on focus and hide on blur for category name', async () => {
      const translations = getDrawerTranslations();
      const user = userEvent.setup();
      renderComponent();

      expect(
        screen.queryByText(translations.maxCharacters100Message)
      ).not.toBeInTheDocument();

      const productAreaSelect = screen.getByLabelText(
        translations.productAreaName
      );

      await user.click(productAreaSelect);
      await user.click(
        screen.getByRole('option', {
          name: transformedProductAreasMock[0].name,
        })
      );

      await user.click(screen.getByLabelText(translations.categoryName));

      expect(
        screen.getByText(translations.maxCharacters100Message)
      ).toBeInTheDocument();

      expect(screen.getByLabelText(translations.categoryName)).toHaveAttribute(
        'maxlength',
        '100'
      );

      // Click something else to blur
      await user.click(screen.getByLabelText(translations.productAreaName));

      expect(
        screen.queryByText(translations.maxCharacters100Message)
      ).not.toBeInTheDocument();
    });
  });

  describe('EDIT mode', () => {
    // Use a mock data object that accurately reflects the API response structure
    // and override properties as needed for the specific test case.
    const mockExistingCategoryBase = formCategoriesData[0] || {
      id: 1,
      name: 'Default',
      productAreaId: 1,
      productArea: 'Default Product Area',
    };
    const mockExistingCategory = {
      ...mockExistingCategoryBase,
      name: 'Old Category Name', // Override the name for this test scenario
    };

    it('should display the side panel properly', () => {
      const translations = getDrawerTranslations();
      useGetFormCategoryQuery.mockReturnValue({
        data: mockExistingCategory,
        isLoading: false,
        isFetching: false,
      });
      renderComponent('EDIT', mockExistingCategory.id);

      expect(screen.getByText(translations.editCategory)).toBeInTheDocument();
      const saveButton = screen.getByRole('button', {
        name: translations.saveButton,
      });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeEnabled();
    });

    it('should prefill inputs and call updateFormCategory mutation', async () => {
      const translations = getDrawerTranslations();
      const user = userEvent.setup();

      useGetFormCategoryQuery.mockReturnValue({
        data: mockExistingCategory,
        isLoading: false,
        isFetching: false,
      });
      const mockedStore = renderComponent('EDIT', mockExistingCategory.id);

      expect(screen.getByLabelText(translations.categoryName)).toHaveValue(
        mockExistingCategory.name
      );
      expect(
        screen.getByRole('button', {
          name: translations.productAreaName,
        })
      ).toBeInTheDocument();

      const updatedCategoryName = 'Updated Category Name';
      await user.clear(screen.getByLabelText(translations.categoryName));

      fireEvent.change(screen.getByLabelText(translations.categoryName), {
        target: { value: updatedCategoryName },
      });

      const saveButton = screen.getByRole('button', {
        name: translations.saveButton,
      });
      expect(saveButton).toBeEnabled();
      await user.click(saveButton);

      expect(mockUpdateFormCategory).toHaveBeenCalledWith({
        formCategoryId: mockExistingCategory.id,
        categoryName: updatedCategoryName,
        productArea: mockExistingCategory.productAreaId,
      });

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          id: 'FORM_CATEGORY_DRAWER_UPDATE_SUCCESS',
          status: 'SUCCESS',
          title: translations.updatedFormCategorySuccessMessage,
          description: undefined, // Added for consistency
        },
        type: toastAddType,
      });

      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        setIsFormCategoryDrawerOpen(false)
      );
      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        setFormCategoryDrawerMode('CREATE')
      );
    });

    it('renders error toast when updating a form category fails', async () => {
      mockUpdateFormCategory.mockRejectedValueOnce(new Error('Update failed'));
      useGetFormCategoryQuery.mockReturnValue({
        data: mockExistingCategory,
        isLoading: false,
        isFetching: false,
      });
      const user = userEvent.setup();
      const translations = getDrawerTranslations();
      const mockedStore = renderComponent('EDIT', mockExistingCategory.id);

      fireEvent.change(screen.getByLabelText(translations.categoryName), {
        target: { value: 'A new name' },
      });

      const saveButton = screen.getByRole('button', {
        name: translations.saveButton,
      });

      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(mockedStore.dispatch).toHaveBeenLastCalledWith({
        payload: {
          id: 'FORM_CATEGORY_DRAWER_UPDATE_ERROR',
          status: 'ERROR',
          description: undefined,
          title: translations.updateFormCategoryErrorMessage,
        },
        type: toastAddType,
      });
    });
  });
});
