// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useState } from 'react';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { colors } from '@kitman/common/src/variables';
import useAppHeaderHeight from '@kitman/common/src/hooks/useAppHeaderHeight';
import { AssignedFormsTabTranslated as AssignedFormsTab } from '@kitman/modules/src/HumanInput/pages/assignedForms/AssignedForms/components/AssignedFormsTab';
import { CompletedFormsTabTranslated as CompletedFormsTab } from '@kitman/modules/src/HumanInput/pages/assignedForms/AssignedForms/components/CompletedFormsTab';
import {
  Box,
  Typography,
  Tab,
  TabContext,
  TabList,
  TabPanel,
} from '@kitman/playbook/components';

type Props = {};

const tabKeysEnumLike = {
  forms: 'forms',
  completed: 'completed',
};

type TabKey = $Values<typeof tabKeysEnumLike>;

const AssignedForms = ({ t }: I18nProps<Props>) => {
  const [tab, setTab] = useState<TabKey>(tabKeysEnumLike.forms);
  const headerHeight = useAppHeaderHeight();

  const handleChange = (event, newValue: TabKey) => {
    setTab(newValue);
  };

  const tabPanelSx = {
    p: 0,
    display: 'flex',
    height: '100%',
    backgroundColor: colors.white,
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.white,
        height: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <Box width="100%" p="1rem">
        <Typography variant="h5">{t('Assigned Forms')}</Typography>
      </Box>
      <TabContext value={tab}>
        <Box>
          <TabList
            onChange={handleChange}
            aria-label={t('Athlete Assigned Forms Tabs')}
          >
            <Tab label={t('Forms')} value={tabKeysEnumLike.forms} />
            <Tab label={t('Completed')} value={tabKeysEnumLike.completed} />
          </TabList>
        </Box>
        <TabPanel value={tabKeysEnumLike.forms} sx={tabPanelSx}>
          <AssignedFormsTab />
        </TabPanel>
        <TabPanel value={tabKeysEnumLike.completed} sx={tabPanelSx}>
          <CompletedFormsTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export const AssignedFormsTranslated: ComponentType<Props> =
  withNamespaces()(AssignedForms);
export default AssignedForms;
