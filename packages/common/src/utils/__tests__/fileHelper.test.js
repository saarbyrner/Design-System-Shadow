import {
  checkInvalidFileTitles,
  convertBlobToFile,
  convertFileToUrl,
  convertUrlToFile,
  convertUrlToAttachedFile,
  transformEventFilesForUpload,
  transformFilesForUpload,
} from '../fileHelper';

describe('fileHelper', () => {
  describe('transformFilesForUpload', () => {
    it('converts the files information into the appropriate attachment_attribute data', () => {
      const files = [
        {
          filename: 'boat.jpg',
          fileTitle: 'Boat Image',
          fileSize: 50,
          fileType: 'jpeg',
        },
      ];
      expect(transformFilesForUpload(files)).toEqual([
        {
          filesize: 50,
          filetype: 'jpeg',
          name: 'Boat Image',
          original_filename: 'boat.jpg',
        },
      ]);
    });

    it('converts medical files information into the appropriate attachment_attribute data', () => {
      const files = [
        {
          filename: 'boat.jpg',
          fileTitle: 'Boat Image',
          fileSize: 50,
          fileType: 'jpeg',
          medical_attachment_category_ids: [1, 2, 3],
        },
      ];
      expect(transformFilesForUpload(files)).toEqual([
        {
          filesize: 50,
          filetype: 'jpeg',
          name: 'Boat Image',
          original_filename: 'boat.jpg',
          medical_attachment_category_ids: [1, 2, 3],
        },
      ]);
    });
  });

  describe('convertBlobToFile', () => {
    const fileBlob = {
      source: { size: 50 },
      filenameWithoutExtension: 'blob',
      id: 1,
      filename: 'boat',
      file: new Blob(['boat.jpg'], {
        type: 'jpeg',
      }),
    };

    const fileObject = {
      file: new File(['boat.jpg'], {
        type: 'jpeg',
      }),
      fileTitle: 'test title',
      id: 1,
    };

    beforeEach(() => {
      window.featureFlags = { 'files-titles': false };
    });

    afterEach(() => {
      window.featureFlags = {};
    });
    it('[feature-flag files-titles off] and [feature-flag event-attachments off] converts a passed in blob to a file object with its respective data in tact', () => {
      expect(convertBlobToFile([fileBlob], [])).toEqual([
        {
          file: new File([''], {}),
          fileSize: 50,
          fileType: 'jpeg',
          filename: 'undefined',
          filenameWithoutExtension: 'blob',
          id: 1,
        },
      ]);
    });

    it('[feature-flag files-titles on] converts a passed in blob to a file object with its respective data in tact', () => {
      window.featureFlags = { 'files-titles': true };
      expect(convertBlobToFile([fileBlob], [])).toEqual([
        {
          file: new File([''], {}),
          fileSize: 50,
          fileTitle: 'blob',
          fileType: 'jpeg',
          filename: 'undefined',
          filenameWithoutExtension: 'blob',
          id: 1,
        },
      ]);
    });

    it('[feature-flag event-attachments on] converts a passed in blob to a file object with its respective data in tact', () => {
      window.featureFlags = { 'event-attachments': true };
      expect(convertBlobToFile([fileBlob], [])).toEqual([
        {
          file: new File([''], {}),
          fileSize: 50,
          fileTitle: 'blob',
          fileType: 'jpeg',
          filename: 'undefined',
          filenameWithoutExtension: 'blob',
          id: 1,
        },
      ]);
    });

    it('[feature-flag files-titles on] converts a passed in blob to a file object with its respective title intact', () => {
      window.featureFlags = { 'files-titles': true };
      expect(convertBlobToFile([fileBlob], [fileObject])).toEqual([
        {
          file: new File([''], {}),
          fileSize: 50,
          fileTitle: 'test title',
          fileType: 'jpeg',
          filename: 'undefined',
          filenameWithoutExtension: 'blob',
          id: 1,
        },
      ]);
    });

    it('[feature-flag event-attachments on] converts a passed in blob to a file object with its respective title intact', () => {
      window.featureFlags = { 'event-attachments': true };
      expect(convertBlobToFile([fileBlob], [fileObject])).toEqual([
        {
          file: new File([''], {}),
          fileSize: 50,
          fileTitle: 'test title',
          fileType: 'jpeg',
          filename: 'undefined',
          filenameWithoutExtension: 'blob',
          id: 1,
        },
      ]);
    });
  });

  describe('checkInvalidFileTitles', () => {
    beforeEach(() => {
      window.featureFlags = { 'files-titles': true };
    });
    afterEach(() => {
      window.featureFlags = {};
    });
    it('returns false when all files have valid titles', () => {
      const files = [{ fileTitle: 'test' }, { fileTitle: 'testTwo' }];
      expect(checkInvalidFileTitles(files)).toBeFalsy();
    });

    it('returns true when one files has an invalid title', () => {
      const files = [{ fileTitle: '' }, { fileTitle: 'testTwo' }];
      expect(checkInvalidFileTitles(files)).toBeTruthy();
    });
  });

  describe('convertFileToUrl', () => {
    it('calls the file to url conversion function', () => {
      URL.createObjectURL = jest.fn();
      const fileBlob = {
        source: { size: 50 },
        filenameWithoutExtension: 'blob',
        id: 1,
        filename: 'boat',
        file: new Blob(['boat.jpg'], {
          type: 'jpeg',
        }),
      };

      convertFileToUrl([fileBlob]);
      expect(URL.createObjectURL).toHaveBeenCalledWith(fileBlob.file);
    });
  });

  describe('convertUrlToFile', () => {
    it('converts a file object url and returns the respective file object', async () => {
      const fileBlob = new Blob(['boat.jpg'], {
        type: 'jpeg',
      });

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          blob: () =>
            Promise.resolve({
              blob: fileBlob,
            }),
        })
      );
      expect(
        await convertUrlToFile('testUrl.com', 'testFilename.jpeg', 'image/png')
      ).toEqual(
        new File([fileBlob], 'testFilename.jpeg', {
          type: 'image/png',
        })
      );
    });

    it('throws error correctly when response.ok property is false', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: '',
        })
      );

      await expect(async () => {
        await convertUrlToFile('badUrl', 'testFilename.jpeg', 'image/png');
      }).rejects.toThrow();
    });

    it('throws error correctly when other errors occur', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Error')));

      await expect(async () => {
        await convertUrlToFile('badUrl', 'testFilename.jpeg', 'image/png');
      }).rejects.toThrow();
    });
  });

  describe('transformEventFilesForUpload', () => {
    it('converts unuploaded files to correct format for BE to save', () => {
      const unUploadedFiles = [
        {
          filename: 'original file name',
          fileType: 'image',
          fileSize: 4764527,
          fileTitle: 'test title',
          event_attachment_category_ids: [3, 5, 10],
        },
      ];

      const transformedFiles = transformEventFilesForUpload(unUploadedFiles);
      expect(transformedFiles).toEqual([
        {
          event_attachment_category_ids:
            unUploadedFiles[0].event_attachment_category_ids,
          attachment: {
            original_filename: unUploadedFiles[0].filename,
            filetype: unUploadedFiles[0].fileType,
            filesize: unUploadedFiles[0].fileSize,
            name: unUploadedFiles[0].fileTitle,
          },
        },
      ]);
    });
  });

  describe('convertUrlToAttachedFile', () => {
    it('converts url to AttachedFile', async () => {
      const fileBlob = new File(['image_file.jpg'], {
        type: 'jpeg',
      });

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          blob: () =>
            Promise.resolve({
              blob: fileBlob,
            }),
        })
      );

      const attachedFile = await convertUrlToAttachedFile(
        'badUrl',
        'testFilename.jpeg',
        'image/png',
        1234
      );
      expect(attachedFile).toEqual({
        file: new File(['image_file.jpg'], {
          type: 'jpeg',
        }),
        fileSize: 15,
        fileType: 'image/png',
        filename: 'testFilename.jpeg',
        filenameWithoutExtension: 'testFilename.jpeg',
        id: 1234,
      });
    });
  });
});
