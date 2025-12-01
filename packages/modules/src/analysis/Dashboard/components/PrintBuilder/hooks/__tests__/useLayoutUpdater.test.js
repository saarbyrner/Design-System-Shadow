import { renderHook } from '@testing-library/react-hooks';
import useLayoutUpdater from '../useLayoutUpdater';
import {
  DERIVED_PAGES_FROM_MOCKS,
  MOCK_LAYOUTS,
} from '../../__tests__/mockData';

describe('PrintBuilder|useLayoutUpdater', () => {
  describe('updateLayoutOnPage', () => {
    it('calls the onUpdateLayout with the correct new layout', () => {
      const onUpdateLayout = jest.fn();
      const { result } = renderHook(() =>
        useLayoutUpdater(DERIVED_PAGES_FROM_MOCKS, onUpdateLayout)
      );

      const { updateLayoutOnPage } = result.current;

      // Updates the first page
      updateLayoutOnPage(1, [
        { ...MOCK_LAYOUTS[0][0], y: 3 },
        MOCK_LAYOUTS[0][1],
        { ...MOCK_LAYOUTS[0][2], y: 0 },
        MOCK_LAYOUTS[0][3],
        MOCK_LAYOUTS[0][4],
        MOCK_LAYOUTS[0][5],
        MOCK_LAYOUTS[0][7],
      ]);

      expect(onUpdateLayout).toHaveBeenLastCalledWith([
        { ...MOCK_LAYOUTS[0][0], y: 3 },
        MOCK_LAYOUTS[0][1],
        { ...MOCK_LAYOUTS[0][2], y: 0 },
        MOCK_LAYOUTS[0][3],
        MOCK_LAYOUTS[0][4],
        MOCK_LAYOUTS[0][5],
        MOCK_LAYOUTS[0][7],
        // items on page 2 will be assigned a new y value
        // based on the y offset. This means they are
        // persisted as items on the 2nd page
        { ...MOCK_LAYOUTS[0][6], y: 12 },
        { ...MOCK_LAYOUTS[0][8], y: 14 },
        { ...MOCK_LAYOUTS[0][9], y: 14 },
      ]);

      // Updates the second page
      updateLayoutOnPage(2, [
        // realistic call as the y values are normalised based
        // on the lowest y
        { ...MOCK_LAYOUTS[0][6], y: MOCK_LAYOUTS[0][6].y - 7 },
        { ...MOCK_LAYOUTS[0][8], y: MOCK_LAYOUTS[0][8].y - 7 },
        { ...MOCK_LAYOUTS[0][9], y: MOCK_LAYOUTS[0][9].y - 7, h: 4 }, // updating the height of this widget
      ]);

      expect(onUpdateLayout).toHaveBeenLastCalledWith([
        MOCK_LAYOUTS[0][0],
        MOCK_LAYOUTS[0][1],
        MOCK_LAYOUTS[0][2],
        MOCK_LAYOUTS[0][3],
        MOCK_LAYOUTS[0][4],
        MOCK_LAYOUTS[0][5],
        MOCK_LAYOUTS[0][7],
        // items on page 2 will be assigned a new y value
        // based on the y offset. This means they are
        // persisted as items on the 2nd page
        { ...MOCK_LAYOUTS[0][6], y: 12 },
        { ...MOCK_LAYOUTS[0][8], y: 14 },
        // This is the widget we've updated the height
        { ...MOCK_LAYOUTS[0][9], y: 14, h: 4 },
      ]);
    });
  });

  describe('moveItemToNewPage', () => {
    it('calls the onUpdateLayout with the correct new layout', () => {
      const onUpdateLayout = jest.fn();
      const { result } = renderHook(() =>
        useLayoutUpdater(DERIVED_PAGES_FROM_MOCKS, onUpdateLayout)
      );

      const { moveItemToNewPage } = result.current;

      // can move from first page to second page
      moveItemToNewPage(1, 2, MOCK_LAYOUTS[0][1]);

      expect(onUpdateLayout).toHaveBeenLastCalledWith([
        MOCK_LAYOUTS[0][0],
        MOCK_LAYOUTS[0][2],
        MOCK_LAYOUTS[0][3],
        MOCK_LAYOUTS[0][4],
        MOCK_LAYOUTS[0][5],
        MOCK_LAYOUTS[0][7],
        // items on page 2 will be assigned a new y value
        // based on the y offset. This means they are
        // persisted as items on the 2nd page
        { ...MOCK_LAYOUTS[0][6], y: 12 },
        { ...MOCK_LAYOUTS[0][8], y: 14 },
        { ...MOCK_LAYOUTS[0][9], y: 14 },
        { ...MOCK_LAYOUTS[0][1], y: 12 },
      ]);

      // can move item from second to first page
      moveItemToNewPage(2, 1, MOCK_LAYOUTS[0][8]);

      expect(onUpdateLayout).toHaveBeenLastCalledWith([
        MOCK_LAYOUTS[0][0],
        MOCK_LAYOUTS[0][1],
        MOCK_LAYOUTS[0][2],
        MOCK_LAYOUTS[0][3],
        MOCK_LAYOUTS[0][4],
        MOCK_LAYOUTS[0][5],
        MOCK_LAYOUTS[0][7],
        // items on page 2 will be assigned a new y value
        // based on the y offset. This means they are
        // persisted as items on the 2nd page
        { ...MOCK_LAYOUTS[0][8], y: 0 },
        { ...MOCK_LAYOUTS[0][6], y: 12 },
        { ...MOCK_LAYOUTS[0][9], y: 14 },
      ]);
    });
  });
});
