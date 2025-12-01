import moment from 'moment';
import {
  groupAthletesByPosition,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByName,
  groupAthletesByPositionGroup,
  getFilteredAthletes,
  getGroupOrderingByType,
} from '@kitman/common/src/utils';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  athletes,
  addAbsenceModal,
  noteModal,
  modInfoModal,
  modRTPModal,
  diagnosticModal,
  appStatus,
  injuryUploadModal,
  treatmentSessionModal,
  fileUploadToast,
} from '../reducer';
import athleteData from '../../utils/dummyAthleteData';

describe('Athlete Availability List - athletes reducer', () => {
  const dummyAthleteData = athleteData();
  const positionsHash = {
    position_group_order: [25, 26, 27],
    position_groups: {
      25: 'Forward',
      26: 'Back',
      27: 'Other',
    },
    position_order: [72, 71, 70, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83],
    positions: {
      70: 'Tight-head Prop',
      71: 'Hooker',
      72: 'Loose-head Prop',
      73: 'Second Row',
      74: 'Blindside Flanker',
      75: 'Openside Flanker',
      76: 'No. 8',
      77: 'Scrum Half',
      78: 'Out Half',
      79: 'Inside Centre',
      80: 'Outside Centre',
      81: 'Wing',
      82: 'Fullback',
      83: 'Other',
    },
  };
  const groupOrderingByType = getGroupOrderingByType(positionsHash);
  const groupedAthletes = {
    position: groupAthletesByPosition(dummyAthleteData),
    positionGroup: groupAthletesByPositionGroup(
      dummyAthleteData,
      groupOrderingByType.position
    ),
    availability: groupAthletesByAvailability(dummyAthleteData),
    last_screening: groupAthletesByScreening(dummyAthleteData),
    name: groupAthletesByName(dummyAthleteData),
  };

  const initialState = {
    all: dummyAthleteData,
    grouped: {
      position: groupedAthletes.position,
      positionGroup: groupedAthletes.positionGroup,
      availability: groupedAthletes.availability,
      last_screening: groupedAthletes.last_screening,
      name: groupedAthletes.name,
    },
    currentlyVisible: getFilteredAthletes(
      groupedAthletes.positionGroup,
      '',
      null,
      [],
      [],
      {},
      null,
      ''
    ),
    groupBy: 'positionGroup',
    groupOrderingByType,
    isFilterShown: false,
    athleteFilters: [],
    groupingLabels: {
      unavailable: 'Unavailable',
      available: 'Available',
      injured: 'Available (Injured/Ill)',
      returning: 'Available (Returning from injury/illness)',
      screened: 'Screened Today',
      not_screened: 'Not Screened Today',
      alphabetical: 'Alphabetical (A-Z)',
    },
    availabilityByPosition: {
      'Blindside Flanker': 100,
      Fullback: 100,
      Hooker: 50,
      'Inside Centre': 100,
      'Loose-head Prop': 0,
      'No. 8': 67,
      'Openside Flanker': 100,
      'Out Half': 50,
      'Scrum Half': 33,
      'Second Row': 100,
      'Tight-head Prop': 0,
      Wing: 100,
    },
    availabilityByPositionGroup: {
      Back: 30,
      Forward: 60,
    },
  };

  it('returns correct state on TOGGLE_ATHLETE_FILTERS', () => {
    const expectedState = Object.assign({}, initialState, {
      isFilterShown: true,
    });

    const action = {
      type: 'TOGGLE_ATHLETE_FILTERS',
      payload: {
        isFilterShown: false,
      },
    };

    const nextState = athletes(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_FILTER_OPTIONS', () => {
    const expectedState = Object.assign({}, initialState, {
      currentlyVisible: getFilteredAthletes(
        groupedAthletes.position,
        '',
        null,
        [],
        [1234, 4567],
        {},
        null,
        ''
      ),
      groupBy: 'position',
      athleteFilters: [1234, 4567],
    });

    const action = {
      type: 'UPDATE_FILTER_OPTIONS',
      payload: {
        groupBy: 'position',
        alarmFilters: null,
        athleteFilters: [1234, 4567],
      },
    };

    const nextState = athletes(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_ATHLETE_MODINFO', () => {
    const modifiedDummyAthletes = dummyAthleteData.slice();
    modifiedDummyAthletes[0].modification_info = 'New modinfo text';
    modifiedDummyAthletes[0].rtp = '2019-10-20T00:00:00.000+01:00';
    const expectedState = Object.assign({}, initialState, {
      all: modifiedDummyAthletes,
    });

    const action = {
      type: 'UPDATE_ATHLETE_MODINFO',
      payload: {
        athleteId: dummyAthleteData[0].id,
        info: 'New modinfo text',
        rtp: moment('2019-10-20').toDate(),
      },
    };

    const nextState = athletes(initialState, action);
    expect(nextState).toEqual(expectedState);
  });
});

describe('Athlete Availability List - addAbsenceModal reducer', () => {
  const dummyAthleteData = athleteData();
  const initialState = {
    athlete: null,
    athleteInjuries: [],
    athleteIllnesses: [],
    isModalOpen: false,
    attachments: [],
    absenceData: {
      reason_id: null,
      from: '',
      to: '',
      athlete_id: null,
    },
  };

  it('returns correct state on OPEN_ADD_ABSENCE_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: dummyAthleteData[0],
      isModalOpen: true,
    });

    const action = {
      type: 'OPEN_ADD_ABSENCE_MODAL',
      payload: {
        athlete: dummyAthleteData[0],
      },
    };

    const nextState = addAbsenceModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on CLOSE_ADD_ABSENCE_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: null,
      isModalOpen: false,
    });

    const action = {
      type: 'CLOSE_ADD_ABSENCE_MODAL',
    };

    const nextState = addAbsenceModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_ABSENCE_REASON_TYPE', () => {
    const expectedState = Object.assign({}, initialState, {
      absenceData: {
        reason_id: 26,
        from: '',
        to: '',
        athlete_id: null,
      },
    });

    const action = {
      type: 'UPDATE_ABSENCE_REASON_TYPE',
      payload: {
        reasonId: 26,
      },
    };

    const nextState = addAbsenceModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_ABSENCE_FROM_DATE', () => {
    const expectedState = Object.assign({}, initialState, {
      absenceData: {
        reason_id: null,
        from: '2019-12-11T00:00:00Z',
        to: '',
        athlete_id: null,
      },
    });

    const action = {
      type: 'UPDATE_ABSENCE_FROM_DATE',
      payload: {
        date: moment('2019-12-11').toDate(),
      },
    };

    const nextState = addAbsenceModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_ABSENCE_TO_DATE', () => {
    const expectedState = Object.assign({}, initialState, {
      absenceData: {
        reason_id: null,
        from: '',
        to: '2019-12-17T00:00:00Z',
        athlete_id: null,
      },
    });

    const action = {
      type: 'UPDATE_ABSENCE_TO_DATE',
      payload: {
        date: moment('2019-12-17').toDate(),
      },
    };

    const nextState = addAbsenceModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });
});

