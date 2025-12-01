// @flow
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Divider,
  Stack,
  Box,
  Button,
  Drawer,
  Typography,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@kitman/playbook/components';
import { imageFileTypes } from '@kitman/common/src/utils/mediaHelper';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import CloseIcon from '@mui/icons-material/Close';
import {
  getFileInfo,
  getPlayerTypesEnumLike,
  getEquipmentsEnumLike,
  getPlayerTypesOptions,
} from '@kitman/modules/src/KitMatrix/shared/utils';
import { supportedFileText } from '@kitman/modules/src/KitMatrix/shared/constants';
import type {
  EquipmentName,
  FieldName,
  Kit,
  FileInfo,
} from '@kitman/modules/src/KitMatrix/shared/types';
import style from '@kitman/modules/src/KitMatrix/style';
import { useSearchOrganisationDivisionListQuery } from '@kitman/modules/src/SquadManagement/src/shared/services/squadManagement';
import { FileUploadsTranslated } from '@kitman/playbook/components/FileUploads';
import { QueuedItemTranslated } from '@kitman/modules/src/HumanInput/shared/components/UIElements/QueuedItem';
import {
  useCreateKitMatrixMutation,
  useUpdateKitMatrixMutation,
  useGetLeagueSeasonsQuery,
} from '../redux/rtk/searchKitMatricesApi';
import EquipmentFormSection from './EquipmentFormSection';
import { useGetKitMatrixColorsQuery } from '../redux/rtk/kitMatrixColorsApi';
import { useGetClubsQuery } from '../redux/rtk/clubsApi';
import { useKitMatrixForm } from '../hooks/useKitMatrixForm';
import { useEquipmentImage } from '../hooks/useEquipmentImage';
import KitBasicInfoForm from './KitBasicInfoForm';

type Props = {
  isOpen: boolean,
  onClose: () => void,
  data?: Kit,
};

