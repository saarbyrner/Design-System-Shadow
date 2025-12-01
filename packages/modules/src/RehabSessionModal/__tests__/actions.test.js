import {
  closeRehabSessionModal,
  addRehabAttribute,
  removeRehabAttribute,
  selectRehabPractitioner,
  selectRehabTimezone,
  selectRehabExercise,
  selectRehabReason,
  setRehabSets,
  setRehabReps,
  updateRehabNoteText,
  updateRehabNoteRichText,
  saveRehabSessionFailure,
  saveRehabSessionLoading,
  saveRehabSessionSuccess,
  updateRehabNoteAttribute,
  addRehabAttributes,
} from '../actions';

describe('Rehab Session shared actions', () => {
  it('has the correct action CLOSE_REHAB_SESSION_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_REHAB_SESSION_MODAL',
    };

    expect(closeRehabSessionModal()).toEqual(expectedAction);
  });

  it('has the correct action ADD_REHAB_ATTRIBUTE', () => {
    const expectedAction = {
      type: 'ADD_REHAB_ATTRIBUTE',
    };

    expect(addRehabAttribute()).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_REHAB_ATTRIBUTE', () => {
    const expectedAction = {
      type: 'REMOVE_REHAB_ATTRIBUTE',
      payload: {
        index: 0,
      },
    };

    expect(removeRehabAttribute(0)).toEqual(expectedAction);
  });

  it('has the correct action SELECT_REHAB_PRACTITIONER', () => {
    const expectedAction = {
      type: 'SELECT_REHAB_PRACTITIONER',
      payload: {
        practitionerId: 20,
      },
    };

    expect(selectRehabPractitioner(20)).toEqual(expectedAction);
  });

  it('has the correct action SELECT_REHAB_TIMEZONE', () => {
    const expectedAction = {
      type: 'SELECT_REHAB_TIMEZONE',
      payload: {
        timezone: 'Dublin/Europe',
      },
    };

    expect(selectRehabTimezone('Dublin/Europe')).toEqual(expectedAction);
  });

  it('has the correct action SELECT_REHAB_EXERCISE', () => {
    const expectedAction = {
      type: 'SELECT_REHAB_EXERCISE',
      payload: {
        exerciseId: 1,
        index: 0,
      },
    };

    expect(selectRehabExercise(1, 0)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_REHAB_NOTE_ATTRIBUTE', () => {
    const expectedAction = {
      type: 'UPDATE_REHAB_NOTE_ATTRIBUTE',
      payload: {
        text: 'new note',
        index: 0,
      },
    };

    expect(updateRehabNoteAttribute('new note', 0)).toEqual(expectedAction);
  });

  it('has the correct action SELECT_REHAB_REASON', () => {
    const expectedAction = {
      type: 'SELECT_REHAB_REASON',
      payload: {
        reasonObj: {
          reason: 'preparation',
          issue_id: null,
          issue_type: null,
        },
        index: 0,
      },
    };

    expect(
      selectRehabReason(
        {
          reason: 'preparation',
          issue_id: null,
          issue_type: null,
        },
        0
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_REHAB_SETS', () => {
    const expectedAction = {
      type: 'SET_REHAB_SETS',
      payload: {
        sets: 60,
        index: 0,
      },
    };

    expect(setRehabSets(60, 0)).toEqual(expectedAction);
  });

  it('has the correct action SET_REHAB_REPS', () => {
    const expectedAction = {
      type: 'SET_REHAB_REPS',
      payload: {
        reps: 60,
        index: 0,
      },
    };

    expect(setRehabReps(60, 0)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_REHAB_NOTE_TEXT', () => {
    const expectedAction = {
      type: 'UPDATE_REHAB_NOTE_TEXT',
      payload: {
        text: 'BLAH Blah',
      },
    };

    expect(updateRehabNoteText('BLAH Blah')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_REHAB_NOTE_RICH_TEXT', () => {
    const expectedAction = {
      type: 'UPDATE_REHAB_NOTE_RICH_TEXT',
      payload: {
        content: 'BLAH Blah',
      },
    };

    expect(updateRehabNoteRichText('BLAH Blah')).toEqual(expectedAction);
  });

  it('has the correct action SAVE_REHAB_SESSION_LOADING', () => {
    const expectedAction = {
      type: 'SAVE_REHAB_SESSION_LOADING',
    };

    expect(saveRehabSessionLoading()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_REHAB_SESSION_SUCCESS', () => {
    const expectedAction = {
      type: 'SAVE_REHAB_SESSION_SUCCESS',
    };

    expect(saveRehabSessionSuccess()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_REHAB_SESSION_FAILURE', () => {
    const expectedAction = {
      type: 'SAVE_REHAB_SESSION_FAILURE',
    };

    expect(saveRehabSessionFailure()).toEqual(expectedAction);
  });

  it('has the correct action ADD_REHAB_ATTRIBUTES', () => {
    const expectedAction = {
      type: 'ADD_REHAB_ATTRIBUTES',
      payload: {
        attributes: [
          {
            rehab_exercise_id: 1,
            sets: 2,
            reps: 15,
            weight: null,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            note: '',
          },
        ],
      },
    };

    expect(
      addRehabAttributes([
        {
          rehab_exercise_id: 1,
          sets: 2,
          reps: 15,
          weight: null,
          reason: 'general',
          issue_type: null,
          issue_id: null,
          note: '',
        },
      ])
    ).toEqual(expectedAction);
  });
});
