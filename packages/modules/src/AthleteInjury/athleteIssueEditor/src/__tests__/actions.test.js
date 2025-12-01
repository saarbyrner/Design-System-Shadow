import $ from 'jquery';
import {
  addNewEvent,
  removeEvent,
  updateIssueStatus,
  updateHasRecurrence,
  updateIsRestricted,
  updatePsychOnly,
  updateRecurrence,
  updateEventDate,
  updateExaminationDate,
  updateIssueInfo,
  updateNote,
  updateOsicsPathology,
  updateOsicsClassification,
  updateBodyArea,
  updateSide,
  updateType,
  updateOsicsCode,
  updateIcdCode,
  populateIssueDetails,
  updateOccurrenceDate,
  updateActivity,
  updateTrainingSession,
  updateSessionCompleted,
  updateGame,
  updateGameTime,
  updatePeriod,
  updatePositionGroup,
  updateGameOptions,
  updateFormType,
  updateTrainingOptions,
  getGameAndTrainingOptions,
  serverRequest,
  serverRequestError,
  serverRequestSuccess,
  hideAppStatus,
  isFetchingIssueDetails,
  isFetchingGameAndTrainingOptions,
  editIssue,
  createIssue,
  updateHasSupplementaryPathology,
  updateSupplementaryPathology,
  updateBamicGradeId,
  updateBamicSiteId,
} from '../actions';

const mockWindowLocationReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockWindowLocationReload,
  },
  writable: true,
});

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  formatGameOptionsFromObject: jest.fn((games) =>
    games.map((game) => ({ id: game.id, title: game.title }))
  ),
  formatTrainingSessionOptionsFromObject: jest.fn((sessions) =>
    sessions.map((session) => ({ id: session.id, title: session.title }))
  ),
}));

