import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { data as categoryMocks } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/fetchGenericDocumentsCategories';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { DocumentSidePanelTranslated as DocumentSidePanel } from '..';

describe('<DocumentSidePanel />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    handleOnClosePanel: jest.fn(),
  };
  const localState = {
    genericDocumentsSlice: {
      genericDocumentsCategories: categoryMocks,
    },
    documentsTabSlice: {
      documentSidePanel: {
        isOpen: true,
        form: {
          attachment: {
            file: {
              filename: 'document_test.csv',
              fileType: 'text/csv',
              fileSize: 54,
              id: 'someId',
            },
            state: 'SUCCESS',
            message: '54 B • Complete',
          },
        },
      },
    },
  };

  // * is used because it's a required field, it's added by MUI.
  const getTitleInput = () => screen.getByLabelText('Title *');

  const getCategorySelect = () => screen.getByLabelText('Category *');

  it('renders content of the document side panel', () => {
    renderWithProviders(<DocumentSidePanel {...props} isOpen />, {
      preloadedState: localState,
    });

    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(getTitleInput()).toBeInTheDocument();
    expect(getCategorySelect()).toBeInTheDocument();
    expect(screen.getByLabelText('Issue date')).toBeInTheDocument();
    expect(screen.getByLabelText('Expiry date')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('disables the save button if the required fields are missing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DocumentSidePanel {...props} isOpen />, {
      preloadedState: localState,
    });

    const saveButton = await screen.findByRole('button', { name: 'Save' });

    expect(saveButton).toBeDisabled();

    const title = 'Pikachu Catching Certificate';
    const titleInput = getTitleInput();
    await user.type(titleInput, title);
    expect(titleInput).toHaveDisplayValue(title);

    expect(saveButton).toBeDisabled();

    const categorySelect = getCategorySelect();
    await user.click(categorySelect);
    await user.click(screen.getByText(categoryMocks[0].name));
    expect(categorySelect).toHaveTextContent(categoryMocks[0].name);

    expect(saveButton).toBeEnabled();
  });

  it('renders file uploader field', async () => {
    renderWithProviders(<DocumentSidePanel {...props} isOpen />, {
      preloadedState: {
        ...localState,
        documentsTabSlice: {
          ...localState.documentsTabSlice,
          documentSidePanel: {
            isOpen: true,
            form: {},
          },
        },
      },
    });

    const user = userEvent.setup();
    const file = new File(['logo'], 'logo.png', { type: 'image/png' });
    const uploadField = document.querySelector('.filepond--wrapper input');

    await user.upload(uploadField, file);

    expect(uploadField.files[0]).toStrictEqual(file);
    expect(uploadField.files.item(0)).toStrictEqual(file);
    expect(uploadField.files).toHaveLength(1);
  });
});
