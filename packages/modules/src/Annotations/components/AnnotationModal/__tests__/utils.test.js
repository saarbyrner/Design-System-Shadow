import transformAnnotationResponse from '../utils';

describe('Athlete Profile utils', () => {
  describe('#transformAnnotationResponse()', () => {
    it('transforms the response annotation', () => {
      const response = {
        id: 1,
        organisation_annotation_type: {
          id: 6,
          name: 'General Note',
          type: 'OrganisationAnnotationTypes::General',
        },
        annotationable_type: 'Athlete',
        annotationable: {
          id: 27280,
          fullname: 'Gustavo Lazaro Amendola',
        },
        title: 'Notes title',
        content: 'Notes note',
        archived: false,
        annotation_date: '2019-06-25T23:00:00Z',
        annotation_actions: [],
        attachments: [
          {
            id: 12345566,
            url: '',
            filename: 'physio_2211_jon_doe.jpg',
            filetype: 'jpg',
            filesize: 1564,
            audio_file: false,
            confirmed: true,
            presigned_post: null,
          },
        ],
        created_by: {
          id: 26486,
          fullname: 'Gustavo Lazaro Amendola',
        },
        updated_by: {
          id: 26486,
          fullname: 'Gustavo Lazaro Amendola',
        },
        created_at: '2019-10-08T14:28:29.000+01:00',
        updated_at: '2019-10-10T14:28:29.000+01:00',
      };

      const expected = {
        ...response,
        annotation_type_id: 6,
        unUploadedFiles: [],
        attachments: [
          {
            id: 12345566,
            original_filename: 'physio_2211_jon_doe.jpg',
            created: '',
            filesize: 1564,
            confirmed: true,
          },
        ],
      };

      expect(transformAnnotationResponse(response)).toEqual(expected);
    });
  });
});
