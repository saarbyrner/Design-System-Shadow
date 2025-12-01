// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useExportSidePanel from '@kitman/modules/src/HumanInput/hooks/useExportSidePanel';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { InputText, TextButton, TooltipMenu, Select } from '@kitman/components';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useManageAthletes } from '../contexts/manageAthletesContext';
import { exportInsuranceDetails } from '../utils';
import styles from './styles';

type Props = {};

const AthletesHeader = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { data: labelOptions = [], isSuccess: isLabelQuerySuccess } =
    // using undefined because this endpoint does not except arguments, but we do want to pass the skip query option
    useGetAllLabelsQuery(undefined, {
      skip: !window.getFlag('labels-and-groups'),
    });
  const {
    requestStatus,
    activeSquad,
    searchQuery,
    selectedLabels,
    viewType,
    updateSearchQuery,
    updateSelectedLabels,
    updateRequestStatus,
  } = useManageAthletes();
  const { handleOpenExportSidePanel } = useExportSidePanel();

  const debounceUpdateQuery = useDebouncedCallback(
    (query: string) => updateSearchQuery(query),
    400
  );

  const canExport =
    (window.featureFlags['export-insurance-details'] &&
      permissions.settings.canViewSettingsInsurancePolicies) ||
    (window.featureFlags['form-based-athlete-profile'] &&
      permissions.settings.canViewSettingsAthletes);

  const onExportInsuranceDetails = () => {
    updateRequestStatus('PENDING');

    exportInsuranceDetails({
      activeSquad,
      viewType,
      searchQuery,
    })
      .then(() => updateRequestStatus('SUCCESS'))
      .catch(() => updateRequestStatus('FAILURE'));
  };

  return (
    <header css={styles.header}>
      <div css={styles.headerTitleWrapper}>
        <h3 css={styles.headerTitle}>
          {viewType === 'ACTIVE' && props.t('Active athletes')}
          {viewType === 'INACTIVE' && props.t('Inactive athletes')}
        </h3>
        {canExport && (
          <TooltipMenu
            menuItems={[
              ...(window.featureFlags['export-insurance-details']
                ? [
                    {
                      description: props.t('Insurance Details (.csv)'),
                      onClick: onExportInsuranceDetails,
                    },
                  ]
                : []),
              ...(window.featureFlags['form-based-athlete-profile']
                ? [
                    {
                      description: props.t('Athlete Profile'),
                      onClick: handleOpenExportSidePanel,
                    },
                  ]
                : []),
            ]}
            tooltipTriggerElement={
              <div css={styles.headerButton}>
                <TextButton
                  text={props.t('Export')}
                  type="primary"
                  iconAfter="icon-chevron-down"
                  isLoading={requestStatus === 'PENDING'}
                  kitmanDesignSystem
                />
              </div>
            }
            offset={[8, 8]}
            placement="bottom-end"
            kitmanDesignSystem
          />
        )}
      </div>
      <div css={styles.headerFilter}>
        <div css={styles.filterLength}>
          <InputText
            placeholder={props.t('Search')}
            onValidation={({ value = '' }) => {
              if (value === searchQuery) {
                return;
              }
              debounceUpdateQuery(value);
            }}
            value={searchQuery}
            kitmanDesignSystem
            searchIcon
          />
        </div>

        {window.getFlag('labels-and-groups') &&
          permissions.settings.canViewLabels &&
          isLabelQuerySuccess && (
            <div css={styles.filterLength}>
              <Select
                placeholder={props.t('Labels')}
                options={labelOptions.map((label) => ({
                  value: label.id,
                  label: label.name,
                }))}
                value={selectedLabels}
                onChange={(selection) => updateSelectedLabels(selection)}
                isMulti
              />
            </div>
          )}
      </div>
    </header>
  );
};

export const AthletesHeaderTranslated: ComponentType<Props> =
  withNamespaces()(AthletesHeader);
export default AthletesHeader;
