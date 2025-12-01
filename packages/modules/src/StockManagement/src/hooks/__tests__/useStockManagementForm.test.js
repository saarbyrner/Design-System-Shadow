import { renderHook, act } from '@testing-library/react-hooks';
import useStockManagementForm, {
  initialFormState,
} from '../useStockManagementForm';

describe('useStockManagementForm', () => {
  it('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useStockManagementForm());
    const { formState, dispatch } = result.current;

    expect(formState).toEqual(initialFormState);

    act(() => {
      dispatch({
        type: 'CLEAR_FORM',
      });
    });
    expect(result.current.formState).toEqual(initialFormState);
  });

  it('returns correct state on SET_DRUG', () => {
    const { result } = renderHook(() => useStockManagementForm());
    const { formState, dispatch } = result.current;

    expect(formState.drug.label).toEqual('');
    expect(formState.drug.value).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_DRUG',
        drug: {
          label: 'Ibuprofen',
          value: '22',
        },
      });
    });
    expect(result.current.formState.drug.label).toEqual('Ibuprofen');
    expect(result.current.formState.drug.value).toEqual('22');
  });

  it('returns correct state on SET_LOT_NUMBER', () => {
    const { result } = renderHook(() => useStockManagementForm());
    const { formState, dispatch } = result.current;

    expect(formState.lotNumber).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_LOT_NUMBER',
        lotNumber: '345',
      });
    });
    expect(result.current.formState.lotNumber).toEqual('345');
  });

  it('returns correct state on SET_EXPIRATION_DATE', () => {
    const { result } = renderHook(() => useStockManagementForm());
    const { formState, dispatch } = result.current;

    expect(formState.expirationDate).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_EXPIRATION_DATE',
        expirationDate: '2022-11-18',
      });
    });
    expect(result.current.formState.expirationDate).toEqual('2022-11-18');
  });

  it('returns correct state on SET_QUANTITY', () => {
    const { result } = renderHook(() => useStockManagementForm());
    const { formState, dispatch } = result.current;

    expect(formState.quantity).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_QUANTITY',
        quantity: 900,
      });
    });
    expect(result.current.formState.quantity).toEqual(900);
  });

  it('returns correct state on SET_STOCK_REMOVAL_REASON', () => {
    const { result } = renderHook(() => useStockManagementForm());
    const { formState, dispatch } = result.current;

    expect(formState.removalReason).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_STOCK_REMOVAL_REASON',
        removalReason: 4,
      });
    });
    expect(result.current.formState.removalReason).toEqual(4);
  });

  it('returns correct state on SET_NOTE_CONTENT', () => {
    const { result } = renderHook(() => useStockManagementForm());
    const { formState, dispatch } = result.current;

    expect(formState.noteContent).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_NOTE_CONTENT',
        noteContent: 'Test note content',
      });
    });
    expect(result.current.formState.noteContent).toEqual('Test note content');
  });
});
