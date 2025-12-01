import { renderHook } from '@testing-library/react-hooks';
import { data as officialData } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_official_assignment_csv';
import { data as matchMonitorData } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_match_monitor_assignment_csv';
import useStaffAssignmentUploadGrid from '../useStaffAssignmentUploadGrid';
import { MATCH_MONITOR_ASSIGNMENT, OFFICIAL_ASSIGNMENT } from '../../utils';

describe('useStaffAssignmentUploadGrid', () => {
  const officialTestData = [
    ...officialData.validData,
    ...officialData.invalidData,
  ];

  const matchMonitorTestData = [
    ...matchMonitorData.validData,
    ...matchMonitorData.invalidData,
  ];

  const testArgs = [
    [
      'official assignment',
      {
        data: officialData.validData,
        invalidData: officialData.invalidData,
        userType: OFFICIAL_ASSIGNMENT,
      },
    ],
    [
      'match monitor assignment',
      {
        data: matchMonitorData.validData,
        invalidData: matchMonitorData.invalidData,
        userType: MATCH_MONITOR_ASSIGNMENT,
      },
    ],
  ];

  describe('[initial data]', () => {
    let renderHookResult;

    it.each(testArgs)(
      'returns initial data for %s',
      (assignmentType, testArg) => {
        renderHookResult = renderHook(() =>
          useStaffAssignmentUploadGrid({
            parsedCsv: testArg.data,
            userType: testArg.userType,
          })
        ).result;

        expect(renderHookResult.current).toHaveProperty('grid');

        expect(renderHookResult.current.grid).toHaveProperty('rows');
        expect(renderHookResult.current.grid).toHaveProperty('columns');
        expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
        expect(renderHookResult.current.grid).toHaveProperty('id');
        expect(renderHookResult.current).toHaveProperty('isError');
        expect(renderHookResult.current).toHaveProperty('ruleset');
        expect(renderHookResult.current.grid.emptyTableText).toEqual(
          'No valid data was found in csv.'
        );
      }
    );
  });

  describe('[computed data]', () => {
    let renderHookResult;

    it('correctly parses the official csv data', () => {
      renderHookResult = renderHook(() =>
        useStaffAssignmentUploadGrid({
          parsedCsv: officialTestData,
          userType: OFFICIAL_ASSIGNMENT,
        })
      ).result;

      const columns = renderHookResult.current.grid.columns;
      expect(columns).toHaveLength(3);
      expect(renderHookResult.current.grid.rows.length).toEqual(
        officialTestData.length
      );
      expect(columns[0].id).toEqual('Game ID');
      expect(columns[1].id).toEqual('Email');
      expect(columns[2].id).toEqual('Role');
    });

    it('correctly parses the match monitor csv data', () => {
      renderHookResult = renderHook(() =>
        useStaffAssignmentUploadGrid({
          parsedCsv: matchMonitorTestData,
          userType: MATCH_MONITOR_ASSIGNMENT,
        })
      ).result;

      const columns = renderHookResult.current.grid.columns;
      expect(columns).toHaveLength(2);
      expect(renderHookResult.current.grid.rows.length).toEqual(
        officialTestData.length
      );
      expect(columns[0].id).toEqual('Game ID');
      expect(columns[1].id).toEqual('Email');
    });

    it.each(testArgs)(
      'correctly sets the rows with errors for %s',
      (assignmentType, testArg) => {
        const testDataWithErrorOnLastRow = [
          ...testArg.data,
          ...testArg.invalidData,
        ];
        renderHookResult = renderHook(() =>
          useStaffAssignmentUploadGrid({
            parsedCsv: testDataWithErrorOnLastRow,
            userType: testArg.userType,
          })
        ).result;

        const rows = renderHookResult.current.grid.rows;
        expect(rows.length).toEqual(testDataWithErrorOnLastRow.length);
        expect(rows[0].classnames.is__error).toEqual(false);
        expect(rows[1].classnames.is__error).toEqual(true);
      }
    );

    it.each(testArgs)(
      'exposes the correct values when invalid for %s',
      (assignmentType, testArg) => {
        renderHookResult = renderHook(() =>
          useStaffAssignmentUploadGrid({ parsedCsv: testArg.invalidData })
        ).result;

        expect(renderHookResult.current.isError).toBe(true);
      }
    );

    it.each(testArgs)(
      'exposes the correct values when invalid, when error is not on last row for %s',
      async (assignmentType, testArg) => {
        const testDataWithErrorNotOnLastRow = [
          ...testArg.invalidData,
          ...testArg.data,
        ];

        renderHookResult = renderHook(() =>
          useStaffAssignmentUploadGrid({
            parsedCsv: testDataWithErrorNotOnLastRow,
            userType: testArg.userType,
          })
        ).result;

        expect(renderHookResult.current.isError).toBe(true);
      }
    );

    it.each(testArgs)(
      'exposes the correct values when valid for %s',
      (assignmentType, testArg) => {
        renderHookResult = renderHook(() =>
          useStaffAssignmentUploadGrid({
            parsedCsv: testArg.data,
            userType: testArg.userType,
          })
        ).result;
        expect(renderHookResult.current.isError).toBe(false);
      }
    );
  });

  describe('[isError]', () => {
    let renderHookResult;

    it.each(testArgs)(
      'exposes the correct value when isError for %s',
      (assignmentType, testArg) => {
        renderHookResult = renderHook(() =>
          useStaffAssignmentUploadGrid({ parsedCsv: testArg.invalidData })
        ).result;

        expect(renderHookResult.current.isError).toBe(true);
      }
    );
  });
});
