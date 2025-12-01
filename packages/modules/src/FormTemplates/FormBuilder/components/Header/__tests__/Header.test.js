import { capitalize } from 'lodash';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import _cloneDeep from 'lodash/cloneDeep';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { formMetaDataMockData } from '@kitman/modules/src/FormTemplates/shared/consts';
import {
  toastAddType,
  toastRemoveType,
} from '@kitman/modules/src/Toasts/toastsSlice';
import {
  useCreateFormTemplateMutation,
  useUpdateFormTemplateMutation,
} from '@kitman/services/src/services/formTemplates';
import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/fetchFormTemplate';

import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { HeaderTranslated as Header } from '../index';

import { buildCreateFormTemplateRequestBody } from '../utils/helpers';

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useCreateFormTemplateMutation: jest.fn(),
  useUpdateFormTemplateMutation: jest.fn(),
}));

describe('<Header />', () => {
  const mockCreateFormTemplate = jest.fn();
  const mockUpdateFormTemplate = jest.fn();
  const handleBack = jest.fn();

  beforeEach(() => {
    useCreateFormTemplateMutation.mockReturnValue([
      mockCreateFormTemplate,
      { isLoading: false },
    ]);
    mockCreateFormTemplate.mockResolvedValue({});

    useUpdateFormTemplateMutation.mockReturnValue([
      mockUpdateFormTemplate,
      { isLoading: false },
    ]);
    mockUpdateFormTemplate.mockReturnValue({
      unwrap: () => Promise.resolve(data),
    });
  });

  const props = {
    handleBack,
  };

  const customStructure = _cloneDeep(initialState.structure);

  customStructure.form_elements[0].form_elements[0].form_elements[0].form_elements[0].form_elements =
    [
      {
        id: 1234,
        config: {
          element_id: 'dummy_element',
          optional: true,
          items: [],
          custom_params: {},
        },
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        form_elements: [],
      },
    ];

  const renderComponent = (customProps = props, customState = {}) => {
    const { mockedStore } = renderWithRedux(<Header {...customProps} />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: {
          ...initialState,
          metaData: formMetaDataMockData,
          ...customState,
        },
      },
    });

    return mockedStore;
  };

  it('renders', () => {
    renderComponent();

    expect(screen.getByText(formMetaDataMockData.title)).toBeInTheDocument();
    expect(screen.getByText('Forms Overview')).toBeInTheDocument();

    expect(screen.getByText('Product Area')).toBeInTheDocument();
    expect(
      screen.getByText(capitalize(formMetaDataMockData.productArea))
    ).toBeInTheDocument();

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText(formMetaDataMockData.category)).toBeInTheDocument();

    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(
      screen.getByText(formMetaDataMockData.createdAt)
    ).toBeInTheDocument();

    expect(screen.getByText('Creator')).toBeInTheDocument();
    expect(screen.getByText(formMetaDataMockData.creator)).toBeInTheDocument();

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(
      screen.getByText(formMetaDataMockData.description)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /create/i,
      })
    ).toBeInTheDocument();
  });

  it('should call the correct function to create a form', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(mockCreateFormTemplate).toHaveBeenCalledWith(
      buildCreateFormTemplateRequestBody({
        formStructure: initialState.structure,
        formMetaData: formMetaDataMockData,
      })
    );
  });

  it('calls success toast when creating a form template', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        id: 'CREATE_FORM_TEMPLATE_SUCCESS_TOAST_ID',
        status: 'SUCCESS',
        title: 'Successfully created form template',
      },
      type: toastAddType,
    });
  });

  it('calls error toast when creating a form template fails', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    mockCreateFormTemplate.mockRejectedValue({});

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        id: 'CREATE_FORM_TEMPLATE_ERROR_TOAST_ID',
      },
      type: toastRemoveType,
    });
  });

  it('calls success toast when updating a form template', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent(
      { ...props, formTemplateId: 1 },
      { structure: customStructure }
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockedStore.dispatch).toHaveBeenLastCalledWith({
      payload: {
        id: 'UPDATE_FORM_TEMPLATE_SUCCESS_TOAST_ID',
        status: 'SUCCESS',
        title: 'Successfully updated form template',
      },
      type: toastAddType,
    });
  });

  it('calls error toast when updating a form template fails', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent(
      { ...props, formTemplateId: 1 },
      { structure: customStructure }
    );
    mockUpdateFormTemplate.mockReturnValue({
      unwrap: () => Promise.reject(),
    });

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        id: 'UPDATE_FORM_TEMPLATE_ERROR_TOAST_ID',
      },
      type: toastRemoveType,
    });
  });

  it('renders save button disabled if there are no form template structure changes', async () => {
    renderComponent({ ...props, formTemplateId: 1 });

    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('renders save button enabled if there are form template structure changes', async () => {
    renderComponent(
      { ...props, formTemplateId: 1 },
      { structure: customStructure }
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();
  });

  it('renders unsaved changes modal if there are form template structure unsaved changes and calls handleBack when clicking discard changes', async () => {
    const user = userEvent.setup();

    renderComponent(
      { ...props, formTemplateId: 1 },
      { structure: customStructure }
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();

    const backButton = screen.getByRole('button', {
      name: /forms overview/i,
    });

    await user.click(backButton);

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to leave and discard the changes? Unsaved changes will be lost.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /discard changes/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /discard changes/i,
      })
    );

    expect(handleBack).toHaveBeenCalled();
  });

  it('renders unsaved changes modal if there are form template structure unsaved changes and closes when clicking cancel', async () => {
    const user = userEvent.setup();

    renderComponent(
      { ...props, formTemplateId: 1 },
      { structure: customStructure }
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();

    const backButton = screen.getByRole('button', {
      name: /forms overview/i,
    });

    await user.click(backButton);

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to leave and discard the changes? Unsaved changes will be lost.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /discard changes/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    );

    expect(handleBack).not.toHaveBeenCalled();
  });

  it('calls handleBack and does not show modal if there are no form template structure changes', async () => {
    const user = userEvent.setup();

    renderComponent({ ...props, formTemplateId: 1 });

    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    const backButton = screen.getByRole('button', {
      name: /forms overview/i,
    });

    await user.click(backButton);

    expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument();

    expect(handleBack).toHaveBeenCalled();
  });

  it('shows loading backdrop when creating form template', async () => {
    useCreateFormTemplateMutation.mockReturnValue([
      mockCreateFormTemplate,
      { isLoading: true },
    ]);

    renderComponent({}, { structure: customStructure });

    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
  });

  it('shows loading backdrop when updating form template', async () => {
    useUpdateFormTemplateMutation.mockReturnValue([
      mockUpdateFormTemplate,
      { isLoading: true },
    ]);

    renderComponent({}, { structure: customStructure });

    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
  });
});