describe('Athlete Injury Editor Actions', () => {
  it('has the correct action ADD_NEW_EVENT', () => {
    const expectedAction = {
      type: 'ADD_NEW_EVENT',
    };

    expect(addNewEvent()).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_EVENT', () => {
    const expectedAction = {
      type: 'REMOVE_EVENT',
      payload: {
        statusId: 0,
      },
    };

    expect(removeEvent(0)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_BAMIC_GRADE_ID', () => {
    const expectedAction = {
      type: 'UPDATE_BAMIC_GRADE_ID',
      payload: {
        gradeId: 0,
      },
    };

    expect(updateBamicGradeId(0)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_BAMIC_SITE_ID', () => {
    const expectedAction = {
      type: 'UPDATE_BAMIC_SITE_ID',
      payload: {
        siteId: 'a',
      },
    };

    expect(updateBamicSiteId('a')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_HAS_RECURRENCE', () => {
    const expectedAction = {
      type: 'UPDATE_HAS_RECURRENCE',
      payload: {
        hasRecurrence: true,
      },
    };

    expect(updateHasRecurrence(true)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_IS_RESTRICTED', () => {
    const expectedAction = {
      type: 'UPDATE_IS_RESTRICTED',
      payload: {
        isRestricted: true,
      },
    };

    expect(updateIsRestricted(true)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_PSYCH_ONLY', () => {
    const expectedAction = {
      type: 'UPDATE_PSYCH_ONLY',
      payload: {
        psychOnly: true,
      },
    };

    expect(updatePsychOnly(true)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_ISSUE_STATUS', () => {
    const expectedAction = {
      type: 'UPDATE_ISSUE_STATUS',
      payload: {
        optionId: 0,
        statusId: 3,
      },
    };

    expect(updateIssueStatus(0, 3)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_EVENT_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_EVENT_DATE',
      payload: {
        editedDate: '12/02/21018',
        statusId: 3,
      },
    };

    expect(updateEventDate('12/02/21018', 3)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_EXAMINATION_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_EXAMINATION_DATE',
      payload: {
        examinationDate: '12/02/21018',
      },
    };

    expect(updateExaminationDate('12/02/21018')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_ISSUE_INFO', () => {
    const expectedAction = {
      type: 'UPDATE_ISSUE_INFO',
      payload: {
        issueInfo: 'new info',
      },
    };

    expect(updateIssueInfo('new info')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE',
      payload: {
        note: 'new note',
      },
    };

    expect(updateNote('new note')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_OSICS_PATHOLOGY', () => {
    const expectedAction = {
      type: 'UPDATE_OSICS_PATHOLOGY',
      payload: {
        osicsPathology: '3',
      },
    };

    expect(updateOsicsPathology('3')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_OSICS_CLASSIFICATION', () => {
    const expectedAction = {
      type: 'UPDATE_OSICS_CLASSIFICATION',
      payload: {
        osicsClassification: '3',
      },
    };

    expect(updateOsicsClassification('3')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_BODY_AREA', () => {
    const expectedAction = {
      type: 'UPDATE_BODY_AREA',
      payload: {
        bodyArea: 'back',
      },
    };

    expect(updateBodyArea('back')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_SIDE', () => {
    const expectedAction = {
      type: 'UPDATE_SIDE',
      payload: {
        side: 'left',
      },
    };

    expect(updateSide('left')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TYPE', () => {
    const expectedAction = {
      type: 'UPDATE_TYPE',
      payload: {
        typeId: 3,
      },
    };

    expect(updateType(3)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_OSICS_CODE', () => {
    const expectedAction = {
      type: 'UPDATE_OSICS_CODE',
      payload: {
        osicsCode: '3',
      },
    };

    expect(updateOsicsCode('3')).toEqual(expectedAction);
  });

  describe('when requesting a injury details', () => {
    let ajaxSpy;

    beforeEach(() => {
      ajaxSpy = jest.spyOn($, 'ajax');
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    it('makes a request to the right endpoint and populate the injury details', () => {
      const getState = jest.fn(() => ({
        ModalData: {
          athleteId: 32,
        },
      }));
      const dispatch = jest.fn();

      const thunk = populateIssueDetails('2');
      thunk(dispatch, getState);

      expect(ajaxSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/athletes/32/issues/osics_info/?id=2',
          method: 'GET',
        })
      );
    });
  });

  it('has the correct action UPDATE_ICD_CODE', () => {
    const expectedAction = {
      type: 'UPDATE_ICD_CODE',
      payload: {
        icdCode: '3',
      },
    };

    expect(updateIcdCode('3')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_OCCURRENCE_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_OCCURRENCE_DATE',
      payload: {
        occurrenceDate: '2018-02-10',
      },
    };

    expect(updateOccurrenceDate('2018-02-10')).toEqual(expectedAction);
  });

  describe('UPDATE_ACTIVITY action when the new activity is a game', () => {
    it('updates the activity and sets the position to the default athlete position', () => {
      const state = {
        ModalData: {
          athletePositionId: 70,
        },
      };

      const getState = jest.fn(() => state);
      const dispatch = jest.fn();

      const thunk = updateActivity('3', 'game');
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_POSITION_GROUP',
        payload: {
          positionGroupId: state.ModalData.athletePositionId,
        },
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_ACTIVITY',
        payload: {
          activityId: '3',
          activityType: 'game',
        },
      });
    });
  });

  describe('UPDATE_ACTIVITY action when the new activity is a training session', () => {
    it('updates the activity and sets the position to the default athlete position', () => {
      const state = {
        ModalData: {
          athletePositionId: 70,
        },
      };

      const getState = jest.fn(() => state);
      const dispatch = jest.fn();

      const thunk = updateActivity('3', 'training');
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_POSITION_GROUP',
        payload: {
          positionGroupId: 70,
        },
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_ACTIVITY',
        payload: {
          activityId: '3',
          activityType: 'training',
        },
      });
    });
  });

  it('has the correct action UPDATE_TRAINING_SESSION', () => {
    const expectedAction = {
      type: 'UPDATE_TRAINING_SESSION',
      payload: {
        trainingSessionId: '3',
      },
    };

    expect(updateTrainingSession('3')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_GAME', () => {
    const expectedAction = {
      type: 'UPDATE_GAME',
      payload: {
        gameId: '3',
        gameDate: '10/04/2018',
      },
    };

    expect(updateGame('3', '10/04/2018')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_PERIOD', () => {
    const expectedAction = {
      type: 'UPDATE_PERIOD',
      payload: {
        periodId: 456,
      },
    };

    expect(updatePeriod(456)).toEqual(expectedAction);
  });

  describe('UPDATE_RECURRENCE action when the formType is INJURY', () => {
    it('updates the recurrence with the correct prior injury', () => {
      const state = {
        ModalData: {
          formType: 'INJURY',
          priorIssues: {
            prior_injuries: [
              {
                id: 123,
                name: 'A Injury - Right',
                occurrence_date: '2018-07-05T00:00:00+01:00',
                osics: {
                  osics_body_area_id: 1,
                  osics_classification_id: 13,
                  osics_id: 'AAXX',
                  osics_pathology_id: 56,
                },
                side_id: 3,
                type_id: null,
              },
            ],
          },
        },
      };

      const getState = jest.fn(() => state);
      const dispatch = jest.fn();

      const thunk = updateRecurrence(123);
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_RECURRENCE',
        payload: {
          priorIssue: state.ModalData.priorIssues.prior_injuries[0],
        },
      });

      // reset the occurrence date
      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_OCCURRENCE_DATE',
        payload: {
          occurrenceDate: null,
        },
      });
    });
  });

  describe('UPDATE_RECURRENCE action when the formType is ILLNESS', () => {
    it('updates the recurrence with the correct prior illness', () => {
      const state = {
        ModalData: {
          formType: 'ILLNESS',
          priorIssues: {
            prior_illnesses: [
              {
                id: 123,
                name: 'A Illness - Left',
                occurrence_date: '2018-07-06T00:00:00+01:00',
                osics: {
                  osics_body_area_id: 18,
                  osics_classification_id: 5,
                  osics_id: 'IMLT',
                  osics_pathology_id: 1221,
                },
                side_id: 3,
                type_id: 41,
              },
            ],
          },
        },
      };

      const getState = jest.fn(() => state);
      const dispatch = jest.fn();

      const thunk = updateRecurrence(123);
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_RECURRENCE',
        payload: {
          priorIssue: state.ModalData.priorIssues.prior_illnesses[0],
        },
      });

      // reset the occurrence date
      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_OCCURRENCE_DATE',
        payload: {
          occurrenceDate: null,
        },
      });
    });
  });

  it('has the correct action UPDATE_GAME_TIME', () => {
    const expectedAction = {
      type: 'UPDATE_GAME_TIME',
      payload: {
        gameTime: '32',
      },
    };

    expect(updateGameTime('32')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_SESSION_COMPLETED', () => {
    const expectedAction = {
      type: 'UPDATE_SESSION_COMPLETED',
      payload: {
        isSessionCompleted: true,
      },
    };

    expect(updateSessionCompleted(true)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_POSITION_GROUP', () => {
    const expectedAction = {
      type: 'UPDATE_POSITION_GROUP',
      payload: {
        positionGroupId: 'forward',
      },
    };

    expect(updatePositionGroup('forward')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_GAME_OPTIONS', () => {
    const gameOptions = [
      {
        title: 'Dublin vs Cork',
        id: '2',
      },
    ];

    const expectedAction = {
      type: 'UPDATE_GAME_OPTIONS',
      payload: {
        gameOptions,
      },
    };

    expect(updateGameOptions(gameOptions)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_FORM_TYPE', () => {
    const formType = 'illness';

    const expectedAction = {
      type: 'UPDATE_FORM_TYPE',
      payload: {
        formType,
      },
    };

    expect(updateFormType(formType)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TRAINING_OPTIONS', () => {
    const trainingOptions = [
      {
        title: 'conditionning 2018-02-10',
        id: '2',
      },
    ];

    const expectedAction = {
      type: 'UPDATE_TRAINING_OPTIONS',
      payload: {
        trainingOptions,
      },
    };

    expect(updateTrainingOptions(trainingOptions)).toEqual(expectedAction);
  });

  it('has the correct action SERVER_REQUEST', () => {
    const expectedAction = {
      type: 'SERVER_REQUEST',
    };

    expect(serverRequest()).toEqual(expectedAction);
  });

  it('has the correct action SERVER_REQUEST_ERROR', () => {
    const expectedAction = {
      type: 'SERVER_REQUEST_ERROR',
    };

    expect(serverRequestError()).toEqual(expectedAction);
  });

  it('has the correct action SERVER_REQUEST_SUCCESS', () => {
    const expectedAction = {
      type: 'SERVER_REQUEST_SUCCESS',
    };

    expect(serverRequestSuccess()).toEqual(expectedAction);
    expect(mockWindowLocationReload).toHaveBeenCalledTimes(1);
  });

  it('has the correct action HIDE_APP_STATUS', () => {
    const expectedAction = {
      type: 'HIDE_APP_STATUS',
    };

    expect(hideAppStatus()).toEqual(expectedAction);
  });

  it('has the correct action IS_FETCHING_ISSUE_DETAILS', () => {
    const expectedAction = {
      type: 'IS_FETCHING_ISSUE_DETAILS',
      payload: {
        requestInProgress: true,
      },
    };

    expect(isFetchingIssueDetails(true)).toEqual(expectedAction);
  });

  it('has the correct action IS_FETCHING_GAME_AND_TRAINING_OPTION', () => {
    const expectedAction = {
      type: 'IS_FETCHING_GAME_AND_TRAINING_OPTION',
      payload: {
        requestInProgress: true,
      },
    };

    expect(isFetchingGameAndTrainingOptions(true)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_HAS_SUPPLEMENTARY_PATHOLOGY', () => {
    const expectedAction = {
      type: 'UPDATE_HAS_SUPPLEMENTARY_PATHOLOGY',
      payload: {
        hasSupplementaryPathology: true,
      },
    };

    expect(updateHasSupplementaryPathology(true)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_SUPPLEMENTARY_PATHOLOGY', () => {
    const expectedAction = {
      type: 'UPDATE_SUPPLEMENTARY_PATHOLOGY',
      payload: {
        supplementaryPathology: 'Something',
      },
    };

    expect(updateSupplementaryPathology('Something')).toEqual(expectedAction);
  });
});

describe('when requesting game and training options', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest.spyOn($, 'ajax');
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('makes a request to the right endpoint', () => {
    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
      },
    }));
    const dispatch = jest.fn();

    const thunk = getGameAndTrainingOptions('2018-02-10');
    thunk(dispatch, getState);

    expect(ajaxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/athletes/32/injuries/game_and_training_options',
        method: 'GET',
        data: { date: '2018-02-10' },
      })
    );
  });

  it('dispatches correct actions on success', async () => {
    const mockData = {
      games: [{ id: '1', title: 'Game 1' }],
      training_sessions: [{ id: '2', title: 'Training 1' }],
    };
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.success(mockData);
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
      },
    }));
    const dispatch = jest.fn();

    const thunk = getGameAndTrainingOptions('2018-02-10');
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      isFetchingGameAndTrainingOptions(true)
    );
    expect(dispatch).toHaveBeenCalledWith(
      isFetchingGameAndTrainingOptions(false)
    );
    expect(dispatch).toHaveBeenCalledWith(
      updateGameOptions([{ id: '1', title: 'Game 1' }])
    );
    expect(dispatch).toHaveBeenCalledWith(
      updateTrainingOptions([{ id: '2', title: 'Training 1' }])
    );
  });

  it('dispatches correct actions on error', async () => {
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.error();
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
      },
    }));
    const dispatch = jest.fn();

    const thunk = getGameAndTrainingOptions('2018-02-10');
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      isFetchingGameAndTrainingOptions(true)
    );
    expect(dispatch).toHaveBeenCalledWith(
      isFetchingGameAndTrainingOptions(false)
    );
    expect(dispatch).toHaveBeenCalledWith(serverRequestError());
  });
});

