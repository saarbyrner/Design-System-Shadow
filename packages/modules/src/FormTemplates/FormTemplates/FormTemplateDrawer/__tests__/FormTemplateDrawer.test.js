import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  useListFormCategoriesQuery,
  useUpdateFormTemplateMetadataMutation,
} from '@kitman/services/src/services/formTemplates';
import { REDUCER_KEY as FORM_BUILDER_REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { initialState as formBuilderInitialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import {
  REDUCER_KEY as FORM_TEMPLATES_REDUCER_KEY,
  initialState as formTemplatesInitialState,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplatesSlice';
import { toastAddType } from '@kitman/modules/src/Toasts/toastsSlice';
import { formMetaDataMockData } from '@kitman/modules/src/FormTemplates/shared/consts';
import { formCategoriesMock } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/getCategories';
import FormTemplateDrawer from '..';
import { getDrawerTranslations } from '../utils/helpers';

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useListFormCategoriesQuery: jest.fn(),
  useUpdateFormTemplateMetadataMutation: jest.fn(),
}));

describe('<FormTemplateDrawer />', () => {
  const mockUpdateFormTemplateMetadata = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useListFormCategoriesQuery.mockReturnValue({
      data: {
        formCategories: formCategoriesMock,
      },
    });

    useUpdateFormTemplateMetadataMutation.mockReturnValue([
      mockUpdateFormTemplateMetadata,
      { isLoading: false },
    ]);
    mockUpdateFormTemplateMetadata.mockResolvedValue({});
  });

  const props = {
    onClickingCreate: jest.fn(),
  };
  const renderComponent = (
    formBuilderState = formBuilderInitialState,
    formTemplateState = formTemplatesInitialState
  ) => {
    const { mockedStore } = renderWithRedux(<FormTemplateDrawer {...props} />, {
      preloadedState: {
        [FORM_TEMPLATES_REDUCER_KEY]: {
          ...formTemplateState,
          isFormTemplateDrawerOpen: true,
        },
        [FORM_BUILDER_REDUCER_KEY]: formBuilderState,
      },
      useGlobalStore: false,
    });
    return mockedStore;
  };

  describe('CREATE mode', () => {
    it('should display the side panel properly', () => {
      const translations = getDrawerTranslations();
      renderComponent();
      expect(screen.getByText(translations.createTitle)).toBeInTheDocument();
      const createButton = screen.getByRole('button', {
        name: translations.createButton,
      });
      expect(createButton).toBeInTheDocument();
      expect(createButton).toBeDisabled();
    });

    it('should dispatch actions properly', async () => {
      const translations = getDrawerTranslations();
      const user = userEvent.setup();
      const mockedStore = renderComponent();

      // edit title
      const newTitle = 'Dragonite';
      await user.click(screen.getByLabelText(translations.templateTitle));
      await user.paste(newTitle);
      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: { field: 'title', value: newTitle },
        type: `${FORM_BUILDER_REDUCER_KEY}/setMetaDataField`,
      });

      // select category
      const selectedCategory = formCategoriesMock[0];
      await user.click(screen.getByLabelText(translations.category));

      await user.click(
        screen.getByRole('option', { name: selectedCategory.name })
      );
      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: { field: 'category', value: selectedCategory.name },
        type: `${FORM_BUILDER_REDUCER_KEY}/setMetaDataField`,
      });

      // edit description
      const newDescription = 'Dragon Pokémon';
      await user.click(screen.getByLabelText(translations.description));
      await user.paste(newDescription);
      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: { field: 'description', value: newDescription },
        type: `${FORM_BUILDER_REDUCER_KEY}/setMetaDataField`,
      });

      await user.click(screen.getAllByTestId('CloseIcon')[0]);

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: `${FORM_TEMPLATES_REDUCER_KEY}/toggleIsFormTemplateDrawerOpen`,
      });

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: `${FORM_BUILDER_REDUCER_KEY}/resetMetaData`,
      });
    });

    it('should call the onClickingCreate callback', async () => {
      const translations = getDrawerTranslations();
      const user = userEvent.setup();
      renderComponent({
        ...formBuilderInitialState,
        metaData: {
          ...formMetaDataMockData,
          category: formCategoriesMock[0].name,
        },
      });

      const createButton = screen.getByRole('button', {
        name: translations.createButton,
      });
      expect(createButton).toBeEnabled();
      await user.click(createButton);

      expect(props.onClickingCreate).toHaveBeenCalled();
    });

    it('should show helper texts on focus and hide on blur for title', async () => {
      const translations = getDrawerTranslations();
      const user = userEvent.setup();
      renderComponent();

      expect(
        screen.queryByText(translations.maxCharacters100Message)
      ).not.toBeInTheDocument();

      await user.click(screen.getByLabelText(translations.templateTitle));

      expect(
        screen.getByText(translations.maxCharacters100Message)
      ).toBeInTheDocument();

      expect(screen.getByLabelText(translations.templateTitle)).toHaveAttribute(
        'maxlength',
        '100'
      );

      await user.click(screen.getByLabelText(translations.category));

      expect(
        screen.queryByText(translations.maxCharacters100Message)
      ).not.toBeInTheDocument();
    });

    it('should show helper texts on focus and hide on blur for description', async () => {
      const translations = getDrawerTranslations();
      const focusedHelperText = `${translations.optional} - ${translations.maxCharacters100Message}`;
      const user = userEvent.setup();
      renderComponent();

      expect(screen.getByText(translations.optional)).toBeInTheDocument();

      expect(screen.queryByText(focusedHelperText)).not.toBeInTheDocument();

      await user.click(screen.getByLabelText(translations.description));

      expect(screen.getByLabelText(translations.description)).toHaveAttribute(
        'maxlength',
        '100'
      );

      expect(screen.getByText(focusedHelperText)).toBeInTheDocument();

      await user.click(screen.getByLabelText(translations.category));

      expect(
        screen.queryByText(translations.maxCharacters100Message)
      ).not.toBeInTheDocument();
    });
  });

  describe('EDIT mode', () => {
    const editModeFormTemplatesState = {
      ...formTemplatesInitialState,
      formTemplateDrawerMode: 'EDIT',
      selectedFormId: 1,
      formTemplatesMap: {
        1: {
          id: 101,
          name: 'name',
          category: 'category',
          fullname: 'fullname',
          formCategory: formCategoriesMock[0],
        },
      },
    };

    it('should display the side panel properly', () => {
      const translations = getDrawerTranslations();
      renderComponent(formBuilderInitialState, editModeFormTemplatesState);
      expect(screen.getByText(translations.editTitle)).toBeInTheDocument();
      const saveButton = screen.getByRole('button', {
        name: translations.saveButton,
      });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });

    it('should dispatch actions properly', async () => {
      const translations = getDrawerTranslations();
      const user = userEvent.setup();
      const mockedStore = renderComponent(
        formBuilderInitialState,
        editModeFormTemplatesState
      );
      // edit title
      const newTitle = 'Dragonite';
      await user.click(screen.getByLabelText(translations.templateTitle));
      await user.paste(newTitle);
      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: { field: 'title', value: newTitle },
        type: `${FORM_BUILDER_REDUCER_KEY}/setMetaDataField`,
      });

      // select category
      const selectedCategory = formCategoriesMock[0];
      await user.click(screen.getByLabelText(translations.category));

      await user.click(
        screen.getByRole('option', { name: selectedCategory.name })
      );
      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: { field: 'category', value: selectedCategory.name },
        type: `${FORM_BUILDER_REDUCER_KEY}/setMetaDataField`,
      });

      // edit description
      const newDescription = 'Dragon Pokémon';
      await user.click(screen.getByLabelText(translations.description));
      await user.paste(newDescription);
      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: { field: 'description', value: newDescription },
        type: `${FORM_BUILDER_REDUCER_KEY}/setMetaDataField`,
      });

      await user.click(screen.getAllByTestId('CloseIcon')[0]);

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: `${FORM_TEMPLATES_REDUCER_KEY}/toggleIsFormTemplateDrawerOpen`,
      });

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: `${FORM_BUILDER_REDUCER_KEY}/resetMetaData`,
      });
    });

    it('should show success toast after clicking save button', async () => {
      const translations = getDrawerTranslations();
      const user = userEvent.setup();
      const mockedStore = renderComponent(
        {
          ...formBuilderInitialState,
          metaData: {
            ...formMetaDataMockData,
            category: formCategoriesMock[0].name,
          },
        },
        editModeFormTemplatesState
      );

      const saveButton = screen.getByRole('button', {
        name: translations.saveButton,
      });

      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          id: 'UPDATE_FORM_TEMPLATE_METADATA_SUCCESS_TOAST_ID',
          status: 'SUCCESS',
          title: 'Successfully updated form template',
        },
        type: toastAddType,
      });

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: `${FORM_TEMPLATES_REDUCER_KEY}/toggleIsFormTemplateDrawerOpen`,
      });

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: `${FORM_BUILDER_REDUCER_KEY}/resetMetaData`,
      });
    });

    it('renders error toast when updating a form template title fails', async () => {
      mockUpdateFormTemplateMetadata.mockRejectedValue({});

      const user = userEvent.setup();

      const translations = getDrawerTranslations();
      const mockedStore = renderComponent(
        {
          ...formBuilderInitialState,
          metaData: {
            ...formMetaDataMockData,
            title: 'New title',
          },
        },
        editModeFormTemplatesState
      );

      const saveButton = screen.getByRole('button', {
        name: translations.saveButton,
      });

      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(mockedStore.dispatch).toHaveBeenLastCalledWith({
        payload: {
          id: 'UPDATE_FORM_TEMPLATE_METADATA_ERROR_TOAST_ID',
          status: 'ERROR',
          title: 'Failed to update form template. Please try again',
          description: undefined,
        },
        type: toastAddType,
      });
    });
  });
});
