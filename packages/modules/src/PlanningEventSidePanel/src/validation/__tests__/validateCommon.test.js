import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import validateCommon from '../validateCommon';

describe('PlanningEventSidePanel validateCommon', () => {
  const t = i18nextTranslateStub();
  const data = {
    duration: '10',
    local_timezone: 'Europe/Dublin',
    start_time: '2022-04-20T07:00:48Z',
  };

  const validDataResult = {
    duration: {
      isInvalid: false,
    },
    local_timezone: {
      isInvalid: false,
    },
    start_time: {
      isInvalid: false,
      messages: [],
    },
  };

  const durationInvalidResult = {
    ...validDataResult,
    duration: {
      isInvalid: true,
    },
  };

  it('validates correct data without issues', () => {
    const result = validateCommon(data);
    expect(result).toEqual(validDataResult);
  });

  it('validates when duration is null', () => {
    const result = validateCommon({ ...data, duration: null });
    expect(result).toEqual(validDataResult);
  });

  it('validates duration is positive number', () => {
    const result = validateCommon({ ...data, duration: '-10' });
    expect(result).toEqual(durationInvalidResult);
  });

  it('validates duration is not a decimal number', () => {
    const result = validateCommon({ ...data, duration: '10.5' });
    expect(result).toEqual(durationInvalidResult);
  });

  it('validates missing data', () => {
    const expectedResult = {
      ...validDataResult,
      local_timezone: {
        isInvalid: true,
      },
      start_time: {
        isInvalid: true,
        messages: [],
      },
    };

    const result = validateCommon({});
    expect(result).toEqual(expectedResult);
  });

  it('validates out of season date with a message', () => {
    const expectedResult = {
      ...validDataResult,
      start_time: {
        isInvalid: true,
        messages: [
          t(
            'This Game is outside your current squad Season Markers. Please contact the admin team to re-configure your season markers.'
          ),
        ],
      },
    };

    const result = validateCommon(
      { ...data, start_time: '2052-04-20T07:00:48Z' },
      false
    );
    expect(result).toEqual(expectedResult);
  });

  describe('event-attachments ff is on', () => {
    beforeEach(() => {
      window.featureFlags['event-attachments'] = true;
    });

    afterEach(() => {
      window.featureFlags['event-attachments'] = false;
    });

    const attachmentsData = { ...data, unUploadedLinks: [] };

    const invalidUnUploadedFilesResult = {
      ...validDataResult,
      unUploadedFiles: {
        isInvalid: true,
      },
      unUploadedLinks: {
        isInvalid: false,
      },
    };
    const invalidUnUploadedLinksResult = {
      ...validDataResult,
      unUploadedFiles: {
        isInvalid: false,
      },
      unUploadedLinks: {
        isInvalid: true,
      },
    };

    it('validates unuploaded files cannot have empty string as the title', () => {
      const result = validateCommon({
        ...attachmentsData,
        unUploadedFiles: [
          {
            fileTitle: 'test title',
            event_attachment_category_ids: [1, 2, 3],
          },
          { fileTitle: '', event_attachment_category_ids: [1, 2, 3] },
        ],
      });
      expect(result).toEqual(invalidUnUploadedFilesResult);
    });

    it('validates unuploaded files cannot have empty category list', () => {
      const result = validateCommon({
        ...attachmentsData,
        unUploadedFiles: [
          {
            fileTitle: 'test title',
            event_attachment_category_ids: [],
          },
          { fileTitle: 'title 2', event_attachment_category_ids: [] },
        ],
      });
      expect(result).toEqual(invalidUnUploadedFilesResult);
    });

    it('validates unuploaded files non-empty category list and file titles filled in', () => {
      const expectedResult = {
        ...invalidUnUploadedFilesResult,
        unUploadedFiles: {
          isInvalid: false,
        },
      };

      const result = validateCommon({
        ...attachmentsData,
        unUploadedFiles: [
          {
            fileTitle: 'test title',
            event_attachment_category_ids: [2],
          },
          { fileTitle: 'title 2', event_attachment_category_ids: [33, 9] },
        ],
      });
      expect(result).toEqual(expectedResult);
    });

    it('validates unuploaded links block incorrect uri', () => {
      const result = validateCommon({
        ...attachmentsData,
        unUploadedFiles: [],
        unUploadedLinks: [
          {
            title: 'hi',
            uri: 'invalid uri',
            event_attachment_category_ids: [2],
          },
        ],
      });
      expect(result).toEqual(invalidUnUploadedLinksResult);
    });

    it('validates unuploaded links cannot have empty titles', () => {
      const result = validateCommon({
        ...attachmentsData,
        unUploadedFiles: [],
        unUploadedLinks: [
          {
            title: '',
            uri: 'www.google.com',
            event_attachment_category_ids: [3, 4, 5],
          },
        ],
      });
      expect(result).toEqual(invalidUnUploadedLinksResult);
    });

    it('validates unuploaded links cannot have empty category ids', () => {
      const result = validateCommon({
        ...attachmentsData,
        unUploadedFiles: [],
        unUploadedLinks: [
          {
            title: 'hi',
            uri: 'www.google.com',
            event_attachment_category_ids: [],
          },
        ],
      });
      expect(result).toEqual(invalidUnUploadedLinksResult);
    });
  });
});
