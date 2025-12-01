import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import UpdateDrillLibraryItemModal from '../UpdateDrillLibraryItemModal';

describe('UpdateDrillLibraryItemModal', () => {
  const props = {
    libraryDrillToUpdate: {
      drill: {
        id: 13,
        event_activity_type: {
          id: 1,
          name: 'Conditioning',
          event_activity_type_category: {
            id: 1,
            name: 'Tester',
          },
        },
        name: 'V Light',
        duration: null,
        sets: null,
        reps: null,
        rest_duration: null,
        pitch_width: null,
        pitch_length: null,
        intensity: 'high',
        principles: [],
        notes: '<p><br></p>',
        diagram: null,
        attachments: [],
        links: [],
        event_activity_drill_labels: [
          {
            id: 1,
            name: 'drill 1',
            archived: false,
          },
        ],
        library: true,
        created_by: {
          id: 133800,
          fullname: 'Rory Harford',
        },
      },
      diagram: null,
      attachments: null,
    },
    isOpen: true,
    onComposeActivityDrill: jest.fn(),
    setActivityPanelMode: jest.fn(),
    setLibraryDrillToUpdate: jest.fn(),
    setDrillDisplaySidePanel: jest.fn(),
    setSelectedDrill: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the correct content', async () => {
    render(<UpdateDrillLibraryItemModal {...props} />);
    expect(screen.getByText(/drill update options/i)).toBeInTheDocument();
    expect(screen.getAllByText(/update in the library/i)).toHaveLength(2);
    expect(
      screen.getByText(
        /this update will change the drill in the library for everyone\. \(a legacy version of this drill will still appear in all old session plans\.\)/i
      )
    ).toBeInTheDocument();

    expect(screen.getAllByText(/update in the session only/i)).toHaveLength(2);
    expect(
      screen.getByText(
        /update in this session only this will not effect any drills in your library\. it only applies changes to this session\./i
      )
    ).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', {
      name: 'Cancel',
      hidden: true,
    });
    const updateInSession = screen.getByRole('button', {
      name: 'Update in the session only',
      hidden: true,
    });
    const updateInLibrary = screen.getByRole('button', {
      name: 'Update in the library',
      hidden: true,
    });

    expect(cancelButton).toBeInTheDocument();
    expect(updateInSession).toBeInTheDocument();
    expect(updateInLibrary).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(props.setLibraryDrillToUpdate).toHaveBeenCalled();

    await userEvent.click(updateInSession);
    expect(props.onComposeActivityDrill).toHaveBeenCalled();
    expect(props.setActivityPanelMode).toHaveBeenCalled();
    expect(props.setLibraryDrillToUpdate).toHaveBeenCalledTimes(2);
  });

  it('hides the correct data if FF -> hide-update-drill-button is present', async () => {
    window.setFlag('hide-update-drill-button', true);

    render(<UpdateDrillLibraryItemModal {...props} />);
    expect(screen.getByText(/drill update options/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/update in the library/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /this update will change the drill in the library for everyone\. \(a legacy version of this drill will still appear in all old session plans\.\)/i
      )
    ).not.toBeInTheDocument();

    expect(screen.getAllByText(/update in the session only/i)).toHaveLength(2);
    expect(
      screen.getByText(
        /update in this session only this will not effect any drills in your library\. it only applies changes to this session\./i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Cancel',
        hidden: true,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Update in the session only',
        hidden: true,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Update in the library',
        hidden: true,
      })
    ).not.toBeInTheDocument();
    window.setFlag('hide-update-drill-button', false);
  });
});
