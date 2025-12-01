import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TimezonesContext from '@kitman/modules/src/Assessments/contexts/TimezonesContext';
import CommentsSidePanel from '../../gridView/CommentsSidePanel';

describe('<CommentsSidePanel />', () => {
  let baseProps;
  let timezones;

  beforeEach(() => {
    timezones = { orgTimezone: 'UTC' };

    baseProps = {
      viewType: 'PRESENTATION',
      isCurrentSquad: true,
      selectedAthlete: { id: 12410, fullname: 'John Doe' },
      athletes: [
        { id: 12410, fullname: 'John Doe' },
        { id: 45557, fullname: 'Peter Callahan' },
        { id: 96844, fullname: 'Thomas Roth' },
        { id: 25456, fullname: 'Fred Dalinger' },
      ],
      comments: [
        {
          assessmentItemId: 4582,
          assessmentItemName: 'Muscles',
          note: {
            content: '<p>Muscle mass has increased</p>',
            edit_history: {
              date: '2020-11-12T09:00:44Z',
              user: { fullname: 'Ian Surinam' },
            },
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
            content: '<p>Losing flexibility</p>',
            edit_history: {
              date: '2020-10-25T10:30:25Z',
              user: { fullname: 'Phillip Lamb' },
            },
          },
        },
      ],
      onSave: jest.fn(),
      onClose: jest.fn(),
      onChangeViewType: jest.fn(),
      onChangeSelectedAthlete: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  const renderComponent = (props) => {
    return render(
      <TimezonesContext.Provider value={timezones}>
        <CommentsSidePanel {...props} />
      </TimezonesContext.Provider>
    );
  };

  describe('Presentation View', () => {
    it('renders correctly with title, comments, and navigation', () => {
      renderComponent(baseProps);
      expect(screen.getByText('Comments')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Fred Dalinger' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Peter Callahan' })
      ).toBeInTheDocument();
      expect(screen.getByText('Muscles')).toBeInTheDocument();
      expect(
        screen.getByText(/Muscle mass has increased/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    });

    it('toggles all comments open and closed', async () => {
      const user = userEvent.setup();
      renderComponent(baseProps);
      const commentContent = screen.getByText(/Muscle mass has increased/i);
      const toggleButton = screen.getByRole('button', { name: /close all/i });

      expect(commentContent).toBeVisible();
      await user.click(toggleButton);
      expect(
        screen.getByRole('button', { name: /open all/i })
      ).toBeInTheDocument();
      expect(commentContent).not.toBeVisible();
    });

    it('navigates to the next and previous athlete', async () => {
      const user = userEvent.setup();
      renderComponent(baseProps);
      await user.click(screen.getByRole('button', { name: 'Peter Callahan' }));
      expect(baseProps.onChangeSelectedAthlete).toHaveBeenCalledWith(1);

      await user.click(screen.getByRole('button', { name: 'Fred Dalinger' }));
      expect(baseProps.onChangeSelectedAthlete).toHaveBeenCalledWith(3);
    });

    it('calls onClose when the Done button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(baseProps);
      await user.click(screen.getByRole('button', { name: 'Done' }));
      expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });

    describe('Conditional Rendering', () => {
      it('hides athlete navigation when there are fewer than 3 athletes', () => {
        renderComponent({
          ...baseProps,
          athletes: [baseProps.athletes[0], baseProps.athletes[1]],
        });
        expect(
          screen.queryByRole('button', { name: 'Fred Dalinger' })
        ).not.toBeInTheDocument();
      });

      it('hides edit buttons when not in the current squad', () => {
        renderComponent({ ...baseProps, isCurrentSquad: false });
        expect(
          screen.queryByRole('button', { name: 'Edit' })
        ).not.toBeInTheDocument();
      });

      it('shows an "Add comments" button and disables toggle when there are no notes', () => {
        const noComments = baseProps.comments.map((c) => ({
          ...c,
          note: null,
        }));

        renderComponent({ ...baseProps, comments: noComments });

        expect(
          screen.getByRole('button', { name: /add comments/i })
        ).toBeInTheDocument();

        expect(
          screen.getByRole('button', { name: /close all/i })
        ).toBeDisabled();
      });
    });
  });

  describe('Edition View', () => {
    it('renders correctly in edit mode', () => {
      renderComponent({ ...baseProps, viewType: 'EDITION' });
      expect(screen.getByText('Edit comments')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Peter Callahan' })
      ).not.toBeInTheDocument(); // Athlete nav is hidden
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
    });

    it('calls onChangeViewType when Cancel is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ ...baseProps, viewType: 'EDITION' });
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(baseProps.onChangeViewType).toHaveBeenCalledWith('PRESENTATION');
    });
  });
});