describe('when editing an injury', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest.spyOn($, 'ajax');
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('makes a request to the right endpoint', () => {
    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'INJURY',
      },
      IssueData: {
        id: 41,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'injury note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = editIssue();
    thunk(dispatch, getState);

    expect(ajaxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/athletes/32/injuries/41',
        method: 'PUT',
        contentType: 'application/json',
        data: expect.any(String), // transformIssueRequest returns a string
      })
    );
  });

  it('dispatches correct actions on success', async () => {
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.success();
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'INJURY',
      },
      IssueData: {
        id: 41,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'injury note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = editIssue();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(serverRequest());
    expect(dispatch).toHaveBeenCalledWith(serverRequestSuccess());
  });

  it('dispatches correct actions on error', async () => {
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.error();
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'INJURY',
      },
      IssueData: {
        id: 41,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'injury note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = editIssue();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(serverRequest());
    expect(dispatch).toHaveBeenCalledWith(serverRequestError());
  });
});

describe('when editing an illness', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest.spyOn($, 'ajax');
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('makes a request to the right endpoint', () => {
    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'ILLNESS',
      },
      IssueData: {
        id: 41,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'injury note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = editIssue();
    thunk(dispatch, getState);

    expect(ajaxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/athletes/32/illnesses/41',
        method: 'PUT',
        contentType: 'application/json',
        data: expect.any(String),
      })
    );
  });

  it('dispatches correct actions on success', async () => {
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.success();
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'ILLNESS',
      },
      IssueData: {
        id: 41,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'injury note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = editIssue();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(serverRequest());
    expect(dispatch).toHaveBeenCalledWith(serverRequestSuccess());
  });

  it('dispatches correct actions on error', async () => {
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.error();
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'ILLNESS',
      },
      IssueData: {
        id: 41,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'injury note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = editIssue();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(serverRequest());
    expect(dispatch).toHaveBeenCalledWith(serverRequestError());
  });
});

