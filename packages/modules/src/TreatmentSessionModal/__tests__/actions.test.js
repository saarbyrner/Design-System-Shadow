import {
  closeTreatmentSessionModal,
  addTreatmentAttribute,
  removeTreatmentAttribute,
  selectBodyArea,
  selectPractitioner,
  selectTimezone,
  selectTreatmentModality,
  selectTreatmentReason,
  setTreatmentDuration,
  unselectBodyArea,
  unselectParentBodyArea,
  updateTreatmentNoteText,
  updateTreatmentNoteRichText,
  saveTreatmentSessionFailure,
  saveTreatmentSessionLoading,
  saveTreatmentSessionSuccess,
  updateTreatmentNoteAttribute,
  addTreatmentAttributes,
} from '../actions';

describe('Treatment Tracker shared actions', () => {
  it('has the correct action CLOSE_TREATMENT_SESSION_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_TREATMENT_SESSION_MODAL',
    };

    expect(closeTreatmentSessionModal()).toEqual(expectedAction);
  });

  it('has the correct action ADD_TREATMENT_ATTRIBUTE', () => {
    const expectedAction = {
      type: 'ADD_TREATMENT_ATTRIBUTE',
    };

    expect(addTreatmentAttribute()).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_TREATMENT_ATTRIBUTE', () => {
    const expectedAction = {
      type: 'REMOVE_TREATMENT_ATTRIBUTE',
      payload: {
        index: 0,
      },
    };

    expect(removeTreatmentAttribute(0)).toEqual(expectedAction);
  });

  it('has the correct action SELECT_BODY_AREA', () => {
    const expectedAction = {
      type: 'SELECT_BODY_AREA',
      payload: {
        bodyArea: {
          treatable_area_type: 'BodyPart',
          treatable_area_id: 262,
          side_id: 1,
        },
        bodyAreaParent: {
          treatable_area_type: 'OsicsBodyArea',
          treatable_area_id: 1,
          side_id: 1,
        },
        index: 0,
      },
    };

    expect(
      selectBodyArea(
        '{"treatable_area_type":"BodyPart","treatable_area_id":262,"side_id":1}',
        '{"treatable_area_type":"OsicsBodyArea","treatable_area_id":1,"side_id":1}',
        0
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action SELECT_PRACTITIONER', () => {
    const expectedAction = {
      type: 'SELECT_PRACTITIONER',
      payload: {
        practitionerId: 20,
      },
    };

    expect(selectPractitioner(20)).toEqual(expectedAction);
  });

  it('has the correct action SELECT_TIMEZONE', () => {
    const expectedAction = {
      type: 'SELECT_TIMEZONE',
      payload: {
        timezone: 'Dublin/Europe',
      },
    };

    expect(selectTimezone('Dublin/Europe')).toEqual(expectedAction);
  });

  it('has the correct action SELECT_TREATMENT_MODALITY', () => {
    const expectedAction = {
      type: 'SELECT_TREATMENT_MODALITY',
      payload: {
        modalityId: 1,
        index: 0,
      },
    };

    expect(selectTreatmentModality(1, 0)).toEqual(expectedAction);
  });

  it('has the correct action SELECT_TREATMENT_REASON', () => {
    const expectedAction = {
      type: 'SELECT_TREATMENT_REASON',
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
      selectTreatmentReason(
        {
          reason: 'preparation',
          issue_id: null,
          issue_type: null,
        },
        0
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_TREATMENT_DURATION', () => {
    const expectedAction = {
      type: 'SET_TREATMENT_DURATION',
      payload: {
        duration: 60,
        index: 0,
      },
    };

    expect(setTreatmentDuration(60, 0)).toEqual(expectedAction);
  });

  it('has the correct action UNSELECT_BODY_AREA', () => {
    const expectedAction = {
      type: 'UNSELECT_BODY_AREA',
      payload: {
        bodyArea:
          '{"treatable_area_type":"BodyPart","treatable_area_id":262,"side_id":1}',
        index: 0,
      },
    };

    expect(
      unselectBodyArea(
        '{"treatable_area_type":"BodyPart","treatable_area_id":262,"side_id":1}',
        0
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action UNSELECT_PARENT_BODY_AREA', () => {
    const expectedAction = {
      type: 'UNSELECT_PARENT_BODY_AREA',
      payload: {
        bodyAreas: [
          '{"treatable_area_type":"OsicsBodyArea","treatable_area_id":1,"side_id":1}',
          '{"treatable_area_type":"BodyPart","treatable_area_id":262,"side_id":1}',
          '{"treatable_area_type":"BodyPart","treatable_area_id":123,"side_id":1}',
          '{"treatable_area_type":"BodyPart","treatable_area_id":432,"side_id":1}',
        ],
        index: 0,
      },
    };

    expect(
      unselectParentBodyArea(
        [
          '{"treatable_area_type":"OsicsBodyArea","treatable_area_id":1,"side_id":1}',
          '{"treatable_area_type":"BodyPart","treatable_area_id":262,"side_id":1}',
          '{"treatable_area_type":"BodyPart","treatable_area_id":123,"side_id":1}',
          '{"treatable_area_type":"BodyPart","treatable_area_id":432,"side_id":1}',
        ],
        0
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TREATMENT_NOTE_TEXT', () => {
    const expectedAction = {
      type: 'UPDATE_TREATMENT_NOTE_TEXT',
      payload: {
        text: 'BLAH Blah',
      },
    };

    expect(updateTreatmentNoteText('BLAH Blah')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TREATMENT_NOTE_RICH_TEXT', () => {
    const expectedAction = {
      type: 'UPDATE_TREATMENT_NOTE_RICH_TEXT',
      payload: {
        content: 'BLAH Blah',
      },
    };

    expect(updateTreatmentNoteRichText('BLAH Blah')).toEqual(expectedAction);
  });

  it('has the correct action SAVE_TREATMENT_SESSION_LOADING', () => {
    const expectedAction = {
      type: 'SAVE_TREATMENT_SESSION_LOADING',
    };

    expect(saveTreatmentSessionLoading()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_TREATMENT_SESSION_SUCCESS', () => {
    const expectedAction = {
      type: 'SAVE_TREATMENT_SESSION_SUCCESS',
    };

    expect(saveTreatmentSessionSuccess()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_TREATMENT_SESSION_FAILURE', () => {
    const expectedAction = {
      type: 'SAVE_TREATMENT_SESSION_FAILURE',
    };

    expect(saveTreatmentSessionFailure()).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TREATMENT_NOTE_ATTRIBUTE', () => {
    const expectedAction = {
      type: 'UPDATE_TREATMENT_NOTE_ATTRIBUTE',
      payload: {
        text: 'new note',
        index: 0,
      },
    };

    expect(updateTreatmentNoteAttribute('new note', 0)).toEqual(expectedAction);
  });

  it('has the correct action ADD_TREATMENT_ATTRIBUTES', () => {
    const expectedAction = {
      type: 'ADD_TREATMENT_ATTRIBUTES',
      payload: {
        attributes: [
          {
            treatment_modality_id: 37,
            duration: 20,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
          },
          {
            treatment_modality_id: 2,
            duration: null,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
          },
        ],
      },
    };

    expect(
      addTreatmentAttributes([
        {
          treatment_modality_id: 37,
          duration: 20,
          reason: 'general',
          issue_type: null,
          issue_id: null,
          treatment_body_areas_attributes: [],
        },
        {
          treatment_modality_id: 2,
          duration: null,
          reason: 'general',
          issue_type: null,
          issue_id: null,
          treatment_body_areas_attributes: [],
        },
      ])
    ).toEqual(expectedAction);
  });
});
