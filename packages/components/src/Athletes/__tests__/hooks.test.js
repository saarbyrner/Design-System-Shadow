/* eslint-disable jest/no-mocks-import */
import { renderHook } from '@testing-library/react-hooks';
import { AthleteProvider } from '../components/AthleteContext';
import {
  useAthleteContext,
  useOptions,
  useOptionSelect,
  useSquads,
} from '../hooks';
import mockSquadAthletes, {
  reducedSquadAthletes,
} from '../__mocks__/squadAthletes';
import { EMPTY_SELECTION } from '../constants';

describe('Athletes | hooks', () => {
  const onChangeCallback = jest.fn();
  const providerValue = [
    {
      ...EMPTY_SELECTION,
      athletes: [2],
    },
  ];
  const wrapper = ({ children }) => (
    <AthleteProvider
      squadAthletes={mockSquadAthletes.squads}
      onChange={onChangeCallback}
      value={providerValue}
    >
      {children}
    </AthleteProvider>
  );

  describe('useAthleteContext', () => {
    it('returns the context values from the provider', () => {
      const { result } = renderHook(() => useAthleteContext(), { wrapper });
      const { squadAthletes, value, onChange } = result.current;

      expect(squadAthletes).toEqual(mockSquadAthletes.squads);
      expect(value).toEqual(providerValue);

      expect(onChangeCallback).toHaveBeenCalledTimes(0);
      onChange([
        {
          ...EMPTY_SELECTION,
          athletes: [3],
        },
      ]);

      expect(onChangeCallback).toHaveBeenCalledTimes(1);
      expect(onChangeCallback).toHaveBeenCalledWith([
        { ...EMPTY_SELECTION, athletes: [3] },
      ]);
    });
  });

  describe('useSquads', () => {
    it('returns correct list of squads', () => {
      const { result } = renderHook(() => useSquads(), { wrapper });

      expect(result.current.data).toEqual(
        mockSquadAthletes.squads.map(({ id, name }) => ({ id, name }))
      );
    });
  });

  describe('useOptionSelect', () => {
    describe('when single select is enabled', () => {
      it('returns an onClick fn that calls onChange with the new value', () => {
        const {
          result: {
            current: { onClick },
          },
        } = renderHook(() => useOptionSelect(), { wrapper });

        onClick(2, 'athletes', 8);

        expect(onChangeCallback).toHaveBeenCalledWith([
          { ...EMPTY_SELECTION, athletes: [2] },
        ]);

        onClick(3, 'position_groups');

        expect(onChangeCallback).toHaveBeenCalledWith([
          { ...EMPTY_SELECTION, position_groups: [3] },
        ]);
      });

      it('returns the context_squad when includeContextSquads is true', () => {
        const updatedWrapper = ({ children }) => (
          <AthleteProvider
            squadAthletes={mockSquadAthletes.squads}
            onChange={onChangeCallback}
            value={providerValue}
            includeContextSquad
          >
            {children}
          </AthleteProvider>
        );
        const {
          result: {
            current: { onClick },
          },
        } = renderHook(() => useOptionSelect(), { wrapper: updatedWrapper });

        onClick(2, 'athletes', 8);

        expect(onChangeCallback).toHaveBeenCalledWith([
          { ...EMPTY_SELECTION, athletes: [2], context_squads: [8] },
        ]);
      });
    });

    describe('when multi select is enabled', () => {
      const updatedWrapper = ({ includeContextSquad, value, children }) => (
        <AthleteProvider
          squadAthletes={reducedSquadAthletes}
          onChange={onChangeCallback}
          value={value}
          isMulti
          includeContextSquad={includeContextSquad}
        >
          {children}
        </AthleteProvider>
      );

      describe('isSelected callback', () => {
        it('reads true if an option is selected in the value', () => {
          const hook = renderHook(() => useOptionSelect(), {
            initialProps: {
              value: [
                {
                  ...EMPTY_SELECTION,
                  position_groups: [3],
                  context_squads: [8],
                },
              ],
            },
            wrapper: updatedWrapper,
          });

          expect(
            hook.result.current.isSelected(3, 'position_groups', 8)
          ).toEqual(true);

          hook.rerender({
            value: [
              {
                ...EMPTY_SELECTION,
                positions: [3],
                context_squads: [8],
              },
            ],
          });

          expect(hook.result.current.isSelected(3, 'positions', 8)).toEqual(
            true
          );

          hook.rerender({
            value: [
              {
                ...EMPTY_SELECTION,
                athletes: [3],
                context_squads: [8],
              },
            ],
          });

          expect(hook.result.current.isSelected(3, 'athletes', 8)).toEqual(
            true
          );
        });

        it('reads false if an option is not selected in the value', () => {
          const hook = renderHook(() => useOptionSelect(), {
            initialProps: {
              value: [
                {
                  ...EMPTY_SELECTION,
                  position_groups: [3],
                  context_squads: [8],
                },
              ],
            },
            wrapper: updatedWrapper,
          });

          expect(
            hook.result.current.isSelected(2, 'position_groups', 8)
          ).toEqual(false);

          hook.rerender({
            value: [
              {
                ...EMPTY_SELECTION,
                positions: [3],
                context_squads: [8],
              },
            ],
          });

          expect(hook.result.current.isSelected(2, 'positions', 8)).toEqual(
            false
          );

          hook.rerender({
            value: [
              {
                ...EMPTY_SELECTION,
                athletes: [3],
                context_squads: [8],
              },
            ],
          });

          expect(hook.result.current.isSelected(2, 'athletes', 8)).toEqual(
            false
          );
        });

        describe('and includeContextSquad is enabled', () => {
          it('reads true for selected options', () => {
            const hook = renderHook(() => useOptionSelect(), {
              initialProps: {
                includeContextSquad: true,
                value: [
                  {
                    applies_to_squad: false,
                    all_squads: false,
                    position_groups: [],
                    positions: [],
                    athletes: [123],
                    squads: [],
                    context_squads: [8],
                  },
                  {
                    applies_to_squad: false,
                    all_squads: false,
                    position_groups: [],
                    positions: [],
                    athletes: [3],
                    squads: [],
                    context_squads: [8, 73],
                  },
                ],
              },
              wrapper: updatedWrapper,
            });

            expect(hook.result.current.isSelected(3, 'athletes', 8)).toEqual(
              true
            );
          });

          it('reads false for non selected options', () => {
            const hook = renderHook(() => useOptionSelect(), {
              initialProps: {
                includeContextSquad: true,
                value: [
                  {
                    applies_to_squad: false,
                    all_squads: false,
                    position_groups: [],
                    positions: [],
                    athletes: [123],
                    squads: [],
                    context_squads: [8],
                  },
                  {
                    applies_to_squad: false,
                    all_squads: false,
                    position_groups: [],
                    positions: [],
                    athletes: [3],
                    squads: [],
                    context_squads: [8, 73],
                  },
                ],
              },
              wrapper: updatedWrapper,
            });

            expect(hook.result.current.isSelected(3, 'athletes', 9)).toEqual(
              false
            );
          });
        });
      });

      describe('onClick callback', () => {
        it('adds the clicked item to an existing value if not selected onClick', () => {
          const hook = renderHook(() => useOptionSelect(), {
            initialProps: {
              value: [],
            },
            wrapper: updatedWrapper,
          });

          hook.result.current.onClick(3, 'position_groups', 8);

          expect(onChangeCallback).toHaveBeenCalledWith([
            {
              ...EMPTY_SELECTION,
              position_groups: [3],
            },
          ]);

          hook.rerender({
            value: [
              {
                ...EMPTY_SELECTION,
                positions: [3],
              },
            ],
          });

          hook.result.current.onClick(4, 'positions', 8);

          expect(onChangeCallback).toHaveBeenCalledWith([
            {
              ...EMPTY_SELECTION,
              positions: [3, 4],
            },
          ]);

          hook.rerender({
            value: [
              {
                ...EMPTY_SELECTION,
                position_groups: [3, 4],
              },
            ],
          });

          hook.result.current.onClick(5, 'athletes', 9);

          expect(onChangeCallback).toHaveBeenCalledWith([
            {
              ...EMPTY_SELECTION,
              athletes: [5],
              position_groups: [3, 4],
            },
          ]);
        });

        it('removes the clicked item from an existing value if selected onClick', () => {
          const hook = renderHook(() => useOptionSelect(), {
            initialProps: {
              value: [
                {
                  ...EMPTY_SELECTION,
                  position_groups: [3],
                },
              ],
            },
            wrapper: updatedWrapper,
          });

          hook.result.current.onClick(3, 'position_groups', 8);

          expect(onChangeCallback).toHaveBeenCalledWith([]);

          hook.rerender({
            value: [
              {
                ...EMPTY_SELECTION,
                positions: [3, 4],
              },
            ],
          });

          hook.result.current.onClick(4, 'positions', 8);

          expect(onChangeCallback).toHaveBeenCalledWith([
            {
              ...EMPTY_SELECTION,
              positions: [3],
            },
          ]);
        });

        describe('and includeContextSquad is enabled', () => {
          it('adds the clicked item to an existing value if not selected onClick', () => {
            const hook = renderHook(() => useOptionSelect(), {
              initialProps: {
                value: [],
                includeContextSquad: true,
              },
              wrapper: updatedWrapper,
            });

            hook.result.current.onClick(3, 'position_groups', 8);

            expect(onChangeCallback).toHaveBeenCalledWith([
              {
                ...EMPTY_SELECTION,
                position_groups: [3],
                context_squads: [8],
              },
            ]);

            hook.rerender({
              includeContextSquad: true,
              value: [
                {
                  ...EMPTY_SELECTION,
                  positions: [3],
                  context_squads: [8],
                },
              ],
            });

            hook.result.current.onClick(4, 'positions', 8);

            expect(onChangeCallback).toHaveBeenCalledWith([
              {
                ...EMPTY_SELECTION,
                positions: [3, 4],
                context_squads: [8],
              },
            ]);

            hook.rerender({
              includeContextSquad: true,
              value: [
                {
                  ...EMPTY_SELECTION,
                  position_groups: [3, 4],
                  context_squads: [8],
                },
              ],
            });

            hook.result.current.onClick(5, 'athletes', 9);

            expect(onChangeCallback).toHaveBeenCalledWith([
              {
                ...EMPTY_SELECTION,
                position_groups: [3, 4],
                context_squads: [8],
              },
              {
                ...EMPTY_SELECTION,
                athletes: [5],
                context_squads: [9],
              },
            ]);
          });

          it('removes the clicked item from an existing value if selected onClick', () => {
            const hook = renderHook(() => useOptionSelect(), {
              initialProps: {
                includeContextSquad: true,
                value: [
                  {
                    ...EMPTY_SELECTION,
                    position_groups: [3],
                    context_squads: [8],
                  },
                ],
              },
              wrapper: updatedWrapper,
            });

            hook.result.current.onClick(3, 'position_groups', 8);

            expect(onChangeCallback).toHaveBeenCalledWith([]);

            hook.rerender({
              includeContextSquad: true,
              value: [
                {
                  ...EMPTY_SELECTION,
                  positions: [3, 4],
                  context_squads: [8],
                },
              ],
            });

            hook.result.current.onClick(4, 'positions', 8);

            expect(onChangeCallback).toHaveBeenCalledWith([
              {
                ...EMPTY_SELECTION,
                positions: [3],
                context_squads: [8],
              },
            ]);

            hook.rerender({
              includeContextSquad: true,
              value: [
                {
                  ...EMPTY_SELECTION,
                  position_groups: [3, 4],
                  context_squads: [8],
                },
                {
                  ...EMPTY_SELECTION,
                  athletes: [5],
                  context_squads: [9],
                },
              ],
            });

            hook.result.current.onClick(5, 'athletes', 9);

            expect(onChangeCallback).toHaveBeenCalledWith([
              {
                ...EMPTY_SELECTION,
                position_groups: [3, 4],
                context_squads: [8],
              },
            ]);
          });

          it('removes only the clicked squad item from array if selected onClick', () => {
            const hook = renderHook(() => useOptionSelect(), {
              initialProps: {
                includeContextSquad: true,
                value: [
                  {
                    ...EMPTY_SELECTION,
                    squads: [1],
                    context_squads: [1],
                  },
                  {
                    ...EMPTY_SELECTION,
                    squads: [2],
                    context_squads: [2],
                  },
                  {
                    ...EMPTY_SELECTION,
                    squads: [3],
                    context_squads: [3],
                  },
                  {
                    ...EMPTY_SELECTION,
                    squads: [4],
                    context_squads: [4],
                  },
                ],
              },
              wrapper: updatedWrapper,
            });

            // Id and squadId match
            hook.result.current.onClick(3, 'squads', 3);

            expect(onChangeCallback).toHaveBeenCalledWith([
              {
                ...EMPTY_SELECTION,
                squads: [1],
                context_squads: [1],
              },
              {
                ...EMPTY_SELECTION,
                squads: [2],
                context_squads: [2],
              },
              {
                ...EMPTY_SELECTION,
                squads: [4],
                context_squads: [4],
              },
            ]);
          });
        });
      });

      describe('selectMultiple callback', () => {
        it('selects an array of options', () => {
          const hook = renderHook(() => useOptionSelect(), {
            initialProps: {
              value: [],
            },
            wrapper: updatedWrapper,
          });

          hook.result.current.selectMultiple([
            { id: 1, name: 'Forwards', type: 'position_groups' },
            { id: 2, name: 'Props', type: 'positions' },
            { id: 3, name: 'Jon Smith', type: 'athletes' },
            { id: 4, name: 'Abc def', type: 'athletes' },
          ]);

          expect(onChangeCallback).toHaveBeenCalledWith([
            {
              ...EMPTY_SELECTION,
              position_groups: [1],
              positions: [2],
              athletes: [3, 4],
            },
          ]);
        });

        it('doesnt add duplicate values if an id is already selected', () => {
          const hook = renderHook(() => useOptionSelect(), {
            initialProps: {
              value: [
                {
                  ...EMPTY_SELECTION,
                  athletes: [3],
                },
              ],
            },
            wrapper: updatedWrapper,
          });

          hook.result.current.selectMultiple([
            { id: 1, name: 'Forwards', type: 'position_groups' },
            { id: 2, name: 'Props', type: 'positions' },
            { id: 3, name: 'Jon Smith', type: 'athletes' },
            { id: 4, name: 'Abc def', type: 'athletes' },
          ]);

          expect(onChangeCallback).toHaveBeenCalledWith([
            {
              ...EMPTY_SELECTION,
              position_groups: [1],
              positions: [2],
              athletes: [3, 4],
            },
          ]);
        });

        it('adds the context squads to value when context squads is enabled', () => {
          const hook = renderHook(() => useOptionSelect(), {
            initialProps: {
              value: [],
              includeContextSquad: true,
            },
            wrapper: updatedWrapper,
          });

          hook.result.current.selectMultiple(
            [
              { id: 1, name: 'Forwards', type: 'position_groups' },
              { id: 2, name: 'Props', type: 'positions' },
              { id: 3, name: 'Jon Smith', type: 'athletes' },
              { id: 4, name: 'Abc def', type: 'athletes' },
            ],
            8
          );

          expect(onChangeCallback).toHaveBeenCalledWith([
            {
              ...EMPTY_SELECTION,
              position_groups: [1],
              positions: [2],
              athletes: [3, 4],
              context_squads: [8],
            },
          ]);
        });
      });

      describe('deselectMultiple callback', () => {
        it('removes an array of selected options', () => {
          const hook = renderHook(() => useOptionSelect(), {
            initialProps: {
              value: [
                {
                  ...EMPTY_SELECTION,
                  position_groups: [1],
                  positions: [2],
                  athletes: [3, 4],
                },
              ],
            },
            wrapper: updatedWrapper,
          });

          hook.result.current.deselectMultiple([
            { id: 1, name: 'Forwards', type: 'position_groups' },
            { id: 2, name: 'Props', type: 'positions' },
            { id: 3, name: 'Jon Smith', type: 'athletes' },
            { id: 4, name: 'Abc def', type: 'athletes' },
          ]);

          expect(onChangeCallback).toHaveBeenCalledWith([]);
        });

        it('removes only the array of selected options and leaves selected ones', () => {
          const hook = renderHook(() => useOptionSelect(), {
            initialProps: {
              value: [
                {
                  ...EMPTY_SELECTION,
                  position_groups: [1],
                  positions: [2],
                  athletes: [3, 4, 7],
                },
              ],
            },
            wrapper: updatedWrapper,
          });

          hook.result.current.deselectMultiple([
            { id: 1, name: 'Forwards', type: 'position_groups' },
            { id: 2, name: 'Props', type: 'positions' },
            { id: 3, name: 'Jon Smith', type: 'athletes' },
            { id: 4, name: 'Abc def', type: 'athletes' },
          ]);

          expect(onChangeCallback).toHaveBeenCalledWith([
            {
              ...EMPTY_SELECTION,
              athletes: [7],
            },
          ]);
        });
      });
    });
  });

  describe('useOptions', () => {
    const updatedWrapper = ({ children }) => (
      <AthleteProvider
        squadAthletes={reducedSquadAthletes}
        onChange={onChangeCallback}
        value={providerValue}
      >
        {children}
      </AthleteProvider>
    );

    it('filters options based on squad id', () => {
      const {
        result: {
          current: { data },
        },
      } = renderHook(
        () =>
          useOptions({
            squadId: 262,
          }),
        {
          wrapper: updatedWrapper,
        }
      );

      expect(data).toEqual([
        {
          id: 25,
          name: 'Forward',
          options: [
            { type: 'position_groups', id: 25, name: 'Forward' },
            { type: 'positions', id: 71, name: 'Hooker' },
            {
              type: 'athletes',
              id: 43975,
              firstname: 'API',
              lastname: 'Tester',
              name: 'API Tester',
              fullname: 'API Tester',
              avatar_url: null,
              position: { type: 'positions', id: 71, name: 'Hooker' },
              positionGroup: {
                type: 'position_groups',
                id: 25,
                name: 'Forward',
              },
            },
            {
              type: 'athletes',
              id: 27280,
              firstname: 'Gustavo',
              lastname: 'Lazaro Amendola',
              name: 'Gustavo Lazaro Amendola',
              fullname: 'Gustavo Lazaro Amendola',
              avatar_url: null,
              position: { type: 'positions', id: 71, name: 'Hooker' },
              positionGroup: {
                type: 'position_groups',
                id: 25,
                name: 'Forward',
              },
            },
          ],
        },
      ]);
    });

    it('filters options based on search text', () => {
      const {
        result: {
          current: { data },
        },
      } = renderHook(
        () =>
          useOptions({
            searchText: 'Gustavo',
          }),
        {
          wrapper: updatedWrapper,
        }
      );

      expect(data).toEqual([
        {
          id: 25,
          name: 'Forward',
          options: [
            {
              type: 'athletes',
              id: 27280,
              firstname: 'Gustavo',
              lastname: 'Lazaro Amendola',
              name: 'Gustavo Lazaro Amendola',
              fullname: 'Gustavo Lazaro Amendola',
              avatar_url: null,
              position: { type: 'positions', id: 71, name: 'Hooker' },
              positionGroup: {
                type: 'position_groups',
                id: 25,
                name: 'Forward',
              },
            },
          ],
        },
      ]);
    });

    it('hides position_group options', () => {
      const {
        result: {
          current: { data },
        },
      } = renderHook(
        () =>
          useOptions({
            squadId: 262,
            hiddenTypes: ['position_groups'],
          }),
        {
          wrapper: updatedWrapper,
        }
      );

      expect(data).toEqual([
        {
          id: 25,
          name: 'Forward',
          options: [
            { type: 'positions', id: 71, name: 'Hooker' },
            {
              type: 'athletes',
              id: 43975,
              firstname: 'API',
              lastname: 'Tester',
              name: 'API Tester',
              fullname: 'API Tester',
              avatar_url: null,
              position: { type: 'positions', id: 71, name: 'Hooker' },
              positionGroup: {
                type: 'position_groups',
                id: 25,
                name: 'Forward',
              },
            },
            {
              type: 'athletes',
              id: 27280,
              firstname: 'Gustavo',
              lastname: 'Lazaro Amendola',
              name: 'Gustavo Lazaro Amendola',
              fullname: 'Gustavo Lazaro Amendola',
              avatar_url: null,
              position: { type: 'positions', id: 71, name: 'Hooker' },
              positionGroup: {
                type: 'position_groups',
                id: 25,
                name: 'Forward',
              },
            },
          ],
        },
      ]);
    });

    it('hides position options', () => {
      const {
        result: {
          current: { data },
        },
      } = renderHook(
        () =>
          useOptions({
            squadId: 262,
            hiddenTypes: ['positions', 'position_groups'],
          }),
        {
          wrapper: updatedWrapper,
        }
      );

      expect(data).toEqual([
        {
          id: 25,
          name: 'Forward',
          options: [
            {
              type: 'athletes',
              id: 43975,
              firstname: 'API',
              lastname: 'Tester',
              name: 'API Tester',
              fullname: 'API Tester',
              avatar_url: null,
              position: { type: 'positions', id: 71, name: 'Hooker' },
              positionGroup: {
                type: 'position_groups',
                id: 25,
                name: 'Forward',
              },
            },
            {
              type: 'athletes',
              id: 27280,
              firstname: 'Gustavo',
              lastname: 'Lazaro Amendola',
              name: 'Gustavo Lazaro Amendola',
              fullname: 'Gustavo Lazaro Amendola',
              avatar_url: null,
              position: { type: 'positions', id: 71, name: 'Hooker' },
              positionGroup: {
                type: 'position_groups',
                id: 25,
                name: 'Forward',
              },
            },
          ],
        },
      ]);
    });

    it('hides athlete options', () => {
      const {
        result: {
          current: { data },
        },
      } = renderHook(
        () =>
          useOptions({
            squadId: 262,
            hiddenTypes: ['athletes'],
          }),
        {
          wrapper: updatedWrapper,
        }
      );

      expect(data).toEqual([
        {
          id: 25,
          name: 'Forward',
          options: [
            { type: 'position_groups', id: 25, name: 'Forward' },
            { type: 'positions', id: 71, name: 'Hooker' },
          ],
        },
      ]);
    });

    it('groups options by squads', () => {
      const {
        result: {
          current: { data },
        },
      } = renderHook(
        () =>
          useOptions({
            squadId: 262,
            groupBy: 'squad',
          }),
        {
          wrapper: updatedWrapper,
        }
      );

      expect(data).toEqual([
        {
          id: 262,
          name: 'Test',
          options: [
            { type: 'position_groups', id: 25, name: 'Forward' },
            { type: 'positions', id: 71, name: 'Hooker' },
            {
              type: 'athletes',
              id: 43975,
              firstname: 'API',
              lastname: 'Tester',
              name: 'API Tester',
              fullname: 'API Tester',
              avatar_url: null,
              position: { type: 'positions', id: 71, name: 'Hooker' },
              positionGroup: {
                type: 'position_groups',
                id: 25,
                name: 'Forward',
              },
            },
            {
              type: 'athletes',
              id: 27280,
              firstname: 'Gustavo',
              lastname: 'Lazaro Amendola',
              name: 'Gustavo Lazaro Amendola',
              fullname: 'Gustavo Lazaro Amendola',
              avatar_url: null,
              position: { type: 'positions', id: 71, name: 'Hooker' },
              positionGroup: {
                type: 'position_groups',
                id: 25,
                name: 'Forward',
              },
            },
          ],
        },
      ]);
    });
  });
});
