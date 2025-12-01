// @flow
import { withNamespaces } from 'react-i18next';
import { Fragment } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { TextButton } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';

import { DownloadCSVTranslated as DownloadCSV } from '@kitman/modules/src/shared/MassUpload/components/DownloadCSV';
import { MassUploadTranslated as MassUpload } from '@kitman/modules/src/shared/MassUpload';
import ProfileHeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ProfileHeaderLayout';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {};

const style = {
  Header: css`
    background-color: ${colors.white};
    min-height: calc(100vh - 50px);
  `,
  title: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 20px;
  `,
};

const Header = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const locationAssign = useLocationAssign();
  return (
    <ProfileHeaderLayout>
      <ProfileHeaderLayout.Main>
        <ProfileHeaderLayout.Content>
          <Fragment>
            <h2 css={style.title}>{props.t('Manage Officials')}</h2>
          </Fragment>
        </ProfileHeaderLayout.Content>

        <ProfileHeaderLayout.Actions>
          <TextButton
            type="primary"
            text={props.t('Create New Official')}
            onClick={() => {
              locationAssign(
                `/${
                  window.featureFlags['side-nav-update']
                    ? 'administration'
                    : 'settings'
                }/officials/new`
              );
            }}
            kitmanDesignSystem
          />
          {window.featureFlags['league-ops-mass-create-athlete-staff'] &&
            permissions?.settings?.canCreateImports && (
              <>
                <MassUpload userType="official" />
                <DownloadCSV userType="official" />
              </>
            )}
        </ProfileHeaderLayout.Actions>
      </ProfileHeaderLayout.Main>
    </ProfileHeaderLayout>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