describe('Athlete Availability List - noteModal reducer', () => {
  const dummyAthleteData = athleteData();
  const initialState = {
    athlete: null,
    athleteInjuries: [],
    athleteIllnesses: [],
    isModalOpen: false,
    attachments: [],
    noteData: {
      attachment_ids: [],
      note_date: null,
      note_type: null,
      medical_type: null,
      medical_name: null,
      injury_ids: [],
      illness_ids: [],
      note: '',
      expiration_date: null,
      batch_number: null,
      renewal_date: null,
      restricted: false,
      psych_only: false,
    },
    noteMedicalTypeOptions: [
      { isGroupOption: true, name: 'Allergy' },
      { name: 'Allergy', key_name: 'Allergy' },
    ],
  };

  it('returns correct state on OPEN_ADD_NOTE_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: dummyAthleteData[0],
      isModalOpen: true,
    });

    const action = {
      type: 'OPEN_ADD_NOTE_MODAL',
      payload: {
        athlete: dummyAthleteData[0],
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on CLOSE_ADD_NOTE_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: null,
      isModalOpen: false,
    });

    const action = {
      type: 'CLOSE_ADD_NOTE_MODAL',
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE_DATE', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: '2019-12-11T00:00:00+00:00',
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE_DATE',
      payload: {
        date: moment('2019-12-11').toDate(),
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE_TYPE', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: 2,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE_TYPE',
      payload: {
        type: 2,
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_RELEVANT_NOTE_INJURIES when issue was not listed before', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [1234],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_RELEVANT_NOTE_INJURIES',
      payload: {
        issueId: 1234,
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_RELEVANT_NOTE_ILLNESSES when issue was not listed before', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [1234],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_RELEVANT_NOTE_ILLNESSES',
      payload: {
        issueId: 1234,
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_RELEVANT_NOTE_INJURIES when issue is listed already', () => {
    const stateWithExistingIssueId = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: 1,
        medical_type: null,
        medical_name: null,
        injury_ids: [1234],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });
    const expectedState = Object.assign({}, stateWithExistingIssueId, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: 1,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_RELEVANT_NOTE_INJURIES',
      payload: {
        issueId: 1234,
      },
    };

    const nextState = noteModal(stateWithExistingIssueId, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_RELEVANT_NOTE_ILLNESSES when issue is listed already', () => {
    const stateWithExistingIssueId = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: 1,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [1234],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });
    const expectedState = Object.assign({}, stateWithExistingIssueId, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: 1,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_RELEVANT_NOTE_ILLNESSES',
      payload: {
        issueId: 1234,
      },
    };

    const nextState = noteModal(stateWithExistingIssueId, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: 'This is a note.',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE',
      payload: {
        note: 'This is a note.',
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE_MEDICAL_TYPE', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: 'vaccination',
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE_MEDICAL_TYPE',
      payload: {
        medicalType: 'vaccination',
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE_MEDICAL_TYPE_NAME', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: 'medication name',
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE_MEDICAL_TYPE_NAME',
      payload: {
        name: 'medication name',
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE_ATTACHMENTS', () => {
    const date = new Date('Nov 20 2018');
    const dummyFileAttachment = {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 5000, // Bytes
      type: 'text/csv',
      webkitRelativePath: '',
    };
    const expectedState = Object.assign({}, initialState, {
      attachments: [dummyFileAttachment],
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE_ATTACHMENTS',
      payload: {
        file: dummyFileAttachment,
        index: 0,
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE_ATTACHMENTS when file is removed', () => {
    const date = new Date('Nov 20 2018');
    const dummyFileAttachment = {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 5000, // Bytes
      type: 'text/csv',
      webkitRelativePath: '',
    };
    const initialStateWithAttachment = Object.assign({}, initialState, {
      attachments: [dummyFileAttachment],
      noteData: {
        attachment_ids: [12345],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });
    const expectedState = Object.assign({}, initialState, {
      attachments: [],
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE_ATTACHMENTS',
      payload: {
        file: null,
        index: 0,
      },
    };

    const nextState = noteModal(initialStateWithAttachment, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_ATTACHMENT_IDS', () => {
    const expectedState = Object.assign({}, initialState, {
      attachments: [],
      noteData: {
        attachment_ids: [12345],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_ATTACHMENT_IDS',
      payload: {
        attachmentId: 12345,
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE_EXP_DATE', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: '2019-12-11T00:00:00+00:00',
        batch_number: null,
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE_EXP_DATE',
      payload: {
        date: moment('2019-12-11').toDate(),
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE_RENEWAL_DATE', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: '2019-12-11T00:00:00+00:00',
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE_RENEWAL_DATE',
      payload: {
        date: moment('2019-12-11').toDate(),
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_NOTE_BATCH_NUMBER', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: 'Batch No 1234',
        renewal_date: null,
        restricted: false,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_NOTE_BATCH_NUMBER',
      payload: {
        batchNumber: 'Batch No 1234',
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_IS_RESTRICTED', () => {
    const expectedState = Object.assign({}, initialState, {
      noteData: {
        attachment_ids: [],
        note_date: null,
        note_type: null,
        medical_type: null,
        medical_name: null,
        injury_ids: [],
        illness_ids: [],
        note: '',
        expiration_date: null,
        batch_number: null,
        renewal_date: null,
        restricted: true,
        psych_only: false,
      },
    });

    const action = {
      type: 'UPDATE_IS_RESTRICTED',
      payload: {
        checked: true,
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on COPY_LAST_NOTE_ERROR', () => {
    const action = {
      type: 'COPY_LAST_NOTE_ERROR',
      payload: {
        errorMsg: 'No notes to copy',
      },
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: {
        ...initialState.requestStatus,
        status: 'error',
        message: 'No notes to copy',
      },
    });
  });

  it('returns correct state on HIDE_REQUEST_STATUS', () => {
    const action = {
      type: 'HIDE_REQUEST_STATUS',
    };

    const nextState = noteModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: {
        ...initialState.requestStatus,
        status: null,
        message: null,
      },
    });
  });
});

describe('Athlete Availability List - appStatus reducer', () => {
  const initialState = {
    status: null,
    message: null,
  };

  it('returns correct state on SERVER_REQUEST', () => {
    const action = {
      type: 'SERVER_REQUEST',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'loading',
    });
  });

  it('returns correct state on SERVER_REQUEST_FOR_NOTE_ISSUES', () => {
    const action = {
      type: 'SERVER_REQUEST_FOR_NOTE_ISSUES',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'loading',
      message: 'Loading...',
    });
  });

  it('returns correct state on SERVER_REQUEST_FOR_LAST_NOTE', () => {
    const action = {
      type: 'SERVER_REQUEST_FOR_LAST_NOTE',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'loading',
      message: 'Loading...',
    });
  });

  it('returns correct state on SERVER_REQUEST_FOR_DIAGNOSTIC_ISSUES', () => {
    const action = {
      type: 'SERVER_REQUEST_FOR_DIAGNOSTIC_ISSUES',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'loading',
      message: 'Loading...',
    });
  });

  it('returns correct state on SERVER_REQUEST_ERROR', () => {
    const action = {
      type: 'SERVER_REQUEST_ERROR',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'error',
    });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: null,
      message: null,
    });
  });

  it('returns correct state on SAVE_ATHLETE_PROFILE_NOTE_SUCCESS', () => {
    const action = {
      type: 'SAVE_ATHLETE_PROFILE_NOTE_SUCCESS',
      payload: {
        isRestricted: false,
      },
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'success',
      message: 'New note has been created',
    });
  });

  it('returns correct state on SAVE_ATHLETE_AVAILABILITY_DIAGNOSTIC_SUCCESS', () => {
    const action = {
      type: 'SAVE_ATHLETE_AVAILABILITY_DIAGNOSTIC_SUCCESS',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'success',
      message: 'Diagnostic/Intervention saved successfully',
    });
  });

  it('returns correct state on SAVE_ATHLETE_AVAILABILITY_MOD_INFO_SUCCESS', () => {
    const action = {
      type: 'SAVE_ATHLETE_AVAILABILITY_MOD_INFO_SUCCESS',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'success',
      message: 'Modification/Info changed successfully',
    });
  });

  it('returns correct state on SAVE_UPLOAD_INJURY_SUCCESS', () => {
    const action = {
      type: 'SAVE_UPLOAD_INJURY_SUCCESS',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'success',
      message: 'File uploaded successfully',
    });
  });

  it('returns correct state on SAVE_TREATMENT_SESSION_LOADING', () => {
    const action = {
      type: 'SAVE_TREATMENT_SESSION_LOADING',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'loading',
      message: 'Saving treatment session...',
    });
  });

  it('returns correct state on SAVE_TREATMENT_SESSION_SUCCESS', () => {
    const action = {
      type: 'SAVE_TREATMENT_SESSION_SUCCESS',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'success',
      message: 'Treatment session saved successfully',
    });
  });

  it('returns correct state on SAVE_TREATMENT_SESSION_FAILURE', () => {
    const action = {
      type: 'SAVE_TREATMENT_SESSION_FAILURE',
    };

    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({
      status: 'error',
      message: null,
    });
  });
});

describe('Athlete Availability List - modInfoModal reducer', () => {
  const dummyAthleteData = athleteData();
  const initialState = {
    athlete: null,
    isModalOpen: false,
    modInfoData: {
      info: '',
      rtp: '',
    },
  };

  it('returns correct state on OPEN_MOD_INFO_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: dummyAthleteData[0],
      isModalOpen: true,
      modInfoData: {
        info: 'New Test',
        rtp: '2017-07-20T00:00:00.000+01:00',
      },
    });

    const action = {
      type: 'OPEN_MOD_INFO_MODAL',
      payload: {
        athlete: dummyAthleteData[0],
      },
    };

    const nextState = modInfoModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on CLOSE_MOD_INFO_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: null,
      isModalOpen: false,
      modInfoData: {
        info: '',
        rtp: '',
      },
    });

    const action = {
      type: 'CLOSE_MOD_INFO_MODAL',
    };

    const nextState = modInfoModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on OPEN_RTP_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: dummyAthleteData[0],
      isModalOpen: true,
      modRTPData: {
        rtp: '2017-07-20T00:00:00.000+01:00',
      },
    });

    const action = {
      type: 'OPEN_RTP_MODAL',
      payload: {
        athlete: dummyAthleteData[0],
      },
    };

    const nextState = modRTPModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on CLOSE_RTP_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: null,
      isModalOpen: false,
      modRTPData: {
        rtp: '',
      },
    });

    const action = {
      type: 'CLOSE_RTP_MODAL',
    };

    const nextState = modRTPModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_MOD_INFO_TEXT', () => {
    const expectedState = Object.assign({}, initialState, {
      modInfoData: {
        info: 'Modifications for athlete.',
        rtp: '',
      },
    });

    const action = {
      type: 'UPDATE_MOD_INFO_TEXT',
      payload: {
        text: 'Modifications for athlete.',
      },
    };

    const nextState = modInfoModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_MOD_INFO_RTP', () => {
    const expectedState = Object.assign({}, initialState, {
      modInfoData: {
        info: '',
        rtp: '2019-12-11T00:00:00+00:00',
      },
    });

    const action = {
      type: 'UPDATE_MOD_INFO_RTP',
      payload: {
        rtp: moment('2019-12-11').toDate(),
      },
    };

    const nextState = modInfoModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });
});

