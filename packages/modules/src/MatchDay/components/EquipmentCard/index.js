// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Box,
  Stack,
  Typography,
  FormControl,
  MenuItem,
  Select,
  IconButton,
  InputLabel,
} from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { css } from '@emotion/react';
import type { Kit } from '@kitman/modules/src/KitMatrix/shared/types';
import {
  playerTypesEnumLike,
  equipmentsEnumLike,
} from '@kitman/modules/src/KitMatrix/shared/constants';
import { getTranslations } from '@kitman/modules/src/MatchDay/shared/utils';

const styles = {
  container: {
    p: 3,
    background: colors.white,
    border: 1,
    borderColor: colors.neutral_300,
    borderRadius: '3px',
    textAlign: 'center',
    position: 'relative',
  },
  flag: {
    height: 38,
    aspectRatio: 1,
    borderRadius: '50%',
  },
  name: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: 400,
    color: colors.grey_200,
  },
  teamName: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: 600,
    color: colors.grey_200,
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  emptyState: {
    mb: 10,
  },
  emptyStateContainer: {
    height: 335,
  },
};

type Props = {
  icon: string,
  teamName: string,
  name: string,
  equipments: Array<Kit>,
  selectedEquipment: Kit | null,
  isEditable?: boolean,
  playerType: string,
  onSave: (kitId: number) => Promise<void>,
};

const EquipmentCard = ({
  t,
  icon,
  teamName,
  equipments = [],
  selectedEquipment,
  isEditable,
  playerType,
  onSave,
}: I18nProps<Props>) => {
  const [isEditView, setIsEditView] = useState(false);
  const [equipment, setEquipment] = useState<?Kit>();
  const textEnum = getTranslations(t);

  useEffect(() => {
    setEquipment(selectedEquipment);
  }, [selectedEquipment]);

  const onSubmit = async () => {
    if (equipment?.id) {
      await onSave(equipment.id);
      setIsEditView(false);
    }
  };

  const onCancel = () => {
    setIsEditView(false);
    setEquipment(selectedEquipment);
  };

  const renderEquipment = ({
    type,
    src,
    alt,
    colorName,
  }: {
    type: string,
    src?: string,
    alt: string,
    colorName?: string,
  }) => {
    let size = 110;
    let scale = 1;

    if (window.getFlag('lo-kit-sizes')) {
      if (type === equipmentsEnumLike.jersey) size = 165;
      if (type === equipmentsEnumLike.shorts) size = 100;
    } else {
      if (type === equipmentsEnumLike.jersey) size = 165;
      if (
        playerType === playerTypesEnumLike.referee &&
        type === equipmentsEnumLike.shorts
      )
        scale = 1.1;
      if (
        playerType === playerTypesEnumLike.referee &&
        type === equipmentsEnumLike.socks
      )
        scale = 1.14;
      if (
        playerType === playerTypesEnumLike.goalkeeper &&
        type === equipmentsEnumLike.jersey
      )
        scale = 1.15;
      if (
        playerType === playerTypesEnumLike.goalkeeper &&
        type === equipmentsEnumLike.shorts
      )
        scale = 1.36;
      if (
        playerType === playerTypesEnumLike.goalkeeper &&
        type === equipmentsEnumLike.socks
      )
        scale = 1.14;
    }

    return (
      <Stack direction="column" justifyContent="center" spacing={2}>
        <img
          src={src}
          css={{
            width: '100%',
            maxWidth: size,
            objectFit: 'contain',
            objectPosition: 'center',
            aspectRatio: '1/1',
            borderRadius: 4,
            transform: `scale(${scale})`,
          }}
          alt={alt}
        />
        <p>{colorName}</p>
      </Stack>
    );
  };

  const renderEquipmentPreview = () => {
    return (
      <Stack direction="column" gap={2} alignItems="center">
        {renderEquipment({
          type: equipmentsEnumLike.jersey,
          src: equipment?.jersey?.image?.url,
          alt: `${teamName} ${t('jersey')} ${textEnum.equipmentAlt}`,
          colorName: equipment?.jersey?.colorName,
        })}
        {renderEquipment({
          type: equipmentsEnumLike.shorts,
          src: equipment?.shorts?.image?.url,
          alt: `${teamName} ${t('shorts')} ${textEnum.equipmentAlt}`,
          colorName: equipment?.shorts?.colorName,
        })}
        {renderEquipment({
          type: equipmentsEnumLike.socks,
          src: equipment?.socks?.image?.url,
          alt: `${teamName} ${t('socks')} ${textEnum.equipmentAlt}`,
          colorName: equipment?.socks?.colorName,
        })}
      </Stack>
    );
  };

  const renderNoKitSelected = () => {
    return (
      <Typography
        variant="body1"
        sx={
          isEditView
            ? styles.emptyState
            : { ...styles.emptyState, position: 'absolute' }
        }
      >
        {t('No kit selected')}
      </Typography>
    );
  };

  return (
    <Stack
      sx={styles.container}
      direction="column"
      alignItems="center"
      gap={1.5}
    >
      <img
        src={icon}
        alt={`${teamName} ${textEnum.teamFlagAlt}`}
        css={css(styles.flag)}
      />
      <Typography variant="body1" sx={styles.teamName}>
        {teamName}
      </Typography>

      {isEditView ? (
        <Stack
          direction="column"
          gap={equipment ? 1.5 : 10}
          alignItems="center"
          css={{
            width: '100%',
          }}
        >
          <FormControl>
            <InputLabel id="select-kit-label">{t('Select a kit')}</InputLabel>
            <Select
              labelId="select-kit-label"
              id="select-kit-field"
              displayEmpty
              value={equipment?.id}
              placeholder={t('Select a kit')}
              onChange={(e) => {
                setEquipment(
                  equipments.find((item) => item.id === e.target?.value) ?? null
                );
              }}
            >
              {equipments.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {equipment ? renderEquipmentPreview() : renderNoKitSelected()}
        </Stack>
      ) : (
        <>
          {equipment ? (
            renderEquipmentPreview()
          ) : (
            <Stack
              sx={styles.emptyStateContainer}
              alignItems="center"
              justifyContent="center"
            >
              {renderNoKitSelected()}
            </Stack>
          )}
        </>
      )}

      {isEditable && (
        <Box sx={styles.actionButtonsContainer}>
          {isEditView ? (
            <Stack direction="row">
              <IconButton onClick={onCancel}>
                <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
              </IconButton>
              <IconButton
                onClick={onSubmit}
                color="primary"
                disabled={!equipment}
                name="save"
              >
                <KitmanIcon name={KITMAN_ICON_NAMES.Check} />
              </IconButton>
            </Stack>
          ) : (
            <IconButton onClick={() => setIsEditView(true)} color="primary">
              <KitmanIcon name={KITMAN_ICON_NAMES.EditOutlined} />
            </IconButton>
          )}
        </Box>
      )}
    </Stack>
  );
};

export default withNamespaces()(EquipmentCard);
