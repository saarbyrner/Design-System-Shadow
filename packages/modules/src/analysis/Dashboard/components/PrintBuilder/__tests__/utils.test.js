import { MM_TO_PX, PAGE_DIMENSIONS_MM } from '../constants';
import {
  getPages,
  isOverlapping,
  cleanLayoutArray,
  initializeWidgetPositions,
  handleContentOverflow,
} from '../utils';
import {
  DERIVED_PAGES_FROM_MOCKS,
  MOCK_LAYOUTS,
  MOCK_WIDGETS,
} from './mockData';

describe('getPages', () => {
  it('sorts widget items into pages', () => {
    const pageWidthPx = PAGE_DIMENSIONS_MM.a4.short * MM_TO_PX;
    const pageHeightPx = PAGE_DIMENSIONS_MM.a4.long * MM_TO_PX;

    const pages = getPages({
      pageHeightPx,
      pageWidthPx,
      dashboardWidgets: MOCK_WIDGETS,
      printLayout: MOCK_LAYOUTS[0],
    });

    expect(pages).toStrictEqual(DERIVED_PAGES_FROM_MOCKS);
  });

  it('does not move widgets larger than the page', () => {
    const pages = getPages({
      pageHeightPx: 50,
      pageWidthPx: 500,
      dashboardWidgets: [MOCK_WIDGETS[0]],
      printLayout: [MOCK_LAYOUTS[0][0]],
    });

    expect(pages).toStrictEqual([
      {
        number: 1,
        yOffset: 0,
        layout: [MOCK_LAYOUTS[0][0]],
        widgets: [MOCK_WIDGETS[0]],
      },
    ]);
  });
});

describe('isOverlapping', () => {
  let element1;
  let element2;

  beforeEach(() => {
    // Create mock elements with a mocked getBoundingClientRect method
    element1 = {
      getBoundingClientRect: jest.fn(() => ({
        left: 10,
        right: 110,
        top: 10,
        bottom: 110,
      })),
    };

    element2 = {
      getBoundingClientRect: jest.fn(() => ({
        left: 50,
        right: 150,
        top: 50,
        bottom: 150,
      })),
    };
  });

  it('should return true when two elements are overlapping', () => {
    const result = isOverlapping(element1, element2);
    expect(result).toBe(true);
  });

  it('should return false when one element is null', () => {
    const result = isOverlapping(element1, null);
    expect(result).toBe(false);
  });

  it('should return false when two elements are not overlapping', () => {
    // Modify the mock for element2 to make them non-overlapping
    element2.getBoundingClientRect.mockReturnValue({
      left: 200,
      right: 300,
      top: 200,
      bottom: 300,
    });

    const result = isOverlapping(element1, element2);
    expect(result).toBe(false);
  });
});

describe('cleanLayoutArray', () => {
  let layoutArray;

  beforeEach(() => {
    // Create mock elements with a mocked getBoundingClientRect method
    layoutArray = [
      {
        w: 4,
        h: 3,
        x: 0,
        y: 1,
        i: '199324',
        minW: 2,
        maxW: 6,
        minH: 2,
        maxH: 5,
        moved: false,
        static: false,
        isBounded: undefined,
        isDraggable: undefined,
        isResizable: undefined,
      },
    ];
  });

  it('should return the cleaned array with only the id, coordinates and element sizes included', () => {
    const result = cleanLayoutArray(layoutArray);
    expect(result).toEqual([
      {
        w: 4,
        h: 3,
        x: 0,
        y: 1,
        i: '199324',
        minW: 2,
        maxW: 6,
        minH: 2,
        maxH: 5,
      },
    ]);
  });
});

describe('initializeWidgetPositions', () => {
  it('should correctly position widgets with y set to 0', () => {
    const layoutWidgets = [
      { x: 0, y: 0, h: 2, w: 4 },
      { x: 0, y: 0, h: 3, w: 4 },
    ];
    const result = initializeWidgetPositions(layoutWidgets);

    expect(result).toEqual([
      { x: 0, y: 0, h: 2, w: 4 },
      { x: 0, y: 2, h: 3, w: 4 }, // Second widget moved down
    ]);
  });

  it('should not change y position of side-by-side widgets with the same y value', () => {
    const layoutWidgets = [
      { x: 0, y: 0, h: 2, w: 4 },
      { x: 4, y: 0, h: 2, w: 4 },
    ];
    const result = initializeWidgetPositions(layoutWidgets);

    expect(result).toEqual([
      { x: 0, y: 0, h: 2, w: 4 },
      { x: 4, y: 0, h: 2, w: 4 },
    ]);
  });
});

