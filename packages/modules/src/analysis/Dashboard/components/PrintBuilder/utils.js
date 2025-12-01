// @flow
import { type LayoutItem } from 'react-grid-layout/lib/utils';
import _minBy from 'lodash/minBy';
import _sortBy from 'lodash/sortBy';
import { jsPDF as JSPDF } from 'jspdf';
// calculateUtils is exported by lib but not in flow
// ref https://github.com/react-grid-layout/react-grid-layout/pull/1918
// $FlowIgnore
import { utils, calculateUtils } from 'react-grid-layout';
import type { WidgetData } from '@kitman/modules/src/analysis/Dashboard/types';

import { PAGE_MARGIN_PX } from './constants';
import type { Page, Pages, PrintLayout } from './types';

export const getDefaultGridProps = (scale: number = 1) => {
  const widgetMargin = 10 * scale;

  return {
    cols: 6,
    containerPadding: [0, 0],
    margin: [widgetMargin, widgetMargin],
    rowHeight: 100 * scale,
  };
};

// This function check that widgets are correctly positioned vertically in the layout.
// Widgets with the same `y` position and different `x` are treated as side-by-side.
export const initializeWidgetPositions = (
  layoutWidgets: PrintLayout
): PrintLayout => {
  let currentY = 0;
  return layoutWidgets.map((widget, index) => {
    const prevWidget = layoutWidgets[index - 1];

    if (index > 0 && widget.y === prevWidget.y && widget.x !== 0) {
      return widget; // Keep same y for side-by-side widgets
    }

    if (index !== 0 && widget.y === 0) {
      currentY += prevWidget.h; // Increment y by height of previous widget
      return { ...widget, y: currentY };
    }

    return widget;
  });
};

type GetPagesConfig = {
  pageWidthPx: number,
  pageHeightPx: number,
  printLayout: PrintLayout,
  dashboardWidgets: Array<WidgetData>,
};
/**
 * getPages takes a dashboard layout from react-grid-layout and sorts it into an array of pages based on the
 * size of the page available.
 *
 * @param {GetPagesConfig} param0 data needed to sort layout into pages
 * @returns Pages
 */
export const getPages = ({
  pageWidthPx,
  pageHeightPx,
  printLayout,
  dashboardWidgets,
}: GetPagesConfig): Pages => {
  /**
   * This is a recursive function which will loop through a given list of layoutWidgets
   *
   * For each widget it will
   *  - Calculate its grid position and height
   *  - determine if it can fit on the page number in scope
   *  - put it in the page OR keep it aside to be sorted in the next call
   *
   * If there are widgets that wont fit in the page, it will recursively call its self
   * to make sure that all widgets are sorted into a page
   *
   * @param {PrintLayout} layoutWidgets the widgets you wish to sort into pages
   * @param {number} pageNumber the page number that its currently on
   * @param {Pages} pages any pages that have been created so far
   * @returns Pages
   */
  const updatedPrintLayout = initializeWidgetPositions(printLayout);
  function sortToPages(
    layoutWidgets: PrintLayout,
    pageNumber: number,
    pages: Pages = []
  ): Pages {
    const widgets: Array<WidgetData> = [];
    const layout = [];
    const remaining = [];
    const pageIndex = pageNumber - 1;
    // the "y" attribute tells us the vertical positioning of the
    // item in the grid. We get the first item on the page by
    // determining what the lowest "y" is. This is important because
    // it will mean all widgets can be positioned relative to this one
    const lowestY = _minBy(layoutWidgets, 'y');
    const defaultRGLProps = getDefaultGridProps();
    const rowsOnPage = Math.ceil(pageHeightPx / defaultRGLProps.rowHeight);

    utils.sortLayoutItemsByRowCol(layoutWidgets).forEach((lw) => {
      const layoutWidget = {
        ...lw,
        // Normalising the widgets based on the lowest y value
        // in the list of grids
        y: lw.y - lowestY.y,
      };
      // $FlowIgnore - calcGridItemPosition is exported by lib but not in flow
      const position = calculateUtils.calcGridItemPosition(
        {
          ...defaultRGLProps,
          // Max rows in a grid based on the page height and the row height
          maxRows: rowsOnPage,
          containerWidth: pageWidthPx,
        },
        layoutWidget.x,
        layoutWidget.y,
        layoutWidget.w,
        layoutWidget.h
      );

      const widgetEnd = position.top + position.height;
      const pageEnd = pageHeightPx - PAGE_MARGIN_PX * 2;

      // This is where we determine if the widget fits on the current
      // page or not. If it does then we push the layout item and its
      // coressponding widget into the page or else we put it in the remaining
      if (widgetEnd < pageEnd || position.height >= pageEnd) {
        const dashboardWidget = dashboardWidgets.find(
          ({ id }) => layoutWidget.i === `${id}`
        );
        if (dashboardWidget) {
          layout.push(layoutWidget);
          widgets.push(dashboardWidget);
        }
      } else {
        remaining.push(lw);
      }
    });

    // The page youre on should have y values larger
    // than the number of rows on a page * the page you
    // are on. This insures that widgets persist on the
    // server based on the page that they are on
    const startOfPageY = rowsOnPage * pageIndex;
    // yOffset is where we store
    // how much was removed from the y value of each
    // grid item. This is then used when sending the
    // global grid layout to the server to persist
    // Its based on the higher of
    //  - the lowestY value in a set of widgets
    //  - OR the start of the page
    const yOffset = Math.max(lowestY.y, startOfPageY);

    // Build the page object
    const page: Page = {
      yOffset,
      number: pageNumber,
      widgets,
      layout,
    };
    const newPages: Pages = [...pages, page];

    // If there are remaining widgets left then we'll call
    // the function again
    if (remaining.length) {
      return sortToPages(remaining, pageNumber + 1, newPages);
    }

    return newPages;
  }

  return sortToPages(updatedPrintLayout, 1) || [];
};

