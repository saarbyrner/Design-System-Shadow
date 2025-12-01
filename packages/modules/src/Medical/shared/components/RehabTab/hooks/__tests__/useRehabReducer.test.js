import { renderHook, act } from '@testing-library/react-hooks';
import fetchedRehabSessions from '@kitman/services/src/mocks/handlers/rehab/getFetchedRehabSessions';
import rehabStateData from './rehabStateData';
import { useRehabReducer, getInitialState } from '../useRehabReducer';

describe('useRehabReducer', () => {
  /* use this function to set the fetched rehab sessions in state */
  const fetchedRehabSession = (result) => {
    act(() => {
      result.current.dispatch({
        type: 'SET_REHAB_SESSIONS',
        rehabSessions: fetchedRehabSessions,
      });
    });
  };

  it('sets the rehab session in rehab state', () => {
    const { result } = renderHook(() => useRehabReducer());
    expect(result.current.rehabState).toEqual(getInitialState());
    fetchedRehabSession(result);

    expect(result.current.rehabState).toEqual(rehabStateData);
  });

  it('replaces a session in rehab state', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    const replacementSession = {
      id: 200,
      start_time: '2022-12-01T12:00:00+00:00',
      end_time: '2022-12-01T12:00:00+00:00',
      timezone: 'Europe/Dublin',
      title: 'General',
      sections: [
        {
          id: 200,
          title: 'General',
          theme_color: null,
          order_index: 1,
          exercise_instances: [
            {
              id: 10,
              exercise_template_id: 81,
              exercise_name: '4 Way Ankle Theraband',
              variations: [
                {
                  key: 'sets_reps',
                  parameters: [
                    {
                      key: 'reps',
                      value: '1',
                      config: {},
                    },
                    {
                      key: 'sets',
                      value: '1',
                      config: {},
                    },
                  ],
                },
              ],
              comment: null,
              order_index: 1,
              section_id: 200,
              session_id: 200,
            },
          ],
        },
      ],
    };

    act(() => {
      result.current.dispatch({
        type: 'REPLACE_SESSION',
        previousIdForSession: -2,
        session: replacementSession,
        makeExerciseInstancesEditable: false,
        initialExerciseInstances: null,
        sectionId: null, // Section id in session we added to
      });
    });

    expect(result.current.rehabState.sections[200].exercise_instances).toEqual(
      replacementSession.sections[0].exercise_instances
    );

    // Annotations are maintained when session is replaced
    expect(result.current.rehabState.sessions[1].annotations).toEqual(['test']);
  });

  it('sets a highlighted session', () => {
    const { result } = renderHook(() => useRehabReducer());
    act(() => {
      result.current.dispatch({
        type: 'HIGHLIGHT_SESSION',
        sessionId: 5,
      });
    });
    expect(result.current.rehabState.highlightedSessionId).toEqual(5);
  });

  it('sets a target session and section for click to add mode', () => {
    const { result } = renderHook(() => useRehabReducer());
    act(() => {
      result.current.dispatch({
        type: 'SET_CLICK_MODE_TARGET',
        target: { targetSectionId: 1, targetSessionId: 2 },
      });
    });
    expect(result.current.rehabState.clickModeTarget).toEqual({
      targetSectionId: 1,
      targetSessionId: 2,
    });
  });

  it('replaces a session in rehab state and updates the highlighted session id and click mode target', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    const exerciseInstance = {
      id: 200,
      start_time: '2022-12-01T12:00:00+00:00',
      end_time: '2022-12-01T12:00:00+00:00',
      timezone: 'Europe/Dublin',
      title: 'General',
      sections: [
        {
          id: 200,
          title: 'General',
          theme_color: null,
          order_index: 1,
          exercise_instances: [
            {
              id: 10,
              exercise_template_id: 81,
              exercise_name: '4 Way Ankle Theraband',
              variations: [
                {
                  key: 'sets_reps',
                  parameters: [
                    {
                      key: 'reps',
                      value: '1',
                      config: {},
                    },
                    {
                      key: 'sets',
                      value: '1',
                      config: {},
                    },
                  ],
                },
              ],
              comment: null,
              order_index: 1,
              section_id: 200,
              session_id: 200,
            },
          ],
        },
      ],
    };
    act(() => {
      result.current.dispatch({
        type: 'SET_REHAB_SESSIONS',
        rehabSessions: fetchedRehabSessions,
      });
    });

    act(() => {
      result.current.dispatch({
        type: 'HIGHLIGHT_SESSION',
        sessionId: -2,
      });
    });

    act(() => {
      result.current.dispatch({
        type: 'SET_CLICK_MODE_TARGET',
        target: { targetSectionId: -2, targetSessionId: -2 },
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'REPLACE_SESSION',
        previousIdForSession: -2,
        session: exerciseInstance,
        makeExerciseInstancesEditable: false,
        initialExerciseInstances: null,
        sectionId: null, // Section id in session we added to
      });
    });

    expect(result.current.rehabState.sections[200].exercise_instances).toEqual(
      exerciseInstance.sections[0].exercise_instances
    );

    expect(result.current.rehabState.highlightedSessionId).toEqual(200);

    expect(result.current.rehabState.clickModeTarget).toEqual({
      targetSectionId: 200,
      targetSessionId: 200,
    });
  });

  it('sets an exercise item template as active item/dragged item', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    const activeTemplate = {
      type: 'exerciseTemplate',
      id: 'exercise_78_1',
      exercise_template_id: 78,
      exercise_name: '3 Way SLR',
      comment: null,
      variations: [
        {
          key: 'sets_reps',
          parameters: [
            {
              key: 'reps',
              label: 'Reps',
              value: 1,
              config: {},
            },
            {
              key: 'sets',
              label: 'Sets',
              value: 1,
              config: {},
            },
          ],
        },
      ],
      defaultVariationsType: 'sets_reps',
      exerciseId: 'exercise_78',
    };
    act(() => {
      result.current.dispatch({
        type: 'SET_ACTIVE_ITEM',
        activeItem: activeTemplate,
      });
    });
    expect(result.current.rehabState.activeItem).toEqual(activeTemplate);
  });

  it('adds an exercise item to the copy array', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);

    act(() => {
      result.current.dispatch({
        type: 'ADD_EXERCISE_TO_COPY_ARRAY',
        exerciseId: 12,
        exerciseSelected: true,
      });
    });
    expect(result.current.rehabState.copyExerciseIds).toContain(12);

    act(() => {
      result.current.dispatch({
        type: 'ADD_EXERCISE_TO_COPY_ARRAY',
        exerciseId: 12,
        exerciseSelected: false,
      });
    });
    expect(result.current.rehabState.copyExerciseIds).not.toContain(12);
  });

  it('adds/removes a whole session the copy exercises array', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    act(() => {
      result.current.dispatch({
        type: 'ADD_EXERCISE_SESSION_TO_COPY_ARRAY',
        sessionId: 5,
        exercisesSelected: true,
      });
    });
    expect(result.current.rehabState.copyExerciseIds).toEqual([11, 12, 13]);

    act(() => {
      result.current.dispatch({
        type: 'CLEAR_COPY_SELECTIONS',
      });
    });
    expect(result.current.rehabState.copyExerciseIds).toEqual([]);
  });

  it('adds an exercise item to the edit array and clearing of the edit array', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);

    act(() => {
      result.current.dispatch({
        type: 'ADD_EXERCISE_TO_EDIT_ARRAY',
        exerciseId: 12,
      });
    });
    expect(result.current.rehabState.editingExerciseIds).toContain(12);

    act(() => {
      result.current.dispatch({
        type: 'CLEAR_EDITING_EXERCISE_IDS',
      });
    });
    expect(result.current.rehabState.editingExerciseIds).toEqual([]);
  });

  it('adds two exercise items to the edit array and removes one item', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);

    act(() => {
      result.current.dispatch({
        type: 'ADD_EXERCISE_TO_EDIT_ARRAY',
        exerciseId: 12,
      });

      result.current.dispatch({
        type: 'ADD_EXERCISE_TO_EDIT_ARRAY',
        exerciseId: 34,
      });
    });
    expect(result.current.rehabState.editingExerciseIds).toContain(12);
    expect(result.current.rehabState.editingExerciseIds).toContain(34);

    act(() => {
      result.current.dispatch({
        type: 'REMOVE_EXERCISE_FROM_EDIT_ARRAY',
        exerciseId: 34,
      });
    });
    expect(result.current.rehabState.editingExerciseIds).toContain(12);
    expect(result.current.rehabState.editingExerciseIds).not.toContain(34);
  });

  it('adds all exercise items to the edit array', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    act(() => {
      result.current.dispatch({
        type: 'EDIT_ALL_EXERCISES',
      });
    });
    expect(result.current.rehabState.editingExerciseIds.length).toEqual(9);
  });

  it('deletes an exercise item from a section', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    expect(
      result.current.rehabState.sections[5].exercise_instances.length
    ).toEqual(3);
    act(() => {
      result.current.dispatch({
        type: 'DELETE_EXERCISE',
        exerciseId: 12,
        sectionId: 5,
      });
    });
    expect(
      result.current.rehabState.sections[5].exercise_instances.length
    ).toEqual(2);
  });

  it('adds another variation to an exercise item, and changes a variation type', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    expect(
      result.current.rehabState.sections[5].exercise_instances[0].variations
        .length
    ).toEqual(1);
    act(() => {
      result.current.dispatch({
        type: 'UPDATE_EXERCISE_VARIATION_TYPE',
        exerciseId: 11,
        sectionId: 5,
        variationIndex: 1,
        variations: [
          {
            key: 'duration',
            parameters: [
              {
                key: 'duration',
                value: '5',
                config: {
                  unit: 'min',
                },
              },
            ],
          },
          {
            key: 'sets_reps',
            parameters: [
              {
                key: 'reps',
                value: '1',
                config: {},
              },
              {
                key: 'sets',
                value: '1',
                config: {},
              },
            ],
          },
        ],
      });
    });

    expect(
      result.current.rehabState.sections[5].exercise_instances[0].variations
        .length
    ).toEqual(2);

    act(() => {
      result.current.dispatch({
        type: 'UPDATE_EXERCISE_VARIATION_TYPE',
        exerciseId: 11,
        sectionId: 5,
        variationIndex: 1,
        variations: [
          {
            key: 'duration',
            parameters: [
              {
                key: 'duration',
                value: '5',
                config: {
                  unit: 'min',
                },
              },
            ],
          },
          {
            key: 'range-of-motion',
            label: 'Range of motion',
            parameters: [
              {
                key: 'range-of-motion',
                label: 'Range of motion',
                value: 0,
                config: {
                  unit: 'in',
                },
              },
            ],
          },
        ],
      });
    });
    // testing sets_reps has changed to range-of-motion
    expect(
      result.current.rehabState.sections[5].exercise_instances[0].variations[1]
        .key
    ).toEqual('range-of-motion');
  });

  it('updates an exercises property', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    act(() => {
      result.current.dispatch({
        type: 'UPDATE_EXERCISE_PROPERTY',
        exerciseId: 11,
        sectionId: 5,
        propertyKey: 'comment',
        value: 'ADDING TEST COMMENT',
      });
    });
    expect(
      result.current.rehabState.sections[5].exercise_instances[0].comment
    ).toEqual('ADDING TEST COMMENT');
  });

  it('updates action status', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    act(() => {
      result.current.dispatch({
        type: 'UPDATE_ACTION_STATUS',
        actionStatus: 'PENDING',
        actionType: 'CREATE_SESSION',
      });
    });
    expect(result.current.rehabState.actionStatus).toEqual('PENDING');
    expect(result.current.rehabState.actionType).toEqual('CREATE_SESSION');
    expect(result.current.rehabState.displayMessage).toEqual(null);
  });

  it('updates action status with a message', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    act(() => {
      result.current.dispatch({
        type: 'UPDATE_ACTION_STATUS',
        actionStatus: 'FAILURE',
        actionType: 'COPY_EXERCISE',
        message: 'Test string to show',
      });
    });
    expect(result.current.rehabState.actionStatus).toEqual('FAILURE');
    expect(result.current.rehabState.actionType).toEqual('COPY_EXERCISE');
    expect(result.current.rehabState.displayMessage).toEqual(
      'Test string to show'
    );
  });

  it('updates exercise variation property value', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    const variation = {
      key: 'sets-reps-minutes',
      variations: [
        {
          key: 'sets',
          label: 'Sets',
          param_key: 'parameter1',
          type: 'count',
          unit: 'no.',
          value: '1',
        },
        {
          key: 'reps',
          label: 'Reps',
          param_key: 'parameter2',
          type: 'count',
          unit: 'no.',
          value: '33',
        },
        {
          key: 'minutes',
          label: 'Minutes',
          param_key: 'parameter3',
          type: 'time',
          unit: 'min',
          value: null,
        },
      ],
    };

    act(() => {
      result.current.dispatch({
        type: 'UPDATE_EXERCISE_VARIATION_PROPERTY',
        actionStatus: 'PENDING',
        exerciseId: 11,
        sectionId: 5,
        variationIndex: 0,
        parameterIndex: 0,
        exerciseParameters: variation,
      });
    });
    expect(
      result.current.rehabState.sections[5].exercise_instances[0].variations[0]
        .parameters
    ).toEqual(variation);
  });

  it('sets an exercise item as active item/dragged item', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    act(() => {
      result.current.dispatch({
        type: 'ASSIGN_EXERCISE_AS_ACTIVE_ITEM',
        sectionId: 5,
        index: 0,
      });
    });
    const activeItem = {
      id: 11,
      exercise_template_id: 59,
      exercise_name: 'Active Stretch',
      variations: [
        {
          key: 'duration',
          parameters: [
            {
              key: 'duration',
              value: '5',
              config: {
                unit: 'min',
              },
            },
          ],
        },
      ],
      comment: null,
      order_index: 1,
      section_id: 5,
      session_id: 5,
    };
    act(() => {
      result.current.dispatch({
        type: 'ASSIGN_EXERCISE_AS_ACTIVE_ITEM',
        sectionId: 5,
        index: 0,
      });
    });
    expect(result.current.rehabState.activeItem).toEqual(activeItem);
  });

  it('removes a variation from an item', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    const newVariation = [
      {
        key: 'duration',
        parameters: [
          {
            key: 'duration',
            value: '5',
            config: {
              unit: 'min',
            },
          },
        ],
      },
    ];
    expect(
      result.current.rehabState.sections[5].exercise_instances[1].variations
        .length
    ).toEqual(2);
    act(() => {
      result.current.dispatch({
        type: 'REMOVE_EXERCISE_VARIATION',
        exerciseId: 12,
        sectionId: 5,
        variations: newVariation,
      });
    });
    expect(
      result.current.rehabState.sections[5].exercise_instances[1].variations
        .length
    ).toEqual(1);
  });

  it('moves an items position within a section', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    const updatedSection = {
      id: 5,
      title: 'General',
      theme_color: null,
      order_index: 1,
      exercise_instances: [
        {
          id: 12,
          exercise_template_id: 59,
          exercise_name: 'Active Stretch',
          variations: [
            {
              key: 'duration',
              parameters: [
                {
                  key: 'duration',
                  value: '5',
                  config: {
                    unit: 'min',
                  },
                },
              ],
            },
            {
              key: 'sets_reps',
              parameters: [
                {
                  key: 'reps',
                  value: '1',
                  config: {},
                },
                {
                  key: 'sets',
                  value: '1',
                  config: {},
                },
              ],
            },
          ],
          comment: null,
          order_index: 1,
          section_id: 5,
          session_id: 5,
        },
        {
          id: 13,
          exercise_template_id: 80,
          exercise_name: '1/2 Kneeling Ankle Mobility ',
          variations: [
            {
              key: 'sets_reps',
              parameters: [
                {
                  key: 'reps',
                  value: '1',
                  config: {},
                },
                {
                  key: 'sets',
                  value: '1',
                  config: {},
                },
              ],
            },
          ],
          comment: null,
          order_index: 2,
          section_id: 5,
          session_id: 5,
        },
        {
          id: 11,
          exercise_template_id: 59,
          exercise_name: 'Active Stretch',
          variations: [
            {
              key: 'duration',
              parameters: [
                {
                  key: 'duration',
                  value: '5',
                  config: {
                    unit: 'min',
                  },
                },
              ],
            },
          ],
          comment: null,
          order_index: 3,
          section_id: 5,
          session_id: 5,
        },
      ],
    };
    act(() => {
      result.current.dispatch({
        type: 'ASSIGN_EXERCISE_AS_ACTIVE_ITEM',
        sectionId: 5,
        index: 0,
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'MOVE_ACTIVE_ITEM_IN_SECTION',
        sectionId: 5,
        currentIndex: 0,
        updatedPositionIndex: 2,
      });
    });

    // check the maintenance values of dropped positions are updated accordingly
    expect(result.current.rehabState.lastMovedToNewSectionItemId).toEqual(11);
    expect(result.current.rehabState.lastOrderIndex).toEqual(1);
    expect(result.current.rehabState.lastSectionAddedToId).toEqual(5);
    expect(result.current.rehabState.originalSectionId).toEqual(5);
    expect(result.current.rehabState.originalSessionId).toEqual(5);

    // check the sections where updated accordingly
    expect(result.current.rehabState.sections[5]).toEqual(updatedSection);
  });

  it('moves an item to another rehab session and section', () => {
    const { result } = renderHook(() => useRehabReducer());
    fetchedRehabSession(result);
    const updatedSection = {
      id: 16,
      title: 'General',
      theme_color: null,
      order_index: 1,
      exercise_instances: [
        {
          id: 11,
          exercise_template_id: 59,
          exercise_name: 'Active Stretch',
          variations: [
            {
              key: 'duration',
              parameters: [
                {
                  key: 'duration',
                  value: '5',
                  config: {
                    unit: 'min',
                  },
                },
              ],
            },
          ],
          comment: null,
          order_index: 1,
          section_id: 16,
          session_id: 16,
        },
        {
          id: 9,
          exercise_template_id: 78,
          exercise_name: '3 Way SLR',
          variations: [
            {
              key: 'sets_reps',
              parameters: [
                {
                  key: 'reps',
                  value: '1',
                  config: {},
                },
                {
                  key: 'sets',
                  value: '1',
                  config: {},
                },
              ],
            },
          ],
          comment: null,
          order_index: 2,
          section_id: 16,
          session_id: 16,
        },
      ],
    };

    expect(
      result.current.rehabState.sections[5].exercise_instances.length
    ).toEqual(3);
    act(() => {
      result.current.dispatch({
        type: 'ASSIGN_EXERCISE_AS_ACTIVE_ITEM',
        sectionId: 5,
        index: 0,
      });
    });
    act(() => {
      result.current.dispatch({
        type: 'MOVE_ACTIVE_ITEM_TO_NEW_SECTION',
        sectionId: 16,
        sessionId: 16,
        positionIndex: 0,
      });
    });
    // check that an item has been removed from the section where the active item existed
    expect(
      result.current.rehabState.sections[5].exercise_instances.length
    ).toEqual(2);
    // check that the updated section has added the new item
    expect(result.current.rehabState.sections[16]).toEqual(updatedSection);
  });
});
