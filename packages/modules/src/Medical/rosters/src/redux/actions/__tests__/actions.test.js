import { waitFor } from '@testing-library/react';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { server, rest } from '@kitman/services/src/mocks/server';
import {
  fetchGameAndTrainingOptions,
  fetchGridSuccess,
  fetchGroupAndSelectCoding,
  fetchIssueDetails,
  fetchRosterGrid,
  fetchBAMICGrades,
  requestPending,
  requestFailure,
  requestSuccess,
  setRequestStatus,
  openAddIssuePanel,
  closeAddIssuePanel,
  addAdditionalAnnotation,
  addStatus,
  createIssue,
  createIssueFailure,
  createIssuePending,
  createIssueSuccess,
  enterSupplementalPathology,
  removeAdditionalAnnotation,
  removeStatus,
  removeSupplementalPathology,
  resetGrid,
  resetCommentsGridGrid,
  goToNextPanelPage,
  goToPreviousPanelPage,
  selectActivity,
  selectAthlete,
  selectBamicGrade,
  selectBamicSite,
  selectBodyArea,
  selectCoding,
  selectCodingSystemPathology,
  selectSupplementalCoding,
  selectClassification,
  selectDiagnosisDate,
  selectEvent,
  selectExaminationDate,
  selectIssueType,
  selectOnset,
  selectOnsetDescription,
  selectPathology,
  selectPositionWhenInjured,
  selectPreviousIssue,
  selectContinuationIssue,
  selectMechanismDescription,
  selectPresentationType,
  selectSessionCompleted,
  selectSide,
  selectSquad,
  selectTimeOfInjury,
  setBamicGrades,
  setPathologyGroupRequestStatus,
  updateBodyArea,
  updateClassification,
  updateGroups,
  updateFilters,
  updateEvents,
  updateIcdCode,
  updateInitialNote,
  updateAnnotationContent,
  updateAnnotationFilesQueue,
  updateAnnotationVisibility,
  updateOsicsCode,
  updateStatusDate,
  updateStatusType,
  updateConditionalFieldsAnswers,
  updateAttachedConcussionAssessments,
  updateIsBamic,
  setIssueTitle,
  setConditionalFieldsRequestStatus,
  setConditionalFieldsQuestions,
  fetchConditionalFields,
  selectReportedDate,
  selectIssueContactType,
  setLinkedIssues,
  updateIssueLinks,
  selectInjuryMechanism,
  addSecondaryPathology,
  removeSecondaryPathology,
  editSecondaryPathology,
  setOnsetFreeText,
  createFreetextComponentData,
  setPresentationTypeFreeText,
  updateInjuryMechanismFreetext,
  updatePrimaryMechanismFreetext,
  setChronicIssue,
  setIssueContactFreetext,
  setChronicConditionOnsetDate,
  openAddIssuePanelPreviousState,
  fetchCommentsGridSuccess,
} from '..';

import {
  issuePanelStateWithConditionalFieldsAnswers,
  issueResponseWithConditionalFieldsAnswers,
  issueResponseWithScreeningAnswers,
} from '../../testUtils';

import {
  baseIssueData,
  baseGetState,
  baseGridData,
  baseCommentsGridData,
  pathologyQV4,
} from './testData';

