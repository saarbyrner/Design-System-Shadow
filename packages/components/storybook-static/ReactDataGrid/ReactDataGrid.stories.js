// @flow
import { useArgs } from '@storybook/client-api';
import { Checkbox, ToggleSwitch, Select } from '@kitman/components';
import { useState, useMemo } from 'react';
import ReactDataGrid from './index';
import style from './style';

export const Basic = (gridArgs: Object) => {
  const [args] = useArgs();

  const [tableBodyData, setTableBodyData] = useState([
    {
      id: 1,
      athlete: 'Gianluigi  Buffon',
      status: 'Returning',
      participation: 'Modified',
      rondo_warm_up: true,
      sdp: false,
      selected: false,
    },
    {
      id: 2,
      athlete: 'Lev Yashin',
      status: 'Injured/ill',
      participation: 'Partial',
      rondo_warm_up: true,
      sdp: false,
      selected: false,
    },
    {
      id: 3,
      athlete: 'TAA',
      status: 'Unselected',
      participation: 'None',
      rondo_warm_up: true,
      sdp: true,
      selected: false,
    },
    {
      id: 4,
      athlete: 'Paulo Ferreira',
      status: 'Unselected',
      participation: 'None',
      rondo_warm_up: true,
      sdp: true,
      selected: false,
    },
    {
      id: 5,
      athlete: 'Andrea Pirlo',
      status: 'selected',
      participation: 'Full',
      rondo_warm_up: true,
      sdp: true,
      selected: false,
    },
    {
      id: 6,
      athlete: 'Zizinho',
      status: 'selected',
      participation: 'Full',
      rondo_warm_up: true,
      sdp: true,
      selected: true,
    },
    {
      id: 7,
      athlete: 'Luca Toni',
      status: 'selected',
      participation: 'Full',
      rondo_warm_up: true,
      sdp: true,
      selected: false,
      expanded: false,
      sub_rows: [
        {
          id: 8,
          athlete: 'Luca Toni junior',
          status: 'selected',
          participation: 'Full',
          rondo_warm_up: false,
          sdp: true,
          selected: false,
        },
      ],
    },
  ]);
  const summaryRows = useMemo(() => {
    const summaryRow = {
      everyRondoWarmUp: tableBodyData.every((item) => item.rondo_warm_up),
      everySDP: tableBodyData.every((item) => item.sdp),
    };

    return [summaryRow];
  }, [tableBodyData]);

  const [tableHeaderData, setTableHeaderData] = useState([
    {
      key: 'selected',
      name: '',
      formatter({ row, onRowChange }) {
        return (
          <Checkbox
            id="checkBox_id"
            isChecked={row.selected}
            toggle={() => {
              onRowChange({ ...row, selected: !row.selected });
            }}
          />
        );
      },
      frozen: true,
      resizable: true,
      sticky: 'left',
      width: 35,
      minWidth: 35,
      maxWidth: 35,
    },
    {
      frozen: true,
      key: 'athlete',
      name: 'Athlete/Position',
      sticky: 'left',
      width: 277,
    },
    {
      key: 'status',
      name: 'Status',
      sticky: 'left',
      width: 120,
    },
    {
      key: 'participation',
      name: 'Participation',
      summaryFormatter() {
        return (
          <Select
            options={[
              {
                label: 'Full',
                value: 'Full',
              },
              {
                label: 'Semi-full',
                value: 'Semi-full',
              },
            ]}
            onChange={(value) => {
              setTableBodyData((prev) => {
                return prev.map((tableItem) => {
                  const copyTableItem = { ...tableItem };
                  copyTableItem.participation = value;
                  return copyTableItem;
                });
              });

              // resetting the column headers refreshes the whole table
              setTableHeaderData((prev) => prev.slice());
            }}
            appendToBody
          />
        );
      },
      width: 120,
    },
    {
      key: 'rondo_warm_up',
      name: 'Rondo Warm Up',
      formatter: ({ row, onRowChange }) => {
        return (
          <div css={style.toggle}>
            <ToggleSwitch
              isSwitchedOn={row.rondo_warm_up}
              toggle={() => {
                onRowChange({ ...row, rondo_warm_up: !row.rondo_warm_up });
              }}
              kitmanDesignSystem
            />
          </div>
        );
      },
      sticky: 'left',
      width: 140,
      summaryFormatter({ row }) {
        return (
          <Checkbox
            label="01"
            id="checkboxId"
            isChecked={row.everyRondoWarmUp}
            toggle={(value) => {
              setTableBodyData((prev) => {
                return prev.map((tableItem) => {
                  const copyTableItem = { ...tableItem };
                  copyTableItem.rondo_warm_up = value.checked;
                  return copyTableItem;
                });
              });

              // resetting the column headers refreshes the whole table
              setTableHeaderData((prev) => prev.slice());
            }}
            kitmanDesignSystem
          />
        );
      },
    },
    {
      key: 'sdp',
      name: '1v1 SDP',
      formatter: ({ row, onRowChange }) => {
        return (
          <div css={style.toggle}>
            <ToggleSwitch
              isSwitchedOn={row.sdp}
              toggle={() => {
                onRowChange({ ...row, sdp: !row.sdp });
              }}
              kitmanDesignSystem
            />
          </div>
        );
      },
      summaryFormatter({ row }) {
        return (
          <>
            <Checkbox
              label="02A"
              id="checkboxId"
              isChecked={row.everySDP}
              toggle={(value) => {
                setTableBodyData((prev) => {
                  return prev.map((tableItem) => {
                    const copyTableItem = { ...tableItem };
                    copyTableItem.sdp = value.checked;
                    return copyTableItem;
                  });
                });

                // resetting the column headers refreshes the whole table
                setTableHeaderData((prev) => prev.slice());
              }}
              kitmanDesignSystem
            />
          </>
        );
      },
      sticky: 'left',
      width: 140,
    },
  ]);

  const onRowsChange = (rows, { indexes }) => {
    const rowsCopy = rows.slice();
    const row = rowsCopy[indexes[0]];
    if (row.sub_rows) {
      if (!row.expanded) {
        rowsCopy.splice(indexes[0] + 1, row.sub_rows.length);
      } else {
        rowsCopy.splice(indexes[0] + 1, row.sub_rows.length, ...row.sub_rows);
      }
    }
    setTableBodyData(rowsCopy);
  };

  return (
    <div css={style.dataGridTable}>
      <ReactDataGrid
        {...args}
        rowHeight={gridArgs.rowHeight}
        headerRowHeight={gridArgs.headerRowHeight}
        expandableSubRows={gridArgs.expandableSubRows}
        tableHeaderData={tableHeaderData}
        tableBodyData={tableBodyData}
        onRowsChange={onRowsChange}
        summaryRows={summaryRows}
      />
    </div>
  );
};

Basic.args = {
  rowHeight: 32,
  headerRowHeight: 40,
  expandableSubRows: true,
};

// export default ReactDataGrid;
export default {
  title: 'React Data Grid',
  component: Basic,
  argTypes: {
    expandableSubRows: { control: { type: 'boolean' } },
  },
};
