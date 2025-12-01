import { server, rest } from '@kitman/services/src/mocks/server';
import athleteData from '../../utils/dummyAthleteData';
import {
  openAddAbsenceModal,
  closeAddAbsenceModal,
  updateAbsenceReasonType,
  updateAbsenceFromDate,
  updateAbsenceToDate,
  openAddNoteModal,
  toggleAthleteFilters,
  updateFilterOptions,
  hideAppStatus,
  serverRequest,
  openModInfoModal,
  closeModInfoModal,
  openRTPModal,
  closeRTPModal,
  updateModInfoText,
  updateModInfoRtp,
  openInjuryUploadModal,
  closeInjuryUploadModal,
  updateInjuryUploadFile,
  updateAthleteModInfo,
  openDiagnosticModal,
  closeDiagnosticModal,
  updateDiagnosticIssues,
  updateDiagnosticAttachments,
  updateAttachmentIds,
  updateDiagnosticType,
  updateDiagnosticDate,
  updateRelevantDiagnosticInjuries,
  updateRelevantDiagnosticIllnesses,
  updateDiagnosticMedicationType,
  updateDiagnosticMedicationDosage,
  updateDiagnosticMedicationFrequency,
  updateDiagnosticMedicationNotes,
  updateDiagnosticMedicationCompleted,
  openTreatmentModal,
  updateDiagnosticCovidTestDate,
  updateDiagnosticCovidTestType,
  updateDiagnosticCovidResult,
  updateDiagnosticCovidReference,
  updateDiagnosticCovidAntibodyTestDate,
  updateDiagnosticCovidAntibodyTestType,
  updateDiagnosticCovidAntibodyResult,
  updateDiagnosticCovidAntibodyReference,
  updateTreatmentSessionStaticData,
  updateDiagnosticAnnotationContent,
  updateDiagnosticRestrictAccessTo,
  saveAbsence,
  saveAthleteAvailabilityModInfo,
  saveUploadInjury,
  getDiagnosticIssues,
  serverRequestForDiagnosticIssues,
  uploadAttachments,
  saveDiagnostic,
  confirmFileUpload,
  populateTreatmentSessionModal,
  saveTreatmentSession,
} from '../actions';
import injuryResponse from '../../utils/dummyInjuryResponse';
import illnessResponse from '../../utils/dummyIllnessResponse';

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('Athlete Availability List Actions', () => {
  const athletes = athleteData();
  const date = new Date('Nov 20 2018');
  const dummyAttachment = {
    file: {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 124625,
      type: 'text/csv',
      webkitRelativePath: '',
    },
    filename: 'sample.csv',
    fileSize: 124625,
    fileType: 'text/csv',
  };

  test('has the correct action OPEN_ADD_ABSENCE_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_ABSENCE_MODAL',
      payload: {
        athlete: athletes[0],
      },
    };

    expect(openAddAbsenceModal(athletes[0])).toEqual(expectedAction);
  });

  test('has the correct action CLOSE_ADD_ABSENCE_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_ABSENCE_MODAL',
    };

    expect(closeAddAbsenceModal()).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_ABSENCE_REASON_TYPE', () => {
    const expectedAction = {
      type: 'UPDATE_ABSENCE_REASON_TYPE',
      payload: {
        reasonId: 27,
      },
    };

    expect(updateAbsenceReasonType(27)).toEqual(expectedAction);
  });

  test('has the correct action OPEN_TREATMENT_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_TREATMENT_MODAL',
      payload: {
        athlete: {
          fullname: 'Jon Doe',
          id: 1234,
        },
      },
    };

    expect(
      openTreatmentModal({
        fullname: 'Jon Doe',
        id: 1234,
      })
    ).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_TREATMENT_SESSION_STATIC_DATA', () => {
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
    const expectedAction = {
      type: 'UPDATE_TREATMENT_SESSION_STATIC_DATA',
      payload: {
        responseOptions: dummyStaticData,
      },
    };

    expect(updateTreatmentSessionStaticData(dummyStaticData)).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_ABSENCE_FROM_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_ABSENCE_FROM_DATE',
      payload: {
        date: '03/04/2019',
      },
    };

    expect(updateAbsenceFromDate('03/04/2019')).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_ABSENCE_TO_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_ABSENCE_TO_DATE',
      payload: {
        date: '03/04/2019',
      },
    };

    expect(updateAbsenceToDate('03/04/2019')).toEqual(expectedAction);
  });

  test('has the correct action OPEN_ADD_NOTE_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_NOTE_MODAL',
      payload: {
        athlete: athletes[0],
      },
    };

    expect(openAddNoteModal(athletes[0])).toEqual(expectedAction);
  });

  test('has the correct action OPEN_MOD_INFO_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_MOD_INFO_MODAL',
      payload: {
        athlete: athletes[0],
      },
    };

    expect(openModInfoModal(athletes[0])).toEqual(expectedAction);
  });

  test('has the correct action CLOSE_MOD_INFO_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_MOD_INFO_MODAL',
    };

    expect(closeModInfoModal()).toEqual(expectedAction);
  });

  test('has the correct action OPEN_RTP_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_RTP_MODAL',
      payload: {
        athlete: athletes[0],
      },
    };

    expect(openRTPModal(athletes[0])).toEqual(expectedAction);
  });

  test('has the correct action CLOSE_RTP_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_RTP_MODAL',
    };

    expect(closeRTPModal()).toEqual(expectedAction);
  });

  test('has the correct action OPEN_DIAGNOSTIC_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_DIAGNOSTIC_MODAL',
      payload: {
        athlete: athletes[0],
      },
    };

    expect(openDiagnosticModal(athletes[0])).toEqual(expectedAction);
  });

  test('has the correct action CLOSE_DIAGNOSTIC_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_DIAGNOSTIC_MODAL',
    };

    expect(closeDiagnosticModal()).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_ISSUES', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_ISSUES',
      payload: {
        injuries: [],
        illnesses: [],
      },
    };

    expect(updateDiagnosticIssues([], [])).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_ATTACHMENTS', () => {
    const file = { ...dummyAttachment };
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_ATTACHMENTS',
      payload: {
        file,
        index: 0,
      },
    };

    expect(updateDiagnosticAttachments(file, 0)).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_ATTACHMENT_IDS', () => {
    const expectedAction = {
      type: 'UPDATE_ATTACHMENT_IDS',
      payload: {
        attachmentId: 1234,
      },
    };

    expect(updateAttachmentIds(1234)).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_TYPE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_TYPE',
      payload: {
        typeId: 1234,
      },
    };

    expect(updateDiagnosticType(1234)).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_DATE',
      payload: {
        date: '2020-03-27T00:00:00.000Z',
      },
    };

    expect(updateDiagnosticDate('2020-03-27T00:00:00.000Z')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_RELEVANT_DIAGNOSTIC_INJURIES', () => {
    const expectedAction = {
      type: 'UPDATE_RELEVANT_DIAGNOSTIC_INJURIES',
      payload: {
        issueId: 1234,
      },
    };

    expect(updateRelevantDiagnosticInjuries(1234)).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_RELEVANT_DIAGNOSTIC_ILLNESSES', () => {
    const expectedAction = {
      type: 'UPDATE_RELEVANT_DIAGNOSTIC_ILLNESSES',
      payload: {
        issueId: 1234,
      },
    };

    expect(updateRelevantDiagnosticIllnesses(1234)).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_MEDICATION_TYPE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_TYPE',
      payload: {
        type: 'pills',
      },
    };

    expect(updateDiagnosticMedicationType('pills')).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_MEDICATION_DOSAGE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_DOSAGE',
      payload: {
        dosage: 'one pill',
      },
    };

    expect(updateDiagnosticMedicationDosage('one pill')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_DIAGNOSTIC_MEDICATION_FREQUENCY', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_FREQUENCY',
      payload: {
        frequency: 'twice a day',
      },
    };

    expect(updateDiagnosticMedicationFrequency('twice a day')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_DIAGNOSTIC_MEDICATION_NOTES', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_NOTES',
      payload: {
        notes: 'for headaches',
      },
    };

    expect(updateDiagnosticMedicationNotes('for headaches')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_DIAGNOSTIC_MEDICATION_COMPLETED', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_MEDICATION_COMPLETED',
      payload: {
        isCompleted: true,
      },
    };

    expect(updateDiagnosticMedicationCompleted(true)).toEqual(expectedAction);
  });

  test('has the correct action OPEN_INJURY_UPLOAD_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_INJURY_UPLOAD_MODAL',
    };

    expect(openInjuryUploadModal()).toEqual(expectedAction);
  });

  test('has the correct action CLOSE_INJURY_UPLOAD_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_INJURY_UPLOAD_MODAL',
    };

    expect(closeInjuryUploadModal()).toEqual(expectedAction);
  });

  test('has the correct action TOGGLE_ATHLETE_FILTERS', () => {
    const expectedAction = {
      type: 'TOGGLE_ATHLETE_FILTERS',
      payload: {
        isFilterShown: true,
      },
    };

    expect(toggleAthleteFilters(true)).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_FILTER_OPTIONS', () => {
    const expectedAction = {
      type: 'UPDATE_FILTER_OPTIONS',
      payload: {
        groupBy: 'position',
        alarmFilters: null,
        athleteFilters: [1234, 4563],
      },
    };

    expect(updateFilterOptions('position', null, [1234, 4563])).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_MOD_INFO_TEXT', () => {
    const expectedAction = {
      type: 'UPDATE_MOD_INFO_TEXT',
      payload: {
        text: 'Modifications for athlete.',
      },
    };

    expect(updateModInfoText('Modifications for athlete.')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_MOD_INFO_RTP', () => {
    const expectedAction = {
      type: 'UPDATE_MOD_INFO_RTP',
      payload: {
        rtp: '03/04/2019',
      },
    };

    expect(updateModInfoRtp('03/04/2019')).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_INJURY_UPLOAD_FILE', () => {
    const file = { ...dummyAttachment };
    const expectedAction = {
      type: 'UPDATE_INJURY_UPLOAD_FILE',
      payload: {
        file,
      },
    };

    expect(updateInjuryUploadFile(file)).toEqual(expectedAction);
  });

  test('has the correct action HIDE_APP_STATUS', () => {
    const expectedAction = {
      type: 'HIDE_APP_STATUS',
    };

    expect(hideAppStatus()).toEqual(expectedAction);
  });

  test('has the correct action SERVER_REQUEST', () => {
    const expectedAction = {
      type: 'SERVER_REQUEST',
    };

    expect(serverRequest()).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_ATHLETE_MODINFO', () => {
    const expectedAction = {
      type: 'UPDATE_ATHLETE_MODINFO',
      payload: {
        athleteId: 1644,
        info: 'Mod/Info text',
        rtp: '17 Oct 2019',
      },
    };

    expect(updateAthleteModInfo(1644, 'Mod/Info text', '17 Oct 2019')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_DIAGNOSTIC_COVID_TEST_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_COVID_TEST_DATE',
      payload: {
        covidTestDate: '2020-05-08T13:22:00Z',
      },
    };

    expect(updateDiagnosticCovidTestDate('2020-05-08T13:22:00Z')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_DIAGNOSTIC_COVID_TEST_TYPE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_COVID_TEST_TYPE',
      payload: {
        covidTestType: 'Test type',
      },
    };

    expect(updateDiagnosticCovidTestType('Test type')).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_COVID_RESULT', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_COVID_RESULT',
      payload: {
        covidResult: 'Positive',
      },
    };

    expect(updateDiagnosticCovidResult('Positive')).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_COVID_REFERENCE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_COVID_REFERENCE',
      payload: {
        covidReference: 'Ref',
      },
    };

    expect(updateDiagnosticCovidReference('Ref')).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_DATE',
      payload: {
        covidAntibodyTestDate: '2020-05-08T13:22:00Z',
      },
    };

    expect(
      updateDiagnosticCovidAntibodyTestDate('2020-05-08T13:22:00Z')
    ).toEqual(expectedAction);
  });

  test('has the correct action UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_TYPE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_TYPE',
      payload: {
        covidAntibodyTestType: 'Test type',
      },
    };

    expect(updateDiagnosticCovidAntibodyTestType('Test type')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_DIAGNOSTIC_COVID_ANTIBODY_RESULT', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_RESULT',
      payload: {
        covidAntibodyResult: 'Test result',
      },
    };

    expect(updateDiagnosticCovidAntibodyResult('Test result')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_DIAGNOSTIC_COVID_ANTIBODY_REFERENCE', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_REFERENCE',
      payload: {
        covidAntibodyReference: 'Ref',
      },
    };

    expect(updateDiagnosticCovidAntibodyReference('Ref')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_DIAGNOSTIC_ANNOTATION_CONTENT', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_ANNOTATION_CONTENT',
      payload: {
        annotationContent: 'My note',
      },
    };

    expect(updateDiagnosticAnnotationContent('My note')).toEqual(
      expectedAction
    );
  });

  test('has the correct action UPDATE_DIAGNOSTIC_RESTRICT_ACCESS_TO', () => {
    const expectedAction = {
      type: 'UPDATE_DIAGNOSTIC_RESTRICT_ACCESS_TO',
      payload: {
        restrictAccessTo: 'Psych Team',
      },
    };

    expect(updateDiagnosticRestrictAccessTo('Psych Team')).toEqual(
      expectedAction
    );
  });

  describe('saveAbsence action', () => {
    const originalLocation = window.location; // Store the original

    beforeAll(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: { ...originalLocation, reload: jest.fn() },
      });
    });

    afterAll(() => {
      // Restore the original
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: originalLocation,
      });
    });

    beforeEach(() => {
      document.head.innerHTML = '<meta name="csrf-token" content="test-token">';
      // Reset the mock before each test if needed
      window.location.reload.mockClear();
    });

    test('dispatches SERVER_REQUEST_SUCCESS on successful request', async () => {
      const dummyAbsenceData = {
        reason_id: 26,
        from: '2018-09-11T10:35:54.000+01:00',
        to: '',
        athlete_id: 1,
      };

      server.use(
        rest.post('http://localhost/athletes/1/absences', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        addAbsenceModal: {
          athlete: { id: 1 },
          absenceData: dummyAbsenceData,
        },
      }));

      await saveAbsence(1, dummyAbsenceData)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST' });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST_SUCCESS' });
    });

    test('dispatches SERVER_REQUEST_ERROR on failed request', async () => {
      const dummyAbsenceData = {
        reason_id: 26,
        from: '2018-09-11T10:35:54.000+01:00',
        to: '',
        athlete_id: 1,
      };

      server.use(
        rest.post('http://localhost/athletes/1/absences', (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({ responseJSON: { errors: [] } })
          );
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        addAbsenceModal: {
          athlete: { id: 1 },
          absenceData: dummyAbsenceData,
        },
      }));

      await saveAbsence(1, dummyAbsenceData)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST' });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST_ERROR' });
    });
  });

  describe('saveAthleteAvailabilityModInfo action', () => {
    const dummyModInfoData = {
      rtp: '2018-09-11T10:35:54.000+01:00',
      text: 'This is a note.',
    };

    const state = {
      modInfoModal: {
        athlete: athletes[0],
        isModalOpen: false,
        modInfoData: dummyModInfoData,
      },
    };

    test('dispatches SAVE_ATHLETE_AVAILABILITY_MOD_INFO_SUCCESS on successful request', async () => {
      server.use(
        rest.post(
          `http://localhost/athletes/availability/${athletes[0].id}/quick_update`,
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({}));
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);

      await saveAthleteAvailabilityModInfo(athletes[0].id, dummyModInfoData)(
        dispatch,
        getState
      );

      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST' });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SAVE_ATHLETE_AVAILABILITY_MOD_INFO_SUCCESS',
      });
    });

    test('dispatches SERVER_REQUEST_ERROR on failed request', async () => {
      server.use(
        rest.post(
          `http://localhost/athletes/availability/${athletes[0].id}/quick_update`,
          (req, res, ctx) => {
            return res(
              ctx.status(422),
              ctx.json({ responseJSON: { errors: [] } })
            );
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);

      await saveAthleteAvailabilityModInfo(athletes[0].id, dummyModInfoData)(
        dispatch,
        getState
      );

      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST' });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST_ERROR' });
    });
  });

  describe('saveUploadInjury action', () => {
    const dummyInjuryUploadData = {
      lastModified: 1542706027020,
      lastModifiedDate: date,
      name: 'sample.csv',
      size: 124625,
      type: 'text/csv',
      webkitRelativePath: '',
    };

    const state = {
      injuryUploadModal: {
        isModalOpen: false,
        file: dummyInjuryUploadData,
      },
    };

    test('dispatches SAVE_UPLOAD_INJURY_SUCCESS on successful request', async () => {
      server.use(
        rest.post(
          'http://localhost/athletes/availability/import_file',
          (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({
                skipped_rows: 0,
                success: true,
                total_rows: 0,
              })
            );
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);
      const mockTrackEvent = jest.fn();

      await saveUploadInjury(new File(['foo'], 'foo.png'), mockTrackEvent)(
        dispatch,
        getState
      );

      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST' });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SAVE_UPLOAD_INJURY_SUCCESS',
      });
    });

    test('dispatches SAVE_UPLOAD_INJURY_ERROR when request is successful but file has errors', async () => {
      server.use(
        rest.post(
          'http://localhost/athletes/availability/import_file',
          (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({
                errors: [
                  'Row 1: Clubid cannot be blank, Injuryoccurrenceid cannot be blank',
                ],
                skipped_rows: 1,
                success: false,
                total_rows: 1,
              })
            );
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);
      const mockTrackEvent = jest.fn();

      await saveUploadInjury(new File(['foo'], 'foo.png'), mockTrackEvent)(
        dispatch,
        getState
      );

      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST' });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
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
      });
    });

    test('dispatches SERVER_REQUEST_ERROR on failed request', async () => {
      server.use(
        rest.post(
          'http://localhost/athletes/availability/import_file',
          (req, res, ctx) => {
            return res(
              ctx.status(422),
              ctx.json({ responseJSON: { errors: [] } })
            );
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);
      const mockTrackEvent = jest.fn();

      await saveUploadInjury(new File(['foo'], 'foo.png'), mockTrackEvent)(
        dispatch,
        getState
      );

      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST' });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST_ERROR' });
    });
  });

  describe('getDiagnosticIssues action', () => {
    const athlete = {
      id: 1644,
      injuries: injuryResponse(),
      illnesses: illnessResponse(),
    };

    const state = {
      diagnosticModal: {
        athlete: { id: athlete.id },
      },
    };

    test('dispatches UPDATE_DIAGNOSTIC_ISSUES on successful request', async () => {
      server.use(
        rest.get(
          `http://localhost/athletes/availability/${athlete.id}/issues`,
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(athlete));
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);

      await getDiagnosticIssues(athlete.id)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(serverRequestForDiagnosticIssues());
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DIAGNOSTIC_ISSUES',
        payload: {
          injuries: athlete.injuries,
          illnesses: athlete.illnesses,
        },
      });
    });

    test('dispatches SERVER_REQUEST_ERROR on failed request', async () => {
      server.use(
        rest.get(
          `http://localhost/athletes/availability/${athlete.id}/issues`,
          (req, res, ctx) => {
            return res(
              ctx.status(422),
              ctx.json({ responseJSON: { errors: [] } })
            );
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);

      await getDiagnosticIssues(athlete.id)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(serverRequestForDiagnosticIssues());
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST_ERROR' });
    });
  });

  describe('uploadAttachments action', () => {
    test('dispatches UPDATE_ATTACHMENT_IDS on successful request', async () => {
      server.use(
        rest.post('http://localhost/attachments', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({ success: true, attachment_id: 12345 })
          );
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn();
      const file = new File([''], 'dummy.csv');

      await uploadAttachments(file, 0)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(serverRequest());
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_ATTACHMENT_IDS',
        payload: {
          attachmentId: 12345,
        },
      });
    });

    test('dispatches SERVER_REQUEST_ERROR on failed request', async () => {
      server.use(
        rest.post('http://localhost/attachments', (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({ responseJSON: { errors: [] } })
          );
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn();
      const file = new File([''], 'dummy.csv');

      await uploadAttachments(file, 0)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(serverRequest());
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST_ERROR' });
    });
  });

  describe('saveDiagnostic action', () => {
    const state = {
      diagnosticModal: {
        athlete: { id: 1234 },
        diagnosticData: {
          diagnostic_date: '2020-03-11T00:00:00.000Z',
          diagnostic_type: 1,
        },
      },
    };

    test('dispatches SAVE_ATHLETE_AVAILABILITY_DIAGNOSTIC_SUCCESS on successful request', async () => {
      server.use(
        rest.post(
          'http://localhost/athletes/1234/diagnostics',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({}));
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);

      await saveDiagnostic(
        state.diagnosticModal.athlete.id,
        state.diagnosticModal.diagnosticData
      )(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(serverRequest());
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SAVE_ATHLETE_AVAILABILITY_DIAGNOSTIC_SUCCESS',
      });
    });

    test('dispatches SERVER_REQUEST_ERROR on failed request', async () => {
      server.use(
        rest.post(
          'http://localhost/athletes/1234/diagnostics',
          (req, res, ctx) => {
            return res(
              ctx.status(422),
              ctx.json({ responseJSON: { errors: [] } })
            );
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);

      await saveDiagnostic(
        state.diagnosticModal.athlete.id,
        state.diagnosticModal.diagnosticData
      )(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(serverRequest());
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({ type: 'SERVER_REQUEST_ERROR' });
    });
  });

  describe('confirmFileUpload action', () => {
    test('dispatches FINISH_FILE_UPLOAD on successful request', async () => {
      server.use(
        rest.patch(
          'http://localhost/attachments/123/confirm',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({}));
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn();

      await confirmFileUpload(123)(dispatch, getState);

      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'FINISH_FILE_UPLOAD',
        payload: { fileId: 123 },
      });
    });

    test('dispatches CONFIRM_FILE_UPLOAD_FAILURE on failed request', async () => {
      server.use(
        rest.patch(
          'http://localhost/attachments/123/confirm',
          (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ responseJSON: { errors: [] } })
            );
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn();

      await confirmFileUpload(123)(dispatch, getState);

      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'CONFIRM_FILE_UPLOAD_FAILURE',
        payload: { fileId: 123 },
      });
    });
  });

  describe('populateTreatmentSessionModal action', () => {
    const dummyStaticData = {
      issues_options: [],
      treatable_area_options: [],
      treatment_modality_options: [],
    };

    test('dispatches UPDATE_TREATMENT_SESSION_STATIC_DATA on successful request', async () => {
      server.use(
        rest.get(
          'http://localhost/athletes/availability/1234/treatments',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(dummyStaticData));
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn();

      await populateTreatmentSessionModal(1234)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'POPULATE_TREATMENT_SESSION_MODAL_LOADING',
      });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_TREATMENT_SESSION_STATIC_DATA',
        payload: { responseOptions: dummyStaticData },
      });
    });

    test('dispatches POPULATE_TREATMENT_SESSION_MODAL_FAILURE on failed request', async () => {
      server.use(
        rest.get(
          'http://localhost/athletes/availability/1234/treatments',
          (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ responseJSON: { errors: [] } })
            );
          }
        )
      );

      const dispatch = jest.fn();
      const getState = jest.fn();

      await populateTreatmentSessionModal(1234)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'POPULATE_TREATMENT_SESSION_MODAL_LOADING',
      });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'POPULATE_TREATMENT_SESSION_MODAL_FAILURE',
      });
    });
  });

  describe('saveTreatmentSession action', () => {
    const state = {
      treatmentSessionModal: {
        treatmentSession: {
          athlete_id: 1234,
          user_id: 31369,
          timezone: 'Dublin/Europe',
          title: 'Test Treatment',
          treatments_attributes: [],
          annotation_attributes: { content: 'Test Content' },
        },
      },
    };

    test('dispatches SAVE_TREATMENT_SESSION_SUCCESS on successful request', async () => {
      server.use(
        rest.post('http://localhost/treatment_sessions', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ treatment_session: {} }));
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);

      await saveTreatmentSession(
        '2020-05-08T13:22:00Z',
        '2020-05-08T14:22:00Z',
        []
      )(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SAVE_TREATMENT_SESSION_LOADING',
      });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SAVE_TREATMENT_SESSION_SUCCESS',
      });
    });

    test('dispatches SAVE_TREATMENT_SESSION_FAILURE on failed request', async () => {
      server.use(
        rest.post('http://localhost/treatment_sessions', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ responseJSON: { errors: [] } })
          );
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);

      await saveTreatmentSession(
        '2020-05-08T13:22:00Z',
        '2020-05-08T14:22:00Z',
        []
      )(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SAVE_TREATMENT_SESSION_LOADING',
      });
      await flushPromises();
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SAVE_TREATMENT_SESSION_FAILURE',
      });
    });
  });
});
