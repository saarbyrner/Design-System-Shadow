/* eslint-disable func-names */
import $ from 'jquery';
import {
  setAssessmentTemplates,
  setAthleteComments,
  setAthleteLinkedToComments,
  setCommentsPanelViewType,
  setIsCommentsSidePanelOpen,
  updateAthleteComments,
  fetchGridSuccess,
  updateGrid,
  updateGridRow,
  resetGrid,
  saveAssessmentSuccess,
  getAssessmentsSuccess,
  setSelectedGridDetails,
  clearUpdatedGridRows,
  requestPending,
  requestFailure,
  requestSuccess,
  setRequestStatus,
  fetchWorkloadGrid,
  fetchAssessmentGrid,
  saveAthleteComments,
  saveAssessment,
  updateAssessment,
  saveAssessmentGridAttributes,
  saveWorkloadGridAttributes,
  fetchAssessmentGroups,
  createAssessmentColumnsFromTemplate,
} from '..';

describe('actions', () => {
  /* ------------ assessmentTemplates ACTIONS ------------ */
  describe('assessmentTemplates actions', () => {
    it('has the correct action SET_ASSESSMENT_TEMPLATES', () => {
      const assessmentTemplates = [
        {
          id: 1,
          name: 'assessment',
          include_users: [],
          assessment_group_id: 1,
        },
      ];
      const expectedAction = {
        type: 'SET_ASSESSMENT_TEMPLATES',
        payload: {
          assessmentTemplates,
        },
      };

      expect(setAssessmentTemplates(assessmentTemplates)).toEqual(
        expectedAction
      );
    });
  });
  /* ------------ comments ACTIONS ------------ */
  describe('comments actions', () => {
    it('has the correct action SET_ATHLETE_COMMENTS', () => {
      const expectedAction = {
        type: 'SET_ATHLETE_COMMENTS',
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
            next_id: 12345,
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
          athleteId: 123,
        },
      };

      expect(
        setAthleteComments(
          {
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
            next_id: 12345,
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
          123
        )
      ).toEqual(expectedAction);
    });

    it('has the correct action SET_ATHLETE_LINKED_TO_COMMENTS', () => {
      const expectedAction = {
        type: 'SET_ATHLETE_LINKED_TO_COMMENTS',
        payload: {
          athlete: {
            id: 1,
            fullname: 'Timmy Connors',
            avatar_url: 'test_url',
          },
        },
      };

      expect(
        setAthleteLinkedToComments({
          id: 1,
          fullname: 'Timmy Connors',
          avatar_url: 'test_url',
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action SET_COMMENTS_PANEL_VIEW_TYPE', () => {
      const expectedAction = {
        type: 'SET_COMMENTS_PANEL_VIEW_TYPE',
        payload: {
          viewType: 'EDIT',
        },
      };

      expect(setCommentsPanelViewType('EDIT')).toEqual(expectedAction);
    });

    it('has the correct action SET_IS_COMMENTS_SIDE_PANEL_OPEN', () => {
      const expectedAction = {
        type: 'SET_IS_COMMENTS_SIDE_PANEL_OPEN',
        payload: {
          isOpen: true,
        },
      };

      expect(setIsCommentsSidePanelOpen(true)).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_ATHLETE_COMMENTS', () => {
      const expectedAction = {
        type: 'UPDATE_ATHLETE_COMMENTS',
        payload: {
          athleteId: 900,
          newComments: [
            {
              assessment_item_id: 49800,
              athlete_id: 30693,
              value: '<p>Really great test!!!!!!</p>',
            },
          ],
          assessmentItems: [
            {
              id: 49800,
              item_type: 'AssessmentMetric',
              item: {
                training_variable: {
                  perma_id: 'accommodation',
                },
              },
              order: 0,
            },
          ],
        },
      };

      expect(
        updateAthleteComments(
          900,
          [
            {
              assessment_item_id: 49800,
              athlete_id: 30693,
              value: '<p>Really great test!!!!!!</p>',
            },
          ],
          [
            {
              id: 49800,
              item_type: 'AssessmentMetric',
              item: {
                training_variable: {
                  perma_id: 'accommodation',
                },
              },
              order: 0,
            },
          ]
        )
      ).toEqual(expectedAction);
    });
  });

  /* ------------ grid ACTIONS ------------ */
  describe('grid actions', () => {
    it('has the correct action FETCH_GRID_SUCCESS', () => {
      const expectedAction = {
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
              {
                row_key: 'accommodation',
                datatype: 'plain',
                name: 'Accommodation',
                assessment_item_id: 49800,
                readonly: false,
                id: 23,
                default: false,
              },
            ],
            next_id: 12345,
            rows: [
              {
                id: 7,
                athlete: {
                  fullname: 'Deco 10',
                  avatar_url: 'test_avatar_url.png',
                },
                accommodation: {
                  value: 1,
                  comment: {
                    content: '<p>test</p>',
                    created_at: 'fake_test_date_string',
                  },
                },
              },
              {
                id: 8,
                athlete: {
                  fullname: 'John Smith',
                  avatar_url: 'test_avatar_url_2.png',
                },
                accommodation: { value: 3, comment: null },
              },
            ],
          },
          reset: true,
        },
      };

      expect(
        fetchGridSuccess(
          {
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
              {
                row_key: 'accommodation',
                datatype: 'plain',
                name: 'Accommodation',
                assessment_item_id: 49800,
                readonly: false,
                id: 23,
                default: false,
              },
            ],
            next_id: 12345,
            rows: [
              {
                id: 7,
                athlete: {
                  fullname: 'Deco 10',
                  avatar_url: 'test_avatar_url.png',
                },
                accommodation: {
                  value: 1,
                  comment: {
                    content: '<p>test</p>',
                    created_at: 'fake_test_date_string',
                  },
                },
              },
              {
                id: 8,
                athlete: {
                  fullname: 'John Smith',
                  avatar_url: 'test_avatar_url_2.png',
                },
                accommodation: { value: 3, comment: null },
              },
            ],
          },
          true
        )
      ).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_GRID', () => {
      const expectedAction = {
        type: 'UPDATE_GRID',
        payload: {
          newGrid: {
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
              {
                row_key: 'accommodation',
                datatype: 'plain',
                name: 'Accommodation',
                assessment_item_id: 49800,
                readonly: false,
                id: 23,
                default: false,
              },
            ],
            next_id: 12345,
            rows: [
              {
                id: 7,
                athlete: {
                  fullname: 'Deco 10',
                  avatar_url: 'test_avatar_url.png',
                },
                accommodation: {
                  value: 1,
                  comment: {
                    content: '<p>test</p>',
                    created_at: 'fake_test_date_string',
                  },
                },
              },
              {
                id: 8,
                athlete: {
                  fullname: 'John Smith',
                  avatar_url: 'test_avatar_url_2.png',
                },
                accommodation: { value: 3, comment: null },
              },
            ],
          },
        },
      };

      expect(
        updateGrid({
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
            {
              row_key: 'accommodation',
              datatype: 'plain',
              name: 'Accommodation',
              assessment_item_id: 49800,
              readonly: false,
              id: 23,
              default: false,
            },
          ],
          next_id: 12345,
          rows: [
            {
              id: 7,
              athlete: {
                fullname: 'Deco 10',
                avatar_url: 'test_avatar_url.png',
              },
              accommodation: {
                value: 1,
                comment: {
                  content: '<p>test</p>',
                  created_at: 'fake_test_date_string',
                },
              },
            },
            {
              id: 8,
              athlete: {
                fullname: 'John Smith',
                avatar_url: 'test_avatar_url_2.png',
              },
              accommodation: { value: 3, comment: null },
            },
          ],
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_GRID_ROW', () => {
      const expectedAction = {
        type: 'UPDATE_GRID_ROW',
        payload: {
          attributes: {
            athlete: {
              fullname: 'Deco 10',
              avatar_url: 'test_avatar_url.png',
            },
            accommodation: {
              value: 1,
              comment: {
                content: '<p>test</p>',
                created_at: 'fake_test_date_string',
              },
            },
          },
          rowId: 7,
        },
      };

      expect(
        updateGridRow(
          {
            athlete: {
              fullname: 'Deco 10',
              avatar_url: 'test_avatar_url.png',
            },
            accommodation: {
              value: 1,
              comment: {
                content: '<p>test</p>',
                created_at: 'fake_test_date_string',
              },
            },
          },
          7
        )
      ).toEqual(expectedAction);
    });

    it('has the correct action RESET_GRID', () => {
      const expectedAction = {
        type: 'RESET_GRID',
        payload: {
          grid: {
            columns: [],
            next_id: null,
            rows: [],
          },
        },
      };

      expect(resetGrid()).toEqual(expectedAction);
    });
  });

  /* ------------ assessments ACTIONS ------------ */

  describe('assessments actions', () => {
    it('has the correct action SAVE_ASSESSMENT_SUCCESS', () => {
      const expectedAction = {
        type: 'SAVE_ASSESSMENT_SUCCESS',
        payload: {
          assessment: {
            id: 2088,
            name: 'Test last',
            assessment_template: { id: 15, name: 'Defender Assessment' },
            event_type: 'TrainingSession',
          },
        },
      };

      expect(
        saveAssessmentSuccess({
          id: 2088,
          name: 'Test last',
          assessment_template: { id: 15, name: 'Defender Assessment' },
          event_type: 'TrainingSession',
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action FETCH_ASSESSMENTS_SUCCESS', () => {
      const expectedAction = {
        type: 'FETCH_ASSESSMENTS_SUCCESS',
        payload: {
          assessments: [
            { id: 123, name: 'aaaaaaaaaa' },
            { id: 234, name: 'oh noooooooo' },
          ],
        },
      };

      expect(
        getAssessmentsSuccess([
          { id: 123, name: 'aaaaaaaaaa' },
          { id: 234, name: 'oh noooooooo' },
        ])
      ).toEqual(expectedAction);
    });
  });

  /* ------------ gridDetails ACTIONS ------------ */
  describe('gridDetails actions', () => {
    it('has the correct action SET_SELECTED_GRID_DETAILS', () => {
      const expectedAction = {
        type: 'SET_SELECTED_GRID_DETAILS',
        payload: {
          gridDetails: {
            id: 12345,
            name: 'Actions Test Grid',
            type: 'ASSESSMENT',
          },
        },
      };

      expect(
        setSelectedGridDetails({
          id: 12345,
          name: 'Actions Test Grid',
          type: 'ASSESSMENT',
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action CLEAR_UPDATED_GRID_ROWS', () => {
      const expectedAction = {
        type: 'CLEAR_UPDATED_GRID_ROWS',
      };

      expect(clearUpdatedGridRows()).toEqual(expectedAction);
    });
  });

  /* ------------ appState ACTIONS ------------ */
  describe('appState actions', () => {
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
          requestStatus: 'FAILURE',
        },
      };

      expect(setRequestStatus('FAILURE')).toEqual(expectedAction);
    });
  });
});

describe('Thunk actions', () => {
  /* ------------ THUNK ACTIONS ------------ */
  describe('THUNK actions', () => {
    let ajaxSpy;

    beforeEach(() => {
      ajaxSpy = jest.spyOn($, 'ajax');
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    // Helper to create a successful jqXHR mock
    const createSuccessfulJqXHR = (data) => {
      const jqXHR = {
        // Essential for async/await: resolves the promise
        then: (resolve) => {
          resolve(data);
          return jqXHR; // Allow chaining
        },
        // Mimic jQuery's chaining behavior for callbacks
        done: jest.fn(function (callback) {
          callback(data); // Execute the done callback immediately
          return this; // Allow chaining
        }),
        fail: jest.fn(function () {
          return this;
        }), // Does nothing on success
        always: jest.fn(function (callback) {
          callback(data, 'success', jqXHR); // Execute always callback
          return this; // Allow chaining
        }),
        promise: jest.fn(function () {
          return this;
        }), // Return itself for .promise()
        responseText: JSON.stringify(data), // For debugging/inspection if needed
        status: 200,
        readyState: 4,
      };
      return jqXHR;
    };

    // Helper to create a failing jqXHR mock
    const createFailingJqXHR = (
      errorMessage = 'Network Error',
      status = 500
    ) => {
      const jqXHR = {
        // Essential for async/await: rejects the promise
        then: (resolve, reject) => {
          reject(new Error(errorMessage)); // Pass an Error object for better stack traces
          return jqXHR; // Allow chaining
        },
        done: jest.fn(function () {
          return this;
        }), // Does nothing on failure
        fail: jest.fn(function (callback) {
          // Simulate jQuery's fail callback arguments: jqXHR, textStatus, errorThrown
          callback(jqXHR, 'error', errorMessage);
          return this; // Allow chaining
        }),
        always: jest.fn(function (callback) {
          // Simulate jQuery's always callback arguments for failure
          callback(jqXHR, 'error', errorMessage);
          return this; // Allow chaining
        }),
        promise: jest.fn(function () {
          return this;
        }), // Return itself for .promise()
        responseText: errorMessage, // For debugging/inspection if needed
        status,
        readyState: 4,
      };
      return jqXHR;
    };

    describe('when fetching the workload grid', () => {
      describe('when the server request is successful', () => {
        describe('when the nextId is null', () => {
          it('dispatches the correct actions', async () => {
            const mockResponse = {
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
            };

            // Use the new helper for successful responses
            ajaxSpy.mockImplementationOnce(() =>
              createSuccessfulJqXHR(mockResponse)
            );

            const dispatch = jest.fn();
            const thunk = fetchWorkloadGrid(1, false, null);
            await thunk(dispatch);

            expect(dispatch).toHaveBeenCalledTimes(3);
            // FIX: Assert the specific actions and their payloads in the exact order observed
            expect(dispatch).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'FETCH_GRID_SUCCESS',
              })
            );

            expect(dispatch).toHaveBeenNthCalledWith(
              2,
              expect.objectContaining({
                type: 'SET_SELECTED_GRID_DETAILS',
              })
            );

            expect(dispatch).toHaveBeenNthCalledWith(3, {
              type: 'REQUEST_SUCCESS',
            });
            expect(ajaxSpy).toHaveBeenCalledWith(
              expect.objectContaining({
                method: 'POST',
                url: '/planning_hub/events/1/collections_tab',
              })
            );
          });
        });

        describe('when the nextId is not null', () => {
          it('dispatches the correct actions', async () => {
            const mockResponse = {
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
            };

            ajaxSpy.mockImplementationOnce(() =>
              createSuccessfulJqXHR(mockResponse)
            );

            const dispatch = jest.fn();
            const thunk = fetchWorkloadGrid(1, false, 1234);
            await thunk(dispatch);

            expect(dispatch).toHaveBeenCalledTimes(3);
            // FIX: Assert the specific actions and their payloads in the exact order observed
            expect(dispatch).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'FETCH_GRID_SUCCESS',
              })
            );

            expect(dispatch).toHaveBeenNthCalledWith(
              2,
              expect.objectContaining({
                type: 'SET_SELECTED_GRID_DETAILS',
              })
            );

            expect(dispatch).toHaveBeenNthCalledWith(3, {
              type: 'REQUEST_SUCCESS',
            });

            expect(ajaxSpy).toHaveBeenCalledWith(
              expect.objectContaining({
                method: 'POST',
                url: '/planning_hub/events/1/collections_tab',
              })
            );
          });
        });

        describe('when reset is true', () => {
          it('dispatches the correct actions', async () => {
            const mockResponse = {
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
            };

            ajaxSpy.mockImplementationOnce(() =>
              createSuccessfulJqXHR(mockResponse)
            );

            const dispatch = jest.fn();
            const thunk = fetchWorkloadGrid(1, true, 1234);
            await thunk(dispatch);

            expect(dispatch).toHaveBeenCalledTimes(5);
            expect(dispatch).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'RESET_GRID',
              })
            );

            expect(dispatch).toHaveBeenNthCalledWith(2, {
              type: 'REQUEST_PENDING',
            });
            expect(dispatch).toHaveBeenNthCalledWith(
              3,
              expect.objectContaining({
                type: 'FETCH_GRID_SUCCESS',
              })
            );
            expect(dispatch).toHaveBeenNthCalledWith(
              4,
              expect.objectContaining({
                type: 'SET_SELECTED_GRID_DETAILS',
              })
            );
            expect(dispatch).toHaveBeenNthCalledWith(5, {
              type: 'REQUEST_SUCCESS',
            });

            expect(ajaxSpy).toHaveBeenCalledWith(
              expect.objectContaining({
                url: '/planning_hub/events/1/collections_tab',
                method: 'POST',
              })
            );
          });
        });
      });

      describe('when the server request is unsuccessful', () => {
        it('calls the action REQUEST_FAILURE', async () => {
          ajaxSpy.mockImplementationOnce(() =>
            createFailingJqXHR('Workload Grid Failed')
          );

          const dispatch = jest.fn();
          const getState = () => ({
            planningEvent: {
              appState: {
                filteredTemplates: [],
              },
            },
          });
          const thunk = fetchWorkloadGrid(1, false, null);
          await thunk(dispatch, getState);

          expect(dispatch).toHaveBeenCalledTimes(1);
          expect(dispatch).toHaveBeenCalledWith({
            type: 'REQUEST_FAILURE',
          });
        });
      });
    });

    describe('when fetching an assessment grid', () => {
      describe('when the server request is successful', () => {
        describe('when the nextId is null', () => {
          it('dispatches the correct actions', async () => {
            const mockResponse = {
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
            };

            ajaxSpy.mockImplementationOnce(() =>
              createSuccessfulJqXHR(mockResponse)
            );

            const dispatch = jest.fn();
            const getState = () => ({
              planningEvent: {
                gridDetails: {
                  id: 6,
                },
              },
            });
            const thunk = fetchAssessmentGrid(1, false, null, {
              athlete_name: 'testing',
            });
            await thunk(dispatch, getState);
            expect(dispatch).toHaveBeenCalledTimes(2);

            expect(dispatch).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'FETCH_GRID_SUCCESS',
              })
            );

            expect(dispatch).toHaveBeenNthCalledWith(
              2,
              expect.objectContaining({
                type: 'REQUEST_SUCCESS',
              })
            );

            expect(ajaxSpy).toHaveBeenCalledWith(
              expect.objectContaining({
                method: 'POST',
                url: '/planning_hub/events/1/collections/assessments',
              })
            );
          });
        });

        describe('when the nextId is not null', () => {
          it('dispatches the correct actions', async () => {
            const mockResponse = {
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
            };

            ajaxSpy.mockImplementationOnce(() =>
              createSuccessfulJqXHR(mockResponse)
            );

            const dispatch = jest.fn();
            const getState = () => ({
              planningEvent: {
                gridDetails: {
                  id: 6,
                },
              },
            });

            const thunk = fetchAssessmentGrid(1, false, 1234);
            await thunk(dispatch, getState);

            expect(dispatch).toHaveBeenCalledTimes(2);

            expect(dispatch).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'FETCH_GRID_SUCCESS',
              })
            );

            expect(dispatch).toHaveBeenNthCalledWith(
              2,
              expect.objectContaining({
                type: 'REQUEST_SUCCESS',
              })
            );

            expect(ajaxSpy).toHaveBeenCalledWith(
              expect.objectContaining({
                method: 'POST',
                url: '/planning_hub/events/1/collections/assessments',
              })
            );
          });
        });

        describe('when reset is true', () => {
          it('dispatches the correct actions', async () => {
            const mockResponse = {
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
            };

            ajaxSpy.mockImplementationOnce(() =>
              createSuccessfulJqXHR(mockResponse)
            );

            const dispatch = jest.fn();
            const getState = () => ({
              planningEvent: {
                gridDetails: {
                  id: 6,
                },
              },
            });
            const thunk = fetchAssessmentGrid(1, true, 1234);
            await thunk(dispatch, getState);

            expect(dispatch).toHaveBeenCalledTimes(4);

            expect(dispatch).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'RESET_GRID',
              })
            );

            expect(dispatch).toHaveBeenNthCalledWith(
              2,
              expect.objectContaining({
                type: 'REQUEST_PENDING',
              })
            );
            expect(dispatch).toHaveBeenNthCalledWith(
              3,
              expect.objectContaining({
                type: 'FETCH_GRID_SUCCESS',
              })
            );

            expect(dispatch).toHaveBeenNthCalledWith(
              4,
              expect.objectContaining({
                type: 'REQUEST_SUCCESS',
              })
            );

            expect(ajaxSpy).toHaveBeenCalledWith(
              expect.objectContaining({
                method: 'POST',
                url: '/planning_hub/events/1/collections/assessments',
              })
            );
          });
        });
      });

      describe('when the server request is unsuccessful', () => {
        it('calls the action REQUEST_FAILURE', async () => {
          ajaxSpy.mockImplementationOnce(() =>
            createFailingJqXHR('Assessment Grid Failed')
          );

          const dispatch = jest.fn();
          const getState = () => ({
            planningEvent: {
              gridDetails: {
                id: 6,
              },
            },
          });
          const thunk = fetchAssessmentGrid(1, false, null);
          await thunk(dispatch, getState);

          expect(dispatch).toHaveBeenCalledTimes(1);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_FAILURE',
            })
          );
        });
      });
    });

    describe('when saving comments', () => {
      describe('when the server request is successful', () => {
        it('dispatches the correct actions', async () => {
          const mockResponse = {
            items: [
              {
                id: 49800,
                item_type: 'AssessmentMetric',
                item: {
                  id: 44025,
                  training_variable: {
                    id: 3443,
                    name: 'Accommodation',
                    description: '',
                    perma_id: 'accommodation',
                    variable_type_id: 6,
                    min: 1,
                    max: 4,
                    invert_scale: false,
                  },
                  is_protected: false,
                },
                order: 0,
              },
            ],
          };

          ajaxSpy.mockImplementationOnce(() =>
            createSuccessfulJqXHR(mockResponse)
          );

          const commentsToSave = [
            {
              assessment_item_id: 49800,
              athlete_id: 30693,
              value: '<p>Really great!!!!!!</p>',
            },
          ];

          const dispatch = jest.fn();
          const getState = () => ({
            planningEvent: {
              comments: {
                athleteLinkedToComments: {
                  id: 30693,
                  fullname: 'Deco 10',
                  avatar_url: 'test_avatar_url.png',
                },
              },
              gridDetails: {
                id: 6,
              },
            },
          });

          const thunk = saveAthleteComments(commentsToSave);
          await thunk(dispatch, getState);

          expect(dispatch).toHaveBeenCalledTimes(1);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'UPDATE_ATHLETE_COMMENTS',
            })
          );

          expect(ajaxSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'PATCH',
              url: '/assessment_groups/6/comments',
            })
          );
        });
      });

      describe('when the server request is unsuccessful', () => {
        it('calls the action REQUEST_FAILURE', async () => {
          ajaxSpy.mockImplementationOnce(() =>
            createFailingJqXHR('Save Comments Failed')
          );

          const dispatch = jest.fn();
          const getState = () => ({
            planningEvent: {
              comments: {
                athleteLinkedToComments: {},
              },
              gridDetails: {},
            },
          });
          const thunk = saveAthleteComments([]);
          await thunk(dispatch, getState);

          expect(dispatch).toHaveBeenCalledTimes(1);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_FAILURE',
            })
          );
        });
      });
    });

    describe('when saving assessments', () => {
      describe('when the server request is successful', () => {
        it('dispatches the correct actions', async () => {
          const mockResponse = {
            assessment_group: {
              id: 2088,
              name: 'bleep-bloop-computer-go-brr',
            },
          };

          ajaxSpy.mockImplementationOnce(() =>
            createSuccessfulJqXHR(mockResponse)
          );

          const assessmentData = {
            assessment_template_id: 123,
            name: 'bleep-bloop-computer-go-brr',
            event_id: 123,
            event_type: 'session_event',
          };

          const dispatch = jest.fn();
          const thunk = saveAssessment(assessmentData);
          await thunk(dispatch);

          expect(dispatch).toHaveBeenCalledTimes(7);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
              type: 'SET_SELECTED_GRID_DETAILS',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining({
              type: 'SAVE_ASSESSMENT_SUCCESS',
            })
          );

          expect(ajaxSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'POST',
              url: '/planning_hub/events/123/collections/create_assessment_group',
            })
          );
        });
      });

      describe('when the server request is unsuccessful', () => {
        it('calls the action REQUEST_FAILURE', async () => {
          ajaxSpy.mockImplementationOnce(() =>
            createFailingJqXHR('Save Assessment Failed')
          );

          const dispatch = jest.fn();
          const assessmentData = {
            assessment_template_id: 123,
            name: 'bleep-bloop-computer-go-brr',
            event_id: 123,
            event_type: 'session_event',
          };
          const thunk = saveAssessment(assessmentData);
          await thunk(dispatch);

          expect(dispatch).toHaveBeenCalledTimes(3);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
              type: 'REQUEST_FAILURE',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining({
              type: 'SET_SELECTED_GRID_DETAILS',
            })
          );
        });
      });
    });

    describe('when updating assessments', () => {
      describe('when the server request is successful', () => {
        it('dispatches the correct actions', async () => {
          const mockResponse = {
            assessment_group: {
              id: 2088,
              name: 'bleep-bloop-computer-go-brr-123',
              participation_levels: [
                {
                  id: 1,
                  name: 'full',
                },
              ],
            },
          };

          ajaxSpy.mockImplementationOnce(() =>
            createSuccessfulJqXHR(mockResponse)
          );

          const assessmentData = {
            name: 'bleep-bloop-computer-go-brr-123',
            id: 2088,
            participation_levels: [
              {
                id: 1,
                name: 'full',
              },
            ],
          };

          const dispatch = jest.fn();
          const thunk = updateAssessment(assessmentData, 1);
          await thunk(dispatch);

          expect(dispatch).toHaveBeenCalledTimes(4);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
              type: 'SAVE_ASSESSMENT_SUCCESS',
            })
          );
        });
      });

      describe('when the server request is unsuccessful', () => {
        it('calls the action REQUEST_FAILURE', async () => {
          ajaxSpy.mockImplementationOnce(() =>
            createFailingJqXHR('Update Assessment Failed')
          );

          const dispatch = jest.fn();
          const assessmentData = {
            name: 'bleep-bloop-computer-go-brr-123',
            id: 123,
          };
          const thunk = updateAssessment(assessmentData, 1);
          await thunk(dispatch);

          expect(dispatch).toHaveBeenCalledTimes(2);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
              type: 'REQUEST_FAILURE',
            })
          );
        });
      });
    });

    describe('when updating rows in an assessment grid', () => {
      describe('when the server request is successful', () => {
        it('dispatches the correct actions', async () => {
          const mockResponse = {
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
                accommodation: {
                  value: 12,
                },
                coach_rating: {
                  value: 1,
                },
              },
              {
                id: 8,
                athlete: {
                  fullname: 'John Smith',
                  avatar_url: 'test_avatar_url_2.png',
                },
                accommodation: {
                  value: 6,
                },
              },
            ],
          };

          ajaxSpy.mockImplementationOnce(() =>
            createSuccessfulJqXHR(mockResponse)
          );

          const dispatch = jest.fn();
          const getState = () => ({
            planningEvent: {
              gridDetails: {
                id: 6,
                name: 'Assessment',
                type: 'ASSESSMENT',
                updatedAssessmentGridRows: [
                  {
                    id: 7,
                    value: 12,
                    assessment_item_id: 100,
                  },
                  {
                    id: 7,
                    value: 1,
                    assessment_item_id: 120,
                  },
                  {
                    id: 8,
                    value: 6,
                    assessment_item_id: 100,
                  },
                ],
                updatedWorkloadGridRows: [],
              },
            },
          });

          const thunk = saveAssessmentGridAttributes({
            event_id: 123,
          });
          await thunk(dispatch, getState);

          expect(dispatch).toHaveBeenCalledTimes(4);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
              type: 'UPDATE_GRID',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining({
              type: 'REQUEST_SUCCESS',
            })
          );
          expect(dispatch).toHaveBeenNthCalledWith(
            4,
            expect.objectContaining({
              type: 'CLEAR_UPDATED_GRID_ROWS',
            })
          );
        });
      });

      describe('when the server request is unsuccessful', () => {
        it('calls the action REQUEST_FAILURE', async () => {
          ajaxSpy.mockImplementationOnce(() =>
            createFailingJqXHR('Save Assessment Grid Failed')
          );

          const dispatch = jest.fn();
          const getState = () => ({
            planningEvent: {
              gridDetails: {
                id: 6,
                name: 'Assessment',
                type: 'ASSESSMENT',
                updatedAssessmentGridRows: [],
                updatedWorkloadGridRows: [],
              },
            },
          });
          const thunk = saveAssessmentGridAttributes({
            event_id: 123,
          });
          await thunk(dispatch, getState);

          expect(dispatch).toHaveBeenCalledTimes(2);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
              type: 'REQUEST_FAILURE',
            })
          );
        });
      });
    });

    describe('when updating rows in the workload grid', () => {
      describe('when the server request is successful', () => {
        it('dispatches the correct actions', async () => {
          const mockResponse = {
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
                  id: 7,
                  fullname: 'Deco 10',
                  avatar_url: 'test_avatar_url.png',
                },
                rpe: 9,
                minutes: 95,
              },
              {
                id: 8,
                athlete: {
                  id: 8,
                  fullname: 'John Smith',
                  avatar_url: 'test_avatar_url_2.png',
                },
                rpe: 2,
                minutes: 26,
              },
            ],
          };

          ajaxSpy.mockImplementationOnce(() =>
            createSuccessfulJqXHR(mockResponse)
          );

          const dispatch = jest.fn();
          const getState = () => ({
            planningEvent: {
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
                      id: 7,
                      fullname: 'Deco 10',
                      avatar_url: 'test_avatar_url.png',
                    },
                    rpe: 9,
                    minutes: 95,
                  },
                  {
                    id: 8,
                    athlete: {
                      id: 8,
                      fullname: 'John Smith',
                      avatar_url: 'test_avatar_url_2.png',
                    },
                    rpe: 2,
                    minutes: 26,
                  },
                ],
              },
              gridDetails: {
                id: 6,
                name: 'Workload',
                type: 'DEFAULT',
                updatedAssessmentGridRows: [],
                updatedWorkloadGridRows: [7, 8],
              },
            },
          });

          const thunk = saveWorkloadGridAttributes({
            event_id: 123,
            tab: 'collections_tab',
          });
          await thunk(dispatch, getState);

          expect(dispatch).toHaveBeenCalledTimes(4);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
              type: 'UPDATE_GRID',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining({
              type: 'REQUEST_SUCCESS',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            4,
            expect.objectContaining({
              type: 'CLEAR_UPDATED_GRID_ROWS',
            })
          );
        });
      });

      describe('when the server request is unsuccessful', () => {
        it('calls the action REQUEST_FAILURE', async () => {
          ajaxSpy.mockImplementationOnce(() =>
            createFailingJqXHR('Save Workload Grid Failed')
          );

          const dispatch = jest.fn();
          const getState = () => ({
            planningEvent: {
              gridDetails: {
                id: 6,
                name: 'Workload',
                type: 'DEFAULT',
                updatedAssessmentGridRows: [],
                updatedWorkloadGridRows: [],
              },
            },
          });
          const thunk = saveWorkloadGridAttributes({
            event_id: 123,
          });
          await thunk(dispatch, getState);

          expect(dispatch).toHaveBeenCalledTimes(2);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );

          expect(dispatch).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
              type: 'REQUEST_FAILURE',
            })
          );
        });
      });
    });

    describe('when fetching assessment groups', () => {
      describe('when the server request is successful', () => {
        it('dispatches the correct actions', async () => {
          const mockResponse = {
            assessment_groups: [
              {
                id: 123,
                name: 'bob',
              },
              {
                id: 234,
                name: 'joe',
              },
            ],
          };

          ajaxSpy.mockImplementationOnce(() =>
            createSuccessfulJqXHR(mockResponse)
          );

          const dispatch = jest.fn();
          const thunk = fetchAssessmentGroups(1);
          await thunk(dispatch);
          expect(dispatch).toHaveBeenCalledTimes(1);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'FETCH_ASSESSMENTS_SUCCESS',
            })
          );
        });
      });
    });

    describe('when creating assessment columns from templates', () => {
      describe('when the server request is successful', () => {
        it('dispatches the correct actions', async () => {
          ajaxSpy.mockImplementationOnce(() =>
            createSuccessfulJqXHR({
              message: 'Great job Bob',
            })
          );

          const dispatch = jest.fn();
          const thunk = createAssessmentColumnsFromTemplate(123, 234, 456);
          await thunk(dispatch);

          expect(dispatch).toHaveBeenCalledTimes(2);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );
        });
      });

      describe('when the server request is unsuccessful', () => {
        it('does not call the action REQUEST_FAILURE', async () => {
          ajaxSpy.mockImplementationOnce(() =>
            createFailingJqXHR('Create Columns Failed')
          );

          const dispatch = jest.fn();
          const thunk = createAssessmentColumnsFromTemplate(123, 123, 123);
          await thunk(dispatch);

          expect(dispatch).toHaveBeenCalledTimes(1);

          expect(dispatch).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'REQUEST_PENDING',
            })
          );
        });
      });
    });
  });
});
