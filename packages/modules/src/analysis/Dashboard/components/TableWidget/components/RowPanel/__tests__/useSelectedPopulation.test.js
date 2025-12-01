import { renderHook } from '@testing-library/react-hooks';
import { useSelectedPopulation } from '../components/ComparisonPanel';

describe('useSelectedPopulation hook', () => {
  describe('selectPopulationItem', () => {
    it('passes true historic variable', () => {
      const { result } = renderHook(() => useSelectedPopulation());
      result.current.selectPopulationItem(3, 'squads', 3, undefined, true);
      expect(result.current.selectedPopulationItems[0].historic).toEqual(true);
    });

    it('passes false historic variable', () => {
      const { result } = renderHook(() => useSelectedPopulation());
      result.current.selectPopulationItem(3, 'squads', 3, undefined, false);
      expect(result.current.selectedPopulationItems[0].historic).toEqual(false);
    });

    it('does not pass historic variable when undefined', () => {
      const { result } = renderHook(() => useSelectedPopulation());
      result.current.selectPopulationItem(3, 'squads', 3);
      expect(result.current.selectedPopulationItems[0].historic).toEqual(
        undefined
      );
    });
  });
  describe('onClick callback', () => {
    it('can select and deselect a given option', () => {
      const { result } = renderHook(() => useSelectedPopulation());

      result.current.onClick(1, 'athletes', 12, {
        id: 1,
        type: 'athletes',
        name: 'Test name',
      });
      result.current.onClick(2, 'position_groups', 8, {
        id: 2,
        type: 'position_groups',
        name: 'Test position group',
      });

      expect(result.current.selectedPopulationItems).toEqual([
        {
          id: 1,
          type: 'athletes',
          squadId: 12,
          contextSquads: [],
          option: {
            id: 1,
            type: 'athletes',
            name: 'Test name',
          },
        },
        {
          id: 2,
          type: 'position_groups',
          squadId: 8,
          contextSquads: [],
          option: {
            id: 2,
            type: 'position_groups',
            name: 'Test position group',
          },
        },
      ]);

      result.current.onClick(2, 'position_groups', 8);

      expect(result.current.selectedPopulationItems).toEqual([
        {
          id: 1,
          type: 'athletes',
          squadId: 12,
          contextSquads: [],
          option: {
            id: 1,
            type: 'athletes',
            name: 'Test name',
          },
        },
      ]);
    });

    it('sets historic squad to true when passed', () => {
      const { result } = renderHook(() => useSelectedPopulation());

      result.current.onClick(3, 'squads', 3, undefined, true);

      expect(result.current.selectedPopulationItems).toEqual([
        {
          id: 3,
          type: 'squads',
          squadId: 3,
          contextSquads: [],
          historic: true,
        },
      ]);
    });
  });

  describe('isSelected callback', () => {
    it('returns true and false correctly for different conditions', () => {
      const { result } = renderHook(() => useSelectedPopulation());

      result.current.onClick(1, 'athletes', 12);
      result.current.onClick(2, 'position_groups', 8);

      expect(result.current.isSelected(2, 'position_groups', 8)).toEqual(true);

      expect(result.current.isSelected(4, 'athletes', 4)).toEqual(false);
    });
  });

  describe('onSelectAll callback', () => {
    it('selects an array of unselected items', () => {
      const { result } = renderHook(() => useSelectedPopulation());

      result.current.onSelectAll(
        [
          { id: 1, name: 'Joe Bloggs', type: 'athletes' },
          { id: 2, name: 'John Smith', type: 'athletes' },
          { id: 3, name: 'Jurgen Klopp', type: 'athletes' },
        ],
        12
      );

      expect(result.current.selectedPopulationItems).toEqual([
        {
          id: 1,
          contextSquads: [],
          squadId: 12,
          type: 'athletes',
          option: { id: 1, name: 'Joe Bloggs', type: 'athletes' },
        },
        {
          id: 2,
          contextSquads: [],
          squadId: 12,
          type: 'athletes',
          option: { id: 2, name: 'John Smith', type: 'athletes' },
        },
        {
          id: 3,
          contextSquads: [],
          squadId: 12,
          type: 'athletes',
          option: { id: 3, name: 'Jurgen Klopp', type: 'athletes' },
        },
      ]);
    });
  });

  describe('onClearAll callback', () => {
    it('clears an array of selected items', () => {
      const { result } = renderHook(() => useSelectedPopulation());

      result.current.onClick(1, 'athletes', 12, {
        id: 1,
        name: 'Joe Bloggs',
        type: 'athletes',
      });
      result.current.onClick(2, 'athletes', 12, {
        id: 2,
        name: 'John Smith',
        type: 'athletes',
      });
      result.current.onClick(3, 'athletes', 12, {
        id: 3,
        name: 'Jurgen Klopp',
        type: 'athletes',
      });
      result.current.onClick(4, 'athletes', 5, {
        id: 4,
        name: 'Eric ten Hag',
        type: 'athletes',
      });

      result.current.onClearAll(
        [
          { id: 1, name: 'Joe Bloggs', type: 'athletes' },
          { id: 2, name: 'John Smith', type: 'athletes' },
          { id: 3, name: 'Jurgen Klopp', type: 'athletes' },
        ],
        12
      );

      expect(result.current.selectedPopulationItems).toEqual([
        {
          id: 4,
          contextSquads: [],
          squadId: 5,
          type: 'athletes',
          option: {
            id: 4,
            name: 'Eric ten Hag',
            type: 'athletes',
          },
        },
      ]);
    });
  });

  describe('onChangeContextSquads callback', () => {
    it('sets the context squads of a selected item', () => {
      const { result } = renderHook(() => useSelectedPopulation());

      result.current.onClick(1, 'athletes', 12, {
        id: 1,
        name: 'Joe Bloggs',
        type: 'athletes',
      });
      result.current.onClick(2, 'athletes', 12, {
        id: 2,
        name: 'John Smith',
        type: 'athletes',
      });
      result.current.onChangeContextSquads(1, 'athletes', 12, [1, 2, 3]);

      expect(result.current.selectedPopulationItems).toEqual([
        {
          id: 1,
          contextSquads: [1, 2, 3],
          squadId: 12,
          type: 'athletes',
          option: { id: 1, name: 'Joe Bloggs', type: 'athletes' },
        },
        {
          id: 2,
          contextSquads: [],
          squadId: 12,
          type: 'athletes',
          option: { id: 2, name: 'John Smith', type: 'athletes' },
        },
      ]);
    });
  });

  describe('setAllContextSquads callback', () => {
    it('sets the context squads of all selected items', () => {
      const { result } = renderHook(() => useSelectedPopulation());

      result.current.onClick(1, 'athletes', 12, {
        id: 1,
        name: 'Joe Bloggs',
        type: 'athletes',
      });
      result.current.onClick(2, 'athletes', 12, {
        id: 2,
        name: 'John Smith',
        type: 'athletes',
      });
      result.current.setAllContextSquads([1, 2, 3]);

      expect(result.current.selectedPopulationItems).toEqual([
        {
          id: 1,
          contextSquads: [1, 2, 3],
          squadId: 12,
          type: 'athletes',
          option: { id: 1, name: 'Joe Bloggs', type: 'athletes' },
        },
        {
          id: 2,
          contextSquads: [1, 2, 3],
          squadId: 12,
          type: 'athletes',
          option: { id: 2, name: 'John Smith', type: 'athletes' },
        },
      ]);
    });
  });
});