describe('Athlete Availability List - treatmentSessionModal reducer', () => {
  const defaultState = {
    isModalOpen: false,
    athlete: {
      fullname: '',
      id: null,
    },
    treatmentSession: {
      user_id: 1234,
      timezone: 'Europe/Dublin',
      title: 'Treatment Note',
      treatments_attributes: [
        {
          treatment_modality_id: null,
          duration: null,
          reason: null,
          issue_type: null,
          issue_id: null,
          treatment_body_areas_attributes: [],
          note: '',
        },
      ],
      annotation_attributes: {
        content: '',
        attachments_attributes: [],
      },
    },
    unUploadedFiles: [],
    staticData: {
      bodyAreaOptions: [
        {
          id: 123,
          name: 'Arm',
          isGroupOption: true,
        },
        {
          id: 1234,
          name: 'Bicep',
          isGroupOption: false,
        },
      ],
      treatmentModalityOptions: [
        {
          key_name: 'modality_one',
          name: 'Modality One',
          isGroupOption: true,
        },
        {
          key_name: 'modality_two',
          name: 'Modality Two',
          isGroupOption: false,
        },
      ],
      reasonOptions: [
        {
          id: 'broken_arm',
          name: 'Broken Arm [Left]',
          isGroupOption: true,
        },
        {
          id: 'sore_head',
          name: 'Sore Head [N/A]',
          isGroupOption: false,
        },
      ],
      users: [{ id: 999, name: 'test' }],
    },
  };

  const dummyFileAttachment = {
    lastModified: 1542706027020,
    lastModifiedDate: '2019-06-25T23:00:00Z',
    name: 'sample.csv',
    size: 5000, // Bytes
    type: 'text/csv',
    _relativePath: '',
  };

  it('returns correct state on OPEN_TREATMENT_MODAL', () => {
    const expectedState = Object.assign({}, defaultState, {
      athlete: {
        fullname: 'Jon Doe',
        id: 1234,
      },
      isModalOpen: true,
      treatmentSession: {
        ...defaultState.treatmentSession,
        athlete_id: 1234,
      },
    });

    const action = {
      type: 'OPEN_TREATMENT_MODAL',
      payload: {
        athlete: {
          fullname: 'Jon Doe',
          id: 1234,
        },
      },
    };

    const nextState = treatmentSessionModal(defaultState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on CLOSE_TREATMENT_SESSION_MODAL', () => {
    const initialState = {
      ...defaultState,
      athlete: {
        fullname: 'Jon Doe',
        id: 1234,
      },
    };
    const expectedState = Object.assign({}, initialState, {
      athlete: {
        fullname: '',
        id: null,
      },
      isModalOpen: false,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            treatment_modality_id: null,
            duration: null,
            reason: null,
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
        annotation_attributes: {
          content: '',
          attachments_attributes: [],
        },
        athlete_id: null,
      },
      unUploadedFiles: [],
      staticData: {
        ...initialState.staticData,
        bodyAreaOptions: [],
        treatmentModalityOptions: [],
      },
    });

    const action = {
      type: 'CLOSE_TREATMENT_SESSION_MODAL',
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_TREATMENT_SESSION_STATIC_DATA', () => {
    const dummyStaticData = {
      issues_options: [
        {
          isGroupOption: true,
          key_name: 'Open Injuries',
          name: 'Open Injuries',
        },
        {
          description: '(Ongoing since Sep  1, 2019)',
          key_name:
            '{"reason":"issue","issue_type":"InjuryOccurrence","issue_id":44010}',
          name: 'Wrist/Hand 1st CMC joint instability',
        },
        {
          isGroupOption: true,
          key_name: 'Open Illnesses',
          name: 'Open Illnesses',
        },
      ],
      treatable_area_options: [
        {
          description: 'Left',
          isGroupOption: true,
          name: 'Ankle',
          value: {
            side_id: 1,
            treatable_area_id: 1,
            treatable_area_type: 'OsicsBodyArea',
          },
        },
      ],
      treatment_modality_options: [
        {
          isGroupOption: true,
          name: 'Cryotherapy/Compression',
        },
        {
          key_name: 39,
          name: 'Cold Tub',
        },
      ],
    };
    const transformedData = {
      ...dummyStaticData,
      treatable_area_options: [
        {
          description: 'Left',
          isGroupOption: true,
          name: 'Ankle',
          id: JSON.stringify({
            side_id: 1,
            treatable_area_id: 1,
            treatable_area_type: 'OsicsBodyArea',
          }),
        },
      ],
    };
    const initialState = {
      ...defaultState,
      staticData: {
        ...defaultState.staticData,
        bodyAreaOptions: [],
        treatmentModalityOptions: [],
      },
    };
    const expectedState = Object.assign({}, initialState, {
      staticData: {
        ...initialState.staticData,
        bodyAreaOptions: transformedData.treatable_area_options,
        treatmentModalityOptions: transformedData.treatment_modality_options,
        reasonOptions: transformedData.issues_options,
      },
    });

    const action = {
      type: 'UPDATE_TREATMENT_SESSION_STATIC_DATA',
      payload: {
        responseOptions: dummyStaticData,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on ADD_TREATMENT_ATTRIBUTE when the previous modality has nothing selected', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'ADD_TREATMENT_ATTRIBUTE',
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          ...initialState.treatmentSession.treatments_attributes,
          {
            treatment_modality_id: null,
            duration: null,
            reason: null,
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
      },
    });
  });

  it('returns correct state on ADD_TREATMENT_ATTRIBUTE when the previous modality has a reason selected', () => {
    const initialState = {
      ...defaultState,
      treatmentSession: {
        ...defaultState.treatmentSession,
        treatments_attributes: [
          ...defaultState.treatmentSession.treatments_attributes,
          {
            treatment_modality_id: 144,
            duration: 120,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
      },
    };

    const action = {
      type: 'ADD_TREATMENT_ATTRIBUTE',
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          ...initialState.treatmentSession.treatments_attributes,
          {
            treatment_modality_id: null,
            duration: null,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
      },
    });
  });

  it('returns correct state on ADD_TREATMENT_ATTRIBUTES when initial modality not picked', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
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
            note: '',
          },
          {
            treatment_modality_id: 2,
            duration: null,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            treatment_modality_id: 37,
            duration: 20,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
          {
            treatment_modality_id: 2,
            duration: null,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
      },
    });
  });

  it('returns correct state on ADD_TREATMENT_ATTRIBUTES when initial modality is picked', () => {
    const initialState = {
      ...defaultState,
      treatmentSession: {
        ...defaultState.treatmentSession,
        treatments_attributes: [
          {
            treatment_modality_id: 144,
            duration: 120,
            reason: 'prevention',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
      },
    };

    const action = {
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
            note: '',
          },
          {
            treatment_modality_id: 2,
            duration: null,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            treatment_modality_id: 144,
            duration: 120,
            reason: 'prevention',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
          {
            treatment_modality_id: 37,
            duration: 20,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
          {
            treatment_modality_id: 2,
            duration: null,
            reason: 'general',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
      },
    });
  });

  it('returns correct state on REMOVE_TREATMENT_ATTRIBUTE', () => {
    const initialState = {
      ...defaultState,
      treatmentSession: {
        ...defaultState.treatmentSession,
        treatments_attributes: [
          {
            ...defaultState.treatmentSession.treatments_attributes[0],
          },
          {
            treatment_modality_id: 12,
            duration: '45',
            reason: 'prevention',
            issue_type: null,
            issue_id: null,
            treatment_body_areas_attributes: [],
            note: '',
          },
        ],
      },
    };

    const action = {
      type: 'REMOVE_TREATMENT_ATTRIBUTE',
      payload: {
        index: 1,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            ...initialState.treatmentSession.treatments_attributes[0],
          },
        ],
      },
    });
  });

  it('returns correct state on SELECT_BODY_AREA', () => {
    const initialState = {
      ...defaultState,
      treatmentSession: {
        ...defaultState.treatmentSession,
        treatments_attributes: [
          {
            ...defaultState.treatmentSession.treatments_attributes[0],
            treatment_body_areas_attributes: [
              {
                treatable_area_type: 'BodyPart',
                treatable_area_id: 262,
                side_id: 1,
              },
            ],
          },
        ],
      },
    };

    const action = {
      type: 'SELECT_BODY_AREA',
      payload: {
        bodyArea: JSON.parse(
          '{"treatable_area_type":"BodyPart","treatable_area_id":266,"side_id":2}'
        ),
        bodyAreaParent: JSON.parse(
          '{"treatable_area_type":"OsicsBodyArea","treatable_area_id":1,"side_id":2}'
        ),
        index: 0,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            ...initialState.treatmentSession.treatments_attributes[0],
            treatment_body_areas_attributes: [
              {
                treatable_area_type: 'BodyPart',
                treatable_area_id: 262,
                side_id: 1,
              },
              {
                treatable_area_type: 'BodyPart',
                treatable_area_id: 266,
                side_id: 2,
              },
              {
                treatable_area_type: 'OsicsBodyArea',
                treatable_area_id: 1,
                side_id: 2,
              },
            ],
          },
        ],
      },
    });
  });

  it('returns correct state on SELECT_PRACTITIONER', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'SELECT_PRACTITIONER',
      payload: {
        practitionerId: 555,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        user_id: 555,
      },
    });
  });

  it('returns correct state on SELECT_TIMEZONE', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'SELECT_TIMEZONE',
      payload: {
        timezone: 'Copenhagen/Europe',
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        timezone: 'Copenhagen/Europe',
      },
    });
  });

  it('returns correct state on SELECT_TREATMENT_MODALITY', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'SELECT_TREATMENT_MODALITY',
      payload: {
        modalityId: 1,
        index: 0,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            ...initialState.treatmentSession.treatments_attributes[0],
            treatment_modality_id: 1,
          },
        ],
      },
    });
  });

  it('returns correct state on SELECT_TREATMENT_REASON', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'SELECT_TREATMENT_REASON',
      payload: {
        reasonObj: {
          reason: 'issue',
          issue_type: 'InjuryOccurrence',
          issue_id: 12345,
        },
        index: 0,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            ...initialState.treatmentSession.treatments_attributes[0],
            reason: 'issue',
            issue_type: 'InjuryOccurrence',
            issue_id: 12345,
          },
        ],
      },
    });
  });

  it('returns correct state on UPDATE_TREATMENT_NOTE_ATTRIBUTE', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'UPDATE_TREATMENT_NOTE_ATTRIBUTE',
      payload: {
        text: 'My note',
        index: 0,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            ...initialState.treatmentSession.treatments_attributes[0],
            note: 'My note',
          },
        ],
      },
    });
  });

  it('returns correct state on SET_TREATMENT_DURATION', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'SET_TREATMENT_DURATION',
      payload: {
        duration: '45',
        index: 0,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            ...initialState.treatmentSession.treatments_attributes[0],
            duration: '45',
          },
        ],
      },
    });
  });

  it('returns correct state on UNSELECT_PARENT_BODY_AREA', () => {
    const initialState = {
      ...defaultState,
      treatmentSession: {
        ...defaultState.treatmentSession,
        treatments_attributes: [
          {
            ...defaultState.treatmentSession.treatments_attributes[0],
            treatment_body_areas_attributes: [
              {
                treatable_area_type: 'BodyPart',
                treatable_area_id: 262,
                side_id: 1,
              },
              {
                treatable_area_type: 'BodyPart',
                treatable_area_id: 265,
                side_id: 1,
              },
              {
                treatable_area_type: 'BodyPart',
                treatable_area_id: 267,
                side_id: 1,
              },
              {
                treatable_area_type: 'OsicsBodyArea',
                treatable_area_id: 1,
                side_id: 1,
              },
            ],
          },
        ],
      },
    };

    const action = {
      type: 'UNSELECT_PARENT_BODY_AREA',
      payload: {
        bodyAreas: [
          '{"treatable_area_type":"BodyPart","treatable_area_id":262,"side_id":1}',
          '{"treatable_area_type":"BodyPart","treatable_area_id":265,"side_id":1}',
          '{"treatable_area_type":"BodyPart","treatable_area_id":267,"side_id":1}',
          '{"treatable_area_type":"OsicsBodyArea","treatable_area_id":1,"side_id":1}',
        ],
        index: 0,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        treatments_attributes: [
          {
            ...initialState.treatmentSession.treatments_attributes[0],
            treatment_body_areas_attributes: [],
          },
        ],
      },
    });
  });

  it('returns correct state on UPDATE_TREATMENT_FILES', () => {
    const initialState = {
      ...defaultState,
    };
    const files = [{ ...dummyFileAttachment }];
    const action = {
      type: 'UPDATE_TREATMENT_FILES',
      payload: {
        files,
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      unUploadedFiles: files,
    });
  });

  it('returns correct state on UPDATE_TREATMENT_NOTE_TEXT', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'UPDATE_TREATMENT_NOTE_TEXT',
      payload: {
        text: 'Blah',
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        annotation_attributes: {
          ...initialState.treatmentSession.annotation_attributes,
          content: 'Blah',
        },
      },
    });
  });

  it('returns correct state on UPDATE_TREATMENT_NOTE_RICH_TEXT', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'UPDATE_TREATMENT_NOTE_RICH_TEXT',
      payload: {
        content: 'Blah',
      },
    };

    const nextState = treatmentSessionModal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      treatmentSession: {
        ...initialState.treatmentSession,
        annotation_attributes: {
          ...initialState.treatmentSession.annotation_attributes,
          content: 'Blah',
        },
      },
    });
  });
});

