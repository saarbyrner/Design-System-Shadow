// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Box, Grid2 as Grid } from '@kitman/playbook/components';
import { AppHeaderTranslated as AppHeader } from '@kitman/modules/src/ElectronicFiles/shared/components/AppHeader';
import { SidebarTranslated as Sidebar } from '@kitman/modules/src/ElectronicFiles/shared/components/Sidebar';
import { MainContentTranslated as MainContent } from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/MainContent';
import { SendDrawerTranslated as SendDrawer } from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/SendDrawer';

type Props = {};

const ListElectronicFilesApp = () => {
  return (
    <>
      <AppHeader />
      <Box pb={6}>
        <Grid container>
          <Grid xs="auto" display="flex">
            <Sidebar />
          </Grid>
          <Grid xs display="flex">
            <MainContent />
          </Grid>
        </Grid>
      </Box>
      <SendDrawer />
    </>
  );
};

export const ListElectronicFilesAppTranslated: ComponentType<Props> =
  withNamespaces()(ListElectronicFilesApp);
export default ListElectronicFilesApp;
