import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { documentData } from '@kitman/services/src/mocks/handlers/medical/medicalDocument/getMedicalDocument';
import i18n from 'i18next';
import { useShowToasts } from '@kitman/common/src/hooks';
import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import * as Redux from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import AssociatedNotesPanel from '..';

jest.mock('@kitman/common/src/hooks', () => ({
  useShowToasts: jest.fn(),
}));

describe('<AssociatedNotesPanel />', () => {
  const mockShowSuccessToast = jest.fn();
  const mockShowErrorToast = jest.fn();

  const mockStore = storeFake({
    medicalApi: {
      useGetAthleteDataQuery: jest.fn(),
    },
  });

  const mockDispatch = jest.fn();

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

  const v2DocumentWithoutNote = {
    ...documentData,
    annotation: {
      annotation_date: '2024-03-31T23:00:00Z',
      content: '',
      note_summary: '',
      title: '',
    },
  };

  describe('Presentation flow', () => {
    const props = {
      document: documentData,
      constructedDetailsString: 'Added on Feb 28, 2023 by John Doe',
      canEdit: false,
      updateDocument: jest.fn(),
      t: i18nextTranslateStub(),
    };

    const renderComponent = (document = props.document) => {
      render(
        <I18nextProvider i18n={i18n}>
          <Provider store={mockStore}>
            <AssociatedNotesPanel {...props} document={document} />
          </Provider>
        </I18nextProvider>
      );
    };

    describe('With associated note', () => {
      it('renders the correct text content', () => {
        renderComponent();
        expect(screen.getByText('Note')).toBeInTheDocument();
      });

      it('renders the correct note title', () => {
        renderComponent();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
      });

      it('renders note content', () => {
        renderComponent();
        expect(
          screen.getByText('Test content for my note')
        ).toBeInTheDocument();
      });
    });

    describe('Without associated note', () => {
      it('renders the correct no associated notes content', () => {
        renderComponent(v2DocumentWithoutNote);
        expect(screen.getByText('No associated notes.')).toBeInTheDocument();
      });
    });
  });

  describe('Edit flow', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const props = {
      document: documentData,
      constructedDetailsString: 'Added on Feb 28, 2023 by John Doe',
      canEdit: true,
      updateDocument: jest.fn(),
      t: i18nextTranslateStub(),
    };

    const renderComponent = (
      canEdit = props.canEdit,
      document = props.document
    ) => {
      render(
        <I18nextProvider i18n={i18n}>
          <Provider store={mockStore}>
            <AssociatedNotesPanel
              {...props}
              canEdit={canEdit}
              document={document}
            />
          </Provider>
        </I18nextProvider>
      );
    };

    let user;

    const enterEditMode = async () => {
      user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole('button', { name: 'Edit' }));
    };

    it('should not render the Edit button if canEdit is false', () => {
      renderComponent(false);
      expect(
        screen.queryByRole('button', { name: 'Edit' })
      ).not.toBeInTheDocument();
    });

    it('should render the Edit button if canEdit is true and a note exists', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('should render the Add button if canEdit is true and a note does not exist', () => {
      renderComponent(true, v2DocumentWithoutNote);
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('should render edit mode actions if in edit mode', async () => {
      enterEditMode();

      expect(
        await screen.findByRole('button', { name: 'Save' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Discard changes' })
      ).toBeInTheDocument();
    });

    it('should render editable fields with correct values if in edit mode', async () => {
      enterEditMode();

      expect(await screen.findByLabelText('Title')).toHaveValue(
        props.document.annotation.title
      );
      expect(
        screen.getByText(props.document.annotation.note_summary)
      ).toBeInTheDocument();
    });

    it('should update values on click of Save, dispatch toast and setRequestDocumentData', async () => {
      enterEditMode();
      await user.clear(await screen.findByLabelText('Title'));
      await user.type(screen.getByLabelText('Title'), 'Test note title');

      await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test note title');
      });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(props.updateDocument).toHaveBeenCalledWith(props.document.id, {
          annotation: { title: 'Test note title' },
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
      enterEditMode();
      await user.clear(await screen.findByLabelText('Title'));
      await user.type(screen.getByLabelText('Title'), 'Test note title');

      await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test note title');
      });

      await user.click(screen.getByRole('button', { name: 'Discard changes' }));

      await waitFor(() => {
        expect(props.updateDocument).not.toHaveBeenCalled();
      });
    });
  });
});
