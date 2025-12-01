import { renderHook } from '@testing-library/react-hooks';
import usePreloadIssueAndDatesEffect from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/usePreloadIssueAndDatesEffect';

describe('usePreloadIssueAndDatesEffect', () => {
  it('preloads dates for current athlete on open when not editing', () => {
    const dispatch = jest.fn();

    renderHook(() =>
      usePreloadIssueAndDatesEffect({
        isOpen: true,
        isEditing: false,
        organisationStatus: 'CURRENT_ATHLETE',
        issue: null,
        issueType: null,
        isChronicIssue: false,
        dateTransferFormat: 'YYYY-MM-DD',
        dispatch,
      })
    );

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_MULTI_ORDER_DATE', index: 0 })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_MULTI_ORDER_APPOINTMENT_DATE',
        index: 0,
      })
    );
  });

  it('preselects associated injury id when provided', () => {
    const dispatch = jest.fn();

    renderHook(() =>
      usePreloadIssueAndDatesEffect({
        isOpen: true,
        isEditing: true,
        organisationStatus: 'CURRENT_ATHLETE',
        issue: { id: 99, issue_id: 77 },
        issueType: 'Injury',
        isChronicIssue: false,
        dateTransferFormat: 'YYYY-MM-DD',
        dispatch,
      })
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_INJURY_IDS',
      injuryIds: [77],
    });
  });
});
