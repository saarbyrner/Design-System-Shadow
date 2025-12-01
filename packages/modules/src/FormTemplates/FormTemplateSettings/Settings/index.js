// @flow
import { useState, type ComponentType } from 'react';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Tab,
  Box,
  TabContext,
  TabList,
  TabPanel,
} from '@kitman/playbook/components';
import { HeaderTranslated as Header } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/Header';
import CategoriesTab from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';

const styles = {
  pageContainer: { backgroundColor: colors.white },
};

const tabKeysEnumLike = {
  categories: 'categories',
};

type TabKey = $Values<typeof tabKeysEnumLike>;

const Settings = ({ t }: I18nProps<{}>) => {
  const { trackEvent } = useEventTracking();
  const [tab, setTab] = useState<TabKey>(tabKeysEnumLike.categories);
  const locationAssign = useLocationAssign();

  const handleTabChange = (event, newValue: TabKey) => {
    setTab(newValue);
    if (newValue === tabKeysEnumLike.categories) {
      trackEvent('Form Template Settings - Categories Tab Used');
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Header
        title={t('Settings')}
        handleBack={() => locationAssign('/forms/form_templates')}
        showStatus={false}
        backLabel={t('Back')}
      />
      <TabContext value={tab}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <TabList onChange={handleTabChange} aria-label={t('Settings tabs')}>
            <Tab label={t('Categories')} value={tabKeysEnumLike.categories} />
          </TabList>
        </Box>
        <TabPanel value={tabKeysEnumLike.categories} sx={{ p: 2 }}>
          <CategoriesTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export const SettingsTranslated: ComponentType<{}> = withNamespaces()(Settings);

export default Settings;
