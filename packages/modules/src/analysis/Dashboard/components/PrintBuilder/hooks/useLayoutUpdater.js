// @flow
import { useRef } from 'react';
import type { WidgetLayout } from '@kitman/modules/src/analysis/shared/types';
import { type LayoutItem } from 'react-grid-layout/lib/utils';
import _uniqBy from 'lodash/uniqBy';
import type { Pages } from '../types';

// Isolated complex logic into a hook so it can be tested
const useLayoutUpdater = (pages: Pages, onUpdateLayout: Function) => {
  const shouldBlockUpdate = useRef(false);

  const updateLayoutOnPage = (
    pageNumber: number,
    newLayout: Array<WidgetLayout>
  ) => {
    if (shouldBlockUpdate.current) {
      return;
    }

    const page = pages.find(({ number }) => number === pageNumber);
    if (!page) {
      return;
    }

    const updatedLayout = pages.reduce((acc, curr) => {
      let newLayoutWidgets = [];
      if (curr.number === page.number) {
        newLayoutWidgets = newLayout.map((newWidget) => {
          return {
            ...newWidget,
            y: page.yOffset + newWidget.y,
          };
        });
      } else {
        newLayoutWidgets = [
          ...curr.layout.map((newWidget) => {
            return {
              ...newWidget,
              y: curr.yOffset + newWidget.y,
            };
          }),
        ];
      }
      return [...acc, ...newLayoutWidgets];
    }, []);

    onUpdateLayout(updatedLayout);
  };

  const moveItemToNewPage = (
    pageFrom: number,
    pageTo: number,
    newItem: LayoutItem
  ) => {
    shouldBlockUpdate.current = true;

    const newLayout = pages.reduce((acc, curr) => {
      let newLayoutWidgets = [
        ...curr.layout.map((newWidget) => {
          return {
            ...newWidget,
            y: curr.yOffset + newWidget.y,
          };
        }),
      ];

      if (curr.number === pageFrom) {
        newLayoutWidgets = newLayoutWidgets.filter(
          (newLayoutWidget) =>
            newLayoutWidget?.i && newLayoutWidget.i !== newItem?.i
        );
      } else if (curr.number === pageTo) {
        newLayoutWidgets.push({
          ...newItem,
          y: curr.yOffset,
        });
      }

      return [...acc, ...newLayoutWidgets];
    }, []);

    onUpdateLayout(_uniqBy(newLayout, 'i'));

    shouldBlockUpdate.current = false;
  };

  return { updateLayoutOnPage, moveItemToNewPage };
};

export default useLayoutUpdater;
