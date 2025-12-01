import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import useDiagnosticGroupSetsEffect from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDiagnosticGroupSetsEffect';

const mockGetDiagnosticTypeGroupSets = jest.fn();
jest.mock('@kitman/services', () => ({
  getDiagnosticTypeGroupSets: (...args) =>
    mockGetDiagnosticTypeGroupSets(...args),
}));

describe('useDiagnosticGroupSetsEffect', () => {
  beforeEach(() => mockGetDiagnosticTypeGroupSets.mockReset());

  it('maps and sets diagnostic type groups when locationId is present', async () => {
    const setDiagnosticGroupSets = jest.fn();
    const setRequestIssuesStatus = jest.fn();
    mockGetDiagnosticTypeGroupSets.mockResolvedValueOnce([
      {
        id: 10,
        name: 'GroupA',
        diagnostic_types: [
          { id: 1, name: 'Type1' },
          { id: 2, name: 'Type2' },
        ],
      },
    ]);

    renderHook(() =>
      useDiagnosticGroupSetsEffect({
        locationId: 99,
        setDiagnosticGroupSets,
        setRequestIssuesStatus,
      })
    );

    await Promise.resolve();
    expect(setDiagnosticGroupSets).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          value: 'order_sets_10',
          type: 'order set',
          options: expect.arrayContaining([
            expect.objectContaining({ value: 1, label: 'Type1' }),
            expect.objectContaining({ value: 2, label: 'Type2' }),
          ]),
        }),
      ])
    );
    expect(setRequestIssuesStatus).not.toHaveBeenCalledWith('FAILURE');
  });

  it('sets FAILURE on error', async () => {
    const setDiagnosticGroupSets = jest.fn();
    const setRequestIssuesStatus = jest.fn();
    mockGetDiagnosticTypeGroupSets.mockRejectedValueOnce(new Error('nope'));

    renderHook(() =>
      useDiagnosticGroupSetsEffect({
        locationId: 99,
        setDiagnosticGroupSets,
        setRequestIssuesStatus,
      })
    );

    await waitFor(() =>
      expect(setRequestIssuesStatus).toHaveBeenCalledWith('FAILURE')
    );
  });
});
