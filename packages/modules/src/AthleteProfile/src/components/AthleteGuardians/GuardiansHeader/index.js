// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { Grid, Box, Button } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch } from 'react-redux';
import {
  onOpenGuardianSidePanel,
  onResetSidePanelForm,
} from '@kitman/modules/src/AthleteProfile/redux/slices/guardiansTabSlice';

export type TranslatedProps = I18nProps<{}>;

const GuardiansHeader = ({ t }: TranslatedProps) => {
  const dispatch = useDispatch();
  const handleAddGuardianClick = () => {
    dispatch(onResetSidePanelForm());
    dispatch(onOpenGuardianSidePanel());
  };

  return (
    <Grid container justifyContent="space-between" mb={2}>
      <Box columnGap="0.5rem" display="flex" />
      <Grid item>
        <Button onClick={handleAddGuardianClick}>{t('Add')}</Button>
      </Grid>
    </Grid>
  );
};

export const GuardiansHeaderTranslated: ComponentType<{}> =
  withNamespaces()(GuardiansHeader);
export default GuardiansHeader;
