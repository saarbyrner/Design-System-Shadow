import { server, rest } from '@kitman/services/src/mocks/server';
import { waitFor } from '@testing-library/react';
import {
  assessmentsLoading,
  fetchAssessmentsSuccess,
  fetchAssessmentsFailure,
  saveAssessmentSuccess,
  requestPending,
  requestFailure,
  deleteAssessmentSuccess,
  deleteAssessmentItemSuccess,
  saveAssessmentItemSuccess,
  saveTemplateSuccess,
  deleteTemplateSuccess,
  renameTemplateSuccess,
  applyTemplateFilter,
  updateTemplateSuccess,
  updateTemplatePending,
  updateTemplateFailure,
  removeToast,
  deleteAssessment,
  fetchAssessments,
  saveAssessment,
  saveAssessmentItem,
  saveAssessmentAthletes,
  saveAssessmentItemComments,
  saveMetricScores,
  saveTemplate,
  deleteTemplate,
  updateTemplate,
  renameTemplate,
  saveAssessmentItemsOrderSuccess,
  saveAssessmentItemsOrder,
  updateViewType,
  selectAthlete,
  fetchAssessmentWithAnswers,
  saveAssessmentAthletesSuccess,
  saveAssessmentItemCommentsSuccess,
  saveMetricScoresSuccess,
  fetchAssessmentWithAnswersSuccess,
} from '..';

// MSW Server Setup
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());

