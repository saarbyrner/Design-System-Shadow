// @flow
import { Fragment } from 'react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import ProfileHeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ProfileHeaderLayout';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {};

const style = {
  title: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 20px;
  `,
};

const Header = (props: I18nProps<Props>) => {
  return (
    <ProfileHeaderLayout>
      <ProfileHeaderLayout.Main>
        <ProfileHeaderLayout.Content>
          <Fragment>
            <h2 css={style.title}>{props.t('Edit Official')}</h2>
          </Fragment>
        </ProfileHeaderLayout.Content>
      </ProfileHeaderLayout.Main>
    </ProfileHeaderLayout>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
