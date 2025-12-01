import $ from 'jquery';
import {
  closeAddNoteModal,
  updateNoteDate,
  updateNoteType,
  updateRelevantNoteInjuries,
  updateRelevantNoteIllnesses,
  updateNote,
  updateIsRestricted,
  updatePsychOnly,
  hideAppStatus,
  serverRequest,
  saveAthleteProfileNote,
  updateNoteMedicalType,
  updateNoteMedicalTypeName,
  updateNoteAttachments,
  updateNoteExpDate,
  updateNoteBatchNumber,
  updateNoteRenewalDate,
  serverRequestForLastNote,
  uploadAttachments,
  getLastNote,
  copyLastNoteError,
  updateAttachmentIds,
  getNoteIssues,
  serverRequestForNoteIssues,
  hideRequestStatus,
} from '../actions';

describe('Add Note Modal Actions', () => {
  it('has the correct action CLOSE_ADD_NOTE_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_NOTE_MODAL',
    };

    expect(closeAddNoteModal()).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE_DATE',
      payload: {
        date: '03/04/2019',
      },
    };

    expect(updateNoteDate('03/04/2019')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE_TYPE', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE_TYPE',
      payload: {
        type: 'illness',
      },
    };

    expect(updateNoteType('illness')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_RELEVANT_NOTE_INJURIES', () => {
    const expectedAction = {
      type: 'UPDATE_RELEVANT_NOTE_INJURIES',
      payload: {
        issueId: 1234,
      },
    };

    expect(updateRelevantNoteInjuries(1234)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_RELEVANT_NOTE_ILLNESSES', () => {
    const expectedAction = {
      type: 'UPDATE_RELEVANT_NOTE_ILLNESSES',
      payload: {
        issueId: 1234,
      },
    };

    expect(updateRelevantNoteIllnesses(1234)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE',
      payload: {
        note: 'This is a note.',
      },
    };

    expect(updateNote('This is a note.')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE_MEDICAL_TYPE', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE_MEDICAL_TYPE',
      payload: {
        medicalType: 'tue',
      },
    };

    expect(updateNoteMedicalType('tue')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE_MEDICAL_TYPE_NAME', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE_MEDICAL_TYPE_NAME',
      payload: {
        name: 'Medication Name',
      },
    };

    expect(updateNoteMedicalTypeName('Medication Name')).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_NOTE_ATTACHMENTS', () => {
    const date = new Date('Nov 20 2018');
    const dummyFileAttachment = {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 124625,
      type: 'text/csv',
      webkitRelativePath: '',
    };
    const expectedAction = {
      type: 'UPDATE_NOTE_ATTACHMENTS',
      payload: {
        file: dummyFileAttachment,
        index: 0,
      },
    };

    expect(updateNoteAttachments(dummyFileAttachment, 0)).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_NOTE_EXP_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE_EXP_DATE',
      payload: {
        date: '03/04/2019',
      },
    };

    expect(updateNoteExpDate('03/04/2019')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE_BATCH_NUMBER', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE_BATCH_NUMBER',
      payload: {
        batchNumber: 'Batch No 1234',
      },
    };

    expect(updateNoteBatchNumber('Batch No 1234')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE_RENEWAL_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE_RENEWAL_DATE',
      payload: {
        date: '03/04/2019',
      },
    };

    expect(updateNoteRenewalDate('03/04/2019')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_IS_RESTRICTED', () => {
    const expectedAction = {
      type: 'UPDATE_IS_RESTRICTED',
      payload: {
        checked: true,
      },
    };

    expect(updateIsRestricted(true)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_PSYCH_ONLY', () => {
    const expectedAction = {
      type: 'UPDATE_PSYCH_ONLY',
      payload: {
        checked: true,
      },
    };

    expect(updatePsychOnly(true)).toEqual(expectedAction);
  });

  it('has the correct action HIDE_APP_STATUS', () => {
    const expectedAction = {
      type: 'HIDE_APP_STATUS',
    };

    expect(hideAppStatus()).toEqual(expectedAction);
  });

  it('has the correct action SERVER_REQUEST', () => {
    const expectedAction = {
      type: 'SERVER_REQUEST',
    };

    expect(serverRequest()).toEqual(expectedAction);
  });

  it('has the correct action COPY_LAST_NOTE_ERROR', () => {
    const expectedAction = {
      type: 'COPY_LAST_NOTE_ERROR',
      payload: {
        errorMsg: 'There are no notes to copy',
      },
    };

    expect(copyLastNoteError('There are no notes to copy')).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_ATTACHMENT_IDS', () => {
    const expectedAction = {
      type: 'UPDATE_ATTACHMENT_IDS',
      payload: {
        attachmentId: 123456,
      },
    };

    expect(updateAttachmentIds(123456)).toEqual(expectedAction);
  });

  it('has the correct action HIDE_REQUEST_STATUS', () => {
    const expectedAction = {
      type: 'HIDE_REQUEST_STATUS',
    };

    expect(hideRequestStatus()).toEqual(expectedAction);
  });

  describe('saveAthleteProfileNote action', () => {
    let ajaxSpy;
    const mockDispatch = jest.fn();
    const dummyNoteData = {
      attachment_ids: [],
      note_date: '2018-09-11T10:35:54.000+01:00',
      note_type: 'injury',
      medical_type: null,
      medical_name: null,
      injury_ids: [23925],
      illness_ids: [],
      note: 'This is a note.',
      expiration_date: null,
      batch_number: null,
      renewal_date: null,
      restricted: false,
      psych_only: false,
    };

    const athlete = { id: 1644 };

    beforeEach(() => {
      mockDispatch.mockClear();
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    describe('when the server request is successful', () => {
      it('calls the action SAVE_ATHLETE_PROFILE_NOTE_SUCCESS', () => {
        const state = {
          athlete,
          noteData: dummyNoteData,
        };

        const getState = () => state;

        const mockJqXHR = {
          done: jest.fn().mockImplementation(function (callback) {
            callback({ note: state.noteData });
            return this;
          }),
          fail: jest.fn().mockReturnThis(),
        };
        ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);

        const thunk = saveAthleteProfileNote();
        thunk(mockDispatch, getState);

        expect(mockDispatch.mock.calls[0][0]).toEqual(serverRequest());
        expect(mockDispatch.mock.calls[1][0]).toEqual({
          type: 'SAVE_ATHLETE_PROFILE_NOTE_SUCCESS',
          payload: {
            isRestricted:
              state.noteData.restricted || state.noteData.restricted_to_psych,
          },
        });
      });
    });

    describe('when the server request is unsuccessful', () => {
      it('calls the action SERVER_REQUEST_ERROR', () => {
        const state = {
          athlete,
          noteData: dummyNoteData,
        };

        const getState = () => state;

        const mockJqXHR = {
          done: jest.fn().mockReturnThis(),
          fail: jest.fn().mockImplementation(function (callback) {
            callback();
            return this;
          }),
        };
        ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);

        const thunk = saveAthleteProfileNote();
        thunk(mockDispatch, getState);

        expect(mockDispatch.mock.calls[1][0]).toEqual({
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });

  describe('uploadAttachments action', () => {
    let ajaxSpy;
    const mockDispatch = jest.fn();
    const date = new Date('Nov 20 2018');
    const dummyAttachment = {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 124625,
      type: 'text/csv',
      webkitRelativePath: '',
    };

    beforeEach(() => {
      mockDispatch.mockClear();
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    describe('when the server request is successful', () => {
      it('calls the action UPDATE_ATTACHMENT_IDS', () => {
        const state = {
          noteModal: {
            isModalOpen: true,
            attachments: [dummyAttachment],
            noteData: {
              attachment_ids: [],
            },
          },
        };

        const getState = () => state;

        const mockJqXHR = {
          done: jest.fn().mockImplementation(function (callback) {
            callback({ success: true, attachment_id: 12345 });
            return this;
          }),
          fail: jest.fn().mockReturnThis(),
        };
        ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);

        const thunk = uploadAttachments();
        thunk(mockDispatch, getState);

        expect(mockDispatch.mock.calls[0][0]).toEqual(serverRequest());
        expect(mockDispatch.mock.calls[1][0]).toEqual({
          type: 'UPDATE_ATTACHMENT_IDS',
          payload: {
            attachmentId: 12345,
          },
        });
      });
    });

    describe('when the server request is unsuccessful', () => {
      it('calls the action SERVER_REQUEST_ERROR', () => {
        const state = {
          noteModal: {
            isModalOpen: true,
            attachments: [dummyAttachment],
            noteData: {
              attachment_ids: [],
            },
          },
        };

        const getState = () => state;

        const mockJqXHR = {
          done: jest.fn().mockReturnThis(),
          fail: jest.fn().mockImplementation(function (callback) {
            callback();
            return this;
          }),
        };
        ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);

        const thunk = uploadAttachments();
        thunk(mockDispatch, getState);

        expect(mockDispatch.mock.calls[1][0]).toEqual({
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });

  describe('getLastNote action', () => {
    let ajaxSpy;
    const mockDispatch = jest.fn();
    const athlete = { id: 1644 };

    beforeEach(() => {
      mockDispatch.mockClear();
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    describe('when the server request is successful', () => {
      describe('when there is a previous note to copy', () => {
        it('calls the action UPDATE_NOTE', () => {
          const state = {
            noteModal: {
              athlete,
            },
          };

          const getState = () => state;

          const mockJqXHR = {
            done: jest.fn().mockImplementation(function (callback) {
              callback({
                note: 'This is a note',
                note_date: '25/04/2019',
              });
              return this;
            }),
            fail: jest.fn().mockReturnThis(),
          };
          ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);

          const thunk = getLastNote();
          thunk(mockDispatch, getState);

          expect(mockDispatch.mock.calls[0][0]).toEqual(
            serverRequestForLastNote()
          );
          expect(mockDispatch.mock.calls[1][0]).toEqual({
            type: 'HIDE_APP_STATUS',
          });
          expect(mockDispatch.mock.calls[2][0]).toEqual({
            type: 'UPDATE_NOTE',
            payload: {
              note: '[Copied from note: 25/04/2019] This is a note',
            },
          });
        });
      });

      describe('when there are no previous notes', () => {
        it('calls the action COPY_LAST_NOTE_ERROR', () => {
          const state = {
            noteModal: {
              athlete,
            },
          };

          const getState = () => state;

          const mockJqXHR = {
            done: jest.fn().mockImplementation(function (callback) {
              callback({
                error: 'No notes to copy',
              });
              return this;
            }),
            fail: jest.fn().mockReturnThis(),
          };
          ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);

          const thunk = getLastNote();
          thunk(mockDispatch, getState);

          expect(mockDispatch.mock.calls[0][0]).toEqual(
            serverRequestForLastNote()
          );
          expect(mockDispatch.mock.calls[1][0]).toEqual({
            type: 'HIDE_APP_STATUS',
          });
          expect(mockDispatch.mock.calls[2][0]).toEqual({
            type: 'COPY_LAST_NOTE_ERROR',
            payload: {
              errorMsg: 'No notes to copy',
            },
          });
        });
      });
    });

    describe('when the server request is unsuccessful', () => {
      it('calls the action SERVER_REQUEST_ERROR', () => {
        const state = {
          noteModal: {
            athlete,
          },
        };

        const getState = () => state;

        const mockJqXHR = {
          done: jest.fn().mockReturnThis(),
          fail: jest.fn().mockImplementation(function (callback) {
            callback();
            return this;
          }),
        };
        ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);

        const thunk = getLastNote();
        thunk(mockDispatch, getState);

        expect(mockDispatch.mock.calls[1][0]).toEqual({
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });

  describe('getNoteIssues action', () => {
    let ajaxSpy;
    const mockDispatch = jest.fn();
    const athlete = {
      id: 1644,
      injuries: 'injuries',
      illnesses: 'illnesses',
    };

    beforeEach(() => {
      mockDispatch.mockClear();
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    describe('when the server request is successful', () => {
      it('calls the action UPDATE_NOTE_ISSUES', () => {
        const state = {
          noteModal: {},
        };

        const getState = () => state;

        const mockJqXHR = {
          done: jest.fn().mockImplementation(function (callback) {
            callback(athlete);
            return this;
          }),
          fail: jest.fn().mockReturnThis(),
        };
        ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);

        const thunk = getNoteIssues();
        thunk(mockDispatch, getState);

        expect(mockDispatch.mock.calls[0][0]).toEqual(
          serverRequestForNoteIssues()
        );
        expect(mockDispatch.mock.calls[2][0]).toEqual({
          type: 'UPDATE_NOTE_ISSUES',
          payload: {
            injuries: athlete.injuries,
            illnesses: athlete.illnesses,
          },
        });
      });
    });

    describe('when the server request is unsuccessful', () => {
      it('calls the action SERVER_REQUEST_ERROR', () => {
        const state = {
          noteModal: {},
        };

        const getState = () => state;

        const mockJqXHR = {
          done: jest.fn().mockReturnThis(),
          fail: jest.fn().mockImplementation(function (callback) {
            callback();
            return this;
          }),
        };
        ajaxSpy = jest.spyOn($, 'ajax').mockReturnValue(mockJqXHR);

        const thunk = getNoteIssues();
        thunk(mockDispatch, getState);

        expect(mockDispatch.mock.calls[1][0]).toEqual({
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });
});
