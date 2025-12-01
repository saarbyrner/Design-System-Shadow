import { waitFor } from '@testing-library/react';
import { server, rest } from '@kitman/services/src/mocks/server';

import {
  clearEditedSessionAssessments,
  sessionAssessmentRequestPending,
  sessionAssessmentRequestFailure,
  sessionAssessmentRequestSuccess,
  setSessionTemplates,
  getSessionTemplates,
  saveSelectedAssessmentTypes,
} from '../sessionAssessments';

const sessionTemplatesUrl = '/planning_hub/settings/fetch_settings';
const bulkUpdateUrl = '/planning_hub/settings/bulk_update';

describe('sessionAssessments actions', () => {
  it('should create an action to clear edited session assessments', () => {
    const expectedAction = {
      type: 'CLEAR_EDITED_SESSION_ASSESSMENTS',
    };
    expect(clearEditedSessionAssessments()).toEqual(expectedAction);
  });

  it('should create an action for session assessment request pending', () => {
    const expectedAction = {
      type: 'SESSION_ASSESSMENT_REQUEST_PENDING',
    };
    expect(sessionAssessmentRequestPending()).toEqual(expectedAction);
  });

  it('should create an action for session assessment request failure', () => {
    const expectedAction = {
      type: 'SESSION_ASSESSMENT_REQUEST_FAILURE',
    };
    expect(sessionAssessmentRequestFailure()).toEqual(expectedAction);
  });

  it('should create an action for session assessment request success', () => {
    const expectedAction = {
      type: 'SESSION_ASSESSMENT_REQUEST_SUCCESS',
    };
    expect(sessionAssessmentRequestSuccess()).toEqual(expectedAction);
  });

  it('should create an action to set session templates', () => {
    const data = [
      {
        id: 48,
        name: 'Line Outs',
        templates: [{ id: 182, name: 'Create Template' }],
      },
    ];
    const expectedAction = {
      type: 'SET_SESSION_TEMPLATES',
      payload: {
        data,
      },
    };
    expect(setSessionTemplates(data)).toEqual(expectedAction);
  });

  describe('getSessionTemplates', () => {
    it('dispatches the correct actions on successful fetch', async () => {
      const mockData = [
        {
          id: 48,
          name: 'Line Outs',
          templates: [{ id: 182, name: 'Create Template' }],
        },
        {
          id: 50,
          name: 'Kicking',
          templates: [],
        },
      ];
      server.use(
        rest.get(sessionTemplatesUrl, (req, res, ctx) => {
          return res(ctx.json(mockData));
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        sessionAssessments: { requestStatus: 'SUCCESS' },
      }));

      await getSessionTemplates()(dispatch, getState);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(3);
      });

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        sessionAssessmentRequestPending()
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        setSessionTemplates(mockData)
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        3,
        sessionAssessmentRequestSuccess()
      );
    });

    it('dispatches the correct actions on failed fetch', async () => {
      server.use(
        rest.get(sessionTemplatesUrl, (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        sessionAssessments: { requestStatus: 'SUCCESS' },
      }));

      await getSessionTemplates()(dispatch, getState);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(2);
      });

      expect(dispatch).toHaveBeenCalledWith(sessionAssessmentRequestPending());
      expect(dispatch).toHaveBeenCalledWith(sessionAssessmentRequestFailure());
    });
  });

  describe('saveSelectedAssessmentTypes', () => {
    it('sends the correct request and dispatches success on successful save', async () => {
      const editedSessionAssessments = { 1: [2, 3, 6, 8] };

      server.use(
        rest.post(bulkUpdateUrl, async (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        sessionAssessments: {
          editedSessionAssessments,
        },
      }));

      await saveSelectedAssessmentTypes()(dispatch, getState);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(3);
      });

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        sessionAssessmentRequestPending()
      );
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function)); // getSessionTemplate Thunk
      expect(dispatch).toHaveBeenNthCalledWith(
        3,
        clearEditedSessionAssessments()
      );
    });

    it('dispatches failure on unsuccessful save', async () => {
      server.use(
        rest.post(bulkUpdateUrl, (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        sessionAssessments: {
          editedSessionAssessments: {},
        },
      }));

      await saveSelectedAssessmentTypes()(dispatch, getState);

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(2);
      });

      expect(dispatch).toHaveBeenCalledWith(sessionAssessmentRequestPending());
      expect(dispatch).toHaveBeenCalledWith(sessionAssessmentRequestFailure());
    });
  });
});
