// @flow
import type { Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import { Grid, Skeleton, Box } from '@kitman/playbook/components';
import {
  APP_BAR_HEIGHT,
  TABS_HEIGHT,
} from '@kitman/modules/src/HumanInput/shared/constants';

import {
  MenuContainer,
  FormTitle,
  FormContainer,
  FormBody,
  FormFooter,
  generateSkeletonLoaders,
  generateSkeletonMenu,
} from '../shared';

type Props = {
  children: Node,
};

const RegistrationFormLayout = (props: Props): Node => {
  return (
    <Grid
      container
      direction="column"
      sx={{
        height: `calc(100vh - ${APP_BAR_HEIGHT + TABS_HEIGHT}px)`,
        background: colors.white,
        borderTop: 1,
        borderColor: colors.grey_disabled,
      }}
    >
      <Grid item container wrap="nowrap" sx={{ flex: 1 }}>
        {props.children}
      </Grid>
    </Grid>
  );
};

const SectionTitle = (props: Props): Node => {
  return (
    <Grid
      item
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: 1,
        borderColor: colors.grey_disabled,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      {props.children}
    </Grid>
  );
};

const Loading = () => {
  return (
    <RegistrationFormLayout>
      <MenuContainer isOpen>
        <FormTitle>
          <Skeleton
            variant="text"
            width="100%"
            height={32}
            data-testid="RegistrationFormLayout.Loading.FormTitle"
          />
        </FormTitle>
        <Box sx={{ p: 2 }} data-testid="RegistrationFormLayout.Loading.Menu">
          {generateSkeletonMenu}
        </Box>
      </MenuContainer>
      <FormContainer>
        <SectionTitle>
          <Skeleton
            variant="text"
            width={280}
            height={32}
            data-testid="RegistrationFormLayout.Loading.SectionTitle"
          />
        </SectionTitle>

        <FormBody>
          <Box
            sx={{ maxWidth: '50%', p: 2 }}
            data-testid="RegistrationFormLayout.Loading.FormBody"
          >
            {generateSkeletonLoaders(12)}
          </Box>
        </FormBody>
        <FormFooter>
          <Skeleton
            variant="text"
            height={36}
            width={80}
            data-testid="RegistrationFormLayout.Loading.FormFooter"
          />
          <Skeleton variant="text" width={80} height={36} />
        </FormFooter>
      </FormContainer>
    </RegistrationFormLayout>
  );
};

RegistrationFormLayout.MenuContainer = MenuContainer;
RegistrationFormLayout.FormTitle = FormTitle;
RegistrationFormLayout.FormContainer = FormContainer;
RegistrationFormLayout.SectionTitle = SectionTitle;
RegistrationFormLayout.FormBody = FormBody;
RegistrationFormLayout.FormFooter = FormFooter;
RegistrationFormLayout.Loading = Loading;

export default RegistrationFormLayout;
