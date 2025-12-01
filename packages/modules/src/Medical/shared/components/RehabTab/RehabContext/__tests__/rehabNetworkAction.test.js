import { server, rest } from '@kitman/services/src/mocks/server';
import deleteSessionData from '@kitman/services/src/mocks/handlers/rehab/deleteSession/deleteData.mock';
import rehabNetworkActions from '../rehabNetworkActions';

describe('rehabNetworkActions', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('updateExerciseValue dispatches correct actions', async () => {
    server.use(
      rest.put('/ui/medical/rehab/session_exercises', (req, res, ctx) => {
        return res(ctx.json({}), ctx.status(200));
      })
    );

    const { updateExerciseValue } = rehabNetworkActions(dispatchSpy, () => {});

    await updateExerciseValue({});

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'UPDATE_EXERCISE',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'SUCCESS',
      actionType: 'UPDATE_EXERCISE',
    });
  });

  test('updateExerciseValue handles Forbidden server error array', async () => {
    server.use(
      rest.put('/ui/medical/rehab/session_exercises', (req, res, ctx) => {
        return res(
          ctx.json({
            errors: ['Backend translated message'],
          }),
          ctx.status(403)
        );
      })
    );

    const { updateExerciseValue } = rehabNetworkActions(dispatchSpy, () => {});

    await updateExerciseValue({});

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'UPDATE_EXERCISE',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'FAILURE',
      actionType: 'UPDATE_EXERCISE',
      message: 'Backend translated message',
    });
  });

  test('updateExerciseValue handles Forbidden server error string', async () => {
    server.use(
      rest.put('/ui/medical/rehab/session_exercises', (req, res, ctx) => {
        return res(
          ctx.json({
            errors: 'Backend translated message string',
          }),
          ctx.status(403)
        );
      })
    );

    const { updateExerciseValue } = rehabNetworkActions(dispatchSpy, () => {});

    await updateExerciseValue({});

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'UPDATE_EXERCISE',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'FAILURE',
      actionType: 'UPDATE_EXERCISE',
      message: 'Backend translated message string',
    });
  });

  test('deleteExercise dispatches correct actions', async () => {
    server.use(
      rest.delete('/ui/medical/rehab/session_exercises', (req, res, ctx) => {
        return res(ctx.json({}), ctx.status(200));
      })
    );

    const { deleteExercise } = rehabNetworkActions(dispatchSpy, () => {});

    await deleteExercise(1, 1, 1, false);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'DELETE_EXERCISE',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'DELETE_EXERCISE',
      exerciseId: 1,
      sectionId: 1,
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'SUCCESS',
      actionType: 'DELETE_EXERCISE',
    });
  });

  test('deleteExercise handles Forbidden server error', async () => {
    server.use(
      rest.delete('/ui/medical/rehab/session_exercises', (req, res, ctx) => {
        return res(
          ctx.json({
            errors: ['Organisation does not have access to this record'],
          }),
          ctx.status(403)
        );
      })
    );

    const { deleteExercise } = rehabNetworkActions(dispatchSpy, () => {});

    await deleteExercise(1, 1, 1, false);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'DELETE_EXERCISE',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'FAILURE',
      actionType: 'DELETE_EXERCISE',
      message: 'Organisation does not have access to this record',
    });
  });

  test('deleteEntireSession dispatches correct actions', async () => {
    server.use(
      rest.delete('/ui/medical/rehab/session_exercises', (req, res, ctx) => {
        return res(ctx.json({}), ctx.status(200));
      })
    );

    const { deleteEntireSession } = rehabNetworkActions(dispatchSpy, () => {});

    await deleteEntireSession({
      rehab_sessions: [{ id: 1, section_ids: [] }],
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'DELETE_SESSION',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'REPLACE_SESSION',
      previousIdForSession: 1,
      session: deleteSessionData[0],
      initialExerciseInstances: null,
      sectionId: null,
      makeExerciseInstancesEditable: false,
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'SUCCESS',
      actionType: 'DELETE_SESSION',
    });
  });

  test('createSession dispatches correct actions', async () => {
    server.use(
      rest.post('/ui/medical/rehab/session_exercises', (req, res, ctx) => {
        return res(ctx.json({}), ctx.status(200));
      })
    );

    const { addToSession } = rehabNetworkActions(dispatchSpy, () => {});

    await addToSession({
      data: {
        athleteId: 1,
        issueId: 1,
        issueType: 'Injury',
        exerciseInstances: [],
        makeExerciseInstancesEditable: true,
        placeholderSessionId: -1,
        sessionId: 1,
        sessionDate: null,
        sectionId: 1,
        maintenance: false,
      },
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'CREATE_SESSION',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'REPLACE_SESSION',
      previousIdForSession: -1,
      session: {},
      makeExerciseInstancesEditable: true,
      initialExerciseInstances: [],
      sectionId: 1,
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'SUCCESS',
      actionType: 'CREATE_SESSION',
    });
  });

  test('createSession handles Forbidden server error', async () => {
    server.use(
      rest.post('/ui/medical/rehab/session_exercises', (req, res, ctx) => {
        return res(
          ctx.json({
            errors: ['Organisation does not have access to this record'],
          }),
          ctx.status(403)
        );
      })
    );

    const { addToSession } = rehabNetworkActions(dispatchSpy, () => {});

    await addToSession({
      data: {
        athleteId: 1,
        issueId: 1,
        issueType: 'Injury',
        exerciseInstances: [],
        makeExerciseInstancesEditable: false,
        placeholderSessionId: null,
        sessionId: 1,
        sessionDate: null,
        sectionId: 1,
        maintenance: false,
      },
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'CREATE_SESSION',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'FAILURE',
      actionType: 'CREATE_SESSION',
      message: 'Organisation does not have access to this record',
    });
  });

  test('copyExercise dispatches correct actions', async () => {
    server.use(
      rest.post('/ui/medical/rehab/session_exercises/copy', (req, res, ctx) => {
        return res(ctx.json({}), ctx.status(200));
      })
    );

    const { copyExercise } = rehabNetworkActions(dispatchSpy, () => {});

    await copyExercise({});

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'COPY_EXERCISE',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'CLEAR_COPY_SELECTIONS',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'SUCCESS',
      actionType: 'COPY_EXERCISE',
    });
  });

  test('copyExercise handles Forbidden server error', async () => {
    server.use(
      rest.post('/ui/medical/rehab/session_exercises/copy', (req, res, ctx) => {
        return res(
          ctx.json({
            errors: ['Organisation does not have access to this record'],
          }),
          ctx.status(403)
        );
      })
    );

    const { copyExercise } = rehabNetworkActions(dispatchSpy, () => {});

    await copyExercise({});

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'COPY_EXERCISE',
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'FAILURE',
      actionType: 'COPY_EXERCISE',
      message: 'Organisation does not have access to this record',
    });
  });
});
