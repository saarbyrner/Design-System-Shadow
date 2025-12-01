// @flow
import {
  Typography,
  Stack,
  InputLabel,
  Box,
} from '@kitman/playbook/components';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import style from '@kitman/modules/src/KitMatrix/style';

const EquipmentFormSection = {};

type EquipmentFormSectionTitleProps = {
  children: Node | string,
};

const EquipmentFormSectionTitle = ({
  children,
}: EquipmentFormSectionTitleProps) => {
  return <Typography css={style.formSectionTitle}>{children}</Typography>;
};

type EquipmentFormSectionInputLabelProps = {
  children: Node | string,
};

const EquipmentFormSectionInputLabel = ({
  children,
}: EquipmentFormSectionInputLabelProps) => {
  return <InputLabel css={style.label}>{children}</InputLabel>;
};

type EquipmentFormSectionImageNamePreviewProps = {
  name: string,
  onDeleteImage: () => void,
};

const EquipmentFormSectionImageNamePreview = ({
  name,
  onDeleteImage,
}: EquipmentFormSectionImageNamePreviewProps) => {
  return (
    <Box p={1} css={style.imageNamePreviewContainer}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <span css={style.imageNamePreviewText}>{name}</span>
        <DeleteOutlineOutlinedIcon
          onClick={onDeleteImage}
          css={style.deleteIcon}
        />
      </Stack>
    </Box>
  );
};

type EquipmentFormSectionImagePreviewProps = {
  url: string | ArrayBuffer,
  type: string,
};

const EquipmentFormSectionImagePreview = ({
  url,
  type,
}: EquipmentFormSectionImagePreviewProps) => {
  return (
    <Box p={1} css={style.imagePreviewContainer}>
      <img src={url} alt="" css={style.imagePreview(type)} />
    </Box>
  );
};

EquipmentFormSection.Title = EquipmentFormSectionTitle;
EquipmentFormSection.InputLabel = EquipmentFormSectionInputLabel;
EquipmentFormSection.ImageNamePreview = EquipmentFormSectionImageNamePreview;
EquipmentFormSection.ImagePreview = EquipmentFormSectionImagePreview;

export default EquipmentFormSection;
