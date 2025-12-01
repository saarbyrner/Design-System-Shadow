import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TimezonesContext from '@kitman/modules/src/Assessments/contexts/TimezonesContext';
import CommentsSidePanel from '../CommentsSidePanel';

// Define timezones object
const timezones = {
  orgTimezone: 'UTC',
};

const mockOnSave = jest.fn();
const mockOnClose = jest.fn();
const mockOnChangeViewType = jest.fn();
const mockOnChangeSelectedAthlete = jest.fn();

const props = {
  viewType: 'VIEW',
  isCurrentSquad: true,
  isOpen: true,
  selectedAthlete: {
    id: 12410,
    firstname: 'John',
    lastname: 'Doe',
    fullname: 'John Doe',
    avatar_url: '/john_doe_avatar.png',
    position_group: 'Back',
  },
  athletes: [
    {
      id: 12410,
      fullname: 'John Doe',
      avatar_url: '/john_doe_avatar.png',
      position_group: 'Back',
    },
    {
      id: 45557,
      fullname: 'Peter Callahan',
      avatar_url: '/peter_callahan_avatar.png',
      position_group: 'Back',
    },
    {
      id: 96844,
      fullname: 'Thomas Roth',
      avatar_url: '/thomas_roth_avatar.png',
      position_group: 'Back',
    },
    {
      id: 25456,
      fullname: 'Fred Dalinger',
      avatar_url: '/fred_dalinger_avatar.png',
      position_group: 'Back',
    },
  ],
  comments: [
    {
      assessmentItemId: 4582,
      assessmentItemName: 'Muscles',
      note: {
        content:
          '<p>His muscle mass have increased a <em>2.5%</em> in the last 2 months</p>',
        createdAt: '2020-11-12T09:00:44Z',
      },
    },
    {
      assessmentItemId: 7144,
      assessmentItemName: 'metabolic_power_band_3_total_duration',
      note: null,
    },
    {
      assessmentItemId: 4657,
      assessmentItemName: 'Body Flexibility',
      note: {
        content:
          '<p>He is <strong>loosing flexibility</strong> but we should not be very worried about it</p>',
        createdAt: '2021-04-06T09:00:44Z',
      },
    },
    {
      assessmentItemId: 3319,
      assessmentItemName: 'Body Weight',
      note: {
        content: '<p>He barely <u>gains weight</u></p>',
        createdAt: '2021-06-20T09:00:44Z',
      },
    },
  ],
  canAnswerAssessment: true,
  onSave: mockOnSave,
  onClose: mockOnClose,
  onChangeViewType: mockOnChangeViewType,
  onChangeSelectedAthlete: mockOnChangeSelectedAthlete,
  t: i18nextTranslateStub(),
};

const renderComponent = (componentProps = props) => {
  return render(
    <TimezonesContext.Provider value={timezones}>
      <CommentsSidePanel {...componentProps} />
    </TimezonesContext.Provider>
  );
};

