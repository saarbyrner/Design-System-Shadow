// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Box, Grid2 as Grid } from '@kitman/playbook/components';
import { AppHeaderTranslated as AppHeader } from '@kitman/modules/src/ElectronicFiles/shared/components/AppHeader';
import { SidebarTranslated as Sidebar } from '@kitman/modules/src/ElectronicFiles/shared/components/Sidebar';
import { MainContentTranslated as MainContent } from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/MainContent';
import { SendDrawerTranslated as SendDrawer } from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/SendDrawer';

type Props = {
  id: string,
};

const ViewElectronicFileApp = ({ id }: Props) => {
  return (
    <>
      <AppHeader hideViewArchiveButton />
      <Box pb={6}>
        <Grid container>
          <Grid xs="auto" display="flex">
            <Sidebar />
          </Grid>
          <Grid xs display="flex">
            <MainContent id={Number(id)} />
          </Grid>
        </Grid>
      </Box>
      <SendDrawer />
    </>
  );
};

export const ViewElectronicFileAppTranslated: ComponentType<Props> =
  withNamespaces()(ViewElectronicFileApp);
export default ViewElectronicFileApp;
