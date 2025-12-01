import { renderHook, act } from '@testing-library/react-hooks';
import useRehabGroupExercisesForm from '../useRehabGroupExercisesForm';

describe('useRehabGroupExercisesForm', () => {
  it('returns correct state on SET_REHAB_GROUP_NAME', () => {
    const { result } = renderHook(() => useRehabGroupExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.group).toEqual({});
    expect(formState.group.name).toEqual(undefined);

    act(() => {
      dispatch({
        type: 'SET_REHAB_GROUP_NAME',
        group: {
          name: 'Frank Zappa',
        },
      });
    });

    expect(result.current.formState.group.name).toEqual('Frank Zappa');
  });

  it('returns correct state on SET_REHAB_GROUP_COLOR', () => {
    const { result } = renderHook(() => useRehabGroupExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.group).toEqual({});
    expect(formState.group.theme_colour).toEqual(undefined);

    act(() => {
      dispatch({
        type: 'SET_REHAB_GROUP_COLOR',
        group: {
          theme_colour: '#e15a5a',
        },
      });
    });

    expect(result.current.formState.group.theme_colour).toEqual('#e15a5a');
  });

  it('returns correct state on SET_REHAB_GROUP_ID', () => {
    const { result } = renderHook(() => useRehabGroupExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.tag_ids).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_REHAB_GROUP_ID',
        tag_ids: [1, 2, 3],
      });
    });

    expect(result.current.formState.tag_ids).toEqual([1, 2, 3]);
  });

  it('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useRehabGroupExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.group).toEqual({});
    expect(formState.tag_ids).toEqual([]);

    act(() => {
      dispatch({
        type: 'CLEAR_FORM',
      });
    });

    expect(result.current.formState.group).toEqual({});
    expect(result.current.formState.tag_ids).toEqual([]);
  });
});