const AddKitMatrixDrawer = (props: I18nProps<Props>) => {
  const theme = useTheme();
  const validationErrorsAreaRef = useRef(null);
  const playerTypes = getPlayerTypesEnumLike();
  const equipmentsEnum = getEquipmentsEnumLike();
  const playerTypesOptions = useMemo(() => getPlayerTypesOptions(), []);
  const currentSquad = useSelector(getActiveSquad());
  const getKitMatrixColorsQuery = useGetKitMatrixColorsQuery();
  const [createKitMatrixMutation] = useCreateKitMatrixMutation();
  const [updateKitMatrixMutation] = useUpdateKitMatrixMutation();
  const isKitManagementV2 = window.getFlag('league-ops-kit-management-v2');

  const {
    kit,
    errors,
    isSaving,
    handleChange: formHandleChange,
    updateEquipment,
    onSave,
    resetForm,
  } = useKitMatrixForm({
    t: props.t,
    initialData: props.data,
    isOpen: props.isOpen,
    onClose: props.onClose,
    createKitMatrixMutation,
    updateKitMatrixMutation,
  });

  const getClubsQuery = useGetClubsQuery(
    {
      divisionIds: currentSquad?.division[0]?.id,
    },
    {
      skip: kit.type === playerTypes.referee.value || !kit.type,
    }
  );
  const searchOrganisationDivisionListQuery =
    useSearchOrganisationDivisionListQuery();
  const getLeagueSeasonsQuery = useGetLeagueSeasonsQuery();

  const onChangeEquipmentImage = async (
    equipmentName: EquipmentName,
    file?: File
  ) => {
    updateEquipment({
      name: equipmentName,
      field: 'image',
      value: file ? await getFileInfo(file) : '',
    });
  };

  const {
    jerseyFilePondRef,
    shortsFilePondRef,
    socksFilePondRef,
    handleFileAdd,
    createQueuedItemFromImage,
  } = useEquipmentImage({
    onChangeEquipmentImage,
  });

  const handleChange = (name: string, value: string | number | null) => {
    formHandleChange(name, value, {
      clubsData: getClubsQuery.data,
      divisionsData: searchOrganisationDivisionListQuery.data,
      seasonOptions: getLeagueSeasonsQuery.data,
    });
  };

  const onClose = () => {
    resetForm();
    props.onClose();
  };

  // TODO: remove this when FilePond is fully tested
  const renderImageUpload = (equipmentName: EquipmentName) => {
    // NOTE: uses of native input file as upload with FilePond cannot be tested with RTL at the moment
    return (
      <input
        data-testid={`${equipmentName}-upload`}
        type="file"
        accept={imageFileTypes.join(',')}
        multiple={false}
        onChange={(e) => {
          const files = e.target.files;
          onChangeEquipmentImage(equipmentName, files?.[0]);
        }}
      />
    );
  };

  const renderError = (fieldName: FieldName, equipmentFieldName?: string) => {
    let error;

    switch (fieldName) {
      case equipmentsEnum.jersey.value:
        if (equipmentFieldName === 'colorId') error = errors.jersey?.colorId;
        if (equipmentFieldName === 'image') error = errors.jersey?.image;
        break;
      case equipmentsEnum.shorts.value:
        if (equipmentFieldName === 'colorId') error = errors.shorts?.colorId;
        if (equipmentFieldName === 'image') error = errors.shorts?.image;
        break;
      case equipmentsEnum.socks.value:
        if (equipmentFieldName === 'colorId') error = errors.socks?.colorId;
        if (equipmentFieldName === 'image') error = errors.socks?.image;
        break;
      default:
        error = errors[fieldName];
    }

    return (
      error && <FormHelperText css={style.errorText}>{error}</FormHelperText>
    );
  };

  // render the image preview component if the image is uploaded
  const renderEquipmentImagePreview = (equipmentName: EquipmentName) => {
    return (
      kit[equipmentName].image?.url &&
      kit[equipmentName].image?.name && (
        <QueuedItemTranslated
          queuedItem={createQueuedItemFromImage(
            kit[equipmentName].image,
            equipmentName
          )}
          onDelete={() => {
            onChangeEquipmentImage(equipmentName, undefined);
          }}
          hideDeleteButton={false}
        />
      )
    );
  };
  // render the image upload component if the image is not uploaded
  const renderEquipmentImageUpload = (equipmentName: EquipmentName) => {
    // get the file pond ref for the equipment
    const filePondRef = {
      [equipmentsEnum.jersey.value]: jerseyFilePondRef,
      [equipmentsEnum.shorts.value]: shortsFilePondRef,
      [equipmentsEnum.socks.value]: socksFilePondRef,
    };

    return (
      !kit[equipmentName].image?.url && (
        <Box data-testid={`${equipmentName}-upload`}>
          <FileUploadsTranslated
            filePondRef={filePondRef[equipmentName]}
            acceptedFileTypes={imageFileTypes}
            acceptedFileTypesLabel={supportedFileText}
            maxFiles={1}
            onAddFile={(attachedFile) =>
              handleFileAdd(equipmentName, attachedFile)
            }
            validationErrorsAreaRef={validationErrorsAreaRef}
          />
        </Box>
      )
    );
  };

  const renderEquipmentFormSection = ({
    title,
    equipmentName,
    image,
  }: {
    title: string,
    equipmentName: EquipmentName,
    image: FileInfo,
  }) => {
    const placeholder = props.t('Color');
    const prefix = `color-${equipmentName}`;
    const labelId = `${prefix}-label`;
    const fieldId = `${prefix}-field`;
    return (
      <>
        <EquipmentFormSection.Title>{title}</EquipmentFormSection.Title>
        <Stack direction="column" gap={2}>
          <Stack direction="row" gap={2}>
            <Stack direction="column" gap={2} sx={{ width: '100%' }}>
              <Stack direction="column" gap={1}>
                <FormControl>
                  <InputLabel id={labelId}>{placeholder}</InputLabel>
                  <Select
                    labelId={labelId}
                    id={fieldId}
                    displayEmpty
                    defaultValue=""
                    placeholder={placeholder}
                    value={kit[equipmentName].colorId ?? ''}
                    onChange={(e) => {
                      updateEquipment({
                        name: equipmentName,
                        field: 'colorId',
                        value: e.target.value,
                      });
                    }}
                  >
                    {getKitMatrixColorsQuery.data?.map((color) => {
                      return (
                        <MenuItem key={color.id} value={color.id}>
                          {color.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {renderError(equipmentName, 'colorId')}
              </Stack>
              {!isKitManagementV2 && image?.name && (
                <EquipmentFormSection.ImageNamePreview
                  name={image.name}
                  onDeleteImage={() => {
                    onChangeEquipmentImage(equipmentName, undefined);
                  }}
                />
              )}
            </Stack>
            {!isKitManagementV2 && image?.url && (
              <EquipmentFormSection.ImagePreview
                url={image.url}
                type={equipmentName.toLowerCase()}
              />
            )}
          </Stack>

          {!isKitManagementV2 &&
            !image?.url &&
            renderImageUpload(equipmentName)}
          {isKitManagementV2 && renderEquipmentImagePreview(equipmentName)}
          {isKitManagementV2 && renderEquipmentImageUpload(equipmentName)}

          {renderError(equipmentName, 'image')}
        </Stack>
      </>
    );
  };

  return (
    <Drawer
      open={props.isOpen}
      anchor="right"
      onClose={onClose}
      sx={drawerMixin({ theme, isOpen: props.isOpen, drawerWidth: 460 })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Stack
          p={3}
          direction="column"
          gap={2}
          sx={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h3" css={style.drawerTitle}>
              {props.data
                ? props.t('Update Kit Matrix')
                : props.t('Add Kit Matrix')}
            </Typography>

            <CloseIcon onClick={onClose} />
          </Stack>

          <KitBasicInfoForm
            t={props.t}
            kit={kit}
            errors={errors}
            seasonOptions={getLeagueSeasonsQuery.data}
            divisionsData={searchOrganisationDivisionListQuery.data}
            clubsData={getClubsQuery.data}
            playerTypesOptions={playerTypesOptions}
            isKitManagementV2={isKitManagementV2}
            onFieldChange={handleChange}
            renderError={renderError}
          />

          <Divider />

          {renderEquipmentFormSection({
            title: equipmentsEnum.jersey.label,
            equipmentName: equipmentsEnum.jersey.value,
            image: kit.jersey.image,
          })}

          <Divider />

          {renderEquipmentFormSection({
            title: equipmentsEnum.shorts.label,
            equipmentName: equipmentsEnum.shorts.value,
            image: kit.shorts.image,
          })}

          <Divider />

          {renderEquipmentFormSection({
            title: equipmentsEnum.socks.label,
            equipmentName: equipmentsEnum.socks.value,
            image: kit.socks.image,
          })}
        </Stack>

        <Divider />

        <Stack
          px={3}
          py={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            flexShrink: 0,
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            {props.t('Cancel')}
          </Button>
          <Button disabled={isSaving} onClick={onSave}>
            {isSaving ? props.t('Saving...') : props.t('Save')}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default withNamespaces()(AddKitMatrixDrawer);
