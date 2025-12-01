import prepareNoteData from '../utils';

describe('Athlete profile notes utils', () => {
  describe('prepareNoteData', () => {
    const dummyNoteData = {
      attachment_ids: [],
      note_date: '2017-07-20T00:00:00.000+01:00',
      note_type: 1,
      medical_type: null,
      medical_name: null,
      injury_ids: [1234, 5678],
      illness_ids: [4321, 8765],
      note: 'This is a note',
      expiration_date: null,
      batch_number: null,
      renewal_date: null,
      restricted: false,
      psych_only: false,
    };

    describe('when there are no injuries associated with the note', () => {
      beforeEach(() => {
        dummyNoteData.injury_ids = [];
      });

      afterEach(() => {
        dummyNoteData.injury_ids = [1234, 5678];
      });

      it('returns the correct note data', () => {
        expect(prepareNoteData(dummyNoteData)).toEqual({
          attachment_ids: [],
          note_date: '2017-07-20T00:00:00.000+01:00',
          note_type: 1,
          medical_type: null,
          medical_name: null,
          illness_ids: [4321, 8765],
          note: 'This is a note',
          expiration_date: null,
          batch_number: null,
          renewal_date: null,
          restricted: false,
          restricted_to_psych: false,
        });
      });
    });

    describe('when there are no illnesses associated with the note', () => {
      beforeEach(() => {
        dummyNoteData.illness_ids = [];
      });

      afterEach(() => {
        dummyNoteData.illness_ids = [4321, 8765];
      });

      it('returns the correct note data', () => {
        expect(prepareNoteData(dummyNoteData)).toEqual({
          attachment_ids: [],
          note_date: '2017-07-20T00:00:00.000+01:00',
          note_type: 1,
          medical_type: null,
          medical_name: null,
          injury_ids: [1234, 5678],
          note: 'This is a note',
          expiration_date: null,
          batch_number: null,
          renewal_date: null,
          restricted: false,
          restricted_to_psych: false,
        });
      });
    });
  });
});
