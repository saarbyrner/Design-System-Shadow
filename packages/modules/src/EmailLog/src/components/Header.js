// @flow
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { Box } from '@kitman/playbook/components';

type Props = {};

const style = {
  title: {
    color: colors.grey_300,
    fontWeight: 400,
    fontSize: 20,
  },
};

const Header = ({ t }: I18nProps<Props>) => {
  return (
    <Box sx={{ padding: '18px' }}>
      <h2 css={style.title}>{t('Email log')}</h2>
    </Box>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
