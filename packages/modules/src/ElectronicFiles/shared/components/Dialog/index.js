// @flow
import { colors } from '@kitman/common/src/variables';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import type { AllocationAttribute } from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  selectOpen,
  selectAllocations,
  selectAttachments,
  reset,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/dialogSlice';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { getAthleteName } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import { SelectedFilesTranslated as SelectedFiles } from '@kitman/modules/src/ElectronicFiles/shared/components/SelectedFiles';

type Props = {
  title?: string,
};

const Dialog = ({ title, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const open = useSelector(selectOpen);

  const allocations = useSelector(selectAllocations);
  const groupedAllocations = _(allocations)
    .groupBy(
      (allocation: AllocationAttribute) =>
        `${allocation.athlete.id}_${allocation.athlete.firstname}_${allocation.athlete.lastname}`
    )
    .map((allocation: AllocationAttribute) => ({
      athlete: allocation[0].athlete,
      allocations: allocation,
    }))
    .value();

  const attachments = useSelector(selectAttachments);

  const renderTitle = () => {
    if (groupedAllocations.length) {
      return allocations.length === 1
        ? t('Attached to 1 player')
        : t('Attached to {{count}} players', {
            count: groupedAllocations.length,
          });
    }
    if (attachments.length) {
      return attachments.length === 1
        ? t('1 attachment')
        : t('{{count}} attachments', {
            count: attachments.length,
          });
    }
    return title;
  };

  const renderContent = () => {
    if (groupedAllocations.length) {
      return (
        <List dense>
          {groupedAllocations.map((groupedAllocation) => (
            <ListItem key={groupedAllocation.athlete.id} disableGutters>
              <ListItemText
                primary={getAthleteName(groupedAllocation.athlete)}
                sx={{ width: '35%' }}
              />
              <ListItemText
                primary={`${t('Pages')}: ${groupedAllocation.allocations
                  .map((allocation: AllocationAttribute) => allocation.range)
                  .join(', ')}`}
                sx={{ width: '65%' }}
              />
            </ListItem>
          ))}
        </List>
      );
    }

    return (
      <SelectedFiles attachedFiles={attachments} hideTitle hideRemoveAction />
    );
  };

  return (
    <MuiDialog
      open={open}
      fullWidth
      maxWidth="xs"
      onClose={() => dispatch(reset())}
    >
      <DialogTitle>{renderTitle()}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => dispatch(reset())}
        sx={{
          position: 'absolute',
          right: '8px',
          top: '8px',
          color: colors.grey_300_50,
        }}
      >
        <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
      </IconButton>
      <DialogContent dividers>{renderContent()}</DialogContent>
    </MuiDialog>
  );
};

export const DialogTranslated: ComponentType<Props> = withNamespaces()(Dialog);
export default Dialog;
