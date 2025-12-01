// @flow
import type { ComponentType, Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector } from 'react-redux';
import { selectSelectedMenuItem } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { selectPersistedFilters } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import { Box, Typography } from '@kitman/playbook/components';

type Props = {
  children?: Node,
};

const Header = ({ children, t }: I18nProps<Props>) => {
  const selectedMenuItem = useSelector(selectSelectedMenuItem);
  const persistedFilters = useSelector(selectPersistedFilters);
  const filters = persistedFilters[selectedMenuItem];

  return (
    <Box p={2} pb={0}>
      <Box mb={3}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 500, textTransform: 'capitalize' }}
        >
          {filters.archived ? t('Archive') : selectedMenuItem}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