describe('Athlete Availability List - fileUploadToast reducer', () => {
  const defaultState = {
    fileOrder: [],
    fileMap: {},
  };

  const dummyFileAttachment = {
    file: {
      lastModified: 1542706027020,
      lastModifiedDate: '2019-06-25T23:00:00Z',
      name: 'sample.csv',
      size: 5000,
      type: 'text/csv',
      webkitRelativePath: '',
    },
    filename: 'sample.csv',
    fileSize: 5000,
    fileType: 'text/csv',
  };

  it('returns correct state on CONFIRM_FILE_UPLOAD_FAILURE', () => {
    const initialState = {
      ...defaultState,
      fileOrder: [4444],
      fileMap: {
        4444: {
          text: 'MRI Scan (zx123MRIscan_123.jpg)',
          subText: '100Kb',
          status: 'PROGRESS',
          id: 4444,
        },
      },
    };

    const action = {
      type: 'CONFIRM_FILE_UPLOAD_FAILURE',
      payload: {
        fileId: 4444,
      },
    };

    const nextState = fileUploadToast(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      fileOrder: [4444],
      fileMap: {
        4444: {
          text: 'MRI Scan (zx123MRIscan_123.jpg)',
          subText: '100Kb',
          status: 'ERROR',
          id: 4444,
        },
      },
    });
  });

  it('returns correct state on TRIGGER_FILE_UPLOAD_FAILURE', () => {
    const initialState = {
      ...defaultState,
      fileOrder: [4444],
      fileMap: {
        4444: {
          text: 'MRI Scan (zx123MRIscan_123.jpg)',
          subText: '100Kb',
          status: 'PROGRESS',
          id: 4444,
        },
      },
    };

    const action = {
      type: 'TRIGGER_FILE_UPLOAD_FAILURE',
      payload: {
        fileId: 4444,
      },
    };

    const nextState = fileUploadToast(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      fileOrder: [4444],
      fileMap: {
        4444: {
          text: 'MRI Scan (zx123MRIscan_123.jpg)',
          subText: '100Kb',
          status: 'ERROR',
          id: 4444,
        },
      },
    });
  });

  it('returns correct state on FINISH_FILE_UPLOAD', () => {
    const initialState = {
      ...defaultState,
      fileOrder: [4444],
      fileMap: {
        4444: {
          text: 'MRI Scan (zx123MRIscan_123.jpg)',
          subText: '100Kb',
          status: 'PROGRESS',
          id: 4444,
        },
      },
    };

    const action = {
      type: 'FINISH_FILE_UPLOAD',
      payload: {
        fileId: 4444,
      },
    };

    const nextState = fileUploadToast(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      fileOrder: [4444],
      fileMap: {
        4444: {
          text: 'MRI Scan (zx123MRIscan_123.jpg)',
          subText: '100Kb',
          status: 'SUCCESS',
          id: 4444,
        },
      },
    });
  });

  it('returns correct state on TRIGGER_TOAST_DISPLAY_PROGRESS', () => {
    const initialState = {
      ...defaultState,
      fileOrder: [4444],
      fileMap: {
        4444: {
          text: 'MRI Scan (zx123MRIscan_123.jpg)',
          subText: '100 Kb',
          status: 'PROGRESS',
          id: 4444,
        },
      },
    };

    const action = {
      type: 'TRIGGER_TOAST_DISPLAY_PROGRESS',
      payload: {
        fileName: dummyFileAttachment.filename,
        fileSize: dummyFileAttachment.fileSize,
        fileId: 1234,
      },
    };

    const nextState = fileUploadToast(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      fileOrder: [4444, 1234],
      fileMap: {
        1234: {
          text: dummyFileAttachment.filename,
          subText: '5.0 kB',
          status: 'PROGRESS',
          id: 1234,
        },
        4444: {
          text: 'MRI Scan (zx123MRIscan_123.jpg)',
          subText: '100 Kb',
          status: 'PROGRESS',
          id: 4444,
        },
      },
    });
  });

  it('returns correct state on CLOSE_TOAST_ITEM', () => {
    const initialState = {
      ...defaultState,
      fileOrder: [4444, 1234],
      fileMap: {
        4444: {
          text: 'MRI Scan (zx123MRIscan_123.jpg)',
          subText: '100Kb',
          status: 'SUCCESS',
          id: 4444,
        },
        1234: {
          text: 'ABCD (abcd.jpg)',
          subText: '430Kb',
          status: 'SUCCESS',
          id: 4444, // Note: Original test had a typo, assuming this ID was intended
        },
      },
    };

    const action = {
      type: 'CLOSE_TOAST_ITEM',
      payload: {
        itemId: 4444,
      },
    };

    const nextState = fileUploadToast(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      fileOrder: [1234],
      fileMap: {
        1234: {
          text: 'ABCD (abcd.jpg)',
          subText: '430Kb',
          status: 'SUCCESS',
          id: 4444,
        },
      },
    });
  });
});