describe('handleContentOverflow', () => {
  let mockDoc;
  let mockCanvas;
  let mockTempCanvas;
  let mockContext;

  beforeEach(() => {
    // Mock jsPDF document
    mockDoc = {
      addPage: jest.fn(),
      addImage: jest.fn(),
    };

    // Mock 2D context
    mockContext = {
      drawImage: jest.fn(),
    };

    // Mock canvas
    mockCanvas = {
      width: 800,
      height: 1200,
    };

    // Mock temporary canvas creation
    mockTempCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => mockContext),
    };

    // Mock document.createElement for canvas creation
    // Mock document.createElement for canvas creation
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return mockTempCanvas;
      }
      return document.createElement(tagName);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add canvas directly to PDF when content fits on single page', () => {
    mockCanvas.height = 500;
    const pageWidth = 800;
    const pageHeight = 600;

    handleContentOverflow(mockDoc, mockCanvas, pageWidth, pageHeight);

    expect(mockDoc.addPage).not.toHaveBeenCalled();
    expect(mockDoc.addImage).toHaveBeenCalledTimes(1);
    expect(mockDoc.addImage).toHaveBeenCalledWith(
      mockCanvas,
      'JPEG',
      0,
      0,
      pageWidth,
      mockCanvas.height
    );
  });

  it('should split content across multiple pages when canvas height exceeds page height', () => {
    mockCanvas.height = 1500;
    const pageWidth = 800;
    const pageHeight = 600;

    handleContentOverflow(mockDoc, mockCanvas, pageWidth, pageHeight);

    expect(mockDoc.addPage).toHaveBeenCalledTimes(2); // 2 new pages (first page is default)
    expect(mockDoc.addImage).toHaveBeenCalledTimes(3); // 3 images
    expect(document.createElement).toHaveBeenCalledWith('canvas');
    expect(mockContext.drawImage).toHaveBeenCalledTimes(3);
  });

  it('should correctly crop canvas content for each page', () => {
    mockCanvas.height = 1200;
    const pageWidth = 800;
    const pageHeight = 500;

    handleContentOverflow(mockDoc, mockCanvas, pageWidth, pageHeight);

    // Verify drawImage calls for cropping
    expect(mockContext.drawImage).toHaveBeenCalledTimes(3);

    // First page (0-500)
    expect(mockContext.drawImage).toHaveBeenNthCalledWith(
      1,
      mockCanvas, // source canvas
      0, // source x
      0, // source y (first page starts at 0)
      mockCanvas.width, // source width
      pageHeight, // source height
      0, // destination x
      0, // destination y
      mockCanvas.width, // destination width
      pageHeight // destination height
    );

    // Second page (500-1000)
    expect(mockContext.drawImage).toHaveBeenNthCalledWith(
      2,
      mockCanvas,
      0,
      500, // source y offset for second page
      mockCanvas.width,
      pageHeight,
      0,
      0,
      mockCanvas.width,
      pageHeight
    );

    // Third page (1000-1200)
    expect(mockContext.drawImage).toHaveBeenNthCalledWith(
      3,
      mockCanvas,
      0,
      1000, // source y offset for third page
      mockCanvas.width,
      200, // remaining height (1200 - 1000)
      0,
      0,
      mockCanvas.width,
      200
    );
  });

  it('should set correct canvas dimensions for temporary canvases', () => {
    mockCanvas.height = 1200;
    const pageWidth = 800;
    const pageHeight = 500;

    handleContentOverflow(mockDoc, mockCanvas, pageWidth, pageHeight);

    // Each temporary canvas should have the source canvas width
    expect(mockTempCanvas.width).toBe(mockCanvas.width);

    // The height should be set to the current page height for each iteration
    // The last call should set it to the remaining height (200px)
    expect(mockTempCanvas.height).toBe(200); // Last page height
  });

  it('should handle edge case where canvas height exactly equals page height', () => {
    mockCanvas.height = 600;
    const pageWidth = 800;
    const pageHeight = 600;

    handleContentOverflow(mockDoc, mockCanvas, pageWidth, pageHeight);

    // Should not split into multiple pages
    expect(mockDoc.addPage).not.toHaveBeenCalled();
    expect(mockDoc.addImage).toHaveBeenCalledTimes(1);
    expect(mockDoc.addImage).toHaveBeenCalledWith(
      mockCanvas,
      'JPEG',
      0,
      0,
      pageWidth,
      mockCanvas.height
    );
  });

  it('should handle very small canvas that needs splitting', () => {
    mockCanvas.height = 150;
    mockCanvas.width = 400;
    const pageWidth = 800;
    const pageHeight = 100;

    handleContentOverflow(mockDoc, mockCanvas, pageWidth, pageHeight);

    expect(mockDoc.addPage).toHaveBeenCalledTimes(2);
    expect(mockDoc.addImage).toHaveBeenCalledTimes(3);
    expect(mockTempCanvas.width).toBe(mockCanvas.width);
  });

  it('should add images with correct dimensions to PDF document', () => {
    mockCanvas.height = 700;
    mockCanvas.width = 400;
    const pageWidth = 600;
    const pageHeight = 300;

    handleContentOverflow(mockDoc, mockCanvas, pageWidth, pageHeight);

    expect(mockDoc.addImage).toHaveBeenCalledTimes(4);

    // Check that addImage is called with correct parameters for each page
    expect(mockDoc.addImage).toHaveBeenNthCalledWith(
      1,
      mockTempCanvas,
      'JPEG',
      0,
      0,
      pageWidth,
      pageHeight
    );

    expect(mockDoc.addImage).toHaveBeenNthCalledWith(
      2,
      mockTempCanvas,
      'JPEG',
      0,
      0,
      pageWidth,
      pageHeight
    );

    expect(mockDoc.addImage).toHaveBeenNthCalledWith(
      3,
      mockTempCanvas,
      'JPEG',
      0,
      0,
      pageWidth,
      pageHeight
    );

    expect(mockDoc.addImage).toHaveBeenNthCalledWith(
      4,
      mockTempCanvas,
      'JPEG',
      0,
      0,
      pageWidth,
      150 // remaining height for last page
    );
  });
});
