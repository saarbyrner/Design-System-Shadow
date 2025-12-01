// @flow
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import structuredClone from 'core-js/stable/structured-clone';
import { imageFileTypes } from '@kitman/common/src/utils/mediaHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  Kit,
  FormError,
  EquipmentName,
  FileInfo,
} from '@kitman/modules/src/KitMatrix/shared/types';
import type { CreateKitMatrixPayload } from '@kitman/services/src/services/kitMatrix/createKitMatrix';
import type { KitMatrixUpdates } from '@kitman/services/src/services/kitMatrix/updateKitMatrix';
import type { LeagueSeason } from '@kitman/services/src/services/kitMatrix/getLeagueSeasons';
import {
  defaultKitState,
  supportedFileText,
} from '@kitman/modules/src/KitMatrix/shared/constants';
import {
  getEquipmentError,
  getDefaultErrorTextEnumLike,
  getPlayerTypesEnumLike,
  getEquipmentsEnumLike,
} from '@kitman/modules/src/KitMatrix/shared/utils';

type UseKitMatrixFormProps = {
  ...I18nProps<{}>,
  initialData?: Kit,
  isOpen: boolean,
  onClose: () => void,
  createKitMatrixMutation: (payload: CreateKitMatrixPayload) => Promise<any>,
  updateKitMatrixMutation: (payload: {
    id: number,
    updates: KitMatrixUpdates,
  }) => Promise<any>,
};

type UseKitMatrixFormReturn = {
  kit: Kit,
  errors: FormError,
  isSaving: boolean,
  handleChange: (
    name: string,
    value: string | number | null,
    options?: {
      clubsData?: Array<any>,
      divisionsData?: Array<any>,
      seasonOptions?: Array<LeagueSeason>,
    }
  ) => void,
  updateEquipment: (params: {
    name: EquipmentName,
    field: string,
    value: string | FileInfo,
  }) => void,
  onSave: () => Promise<void>,
  resetForm: () => void,
  checkErrors: () => boolean,
};