/**
 * Simple util which tels us if the two html elements supplied are
 * overlapping or not
 */
export const isOverlapping = (
  element1: HTMLElement,
  element2: ?HTMLElement
) => {
  const rect1 = element1.getBoundingClientRect();
  if (!element2) {
    return false;
  }

  const rect2 = element2.getBoundingClientRect();

  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
};

/**
 * Cleans and sorts the Layout array for comparing for equality in AutoSave
 */
export const cleanLayoutArray = (layoutArray: PrintLayout) => {
  const cleanArray: PrintLayout = [];
  layoutArray.forEach((layout) => {
    const cleanPrintLayout: LayoutItem = {
      i: layout.i,
      w: layout.w,
      h: layout.h,
      x: layout.x,
      y: layout.y,
      minW: layout?.minW,
      maxW: layout?.maxW,
      minH: layout.minH,
      maxH: layout.maxH,
    };
    cleanArray.push(cleanPrintLayout);
  });
  return _sortBy(cleanArray);
};

/**
 * Handles content overflow for PDF generation by splitting tall canvases across multiple pages.
 *
 * When a canvas height exceeds the available page height, this function will:
 * - Calculate how many pages are needed
 * - Create temporary canvases for each page segment
 * - Crop the original canvas content to fit each page
 * - Add each page segment to the PDF document
 *
 * @param {JSPDF} doc - The jsPDF document instance to add pages to
 * @param {HTMLCanvasElement} canvas - The source canvas element containing the content to split
 * @param {number} pageWidth - The width of each PDF page in pixels
 * @param {number} pageHeight - The height of each PDF page in pixels (maximum content height per page)
 *
 * @example
 * ```javascript
 * const doc = new JSPDF({ orientation: 'portrait', unit: 'px', format: [800, 600] });
 * const canvas = await html2canvas(document.getElementById('content'));
 *
 * handleContentOverflow(doc, canvas, 800, 600);
 * doc.save('multi-page-document.pdf');
 * ```
 */
export const handleContentOverflow = (
  doc: JSPDF,
  canvas: HTMLCanvasElement,
  pageWidth: number,
  pageHeight: number
) => {
  const canvasHeight = canvas.height;

  const canvasPixelRatio = canvas.width / pageWidth;

  const maxPageHeightInPixels = pageHeight * canvasPixelRatio;

  if (canvasHeight > Math.ceil(maxPageHeightInPixels)) {
    // Split content across multiple pages
    const pages = Math.ceil(canvasHeight / maxPageHeightInPixels);

    for (let i = 0; i < pages; i++) {
      if (i > 0) doc.addPage();

      const yOffset = i * maxPageHeightInPixels;
      const currentHeight = Math.min(
        maxPageHeightInPixels,
        canvasHeight - yOffset
      );

      // Create cropped canvas for this page
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = currentHeight;

      // Use drawImage with source rectangle parameters
      ctx.drawImage(
        canvas, // source canvas
        0, // source x
        yOffset, // source y (positive offset)
        canvas.width, // source width
        currentHeight, // source height
        0, // destination x
        0, // destination y
        canvas.width, // destination width
        currentHeight // destination height
      );

      const pdfImageHeight = (currentHeight * pageWidth) / canvas.width;

      doc.addImage(tempCanvas, 'JPEG', 0, 0, pageWidth, pdfImageHeight);
    }
  } else {
    doc.addImage(canvas, 'JPEG', 0, 0, pageWidth, canvasHeight);
  }
};
