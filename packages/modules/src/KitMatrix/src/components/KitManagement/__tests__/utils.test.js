import {
  UPDATE_KIT,
  DEACTIVATE_KIT,
} from '@kitman/modules/src/KitMatrix/shared/constants';
import {
  onTogglePanel,
  onToggleModal,
  onSetSelectedRow,
} from '@kitman/modules/src/KitMatrix/src/redux/slice/kitManagementSlice';
import colors from '@kitman/common/src/variables/colors';
import {
  transformSuspensionRows,
  onActionClick,
  onBuildActions,
} from '../utils';

describe('transformSuspensionRows', () => {
  it('should transform raw kit matrix data into Kit format', () => {
    const raw = [
      {
        id: 1,
        organisation: { id: 10, name: 'Club' },
        name: 'Kit 1',
        kind: 'player',
        primary_color: 'c31d2b',
        games_count: 2,
        division: 'A',
        kit_matrix_items: [
          {
            kind: 'jersey',
            kit_matrix_color: { id: 100, name: 'Red' },
            attachment: { url: 'url1', filename: 'file1', filetype: 'img' },
          },
          {
            kind: 'shorts',
            kit_matrix_color: { id: 101, name: 'White' },
            attachment: { url: 'url2', filename: 'file2', filetype: 'img' },
          },
        ],
        league_season: { id: 1, name: '2025/26 Season' },
        league_season_id: 1,
      },
    ];

    const result = transformSuspensionRows(raw);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 1,
      organisation: { id: 10, name: 'Club' },
      name: 'Kit 1',
      type: 'player',
      color: colors.red_100,
      games_count: 2,
      status: 'Active',
      division: 'A',
      jersey: {
        colorId: 100,
        colorName: 'Red',
        image: { url: 'url1', name: 'file1', type: 'img' },
      },
      shorts: {
        colorId: 101,
        colorName: 'White',
        image: { url: 'url2', name: 'file2', type: 'img' },
      },
      socks: undefined,
      league_season: { id: 1, name: '2025/26 Season' },
    });
  });

  it('should handle missing equipment gracefully', () => {
    const raw = [
      {
        id: 2,
        organisation: null,
        name: 'Kit 2',
        kind: 'goalkeeper',
        primary_color: '00FF00',
        games_count: 0,
        division: null,
        kit_matrix_items: [],
      },
    ];

    const result = transformSuspensionRows(raw);
    expect(result[0].jersey).toBeUndefined();
    expect(result[0].shorts).toBeUndefined();
  });
});

describe('onActionClick', () => {
  it('should dispatch onTogglePanel and onSetSelectedRow for UPDATE_KIT', () => {
    const dispatch = jest.fn();
    const row = { id: 1 };
    onActionClick({ row, mode: UPDATE_KIT, dispatch });
    expect(dispatch).toHaveBeenCalledWith(onTogglePanel({ isOpen: true }));
    expect(dispatch).toHaveBeenCalledWith(
      onSetSelectedRow({ selectedRow: row })
    );
  });

  it('should dispatch onToggleModal and onSetSelectedRow for Deactivate', () => {
    const dispatch = jest.fn();
    const row = { id: 2 };
    onActionClick({ row, mode: DEACTIVATE_KIT, dispatch });
    expect(dispatch).toHaveBeenCalledWith(
      onToggleModal({ isOpen: true, mode: DEACTIVATE_KIT })
    );
    expect(dispatch).toHaveBeenCalledWith(
      onSetSelectedRow({ selectedRow: row })
    );
  });
});

describe('onBuildActions', () => {
  it('should return edit and Deactivate actions when not archived', () => {
    const dispatch = jest.fn();
    const row = { id: 1 };
    const actions = onBuildActions({ row, dispatch, archived: false });
    // Should be a Box with two GridActionsCellItem children
    expect(actions[0].props.children.length).toBe(2);
    const [edit, del] = actions[0].props.children;
    expect(edit.props.label).toBe('Edit');
    expect(del.props.label).toBe('Deactivate');
  });

  it('should return edit and activate actions when archived', () => {
    const dispatch = jest.fn();
    const row = { id: 1 };
    const actions = onBuildActions({ row, dispatch, archived: true });
    // Should be a Box with two GridActionsCellItem children
    expect(actions[0].props.children.length).toBe(2);
    const [edit, activate] = actions[0].props.children;
    expect(edit.props.label).toBe('Edit');
    expect(activate.props.label).toBe('Activate');
  });
});
