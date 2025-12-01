import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import papaparse from 'papaparse';
import { waitFor } from '@testing-library/react';

import { PARSE_STATE } from '@kitman/modules/src/shared/MassUpload/utils/consts';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import useParseCSV from '../useParseCSV';

jest.useFakeTimers();

jest.mock('papaparse', () => ({
  ...jest.requireActual('papaparse'),
  parse: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useEventTracking');

const mockValidResult = {
  data: [
    {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john_doe@email.com',
      DOB: '2007/10/22',
      SquadName: 'U13',
      Country: 'US',
      Position: 'Goalkeeper',
    },
    {
      FirstName: 'Marco',
      LastName: 'Polo',
      Email: 'marco_polo@email.com',
      DOB: '2007/10/21',
      SquadName: 'U13',
      Country: 'US',
      Position: 'Goalkeeper',
    },
  ],
  errors: [],
  meta: {
    delimiter: ',',
    linebreak: '\r\n',
    aborted: false,
    truncated: false,
    cursor: 175,
    fields: [
      'FirstName',
      'LastName',
      'Email',
      'DOB',
      'SquadName',
      'Country',
      'Position',
    ],
  },
};

const mockCSV = new File(['mock-csv'], 'mock-csv.csv', {
  type: 'document/csv',
});

describe('useParseCSV', () => {
  const mockTrackEvent = jest.fn();
  beforeEach(() => {
    useEventTracking.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() =>
          useParseCSV({ expectedHeaders: [], config: {} })
        ).result;
      });

      expect(renderHookResult.current).toHaveProperty('onHandleParseCSV');
      expect(renderHookResult.current).toHaveProperty('onRemoveCSV');
      expect(renderHookResult.current).toHaveProperty('queueState');
      expect(renderHookResult.current).toHaveProperty('parseResult');
      expect(renderHookResult.current).toHaveProperty('parseState');
      expect(renderHookResult.current).toHaveProperty('parseState');
      expect(renderHookResult.current.parseState).toBe(PARSE_STATE.Dormant);
      expect(renderHookResult.current).toHaveProperty('isDisabled');
    });
  });

  describe('[computed] valid csv', () => {
    beforeEach(() => {
      // Simulate a csv being added by the user
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [{ attachment: mockCSV }, () => null])
        .mockImplementationOnce(() => [PARSE_STATE.Complete, () => null])
        .mockImplementationOnce(() => [mockValidResult, () => null]);
    });

    it('returns the parse result when passed a csv file', async () => {
      const { result } = renderHook(() => {
        return useParseCSV({
          expectedHeaders: [
            'FirstName',
            'LastName',
            'Email',
            'DOB',
            'SquadName',
            'Country',
            'Position',
          ],
          config: {},
        });
      });

      expect(result.current.isDisabled).toBe(false);

      expect(result.current.parseResult).toStrictEqual(mockValidResult);
    });
  });

  describe('[computed] invalid csv', () => {
    beforeEach(() => {
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [{ attachment: null }, () => null])
        .mockImplementationOnce(() => [PARSE_STATE.Complete, () => null])
        .mockImplementationOnce(() => [
          { data: [], errors: [], meta: {} },
          () => null,
        ]);
    });

    it('returns isDisabled as true', async () => {
      const { result } = renderHook(() => {
        return useParseCSV({
          expectedHeaders: [
            'FirstName',
            'LastName',
            'Email',
            'DOB',
            'SquadName',
            'Country',
            'Position',
          ],
          config: {},
        });
      });

      expect(result.current.isDisabled).toBe(true);
    });
  });

  describe('processing csv', () => {
    beforeEach(() => {
      // Simulate a csv being added by the user
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [{ attachment: mockCSV }, () => null])
        .mockImplementationOnce(() => [PARSE_STATE.Complete, () => null])
        .mockImplementationOnce(() => [mockValidResult, () => null]);
    });

    it('should not parse csv, if hasFilePondProcessed is false', () => {
      renderHook(() => {
        return useParseCSV({
          expectedHeaders: [
            'FirstName',
            'LastName',
            'Email',
            'DOB',
            'SquadName',
            'Country',
            'Position',
          ],
          config: {},
          hasFilePondProcessed: false,
          hasFilePondErrored: false,
        });
      });

      expect(papaparse.parse).not.toHaveBeenCalled();
    });

    it('should not parse csv, if hasFilePondProcessed is true but hasFilePondErrored is true', async () => {
      renderHook(() => {
        return useParseCSV({
          expectedHeaders: [
            'FirstName',
            'LastName',
            'Email',
            'DOB',
            'SquadName',
            'Country',
            'Position',
          ],
          config: {},
          hasFilePondProcessed: true,
          hasFilePondErrored: true,
        });
      });

      await waitFor(() => {
        expect(papaparse.parse).not.toHaveBeenCalled();
      });
    });

    it('should parse csv, if hasFilePondProcessed is true and hasFilePondErrored is false', async () => {
      renderHook(() => {
        return useParseCSV({
          expectedHeaders: [
            'FirstName',
            'LastName',
            'Email',
            'DOB',
            'SquadName',
            'Country',
            'Position',
          ],
          config: {},
          hasFilePondProcessed: true,
          hasFilePondErrored: false,
        });
      });

      await waitFor(() => {
        expect(papaparse.parse).toHaveBeenCalled();
      });
    });

    it('should allow additional headers if allowAdditionalHeaders is truthy', async () => {
      const { result } = renderHook(() => {
        return useParseCSV({
          expectedHeaders: ['FirstName', 'LastName'],
          allowAdditionalHeaders: true,
          config: {},
          hasFilePondProcessed: true,
          hasFilePondErrored: false,
        });
      });

      expect(result.current.parseState).toEqual(PARSE_STATE.Complete);
    });

    describe('papaparse error handling', () => {
      const setCustomErrors = jest.fn();

      it('should handle TooFewFields error correctly', async () => {
        papaparse.parse.mockImplementation((file, config) => {
          config.complete({
            errors: [
              { code: 'TooFewFields', row: 0, message: 'Too few fields' },
            ],
            meta: {},
          });
        });

        renderHook(() =>
          useParseCSV({
            expectedHeaders: ['FirstName', 'LastName'],
            config: {},
            hasFilePondProcessed: true,
            hasFilePondErrored: false,
            setCustomErrors,
          })
        );

        await waitFor(() => {
          expect(setCustomErrors).toHaveBeenCalledWith({
            errors: [
              'It looks like row(s) in your CSV file are not formatted correctly. Please check row(s) 1 for issues and try again.',
            ],
            isSuccess: true,
          });
        });
      });

      it('should handle general parsing errors correctly', async () => {
        papaparse.parse.mockImplementation((file, config) => {
          config.complete({
            errors: [{ message: 'Some parsing error' }],
            meta: {},
          });
        });

        renderHook(() =>
          useParseCSV({
            expectedHeaders: ['FirstName', 'LastName'],
            config: {},
            hasFilePondProcessed: true,
            hasFilePondErrored: false,
            setCustomErrors,
          })
        );

        await waitFor(() => {
          expect(setCustomErrors).toHaveBeenCalledWith({
            errors: ['Some parsing error'],
            isSuccess: true,
          });
        });
      });
    });
  });
});
