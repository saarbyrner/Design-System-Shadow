import { render, screen } from '@testing-library/react';
import Attachments from '../Attachments';

jest.mock('../NoteAttachment', () => ({
  __esModule: true,
  NoteAttachmentTranslated: (props) => (
    <div data-testid="NoteAttachment">{JSON.stringify(props.attachment)}</div>
  ),
}));

describe('<Attachments />', () => {
  const props = {
    onAddAttachment: jest.fn(),
    onRemoveAdditionalAnnotation: jest.fn(),
    onUpdateAnnotationContent: jest.fn(),
    onUpdateAnnotationVisibility: jest.fn(),
    onSelectAnnotationFiles: jest.fn(),
    setAllowCreateIssue: jest.fn(),
    selectedAttachments: [],
    uploadQueuedAttachments: false,
    areAnnotationsInvalid: false,
  };

  describe('when note is selected', () => {
    const newSelectedAttachments = [
      {
        id: 1,
        type: 'NOTE',
        attachmentContent: {
          annotationable_type: 'Athlete',
          annotationable_id: 1162,
          organisation_annotation_type_id: null,
          title: 'Injury note',
          annotation_date: '',
          content: '',
          illness_occurrence_ids: [],
          injury_occurrence_ids: [],
          restricted_to_doc: false,
          restricted_to_psych: false,
          attachments_attributes: [],
          annotation_actions_attributes: [],
        },
      },
    ];

    it('contains a NoteAttachment', () => {
      render(
        <Attachments {...props} selectedAttachments={newSelectedAttachments} />
      );
      expect(screen.getByTestId('NoteAttachment')).toBeInTheDocument();
    });
  });
});
