// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Option } from '@kitman/components/src/Select';
import type { KitMatrix } from '@kitman/services/src/services/kitMatrix/searchKitMatrices';
import type { FileInfo, EquipmentError, Kit, EquipmentName } from './types';
import {
  equipmentsEnumLike,
  kitStatusEnumLike,
  playerTypesEnumLike,
} from './constants';

export const getPlayerTypesEnumLike = () => ({
  [playerTypesEnumLike.player]: {
    label: window.getFlag('league-ops-kit-management-v2')
      ? i18n.t('Player')
      : i18n.t('Outfield Player'),
    value: playerTypesEnumLike.player,
  },
  [playerTypesEnumLike.goalkeeper]: {
    label: i18n.t('Goalkeeper'),
    value: playerTypesEnumLike.goalkeeper,
  },
  [playerTypesEnumLike.referee]: {
    label: i18n.t('Referee'),
    value: playerTypesEnumLike.referee,
  },
});

export const getPlayerTypesOptions = (): Array<Option> => {
  // $FlowFixMe: Object.values return Array<Option>
  return Object.values(getPlayerTypesEnumLike());
};

export const getStatusEnumLike = () => ({
  [kitStatusEnumLike.active]: {
    label: i18n.t('Active'),
    value: kitStatusEnumLike.active,
  },
  [kitStatusEnumLike.archived]: {
    label: i18n.t('Archived'),
    value: kitStatusEnumLike.archived,
  },
});

export const getStatusOptions = (): Array<Option> => {
  // $FlowFixMe: Object.values return Array<Option>
  return Object.values(getStatusEnumLike());
};

export const getEquipmentsEnumLike = () => ({
  [equipmentsEnumLike.jersey]: {
    label: i18n.t('Jersey'),
    value: equipmentsEnumLike.jersey,
  },
  [equipmentsEnumLike.shorts]: {
    label: i18n.t('Shorts'),
    value: equipmentsEnumLike.shorts,
  },
  [equipmentsEnumLike.socks]: {
    label: i18n.t('Socks'),
    value: equipmentsEnumLike.socks,
  },
});

export const getEquipmentsOptions = (): Array<Option> => {
  // $FlowFixMe: Object.values return Array<Option>
  return Object.values(getEquipmentsEnumLike());
};

export const getFileInfo = (file: File): Promise<FileInfo | string> => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // $FlowFixMe: reader.result is either of type string or null when using readAsDataURL (https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
        const url: string = reader.result ?? '';
        resolve({
          url,
          name: file.name,
          type: file.type,
        });
      };
      reader.onerror = () => {
        resolve('');
      };
    } catch {
      resolve('');
    }
  });
};

export const getDefaultErrorTextEnumLike = () => ({
  type: i18n.t('Please select a type'),
  organisation: i18n.t('Please select a club'),
  name: i18n.t('Please enter a kit name'),
  color: i18n.t('Please select a kit color'),
  equipmentColor: i18n.t('Please select a color'),
  image: i18n.t('Please upload an image'),
  unsupportedFile: i18n.t('Please upload a supported image'),
  division: i18n.t('Please select a division'),
  league_season: i18n.t('Please select a season'),
});

export const getEquipmentError = ({
  colorId,
  image,
  errors,
}: {
  colorId?: number,
  image?: FileInfo,
  errors: {
    colorId?: string,
    image?: string,
  },
}): EquipmentError | null => {
  const defaultErrorTextEnum = getDefaultErrorTextEnumLike();
  const colorError = colorId
    ? errors.colorId
    : defaultErrorTextEnum.equipmentColor;
  const imageError = image
    ? errors.image
    : defaultErrorTextEnum.unsupportedFile;

  if (!colorError && !imageError) return null;

  return {
    colorId: colorError,
    image: imageError,
  };
};

export const transformKitMatrices = (data: Array<KitMatrix>): Array<Kit> => {
  const equipmentsEnum = getEquipmentsEnumLike();
  const kitStatus = getStatusEnumLike();

  return data?.map((item: KitMatrix) => {
    const transformedData: $Shape<Kit> = {
      id: item.id,
      organisation: item.organisation,
      name: item.name,
      type: item.kind,
      color: `#${item.primary_color}`,
      games_count: item.games_count,
      status: kitStatus.active.label,
      jersey: undefined,
      shorts: undefined,
      socks: undefined,
      division: item.division,
    };

    Object.keys(equipmentsEnum).forEach((equipmentName: EquipmentName) => {
      const equipment = item.kit_matrix_items.find(
        (i) => i.kind === equipmentsEnum[equipmentName].value
      );

      if (equipment) {
        transformedData[equipmentName] = {
          colorId: equipment.kit_matrix_color.id,
          colorName: equipment.kit_matrix_color.name,
          image: {
            url: equipment.attachment.url,
            name: equipment.attachment.filename,
            type: equipment.attachment.filetype,
          },
        };
      }
    });

    return transformedData;
  });
};

export const getTranslations = () => ({
  kitDeletedSuccess: i18n.t('Kit deleted.'),
  kitDeletedError: i18n.t("We couldn't delete the kit."),
});
