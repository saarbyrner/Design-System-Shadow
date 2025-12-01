// @flow
import { withNamespaces } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';
import {
  Tab,
  Box,
  TabContext,
  TabList,
  TabPanel,
} from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import { APP_BAR_HEIGHT } from '@kitman/modules/src/HumanInput/shared/constants';
import { onUpdateShowMenuIcons } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { HeaderContainerTranslated as Header } from '@kitman/modules/src/StaffProfile/shared/components/HeaderContainer';
import StaffDetailsTab from '@kitman/modules/src/HumanInput/shared/components/FormDetailsTab';
import useActionButtons from '@kitman/modules/src/StaffProfile/shared/hooks/useStaffProfileActionButtons';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const tabKeysEnumLike = {
  staffDetails: 'staffDetails',
};

type TabKey = $Values<typeof tabKeysEnumLike>;

const CreateStaffProfile = (props: I18nProps<{}>) => {
  const [tab, setTab] = useState<TabKey>(tabKeysEnumLike.staffDetails);
  const dispatch = useDispatch();
  const handleChange = (event, newValue: TabKey) => {
    setTab(newValue);
  };
  const { actionButtons } = useActionButtons();

  useEffect(() => {
    dispatch(onUpdateShowMenuIcons({ showMenuIcons: true }));
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
        {/* user is null because this component CREATES a new staff user */}
        <Header user={null} />
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
          </TabList>
        </Box>
        <TabPanel
          sx={{ p: 0, flexGrow: 1, overflowY: 'auto' }}
          value={tabKeysEnumLike.staffDetails}
        >
          <StaffDetailsTab actionButtons={actionButtons} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export const CreateStaffProfileTranslated =
  withNamespaces()(CreateStaffProfile);
export default CreateStaffProfile;
