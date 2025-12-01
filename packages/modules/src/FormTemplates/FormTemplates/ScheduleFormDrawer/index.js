// @flow
import { useDispatch, useSelector } from 'react-redux';

import { Drawer, Divider, Box, Button } from '@kitman/playbook/components';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';

import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import {
  getIsScheduleDrawerOpen,
  getSelectedFormId,
} from '../../redux/selectors/formTemplateSelectors';
import {
  toggleIsScheduleDrawerOpen,
  setSelectedFormId,
} from '../../redux/slices/formTemplatesSlice';
import { getDrawerTranslations } from './utils/helpers';

type Props = {
  handleSaveButton: () => void,
};

const ScheduleDrawer = ({ handleSaveButton }: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDrawerOpen = useSelector(getIsScheduleDrawerOpen);
  const formId = useSelector(getSelectedFormId);

  const closeDrawer = () => {
    dispatch(toggleIsScheduleDrawerOpen());
    dispatch(setSelectedFormId(null));
  };

  const { title, saveButton } = getDrawerTranslations();

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      anchor="right"
      sx={drawerMixin({ theme, isOpen: isDrawerOpen, drawerWidth: 650 })}
    >
      <DrawerLayout.Title title={title} onClose={closeDrawer} />
      <Divider />
      <DrawerLayout.Content>
        <Box>{formId}</Box>
      </DrawerLayout.Content>

      <Divider />
      <DrawerLayout.Actions>
        <Button onClick={handleSaveButton}>{saveButton}</Button>
      </DrawerLayout.Actions>
    </Drawer>
  );
};

export default ScheduleDrawer;
