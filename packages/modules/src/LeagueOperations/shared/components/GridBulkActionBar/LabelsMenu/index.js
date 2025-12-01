// @flow

import { withNamespaces } from 'react-i18next';
import {
  Box,
  Menu,
  Button,
  Divider,
  MenuItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  Chip,
} from '@kitman/playbook/components';

import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  anchorEl: Object,
  isDataFetching: boolean,
  isUpdateLabelsLoading: boolean,
  options: Array<{ value: number, label: string, color: string }>,
  selectedLabelIds: Array<number>,
  onSave: () => Promise<void>,
  onClose: () => void,
  handleOnChange: (event: Object, newLabelIds: Array<number>) => void,
};

const LabelsMenu = ({
  anchorEl,
  isDataFetching,
  isUpdateLabelsLoading,
  options,
  selectedLabelIds,
  onSave,
  handleOnChange,
  onClose,
  t,
}: I18nProps<Props>) => {
  const onCancel = (): void => {
    onClose();
  };

  const handleOnSave = async (): Promise<void> => {
    await onSave();
    onCancel();
  };

  const renderLabelOptions = () => {
    // If there are no labels, show a disabled menu item
    if (!options || options.length === 0) {
      return (
        <MenuItem disabled>
          <ListItemText primary="No labels found." />
        </MenuItem>
      );
    }

    return options.map(({ value, label, color }) => {
      const isSelected = selectedLabelIds.includes(value);
      return (
        <MenuItem
          onClick={(event) =>
            handleOnChange(
              event,
              isSelected
                ? selectedLabelIds.filter((id) => id !== value)
                : [...selectedLabelIds, value]
            )
          }
          key={label}
        >
          <Checkbox checked={isSelected} />
          <ListItemText>
            <Chip key={value} label={label} sx={{ backgroundColor: color }} />
          </ListItemText>
        </MenuItem>
      );
    });
  };

  const renderLoadingSpinner = () => (
    <Box justifyContent="center" display="flex" p={1}>
      <CircularProgress size="2rem" />
    </Box>
  );

  return (
    <Menu
      id="basic-menu-labels"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{ paper: { sx: { minWidth: '16.25rem' } } }}
      MenuListProps={{
        'aria-labelledby': 'assign-labels-button',
      }}
    >
      {isDataFetching ? renderLoadingSpinner() : renderLabelOptions()}
      <Divider sx={{ margin: 0 }} />
      <Box
        display="flex"
        p="0.25rem 1rem"
        justifyContent="space-between"
        width="100%"
      >
        <Button sx={{ mt: 2 }} onClick={onCancel} variant="secondary">
          {t('Cancel')}
        </Button>
        <Button
          disabled={isUpdateLabelsLoading}
          sx={{ mt: 2 }}
          onClick={handleOnSave}
        >
          {t('Save')}
        </Button>
      </Box>
    </Menu>
  );
};

export const LabelsMenuTranslated = withNamespaces()(LabelsMenu);
export default LabelsMenu;
