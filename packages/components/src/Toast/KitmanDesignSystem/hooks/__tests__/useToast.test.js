import { renderHook, act } from '@testing-library/react-hooks';
import useToasts from '../useToasts';

describe('useToasts', () => {
  it('returns correct state on CREATE_TOAST', () => {
    const { result } = renderHook(() => useToasts());
    const { toasts, toastDispatch } = result.current;

    expect(toasts).toEqual([]);

    act(() => {
      toastDispatch({
        type: 'CREATE_TOAST',
        toast: {
          status: 'SUCCESS',
          title: 'Mock toast',
          description: 'Mock description',
          links: [{ text: 'Mock link', link: 'www.google.es' }],
        },
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].status).toBe('SUCCESS');
    expect(result.current.toasts[0].title).toBe('Mock toast');
    expect(result.current.toasts[0].description).toBe('Mock description');
    expect(result.current.toasts[0].links).toEqual([
      { text: 'Mock link', link: 'www.google.es' },
    ]);
  });

  it('returns correct state on UPDATE_TOAST', () => {
    const { result } = renderHook(() =>
      useToasts([
        {
          id: 1,
          status: 'INFO',
          title: 'Mock toast',
        },
      ])
    );
    const { toasts, toastDispatch } = result.current;
    expect(toasts).toHaveLength(1);

    act(() => {
      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 1,
          status: 'SUCCESS',
          title: 'Mock toast updated successfully',
        },
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].status).toBe('SUCCESS');
    expect(result.current.toasts[0].title).toBe(
      'Mock toast updated successfully'
    );
  });

  it('returns correct state on REMOVE_TOAST_BY_ID', () => {
    const { result } = renderHook(() =>
      useToasts([
        {
          id: 1,
          status: 'SUCCESS',
          title: 'Mock toast',
        },
      ])
    );
    const { toasts, toastDispatch } = result.current;
    expect(toasts).toHaveLength(1);

    act(() => {
      toastDispatch({
        type: 'REMOVE_TOAST_BY_ID',
        id: 1,
      });
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
