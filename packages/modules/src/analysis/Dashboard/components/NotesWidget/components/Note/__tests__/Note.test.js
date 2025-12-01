import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Note from '../index';

describe('<Note />', () => {
  const props = {
    annotation: {
      annotation_actions: [
        {
          completed_at: null,
          content: 'Does it work?',
          id: 2,
          user: {
            id: 1,
            fullname: 'Test User',
          },
        },
      ],
      annotation_date: '2019-10-21T23:00:00Z',
      annotationable: { id: 28022, fullname: 'Fabi Menghini' },
      annotationable_type: 'Athlete',
      archived: false,
      attachments: [], // Add attachments property
      content: 'Blah Blah Blah',
      created_at: '2019-10-22T09:43:11Z',
      created_by: { id: 31369, fullname: 'Rory Thornburgh' },
      id: 2,
      organisation_annotation_type: {
        id: 1,
        name: 'CSR',
        type: 'Evaluation',
      },
      title: 'Test 2',
    },
    canEditNotes: true,
    t: i18nextTranslateStub(),
    isExpanded: false,
    onClickActionCheckbox: jest.fn(),
    onArchiveNote: jest.fn(),
    onEditNote: jest.fn(),
    onDuplicateNote: jest.fn(),
    onRestoreNote: jest.fn(),
    updatedAction: {},
    noteViewStatus: null,
    noteViewMessage: null,
    hideNoteViewStatus: jest.fn(),
    widgetId: null,
    onDeleteAttachment: jest.fn(),
    users: [],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithStore(<Note {...props} />);

    expect(screen.getByText('Test 2')).toBeInTheDocument();
    expect(screen.getByText('21 Oct 2019 | CSR')).toBeInTheDocument();
    expect(screen.getByText('Blah Blah Blah')).toBeInTheDocument();
  });

  it('renders the correct title class when not expanded', () => {
    renderWithStore(<Note {...props} />);

    expect(screen.getByText('Test 2')).toHaveClass('note__title');
  });

  it('renders the correct title class when expanded', () => {
    renderWithStore(<Note {...props} isExpanded />);

    expect(screen.getByText('Test 2')).toHaveClass('note__title--expanded');
  });

  describe('when the standard-date-formatting flag is off', () => {
    it('shows the correct date and note type', () => {
      renderWithStore(<Note {...props} />);

      expect(screen.getByText('21 Oct 2019 | CSR')).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    afterEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('shows the correct date and note type', () => {
      renderWithStore(<Note {...props} />);

      expect(screen.getByText('Oct 21, 2019 | CSR')).toBeInTheDocument();
    });
  });

  it('shows the correct population', () => {
    renderWithStore(<Note {...props} />);

    expect(screen.getByText('Fabi Menghini')).toBeInTheDocument();
  });

  it('renders an AnnotationMenu component', () => {
    renderWithStore(<Note {...props} />);

    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();
  });

  it('shows the correct note content', () => {
    renderWithStore(<Note {...props} />);

    expect(screen.getByText('Blah Blah Blah')).toBeInTheDocument();
  });

  it('renders an ActionSummary component when not expanded', () => {
    renderWithStore(<Note {...props} />);

    expect(screen.getByText('0/1')).toBeInTheDocument();
  });

  describe('when a note is archived', () => {
    const propsWithNote = {
      ...props,
      annotation: {
        ...props.annotation,
        annotation_actions: [],
        archived: true,
      },
    };

    it('renders correctly when archived', () => {
      renderWithStore(<Note {...propsWithNote} />);

      expect(screen.getByText('Test 2')).toBeInTheDocument();
      expect(screen.getByText('Fabi Menghini')).toBeInTheDocument();
      expect(screen.getByText('Blah Blah Blah')).toBeInTheDocument();
    });
  });

  describe('when the rich-text-editor feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag('rich-text-editor', true);
    });

    afterEach(() => {
      window.setFlag('rich-text-editor', false);
    });

    it('renders a rich text display', () => {
      renderWithStore(<Note {...props} />);

      expect(screen.getByText('Blah Blah Blah')).toBeInTheDocument();
      expect(
        screen.getByText('Blah Blah Blah').closest('.richTextDisplay')
      ).toBeInTheDocument();
    });
  });

  describe('when the rep-dashboard-ui-upgrade feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', true);
    });

    afterEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', false);
    });

    it('renders the correct note title class when not expanded', () => {
      renderWithStore(<Note {...props} />);

      expect(screen.getByText('Test 2')).toHaveClass('note__titleV2');
    });

    it('renders the correct note title class when expanded', () => {
      renderWithStore(<Note {...props} isExpanded />);

      expect(screen.getByText('Test 2')).toHaveClass('note__titleV2--expanded');
    });
  });
});