describe('when creating an injury', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest.spyOn($, 'ajax');
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('makes a request to the right endpoint', () => {
    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'INJURY',
      },
      IssueData: {
        id: 41,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'injury note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = createIssue();
    thunk(dispatch, getState);

    expect(ajaxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/athletes/32/injuries',
        method: 'POST',
        contentType: 'application/json',
        data: expect.any(String),
      })
    );
  });

  it('dispatches correct actions on success', async () => {
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.success();
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'INJURY',
      },
      IssueData: {
        id: 41,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'injury note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = createIssue();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(serverRequest());
    expect(dispatch).toHaveBeenCalledWith(serverRequestSuccess());
  });

  it('dispatches correct actions on error', async () => {
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.error();
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'INJURY',
      },
      IssueData: {
        id: 41,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'injury note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = createIssue();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(serverRequest());
    expect(dispatch).toHaveBeenCalledWith(serverRequestError());
  });
});

describe('when creating an illness', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest.spyOn($, 'ajax');
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('makes a request to the right endpoint', () => {
    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'ILLNESS',
      },
      IssueData: {
        id: 45,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'illness note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = createIssue();
    thunk(dispatch, getState);

    expect(ajaxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/athletes/32/illnesses',
        method: 'POST',
        contentType: 'application/json',
        data: expect.any(String),
      })
    );
  });

  it('dispatches correct actions on success', async () => {
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.success();
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'ILLNESS',
      },
      IssueData: {
        id: 45,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'illness note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = createIssue();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(serverRequest());
    expect(dispatch).toHaveBeenCalledWith(serverRequestSuccess());
  });

  it('dispatches correct actions on error', async () => {
    jest.spyOn($, 'ajax').mockImplementationOnce((options) => {
      options.error();
    });

    const getState = jest.fn(() => ({
      ModalData: {
        athleteId: 32,
        formType: 'ILLNESS',
      },
      IssueData: {
        id: 45,
        notes: [],
        events_order: [],
      },
      CurrentNote: {
        id: '',
        date: '',
        note: 'illness note',
        created_by: '',
      },
    }));
    const dispatch = jest.fn();

    const thunk = createIssue();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(serverRequest());
    expect(dispatch).toHaveBeenCalledWith(serverRequestError());
  });
});
