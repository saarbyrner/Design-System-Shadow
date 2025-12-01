import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { IssueData, ModalData, CurrentNote, AppStatus } from '../reducer';
import getInjuryData from '../../../utils/InjuryData';
import { getBlankNote, getDefaultIssueState } from '../utils';

describe('IssueData - reducer', () => {
  it('returns correct state on ADD_NEW_EVENT', () => {
    const injuryData = getInjuryData();
    const initialState = injuryData;

    const action = {
      type: 'ADD_NEW_EVENT',
    };

    const firstState = IssueData(initialState, action);
    const secondState = IssueData(firstState, action);
    const lastState = IssueData(secondState, action);

    const expectedEvent = {
      injury_status_id: null,
      date: null,
    };
    const expectedOrder = [
      'id_1234',
      'id_1235',
      'id_1236',
      'new_status_1',
      'new_status_2',
      'new_status_3',
    ];
    expect(lastState.events.new_status_1).toEqual(expectedEvent);
    expect(lastState.events.new_status_2).toEqual(expectedEvent);
    expect(lastState.events.new_status_3).toEqual(expectedEvent);
    expect(lastState.events_order).toEqual(expectedOrder);
  });

  it('returns correct state on UPDATE_EVENT_DATE', () => {
    const injuryData = getInjuryData();
    const initialState = injuryData;

    const eventId = 'id_1235';
    const eventDate = new Date('Mon Nov 14 2018 11:47:28 (UTC)');
    const action = {
      type: 'UPDATE_EVENT_DATE',
      payload: {
        statusId: eventId,
        editedDate: eventDate,
      },
    };

    const nextState = IssueData(initialState, action);

    const expectedEvent = {
      id: 'id_1235',
      injury_status_id: 'option_1235',
      date: moment(eventDate).format(DateFormatter.dateTransferFormat),
    };

    expect(nextState.events[eventId]).toEqual(expectedEvent);
  });

  it('returns correct state on UPDATE_EXAMINATION_DATE', () => {
    const injuryData = getInjuryData();
    const initialState = injuryData;

    const action = {
      type: 'UPDATE_EXAMINATION_DATE',
      payload: {
        examinationDate: new Date('Mon Nov 14 2018 11:47:28 (UTC)'),
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.examination_date).toEqual('2018-11-14T11:47:28+00:00');
  });

  it('returns correct state on UPDATE_ISSUE_STATUS', () => {
    const injuryData = getInjuryData();
    const initialState = injuryData;

    const eventId = 'id_1235';
    const selectedOptionId = 'option_1236';
    const action = {
      type: 'UPDATE_ISSUE_STATUS',
      payload: {
        statusId: eventId,
        optionId: selectedOptionId,
      },
    };

    const nextState = IssueData(initialState, action);

    const expectedEvent = {
      id: 'id_1235',
      injury_status_id: 'option_1236',
      date: '2018-05-10 10:18:24',
    };

    expect(nextState.events[eventId]).toEqual(expectedEvent);
  });

  it('returns correct state on REMOVE_EVENT', () => {
    const injuryData = getInjuryData();
    const initialState = injuryData;

    const eventId = 'id_1235';
    const action = {
      type: 'REMOVE_EVENT',
      payload: {
        statusId: eventId,
      },
    };

    const nextState = IssueData(initialState, action);

    const expectedEventsOrder = ['id_1234', 'id_1236'];
    const expectedEvents = {
      id_1234: {
        id: 'id_1234',
        injury_status_id: 'option_1234',
        date: '2018-05-05 10:18:24',
      },
      id_1236: {
        id: 'id_1236',
        injury_status_id: 'option_1237',
        date: '2018-05-15 10:18:24',
      },
    };

    expect(nextState.events).toEqual(expectedEvents);
    expect(nextState.events_order).toEqual(expectedEventsOrder);
  });

  it('returns correct state on UPDATE_BAMIC_GRADE_ID', () => {
    const injuryData = getInjuryData();
    const initialState = {
      ...injuryData,
      site_id: 1,
    };

    const action = {
      type: 'UPDATE_BAMIC_GRADE_ID',
      payload: {
        gradeId: 2,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.bamic_grade_id).toBe(2);
    expect(nextState.bamic_site_id).toBe(null);
  });

  it('returns correct state on UPDATE_BAMIC_SITE_ID', () => {
    const injuryData = getInjuryData();
    const initialState = injuryData;

    const action = {
      type: 'UPDATE_BAMIC_SITE_ID',
      payload: {
        siteId: 1,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.bamic_site_id).toBe(1);
  });

  it('returns correct state on UPDATE_ISSUE_INFO', () => {
    const initialState = getInjuryData();

    const newIssueInfo = 'New info';
    const action = {
      type: 'UPDATE_ISSUE_INFO',
      payload: {
        issueInfo: newIssueInfo,
      },
    };

    const nextState = IssueData(initialState, action);
    expect(nextState.modification_info).toEqual(newIssueInfo);
  });

  it('returns correct state on UPDATE_OSICS_PATHOLOGY', () => {
    const initialState = getInjuryData();

    const newOsicsPathology = '3';
    const action = {
      type: 'UPDATE_OSICS_PATHOLOGY',
      payload: {
        osicsPathology: newOsicsPathology,
      },
    };

    const nextState = IssueData(initialState, action);
    expect(nextState.osics.osics_pathology_id).toEqual(newOsicsPathology);
  });

  it('returns correct state on UPDATE_OSICS_CLASSIFICATION', () => {
    const initialState = getInjuryData();

    const newOsicsClassification = '3';
    const action = {
      type: 'UPDATE_OSICS_CLASSIFICATION',
      payload: {
        osicsClassification: newOsicsClassification,
      },
    };

    const nextState = IssueData(initialState, action);
    expect(nextState.osics.osics_classification_id).toEqual(
      newOsicsClassification
    );
  });

  it('returns correct state on UPDATE_BODY_AREA', () => {
    const initialState = getInjuryData();

    const newBodyArea = 'back';
    const action = {
      type: 'UPDATE_BODY_AREA',
      payload: {
        bodyArea: newBodyArea,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.osics.osics_body_area_id).toEqual(newBodyArea);
  });

  it('returns correct state on UPDATE_SIDE', () => {
    const initialState = getInjuryData();

    const newSide = 'left';
    const action = {
      type: 'UPDATE_SIDE',
      payload: {
        side: newSide,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.side_id).toEqual(newSide);
  });

  it('returns correct state on UPDATE_TYPE', () => {
    const initialState = getInjuryData();

    const newTypeID = 3;
    const action = {
      type: 'UPDATE_TYPE',
      payload: {
        typeId: newTypeID,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.type_id).toEqual(newTypeID);
  });

  it('returns correct state on UPDATE_OSICS_CODE', () => {
    const initialState = getInjuryData();

    const newOsicsCode = '3';
    const action = {
      type: 'UPDATE_OSICS_CODE',
      payload: {
        osicsCode: newOsicsCode,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.osics.osics_id).toEqual(newOsicsCode);
  });

  it('returns correct state on UPDATE_ICD_CODE', () => {
    const initialState = getInjuryData();

    const newIcdCode = '3';
    const action = {
      type: 'UPDATE_ICD_CODE',
      payload: {
        icdCode: newIcdCode,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.osics.icd).toEqual(newIcdCode);
  });

  describe('UPDATE_OCCURRENCE_DATE', () => {
    it('returns correct state on UPDATE_OCCURRENCE_DATE', () => {
      const initialState = getInjuryData();

      const newOccurrenceDate = '2018-02-10';
      const expectedFormatedDate = moment(newOccurrenceDate).format(
        DateFormatter.dateTransferFormat
      );
      const action = {
        type: 'UPDATE_OCCURRENCE_DATE',
        payload: {
          occurrenceDate: newOccurrenceDate,
        },
      };

      const nextState = IssueData(initialState, action);

      expect(nextState.occurrence_date).toBe(expectedFormatedDate);

      // Update the first event occurrence date
      const firstEvent = initialState.events_order[0];
      expect(nextState.events[firstEvent].date).toBe(expectedFormatedDate);
    });

    describe('when the selected game is unlisted', () => {
      it('keeps the selected game unlisted', () => {
        const initialState = Object.assign({}, getInjuryData());
        initialState.game_id = 'UNLISTED';

        const action = {
          type: 'UPDATE_OCCURRENCE_DATE',
          payload: {
            occurrenceDate: '2017-08-15 00:00:00',
          },
        };
        const nextState = IssueData(initialState, action);

        expect(nextState.game_id).toBe('UNLISTED');
      });
    });

    describe('when the selected game is not unlisted', () => {
      it('wipes the selected game', () => {
        const initialState = Object.assign({}, getInjuryData());
        initialState.game_id = 2;

        const action = {
          type: 'UPDATE_OCCURRENCE_DATE',
          payload: {
            occurrenceDate: '2017-08-15 00:00:00',
          },
        };
        const nextState = IssueData(initialState, action);

        expect(nextState.game_id).toBe(null);
      });
    });

    describe('when the selected training session is unlisted', () => {
      it('keeps the selected training session unlisted', () => {
        const initialState = Object.assign({}, getInjuryData());
        initialState.training_session_id = 'UNLISTED';

        const action = {
          type: 'UPDATE_OCCURRENCE_DATE',
          payload: {
            occurrenceDate: '2017-08-15 00:00:00',
          },
        };
        const nextState = IssueData(initialState, action);

        expect(nextState.training_session_id).toBe('UNLISTED');
      });
    });

    describe('when the selected training session is not unlisted', () => {
      it('wipes the selected training session', () => {
        const initialState = Object.assign({}, getInjuryData());
        initialState.training_session_id = 2;

        const action = {
          type: 'UPDATE_OCCURRENCE_DATE',
          payload: {
            occurrenceDate: '2017-08-15 00:00:00',
          },
        };
        const nextState = IssueData(initialState, action);

        expect(nextState.training_session_id).toBe(null);
      });
    });
  });

  it('returns correct state on UPDATE_ACTIVITY', () => {
    const initialState = getInjuryData();

    const newActivityId = '3';
    const newActivityType = 'game';
    const action = {
      type: 'UPDATE_ACTIVITY',
      payload: {
        activityId: newActivityId,
        activityType: newActivityType,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.activity_id).toEqual(newActivityId);
    expect(nextState.activity_type).toEqual(newActivityType);

    expect(nextState.game_id).toBe(null);
    expect(nextState.training_session_id).toBe(null);
    expect(nextState.occurrence_min).toBe(null);
    expect(nextState.session_completed).toBe(false);
  });

  describe('when the new activity_id type is null', () => {
    it('returns correct state on UPDATE_ACTIVITY', () => {
      const initialState = getInjuryData();

      const newActivityId = 'other';
      const action = {
        type: 'UPDATE_ACTIVITY',
        payload: {
          activityId: newActivityId,
          activityType: null,
        },
      };

      const nextState = IssueData(initialState, action);
      expect(nextState.session_completed).toBe(null);
    });
  });

  it('returns correct state on UPDATE_TRAINING_SESSION', () => {
    const initialState = getInjuryData();

    const newTrainingSessionId = '3';
    const action = {
      type: 'UPDATE_TRAINING_SESSION',
      payload: {
        trainingSessionId: newTrainingSessionId,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.training_session_id).toEqual(newTrainingSessionId);
  });

  describe('UPDATE_GAME', () => {
    it('returns correct state on UPDATE_GAME', () => {
      const initialState = getInjuryData();

      const newGameId = '3';
      const action = {
        type: 'UPDATE_GAME',
        payload: {
          gameId: newGameId,
        },
      };

      const nextState = IssueData(initialState, action);

      expect(nextState.game_id).toEqual(newGameId);
    });

    describe('when the game has a date', () => {
      it('sets the occurrence date and first event date', () => {
        const initialState = getInjuryData();
        const gameDate = '2018-02-10T00:00:00+00:00';

        const newGameId = '3';
        const action = {
          type: 'UPDATE_GAME',
          payload: {
            gameId: newGameId,
            gameDate,
          },
        };

        const nextState = IssueData(initialState, action);

        expect(nextState.game_id).toEqual(newGameId);
        expect(nextState.occurrence_date).toEqual(gameDate);

        // Update the first event occurrence date
        const firstEvent = initialState.events_order[0];
        expect(nextState.events[firstEvent].date).toBe(gameDate);
      });
    });
  });

  it('returns correct state on UPDATE_PERIOD', () => {
    const initialState = getInjuryData();

    const newPeriodId = 456;
    const action = {
      type: 'UPDATE_PERIOD',
      payload: {
        periodId: newPeriodId,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.association_period_id).toEqual(newPeriodId);
  });

  it('returns correct state on UPDATE_GAME_TIME', () => {
    const initialState = getInjuryData();

    const newGameTime = '3';
    const action = {
      type: 'UPDATE_GAME_TIME',
      payload: {
        gameTime: newGameTime,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.occurrence_min).toEqual(newGameTime);
  });

  it('returns correct state on UPDATE_SESSION_COMPLETED', () => {
    const initialState = getInjuryData();

    const action = {
      type: 'UPDATE_SESSION_COMPLETED',
      payload: {
        isSessionCompleted: true,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.session_completed).toBe(true);
  });

  it('returns correct state on UPDATE_POSITION_GROUP', () => {
    const initialState = getInjuryData();

    const newPositionGroupId = '3';
    const action = {
      type: 'UPDATE_POSITION_GROUP',
      payload: {
        positionGroupId: newPositionGroupId,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.position_when_injured_id).toEqual(newPositionGroupId);
  });

  it('returns correct state on UPDATE_FORM_TYPE', () => {
    const initialState = getInjuryData();

    const formType = 'ILLNESS';
    const action = {
      type: 'UPDATE_FORM_TYPE',
      payload: {
        formType,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState).toEqual(
      getDefaultIssueState(
        initialState.athlete_id,
        initialState.modification_info
      )
    );
  });

  it('returns correct state on UPDATE_RECURRENCE', () => {
    const initialState = getInjuryData();

    const priorIssue = {
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
      resolved_date: '2018-06-06T00:00:00+01:00',
    };

    const action = {
      type: 'UPDATE_RECURRENCE',
      payload: {
        priorIssue,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.recurrence_id).toBe(priorIssue.id);
    expect(nextState.osics).toEqual(priorIssue.osics);
    expect(nextState.side_id).toBe(priorIssue.side_id);
    expect(nextState.type_id).toBe(priorIssue.type_id);
    expect(nextState.prior_resolved_date).toBe('2018-06-06T00:00:00+01:00');
  });

  it('returns correct state on UPDATE_HAS_RECURRENCE', () => {
    const initialState = Object.assign({}, getInjuryData());
    initialState.prior_resolved_date = '2018-06-06T00:00:00+01:00';

    const hasRecurrence = true;
    const action = {
      type: 'UPDATE_HAS_RECURRENCE',
      payload: {
        hasRecurrence,
      },
    };

    const nextState = IssueData(initialState, action);

    expect(nextState.has_recurrence).toBe(hasRecurrence);
    expect(nextState.recurrence_id).toBe(null);
    expect(nextState.osics.osics_body_area_id).toBe(null);
    expect(nextState.osics.osics_classification_id).toBe(null);
    expect(nextState.osics.osics_id).toBe(null);
    expect(nextState.osics.osics_pathology_id).toBe(null);
    expect(nextState.side_id).toBe(null);
    expect(nextState.type_id).toBe(null);
    // Reset the minimum occurrence date when clicking the recurrence checkbox.
    expect(nextState.prior_resolved_date).toBe(null);
  });

  it('returns correct state on UPDATE_HAS_SUPPLEMENTARY_PATHOLOGY', () => {
    const initialState = getInjuryData();
    const action = {
      type: 'UPDATE_HAS_SUPPLEMENTARY_PATHOLOGY',
      payload: {
        hasSupplementaryPathology: true,
      },
    };
    const nextState = IssueData(initialState, action);

    expect(nextState.has_supplementary_pathology).toEqual(true);
  });

  it('returns correct state on UPDATE_SUPPLEMENTARY_PATHOLOGY', () => {
    const initialState = getInjuryData();
    const action = {
      type: 'UPDATE_SUPPLEMENTARY_PATHOLOGY',
      payload: {
        supplementaryPathology: 'Something',
      },
    };
    const nextState = IssueData(initialState, action);

    expect(nextState.supplementary_pathology).toEqual('Something');
  });
});

describe('ModalData - reducer', () => {
  it('returns correct state on IS_FETCHING_ISSUE_DETAILS', () => {
    const initialState = {
      isFetchingIssueDetails: false,
    };

    const action = {
      type: 'IS_FETCHING_ISSUE_DETAILS',
      payload: {
        requestInProgress: true,
      },
    };

    const expectedState = {
      isFetchingIssueDetails: true,
    };
    const nextState = ModalData(initialState, action);

    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on IS_FETCHING_GAME_AND_TRAINING_OPTION', () => {
    const initialState = {
      isFetchingGameAndTrainingOptions: false,
    };

    const action = {
      type: 'IS_FETCHING_GAME_AND_TRAINING_OPTION',
      payload: {
        requestInProgress: true,
      },
    };

    const expectedState = {
      isFetchingGameAndTrainingOptions: true,
    };
    const nextState = ModalData(initialState, action);

    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_GAME_OPTIONS', () => {
    const initialState = getInjuryData();

    const newGameOptions = [
      {
        title: 'Dublin vs Cork',
        id: '2',
      },
    ];
    const action = {
      type: 'UPDATE_GAME_OPTIONS',
      payload: {
        gameOptions: newGameOptions,
      },
    };

    const nextState = ModalData(initialState, action);

    expect(nextState.gameOptions).toEqual(newGameOptions);
  });

  it('returns correct state on UPDATE_TRAINING_OPTIONS', () => {
    const initialState = getInjuryData();

    const newTrainingOptions = [
      {
        title: 'conditionning 2018-02-10',
        id: '2',
      },
    ];
    const action = {
      type: 'UPDATE_TRAINING_OPTIONS',
      payload: {
        trainingOptions: newTrainingOptions,
      },
    };

    const nextState = ModalData(initialState, action);

    expect(nextState.trainingSessionOptions).toEqual(newTrainingOptions);
  });

  describe('when the new form type is INJURY', () => {
    const staticData = {
      injuryOsicsPathologies: [
        { id: 2, name: 'Traction injury to apophysis ankle' },
      ],
      illnessOsicsPathologies: [],
      injuryOsicsClassifications: [{ id: 1, name: 'Apophysitis' }],
      illnessOsicsClassifications: [],
      injuryOsicsBodyAreas: [{ id: 1, name: 'Ankle' }],
      illnessOsicsBodyAreas: [],
      injuryOnsets: [{ id: 1, name: 'Overuse' }],
      illnessOnsets: [{ id: 1, name: 'Acute' }],
    };

    it('returns correct state on UPDATE_FORM_TYPE', () => {
      const initialState = {
        ...getInjuryData(),
        staticData,
      };

      const formType = 'INJURY';
      const action = {
        type: 'UPDATE_FORM_TYPE',
        payload: {
          formType,
        },
      };

      const nextState = ModalData(initialState, action);

      expect(nextState.formType).toBe('INJURY');
      expect(nextState.osicsPathologyOptions).toEqual([
        { id: 2, title: 'Traction injury to apophysis ankle' },
      ]);
      expect(nextState.osicsClassificationOptions).toEqual([
        { id: 1, title: 'Apophysitis' },
      ]);
      expect(nextState.bodyAreaOptions).toEqual([{ id: 1, title: 'Ankle' }]);
      expect(nextState.issueTypeOptions).toEqual([{ id: 1, title: 'Overuse' }]);
    });
  });

  describe('when the new form type is ILLNESS', () => {
    const staticData = {
      injuryOsicsPathologies: [],
      illnessOsicsPathologies: [{ id: 2, name: 'Flu' }],
      injuryOsicsClassifications: [],
      illnessOsicsClassifications: [{ id: 1, name: 'Nerve' }],
      injuryOsicsBodyAreas: [],
      illnessOsicsBodyAreas: [{ id: 1, name: 'Neck' }],
      injuryOnsets: [],
      illnessOnsets: [{ id: 1, name: 'Flu' }],
    };

    it('returns correct state on UPDATE_FORM_TYPE', () => {
      const initialState = {
        ...getInjuryData(),
        staticData,
      };

      const formType = 'ILLNESS';
      const action = {
        type: 'UPDATE_FORM_TYPE',
        payload: {
          formType,
        },
      };

      const nextState = ModalData(initialState, action);

      expect(nextState.formType).toBe('ILLNESS');
      expect(nextState.osicsPathologyOptions).toEqual([
        { id: 2, title: 'Flu' },
      ]);
      expect(nextState.osicsClassificationOptions).toEqual([
        { id: 1, title: 'Nerve' },
      ]);
      expect(nextState.bodyAreaOptions).toEqual([{ id: 1, title: 'Neck' }]);
      expect(nextState.issueTypeOptions).toEqual([{ id: 1, title: 'Flu' }]);
    });
  });
});

describe('CurrentNote - reducer', () => {
  it('returns correct state on UPDATE_NOTE', () => {
    const initialState = getBlankNote();

    const newNote = 'New note';
    const action = {
      type: 'UPDATE_NOTE',
      payload: {
        note: newNote,
      },
    };

    const nextState = CurrentNote(initialState, action);
    expect(nextState.note).toEqual(newNote);
  });

  it('returns correct state on UPDATE_IS_RESTRICTED', () => {
    const initialState = getBlankNote();
    const action = {
      type: 'UPDATE_IS_RESTRICTED',
      payload: {
        isRestricted: true,
      },
    };

    const nextState = CurrentNote(initialState, action);
    expect(nextState.restricted).toEqual(true);
  });

  it('returns correct state on UPDATE_PSYCH_ONLY', () => {
    const initialState = getBlankNote();
    const action = {
      type: 'UPDATE_PSYCH_ONLY',
      payload: {
        psychOnly: true,
      },
    };

    const nextState = CurrentNote(initialState, action);
    expect(nextState.psych_only).toEqual(true);
  });
});

describe('AppStatus - reducer', () => {
  it('returns correct state on SERVER_REQUEST', () => {
    const initialState = {
      status: null,
      message: null,
    };

    const action = {
      type: 'SERVER_REQUEST',
    };

    const expectedState = {
      status: 'loading',
      message: null,
    };
    const nextState = AppStatus(initialState, action);

    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on SERVER_REQUEST_ERROR', () => {
    const initialState = {
      status: null,
      message: null,
    };

    const action = {
      type: 'SERVER_REQUEST_ERROR',
    };

    const expectedState = {
      status: 'error',
      message: null,
    };
    const nextState = AppStatus(initialState, action);

    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on SERVER_REQUEST_SUCCESS', () => {
    const initialState = {
      status: null,
      message: null,
    };

    const action = {
      type: 'SERVER_REQUEST_SUCCESS',
    };

    const expectedState = {
      status: 'success',
      message: 'Success',
    };
    const nextState = AppStatus(initialState, action);

    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const initialState = {
      status: 'success',
      message: null,
    };

    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const expectedState = {
      status: null,
      message: null,
    };
    const nextState = AppStatus(initialState, action);

    expect(nextState).toEqual(expectedState);
  });
});
