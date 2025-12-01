// @flow

import { useDispatch } from 'react-redux';
import {
  Box,
  Tab,
  TabContext,
  TabList,
  TabPanel,
} from '@kitman/playbook/components';
import { useState } from 'react';
import Header from '@kitman/modules/src/HumanInput/shared/components/Header';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { CompletedTabTranslated as CompletedTab } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/CompletedTab';
import { ComplianceTabTranslated as ComplianceTab } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/ComplianceTab';
import { FormsTabTranslated as FormsTab } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/FormsTab';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { onReset } from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';

type Props = {};

const FormAnswerSets = ({ t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const {
    data: permissions = DEFAULT_CONTEXT_VALUE.permissions,
  }: { data: PermissionsType } = useGetPermissionsQuery();

  const canSubmitForms = permissions.eforms?.canSubmitForms;
  const canViewForms = permissions.eforms?.canViewForms;

  const getDefaultTabValue = () => (canSubmitForms ? '1' : '2');

  const [value, setValue] = useState(getDefaultTabValue());

  const handleChange = (event, newValue) => {
    dispatch(onReset());
    setValue(newValue);
  };

  return (
    <>
      <Header title={t('Form Responses')} />
      <Box
        sx={{
          backgroundColor: 'white',
        }}
      >
        <TabContext value={value}>
          <TabList onChange={handleChange}>
            {canSubmitForms && <Tab label={t('Forms')} value="1" />}
            {canViewForms && <Tab label={t('Completed')} value="2" />}
            {window.getFlag('cp-eforms-compliance-view') && canViewForms && (
              <Tab label={t('Compliance')} value="3" />
            )}
          </TabList>
          {canSubmitForms && (
            <TabPanel value="1" sx={{ p: 0 }}>
              <FormsTab />
            </TabPanel>
          )}
          {canViewForms && (
            <TabPanel value="2" sx={{ p: 0 }}>
              <CompletedTab />
            </TabPanel>
          )}
          {window.getFlag('cp-eforms-compliance-view') && canViewForms && (
            <TabPanel value="3" sx={{ p: 0 }}>
              <ComplianceTab />
            </TabPanel>
          )}
        </TabContext>
      </Box>
    </>
  );
};

export const FormAnswerSetsTranslated: ComponentType<Props> =
  withNamespaces()(FormAnswerSets);

export default FormAnswerSets;