describe('CommentsSidePanel component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset feature flags
    window.featureFlags = {
      'standard-date-formatting': false,
    };
  });

  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('prevents editing when canAnswerAssessment is false', () => {
    renderComponent({ ...props, canAnswerAssessment: false });

    // The Edit button should be disabled
    const editButtons = screen.getAllByText('Edit');
    editButtons.forEach((button) => {
      expect(button.parentElement).toBeDisabled();
    });
  });

  it('prevents adding comments when canAnswerAssessment is false', () => {
    const comments = [
      {
        assessmentItemId: 4582,
        assessmentItemName: 'Muscles',
        note: {
          content: '',
        },
      },
      {
        assessmentItemId: 4657,
        assessmentItemName: 'Body Flexibility',
        note: {
          content: '<p><br></p>',
        },
      },
      {
        assessmentItemId: 3319,
        assessmentItemName: 'Body Weight',
        note: null,
      },
    ];

    renderComponent({ ...props, comments, canAnswerAssessment: false });

    // The Add comments button should be disabled
    const addCommentsButton = screen.getByText('Add comments');
    expect(addCommentsButton.parentElement).toBeDisabled();
  });

  it('closes/opens all the comments', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Initially should show "Close all"
    const toggleButton = screen.getByText('Close all');
    expect(toggleButton).toBeInTheDocument();

    // Click to close all
    await user.click(toggleButton);

    // Should now show "Open all"
    expect(screen.getByText('Open all')).toBeInTheDocument();

    // Click to open all
    await user.click(screen.getByText('Open all'));

    // Should show "Close all" again
    expect(screen.getByText('Close all')).toBeInTheDocument();
  });

  describe('when the view type is VIEW', () => {
    it('displays the title with the correct text', () => {
      renderComponent();

      expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    it('displays the athlete navigation', () => {
      renderComponent();

      // Should show navigation buttons for previous and next athletes
      expect(screen.getByText('Fred Dalinger')).toBeInTheDocument();
      expect(screen.getByText('Peter Callahan')).toBeInTheDocument();
    });

    it('displays the previous athlete button with the correct text', () => {
      renderComponent();

      expect(screen.getByText('Fred Dalinger')).toBeInTheDocument();
    });

    it('displays the next athlete button with the correct text', () => {
      renderComponent();

      expect(screen.getByText('Peter Callahan')).toBeInTheDocument();
    });

    describe('when the number of athletes is less than 3', () => {
      it('does not display the athlete navigation', () => {
        const updatedAthletes = [
          {
            id: 12410,
            fullname: 'John Doe',
            avatar_url: '/john_doe_avatar.png',
            position_group: 'Back',
          },
          {
            id: 45557,
            fullname: 'Peter Callahan',
            avatar_url: '/peter_callahan_avatar.png',
            position_group: 'Back',
          },
        ];

        renderComponent({ ...props, athletes: updatedAthletes });

        // Should not show navigation buttons
        expect(screen.queryByText('Fred Dalinger')).not.toBeInTheDocument();
        expect(screen.queryByText('Peter Callahan')).not.toBeInTheDocument();
      });
    });

    describe('when clicking previous athlete button', () => {
      it('calls onProps.onChangeSelectedAthlete with the correct index', async () => {
        const user = userEvent.setup();
        renderComponent();

        const previousButton = screen.getByText('Fred Dalinger');
        await user.click(previousButton);

        expect(mockOnChangeSelectedAthlete).toHaveBeenCalledWith(3);
      });
    });

    describe('when clicking next athlete button', () => {
      it('calls onProps.onChangeSelectedAthlete with the correct index', async () => {
        const user = userEvent.setup();
        renderComponent();

        const nextButton = screen.getByText('Peter Callahan');
        await user.click(nextButton);

        expect(mockOnChangeSelectedAthlete).toHaveBeenCalledWith(1);
      });
    });

    describe('when the assessment squad does not match with the current squad', () => {
      describe('when there are comments', () => {
        it('removes the edit buttons', () => {
          renderComponent({ ...props, isCurrentSquad: false });

          expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        });
      });

      describe('when there are no comments', () => {
        it('removes the add comments button and displays the no comments text', () => {
          const comments = [
            {
              assessmentItemId: 4582,
              assessmentItemName: 'Muscles',
              note: {
                content: '',
              },
            },
            {
              assessmentItemId: 4657,
              assessmentItemName: 'Body Flexibility',
              note: {
                content: '<p><br></p>',
              },
            },
            {
              assessmentItemId: 3319,
              assessmentItemName: 'Body Weight',
              note: null,
            },
          ];

          renderComponent({ ...props, comments, isCurrentSquad: false });

          // Should show "No comments" text instead of "Add comments" button
          expect(screen.getByText('No comments')).toBeInTheDocument();
          expect(screen.queryByText('Add comments')).not.toBeInTheDocument();
        });
      });
    });

    describe('when the standard-date-formatting flag is off', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
      });

      it('displays the comments properly', () => {
        renderComponent();

        // Should show comment content
        expect(screen.getByText('Muscles')).toBeInTheDocument();
        expect(screen.getByText('Body Flexibility')).toBeInTheDocument();
        expect(screen.getByText('Body Weight')).toBeInTheDocument();
      });
    });

    describe('when the standard-date-formatting flag is on', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = true;
      });

      afterEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
      });

      it('displays the comments properly with standard date formatting', () => {
        renderComponent();

        // Should show comment content
        expect(screen.getByText('Muscles')).toBeInTheDocument();
        expect(screen.getByText('Body Flexibility')).toBeInTheDocument();
        expect(screen.getByText('Body Weight')).toBeInTheDocument();
      });
    });

    describe('when there are no comments', () => {
      const comments = [
        {
          assessmentItemId: 4582,
          assessmentItemName: 'Muscles',
          note: {
            content: '',
          },
        },
        {
          assessmentItemId: 4657,
          assessmentItemName: 'Body Flexibility',
          note: {
            content: '<p><br></p>',
          },
        },
        {
          assessmentItemId: 3319,
          assessmentItemName: 'Body Weight',
          note: null,
        },
      ];

      it('displays the no comments item', () => {
        renderComponent({ ...props, comments });

        expect(screen.getByText('Add comments')).toBeInTheDocument();
      });

      it('disables the toggle all button', () => {
        renderComponent({ ...props, comments });

        const toggleAllButton = screen.getByText('Close all');
        expect(toggleAllButton.parentElement).toBeDisabled();
      });

      describe('when clicking the add comments button', () => {
        it('navigates to EDIT view', async () => {
          const user = userEvent.setup();
          renderComponent({ ...props, comments });

          const addCommentsButton = screen.getByText('Add comments');
          await user.click(addCommentsButton);

          expect(mockOnChangeViewType).toHaveBeenCalledWith('EDIT');
        });
      });
    });

    it('displays the apply button with the correct text', () => {
      renderComponent();

      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    describe('when clicking the apply button', () => {
      it('calls onProps.onClose', async () => {
        const user = userEvent.setup();
        renderComponent();

        const doneButton = screen.getByText('Done');
        await user.click(doneButton);

        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('when the view type is EDIT', () => {
    it('displays the title with the correct text', () => {
      renderComponent({ ...props, viewType: 'EDIT' });

      expect(screen.getByText('Edit comments')).toBeInTheDocument();
    });

    it('does not display the athlete navigation', () => {
      renderComponent({ ...props, viewType: 'EDIT' });

      // Should not show navigation buttons in edit mode
      expect(screen.queryByText('Fred Dalinger')).not.toBeInTheDocument();
      expect(screen.queryByText('Peter Callahan')).not.toBeInTheDocument();
    });

    it('displays all comment items in edit mode', () => {
      renderComponent({ ...props, viewType: 'EDIT' });

      // Should show all comment items including empty ones
      expect(screen.getByText('Muscles')).toBeInTheDocument();
      expect(
        screen.getByText('metabolic_power_band_3_total_duration')
      ).toBeInTheDocument();
      expect(screen.getByText('Body Flexibility')).toBeInTheDocument();
      expect(screen.getByText('Body Weight')).toBeInTheDocument();
    });

    it('displays the apply buttons with the correct text', () => {
      renderComponent({ ...props, viewType: 'EDIT' });

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    describe('when clicking the cancel button', () => {
      it('calls the props.onChangeView with the correct string', async () => {
        const user = userEvent.setup();
        renderComponent({ ...props, viewType: 'EDIT' });

        const cancelButton = screen.getByText('Cancel');
        await user.click(cancelButton);

        expect(mockOnChangeViewType).toHaveBeenCalledWith('VIEW');
      });
    });
  });
});
