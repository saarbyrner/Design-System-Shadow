import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import NoteDetailModal from '..';

describe('<NoteDetailModal />', () => {
  const mockOnClickCloseModal = jest.fn();

  const props = {
    isOpen: true,
    requestStatus: 'success',
    annotation: {
      id: 1,
      title: 'Note title',
      annotation_date: '2020-11-24T00:00:00Z',
      organisation_annotation_type: {
        name: 'Evaluation note',
      },
      annotationable: {
        fullname: 'John Doh',
      },
      content: 'Note content',
      annotation_actions: [
        { id: 1, completed: true, content: 'Action 1 content', users: [] },
        {
          id: 2,
          completed: false,
          content: 'Action 2 content',
          users: [
            { id: 1, fullname: 'John Doe' },
            { id: 2, fullname: 'Richard Roe' },
          ],
        },
      ],
      created_at: '2019-10-22T09:43:11Z',
      created_by: { id: 31369, fullname: 'Rory Thornburgh' },
      updated_by: null,
      updated_at: null,
    },
    currentUser: { id: 1, fullname: 'John Doe' },
    onClickCloseModal: mockOnClickCloseModal,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('contains a modal', () => {
    renderWithStore(<NoteDetailModal {...props} />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('Action details')).toBeInTheDocument();
  });

  describe('when the standard-date-formatting flag is off', () => {
    it('contains the note details', () => {
      renderWithStore(<NoteDetailModal {...props} />);

      expect(screen.getByText('Note title')).toBeInTheDocument();
      expect(
        screen.getByText('24 Nov 2020 | Evaluation note')
      ).toBeInTheDocument();
      expect(screen.getByText('John Doh')).toBeInTheDocument();
      expect(screen.getByText('Note content')).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    afterEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('contains the note details', () => {
      renderWithStore(<NoteDetailModal {...props} />);

      expect(screen.getByText('Note title')).toBeInTheDocument();
      expect(
        screen.getByText('Nov 24, 2020 | Evaluation note')
      ).toBeInTheDocument();
      expect(screen.getByText('John Doh')).toBeInTheDocument();
      expect(screen.getByText('Note content')).toBeInTheDocument();
    });
  });

  it('contains the actions list', () => {
    renderWithStore(<NoteDetailModal {...props} />);

    expect(screen.getByText('Actions (1/2)')).toBeInTheDocument();

    // Check first action
    expect(screen.getByText('Action 1 content')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'true');

    // Check second action
    expect(screen.getByText('Action 2 content')).toBeInTheDocument();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[1]).toHaveAttribute('aria-checked', 'false');
    expect(
      screen.getByText('Assigned to you and Richard Roe')
    ).toBeInTheDocument();
  });

  it('calls the correct props when closing the modal', async () => {
    const user = userEvent.setup();
    renderWithStore(<NoteDetailModal {...props} />);

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(mockOnClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('shows the AppStatus when the content failed to load', () => {
    renderWithStore(<NoteDetailModal {...props} requestStatus="error" />);

    expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
  });

  it('shows the AppStatus when the content is loading', () => {
    renderWithStore(<NoteDetailModal {...props} requestStatus="loading" />);

    expect(screen.getByTestId('AppStatus-loading')).toBeInTheDocument();
  });

  describe('when the standard-date-formatting flag is off the note metadata', () => {
    it('displays the correct note metadata', () => {
      renderWithStore(<NoteDetailModal {...props} />);

      expect(
        screen.getByText('Created by Rory Thornburgh on 22 Oct 2019')
      ).toBeInTheDocument();
    });

    it('displays the last edited details', () => {
      renderWithStore(
        <NoteDetailModal
          {...props}
          annotation={{
            ...props.annotation,
            updated_by: { id: 112, fullname: 'John Doyle' },
            updated_at: '2019-10-25T09:43:11Z',
          }}
        />
      );

      expect(
        screen.getByText('Last Edited by John Doyle on 25 Oct 2019')
      ).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on the note metadata', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    afterEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('displays the correct note metadata', () => {
      renderWithStore(<NoteDetailModal {...props} />);

      expect(
        screen.getByText('Created by Rory Thornburgh on Oct 22, 2019')
      ).toBeInTheDocument();
    });

    it('displays the last edited details', () => {
      renderWithStore(
        <NoteDetailModal
          {...props}
          annotation={{
            ...props.annotation,
            updated_by: { id: 112, fullname: 'John Doyle' },
            updated_at: '2019-10-25T09:43:11Z',
          }}
        />
      );

      expect(
        screen.getByText('Last Edited by John Doyle on Oct 25, 2019')
      ).toBeInTheDocument();
    });
  });

  describe('the note metadata', () => {
    it('does not display the last edited details if updated_by is null', () => {
      renderWithStore(<NoteDetailModal {...props} />);

      expect(screen.queryByText(/Last Edited by/)).not.toBeInTheDocument();
    });
  });
});
