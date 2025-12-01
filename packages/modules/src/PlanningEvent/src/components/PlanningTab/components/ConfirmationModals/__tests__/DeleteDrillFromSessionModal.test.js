import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import DeleteDrillFromSessionModal from '../DeleteDrillFromSessionModal';

describe('DeleteDrillFromSessionModal', () => {
  const props = {
    dispatch: () => {},
    drillActivityToDelete: {
      id: 7,
      duration: null,
      principles: [],
      athletes: [],
      users: [],
      event_activity_drill: {
        id: 14,
        event_activity_type: null,
        name: 'Light',
        duration: null,
        sets: null,
        reps: null,
        rest_duration: null,
        pitch_width: null,
        pitch_length: null,
        intensity: 'low',
        principles: [],
        notes: '',
        diagram: null,
        attachments: [],
        links: [],
        event_activity_drill_labels: [],
        library: true,
        created_by: {
          id: 133800,
          fullname: 'Rory Harford',
        },
      },
      event_activity_type: null,
      order: null,
      note: null,
      area_size: null,
      order_label: null,
    },
    setActivities: jest.fn(),
    setDrillActivityToDelete: jest.fn(),
    eventId: 1234,
    t: i18nextTranslateStub(),
  };

  it('renders the correct content', async () => {
    render(<DeleteDrillFromSessionModal {...props} />);
    expect(
      screen.getByText('Remove drill from this session')
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Are you sure you want to remove this drill from your session? Notes, duration and area size will be lost.'
      )
    ).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', {
      name: 'Cancel',
      hidden: true,
    });
    const removeButton = screen.getByRole('button', {
      name: 'Remove',
      hidden: true,
    });
    expect(cancelButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(props.setDrillActivityToDelete).toHaveBeenCalled();
    await userEvent.click(removeButton);
    expect(props.setDrillActivityToDelete).toHaveBeenCalledTimes(2);
    expect(props.setActivities).toHaveBeenCalled();
  });
});
