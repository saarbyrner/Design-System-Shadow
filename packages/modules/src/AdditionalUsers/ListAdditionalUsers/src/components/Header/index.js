// @flow
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { TextButton, TooltipMenu } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';

import ProfileHeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ProfileHeaderLayout';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { openMassUploadModal } from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import AdditionalUsersCSVImporter from '@kitman/modules/src/AdditionalUsers/ListAdditionalUsers/src/components/AdditionalUsersCSVImporter';
import type { CsvUploadAdditionalUserTypes } from '@kitman/modules/src/AdditionalUsers/shared/types';

type Props = {};

const Header = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { permissions } = usePermissions();
  const locationAssign = useLocationAssign();
  const [userType, setUserType] = useState(null);

  const triggerMassUploadModal = (type: CsvUploadAdditionalUserTypes) => {
    setUserType(type);
    dispatch(openMassUploadModal());
  };

  const triggerCSVDownload = (type: CsvUploadAdditionalUserTypes) => {
    window.open(`https://kitman.imgix.net/kitman/${type}_mass_importer.csv`);
  };

  const createUserMenuItems = [
    {
      description: props.t('Create official'),
      onClick: () =>
        locationAssign('/administration/additional_users/official/new'),
      shouldShow: permissions?.settings?.canManageOfficials,
    },
    {
      description: props.t('Create scout'),
      onClick: () =>
        locationAssign('/administration/additional_users/scout/new'),
      shouldShow: permissions?.settings?.canManageScouts,
    },
    {
      description: props.t('Create match director'),
      onClick: () =>
        locationAssign('/administration/additional_users/match_director/new'),
      shouldShow: permissions?.settings?.canManageMatchDirectors,
    },
    {
      description: props.t('Create match monitor'),
      onClick: () =>
        locationAssign('/administration/additional_users/match_monitor/new'),
      shouldShow: permissions?.settings?.canManageMatchMonitors,
    },
  ]
    .filter((item) => item.shouldShow)
    .map(({ description, onClick }) => ({ description, onClick }));

  const uploadUserMenuItems = [
    {
      description: props.t('Upload officials'),
      onClick: () => triggerMassUploadModal('official'),
      shouldShow:
        permissions?.settings?.canManageOfficials &&
        window.getFlag('league-ops-mass-create-athlete-staff'),
    },
    {
      description: props.t('Upload scouts'),
      onClick: () => triggerMassUploadModal('scout'),
      shouldShow:
        permissions?.settings?.canManageScouts &&
        window.getFlag('league-ops-mass-create-athlete-staff'),
    },
    {
      description: props.t('Upload match monitor'),
      onClick: () => triggerMassUploadModal('match_monitor'),
      shouldShow:
        permissions?.settings?.canManageMatchMonitors &&
        window.getFlag('league-ops-additional-users'),
    },
  ]
    .filter((item) => item.shouldShow)
    .map(({ description, onClick }) => ({ description, onClick }));

  const downloadUserMenuItems = [
    {
      description: props.t('Download officials csv'),
      onClick: () => triggerCSVDownload('official'),
      shouldShow: permissions?.settings?.canManageOfficials,
    },
    {
      description: props.t('Download scouts csv'),
      onClick: () => triggerCSVDownload('scout'),
      shouldShow: permissions?.settings?.canManageScouts,
    },
    {
      description: props.t('Download match monitor csv'),
      onClick: () => triggerCSVDownload('match_monitor'),
      shouldShow: permissions?.settings?.canManageMatchMonitors,
    },
  ]
    .filter((item) => item.shouldShow)
    .map(({ description, onClick }) => ({ description, onClick }));

  return (
    <>
      <ProfileHeaderLayout>
        <ProfileHeaderLayout.Main>
          <ProfileHeaderLayout.Content>
            <h4>{props.t('Manage Additional Users')}</h4>
          </ProfileHeaderLayout.Content>
          <ProfileHeaderLayout.Actions>
            <TooltipMenu
              appendToParent
              placement="bottom-end"
              offset={[0, 5]}
              menuItems={createUserMenuItems}
              tooltipTriggerElement={
                <TextButton
                  text={props.t('Create new user')}
                  iconAfter="icon-chevron-down"
                  type="primary"
                  kitmanDesignSystem
                />
              }
              kitmanDesignSystem
            />
            {window.getFlag('league-ops-mass-create-athlete-staff') &&
              permissions?.settings?.canCreateImports && (
                <>
                  <TooltipMenu
                    appendToParent
                    placement="bottom-end"
                    offset={[0, 5]}
                    menuItems={uploadUserMenuItems}
                    tooltipTriggerElement={
                      <TextButton
                        text={props.t('Upload users')}
                        iconAfter="icon-chevron-down"
                        type="primary"
                        kitmanDesignSystem
                      />
                    }
                    kitmanDesignSystem
                  />
                  <TooltipMenu
                    appendToParent
                    placement="bottom-end"
                    offset={[0, 5]}
                    menuItems={downloadUserMenuItems}
                    tooltipTriggerElement={
                      <TextButton
                        text={props.t('Download csv')}
                        iconAfter="icon-chevron-down"
                        type="secondary"
                        kitmanDesignSystem
                      />
                    }
                    kitmanDesignSystem
                  />
                </>
              )}
          </ProfileHeaderLayout.Actions>
        </ProfileHeaderLayout.Main>
      </ProfileHeaderLayout>
      {userType && <AdditionalUsersCSVImporter userType={userType} />}
    </>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
