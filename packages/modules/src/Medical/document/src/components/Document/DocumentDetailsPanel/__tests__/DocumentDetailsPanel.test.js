import { screen, render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { documentData } from '@kitman/services/src/mocks/handlers/medical/medicalDocument/getMedicalDocument';
import i18n from 'i18next';
import { useShowToasts } from '@kitman/common/src/hooks';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockDocumentNotesCategories } from '@kitman/services/src/mocks/handlers/getDocumentNoteCategories';
import { Provider } from 'react-redux';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { entityAttachments } from '@kitman/services/src/mocks/handlers/medical/entityAttachments/mocks/entityAttachments.mock';
import * as Redux from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import DocumentDetailsPanel from '..';

jest.mock('@kitman/common/src/hooks', () => ({
  useShowToasts: jest.fn(),
}));

describe('<DocumentDetailsPanel />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockStore = storeFake({
    medicalSharedApi: {
      useGetDocumentNoteCategoriesQuery: jest.fn(),
    },
    medicalApi: {
      useGetAthleteDataQuery: jest.fn(),
    },
  });

  const DOCUMENT_FILE_NAME_TEST_ID = 'DocumentDetailsTab|FileName';
  const DOCUMENT_DATE_TEST_ID = 'DocumentDetailsTab|DocumentDate';

  const mockDispatch = jest.fn();
  const mockShowSuccessToast = jest.fn();
  const mockShowErrorToast = jest.fn();

  beforeEach(() => {
    useShowToasts.mockReturnValue({
      showSuccessToast: mockShowSuccessToast,
      showErrorToast: mockShowErrorToast,
    });
    jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Presentation flow', () => {
    const props = {
      document: documentData,
      isV2Document: true,
      documentNoteCategories: mockDocumentNotesCategories,
      constructedDetailsString: 'Added on Feb 28, 2023 by John Doe',
      isLoading: false,
      canEdit: false,
      t: i18nextTranslateStub(),
    };

    const renderComponent = (
      document = props.document,
      isV2Document = props.isV2Document
    ) => {
      render(
        <I18nextProvider i18n={i18n}>
          <Provider store={mockStore}>
            <DocumentDetailsPanel
              {...props}
              document={document}
              isV2Document={isV2Document}
            />
          </Provider>
        </I18nextProvider>
      );
    };

    describe('V2 Document', () => {
      it('renders the correct text content', () => {
        renderComponent();
        expect(screen.getByText('Document details')).toBeInTheDocument();
      });

      it('renders the correct file name', () => {
        renderComponent();
        expect(screen.getByText('testFile.pdf')).toBeInTheDocument();
      });

      it('has the download url prop as expected', () => {
        renderComponent();
        const fileName = screen.getByTestId(DOCUMENT_FILE_NAME_TEST_ID);
        expect(fileName).toHaveAttribute('target', '_blank');
        expect(fileName).toHaveAttribute('href', documentData.attachment.url);
      });

      it('renders the correct title name', () => {
        renderComponent();
        expect(screen.getByText('testFile')).toBeInTheDocument();
      });

      it('renders the correct document date', () => {
        renderComponent();
        const date = screen.getByTestId(DOCUMENT_DATE_TEST_ID);
        expect(within(date).getByText('Feb 28, 2023')).toBeInTheDocument();
      });

      describe('[FEATURE FLAG] - medical-files-sort-by-doc-date', () => {
        beforeEach(() => {
          window.featureFlags['medical-files-sort-by-doc-date'] = true;
        });

        afterEach(() => {
          window.featureFlags['medical-files-sort-by-doc-date'] = false;
        });

        it('renders the correct document date', () => {
          renderComponent();
          const date = screen.getByTestId(DOCUMENT_DATE_TEST_ID);
          expect(within(date).getByText('Feb 28, 2023')).toBeInTheDocument();
        });
      });
    });

    describe('Medical Attachment', () => {
      const entityAttachment = entityAttachments[0];

      it('renders the correct text content', () => {
        renderComponent(entityAttachment, false);
        expect(screen.getByText('Document details')).toBeInTheDocument();
      });

      it('renders the correct file name', () => {
        renderComponent(entityAttachment, false);
        expect(
          screen.getAllByText(entityAttachment.attachment.filename)
        ).toHaveLength(2); // Title and name is same in EntityAttachmentMock
      });

      it('has the download url prop as expected', () => {
        renderComponent(entityAttachment, false);
        const fileName = screen.getByTestId(DOCUMENT_FILE_NAME_TEST_ID);
        expect(fileName).toHaveAttribute('target', '_blank');
        expect(fileName).toHaveAttribute(
          'href',
          entityAttachment.attachment.url
        );
      });

      it('renders the correct document date', () => {
        renderComponent(entityAttachment, false);
        const date = screen.getByTestId(DOCUMENT_DATE_TEST_ID);
        expect(within(date).getByText('Aug 14, 2023')).toBeInTheDocument();
      });

      describe('[FEATURE FLAG] - medical-files-sort-by-doc-date', () => {
        beforeEach(() => {
          window.featureFlags['medical-files-sort-by-doc-date'] = true;
        });

        afterEach(() => {
          window.featureFlags['medical-files-sort-by-doc-date'] = false;
        });

        it('renders the correct document date', () => {
          renderComponent(entityAttachment, false);
          const date = screen.getByTestId(DOCUMENT_DATE_TEST_ID);
          expect(within(date).getByText('Aug 13, 2023')).toBeInTheDocument();
        });
      });
    });
  });

  describe('Edit flow', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('V2 Document', () => {
      const props = {
        document: documentData,
        isV2Document: true,
        documentNoteCategories: mockDocumentNotesCategories,
        constructedDetailsString: 'Added on Feb 28, 2023 by John Doe',
        isLoading: false,
        canEdit: true,
        updateDocument: jest.fn(),
        t: i18nextTranslateStub(),
      };

      const renderComponent = (canEdit = props.canEdit) => {
        render(
          <I18nextProvider i18n={i18n}>
            <Provider store={mockStore}>
              <LocalizationProvider>
                <DocumentDetailsPanel {...props} canEdit={canEdit} />
              </LocalizationProvider>
            </Provider>
          </I18nextProvider>
        );
      };

      const enterEditMode = async () => {
        const user = userEvent.setup();
        renderComponent();
        await user.click(screen.getByRole('button', { name: 'Edit' }));
        return user;
      };

      it('should not render the Edit button if canEdit is false', () => {
        renderComponent(false);
        expect(
          screen.queryByRole('button', { name: 'Edit' })
        ).not.toBeInTheDocument();
      });

      it('should render the Edit button if canEdit is true', () => {
        renderComponent();
        expect(
          screen.getByRole('button', { name: 'Edit' })
        ).toBeInTheDocument();
      });

      it('should render edit mode actions if in edit mode', async () => {
        await enterEditMode();

        expect(
          await screen.findByRole('button', { name: 'Save' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Discard changes' })
        ).toBeInTheDocument();
      });

      it('should render editable fields with correct values if in edit mode', async () => {
        await enterEditMode();

        expect(await screen.findByLabelText('Title')).toHaveValue(
          props.document.attachment.name
        );
        expect(
          screen.getByText(
            props.document.attachment.medical_attachment_categories[0].name
          )
        ).toBeInTheDocument();

        const textBoxElements = screen.getAllByRole('textbox');
        // Medical document date is editable, so will have 2 elements
        expect(textBoxElements).toHaveLength(2);
        expect(textBoxElements[1]).toHaveValue('02/28/2023');
      });

      it('should display document note categories passed as props as options in Autocomplete', async () => {
        const user = await enterEditMode();
        await user.click(await screen.findByLabelText('Category'));

        props.documentNoteCategories.forEach((category) => {
          expect(
            screen.getByRole('option', { name: category.name })
          ).toBeInTheDocument();
        });
      });

      it('should update values on click of Save, dispatch toast and setRequestDocumentData', async () => {
        const user = await enterEditMode();
        await user.clear(await screen.findByLabelText('Title'));
        await user.type(screen.getByLabelText('Title'), 'test-title');

        await waitFor(() => {
          expect(screen.getByLabelText('Title')).toHaveValue('test-title');
        });

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
          expect(props.updateDocument).toHaveBeenCalledWith(props.document.id, {
            attachment: { name: 'test-title' },
          });
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: true,
          type: 'medicalDocument/setRequestDocumentData',
        });

        expect(mockShowSuccessToast).toHaveBeenCalledWith({
          translatedTitle: 'File details updated successfully',
        });
      });

      it('should not update values on click of Discard changes', async () => {
        const user = await enterEditMode();
        await user.clear(await screen.findByLabelText('Title'));
        await user.type(await screen.findByLabelText('Title'), 'test-title');

        await waitFor(() => {
          expect(screen.getByLabelText('Title')).toHaveValue('test-title');
        });

        await user.click(
          screen.getByRole('button', { name: 'Discard changes' })
        );

        await waitFor(() => {
          expect(props.updateDocument).not.toHaveBeenCalled();
        });
      });

      describe('[FEATURE FLAG] - medical-files-sort-by-doc-date', () => {
        beforeEach(() => {
          window.featureFlags['medical-files-sort-by-doc-date'] = true;
        });

        afterEach(() => {
          window.featureFlags['medical-files-sort-by-doc-date'] = false;
        });

        it('should render editable date correctly', async () => {
          await enterEditMode();

          expect(await screen.findByLabelText('Title')).toHaveValue(
            props.document.attachment.name
          );

          const textBoxElements = screen.getAllByRole('textbox');
          // Medical document date is editable, so will have 2 elements
          expect(textBoxElements).toHaveLength(2);
          expect(textBoxElements[1]).toHaveValue('02/28/2023');
        });
      });
    });

    describe('Medical Attachment', () => {
      const props = {
        document: entityAttachments[0],
        isV2Document: false,
        documentNoteCategories: [
          {
            id: 4,
            name: 'Physical Exams',
          },
        ],
        constructedDetailsString: 'Added on Feb 28, 2023 by John Doe',
        isLoading: false,
        canEdit: true,
        updateDocument: jest.fn(),
        t: i18nextTranslateStub(),
      };

      const renderComponent = (canEdit = props.canEdit) => {
        render(
          <I18nextProvider i18n={i18n}>
            <Provider store={mockStore}>
              <DocumentDetailsPanel {...props} canEdit={canEdit} />
            </Provider>
          </I18nextProvider>
        );
      };

      const enterEditMode = async () => {
        const user = userEvent.setup();
        renderComponent();
        await user.click(screen.getByRole('button', { name: 'Edit' }));
        return user;
      };

      it('should not render the Edit button if canEdit is false', () => {
        renderComponent(false);
        expect(
          screen.queryByRole('button', { name: 'Edit' })
        ).not.toBeInTheDocument();
      });

      it('should render the Edit button if canEdit is true', () => {
        renderComponent();
        expect(
          screen.getByRole('button', { name: 'Edit' })
        ).toBeInTheDocument();
      });

      it('should render edit mode actions if in edit mode', async () => {
        await enterEditMode();

        expect(
          await screen.findByRole('button', { name: 'Save' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Discard changes' })
        ).toBeInTheDocument();
      });

      it('should render editable fields with correct values if in edit mode', async () => {
        await enterEditMode();

        expect(await screen.findByLabelText('Title')).toHaveValue(
          props.document.attachment.name
        );
        expect(
          screen.getByText(
            props.document.attachment.medical_attachment_categories[0].name
          )
        ).toBeInTheDocument();
        // Date not editable in Medical Attachments, 1 element will be present for title
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      it('should display document note categories passed as props as options in Autocomplete', async () => {
        const user = await enterEditMode();
        await user.click(await screen.findByLabelText('Category'));

        props.documentNoteCategories.forEach((category) => {
          expect(screen.getByRole('option', category.name)).toBeInTheDocument();
        });
      });

      it('should update values on click of Save, dispatch toast and setRequestDocumentData', async () => {
        const user = await enterEditMode();
        await user.clear(await screen.findByLabelText('Title'));
        await user.type(screen.getByLabelText('Title'), 'test-title');

        await waitFor(() => {
          expect(screen.getByLabelText('Title')).toHaveValue('test-title');
        });

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
          expect(props.updateDocument).toHaveBeenCalledWith(
            props.document.attachment.id,
            {
              name: 'test-title',
            }
          );
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: true,
          type: 'medicalDocument/setRequestDocumentData',
        });

        expect(mockShowSuccessToast).toHaveBeenCalledWith({
          translatedTitle: 'File details updated successfully',
        });
      });

      it('should not update values on click of Discard changes', async () => {
        const user = await enterEditMode();
        await user.clear(await screen.findByLabelText('Title'));
        await user.type(await screen.findByLabelText('Title'), 'test-title');

        await waitFor(() => {
          expect(screen.getByLabelText('Title')).toHaveValue('test-title');
        });

        await user.click(
          screen.getByRole('button', { name: 'Discard changes' })
        );

        await waitFor(() => {
          expect(props.updateDocument).not.toHaveBeenCalled();
        });
      });

      describe('[FEATURE FLAG] - medical-files-sort-by-doc-date', () => {
        beforeEach(() => {
          window.featureFlags['medical-files-sort-by-doc-date'] = true;
        });

        afterEach(() => {
          window.featureFlags['medical-files-sort-by-doc-date'] = false;
        });
        it('renders the correct document date', () => {
          renderComponent();
          const date = screen.getByTestId(DOCUMENT_DATE_TEST_ID);
          expect(within(date).getByText('Aug 13, 2023')).toBeInTheDocument();
        });
      });
    });
  });
});
