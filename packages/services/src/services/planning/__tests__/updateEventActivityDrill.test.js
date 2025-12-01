import { axios } from '@kitman/common/src/utils/services';
import updateEventActivityDrill from '../updateEventActivityDrill';

describe('updateEventActivityDrill', () => {
  const attributes = {
    attachments: [],
    attachments_attributes: [],
    created_by: { id: 10, fullname: 'Rory Harford' },
    diagram: null,
    duration: null,
    event_activity_drill_label_ids: [],
    event_activity_drill_labels: [],
    event_activity_type: null,
    id: 15,
    intensity: null,
    library: true,
    links: [],
    name: 'Updating Drill item',
    notes: '<p><br></p>',
    pitch_length: null,
    pitch_width: null,
    principles: [],
    reps: null,
    rest_duration: null,
    sets: null,
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'patch').mockResolvedValue({});

    await updateEventActivityDrill(attributes);
    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      `/planning_hub/event_activity_drills/${attributes.id}`,
      attributes
    );
  });
});
