// @flow
import { withNamespaces } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';
import {
  Box,
  Tab,
  TabContext,
  TabList,
  TabPanel,
} from '@kitman/playbook/components';
import { APP_BAR_HEIGHT } from '@kitman/modules/src/HumanInput/shared/constants';
import { colors } from '@kitman/common/src/variables';
import { onUpdateShowMenuIcons } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { getUserFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import { HeaderContainerTranslated as Header } from '@kitman/modules/src/StaffProfile/shared/components/HeaderContainer';
import { PermissionsTabTranslated as PermissionsTab } from '@kitman/modules/src/StaffProfile/shared/components/PermissionsTab';
import DocumentsTab from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab';
import StaffDetailsTab from '@kitman/modules/src/HumanInput/shared/components/FormDetailsTab';
import useActionButtons from '@kitman/modules/src/StaffProfile/shared/hooks/useStaffProfileActionButtons';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  hidePermissionsTab: ?boolean,
};

const tabKeysEnumLike = {
  staffDetails: 'staffDetails',
  permissions: 'permissions',
  documents: 'documents',
};

type TabKey = $Values<typeof tabKeysEnumLike>;

const EditViewStaffProfile = (props: I18nProps<Props>) => {
  const [tab, setTab] = useState<TabKey>(tabKeysEnumLike.staffDetails);
  const dispatch = useDispatch();
  const handleChange = (event, newValue: TabKey) => {
    setTab(newValue);
  };
  const user = useSelector(getUserFactory()) || null;

  const { actionButtons } = useActionButtons();

  useEffect(() => {
    dispatch(onUpdateShowMenuIcons({ showMenuIcons: false }));
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
        background: colors.background,
        typography: 'body1',
      }}
    >
      <FormLayout.Title withTabs>
        <Header user={user} />
      </FormLayout.Title>
      <TabContext value={tab}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: colors.white,
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label={props.t('Staff Profile Tabs')}
          >
            <Tab
              label={props.t('Staff Details')}
              value={tabKeysEnumLike.staffDetails}
            />
            {!props.hidePermissionsTab && (
              <Tab
                label={props.t('Permissions')}
                value={tabKeysEnumLike.permissions}
              />
            )}
            <Tab
              label={props.t('Documents')}
              value={tabKeysEnumLike.documents}
            />
          </TabList>
        </Box>
        <TabPanel
          sx={{ p: 0, flexGrow: 1, overflowY: 'auto' }}
          value={tabKeysEnumLike.staffDetails}
        >
          <StaffDetailsTab actionButtons={actionButtons} />
        </TabPanel>
        {!props.hidePermissionsTab && (
          <TabPanel sx={{ p: 0 }} value={tabKeysEnumLike.permissions}>
            <PermissionsTab />
          </TabPanel>
        )}
        <TabPanel sx={{ p: 0 }} value={tabKeysEnumLike.documents}>
          <DocumentsTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export const EditViewStaffProfileTranslated =
  withNamespaces()(EditViewStaffProfile);
export default EditViewStaffProfile;
