import {
  getPlayerColumn,
  getPlayerIdColumn,
  getDepartedDateColumn,
  getOpenInjuryIllnessColumn,
} from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/components/Grid/Columns';

const columns = {
  player: getPlayerColumn(),
  player_id: getPlayerIdColumn(),
  departed_date: getDepartedDateColumn(),
  open_injury_illness: getOpenInjuryIllnessColumn(),
};

describe('Columns', () => {
  it.each(Object.keys(columns))('has a %s column', (columnKey) => {
    const columnObject = {
      field: columns[columnKey].field,
      type: columns[columnKey].type,
      headerName: columns[columnKey].headerName,
      flex: columns[columnKey].flex,
      width: columns[columnKey].width,
      visible: columns[columnKey].visible,
      sortable: columns[columnKey].sortable,
      renderCell: columns[columnKey].renderCell,
      getActions: columns[columnKey].getActions,
    };
    expect(columns[columnKey]).toEqual(columnObject);
  });
});
