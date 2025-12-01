// @flow

export const data = [
  {
    column_section: 'Total number of symptoms:',
    column_baseline: '3/22',
    column_1: {
      date: '2022-04-01 01:00:00 +0100',
      value: '10',
    },
    column_2: {
      date: '2022-04-02 01:00:00 +0100',
      value: '22',
    },
    column_3: {
      date: '2022-04-03 01:00:00 +0100',
      value: '33',
    },
    column_4: {
      date: '2022-04-04 01:00:00 +0100',
      value: '44',
    },
    column_5: {
      date: '2022-04-05 01:00:00 +0100',
      value: '55',
    },
    column_6: {
      date: '2022-04-06 01:00:00 +0100',
      value: '66',
    },
    column_7: {
      date: '2022-04-07 01:00:00 +0100',
      value: '77',
    },
    column_8: {
      date: '2022-04-08 01:00:00 +0100',
      value: '88',
    },
    column_9: {
      date: '2022-04-09 01:00:00 +0100',
      value: '99',
    },
  },
  {
    column_section: 'Symptom severity score:',
    column_baseline: '3/132',
    column_1: {
      date: '2022-04-01 01:00:00 +0100',
      value: '10',
    },
    column_2: {
      date: '2022-04-02 01:00:00 +0100',
      value: '22',
    },
    column_3: {
      date: '2022-04-03 01:00:00 +0100',
      value: '33',
    },
    column_4: {
      date: '2022-04-04 01:00:00 +0100',
      value: '44',
    },
    column_5: {
      date: '2022-04-05 01:00:00 +0100',
      value: '55',
    },
    column_6: {
      date: '2022-04-06 01:00:00 +0100',
      value: '66',
    },
    column_7: {
      date: '2022-04-07 01:00:00 +0100',
      value: '77',
    },
    column_8: {
      date: '2022-04-08 01:00:00 +0100',
      value: '88',
    },
    column_9: {
      date: '2022-04-09 01:00:00 +0100',
      value: '99',
    },
  },
  {
    column_section: 'SAC',
    column_baseline: '1/150',
    column_1: {
      date: '2022-04-01 01:00:00 +0100',
      value: '10',
    },
    column_2: {
      date: '2022-04-02 01:00:00 +0100',
      value: '22',
    },
    column_3: {
      date: '2022-04-03 01:00:00 +0100',
      value: '33',
    },
    column_4: {
      date: '2022-04-04 01:00:00 +0100',
      value: '44',
    },
    column_5: {
      date: '2022-04-05 01:00:00 +0100',
      value: '55',
    },
    column_6: {
      date: '2022-04-06 01:00:00 +0100',
      value: '66',
    },
    column_7: {
      date: '2022-04-07 01:00:00 +0100',
      value: '77',
    },
    column_8: {
      date: '2022-04-08 01:00:00 +0100',
      value: '88',
    },
    column_9: {
      date: '2022-04-09 01:00:00 +0100',
      value: '99',
    },
  },
  {
    column_section: 'Neurological screen',
    column_baseline: '2/5',
    column_1: {
      date: '2022-04-01 01:00:00 +0100',
      value: '10',
    },
    column_2: {
      date: '2022-04-02 01:00:00 +0100',
      value: '22',
    },
    column_3: {
      date: '2022-04-03 01:00:00 +0100',
      value: '33',
    },
    column_4: {
      date: '2022-04-04 01:00:00 +0100',
      value: '44',
    },
    column_5: {
      date: '2022-04-05 01:00:00 +0100',
      value: '55',
    },
    column_6: {
      date: '2022-04-06 01:00:00 +0100',
      value: '66',
    },
    column_7: {
      date: '2022-04-07 01:00:00 +0100',
      value: '77',
    },
    column_8: {
      date: '2022-04-08 01:00:00 +0100',
      value: '88',
    },
    column_9: {
      date: '2022-04-09 01:00:00 +0100',
      value: '99',
    },
  },
  {
    column_section: 'Balance examination',
    column_baseline: '6/30',
    column_1: {
      date: '2022-04-01 01:00:00 +0100',
      value: '10',
    },
    column_2: {
      date: '2022-04-02 01:00:00 +0100',
      value: '22',
    },
    column_3: {
      date: '2022-04-03 01:00:00 +0100',
      value: '33',
    },
    column_4: {
      date: '2022-04-04 01:00:00 +0100',
      value: '44',
    },
    column_5: {
      date: '2022-04-05 01:00:00 +0100',
      value: '55',
    },
    column_6: {
      date: '2022-04-06 01:00:00 +0100',
      value: '66',
    },
    column_7: {
      date: '2022-04-07 01:00:00 +0100',
      value: '77',
    },
    column_8: {
      date: '2022-04-08 01:00:00 +0100',
      value: '88',
    },
    column_9: {
      date: '2022-04-09 01:00:00 +0100',
      value: '99',
    },
  },
];

export const reactTableColumns = [
  {
    Header: 'Section',
    accessor: 'column_section',
    width: 277,
    sticky: 'left',
  },
  {
    Header: 'Baseline',
    accessor: 'column_baseline',
    width: 100,
    sticky: 'left',
  },
  {
    Header: 'Apr 01',
    accessor: 'column_2022_04_01',
    width: 100,
  },
  {
    Header: 'Apr 02',
    accessor: 'column_2022_04_02',
    width: 100,
  },
  {
    Header: 'Apr 03',
    accessor: 'column_2022_04_03',
    width: 100,
  },
  {
    Header: 'Apr 04',
    accessor: 'column_2022_04_04',
    width: 100,
  },
  {
    Header: 'Apr 05',
    accessor: 'column_2022_04_05',
    width: 100,
  },
  {
    Header: 'Apr 06',
    accessor: 'column_2022_04_06',
    width: 100,
  },
  {
    Header: 'Apr 07',
    accessor: 'column_2022_04_07',
    width: 100,
  },
  {
    Header: 'Apr 08',
    accessor: 'column_2022_04_08',
    width: 100,
  },
  {
    Header: 'Apr 09',
    accessor: 'column_2022_04_09',
    width: 100,
  },
];

export const reactDataGridColumns = [
  {
    frozen: true,
    key: 'column_section',
    name: 'Section',
    sticky: 'left',
    width: 277,
  },
  {
    key: 'column_baseline',
    name: 'Baseline',
    frozen: true,
    sticky: 'left',
    width: 100,
  },
  {
    key: 'column_1',
    name: 'Apr 01',
    width: 100,
  },
  {
    key: 'column_2',
    name: 'Apr 02',
    width: 100,
  },
  {
    key: 'column_3',
    name: 'Apr 03',
    width: 100,
  },
  {
    key: 'column_4',
    name: 'Apr 04',
    width: 100,
  },
  {
    key: 'column_5',
    name: 'Apr 05',
    width: 100,
  },
  {
    key: 'column_6',
    name: 'Apr 06',
    width: 100,
  },
  {
    key: 'column_7',
    name: 'Apr 07',
    width: 100,
  },
  {
    key: 'column_8',
    name: 'Apr 08',
    width: 100,
  },
  {
    key: 'column_9',
    name: 'Apr 09',
    width: 100,
  },
];