describe('Redux Actions', () => {
  describe('Sync Action Creators', () => {
    it('creates the ASSESSMENT_LOADING action', () => {
      const lastFetchAssessmentsXHR = { readyState: 4 };
      expect(assessmentsLoading(lastFetchAssessmentsXHR)).toEqual({
        type: 'ASSESSMENT_LOADING',
        payload: { lastFetchAssessmentsXHR },
      });
    });

    it('creates the FETCH_ASSESSMENTS_SUCCESS action', () => {
      expect(fetchAssessmentsSuccess([{ id: 1 }], 3, true)).toEqual({
        type: 'FETCH_ASSESSMENTS_SUCCESS',
        payload: { assessments: [{ id: 1 }], nextAssessmentId: 3, reset: true },
      });
    });

    it('creates the FETCH_ASSESSMENTS_FAILURE action', () => {
      expect(fetchAssessmentsFailure()).toEqual({
        type: 'FETCH_ASSESSMENTS_FAILURE',
      });
    });

    it('creates the SAVE_ASSESSMENT_SUCCESS action', () => {
      const assessment = { id: 1, name: 'Assessment name' };
      expect(saveAssessmentSuccess(assessment)).toEqual({
        type: 'SAVE_ASSESSMENT_SUCCESS',
        payload: { assessment },
      });
    });

    it('creates the REQUEST_PENDING action', () => {
      expect(requestPending()).toEqual({ type: 'REQUEST_PENDING' });
    });

    it('creates the REQUEST_FAILURE action', () => {
      expect(requestFailure()).toEqual({ type: 'REQUEST_FAILURE' });
    });

    it('creates the DELETE_ASSESSMENT_SUCCESS action', () => {
      expect(deleteAssessmentSuccess(1)).toEqual({
        type: 'DELETE_ASSESSMENT_SUCCESS',
        payload: { assessmentId: 1 },
      });
    });

    it('creates the DELETE_ASSESSMENT_ITEM_SUCCESS action', () => {
      expect(deleteAssessmentItemSuccess(1, 2)).toEqual({
        type: 'DELETE_ASSESSMENT_ITEM_SUCCESS',
        payload: { assessmentId: 1, assessmentItemId: 2 },
      });
    });

    it('creates the SAVE_ASSESSMENT_ITEM_SUCCESS action', () => {
      const assessmentItem = { id: 1 };
      expect(saveAssessmentItemSuccess(1, assessmentItem, 347)).toEqual({
        type: 'SAVE_ASSESSMENT_ITEM_SUCCESS',
        payload: { assessmentId: 1, assessmentItem, athleteId: 347 },
      });
    });

    it('creates the SAVE_TEMPLATE_SUCCESS action', () => {
      const template = { name: 'Test' };
      expect(saveTemplateSuccess(1, template)).toEqual({
        type: 'SAVE_TEMPLATE_SUCCESS',
        payload: { assessmentId: 1, template },
      });
    });

    it('creates the DELETE_TEMPLATE_SUCCESS action', () => {
      expect(deleteTemplateSuccess(1)).toEqual({
        type: 'DELETE_TEMPLATE_SUCCESS',
        payload: { templateId: 1 },
      });
    });

    it('creates the RENAME_TEMPLATE_SUCCESS action', () => {
      expect(renameTemplateSuccess(1, 'New Name')).toEqual({
        type: 'RENAME_TEMPLATE_SUCCESS',
        payload: { templateId: 1, templateName: 'New Name' },
      });
    });

    it('creates the APPLY_TEMPLATE_FILTER action', () => {
      expect(applyTemplateFilter([1, 2, 3])).toEqual({
        type: 'APPLY_TEMPLATE_FILTER',
        payload: { filteredTemplates: [1, 2, 3] },
      });
    });

    it('creates the UPDATE_TEMPLATE_SUCCESS action', () => {
      expect(updateTemplateSuccess(1)).toEqual({
        type: 'UPDATE_TEMPLATE_SUCCESS',
        payload: { assessmentTemplateId: 1 },
      });
    });

    it('creates the UPDATE_TEMPLATE_PENDING action', () => {
      const template = { id: 1 };
      expect(updateTemplatePending(template)).toEqual({
        type: 'UPDATE_TEMPLATE_PENDING',
        payload: { assessmentTemplate: template },
      });
    });

    it('creates the UPDATE_TEMPLATE_FAILURE action', () => {
      expect(updateTemplateFailure(1)).toEqual({
        type: 'UPDATE_TEMPLATE_FAILURE',
        payload: { assessmentTemplateId: 1 },
      });
    });

    it('creates the REMOVE_TOAST action', () => {
      expect(removeToast(1)).toEqual({
        type: 'REMOVE_TOAST',
        payload: { toastId: 1 },
      });
    });

    it('creates the UPDATE_VIEW_TYPE action', () => {
      expect(updateViewType('GRID')).toEqual({
        type: 'UPDATE_VIEW_TYPE',
        payload: { viewType: 'GRID' },
      });
    });

    it('creates the SELECT_ATHLETE action', () => {
      expect(selectAthlete(3)).toEqual({
        type: 'SELECT_ATHLETE',
        payload: { athleteId: 3 },
      });
    });

    it('creates the SAVE_ASSESSMENT_ITEMS_ORDER_SUCCESS action', () => {
      const assessment = { id: 1, items: [] };
      expect(saveAssessmentItemsOrderSuccess(assessment)).toEqual({
        type: 'SAVE_ASSESSMENT_ITEMS_ORDER_SUCCESS',
        payload: { assessment },
      });
    });
  });

  describe('Async Thunks', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn().mockReturnValue({ appState: {} });
    });
    it('dispatches PENDING and SUCCESS actions on a successful request', async () => {
      server.use(
        rest.delete('*/assessments/1', (req, res, ctx) => res(ctx.status(204)))
      );

      deleteAssessment(1)(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(2);
      });

      expect(dispatch).toHaveBeenCalledWith(requestPending());
      expect(dispatch).toHaveBeenCalledWith(deleteAssessmentSuccess(1));
    });

    it('dispatches PENDING and FAILURE actions on an unsuccessful request', async () => {
      server.use(
        rest.delete('*/assessments/1', (req, res, ctx) => res(ctx.status(500)))
      );

      deleteAssessment(1)(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(2);
      });

      expect(dispatch).toHaveBeenCalledWith(requestPending());
      expect(dispatch).toHaveBeenCalledWith(requestFailure());
    });

    it('dispatches SUCCESS with the correct payload when fetching assessments', async () => {
      const responseData = { assessments: [{ id: 1 }], next_id: 3 };
      server.use(
        rest.post('*/assessments/search', (req, res, ctx) =>
          res(ctx.json(responseData))
        )
      );
      getState.mockReturnValue({ appState: { filteredTemplates: [] } });

      await fetchAssessments({ athleteIds: [1] })(dispatch, getState);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          fetchAssessmentsSuccess(
            responseData.assessments,
            responseData.next_id,
            false
          )
        );
      });
    });

    it('calls POST for new assessments when saving an assessment', async () => {
      const assessmentData = { name: 'New Assessment' };
      const responseData = { assessment: { id: 1, ...assessmentData } };
      server.use(
        rest.post('*/assessments', (req, res, ctx) =>
          res(ctx.json(responseData))
        )
      );

      saveAssessment(assessmentData)(dispatch, getState);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(2);
      });

      expect(dispatch).toHaveBeenCalledWith(requestPending());
      expect(dispatch).toHaveBeenCalledWith(
        saveAssessmentSuccess(responseData.assessment)
      );
    });

    it('calls PUT for existing assessments when saving an assessment', async () => {
      const assessmentData = { id: 1, name: 'Updated Assessment' };
      const responseData = { assessment: assessmentData };
      server.use(
        rest.put('*/assessments/1', (req, res, ctx) =>
          res(ctx.json(responseData))
        )
      );

      saveAssessment(assessmentData)(dispatch, getState);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(2);
      });

      expect(dispatch).toHaveBeenCalledWith(requestPending());
      expect(dispatch).toHaveBeenCalledWith(
        saveAssessmentSuccess(responseData.assessment)
      );
    });

    it('dispatches SUCCESS on successful POST when saving an assessment item', async () => {
      const template = { name: 'New Template' };
      const responseData = {
        assessment_template: { assessment_id: 1, ...template },
      };

      server.use(
        rest.post('*/assessment_templates', (req, res, ctx) =>
          res(ctx.json(responseData))
        )
      );

      saveTemplate(template, 4521)(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(requestPending());
      });

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          saveTemplateSuccess(undefined, responseData.assessment_template)
        );
      });
    });

    it('dispatches SUCCESS on successful PUT when saving an assessment item', async () => {
      const itemData = { id: 2, name: 'Existing' };
      const responseData = { assessment_item: itemData };
      server.use(
        rest.put('*/assessments/1/items/2', (req, res, ctx) =>
          res(ctx.json(responseData))
        )
      );

      saveAssessmentItem(1, itemData, 347)(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          saveAssessmentItemSuccess(1, responseData.assessment_item, 347)
        );
      });
    });

    it('dispatches SUCCESS on successful POST when saving athletes', async () => {
      server.use(
        rest.post('*/assessment_groups/2/athletes', (req, res, ctx) =>
          res(ctx.status(204))
        )
      );

      saveAssessmentAthletes(2, [25, 34])(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          saveAssessmentAthletesSuccess(2, [25, 34])
        );
      });
    });

    it('dispatches SUCCESS on successful PATCH when saving comments of an assessment item', async () => {
      const comments = [{ value: 'test' }];
      server.use(
        rest.patch('*/assessment_groups/1/comments', (req, res, ctx) =>
          res(ctx.json({ comments }))
        )
      );

      saveAssessmentItemComments(1, comments)(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          saveAssessmentItemCommentsSuccess(1, comments)
        );
      });
    });

    it('dispatches SUCCESS on successful PATCH when saving scores of an assessment item', async () => {
      const scores = [{ value: 1 }];
      server.use(
        rest.patch('*/assessment_groups/1/scores', (req, res, ctx) =>
          res(ctx.json({ scores }))
        )
      );

      saveMetricScores(1, scores)(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          saveMetricScoresSuccess(1, scores)
        );
      });
    });

    it('dispatches SUCCESS on successful POST when saving a template', async () => {
      const template = { name: 'New Template' };
      const responseData = {
        assessment_id: 1,
        assessment_template: template,
      };

      server.use(
        rest.post('*/assessment_templates', (req, res, ctx) => {
          return res(ctx.json(responseData));
        })
      );

      saveTemplate(template, 4521)(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(requestPending());
      });

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          saveTemplateSuccess(undefined, responseData.assessment_template)
        );
      });
    });

    it('dispatches SUCCESS on successful DELETE when deleting a template', async () => {
      server.use(
        rest.delete('*/assessment_templates/1', (req, res, ctx) =>
          res(ctx.status(204))
        )
      );

      deleteTemplate(1)(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(deleteTemplateSuccess(1));
      });
    });

    it('dispatches SUCCESS on successful request when renaming a template', async () => {
      server.use(
        rest.put('*/assessment_templates/1', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        })
      );

      renameTemplate(1, 'New Name')(dispatch);

      expect(dispatch).toHaveBeenCalledWith(requestPending());
      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          renameTemplateSuccess(1, 'New Name')
        );
      });
    });

    it('dispatches PENDING and SUCCESS on successful PUT when updating a template', async () => {
      const template = { id: 2, name: 'Updated' };
      server.use(
        rest.put('*/assessment_templates/2', (req, res, ctx) =>
          res(ctx.json({}))
        )
      );

      updateTemplate(1, template)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(updateTemplatePending(template));
      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(updateTemplateSuccess(2));
      });
    });

    it('dispatches SUCCESS on successful POST when reordering assessment items', async () => {
      const assessment = { id: 1, items: [] };
      server.use(
        rest.post('*/assessments/1/items/reorder', (req, res, ctx) =>
          res(ctx.json({ assessment }))
        )
      );

      saveAssessmentItemsOrder(1, [1, 2])(dispatch);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          saveAssessmentItemsOrderSuccess(assessment)
        );
      });
    });
    it('dispatches SUCCESS on successful GET when fetching assessments with answers', async () => {
      const responseData = { assessment_group: [{ id: 1 }] };
      server.use(
        rest.get('*/assessment_groups/1/contents', (req, res, ctx) =>
          res(ctx.json(responseData))
        )
      );

      fetchAssessmentWithAnswers(1)(dispatch, getState);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          fetchAssessmentWithAnswersSuccess(1, responseData.assessment_group)
        );
      });
    });
  });
});
