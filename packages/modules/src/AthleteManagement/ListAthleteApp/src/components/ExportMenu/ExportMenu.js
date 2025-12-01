// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';

import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import { TooltipMenu, TextButton } from '@kitman/components';
import { exportRegistrationPlayers } from '@kitman/services/src/services/exports';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import useExportSidePanel from '@kitman/modules/src/HumanInput/hooks/useExportSidePanel';
import {
  useGetActiveSquadQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { useLocationHash } from '@kitman/common/src/hooks';
import {
  exportInsuranceDetails,
  VIEW_TYPE,
} from '@kitman/modules/src/ManageAthletes/src/utils';
import { getSearchQuery } from '@kitman/modules/src/AthleteManagement/shared/redux/selectors/index';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type { Squad } from '@kitman/services/src/services/getActiveSquad';
import { TAB_HASHES } from '../../utils/consts';

type Props = {
  divisionId?: number,
};

const ExportMenu = ({ t }: I18nProps<Props>) => {
  const locationHash = useLocationHash();
  const leagueOpsHomegrownExports = useExports(null, true);
  const { handleOpenExportSidePanel } = useExportSidePanel();
  const { data: activeSquad }: { data: Squad } = useGetActiveSquadQuery();
  const { data: permissions }: { data: PermissionsType } =
    useGetPermissionsQuery();
  const searchQuery: string = useSelector(getSearchQuery);

  const canViewInsuranceExport =
    permissions.settings.canViewSettingsInsurancePolicies &&
    window.featureFlags['export-insurance-details'];

  const onExportInsuranceDetails = () => {
    exportInsuranceDetails({
      activeSquad,
      viewType:
        locationHash === TAB_HASHES.inactive
          ? VIEW_TYPE.Inactive
          : VIEW_TYPE.Active,
      searchQuery,
    });
  };

  const generateMenuItems = () => {
    const exportIcon = 'icon-export';
    const menuItems: Array<TooltipItem> = [];
    const insuranceDetailsMenuItem: TooltipItem = {
      key: 'insuranceDetails',
      description: t('Insurance Details (.csv)'),
      onClick: onExportInsuranceDetails,
      icon: exportIcon,
    };

    if (permissions.settings.canRunLeagueExports) {
      menuItems.push({
        key: 'homegrown',
        description: t('Registration Player Export'),
        onClick: () =>
          leagueOpsHomegrownExports.exportReports(() =>
            exportRegistrationPlayers()
          ),
        icon: exportIcon,
        isDisabled: false,
      });
    }

    if (
      window.featureFlags['form-based-athlete-profile'] &&
      permissions.settings.canViewSettingsAthletes
    ) {
      menuItems.push({
        key: 'athleteProfile',
        description: t('Athlete Profile'),
        onClick: handleOpenExportSidePanel,
        icon: exportIcon,
        isDisabled: false,
      });
    }

    if (canViewInsuranceExport) {
      menuItems.push(insuranceDetailsMenuItem);
    }

    return menuItems;
  };

  const renderExportMenu = () => {
    const exportMenuItems = generateMenuItems();

    return (
      exportMenuItems.length > 0 && (
        <>
          <TooltipMenu
            appendToParent
            placement="bottom-end"
            offset={[0, 5]}
            menuItems={exportMenuItems}
            tooltipTriggerElement={
              <TextButton
                text={t('Download')}
                type="secondary"
                iconAfter="icon-chevron-down"
                kitmanDesignSystem
              />
            }
            kitmanDesignSystem
          />
          <ToastDialog
            toasts={leagueOpsHomegrownExports.toasts}
            onCloseToast={leagueOpsHomegrownExports.closeToast}
          />
        </>
      )
    );
  };

  return renderExportMenu();
};

export const ExportMenuTranslated = withNamespaces()(ExportMenu);
export default ExportMenu;
