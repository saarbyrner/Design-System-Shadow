// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Box, Grid2 as Grid } from '@kitman/playbook/components';
import { AppHeaderTranslated as AppHeader } from '@kitman/modules/src/ElectronicFiles/shared/components/AppHeader';
import { SidebarTranslated as Sidebar } from '@kitman/modules/src/ElectronicFiles/shared/components/Sidebar';
import { MainContentTranslated as MainContent } from '@kitman/modules/src/ElectronicFiles/ListContacts/src/components/MainContent';
import { ContactDrawerTranslated as ContactDrawer } from '@kitman/modules/src/ElectronicFiles/ListContacts/src/components/ContactDrawer';

type Props = {};

const ListContactsApp = () => {
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
      <ContactDrawer />
    </>
  );
};

export const ListContactsAppTranslated: ComponentType<Props> =
  withNamespaces()(ListContactsApp);
export default ListContactsApp;