describe('Athlete Availability List - diagnosticModal reducer', () => {
  const MOCK_DATE = '2020-03-27T00:00:00.000Z';
  const MOCK_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

  jest.mock('moment', () => {
    const originalMoment = jest.requireActual('moment');
    const mockMoment = (timestamp) => {
      if (timestamp) {
        return originalMoment(timestamp);
      }
      return originalMoment(MOCK_DATE);
    };
    Object.assign(mockMoment, originalMoment);
    return mockMoment;
  });

  jest.mock('@kitman/common/src/utils/dateFormatter', () => ({
    ...jest.requireActual('@kitman/common/src/utils/dateFormatter'),
    dateTransferFormat: MOCK_DATE_FORMAT,
  }));

  const dummyAthleteData = athleteData();
  const date = new Date('Nov 20 2018');
  const dummyAttachment = {
    lastModified: 1542706027020,
    lastModifiedDate: date,
    name: 'sample.csv',
    size: 124625,
    type: 'text/csv',
    webkitRelativePath: '',
  };
  const initialState = {
    athlete: null,
    isModalOpen: false,
    athleteInjuries: [],
    athleteIllnesses: [],
    attachments: [],
    diagnosticData: {
      diagnostic_date: null,
      diagnostic_type: null,
      injury_ids: [],
      illness_ids: [],
      attachment_ids: [],
    },
  };

  it('returns correct state on OPEN_DIAGNOSTIC_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: dummyAthleteData[0],
      isModalOpen: true,
    });

    const action = {
      type: 'OPEN_DIAGNOSTIC_MODAL',
      payload: {
        athlete: dummyAthleteData[0],
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on CLOSE_DIAGNOSTIC_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      athlete: null,
      isModalOpen: false,
      diagnosticData: {
        diagnostic_date: null,
        diagnostic_type: null,
        injury_ids: [],
        illness_ids: [],
        attachment_ids: [],
        medication_completed: false,
        medication_completed_at: null,
        medication_dosage: null,
        medication_frequency: null,
        medication_notes: null,
        medication_type: null,
        covid_test_date: null,
        covid_test_type: null,
        covid_result: null,
        covid_reference: null,
        covid_antibody_test_date: null,
        covid_antibody_test_type: null,
        covid_antibody_result: null,
        covid_antibody_reference: null,
        annotation_content: null,
        restrict_access_to: null,
      },
    });

    const action = {
      type: 'CLOSE_DIAGNOSTIC_MODAL',
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_ISSUES', () => {
    const expectedState = Object.assign({}, initialState, {
      athleteInjuries: [{ id: 1234 }],
      athleteIllnesses: [{ id: 5678 }],
    });

    const action = {
      type: 'UPDATE_DIAGNOSTIC_ISSUES',
      payload: {
        injuries: [{ id: 1234 }],
        illnesses: [{ id: 5678 }],
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_ATTACHMENTS', () => {
    const file = { ...dummyAttachment };
    const expectedState = Object.assign({}, initialState, {
      attachments: [file],
    });

    const action = {
      type: 'UPDATE_DIAGNOSTIC_ATTACHMENTS',
      payload: {
        file,
        index: 0,
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_ATTACHMENT_IDS', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        attachment_ids: [1234],
      },
    };

    const action = {
      type: 'UPDATE_ATTACHMENT_IDS',
      payload: {
        attachmentId: 1234,
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_TYPE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        diagnostic_type: 1234,
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_TYPE',
      payload: {
        typeId: 1234,
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_DATE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        diagnostic_date: '2020-03-27T00:00:00.000Z',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_DATE',
      payload: {
        date: '2020-03-27T00:00:00.000Z',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_RELEVANT_DIAGNOSTIC_INJURIES', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        injury_ids: [1234],
      },
    };

    const action = {
      type: 'UPDATE_RELEVANT_DIAGNOSTIC_INJURIES',
      payload: {
        issueId: 1234,
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_RELEVANT_DIAGNOSTIC_ILLNESSES', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        illness_ids: [1234],
      },
    };

    const action = {
      type: 'UPDATE_RELEVANT_DIAGNOSTIC_ILLNESSES',
      payload: {
        issueId: 1234,
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_MEDICATION_TYPE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        medication_type: 'pills',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_TYPE',
      payload: {
        type: 'pills',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_MEDICATION_DOSAGE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        medication_dosage: '1 pill',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_DOSAGE',
      payload: {
        dosage: '1 pill',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_MEDICATION_FREQUENCY', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        medication_frequency: 'twice a day',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_FREQUENCY',
      payload: {
        frequency: 'twice a day',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_MEDICATION_NOTES', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        medication_notes: 'for headaches',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_NOTES',
      payload: {
        notes: 'for headaches',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_MEDICATION_COMPLETED', () => {
    const formattedDate = moment().format(DateFormatter.dateTransferFormat);

    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        medication_completed: true,
        medication_completed_at: formattedDate,
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_COMPLETED',
      payload: {
        isCompleted: true,
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_COVID_TEST_DATE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        covid_test_date: '2020-05-08T13:22:00Z',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_COVID_TEST_DATE',
      payload: {
        covidTestDate: '2020-05-08T13:22:00Z',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_COVID_TEST_TYPE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        covid_test_type: 'Test type',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_COVID_TEST_TYPE',
      payload: {
        covidTestType: 'Test type',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_COVID_RESULT', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        covid_result: 'Positive',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_COVID_RESULT',
      payload: {
        covidResult: 'Positive',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_COVID_REFERENCE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        covid_reference: 'Ref',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_COVID_REFERENCE',
      payload: {
        covidReference: 'Ref',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_DATE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        covid_antibody_test_date: '2020-05-08T13:22:00Z',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_DATE',
      payload: {
        covidAntibodyTestDate: '2020-05-08T13:22:00Z',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_TYPE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        covid_antibody_test_type: 'Test type',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_TYPE',
      payload: {
        covidAntibodyTestType: 'Test type',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_COVID_ANTIBODY_RESULT', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        covid_antibody_result: 'Test result',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_RESULT',
      payload: {
        covidAntibodyResult: 'Test result',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_COVID_ANTIBODY_REFERENCE', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        covid_antibody_reference: 'Ref',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_REFERENCE',
      payload: {
        covidAntibodyReference: 'Ref',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_ANNOTATION_CONTENT', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        annotation_content: 'My note',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_ANNOTATION_CONTENT',
      payload: {
        annotationContent: 'My note',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_DIAGNOSTIC_RESTRICT_ACCESS_TO', () => {
    const expectedState = {
      ...initialState,
      diagnosticData: {
        ...initialState.diagnosticData,
        restrict_access_to: 'Doctors',
      },
    };

    const action = {
      type: 'UPDATE_DIAGNOSTIC_RESTRICT_ACCESS_TO',
      payload: {
        restrictAccessTo: 'Doctors',
      },
    };

    const nextState = diagnosticModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });
});

describe('Athlete Availability List - injuryUploadModal reducer', () => {
  const initialState = {
    isModalOpen: false,
    file: null,
    errors: {
      messages: null,
      totalRows: null,
      skippedRows: null,
    },
  };

  it('returns correct state on OPEN_INJURY_UPLOAD_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      isModalOpen: true,
    });

    const action = {
      type: 'OPEN_INJURY_UPLOAD_MODAL',
    };

    const nextState = injuryUploadModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on CLOSE_INJURY_UPLOAD_MODAL', () => {
    const expectedState = Object.assign({}, initialState, {
      isModalOpen: false,
      errors: {
        messages: null,
        totalRows: null,
        skippedRows: null,
      },
    });

    const action = {
      type: 'CLOSE_INJURY_UPLOAD_MODAL',
    };

    const nextState = injuryUploadModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_INJURY_UPLOAD_FILE', () => {
    const date = new Date('Nov 20 2018');
    const file = {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 124625,
      type: 'text/csv',
      webkitRelativePath: '',
    };
    const expectedState = Object.assign({}, initialState, {
      file,
    });

    const action = {
      type: 'UPDATE_INJURY_UPLOAD_FILE',
      payload: {
        file,
      },
    };

    const nextState = injuryUploadModal(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on UPDATE_INJURY_UPLOAD_FILE when there were errors before', () => {
    const date = new Date('Nov 20 2018');
    const file = {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 124625,
      type: 'text/csv',
      webkitRelativePath: '',
    };
    const stateWithErrors = Object.assign({}, initialState, {
      file: null,
      errors: {
        messages: ['Row 1', 'Clubid cannot be blank'],
        totalRows: 1,
        skippedRows: 1,
      },
    });
    const expectedState = Object.assign({}, stateWithErrors, {
      file,
      errors: {
        messages: null,
        totalRows: null,
        skippedRows: null,
      },
    });

    const action = {
      type: 'UPDATE_INJURY_UPLOAD_FILE',
      payload: {
        file,
      },
    };

    const nextState = injuryUploadModal(stateWithErrors, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on SAVE_UPLOAD_INJURY_ERROR', () => {
    const date = new Date('Nov 20 2018');
    const file = {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 124625,
      type: 'text/csv',
      webkitRelativePath: '',
    };
    const modifiedState = Object.assign({}, initialState, {
      file,
    });
    const expectedState = Object.assign({}, modifiedState, {
      errors: {
        messages: [
          'Row 1',
          'Clubid cannot be blank',
          'Injuryoccurrenceid cannot be blank',
        ],
        totalRows: 1,
        skippedRows: 1,
      },
    });

    const action = {
      type: 'SAVE_UPLOAD_INJURY_ERROR',
      payload: {
        errors: [
          'Row 1',
          'Clubid cannot be blank',
          'Injuryoccurrenceid cannot be blank',
        ],
        totalRows: 1,
        skippedRows: 1,
      },
    };

    const nextState = injuryUploadModal(modifiedState, action);
    expect(nextState).toEqual(expectedState);
  });
});
