import { renderHook, act } from '@testing-library/react-hooks';

import { data } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_benchmark_csv';
import AppRoot from '@kitman/modules/src/AppRoot';
import { data as mockedPositionGroups } from '@kitman/services/src/mocks/handlers/getPositionGroups';

import useBenchmarkingUploadGrid from '../useBenchmarkingUploadGrid';

describe('useBenchmarkingUploadGrid', () => {
  const wrapper = AppRoot;

  describe('[initial data]', () => {
    it('returns initial data', async () => {
      let renderHookResult;
      act(() => {
        renderHookResult = renderHook(
          () => useBenchmarkingUploadGrid({ parsedCsv: data.validData }),
          { wrapper }
        );
      });

      await renderHookResult.waitForNextUpdate();

      expect(renderHookResult.result.current).toHaveProperty('grid');

      expect(renderHookResult.result.current.grid).toHaveProperty('rows');
      expect(renderHookResult.result.current.grid).toHaveProperty('columns');
      expect(renderHookResult.result.current.grid).toHaveProperty(
        'emptyTableText'
      );
      expect(renderHookResult.result.current.grid).toHaveProperty('id');
      expect(renderHookResult.result.current).toHaveProperty('isError');
      expect(renderHookResult.result.current).toHaveProperty('ruleset');
      expect(renderHookResult.result.current.grid.emptyTableText).toEqual(
        'No valid data was found in csv.'
      );
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;
    const testData = [...data.validData, ...data.invalidData];

    it('correctly parses the csv data', async () => {
      act(() => {
        renderHookResult = renderHook(
          () => useBenchmarkingUploadGrid({ parsedCsv: testData }),
          {
            wrapper,
          }
        );
      });

      await renderHookResult.waitForNextUpdate();

      const columns = renderHookResult.result.current.grid.columns;
      expect(columns).toMatchSnapshot();
    });

    it('correctly sets the rows with errors', async () => {
      act(() => {
        renderHookResult = renderHook(
          () => useBenchmarkingUploadGrid({ parsedCsv: testData }),
          {
            wrapper,
          }
        );
      });

      await renderHookResult.waitForNextUpdate();

      const rows = renderHookResult.result.current.grid.rows;
      expect(rows.length).toEqual(testData.length);
      expect(rows[0].classnames.is__error).toEqual(false);
      expect(rows[1].classnames.is__error).toEqual(true);
    });

    it('exposes the correct values when invalid', async () => {
      act(() => {
        renderHookResult = renderHook(
          () => useBenchmarkingUploadGrid({ parsedCsv: testData }),
          {
            wrapper,
          }
        );
      });

      await renderHookResult.waitForNextUpdate();

      expect(renderHookResult.result.current.isError).toBe(true);
    });

    it('exposes the correct values when invalid, when error is not on last row', async () => {
      const testDataWithErrorNotOnLastRow = [
        ...data.invalidData,
        ...data.validData,
      ];

      act(() => {
        renderHookResult = renderHook(
          () =>
            useBenchmarkingUploadGrid({
              parsedCsv: testDataWithErrorNotOnLastRow,
            }),
          { wrapper }
        );
      });

      await renderHookResult.waitForNextUpdate();

      expect(renderHookResult.result.current.isError).toBe(true);
    });

    it('exposes the correct values when valid', async () => {
      act(() => {
        renderHookResult = renderHook(
          () => useBenchmarkingUploadGrid({ parsedCsv: data.validData }),
          {
            wrapper,
          }
        );
      });

      await renderHookResult.waitForNextUpdate();

      expect(renderHookResult.result.current.isError).toBe(false);
    });
  });

  describe('[isError]', () => {
    let renderHookResult;

    const validRow = data.validData[0];

    const getBenchmarkTestCases = (fieldName, min, max) => [
      {
        description: `below minimum of ${min}`,
        input: [{ ...validRow, [fieldName]: (min - 0.01).toFixed(2) }],
        expected: true,
      },
      {
        description: `equal to minimum of ${min}`,
        input: [{ ...validRow, [fieldName]: min.toString() }],
        expected: false,
      },
      {
        description: `equal to maximum of ${max}`,
        input: [{ ...validRow, [fieldName]: max.toString() }],
        expected: false,
      },
      {
        description: `above maximum of ${max}`,
        input: [{ ...validRow, [fieldName]: (max + 0.01).toFixed(2) }],
        expected: true,
      },
      {
        description: 'empty string',
        input: [{ ...validRow, [fieldName]: '' }],
        expected: false,
      },
      {
        description: 'non-numeric string',
        input: [{ ...validRow, [fieldName]: 'xyz' }],
        expected: false,
      },
    ];

    it('exposes the correct value when isError', async () => {
      act(() => {
        renderHookResult = renderHook(
          () => useBenchmarkingUploadGrid({ parsedCsv: data.invalidData }),
          { wrapper }
        );
      });

      await renderHookResult.waitForNextUpdate();

      expect(renderHookResult.result.current.isError).toBe(true);
    });

    describe('`player_position`', () => {
      const validPositionGroup = mockedPositionGroups[0].name;

      it.each([
        {
          description: 'all the letters are in lower case',
          input: [
            {
              ...validRow,
              player_position: validPositionGroup.toLocaleLowerCase(),
            },
          ],
          expected: false,
        },
        {
          description: 'all the letters are in upper case',
          input: [
            {
              ...validRow,
              player_position: validPositionGroup.toLocaleUpperCase(),
            },
          ],
          expected: false,
        },
        {
          description: 'all the letters are in a random case',
          input: [
            {
              ...validRow,
              player_position: validPositionGroup
                .split('')
                .map((char, i) =>
                  i % 2 === 0
                    ? char.toLocaleLowerCase()
                    : char.toLocaleUpperCase()
                )
                .join(''),
            },
          ],
          expected: false,
        },
      ])(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              { wrapper }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('05m_sprint', () => {
      it.each(getBenchmarkTestCases('05m_sprint', 0.52, 1.53))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              { wrapper }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('10m_sprint', () => {
      it.each(getBenchmarkTestCases('10m_sprint', 1.11, 2.53))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              { wrapper }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('20m_sprint', () => {
      it.each(getBenchmarkTestCases('20m_sprint', 1.91, 4.5))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              { wrapper }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('30m_sprint', () => {
      it.each(getBenchmarkTestCases('30m_sprint', 2.48, 6.42))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              { wrapper }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('505_agility_right', () => {
      it.each(getBenchmarkTestCases('505_agility_right', 1.68, 3.58))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              { wrapper }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('505_agility_left', () => {
      it.each(getBenchmarkTestCases('505_agility_left', 1.68, 3.63))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              { wrapper }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('cmj_optojump', () => {
      it.each(getBenchmarkTestCases('cmj_optojump', 0, 79))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              { wrapper }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('cmj_vald', () => {
      it.each(getBenchmarkTestCases('cmj_vald', 0, 96.08))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              { wrapper }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('yo_yo_intermittent_recovery_test_level_1', () => {
      it.each(
        getBenchmarkTestCases(
          'yo_yo_intermittent_recovery_test_level_1',
          0,
          6340
        )
      )(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              {
                wrapper,
              }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('yo_yo_intermittent_recovery_test_level_2', () => {
      it.each(
        getBenchmarkTestCases(
          'yo_yo_intermittent_recovery_test_level_2',
          0,
          2400
        )
      )(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              {
                wrapper,
              }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('agility_arrow_head_left', () => {
      it.each(getBenchmarkTestCases('agility_arrow_head_left', 5.73, 11.81))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              {
                wrapper,
              }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });

    describe('agility_arrow_head_right', () => {
      it.each(getBenchmarkTestCases('agility_arrow_head_right', 5.77, 11.8))(
        'when $description, the hook’s `isError` is $expected',
        async ({ input, expected }) => {
          act(() => {
            renderHookResult = renderHook(
              () => useBenchmarkingUploadGrid({ parsedCsv: input }),
              {
                wrapper,
              }
            );
          });

          await renderHookResult.waitForNextUpdate();

          expect(renderHookResult.result.current.isError).toBe(expected);
        }
      );
    });
  });

  describe('ruleset', () => {
    let renderHookResult;

    it('renders the ruleset as expected', async () => {
      act(() => {
        renderHookResult = renderHook(
          () => useBenchmarkingUploadGrid({ parsedCsv: data.validData }),
          { wrapper }
        );
      });

      await renderHookResult.waitForNextUpdate();

      expect(renderHookResult.result.current.ruleset).toMatchSnapshot();
    });
  });
});
