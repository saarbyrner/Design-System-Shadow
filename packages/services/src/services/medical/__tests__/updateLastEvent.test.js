import $ from 'jquery';
import updateLastEvent from '../updateLastEvent';

describe('updateLastEvent', () => {
  let updateLastEventRequest;
  const athleteId = 1994;
  const issueId = 2020;

  beforeEach(() => {
    const deferred = $.Deferred();
    updateLastEventRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('updating a event from a Issue', () => {
    it('calls the correct endpoint with the correct arguments for Injuries', async () => {
      const url = `/athletes/${athleteId}/injuries/${issueId}/update_last_event`;

      await updateLastEvent(url, 3);
      expect(updateLastEventRequest).toHaveBeenCalledTimes(1);
      expect(updateLastEventRequest).toHaveBeenLastCalledWith({
        contentType: 'application/json',
        data: JSON.stringify({
          injury_status_id: 3,
          scope_to_org: true,
        }),

        headers: { 'X-CSRF-Token': undefined },
        method: 'POST',
        url: '/athletes/1994/injuries/2020/update_last_event',
      });
    });

    it('calls the correct endpoint with the correct arguments for Issues', async () => {
      const url = `/athletes/${athleteId}/illnesses/${issueId}/update_last_event`;

      await updateLastEvent(url, 3);
      expect(updateLastEventRequest).toHaveBeenCalledTimes(1);
      expect(updateLastEventRequest).toHaveBeenLastCalledWith({
        contentType: 'application/json',
        data: JSON.stringify({
          injury_status_id: 3,
          scope_to_org: true,
        }),

        headers: { 'X-CSRF-Token': undefined },
        method: 'POST',
        url: '/athletes/1994/illnesses/2020/update_last_event',
      });
    });
  });
});
