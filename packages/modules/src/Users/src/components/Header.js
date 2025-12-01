// @flow
import { TextButton } from '@kitman/components';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { DownloadCSVTranslated as DownloadCSV } from '@kitman/modules/src/shared/MassUpload/components/DownloadCSV';
import { MassUploadTranslated as MassUpload } from '@kitman/modules/src/shared/MassUpload';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import { exportStaff } from '@kitman/services/src/services/exports';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ExportMenuTranslated as ExportMenu } from './ExportMenu/ExportMenu';
import { VisibilityIssuesIndicatorTranslated as VisibilityIssuesIndicator } from './VisibilityIssuesIndicator';

const styles = {
  header: css`
    display: flex;
    align-items: center;

    > div {
      margin-left: 15px;
      margin-bottom: 5px;
    }
  `,
};

type Props = {};

function Header(props: I18nProps<Props>) {
  const locationAssign = useLocationAssign();
  const { permissions } = usePermissions();

  const allowConfidentialNote =
    window.featureFlags['confidential-notes'] &&
    permissions.medical.privateNotes.canAdmin;
  const staffProfileUrl = window.featureFlags['form-based-staff-profile']
    ? '/administration/staff/new'
    : '/users/new';
  const renderDownloadExportMenu =
    window.featureFlags['league-ops-staff-league-export'] &&
    permissions.settings.canRunLeagueExports;

  const leagueOpsStaffExports = useExports(null, true);
  const menuItems = [
    {
      key: 'staff',
      description: props.t('Registration Staff Export'),
      onClick: () => leagueOpsStaffExports.exportReports(() => exportStaff()),
      icon: 'icon-export',
      isDisabled: false,
      handleToast: leagueOpsStaffExports,
    },
  ];
  const toastHandlers = [leagueOpsStaffExports];

  const shouldShowCreateNewUserButton =
    !window.featureFlags['form-based-staff-profile'] ||
    (window.featureFlags['form-based-staff-profile'] &&
      permissions.settings.canManageStaffUsers);

  return (
    <div className="users__header">
      <div>
        <div css={styles.header}>
          <h1>{props.t('Manage Staff Users')}</h1>
          {allowConfidentialNote && <VisibilityIssuesIndicator />}
        </div>
      </div>
      <div className="users__actionButtons">
        {shouldShowCreateNewUserButton && (
          <TextButton
            type="primary"
            text={props.t('Create New User')}
            onClick={() => {
              locationAssign(staffProfileUrl);
            }}
            kitmanDesignSystem
          />
        )}
        {window.featureFlags['league-ops-mass-create-athlete-staff'] &&
          permissions?.settings?.canCreateImports && (
            <>
              <MassUpload userType="user" />
              <DownloadCSV userType="user" />
            </>
          )}

        {renderDownloadExportMenu && (
          <ExportMenu menuItems={menuItems} toastHandlers={toastHandlers} />
        )}
      </div>
    </div>
  );
}

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
