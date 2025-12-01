// @flow
import { useState, Suspense, lazy, type ComponentType } from 'react';
import { colors } from '@kitman/common/src/variables';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { withNamespaces } from 'react-i18next';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Tab,
  Box,
  TabContext,
  TabList,
  TabPanel,
  Alert,
} from '@kitman/playbook/components';
import FormSkeleton from '@kitman/modules/src/FormTemplates/FormBuilder/components/FormSkeleton';
import PreviewFormTemplate from '@kitman/modules/src/FormTemplates/FormBuilder/components/PreviewTemplate';
import { SettingsTabTranslated as SettingsTab } from '@kitman/modules/src/FormTemplates/FormBuilder/components/SettingsTab';
import useInitializeFormBuilder from './hooks/useInitializeFormBuilder';
import { HeaderTranslated as Header } from './components/Header';

const Form = lazy(() => import('./components/Form'));

const styles = {
  pageContainer: { backgroundColor: colors.white },
};

const tabKeysEnumLike = {
  build: 'build',
  preview: 'preview',
  settings: 'settings',
};

type Props = {
  formTemplateId?: number,
};
type TabKey = $Values<typeof tabKeysEnumLike>;

const FormBuilder = ({ t, formTemplateId }: I18nProps<Props>) => {
  const locationAssign = useLocationAssign();
  const { trackEvent } = useEventTracking();
  const [tab, setTab] = useState<TabKey>(tabKeysEnumLike.build);
  const { isError, isSuccess } = useInitializeFormBuilder({ formTemplateId });

  const handleTabChange = (event, newValue: TabKey) => {
    setTab(newValue);
    if (newValue === tabKeysEnumLike.preview) {
      trackEvent('Form Builder - Preview Tab Used', { formTemplateId });
    } else if (newValue === tabKeysEnumLike.settings) {
      trackEvent('Form Builder - Settings Tab Used', { formTemplateId });
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Header
        formTemplateId={formTemplateId || null}
        handleBack={() => {
          locationAssign(`/forms/form_templates`);
        }}
        isLoading={!isSuccess}
      />
      <TabContext value={tab}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <TabList
            onChange={handleTabChange}
            aria-label={t('Form builder Tabs')}
          >
            <Tab label={t('Build')} value={tabKeysEnumLike.build} />
            <Tab
              label={t('Preview')}
              value={tabKeysEnumLike.preview}
              disabled={!isSuccess || isError}
            />
            <Tab
              label={t('Settings')}
              value={tabKeysEnumLike.settings}
              disabled={!isSuccess || isError}
            />
          </TabList>
        </Box>
        <TabPanel value={tabKeysEnumLike.build} sx={{ p: 0 }}>
          {isError ? (
            <Alert severity="error">{t('Form template not found')}</Alert>
          ) : (
            isSuccess && (
              <Suspense fallback={<FormSkeleton />}>
                <Form />
              </Suspense>
            )
          )}
        </TabPanel>
        <TabPanel
          value={tabKeysEnumLike.preview}
          sx={{ p: 0, flexGrow: 1, overflowY: 'auto' }}
        >
          <PreviewFormTemplate />
        </TabPanel>
        <TabPanel
          value={tabKeysEnumLike.settings}
          sx={{ p: 0, flexGrow: 1, overflowY: 'auto' }}
        >
          <SettingsTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export const FormBuilderTranslated: ComponentType<Props> =
  withNamespaces()(FormBuilder);

export default FormBuilder;
