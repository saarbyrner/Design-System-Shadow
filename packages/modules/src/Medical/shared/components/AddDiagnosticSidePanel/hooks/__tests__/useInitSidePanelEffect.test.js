import { renderHook } from '@testing-library/react-hooks';
import useInitSidePanelEffect from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useInitSidePanelEffect';

jest.mock('@kitman/services', () => ({
  getClinicalImpressionsBodyAreas: jest.fn().mockResolvedValue([{ id: 1 }]),
}));

describe('useInitSidePanelEffect', () => {
  it('initialises on open: fetches user/body areas, seeds items, sets athlete, fetches athlete data', async () => {
    const fetchCurrentUser = jest.fn();
    const fetchAthleteData = jest.fn();
    const setBodyAreas = jest.fn();
    const dispatch = jest.fn();
    const editorRefs = { current: [] };
    const setIsValidationCheckAllowed = jest.fn();

    renderHook(() =>
      useInitSidePanelEffect({
        isOpen: true,
        athleteId: 123,
        fetchCurrentUser,
        fetchAthleteData,
        setBodyAreas,
        dispatch,
        editorRefs,
        setIsValidationCheckAllowed,
      })
    );

    expect(fetchCurrentUser).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD_ANOTHER_BILLABLE_ITEM',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_ATHLETE_ID',
      athleteId: 123,
    });
    expect(fetchAthleteData).toHaveBeenCalledWith(123);
  });

  it('clears on close: resets editors, clears form and validation', () => {
    const fetchCurrentUser = jest.fn();
    const fetchAthleteData = jest.fn();
    const setBodyAreas = jest.fn();
    const dispatch = jest.fn();
    const setContent = jest.fn();
    const editorRefs = { current: [{ setContent }] };
    const setIsValidationCheckAllowed = jest.fn();

    renderHook(() =>
      useInitSidePanelEffect({
        isOpen: false,
        athleteId: null,
        fetchCurrentUser,
        fetchAthleteData,
        setBodyAreas,
        dispatch,
        editorRefs,
        setIsValidationCheckAllowed,
      })
    );

    expect(setContent).toHaveBeenCalled();
    expect(setIsValidationCheckAllowed).toHaveBeenCalledWith(false);
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_FORM' });
  });
});
