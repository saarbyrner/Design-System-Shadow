import $ from 'jquery';
import deleteLastEvent from '../deleteLastEvent';

describe('deleteLastEvent', () => {
  let deleteLastEventRequest;
  const athleteId = 1994;
  const occurrenceId = 2020;

  beforeEach(() => {
    const deferred = $.Deferred();
    deleteLastEventRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('deleting a event from a injury', () => {
    it('calls the correct endpoint with the correct arguments', async () => {
      await deleteLastEvent(athleteId, occurrenceId, 'Injury');
      expect(deleteLastEventRequest).toHaveBeenCalledTimes(1);
      expect(deleteLastEventRequest).toHaveBeenLastCalledWith({
        contentType: 'application/json',
        data: JSON.stringify({
          scope_to_org: true,
        }),
        headers: { 'X-CSRF-Token': undefined },
        method: 'POST',
        url: '/athletes/1994/injuries/2020/delete_last_event',
      });
    });
  });

  describe('deleting a event from a illness', () => {
    it('calls the correct endpoint with the correct arguments', async () => {
      await deleteLastEvent(athleteId, occurrenceId, 'Illness');
      expect(deleteLastEventRequest).toHaveBeenCalledTimes(1);
      expect(deleteLastEventRequest).toHaveBeenLastCalledWith({
        contentType: 'application/json',
        data: JSON.stringify({
          scope_to_org: true,
        }),
        headers: { 'X-CSRF-Token': undefined },
        method: 'POST',
        url: '/athletes/1994/illnesses/2020/delete_last_event',
      });
    });
  });
});