// hook to handle the kit matrix form
export const useKitMatrixForm = ({
  t,
  initialData,
  isOpen,
  onClose,
  createKitMatrixMutation,
  updateKitMatrixMutation,
}: UseKitMatrixFormProps): UseKitMatrixFormReturn => {
  const dispatch = useDispatch();
  const [kit, setKit] = useState<Kit>(structuredClone(defaultKitState));
  const [errors, setErrors] = useState<FormError>({});
  const [isSaving, setIsSaving] = useState(false);
  const playerTypes = getPlayerTypesEnumLike();
  const defaultErrorTextEnum = getDefaultErrorTextEnumLike();
  const equipmentsEnum = getEquipmentsEnumLike();
  const isKitManagementV2 = window.getFlag('league-ops-kit-management-v2');

  useEffect(() => {
    if (isOpen && initialData) {
      setKit(initialData);
    }
  }, [isOpen, initialData]);

  const getSeasonError = () => {
    if (!isKitManagementV2) {
      return {};
    }
    return {
      league_season: kit.league_season?.id
        ? errors.league_season
        : defaultErrorTextEnum.league_season,
    };
  };

  // check the errors for the kit matrix form
  const checkErrors = (): boolean => {
    const nextErrors = {
      type: kit.type ? errors.type : defaultErrorTextEnum.type,
      organisation:
        [playerTypes.player.value, playerTypes.goalkeeper.value].includes(
          kit.type
        ) && !kit.organisation?.id
          ? defaultErrorTextEnum.organisation
          : errors.organisation,
      name: kit.name ? errors.name : defaultErrorTextEnum.name,
      color: kit.color ? errors.color : defaultErrorTextEnum.color,
      jersey: getEquipmentError({
        colorId: kit.jersey.colorId,
        image: kit.jersey.image,
        errors: {
          colorId: errors.jersey?.colorId,
          image: errors.jersey?.image,
        },
      }),
      shorts: getEquipmentError({
        colorId: kit.shorts.colorId,
        image: kit.shorts.image,
        errors: {
          colorId: errors.shorts?.colorId,
          image: errors.shorts?.image,
        },
      }),
      socks: getEquipmentError({
        colorId: kit.socks.colorId,
        image: kit.socks.image,
        errors: {
          colorId: errors.socks?.colorId,
          image: errors.socks?.image,
        },
      }),
      division: kit.division ? errors.division : defaultErrorTextEnum.division,
      ...getSeasonError(),
    };

    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some((i) => !!i);
    return hasError;
  };

  const resetForm = () => {
    setKit(structuredClone(defaultKitState));
    setErrors({});
  };

  const onUpdateKit = async (kitData: $Shape<KitMatrixUpdates>) => {
    if (!kit.id) return;

    try {
      await updateKitMatrixMutation({
        id: kit.id,
        updates: {
          ...kitData,
          kit_matrix_items: Object.keys(equipmentsEnum).map((equipmentName) => {
            return {
              kind: equipmentsEnum[equipmentName].value,
              kit_matrix_color_id: kit[equipmentName].colorId,
              // We do not sent images as sent by the BE, but only base64 generated from an upload
              attachment: kit[equipmentName].image.url.startsWith('http')
                ? null
                : {
                    url: kit[equipmentName].image.url.split(',')?.[1],
                    name: kit[equipmentName].image.name,
                    type: kit[equipmentName].image.type,
                  },
            };
          }),
        },
      });
      dispatch(
        add({
          status: 'SUCCESS',
          title: t('Kit updated.'),
        })
      );
      resetForm();
      onClose();
    } catch {
      dispatch(
        add({
          status: 'ERROR',
          title: t('Something went wrong while updating your kit.'),
        })
      );
    }
  };

  const onCreateKit = async (kitData: $Shape<CreateKitMatrixPayload>) => {
    try {
      await createKitMatrixMutation({
        ...kitData,
        kit_matrix_items: Object.keys(equipmentsEnum).map((equipmentName) => {
          return {
            kind: equipmentsEnum[equipmentName].value,
            kit_matrix_color_id: kit[equipmentName].colorId,
            attachment: {
              url: kit[equipmentName].image.url.split(',')?.[1],
              name: kit[equipmentName].image.name,
              type: kit[equipmentName].image.type,
            },
          };
        }),
      });
      dispatch(
        add({
          status: 'SUCCESS',
          title: t('Kit created.'),
        })
      );
      resetForm();
      onClose();
    } catch {
      dispatch(
        add({
          status: 'ERROR',
          title: t('Something went wrong while creating your kit.'),
        })
      );
    }
  };

  const onSave = async () => {
    const hasError = checkErrors();
    if (hasError) return;

    try {
      setIsSaving(true);

      const commonKitData = {
        kind: kit.type,
        organisation_id: kit.organisation?.id,
        squad_ids: [],
        name: kit.name,
        primary_color: kit.color.slice(1),
        division_id: kit.division?.id,
        league_season_id: kit.league_season?.id,
      };
      if (kit.id) {
        await onUpdateKit(commonKitData);
      } else {
        await onCreateKit(commonKitData);
      }

      setIsSaving(false);
    } catch {
      dispatch(
        add({
          status: 'ERROR',
          title: t('Something went wrong while updating your kit.'),
        })
      );
      setIsSaving(false);
    }
  };

  const handleChange = (
    name: string,
    value: string | number | null,
    options?: {
      clubsData?: Array<any>,
      divisionsData?: Array<any>,
      seasonOptions?: Array<LeagueSeason>,
    }
  ) => {
    const { clubsData, divisionsData, seasonOptions } = options || {};
    const isRefereeSelected =
      name === 'type' && value === playerTypes.referee.value;

    setKit((prev) => {
      if (name === 'organisation') {
        return {
          ...prev,
          organisation: clubsData?.find((club) => club.id === value) || null,
        };
      }
      if (name === 'division') {
        return {
          ...prev,
          division:
            divisionsData?.find((division) => division.id === value) || null,
        };
      }
      if (name === 'league_season') {
        return {
          ...prev,
          league_season:
            seasonOptions?.find((season) => season.id === value) || null,
        };
      }

      return {
        ...prev,
        organisation: isRefereeSelected ? null : prev.organisation,
        [name]: value,
      };
    });

    setErrors((prev) => {
      const nextValue = {
        ...prev,
        [name]: '',
      };

      if (name === 'type') {
        nextValue.organisation = prev.organisation;
      }
      if (isRefereeSelected) {
        nextValue.organisation = '';
      }

      return nextValue;
    });
  };

  // update the equipment for the kit matrix form
  const updateEquipment = ({
    name,
    field,
    value,
  }: {
    name: EquipmentName,
    field: string,
    value: string | FileInfo,
  }) => {
    setKit((prev) => {
      const nextValue = { ...prev };
      nextValue[name] = {
        ...nextValue[name],
        [field]: value,
      };
      return nextValue;
    });
    // NOTE: unsupported file error would only happen in the case you drag and drop
    // an unsupported file, otherwise the input file is guarded with acceptedFileTypes={imageFileTypes}
    let errorText = '';
    const supportedField = isKitManagementV2
      ? field === 'file' || field === 'image'
      : field === 'file';

    // check if the file type is supported
    if (supportedField && value?.type && !imageFileTypes.includes(value.type)) {
      errorText = `${defaultErrorTextEnum.unsupportedFile} (${supportedFileText})`;
    }

    // set the error for the equipment
    setErrors((prev) => {
      const nextValue = { ...prev };
      nextValue[name] = {
        ...nextValue[name],
        [field]: errorText,
      };
      return nextValue;
    });
  };

  return {
    kit,
    errors,
    isSaving,
    handleChange,
    updateEquipment,
    onSave,
    resetForm,
    checkErrors,
  };
};
