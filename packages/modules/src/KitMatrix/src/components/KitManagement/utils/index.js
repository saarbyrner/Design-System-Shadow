/* eslint-disable camelcase */
// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  getEquipmentsEnumLike,
  getStatusEnumLike,
} from '@kitman/modules/src/KitMatrix/shared/utils';
import {
  UPDATE_KIT,
  DEACTIVATE_KIT,
  ACTIVATE_KIT,
} from '@kitman/modules/src/KitMatrix/shared/constants';
import type { Kit } from '@kitman/modules/src/KitMatrix/shared/types';
import { Box, GridActionsCellItem } from '@kitman/playbook/components';
import type { KitMatrix } from '@kitman/services/src/services/kitMatrix/searchKitMatrices';
import {
  onSetSelectedRow,
  onTogglePanel,
  onToggleModal,
} from '@kitman/modules/src/KitMatrix/src/redux/slice/kitManagementSlice';

// Transform raw suspension data into a more usable format for the grid
export const transformSuspensionRows = (
  rawRowData: Array<KitMatrix>
): Array<Kit> => {
  const equipmentsEnum = getEquipmentsEnumLike();
  const kitStatus = getStatusEnumLike();

  return rawRowData.map((item) => {
    const {
      id,
      organisation,
      name,
      kind: type,
      primary_color,
      games_count,
      division,
      kit_matrix_items = [],
      league_season,
    } = item;

    const transformedData: $Shape<Kit> = {
      id,
      organisation,
      name,
      type,
      color: `#${primary_color}`,
      games_count,
      status: kitStatus.active.label,
      jersey: undefined,
      shorts: undefined,
      socks: undefined,
      division,
      league_season,
    };

    // populate equipment fields if present,
    Object.keys(equipmentsEnum).forEach((equipmentName) => {
      const equipment = kit_matrix_items.find(
        (i) => i.kind === equipmentsEnum[equipmentName].value
      );
      // if equipment is not found, return
      if (!equipment) return;
      // if equipment is found, populate the transformed data with the equipment data
      transformedData[equipmentName] = {
        colorId: equipment.kit_matrix_color.id,
        colorName: equipment.kit_matrix_color.name,
        image: {
          url: equipment.attachment.url,
          name: equipment.attachment.filename,
          type: equipment.attachment.filetype,
        },
      };
    });

    return transformedData;
  });
};

export const onActionClick = ({
  row,
  mode,
  dispatch,
}: {
  row: KitMatrix,
  mode: string,
  dispatch: Function,
}) => {
  if (mode === UPDATE_KIT) {
    dispatch(onTogglePanel({ isOpen: true }));
  } else {
    // If the mode is not UPDATE_KIT, then we open the modal with the mode
    dispatch(onToggleModal({ isOpen: true, mode }));
  }

  dispatch(onSetSelectedRow({ selectedRow: row }));
};

// Build action buttons for each row, and handle icon actions
export const onBuildActions = ({
  row,
  dispatch,
  archived,
}: {
  row: KitMatrix,
  dispatch: Function,
  archived: boolean,
}) => {
  const actions = [
    {
      key: 'edit',
      label: i18n.t('Edit'),
      onClick: () =>
        onActionClick({
          row,
          mode: UPDATE_KIT,
          dispatch,
        }),
    },
  ];
  if (archived) {
    actions.push({
      key: 'Activate',
      label: i18n.t('Activate'),
      onClick: () =>
        onActionClick({
          row,
          mode: ACTIVATE_KIT,
          dispatch,
        }),
    });
  }
  if (!archived) {
    actions.push({
      key: 'deactivate',
      label: i18n.t('Deactivate'),
      onClick: () =>
        onActionClick({
          row,
          mode: DEACTIVATE_KIT,
          dispatch,
        }),
    });
  }

  return [
    <Box alignItems="center" gap={1} key="actions">
      {actions.map((action) => (
        <GridActionsCellItem
          key={action.key}
          label={action.label}
          showInMenu
          onClick={action.onClick}
        />
      ))}
    </Box>,
  ];
};
