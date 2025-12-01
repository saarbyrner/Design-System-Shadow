import { renderHook } from '@testing-library/react-hooks';
import useDefaultReasonEffect from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDefaultReasonEffect';

describe('useDefaultReasonEffect', () => {
  it('sets default reason to injury/illness when associated issues are present', () => {
    const dispatch = jest.fn();
    const enrichedAthleteIssues = [
      { options: [{ value: 1 }] },
      { options: [] },
      { options: [] },
    ];

    renderHook(() =>
      useDefaultReasonEffect({
        isEditing: false,
        athleteId: 1,
        enrichedAthleteIssues,
        issueId: null,
        injuryIllnessReasonId: 500,
        dispatch,
      })
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_REASON_ID',
      reasonId: 500,
    });
  });
});
