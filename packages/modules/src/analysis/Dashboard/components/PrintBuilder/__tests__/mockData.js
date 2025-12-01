// @flow

export const MOCK_LAYOUTS = [
  [
    { i: '1', x: 0, y: 0, w: 3, h: 3 }, // 0
    { i: '2', x: 3, y: 0, w: 2, h: 3 }, // 1
    { i: '3', x: 0, y: 3, w: 2, h: 2 }, // 2
    { i: '4', x: 2, y: 3, w: 1, h: 1 }, // 3
    { i: '5', x: 0, y: 5, w: 3, h: 3 }, // 4
    { i: '6', x: 3, y: 5, w: 2, h: 2 }, // 5
    { i: '7', x: 0, y: 7, w: 3, h: 3 }, // 6
    { i: '8', x: 3, y: 7, w: 2, h: 2 }, // 7
    { i: '9', x: 0, y: 9, w: 2, h: 3 }, // 8
    { i: '10', x: 2, y: 9, w: 1, h: 1 }, // 9
  ],
  [
    { i: '1', x: 1, y: 0, w: 5, h: 3 }, // 0 x and w changed
    { i: '2', x: 3, y: 0, w: 2, h: 3 }, // 1
    { i: '3', x: 0, y: 3, w: 2, h: 2 }, // 2
    { i: '4', x: 2, y: 3, w: 1, h: 1 }, // 3
    { i: '5', x: 0, y: 5, w: 3, h: 3 }, // 4
    { i: '6', x: 3, y: 5, w: 2, h: 2 }, // 5
    { i: '7', x: 0, y: 7, w: 3, h: 3 }, // 6
    { i: '8', x: 3, y: 7, w: 2, h: 2 }, // 7
    { i: '9', x: 0, y: 9, w: 2, h: 3 }, // 8
    { i: '10', x: 2, y: 9, w: 1, h: 1 }, // 9
  ],
  [
    { i: '1', x: 1, y: 0, w: 5, h: 3 }, // 0
    { i: '2', x: 3, y: 1, w: 2, h: 1 }, // 1 y and h changed
    { i: '3', x: 0, y: 3, w: 2, h: 2 }, // 2
    { i: '4', x: 2, y: 3, w: 1, h: 1 }, // 3
    { i: '5', x: 0, y: 5, w: 3, h: 3 }, // 4
    { i: '6', x: 3, y: 5, w: 2, h: 2 }, // 5
    { i: '7', x: 0, y: 7, w: 3, h: 3 }, // 6
    { i: '8', x: 3, y: 7, w: 2, h: 2 }, // 7
    { i: '9', x: 0, y: 9, w: 2, h: 3 }, // 8
    { i: '10', x: 2, y: 9, w: 1, h: 1 }, // 9
  ],
];

export const MOCK_WIDGETS = [
  {
    id: '1',
    print_horizontal_position: 0,
    print_vertical_position: 0,
    print_rows: 2,
    print_cols: 2,
    widget: {},
    widget_render: {
      name: 'Widget 1',
    },
  },
  {
    id: '2',
    print_horizontal_position: 2,
    print_vertical_position: 0,
    print_rows: 2,
    print_cols: 1,
    widget: {},
    widget_render: {
      name: 'Widget 2',
    },
  },
  {
    id: '3',
    print_horizontal_position: 0,
    print_vertical_position: 2,
    print_rows: 2,
    print_cols: 1,
    widget: {},
    widget_render: {
      name: 'Widget 3',
    },
  },
  {
    id: '4',
    print_horizontal_position: 2,
    print_vertical_position: 2,
    print_rows: 1,
    print_cols: 1,
    widget: {
      name: 'Widget 4',
    },
    widget_render: {},
  },
  {
    id: '5',
    print_horizontal_position: 0,
    print_vertical_position: 4,
    print_rows: 2,
    print_cols: 2,
    widget: {
      name: 'Widget 5',
    },
    widget_render: {},
  },
  {
    id: '6',
    print_horizontal_position: 2,
    print_vertical_position: 4,
    print_rows: 1,
    print_cols: 2,
    widget: {
      name: 'Widget 6',
    },
    widget_render: {},
  },
  {
    id: '7',
    print_horizontal_position: 0,
    print_vertical_position: 6,
    print_rows: 2,
    print_cols: 2,
    widget: {},
    widget_render: {
      name: 'Widget 7',
    },
  },
  {
    id: '8',
    print_horizontal_position: 2,
    print_vertical_position: 6,
    print_rows: 1,
    print_cols: 1,
    widget: {},
    widget_render: {
      name: 'Widget 8',
    },
  },
  {
    id: '9',
    print_horizontal_position: 0,
    print_vertical_position: 7,
    print_rows: 2,
    print_cols: 1,
    widget: {
      name: 'Widget 9',
    },
    widget_render: {},
  },
  {
    id: '10',
    print_horizontal_position: 2,
    print_vertical_position: 7,
    print_rows: 1,
    print_cols: 1,
    widget: {
      name: 'Widget 10',
    },
    widget_render: {},
  },
];

export const DERIVED_PAGES_FROM_MOCKS = [
  {
    number: 1,
    yOffset: 0,
    layout: [
      MOCK_LAYOUTS[0][0],
      MOCK_LAYOUTS[0][1],
      MOCK_LAYOUTS[0][2],
      MOCK_LAYOUTS[0][3],
      MOCK_LAYOUTS[0][4],
      MOCK_LAYOUTS[0][5],
      MOCK_LAYOUTS[0][7],
    ],
    widgets: [
      MOCK_WIDGETS[0],
      MOCK_WIDGETS[1],
      MOCK_WIDGETS[2],
      MOCK_WIDGETS[3],
      MOCK_WIDGETS[4],
      MOCK_WIDGETS[5],
      MOCK_WIDGETS[7],
    ],
  },
  {
    number: 2,
    yOffset: 12,
    layout: [
      // Removing the lowest y value from each one so
      // to make the layout relative to its own value
      { ...MOCK_LAYOUTS[0][6], y: MOCK_LAYOUTS[0][6].y - 7 },
      { ...MOCK_LAYOUTS[0][8], y: MOCK_LAYOUTS[0][8].y - 7 },
      { ...MOCK_LAYOUTS[0][9], y: MOCK_LAYOUTS[0][9].y - 7 },
    ],
    widgets: [MOCK_WIDGETS[6], MOCK_WIDGETS[8], MOCK_WIDGETS[9]],
  },
];