describe('actions', () => {
  /* ------------ app ACTIONS ------------ */
  describe('app actions', () => {
    it('has the correct action REQUEST_PENDING', () => {
      const expectedAction = {
        type: 'REQUEST_PENDING',
      };

      expect(requestPending()).toEqual(expectedAction);
    });

    it('has the correct action REQUEST_FAILURE', () => {
      const expectedAction = {
        type: 'REQUEST_FAILURE',
      };

      expect(requestFailure()).toEqual(expectedAction);
    });

    it('has the correct action REQUEST_SUCCESS', () => {
      const expectedAction = {
        type: 'REQUEST_SUCCESS',
      };

      expect(requestSuccess()).toEqual(expectedAction);
    });

    it('has the correct action SET_REQUEST_STATUS', () => {
      const expectedAction = {
        type: 'SET_REQUEST_STATUS',
        payload: {
          requestStatus: 'SUCCESS',
        },
      };

      expect(setRequestStatus('SUCCESS')).toEqual(expectedAction);
    });
  });

  /* ------------ addIssuePanel ACTIONS ------------ */
  describe('addIssuePanel actions', () => {
    it('has the correct action OPEN_ADD_ISSUE_PANEL', () => {
      const expectedAction = {
        type: 'OPEN_ADD_ISSUE_PANEL',
        payload: {
          athleteId: 12,
          squadId: 9,
          positionId: 11,
          isAthleteSelectable: true,
          athleteData: {},
        },
      };

      expect(
        openAddIssuePanel({
          athleteId: 12,
          squadId: 9,
          positionId: 11,
          isAthleteSelectable: true,
          athleteData: {},
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action OPEN_ADD_ISSUE_PANEL_PREVIOUS_STATE', () => {
      const expectedAction = {
        type: 'OPEN_ADD_ISSUE_PANEL_PREVIOUS_STATE',
        payload: {
          previousPanelState: {
            isOpen: true,
            shouldRestoreData: true,
            requestStatus: null,
            pathologyGroupRequestStatus: null,
            page: 1,
          },
        },
      };

      expect(
        openAddIssuePanelPreviousState({
          isOpen: true,
          shouldRestoreData: true,
          requestStatus: null,
          pathologyGroupRequestStatus: null,
          page: 1,
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action CLOSE_ADD_ISSUE_PANEL', () => {
      const expectedAction = {
        type: 'CLOSE_ADD_ISSUE_PANEL',
      };

      expect(closeAddIssuePanel()).toEqual(expectedAction);
    });

    it('has the correct action ADD_ADDITIONAL_ANNOTATION', () => {
      const expectedAction = {
        type: 'ADD_ADDITIONAL_ANNOTATION',
        payload: {
          attachmentType: 'NOTE',
        },
      };

      expect(addAdditionalAnnotation('NOTE')).toEqual(expectedAction);
    });

    it('has the correct action ADD_STATUS', () => {
      const expectedAction = {
        type: 'ADD_STATUS',
      };

      expect(addStatus()).toEqual(expectedAction);
    });

    it('has the correct action CREATE_ISSUE_FAILURE', () => {
      const expectedAction = {
        type: 'CREATE_ISSUE_FAILURE',
      };

      expect(createIssueFailure()).toEqual(expectedAction);
    });

    it('has the correct action CREATE_ISSUE_PENDING', () => {
      const expectedAction = {
        type: 'CREATE_ISSUE_PENDING',
      };

      expect(createIssuePending()).toEqual(expectedAction);
    });

    it('has the correct action CREATE_ISSUE_SUCCESS', () => {
      const expectedAction = {
        type: 'CREATE_ISSUE_SUCCESS',
        payload: {},
      };
      expect(createIssueSuccess()).toEqual(expectedAction);
    });

    it('has the correct action ENTER_SUPPLEMENTAL_PATHOLOGY', () => {
      const expectedAction = {
        type: 'ENTER_SUPPLEMENTAL_PATHOLOGY',
        payload: {
          supplementalPathology: 'Test',
        },
      };

      expect(enterSupplementalPathology('Test')).toEqual(expectedAction);
    });

    it('has the correct action REMOVE_ADDITIONAL_ANNOTATION', () => {
      const expectedAction = {
        type: 'REMOVE_ADDITIONAL_ANNOTATION',
        payload: {
          index: 0,
        },
      };

      expect(removeAdditionalAnnotation(0)).toEqual(expectedAction);
    });

    it('has the correct action REMOVE_STATUS', () => {
      const expectedAction = {
        type: 'REMOVE_STATUS',
        payload: {
          index: 2,
        },
      };

      expect(removeStatus(2)).toEqual(expectedAction);
    });

    it('has the correct action REMOVE_SUPPLEMENTAL_PATHOLOGY', () => {
      const expectedAction = {
        type: 'REMOVE_SUPPLEMENTAL_PATHOLOGY',
      };

      expect(removeSupplementalPathology()).toEqual(expectedAction);
    });

    it('has the correct action GO_TO_NEXT_PANEL_PAGE', () => {
      const expectedAction = {
        type: 'GO_TO_NEXT_PANEL_PAGE',
      };

      expect(goToNextPanelPage()).toEqual(expectedAction);
    });

    it('has the correct action GO_TO_PREVIOUS_PANEL_PAGE', () => {
      const expectedAction = {
        type: 'GO_TO_PREVIOUS_PANEL_PAGE',
      };

      expect(goToPreviousPanelPage()).toEqual(expectedAction);
    });

    it('has the correct action SELECT_ACTIVITY', () => {
      const expectedAction = {
        type: 'SELECT_ACTIVITY',
        payload: {
          activity: 5,
        },
      };

      expect(selectActivity(5)).toEqual(expectedAction);

      const expectedActionWithNullActivity = {
        type: 'SELECT_ACTIVITY',
        payload: {
          activity: null,
        },
      };

      expect(selectActivity(null)).toEqual(expectedActionWithNullActivity);
    });

    it('has the correct action UPDATE_PRIMARY_MECHANISM_FREE_TEXT', () => {
      const expectedAction = {
        type: 'UPDATE_PRIMARY_MECHANISM_FREE_TEXT',
        payload: {
          freeText: 'test text',
        },
      };

      expect(updatePrimaryMechanismFreetext('test text')).toEqual(
        expectedAction
      );
    });

    it('has the correct action SELECT_ATHLETE', () => {
      const expectedAction = {
        type: 'SELECT_ATHLETE',
        payload: {
          athleteId: 5321,
        },
      };

      expect(selectAthlete(5321)).toEqual(expectedAction);
    });

    it('has the correct action SET_ISSUE_TITLE', () => {
      const expectedAction = {
        type: 'SET_ISSUE_TITLE',
        payload: {
          title: 'updated title',
        },
      };

      expect(setIssueTitle('updated title')).toEqual(expectedAction);
    });

    it('has the correct action SET_LINKED_ISSUES', () => {
      const expectedAction = {
        type: 'SET_LINKED_ISSUES',
        payload: {
          ids: [123, 234],
          type: 'Injury',
        },
      };

      expect(setLinkedIssues([123, 234], 'Injury')).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_ISSUE_LINKS', () => {
      const expectedAction = {
        type: 'UPDATE_ISSUE_LINKS',
        payload: [{ title: 'test url', uri: 'example-test.com' }],
      };

      expect(
        updateIssueLinks([{ title: 'test url', uri: 'example-test.com' }])
      ).toEqual(expectedAction);
    });

    it('has the correct action SELECT_BODY_AREA', () => {
      const expectedAction = {
        type: 'SELECT_BODY_AREA',
        payload: {
          codingSystem: codingSystemKeys.OSICS_10,
          bodyAreaId: 1,
        },
      };

      expect(selectBodyArea(codingSystemKeys.OSICS_10, 1)).toEqual(
        expectedAction
      );
    });

    it('has the correct action SELECT_CLASSIFICATION', () => {
      const expectedAction = {
        type: 'SELECT_CLASSIFICATION',
        payload: {
          codingSystem: codingSystemKeys.OSICS_10,
          classificationId: 11,
        },
      };

      expect(selectClassification(codingSystemKeys.OSICS_10, 11)).toEqual(
        expectedAction
      );
    });

    it('has the correct action SELECT_CODING', () => {
      const expectedAction = {
        type: 'SELECT_CODING',
        payload: {
          coding: {
            [codingSystemKeys.ICD]: {
              code: 'S92',
              diagnosis: 'Fracture of foot and toe, except ankle',
              body_part: null,
              pathology_type: null,
              side: null,
            },
          },
        },
      };

      expect(
        selectCoding({
          [codingSystemKeys.ICD]: {
            code: 'S92',
            diagnosis: 'Fracture of foot and toe, except ankle',
            body_part: null,
            pathology_type: null,
            side: null,
          },
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action SELECT_CODING_SYSTEM_PATHOLOGY', () => {
      const expectedAction = {
        type: 'SELECT_CODING_SYSTEM_PATHOLOGY',
        payload: {
          pathology: pathologyQV4,
        },
      };

      expect(selectCodingSystemPathology(pathologyQV4)).toEqual(expectedAction);
    });

    it('has the correct action SELECT_SUPPLEMENTAL_CODING', () => {
      const expectedAction = {
        type: 'SELECT_SUPPLEMENTAL_CODING',
        payload: {
          supplementaryCoding: {
            [codingSystemKeys.ICD]: {
              code: 'S92',
              diagnosis: 'Fracture of foot and toe, except ankle',
              body_part: null,
              pathology_type: null,
              side: null,
            },
          },
        },
      };

      expect(
        selectSupplementalCoding({
          [codingSystemKeys.ICD]: {
            code: 'S92',
            diagnosis: 'Fracture of foot and toe, except ankle',
            body_part: null,
            pathology_type: null,
            side: null,
          },
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action SELECT_DIAGNOSIS_DATE', () => {
      const expectedAction = {
        type: 'SELECT_DIAGNOSIS_DATE',
        payload: {
          date: '2021-11-30',
        },
      };

      expect(selectDiagnosisDate('2021-11-30')).toEqual(expectedAction);
    });

    it('has the correct action SELECT_EVENT', () => {
      const expectedAction = {
        type: 'SELECT_EVENT',
        payload: {
          eventId: '123',
          eventType: 'game',
        },
      };

      expect(selectEvent('123', 'game')).toEqual(expectedAction);
    });

    it('has the correct action SELECT_EXAMINATION_DATE', () => {
      const expectedAction = {
        type: 'SELECT_EXAMINATION_DATE',
        payload: {
          date: '2021-11-29',
        },
      };

      expect(selectExaminationDate('2021-11-29')).toEqual(expectedAction);
    });

    it('has the correct action SELECT_ISSUE_TYPE', () => {
      const expectedAction = {
        type: 'SELECT_ISSUE_TYPE',
        payload: {
          issueType: 'ILLNESS',
        },
      };

      expect(selectIssueType('ILLNESS')).toEqual(expectedAction);
    });

    it('has the correct action SELECT_ONSET', () => {
      const expectedAction = {
        type: 'SELECT_ONSET',
        payload: {
          onset: 'ACUTE',
        },
      };

      expect(selectOnset('ACUTE')).toEqual(expectedAction);
    });

    it('has the correct action SELECT_ONSET_DESCRIPTION', () => {
      const expectedAction = {
        type: 'SELECT_ONSET_DESCRIPTION',
        payload: {
          onsetDescription: 'Mocked onset description',
        },
      };

      expect(selectOnsetDescription('Mocked onset description')).toEqual(
        expectedAction
      );
    });

    it("has the correct action SET_ONSET_FREE_TEXT'", () => {
      const expectedAction = {
        type: 'SET_ONSET_FREE_TEXT',
        payload: {
          freeText: 'Test Reason',
        },
      };

      expect(setOnsetFreeText('Test Reason')).toEqual(expectedAction);
    });

    it("has the correct action SET_PRESENTATION_TYPE_FREE_TEXT'", () => {
      const expectedAction = {
        type: 'SET_PRESENTATION_TYPE_FREE_TEXT',
        payload: {
          presentationTypeFreeText: 'Test Reason for Presentation Type',
        },
      };

      expect(
        setPresentationTypeFreeText('Test Reason for Presentation Type')
      ).toEqual(expectedAction);
    });

    it("has the correct action SET_CHRONIC_ISSUE'", () => {
      const expectedAction = {
        type: 'SET_CHRONIC_ISSUE',
        payload: {
          id: 1,
          title: 'Test Title',
          pathology: 'Test Pathology',
        },
      };

      expect(
        setChronicIssue({
          id: 1,
          title: 'Test Title',
          pathology: 'Test Pathology',
        })
      ).toEqual(expectedAction);
    });

    it("has the correct action SET_CHRONIC_CONDITION_ONSET_DATE'", () => {
      const expectedAction = {
        type: 'SET_CHRONIC_CONDITION_ONSET_DATE',
        payload: {
          date: '2021-12-12',
        },
      };
      expect(setChronicConditionOnsetDate('2021-12-12')).toEqual(
        expectedAction
      );
    });

    it('has the correct action SELECT_PATHOLOGY', () => {
      const expectedAction = {
        type: 'SELECT_PATHOLOGY',
        payload: {
          pathology: 123,
        },
      };

      expect(selectPathology(123)).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_ATTACHED_CONCUSSION_ASSESSMENTS', () => {
      const expectedAction = {
        type: 'UPDATE_ATTACHED_CONCUSSION_ASSESSMENTS',
        payload: {
          assessmentIds: [1, 2, 3],
        },
      };

      expect(updateAttachedConcussionAssessments([1, 2, 3])).toEqual(
        expectedAction
      );
    });

    it('has the correct action SELECT_POSITION_WHEN_INJURED', () => {
      const expectedAction = {
        type: 'SELECT_POSITION_WHEN_INJURED',
        payload: {
          positionWhenInjured: 52,
        },
      };

      expect(selectPositionWhenInjured(52)).toEqual(expectedAction);
    });

    it('has the correct action SELECT_PREVIOUS_ISSUE', () => {
      const expectedAction = {
        type: 'SELECT_PREVIOUS_ISSUE',
        payload: {
          issueId: 2122,
          previousIssueId: 22,
        },
      };

      expect(selectPreviousIssue(2122, 22)).toEqual(expectedAction);
    });

    it('has the correct action SELECT_CONTINUATION_ISSUE', () => {
      const expectedAction = {
        type: 'SELECT_CONTINUATION_ISSUE',
        payload: {
          issue: { id: 2122 },
        },
      };

      expect(selectContinuationIssue({ id: 2122 })).toEqual(expectedAction);
    });

    it('has the correct action SELECT_SESSION_COMPLETED', () => {
      const expectedAction = {
        type: 'SELECT_SESSION_COMPLETED',
        payload: {
          sessionCompleted: 'YES',
        },
      };

      expect(selectSessionCompleted('YES')).toEqual(expectedAction);
    });

    it('has the correct action SELECT_SIDE', () => {
      const expectedAction = {
        type: 'SELECT_SIDE',
        payload: {
          codingSystem: codingSystemKeys.OSICS_10,
          side: 'LEFT',
        },
      };

      expect(selectSide(codingSystemKeys.OSICS_10, 'LEFT')).toEqual(
        expectedAction
      );
    });

    it('has the correct action SELECT_SQUAD', () => {
      const expectedAction = {
        type: 'SELECT_SQUAD',
        payload: {
          squadId: 51,
        },
      };

      expect(selectSquad(51)).toEqual(expectedAction);
    });

    it('has the correct action SELECT_TIME_OF_INJURY', () => {
      const expectedAction = {
        type: 'SELECT_TIME_OF_INJURY',
        payload: {
          injuryTime: '2021-12-17T13:36:58Z',
        },
      };

      expect(selectTimeOfInjury('2021-12-17T13:36:58Z')).toEqual(
        expectedAction
      );
    });

    it('has the correct action SET_PATHOLOGY_GROUP_REQUEST_STATUS', () => {
      const expectedAction = {
        type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
        payload: {
          requestStatus: 'PENDING',
        },
      };

      expect(setPathologyGroupRequestStatus('PENDING')).toEqual(expectedAction);
    });

    describe('when fetching the pathology groups for OSICS-10', () => {
      it('dispatches the correct actions', async () => {
        server.use(
          rest.get('/ui/medical/group_identifiers/search', (req, res, ctx) => {
            return res(ctx.json(['concussion']));
          })
        );

        const thunk = fetchGroupAndSelectCoding(
          {
            osics_10: {
              osics_id: 'HNXX',
            },
          },
          { id: 2, key: 'osics_10', name: 'OSICS-10' }
        );

        const dispatcher = jest.fn();
        await thunk(dispatcher);

        await waitFor(() => expect(dispatcher.mock.calls.length).toBe(3));

        expect(dispatcher.mock.calls[0][0]).toEqual({
          type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
          payload: {
            requestStatus: 'PENDING',
          },
        });

        expect(dispatcher.mock.calls[1][0]).toEqual({
          type: 'SELECT_CODING',
          payload: {
            coding: {
              osics_10: {
                osics_id: 'HNXX',
                groups: ['concussion'],
              },
            },
          },
        });

        expect(dispatcher.mock.calls[2][0]).toEqual({
          type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
          payload: {
            requestStatus: 'SUCCESS',
          },
        });
      });
    });

    describe('when fetching the pathology groups for Clinical Impressions', () => {
      it('dispatches the correct actions', async () => {
        server.use(
          rest.get('/ui/medical/group_identifiers/search', (req, res, ctx) => {
            return res(ctx.json(['concussion']));
          })
        );

        const thunk = fetchGroupAndSelectCoding(
          {
            clinical_impressions: {
              code: '011000',
            },
          },
          { id: 4, key: 'clinical_impressions', name: 'Clinical Impressions' }
        );

        const dispatcher = jest.fn();
        await thunk(dispatcher);
        await waitFor(() => expect(dispatcher.mock.calls.length).toBe(3));

        expect(dispatcher.mock.calls[0][0]).toEqual({
          type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
          payload: {
            requestStatus: 'PENDING',
          },
        });

        expect(dispatcher.mock.calls[1][0]).toEqual({
          type: 'SELECT_CODING',
          payload: {
            coding: {
              clinical_impressions: {
                code: '011000',
                groups: ['concussion'],
              },
            },
          },
        });

        expect(dispatcher.mock.calls[2][0]).toEqual({
          type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
          payload: {
            requestStatus: 'SUCCESS',
          },
        });
      });
    });

    describe('when fetching the pathology groups for Datalys', () => {
      it('dispatches the correct actions', async () => {
        server.use(
          rest.get('/ui/medical/group_identifiers/search', (req, res, ctx) => {
            return res(ctx.json(['concussion']));
          })
        );

        const thunk = fetchGroupAndSelectCoding(
          {
            datalys: {
              code: 650,
            },
          },
          { id: 3, key: 'datalys', name: 'Datalys' }
        );

        const dispatcher = jest.fn();
        await thunk(dispatcher);
        await waitFor(() => expect(dispatcher.mock.calls.length).toBe(3));

        expect(dispatcher.mock.calls[0][0]).toEqual({
          type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
          payload: {
            requestStatus: 'PENDING',
          },
        });

        expect(dispatcher.mock.calls[1][0]).toEqual({
          type: 'SELECT_CODING',
          payload: {
            coding: {
              datalys: {
                code: 650,
                groups: ['concussion'],
              },
            },
          },
        });

        expect(dispatcher.mock.calls[2][0]).toEqual({
          type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
          payload: {
            requestStatus: 'SUCCESS',
          },
        });
      });
    });

    describe('when fetching the pathology groups for ICD-10-CM', () => {
      it('dispatches the correct actions', async () => {
        server.use(
          rest.get('/ui/medical/group_identifiers/search', (req, res, ctx) => {
            return res(ctx.json(['concussion']));
          })
        );

        const thunk = fetchGroupAndSelectCoding(
          {
            icd_10_cm: {
              code: 'S06.0',
            },
          },
          { id: 1, key: 'icd_10_cm', name: 'ICD-10-CM' }
        );

        const dispatcher = jest.fn();
        await thunk(dispatcher);
        await waitFor(() => expect(dispatcher.mock.calls.length).toBe(3));

        expect(dispatcher.mock.calls[0][0]).toEqual({
          type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
          payload: {
            requestStatus: 'PENDING',
          },
        });

        expect(dispatcher.mock.calls[1][0]).toEqual({
          type: 'SELECT_CODING',
          payload: {
            coding: {
              icd_10_cm: {
                code: 'S06.0',
                groups: ['concussion'],
              },
            },
          },
        });

        expect(dispatcher.mock.calls[2][0]).toEqual({
          type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
          payload: {
            requestStatus: 'SUCCESS',
          },
        });
      });
    });

    it('has the correct action UPDATE_BODY_AREA', () => {
      const expectedAction = {
        type: 'UPDATE_BODY_AREA',
        payload: {
          bodyArea: 12,
        },
      };

      expect(updateBodyArea(12)).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_CLASSIFICATION', () => {
      const expectedAction = {
        type: 'UPDATE_CLASSIFICATION',
        payload: {
          classification: 4,
        },
      };

      expect(updateClassification(4)).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_GROUPS', () => {
      const expectedAction = {
        type: 'UPDATE_GROUPS',
        payload: {
          groups: ['concussion'],
        },
      };

      expect(updateGroups(['concussion'])).toEqual(expectedAction);
    });

    it('has the correct action updateEvents', () => {
      const data = {
        games: [{ name: 'Unlisted Game', value: '', game_date: null }],
        other_events: [
          {
            id: 2,
            shortname: 'prior',
            label: 'Injury occurred prior to this club',
            sport: {
              id: 2,
              name: 'Rugby Union',
            },
          },
        ],
        training_sessions: [
          {
            name: 'Unlisted Training Session',
            value: '',
            training_date: null,
          },
        ],
      };

      const expectedAction = {
        type: 'UPDATE_EVENTS',
        payload: data,
      };

      expect(updateEvents(data)).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_ICD_CODE', () => {
      const expectedAction = {
        type: 'UPDATE_ICD_CODE',
        payload: {
          icdCode: 'NN15',
        },
      };

      expect(updateIcdCode('NN15')).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_INITIAL_NOTE', () => {
      const expectedAction = {
        type: 'UPDATE_INITIAL_NOTE',
        payload: {
          note: 'initial note',
        },
      };

      expect(updateInitialNote('initial note')).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_ANNOTATION_CONTENT', () => {
      const expectedAction = {
        type: 'UPDATE_ANNOTATION_CONTENT',
        payload: {
          index: 0,
          content: 'Test note 123',
        },
      };

      expect(updateAnnotationContent(0, 'Test note 123')).toEqual(
        expectedAction
      );
    });

    it('has the correct action UPDATE_ANNOTATION_FILES_QUEUE', () => {
      const expectedAction = {
        type: 'UPDATE_ANNOTATION_FILES_QUEUE',
        payload: {
          index: 0,
          files: [
            { id: 1, name: 'File 1' },
            { id: 2, name: 'File 2' },
          ],
        },
      };

      expect(
        updateAnnotationFilesQueue(0, [
          { id: 1, name: 'File 1' },
          { id: 2, name: 'File 2' },
        ])
      ).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_ANNOTATION_VISIBILITY', () => {
      const expectedAction = {
        type: 'UPDATE_ANNOTATION_VISIBILITY',
        payload: {
          index: 0,
          visibility: 'DOCTORS',
        },
      };

      expect(updateAnnotationVisibility(0, 'DOCTORS')).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_OSICS_CODE', () => {
      const expectedAction = {
        type: 'UPDATE_OSICS_CODE',
        payload: {
          osicsCode: 'THXH',
        },
      };

      expect(updateOsicsCode('THXH')).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_STATUS_DATE', () => {
      const expectedAction = {
        type: 'UPDATE_STATUS_DATE',
        payload: {
          index: 3,
          date: '2021-12-12',
        },
      };

      expect(updateStatusDate(3, '2021-12-12')).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_STATUS_TYPE', () => {
      const expectedAction = {
        type: 'UPDATE_STATUS_TYPE',
        payload: {
          index: 3,
          status: 'NEW_STATUS',
        },
      };

      expect(updateStatusType(3, 'NEW_STATUS')).toEqual(expectedAction);
    });

    it('has the correct action SELECT_BAMIC_GRADE', () => {
      const expectedAction = {
        type: 'SELECT_BAMIC_GRADE',
        payload: {
          bamicGrade: 1,
        },
      };

      expect(selectBamicGrade(1)).toEqual(expectedAction);
    });

    it('has the correct action SELECT_BAMIC_SITE', () => {
      const expectedAction = {
        type: 'SELECT_BAMIC_SITE',
        payload: {
          bamicSite: 1,
        },
      };

      expect(selectBamicSite(1)).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_IS_BAMIC', () => {
      const expectedAction = {
        type: 'UPDATE_IS_BAMIC',
        payload: {
          isBamic: true,
        },
      };

      expect(updateIsBamic(true)).toEqual(expectedAction);
    });

    it('has the correct action SET_BAMIC_GRADES_OPTIONS', () => {
      const expectedAction = {
        type: 'SET_BAMIC_GRADES_OPTIONS',
        payload: {
          bamicGradesOptions: [],
        },
      };

      expect(setBamicGrades([])).toEqual(expectedAction);
    });

    it('has the correct action SELECT_REPORTED_DATE', () => {
      const expectedAction = {
        type: 'SELECT_REPORTED_DATE',
        payload: {
          date: '2021-11-30',
        },
      };

      expect(selectReportedDate('2021-11-30')).toEqual(expectedAction);
    });

    it('has the correct action SELECT_PRESENTATION_TYPE', () => {
      const expectedAction = {
        type: 'SELECT_PRESENTATION_TYPE',
        payload: {
          presentationTypeId: 1,
        },
      };

      expect(selectPresentationType(1)).toEqual(expectedAction);
    });

    it('has the correct action SELECT_MECHANISM_DESCRIPTION', () => {
      const expectedAction = {
        type: 'SELECT_MECHANISM_DESCRIPTION',
        payload: {
          mechanismDescription: 'Mocked mechanism description',
        },
      };

      expect(
        selectMechanismDescription('Mocked mechanism description')
      ).toEqual(expectedAction);
    });

    it('has the correct action SELECT_ISSUE_CONTACT_TYPE', () => {
      const expectedAction = {
        type: 'SELECT_ISSUE_CONTACT_TYPE',
        payload: {
          issueContactType: 123,
        },
      };

      expect(selectIssueContactType(123)).toEqual(expectedAction);
    });

    it('has the correct action SET_ISSUE_CONTACT_FREE_TEXT', () => {
      const expectedAction = {
        type: 'SET_ISSUE_CONTACT_FREE_TEXT',
        payload: {
          freeText: 'testing',
        },
      };

      expect(setIssueContactFreetext('testing')).toEqual(expectedAction);
    });

    it('has the correct action SELECT_INJURY_MECHANISM', () => {
      const expectedAction = {
        type: 'SELECT_INJURY_MECHANISM',
        payload: {
          injuryMechanismId: 123,
        },
      };

      expect(selectInjuryMechanism(123)).toEqual(expectedAction);
    });
  });

  it('has the correct action UPDATE_INJURY_MECHANISM_FREE_TEXT', () => {
    const expectedAction = {
      type: 'UPDATE_INJURY_MECHANISM_FREE_TEXT',
      payload: {
        freeText: 'test text',
      },
    };

    expect(updateInjuryMechanismFreetext('test text')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_CONDITIONAL_FIELDS_ANSWERS', () => {
    const expectedAction = {
      type: 'UPDATE_CONDITIONAL_FIELDS_ANSWERS',
      payload: {
        answers: [{ id: 1, value: 'Answer' }],
      },
    };

    expect(
      updateConditionalFieldsAnswers([{ id: 1, value: 'Answer' }])
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_CONDITIONAL_FIELDS_REQUEST_STATUS', () => {
    const expectedAction = {
      type: 'SET_CONDITIONAL_FIELDS_REQUEST_STATUS',
      payload: {
        requestStatus: 'EL PENDO',
      },
    };

    expect(setConditionalFieldsRequestStatus('EL PENDO')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_CONDITIONAL_FIELDS_QUESTIONS', () => {
    const expectedAction = {
      type: 'SET_CONDITIONAL_FIELDS_QUESTIONS',
      payload: {
        questions: ['So question', 'Very conditional', 'Much field'],
      },
    };

    expect(
      setConditionalFieldsQuestions([
        'So question',
        'Very conditional',
        'Much field',
      ])
    ).toEqual(expectedAction);
  });

  it('has the correct action ADD_SECONDARY_PATHOLOGY', () => {
    const mockRecord = {
      id: 4179,
      pathology: 'Man gets hit by football',
      code: '999',
      clinical_impression_body_area: {
        id: 30,
        name: 'Groin',
      },
      clinical_impression_classification: {
        id: 9,
        name: 'Gen Trauma',
      },
    };
    const expectedAction = {
      type: 'ADD_SECONDARY_PATHOLOGY',
      payload: {
        secondaryPathology: {
          record: mockRecord,
          side: 123,
        },
      },
    };

    expect(
      addSecondaryPathology({
        record: mockRecord,
        side: 123,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_SECONDARY_PATHOLOGY', () => {
    const mockRecord = {
      id: 4179,
      pathology: 'Man gets hit by football',
      code: '999',
      clinical_impression_body_area: {
        id: 30,
        name: 'Groin',
      },
      clinical_impression_classification: {
        id: 9,
        name: 'Gen Trauma',
      },
    };
    const expectedAction = {
      type: 'EDIT_SECONDARY_PATHOLOGY',
      payload: {
        index: 1,
        secondaryPathology: {
          record: mockRecord,
          side: 123,
        },
      },
    };

    expect(
      editSecondaryPathology({ side: 123, record: mockRecord }, 1)
    ).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_SECONDARY_PATHOLOGY', () => {
    const expectedAction = {
      type: 'REMOVE_SECONDARY_PATHOLOGY',
      payload: {
        index: 1,
      },
    };

    expect(removeSecondaryPathology(1)).toEqual(expectedAction);
  });

  /* ------------ grid ACTIONS ------------ */
  describe('grid actions', () => {
    it('has the correct action FETCH_GRID_SUCCESS', () => {
      const expectedAction = {
        type: 'FETCH_GRID_SUCCESS',
        payload: {
          grid: baseGridData,
          reset: true,
        },
      };

      expect(fetchGridSuccess(baseGridData, true)).toEqual(expectedAction);
    });

    it('has the correct action RESET_GRID', () => {
      const expectedAction = {
        type: 'RESET_GRID',
      };

      expect(resetGrid()).toEqual(expectedAction);
    });
  });

  /* ------------ commentsGrid ACTIONS ------------ */
  describe('commentsGrid actions', () => {
    it('has the correct action FETCH_COMMENTS_GRID_SUCCESS', () => {
      const expectedAction = {
        type: 'FETCH_COMMENTS_GRID_SUCCESS',
        payload: {
          grid: baseCommentsGridData,
          reset: true,
        },
      };

      expect(fetchCommentsGridSuccess(baseCommentsGridData, true)).toEqual(
        expectedAction
      );
    });

    it('has the correct action RESET_GRID', () => {
      const expectedAction = {
        type: 'RESET_COMMENTS_GRID',
      };

      expect(resetCommentsGridGrid()).toEqual(expectedAction);
    });
  });

  /* ------------ filters ACTIONS ------------ */
  describe('filters actions', () => {
    it('has the correct action UPDATE_FILTERS', () => {
      const expectedAction = {
        type: 'UPDATE_FILTERS',
        payload: {
          filters: {
            athlete_name: 'ABC',
            squads: [1, 2],
            availabilities: [3, 4],
          },
        },
      };

      expect(
        updateFilters({
          athlete_name: 'ABC',
          squads: [1, 2],
          availabilities: [3, 4],
        })
      ).toEqual(expectedAction);
    });
  });

  /* ------------ THUNK ACTIONS ------------ */
  describe('when fetching the roster grid', () => {
    describe('when the server request is successful', () => {
      describe('when the nextId is null', () => {
        it('dispatches the correct actions', async () => {
          let requestBody;
          server.use(
            rest.post('/medical/rosters/fetch', (req, res, ctx) => {
              requestBody = req.body;
              return res(
                ctx.json({
                  columns: [
                    {
                      row_key: 'athlete',
                      datatype: 'object',
                      name: 'Athlete',
                      assessment_item_id: null,
                      readonly: true,
                      id: 1,
                      default: true,
                    },
                  ],
                  next_id: null,
                  rows: [
                    {
                      id: 7,
                      athlete: {
                        fullname: 'Deco 10',
                        avatar_url: 'test_avatar_url.png',
                      },
                    },
                    {
                      id: 8,
                      athlete: {
                        fullname: 'John Smith',
                        avatar_url: 'test_avatar_url_2.png',
                      },
                    },
                  ],
                })
              );
            })
          );

          const getState = jest.fn().mockReturnValue({
            gridDetails: { id: 6 },
            filters: {
              athlete_name: '',
              positions: [],
              squads: [],
              availabilities: [],
            },
            grid: {
              next_id: undefined,
            },
          });

          const thunk = fetchRosterGrid(false);

          const dispatcher = jest.fn();
          await thunk(dispatcher, getState);
          await waitFor(() => expect(dispatcher.mock.calls.length).toBe(3));

          expect(dispatcher.mock.calls[0][0].type).toEqual('REQUEST_PENDING');
          expect(dispatcher.mock.calls[1][0]).toEqual({
            type: 'FETCH_GRID_SUCCESS',
            payload: {
              grid: {
                columns: [
                  {
                    row_key: 'athlete',
                    datatype: 'object',
                    name: 'Athlete',
                    assessment_item_id: null,
                    readonly: true,
                    id: 1,
                    default: true,
                  },
                ],
                next_id: null,
                rows: [
                  {
                    id: 7,
                    athlete: {
                      fullname: 'Deco 10',
                      avatar_url: 'test_avatar_url.png',
                    },
                  },
                  {
                    id: 8,
                    athlete: {
                      fullname: 'John Smith',
                      avatar_url: 'test_avatar_url_2.png',
                    },
                  },
                ],
              },
              reset: false,
            },
          });
          expect(dispatcher.mock.calls[2][0].type).toEqual('REQUEST_SUCCESS');
          expect(requestBody).toEqual({
            next_id: null,
            filters: {
              athlete_name: '',
              positions: [],
              squads: [],
              availabilities: [],
            },
          });
        });
      });

      describe('when the nextId is not null', () => {
        it('dispatches the correct actions', async () => {
          let requestBody;
          server.use(
            rest.post('/medical/rosters/fetch', (req, res, ctx) => {
              requestBody = req.body;
              return res(
                ctx.json({
                  columns: [
                    {
                      row_key: 'athlete',
                      datatype: 'object',
                      name: 'Athlete',
                      assessment_item_id: null,
                      readonly: true,
                      id: 1,
                      default: true,
                    },
                  ],
                  next_id: 1234,
                  rows: [
                    {
                      id: 7,
                      athlete: {
                        fullname: 'Deco 10',
                        avatar_url: 'test_avatar_url.png',
                      },
                    },
                    {
                      id: 8,
                      athlete: {
                        fullname: 'John Smith',
                        avatar_url: 'test_avatar_url_2.png',
                      },
                    },
                  ],
                })
              );
            })
          );

          const getState = jest.fn().mockReturnValue({
            gridDetails: { id: 6 },
            filters: {
              athlete_name: '',
              positions: [],
              squads: [],
              availabilities: [],
            },
            grid: {
              next_id: 1234,
            },
          });

          const thunk = fetchRosterGrid(false);

          const dispatcher = jest.fn();
          await thunk(dispatcher, getState);
          await waitFor(() => expect(dispatcher.mock.calls.length).toBe(3));
          expect(dispatcher.mock.calls[0][0].type).toEqual('REQUEST_PENDING');
          expect(dispatcher.mock.calls[1][0]).toEqual({
            type: 'FETCH_GRID_SUCCESS',
            payload: {
              grid: {
                columns: [
                  {
                    row_key: 'athlete',
                    datatype: 'object',
                    name: 'Athlete',
                    assessment_item_id: null,
                    readonly: true,
                    id: 1,
                    default: true,
                  },
                ],
                next_id: 1234,
                rows: [
                  {
                    id: 7,
                    athlete: {
                      fullname: 'Deco 10',
                      avatar_url: 'test_avatar_url.png',
                    },
                  },
                  {
                    id: 8,
                    athlete: {
                      fullname: 'John Smith',
                      avatar_url: 'test_avatar_url_2.png',
                    },
                  },
                ],
              },
              reset: false,
            },
          });
          expect(dispatcher.mock.calls[2][0].type).toEqual('REQUEST_SUCCESS');
          expect(requestBody).toEqual({
            next_id: 1234,
            filters: {
              athlete_name: '',
              positions: [],
              squads: [],
              availabilities: [],
            },
          });
        });
      });

      describe('when reset is true', () => {
        it('dispatches the correct actions', async () => {
          let requestBody;
          server.use(
            rest.post('/medical/rosters/fetch', (req, res, ctx) => {
              requestBody = req.body;
              return res(
                ctx.json({
                  columns: [
                    {
                      row_key: 'athlete',
                      datatype: 'object',
                      name: 'Athlete',
                      assessment_item_id: null,
                      readonly: true,
                      id: 1,
                      default: true,
                    },
                  ],
                  next_id: 1234,
                  rows: [
                    {
                      id: 7,
                      athlete: {
                        fullname: 'Deco 10',
                        avatar_url: 'test_avatar_url.png',
                      },
                    },
                    {
                      id: 8,
                      athlete: {
                        fullname: 'John Smith',
                        avatar_url: 'test_avatar_url_2.png',
                      },
                    },
                  ],
                })
              );
            })
          );

          const getState = jest.fn().mockReturnValue({
            gridDetails: { id: 6 },
            filters: {
              athlete_name: '',
              positions: [],
              squads: [],
              availabilities: [],
            },
            grid: {
              next_id: 1234,
            },
          });

          const thunk = fetchRosterGrid(true); // RESET

          const dispatcher = jest.fn();
          await thunk(dispatcher, getState);
          await waitFor(() => expect(dispatcher.mock.calls.length).toBe(4));

          expect(dispatcher.mock.calls[0][0].type).toEqual('RESET_GRID');
          expect(dispatcher.mock.calls[1][0].type).toEqual('REQUEST_PENDING');
          expect(dispatcher.mock.calls[2][0]).toEqual({
            type: 'FETCH_GRID_SUCCESS',
            payload: {
              grid: {
                columns: [
                  {
                    row_key: 'athlete',
                    datatype: 'object',
                    name: 'Athlete',
                    assessment_item_id: null,
                    readonly: true,
                    id: 1,
                    default: true,
                  },
                ],
                next_id: 1234,
                rows: [
                  {
                    id: 7,
                    athlete: {
                      fullname: 'Deco 10',
                      avatar_url: 'test_avatar_url.png',
                    },
                  },
                  {
                    id: 8,
                    athlete: {
                      fullname: 'John Smith',
                      avatar_url: 'test_avatar_url_2.png',
                    },
                  },
                ],
              },
              reset: true,
            },
          });
          expect(dispatcher.mock.calls[3][0].type).toEqual('REQUEST_SUCCESS');
          expect(requestBody).toEqual({
            next_id: 1234,
            filters: {
              athlete_name: '',
              positions: [],
              squads: [],
              availabilities: [],
            },
          });
        });
      });

      describe('when athlete_name filter is applied', () => {
        it('dispatches the correct actions', async () => {
          let requestBody;
          server.use(
            rest.post('/medical/rosters/fetch', (req, res, ctx) => {
              requestBody = req.body;
              return res(
                ctx.json({
                  columns: [
                    {
                      row_key: 'athlete',
                      datatype: 'object',
                      name: 'Athlete',
                      assessment_item_id: null,
                      readonly: true,
                      id: 1,
                      default: true,
                    },
                  ],
                  next_id: null,
                  rows: [
                    {
                      id: 7,
                      athlete: {
                        fullname: 'Deco 10',
                        avatar_url: 'test_avatar_url.png',
                      },
                    },
                  ],
                })
              );
            })
          );

          const getState = jest.fn().mockReturnValue({
            gridDetails: { id: 6 },
            filters: {
              athlete_name: 'Dec',
              positions: [],
              squads: [],
              availabilities: [],
            },
            grid: {
              next_id: undefined,
            },
          });

          const thunk = fetchRosterGrid(false);

          const dispatcher = jest.fn();
          await thunk(dispatcher, getState);
          await waitFor(() => expect(dispatcher.mock.calls.length).toBe(3));

          expect(dispatcher.mock.calls[0][0].type).toEqual('REQUEST_PENDING');
          expect(dispatcher.mock.calls[1][0]).toEqual({
            type: 'FETCH_GRID_SUCCESS',
            payload: {
              grid: {
                columns: [
                  {
                    row_key: 'athlete',
                    datatype: 'object',
                    name: 'Athlete',
                    assessment_item_id: null,
                    readonly: true,
                    id: 1,
                    default: true,
                  },
                ],
                next_id: null,
                rows: [
                  {
                    id: 7,
                    athlete: {
                      fullname: 'Deco 10',
                      avatar_url: 'test_avatar_url.png',
                    },
                  },
                ],
              },
              reset: false,
            },
          });
          expect(dispatcher.mock.calls[2][0].type).toEqual('REQUEST_SUCCESS');
          expect(requestBody).toEqual({
            next_id: null,
            filters: {
              athlete_name: 'Dec',
              positions: [],
              squads: [],
              availabilities: [],
            },
          });
        });
      });
    });

    describe('when the server request is unsuccessful', () => {
      it('calls the action REQUEST_FAILURE', async () => {
        server.use(
          rest.post('/medical/rosters/fetch', (req, res, ctx) => {
            return res(ctx.status(500));
          })
        );
        const getState = jest.fn().mockReturnValue({
          grid: {
            next_id: undefined,
          },
          appState: {},
        });
        const thunk = fetchRosterGrid();
        const dispatcher = jest.fn();
        await thunk(dispatcher, getState);
        await waitFor(() => expect(dispatcher.mock.calls.length).toBe(2));

        expect(dispatcher.mock.calls[0][0].type).toEqual('REQUEST_PENDING');
        expect(dispatcher.mock.calls[1][0]).toEqual({
          type: 'REQUEST_FAILURE',
        });
      });
    });
  });

  describe('when fetching the issue details', () => {
    it('dispatches the correct actions', async () => {
      server.use(
        rest.get('/athletes/1161/issues/osics_info/', (req, res, ctx) => {
          return res(
            ctx.json({
              bamic: null,
              icd: 'NA41',
              id: 'SNBX',
              osics_body_area_id: 13,
              osics_classification_id: 12,
              osics_pathology_id: 1009,
              osics_tissue_type_id: null,
              groups: ['concussion'],
            })
          );
        })
      );

      const getState = jest.fn().mockReturnValue({
        addIssuePanel: { initialInfo: { athlete: 1161 } },
      });

      const thunk = fetchIssueDetails(12);

      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);

      await waitFor(() => expect(dispatcher.mock.calls.length).toBe(6));

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'UPDATE_CLASSIFICATION',
        payload: {
          classification: 12,
        },
      });
      expect(dispatcher.mock.calls[1][0]).toEqual({
        type: 'UPDATE_GROUPS',
        payload: {
          groups: ['concussion'],
        },
      });
      expect(dispatcher.mock.calls[2][0]).toEqual({
        type: 'UPDATE_BODY_AREA',
        payload: {
          bodyArea: 13,
        },
      });
      expect(dispatcher.mock.calls[3][0]).toEqual({
        type: 'UPDATE_OSICS_CODE',
        payload: {
          osicsCode: 'SNBX',
        },
      });
      expect(dispatcher.mock.calls[4][0]).toEqual({
        type: 'UPDATE_ICD_CODE',
        payload: {
          icdCode: 'NA41',
        },
      });

      expect(dispatcher.mock.calls[5][0]).toEqual({
        type: 'UPDATE_IS_BAMIC',
        payload: {
          isBamic: false,
        },
      });
    });
  });

  describe('when fetching the game and training session options', () => {
    it('dispatches the correct actions', async () => {
      server.use(
        rest.get(
          '/athletes/1161/injuries/game_and_training_options',
          (req, res, ctx) => {
            return res(
              ctx.json({
                games: [{ name: 'Unlisted Game', value: '', game_date: null }],
                training_sessions: [
                  { name: 'Unlisted Training Sessions', value: '' },
                ],
              })
            );
          }
        )
      );

      const getState = jest.fn().mockReturnValue({
        addIssuePanel: {
          initialInfo: {
            athlete: 1161,
            diagnosisDate: '2021-12-01',
          },
          eventInfo: {
            diagnosisDate: '2021-12-01',
          },
        },
      });

      const thunk = fetchGameAndTrainingOptions();

      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);
      await waitFor(() => expect(dispatcher.mock.calls.length).toBe(1));

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'UPDATE_EVENTS',
        payload: {
          games: [{ name: 'Unlisted Game', value: '', game_date: null }],
          training_sessions: [
            { name: 'Unlisted Training Sessions', value: '' },
          ],
        },
      });
    });
  });

  describe('when creating an issue', () => {
    it('default flow - dispatches the correct actions', async () => {
      server.use(
        rest.post('/athletes/1161/illnesses', (req, res, ctx) => {
          return res(ctx.json(baseIssueData));
        })
      );

      const getState = jest.fn().mockReturnValue(baseGetState);

      const mockTrackEvent = jest.fn();
      const thunk = createIssue(mockTrackEvent);

      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);
      await waitFor(() => expect(dispatcher.mock.calls.length).toBe(4));

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'CREATE_ISSUE_PENDING',
      });
      expect(dispatcher.mock.calls[1][0]).toEqual({
        type: 'CREATE_ISSUE_SUCCESS',
        payload: baseIssueData,
      });
      expect(dispatcher.mock.calls[2][0]).toEqual({
        type: 'CLOSE_ADD_ISSUE_PANEL',
      });
    });

    it('handles INJURY issue type correctly', async () => {
      server.use(
        rest.post('/athletes/1161/injuries', (req, res, ctx) => {
          // Assert that type_id is deleted and issue_occurrence_onset_id is set
          expect(req.body.type_id).toBeUndefined();
          expect(req.body.issue_occurrence_onset_id).toEqual(3);
          return res(ctx.json(baseIssueData));
        })
      );

      const getState = jest.fn().mockReturnValue({
        addIssuePanel: {
          ...baseGetState.addIssuePanel,
          initialInfo: {
            ...baseGetState.addIssuePanel.initialInfo,
            type: 'INJURY', // Set issueType to INJURY
          },
          diagnosisInfo: {
            ...baseGetState.addIssuePanel.diagnosisInfo,
            type_id: 3, // This will be the original type_id
          },
        },
      });

      const mockTrackEvent = jest.fn();
      const thunk = createIssue(mockTrackEvent);

      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);
      await waitFor(() => expect(dispatcher.mock.calls.length).toBe(4));

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'CREATE_ISSUE_PENDING',
      });
      expect(dispatcher.mock.calls[1][0]).toEqual({
        type: 'CREATE_ISSUE_SUCCESS',
        payload: baseIssueData,
      });
      expect(dispatcher.mock.calls[2][0]).toEqual({
        type: 'CLOSE_ADD_ISSUE_PANEL',
      });
    });

    it('handles CHRONIC_INJURY_OCCURRENCE issue type correctly', async () => {
      server.use(
        rest.post('/athletes/1161/injuries', (req, res, ctx) => {
          // Assert that type_id is deleted and issue_occurrence_onset_id is set
          expect(req.body.type_id).toBeUndefined();
          expect(req.body.issue_occurrence_onset_id).toEqual(3);
          return res(ctx.json(baseIssueData));
        })
      );

      const getState = jest.fn().mockReturnValue({
        addIssuePanel: {
          ...baseGetState.addIssuePanel,
          initialInfo: {
            ...baseGetState.addIssuePanel.initialInfo,
            type: 'CHRONIC_INJURY_OCCURRENCE', // Set issueType to CHRONIC_INJURY_OCCURRENCE
          },
          diagnosisInfo: {
            ...baseGetState.addIssuePanel.diagnosisInfo,
            type_id: 3, // This will be the original type_id
          },
        },
      });

      const mockTrackEvent = jest.fn();
      const thunk = createIssue(mockTrackEvent);

      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);
      await waitFor(() => expect(dispatcher.mock.calls.length).toBe(4));

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'CREATE_ISSUE_PENDING',
      });
      expect(dispatcher.mock.calls[1][0]).toEqual({
        type: 'CREATE_ISSUE_SUCCESS',
        payload: baseIssueData,
      });
      expect(dispatcher.mock.calls[2][0]).toEqual({
        type: 'CLOSE_ADD_ISSUE_PANEL',
      });
    });

    it('handles INJURY_CONTINUATION issue type correctly', async () => {
      server.use(
        rest.post('/athletes/1161/injuries', (req, res, ctx) => {
          expect(req.body.type_id).toBeUndefined();
          expect(req.body.issue_occurrence_onset_id).toEqual(3);
          return res(ctx.json(baseIssueData));
        })
      );

      const getState = jest.fn().mockReturnValue({
        addIssuePanel: {
          ...baseGetState.addIssuePanel,
          initialInfo: {
            ...baseGetState.addIssuePanel.initialInfo,
            type: 'INJURY_CONTINUATION',
          },
          diagnosisInfo: {
            ...baseGetState.addIssuePanel.diagnosisInfo,
            type_id: 3,
          },
        },
      });

      const mockTrackEvent = jest.fn();
      const thunk = createIssue(mockTrackEvent);

      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);
      await waitFor(() => expect(dispatcher.mock.calls.length).toBe(4));

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'CREATE_ISSUE_PENDING',
      });
      expect(dispatcher.mock.calls[1][0]).toEqual({
        type: 'CREATE_ISSUE_SUCCESS',
        payload: baseIssueData,
      });
      expect(dispatcher.mock.calls[2][0]).toEqual({
        type: 'CLOSE_ADD_ISSUE_PANEL',
      });
    });

    describe('[FEATURE FLAG] - medical-additional-event-info-events', () => {
      beforeEach(() => {
        window.featureFlags['medical-additional-event-info-events'] = true;
        window.featureFlags['nfl-injury-flow-fields'] = false;
      });
      afterEach(() => {
        window.featureFlags['medical-additional-event-info-events'] = false;
        window.featureFlags['nfl-injury-flow-fields'] = false;
      });

      it('flow - dispatches the correct actions', async () => {
        const data = {
          ...baseIssueData,
          issue_occurrence_title: 'newwwwwww issue',
          activity_type: 'prior',
          events: {
            events: [
              {
                date: '2022-02-23T00:00:00+00:00',
                event_date: '2022-02-23T00:00:00+00:00',
                id: 11,
                injury_status_id: 1,
              },
            ],
          },
          type_id: 2,
          has_recurrence: true,
          other_event_id: 2,
        };

        server.use(
          rest.post('/athletes/1161/injuries', (req, res, ctx) => {
            return res(ctx.json(data));
          })
        );

        const getState = jest.fn().mockReturnValue({
          title: 'newwwwwww issue',
          addIssuePanel: {
            ...baseGetState.addIssuePanel,
            initialInfo: {
              ...baseGetState.addIssuePanel.initialInfo,
              type: 'INJURY_CONTINUATION',
            },
            eventInfo: {
              ...baseGetState.addIssuePanel.eventInfo,
              activity: null,
              event_type: 'prior',
              event: 'other',
              events: {
                otherEventOptions: [
                  {
                    id: 1,
                    shortname: 'nonsport',
                    label: 'Occurred in a non-sport event',
                    sport: {},
                  },
                  {
                    id: 2,
                    shortname: 'prior',
                    label: 'Occurred prior to joining the organisation',
                    sport: {},
                  },
                ],
              },
            },
            otherEvent: {
              id: 2,
              shortname: 'prior',
              label: 'Occurred prior to joining the organisation',
              sport: {},
            },
          },
        });

        const mockTrackEvent = jest.fn();
        const thunk = createIssue(mockTrackEvent);

        const dispatcher = jest.fn();
        await thunk(dispatcher, getState);
        await waitFor(() => expect(dispatcher.mock.calls.length).toBe(4));

        expect(dispatcher.mock.calls[0][0]).toEqual({
          type: 'CREATE_ISSUE_PENDING',
        });
        expect(dispatcher.mock.calls[1][0]).toEqual({
          type: 'CREATE_ISSUE_SUCCESS',
          payload: data,
        });
        expect(dispatcher.mock.calls[2][0]).toEqual({
          type: 'CLOSE_ADD_ISSUE_PANEL',
        });
      });
    });

    describe('[FEATURE FLAG] - conditional-fields-v1-stop', () => {
      beforeEach(() => {
        window.featureFlags['conditional-fields-showing-in-ip'] = true;
        window.featureFlags['conditional-fields-v1-stop'] = true;
      });
      afterEach(() => {
        window.featureFlags['conditional-fields-showing-in-ip'] = false;
        window.featureFlags['conditional-fields-v1-stop'] = false;
      });

      it('contains correct params when TRUE', async () => {
        server.use(
          rest.post('/athletes/3392/injuries', (req, res, ctx) => {
            return res(ctx.json(issueResponseWithScreeningAnswers));
          })
        );

        const getState = jest
          .fn()
          .mockReturnValue(issuePanelStateWithConditionalFieldsAnswers);

        const mockTrackEvent = jest.fn();
        const thunk = createIssue(mockTrackEvent);

        const dispatcher = jest.fn();
        await thunk(dispatcher, getState);
        await waitFor(() => expect(dispatcher.mock.calls.length).toBe(4));

        expect(dispatcher.mock.calls[1][0]).toEqual({
          type: 'CREATE_ISSUE_SUCCESS',
          payload: issueResponseWithScreeningAnswers, // does NOT include conditional_fields_answers
        });
        expect(dispatcher.mock.calls[2][0]).toEqual({
          type: 'CLOSE_ADD_ISSUE_PANEL',
        });
      });

      it('contains correct params when FALSE', async () => {
        window.featureFlags['conditional-fields-showing-in-ip'] = true;
        window.featureFlags['conditional-fields-v1-stop'] = false;
        server.use(
          rest.post('/athletes/3392/injuries', (req, res, ctx) => {
            return res(ctx.json(issueResponseWithConditionalFieldsAnswers));
          })
        );

        const getState = jest
          .fn()
          .mockReturnValue(issuePanelStateWithConditionalFieldsAnswers);

        const mockTrackEvent = jest.fn();
        const thunk = createIssue(mockTrackEvent);

        const dispatcher = jest.fn();
        await thunk(dispatcher, getState);
        await waitFor(() => expect(dispatcher.mock.calls.length).toBe(4));

        expect(dispatcher.mock.calls[1][0]).toEqual({
          type: 'CREATE_ISSUE_SUCCESS',
          payload: issueResponseWithConditionalFieldsAnswers, // does NOT include screening_answers
        });
      });
    });
  });

  describe('when fetching the BAMIC grades options', () => {
    it('dispatches the correct actions', async () => {
      server.use(
        rest.get('/ui/medical/bamic_grades', (req, res, ctx) => {
          return res(
            ctx.json([
              {
                id: 1,
                name: 'Grade 0',
                sites: [{ id: 1, name: 'a - myofascial (peripheral)' }],
              },
            ])
          );
        })
      );

      const getState = jest.fn().mockReturnValue({
        addIssuePanel: {
          bamicGradesOptions: [],
        },
      });

      const thunk = fetchBAMICGrades();

      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);
      await waitFor(() => expect(dispatcher.mock.calls.length).toBe(1));

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'SET_BAMIC_GRADES_OPTIONS',
        payload: {
          bamicGradesOptions: [
            {
              id: 1,
              name: 'Grade 0',
              sites: [{ id: 1, name: 'a - myofascial (peripheral)' }],
            },
          ],
        },
      });
    });
  });

  describe('when fetching the CONDITIONAL FIELDS QUESTIONS', () => {
    it('dispatches the correct actions', async () => {
      server.use(
        rest.post('/ui/conditional_fields/fetch_questions', (req, res, ctx) => {
          return res(
            ctx.json({
              questions: [
                {
                  id: 309,
                  parent_rule_id: 269,
                  parent_question_id: null,
                  question: 'Free Text Field Test',
                  question_type: 'free-text',
                  order: 1,
                  question_metadata: {},
                },
              ],
            })
          );
        })
      );

      const getState = jest.fn().mockReturnValue({
        addIssuePanel: {
          additionalInfo: [],
        },
      });

      const thunk = fetchConditionalFields({ some: 'arbitrary object' });
      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);

      await waitFor(() => expect(dispatcher.mock.calls.length).toBe(3));

      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'SET_CONDITIONAL_FIELDS_REQUEST_STATUS'
      );
      expect(dispatcher.mock.calls[0][0].payload).toEqual({
        requestStatus: 'PENDING',
      });
      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'SET_CONDITIONAL_FIELDS_QUESTIONS'
      );
      expect(dispatcher.mock.calls[1][0].payload).toEqual({
        questions: [
          {
            id: 309,
            parent_rule_id: 269,
            parent_question_id: null,
            question: 'Free Text Field Test',
            question_type: 'free-text',
            order: 1,
            question_metadata: {},
          },
        ],
      });

      expect(dispatcher.mock.calls[2][0].type).toEqual(
        'SET_CONDITIONAL_FIELDS_REQUEST_STATUS'
      );
      expect(dispatcher.mock.calls[2][0].payload).toEqual({
        requestStatus: 'SUCCESS',
      });
    });
  });

  describe('when creating the freetext_components data', () => {
    it('returns the appropriate freetext data based on the freetext fields passed in', () => {
      expect(
        createFreetextComponentData({
          onsetFreetext: 'Test information',
        })
      ).toEqual([
        {
          name: 'issue_occurrence_onsets',
          value: 'Test information',
        },
      ]);
      expect(
        createFreetextComponentData({
          injuryMechanismFreetext: 'Test Information',
        })
      ).toEqual([
        {
          name: 'injury_mechanisms',
          value: 'Test Information',
        },
      ]);
      expect(
        createFreetextComponentData({
          presentationFreeText: 'Test Information',
        })
      ).toEqual([
        {
          name: 'presentation_types',
          value: 'Test Information',
        },
      ]);
      expect(
        createFreetextComponentData({
          primaryMechanismFreetext: 'Test Information',
        })
      ).toEqual([
        {
          name: 'primary_mechanisms',
          value: 'Test Information',
        },
      ]);
      expect(
        createFreetextComponentData({
          issueContactFreetext: 'Test Information',
        })
      ).toEqual([
        {
          name: 'issue_contact_types',
          value: 'Test Information',
        },
      ]);
    });

    it('returns an empty array when empty strings passed in', () => {
      expect(
        createFreetextComponentData({
          onsetFreetext: '',
          injuryMechanismFreetext: '',
        })
      ).toEqual([]);
    });
  });
});
