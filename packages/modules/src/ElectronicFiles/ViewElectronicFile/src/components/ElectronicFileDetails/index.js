// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import {
  Box,
  Chip,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@kitman/playbook/components';
import {
  MENU_ITEM,
  type MenuItemKey,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  getContactText,
  renderStatus,
} from '@kitman/modules/src/ElectronicFiles/shared/utils';
import type { ElectronicFile } from '@kitman/modules/src/ElectronicFiles/shared/types';

type Props = {
  selectedMenuItem: MenuItemKey,
  electronicFile: ElectronicFile,
};

const ElectronicFileDetails = ({
  selectedMenuItem,
  electronicFile,
  t,
}: I18nProps<Props>) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems={selectedMenuItem === MENU_ITEM.inbox ? 'center' : 'start'}
      mb={1}
    >
      <Box>
        <Box
          display="flex"
          alignItems="center"
          mb={selectedMenuItem === MENU_ITEM.inbox ? 0 : 1}
        >
          {selectedMenuItem === MENU_ITEM.sent && (
            <Typography variant="h6" mr={1}>
              {electronicFile.title}
            </Typography>
          )}
          {selectedMenuItem === MENU_ITEM.inbox && electronicFile.archived && (
            <Chip label={t('Archived')} color="secondary" size="small" />
          )}
          {selectedMenuItem === MENU_ITEM.sent &&
            renderStatus(electronicFile.status)}
        </Box>
        <List dense>
          <ListItem disablePadding disableGutters>
            <ListItemText
              primary={
                <>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ fontWeight: 500 }}
                  >
                    {selectedMenuItem === MENU_ITEM.inbox
                      ? t('Received from:')
                      : t('Sent to:')}{' '}
                  </Typography>
                  <Typography variant="body2" component="span">
                    {getContactText({
                      selectedMenuItem,
                      electronicFile,
                    })}
                  </Typography>
                </>
              }
              sx={{ my: 0 }}
            />
          </ListItem>
          {selectedMenuItem === MENU_ITEM.sent && (
            <ListItem disablePadding disableGutters>
              <ListItemText
                primary={
                  <>
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ fontWeight: 500 }}
                    >{`${t('Message:')}`}</Typography>
                    <Typography variant="body2" component="div">
                      {electronicFile.message}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          )}
        </List>
      </Box>
      <Typography variant="body">
        {formatStandard({ date: moment(electronicFile.date) })}
      </Typography>
    </Box>
  );
};

export const ElectronicFileDetailsTranslated: ComponentType<Props> =
  withNamespaces()(ElectronicFileDetails);
export default ElectronicFileDetails;
