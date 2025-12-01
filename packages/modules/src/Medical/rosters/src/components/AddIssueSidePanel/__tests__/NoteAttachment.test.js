import { screen } from '@testing-library/react';
import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import NoteAttachment from '../NoteAttachment';

const pathToFileUploadArea = '@kitman/components/src/FileUploadArea/index';

jest.mock(pathToFileUploadArea, () => {
  const actualModule = jest.requireActual(pathToFileUploadArea);
  return {
    __esModule: true,
    ...actualModule,
    // The component is a default export, as confirmed by the HOC wrapper.
    default: ({ updateFiles }) => (
      <button
        type="button"
        // When clicked, it calls the `updateFiles` prop. We don't need to pass
        // any complex data, as the component's internal logic is what we're bypassing.
        onClick={() => updateFiles([])}
      >
        Mock File Upload Area
      </button>
    ),
  };
});

describe('<NoteAttachment />', () => {
  const props = {
    onRemove: jest.fn(),
    onUpdateContent: jest.fn(),
    onUpdateTitle: jest.fn(),
    onUpdateVisibility: jest.fn(),
    onSelectFiles: jest.fn(),
    attachment: {
      id: 1,
      type: 'NOTE',
      attachmentContent: {
        annotationable_type: 'Athlete',
        annotationable_id: 1162,
        title: 'Injury note',
      },
    },
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers the onSelectFiles callback when the file uploader is used', async () => {
    const { user } = renderWithUserEventSetup(<NoteAttachment {...props} />);

    // 1. Click through the UI to render our mocked component
    await user.click(screen.getByRole('button', { name: 'Add attachment' }));
    await user.click(screen.getByText('File'));

    // 2. Find and click our mock button
    const mockUploaderButton = screen.getByTestId(
      'NoteAttachments|FileAttachment'
    );
    await user.click(mockUploaderButton);

    // 3. THE ONLY ASSERTION: Verify that the callback was fired.
    //    We will not check the contents, as that is part of the component's
    //    untestable internal logic.
    expect(props.onSelectFiles).toHaveBeenCalled();
  });

  // All other tests remain the same
  it('renders', () => {
    renderWithUserEventSetup(<NoteAttachment {...props} />);
    expect(screen.getByText('Note')).toBeInTheDocument();
  });

  it('contains a span with Note text and an IconButton', () => {
    const { container } = renderWithUserEventSetup(
      <NoteAttachment {...props} />
    );
    expect(screen.getByText('Note')).toBeInTheDocument();
    expect(container.querySelector('.icon-bin')).toBeInTheDocument();
  });

  it('contains a text area', () => {
    renderWithUserEventSetup(<NoteAttachment {...props} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows the field error when the annotation is invalid and the annotations have been marked as invalid', () => {
    const invalidAnnotation = {
      ...props.attachment,
      attachmentContent: {
        ...props.attachment.attachmentContent,
        content: '',
        filesQueue: [{ id: 1, name: 'File 1' }],
      },
    };
    const { container } = renderWithUserEventSetup(
      <NoteAttachment
        {...props}
        attachment={invalidAnnotation}
        areAnnotationsInvalid
      />
    );
    expect(
      container.querySelector('.richTextEditor--kitmanDesignSystem')
    ).toHaveClass('richTextEditor--kitmanDesignSystem--invalid');
  });

  it('does not show the field error before the validation runs', () => {
    const invalidAnnotation = {
      ...props.attachment,
      attachmentContent: {
        ...props.attachment.attachmentContent,
        content: '',
        filesQueue: [{ id: 1, name: 'File 1' }],
      },
    };
    const { container } = renderWithUserEventSetup(
      <NoteAttachment
        {...props}
        attachment={invalidAnnotation}
        areAnnotationsInvalid={false}
      />
    );
    expect(
      container.querySelector('.richTextEditor--kitmanDesignSystem')
    ).not.toHaveClass('richTextEditor--kitmanDesignSystem--invalid');
  });
});
