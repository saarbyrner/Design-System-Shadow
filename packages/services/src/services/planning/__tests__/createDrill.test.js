import { axios } from '@kitman/common/src/utils/services';
import createDrill from '../createDrill';

describe('createDrill', () => {
  const args = {
    name: '',
    event_activity_type_id: 1234,
    notes: 'try to use weaker foot throughout the drill',
    diagram: null,
    attachments: null,
    principle_ids: [1, 23, 12],
    links: [],
    event_activity_drill_labels: [{ id: 1 }, { id: 2 }],
    intensity: 'low',
    library: true,
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await createDrill(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    const expectedRequestArguments = {
      ...args,
      event_activity_drill_label_ids: [1, 2],
    };
    delete expectedRequestArguments.event_activity_drill_labels;
    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/event_activity_drills`,
      expectedRequestArguments
    );
  });
});
