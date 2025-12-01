import { DEFAULT_CURRENCY } from '@kitman/modules/src/LeagueOperations/shared/consts';
import {
  getTextColumn,
  getAddressColumn,
  currencyColumn,
  getAvatarColumn,
  getRegistrationStatusColumn,
  getDisciplineStatusColumn,
  COMMON_COLUMN_PROPS,
  getLabelStatusColumn,
  onTransformColumns,
} from '..';

const COLUMNS = {
  avatar: {
    ...COMMON_COLUMN_PROPS,
    field: 'club',
    flex: 2,
    headerName: 'Club',
    renderCell: expect.any(Function),
  },
  address: {
    ...COMMON_COLUMN_PROPS,
    field: 'address',
    flex: 1,
    headerName: 'State / Province',
    renderCell: expect.any(Function),
  },
  registrationStatus: {
    ...COMMON_COLUMN_PROPS,
    field: 'status',
    flex: 1,
    headerName: 'Status',
    renderCell: expect.any(Function),
  },
  currency: {
    ...COMMON_COLUMN_PROPS,
    field: 'registration_balance',
    flex: 1,
    headerName: 'Unpaid Balance',
    renderCell: expect.any(Function),
    currency: 'USD',
  },
  disciplineStatus: {
    ...COMMON_COLUMN_PROPS,
    field: 'discipline_status',
    flex: 1,
    headerName: 'Discipline status',
    renderCell: expect.any(Function),
  },
  labels: {
    ...COMMON_COLUMN_PROPS,
    field: 'labels',
    flex: 1,
    headerName: 'Labels',
    renderCell: expect.any(Function),
  },
};

describe('columns', () => {
  it('returns the correct config for a getTextColumn', () => {
    expect(getTextColumn({ field: 'club', headerName: 'Club' })).toEqual({
      ...COMMON_COLUMN_PROPS,
      field: 'club',
      flex: 1,
      headerName: 'Club',
    });
  });
  it('returns the correct config for an getAddressColumn', () => {
    expect(
      getAddressColumn({
        field: 'address',
        headerName: 'State / Province',
      })
    ).toEqual(COLUMNS.address);
  });
  it('returns the correct config for a currencyColumn', () => {
    expect(
      currencyColumn({
        field: 'registration_balance',
        headerName: 'Unpaid Balance',
        currency: 'USD',
      })
    ).toEqual(COLUMNS.currency);
  });
  it('returns the correct config for a getAvatarColumn', () => {
    expect(
      getAvatarColumn({
        field: 'club',
        headerName: 'Club',
        flex: 2,
      })
    ).toEqual(COLUMNS.avatar);
  });
  it('returns the correct config for a getRegistrationStatusColumn', () => {
    expect(
      getRegistrationStatusColumn({
        field: 'status',
        headerName: 'Status',
      })
    ).toEqual(COLUMNS.registrationStatus);
  });
  it('returns the correct config for a getDisciplineStatusColumn', () => {
    expect(
      getDisciplineStatusColumn({
        field: 'discipline_status',
        headerName: 'Discipline status',
      })
    ).toEqual(COLUMNS.disciplineStatus);
  });

  it('should render label status cell', () => {
    const mockColumnDefinition = {
      field: 'labels',
      headerName: 'Labels',
    };

    expect(getLabelStatusColumn(mockColumnDefinition)).toEqual(COLUMNS.labels);
  });
});

describe('onTransformColumns', () => {
  const mockColumns = [
    { type: 'avatar', field: 'avatar' },
    { type: 'currency', field: 'price', currency: 'USD' },
    { type: 'status', field: 'status' },
    { type: 'link', field: 'link' },
    { type: 'node', field: 'node' },
    { type: 'menu', field: 'menu' },
    { type: 'action', field: 'action' },
    { type: 'discipline_status', field: 'discipline' },
    { type: 'labels', field: 'labels' },
    { type: 'text', field: 'text' },
  ];

  it('should filter out label columns when viewLabel is false', () => {
    const result = onTransformColumns({ cols: mockColumns, viewLabel: false });
    expect(result).toHaveLength(9);
    expect(result.find((col) => col.type === 'labels')).toBeUndefined();
  });

  it('should include label columns when viewLabel is true', () => {
    const result = onTransformColumns({ cols: mockColumns, viewLabel: true });
    expect(result).toHaveLength(10);
    expect(result.find((col) => col.type === 'labels')).toBeDefined();
  });

  it('should transform avatar columns correctly', () => {
    const result = onTransformColumns({
      cols: [{ type: 'avatar', field: 'avatar' }],
    });
    expect(result[0]).toEqual(
      expect.objectContaining({
        ...COMMON_COLUMN_PROPS,
        type: 'avatar',
        field: 'avatar',
      })
    );
  });

  it('should transform currency columns with default currency', () => {
    const result = onTransformColumns({
      cols: [{ type: 'currency', field: 'price' }],
    });
    expect(result[0]).toEqual(
      expect.objectContaining({
        ...COMMON_COLUMN_PROPS,
        type: 'currency',
        field: 'price',
        currency: DEFAULT_CURRENCY,
      })
    );
  });

  it('should transform currency columns with custom currency', () => {
    const result = onTransformColumns({
      cols: [{ type: 'currency', field: 'price', currency: 'EUR' }],
    });
    expect(result[0]).toEqual(
      expect.objectContaining({
        ...COMMON_COLUMN_PROPS,
        type: 'currency',
        field: 'price',
        currency: 'EUR',
      })
    );
  });

  it('should transform all column types correctly, labels column', () => {
    const result = onTransformColumns({ cols: mockColumns, viewLabel: true });
    expect(result).toHaveLength(10);

    const textCols = result.filter((col) => col.type === 'text');
    const nonTextCols = result.filter((col) => col.type !== 'text');

    textCols.forEach((col) => {
      expect(col).not.toHaveProperty('renderCell');
    });

    nonTextCols.forEach((col) => {
      expect(col).toHaveProperty('renderCell');
    });
  });

  it('should handle unknown column types by defaulting to text column', () => {
    const result = onTransformColumns({
      cols: [{ type: 'unknown', field: 'unknown' }],
    });
    expect(result[0]).toEqual(
      expect.objectContaining({
        ...COMMON_COLUMN_PROPS,
        type: 'unknown',
        field: 'unknown',
      })
    );
  });
});
