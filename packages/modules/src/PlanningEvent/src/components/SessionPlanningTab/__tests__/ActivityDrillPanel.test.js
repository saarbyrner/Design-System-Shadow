import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ActivityDrillPanel from '../ActivityDrillPanel';

const props = {
  isOpen: true,
  activity: {
    event_activity_drill: {
      name: 'My First Drill',
      sets: 5,
      reps: 10,
      rest_duration: 90,
      pitch_width: 50,
      pitch_length: 50,
      notes: 'This drill will make us win game 100% of the time 2',
      links: [
        {
          title: 'Tactics Video',
          uri: 'tactics_video_url.com/video.mp4',
        },
      ],
      diagram: null,
      attachments: [],
      event_activity_drill_labels: [],
    },
  },
  onUpdateActivityDrill: jest.fn(),
  onClose: jest.fn(),
  t: i18nextTranslateStub(),
};

const dummyFileAttachment = {
  lastModified: 1542706027020,
  lastModifiedDate: '2019-06-25T23:00:00Z',
  filename: 'sample.csv',
  fileSize: 124625,
  fileType: 'text/csv',
  webkitRelativePath: '',
};

describe('ActivityDrillPanel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', async () => {
    render(<ActivityDrillPanel {...props} />);
    await waitFor(() => {
      expect(screen.getByDisplayValue('My First Drill')).toBeInTheDocument();
    });
  });

  it('calls the correct callback when closing the view', async () => {
    const user = userEvent.setup();
    render(<ActivityDrillPanel {...props} />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(cancelButton);

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('updates the title', async () => {
    render(<ActivityDrillPanel {...props} />);

    const titleInput = screen.getByPlaceholderText('Title');

    fireEvent.change(titleInput, { target: { value: 'new title' } });

    await waitFor(() => {
      expect(titleInput).toHaveValue('new title');
    });
  });

  it('renders the notes', async () => {
    render(<ActivityDrillPanel {...props} />);

    await waitFor(() => {
      expect(
        screen.getByText('This drill will make us win game 100% of the time 2')
      ).toBeInTheDocument();
    });
  });

  it('updates the linked URL title', async () => {
    render(<ActivityDrillPanel {...props} />);

    const linkTitleInput = screen.getByDisplayValue('Tactics Video');

    fireEvent.change(linkTitleInput, { target: { value: 'new link title' } });

    await waitFor(() => {
      expect(linkTitleInput).toHaveValue('new link title');
    });
  });

  it('updates the linked URL', async () => {
    render(<ActivityDrillPanel {...props} />);

    const linkUrlInput = screen.getByDisplayValue(
      'tactics_video_url.com/video.mp4'
    );

    fireEvent.change(linkUrlInput, {
      target: { value: 'new_link_url.com/file.mp4' },
    });

    await waitFor(() => {
      expect(linkUrlInput).toHaveValue('new_link_url.com/file.mp4');
    });
  });

  it('renders the link option', async () => {
    const user = userEvent.setup();
    render(<ActivityDrillPanel {...props} />);

    const addButton = screen.getByRole('button', { name: 'Add' });
    await user.click(addButton);

    const linkOption = screen.getByRole('button', { name: 'Link' });
    await waitFor(() => {
      expect(linkOption).toBeInTheDocument();
    });
  });

  it('renders clickable links for existing link attachments', async () => {
    const newLinks = [
      {
        title: 'Tactics Video',
        uri: 'tactics_video_url.com/video.mp4',
        id: 1234,
      },
      {
        title: 'Tactics Video 2',
        uri: 'tactics_video_url.com/video_2.mp4',
        id: 5432,
      },
      {
        title: '',
        uri: '',
      },
    ];
    const newActivity = {
      ...props.activity,
      event_activity_drill: {
        ...props.activity.event_activity_drill,
        links: newLinks,
      },
    };
    render(<ActivityDrillPanel {...props} activity={newActivity} />);

    await waitFor(() => {
      expect(screen.getByText('Tactics Video')).toBeInTheDocument();
    });

    expect(screen.getByText('Tactics Video 2')).toBeInTheDocument();
    const clickableLinks = screen.getAllByRole('link');
    expect(clickableLinks).toHaveLength(2);
  });

  it('removes a linked URL row', async () => {
    const newLinks = [
      {
        title: 'Tactics Video',
        uri: 'tactics_video_url.com/video.mp4',
        id: 1234,
      },
      {
        title: 'Tactics Video 2',
        uri: 'tactics_video_url.com/video_2.mp4',
        id: 5432,
      },
    ];
    const newActivity = {
      ...props.activity,
      event_activity_drill: {
        ...props.activity.event_activity_drill,
        links: newLinks,
      },
    };

    const user = userEvent.setup();
    render(<ActivityDrillPanel {...props} activity={newActivity} />);

    await waitFor(() => {
      expect(screen.getByText('Tactics Video')).toBeInTheDocument();
    });
    expect(screen.getByText('Tactics Video 2')).toBeInTheDocument();
    // Find remove buttons by looking for icon-close elements
    const removeButtons = screen
      .getAllByRole('button')
      .filter((button) => button.querySelector('.icon-close'));

    await user.click(removeButtons[removeButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText('Tactics Video')).toBeInTheDocument();
    });
    expect(screen.queryByText('Tactics Video 2')).not.toBeInTheDocument();
  });

  it('shows the attachments field when selected', async () => {
    const user = userEvent.setup();
    render(<ActivityDrillPanel {...props} />);

    const addButton = screen.getByRole('button', { name: 'Add' });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/attachment/i)).toBeInTheDocument();
    });
  });

  it('renders the drill label select disabled when the request is loading', async () => {
    server.use(
      rest.get(
        '/ui/planning_hub/event_activity_drill_labels',
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );

    render(<ActivityDrillPanel {...props} />);

    const selectInput = screen.getByLabelText('Drill label(s)');
    await waitFor(() => {
      expect(selectInput).toBeDisabled();
    });
  });

  describe('drill label behaviour', () => {
    it('renders the drill label select enabled after loading', async () => {
      render(<ActivityDrillPanel {...props} />);
      const selectInput = screen.getByLabelText('Drill label(s)');
      await waitFor(() => {
        expect(selectInput).toBeEnabled();
      });
    });

    it('passes the correct drill label options to the select', async () => {
      render(<ActivityDrillPanel {...props} />);
      const selectInput = screen.getByLabelText('Drill label(s)');
      await waitFor(() => {
        expect(selectInput).toBeEnabled();
      });

      selectEvent.openMenu(selectInput);

      // Check that the options from MSW data are available
      await waitFor(() => {
        expect(screen.getByText('Drill label 1')).toBeInTheDocument();
      });
      expect(screen.getByText('Drill label 2')).toBeInTheDocument();
      expect(screen.getByText('Drill label 3')).toBeInTheDocument();
    });

    it('updates the drill labels', async () => {
      const user = userEvent.setup();
      render(<ActivityDrillPanel {...props} />);

      const selectInput = screen.getByLabelText('Drill label(s)');
      await waitFor(() => {
        expect(selectInput).toBeEnabled();
      });

      selectEvent.openMenu(selectInput);

      await user.click(screen.getByText('Drill label 1'));

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => {
        expect(saveButton).toBeEnabled();
      });
    });

    it('handles drill label request failure', async () => {
      // Override MSW handler to simulate API failure
      server.use(
        rest.get(
          '/ui/planning_hub/event_activity_drill_labels',
          (req, res, ctx) => {
            return res(ctx.status(500));
          }
        )
      );

      render(<ActivityDrillPanel {...props} />);

      // The select should remain disabled when request fails
      const selectInput = screen.getByLabelText('Drill label(s)');
      await waitFor(() => {
        expect(selectInput).toBeDisabled();
      });
    });
  });

  describe('file handling', () => {
    it('handles diagram uploads', async () => {
      const newActivity = {
        ...props.activity,
        event_activity_drill: {
          ...props.activity.event_activity_drill,
          diagram: {
            original_filename: dummyFileAttachment.filename,
            filetype: dummyFileAttachment.fileType,
            filesize: dummyFileAttachment.fileSize,
          },
        },
      };

      const user = userEvent.setup();

      render(<ActivityDrillPanel {...props} activity={newActivity} />);

      // Verify diagram section is present
      await waitFor(() => {
        expect(screen.getByText('Attach drill diagram')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: 'Save' });

      await user.click(saveButton);

      await waitFor(() => {
        expect(props.onUpdateActivityDrill).toHaveBeenCalled();
      });
    });
  });
});
