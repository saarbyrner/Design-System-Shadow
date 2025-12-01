import { render, screen } from '@testing-library/react';
import Content from '@kitman/modules/src/HumanInput/shared/components/LayoutElements/Content';

jest.mock('@kitman/components/src/PdfViewer', () => {
  return {
    PdfViewerTranslated: jest.fn((props) => (
      <div data-testid="mockPdfViewer" {...props} />
    )),
  };
});

const MOCK_PDF_CONTENT_ELEMENT = {
  id: 7372,
  element_type: 'Forms::Elements::Layouts::Content',
  config: {
    text: 'Privacy Policy',
    source: 'https://kitman.imgix.net/mls/policies/athlete_privacy_policy.pdf',
    element_id: 'acknowledgement_privacy_policy_section_content',
    optional: true,
    custom_params: {
      content_type: 'pdf',
      display: 'inline',
    },
    type: 'external',
  },
  visible: true,
  order: 1,
  form_elements: [],
};

const MOCK_MARKDOWN_CONTENT_ELEMENT = {
  id: 4772,
  element_type: 'Forms::Elements::Layouts::Content',
  config: {
    text: 'SafeSport is a USSF & NEXT mandated requirement focused that has developed resources and policies to safeguard members from bullying, harassment, hazing, physical abuse, emotional abuse, sexual abuse, and sexual misconduct. This must be completed if the player turns 18 within the \'23/\'24 season.<br/><br/><a href="https://safesporttrained.org/#/signup-form" target="_blank">Start course</a><br/><br/>After course completion, please upload your certificate.',
    element_id: 'attachment_section_impact_baseline_text',
    custom_params: {
      content_type: 'markdown',
    },
  },
  visible: true,
  order: 1,
  form_elements: [],
};

const MOCK_HTML_CONTENT_ELEMENT = {
  id: 4772,
  element_type: 'Forms::Elements::Layouts::Content',
  config: {
    text: '<p>What are the top 3 priorities:</p>\n<ol>\n  <li>Priority number one</li>\n  <li>Priority number two</li>\n  <li>Priority number three</li>\n  <li>Priority number four</li>\n</ol>',
    element_id: 'attachment_section_impact_baseline_text',
    custom_params: {
      content_type: 'html',
    },
  },
  visible: true,
  order: 1,
  form_elements: [],
};

const DEFAULT_TEXT_CONTEXT_ELEMENT = {
  id: 7372,
  element_type: 'Forms::Elements::Layouts::Content',
  config: {
    text: 'Text content example',
    element_id: 'text_example_id',
    optional: true,
    custom_params: {
      display: 'inline',
    },
  },
  visible: true,
  order: 1,
  form_elements: [],
};

describe('<Content/>', () => {
  describe('pdf content_type', () => {
    it('renders', () => {
      render(<Content element={MOCK_PDF_CONTENT_ELEMENT} />);

      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByTestId('mockPdfViewer')).toBeInTheDocument();
    });
  });

  describe('markdown content_type', () => {
    it('renders', () => {
      render(<Content element={MOCK_MARKDOWN_CONTENT_ELEMENT} />);

      const richTextContent = screen.getByTestId('richTextContent');

      expect(richTextContent).toHaveTextContent(
        `SafeSport is a USSF & NEXT mandated requirement focused that has developed resources and policies to safeguard members from bullying, harassment, hazing, physical abuse, emotional abuse, sexual abuse, and sexual misconduct. This must be completed if the player turns 18 within the '23/'24 season.`
      );

      expect(
        screen.getByRole('link', { name: 'Start course' })
      ).toBeInTheDocument();

      expect(richTextContent).toHaveTextContent(
        'After course completion, please upload your certificate.'
      );
    });
  });

  describe('html content_type', () => {
    it('renders', () => {
      render(<Content element={MOCK_HTML_CONTENT_ELEMENT} />);

      expect(
        screen.getByText('What are the top 3 priorities:')
      ).toBeInTheDocument();

      expect(screen.getByRole('list')).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(4);

      expect(listItems[0]).toHaveTextContent('Priority number one');
      expect(listItems[1]).toHaveTextContent('Priority number two');
      expect(listItems[2]).toHaveTextContent('Priority number three');
      expect(listItems[3]).toHaveTextContent('Priority number four');
    });
  });

  describe('default', () => {
    it('renders', () => {
      render(<Content element={DEFAULT_TEXT_CONTEXT_ELEMENT} />);

      expect(screen.getByText('Text content example')).toBeInTheDocument();
    });
  });
});
