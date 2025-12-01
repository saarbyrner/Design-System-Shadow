import $ from 'jquery';
import saveNote, { prepareNoteData } from '../saveNote';

describe('saveNote', () => {
  let saveNoteRequest;

  const athleteID = 1;

  const mockedNote = {
    attachment_ids: [],
    note_date: '2022-01-13T00:00:00+00:00',
    note_type: 3,
    medical_type: 'TUE',
    medical_name: 'so_name',
    injury_ids: [],
    illness_ids: [],
    note: 'so note',
    expiration_date: '2022-01-13T00:00:00+00:00',
    batch_number: 'very_batch',
    renewal_date: '2022-01-13T00:00:00+00:00',
    restricted: false,
    psych_only: false,
  };

  beforeEach(() => {
    const deferred = $.Deferred();

    saveNoteRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedNote));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Saving a note', () => {
    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await saveNote(athleteID, mockedNote);

      expect(returnedData).toEqual(mockedNote);

      expect(saveNoteRequest).toHaveBeenCalledTimes(1);
      expect(saveNoteRequest).toHaveBeenCalledWith({
        method: 'POST',
        headers: {
          'X-CSRF-Token': undefined,
        },
        contentType: 'application/json',
        url: '/athletes/1/medical_notes',
        data: JSON.stringify({
          athlete_id: athleteID,
          note: prepareNoteData(mockedNote),
          from_api: true,
          scope_to_org: true,
        }),
      });
    });
  });
});
