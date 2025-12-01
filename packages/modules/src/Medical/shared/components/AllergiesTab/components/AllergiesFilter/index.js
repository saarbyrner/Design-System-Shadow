/* eslint-disable no-unused-vars */
// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  DateRangePicker,
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
  TooltipMenu,
} from '@kitman/components';
import type { PositionGroups } from '@kitman/services/src/services/getPositionGroups';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus, AllergiesFilter } from '../../../../types';

import style from '../../../styles/filters';

type Props = {
  positionGroups: PositionGroups,
  squads: Array<Option>,
  filters: AllergiesFilter,
  onChangeFilter: (filter: AllergiesFilter) => void,
  onClickAddAllergy: Function,
  onClickAddMedicalAlert: Function,
  initialDataRequest: RequestStatus,
  hiddenFilters?: Array<string>,
};

const AllergiesFilters = (props: I18nProps<Props>) => {
  const [isFilterPanelShown, setIsFilterPanelShown] = useState(false);
  const { permissions } = usePermissions();

  const renderSearchFilter = (
    <div css={style.filter} data-testid="AllergiesFilter|Search">
      <InputTextField
        placeholder={props.t('Search')}
        value={props.filters.search_expression}
        onChange={({ target: { value } }) =>
          props.onChangeFilter({
            ...props.filters,
            search_expression: value,
          })
        }
        searchIcon
        kitmanDesignSystem
        disabled={props.initialDataRequest === 'PENDING'}
      />
    </div>
  );

  const squadFilter = (
    <div css={style.filter} data-testid="AllergiesFilter|Squad">
      <Select
        placeholder={props.t('Roster')}
        value={props.filters.squad_ids}
        options={props.squads}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            squad_ids: id,
          })
        }
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const severityFilter = (
    <div css={style.filter} data-testid="AllergiesFilter|Severity">
      <Select
        placeholder={props.t('Severity')}
        value={props.filters.severities}
        options={[
          {
            label: 'Mild',
            value: 'mild',
          },
          {
            label: 'Moderate',
            value: 'moderate',
          },
          {
            label: 'Severe',
            value: 'severe',
          },
          {
            label: 'Not Specified',
            value: 'none',
          },
        ]}
        onChange={(severityLevel) =>
          props.onChangeFilter({
            ...props.filters,
            severities: severityLevel,
          })
        }
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const positionFilter = (
    <div css={style.filter} data-testid="AllergiesFilter|Position">
      <Select
        placeholder={props.t('Position')}
        value={props.filters.position_ids}
        options={props.positionGroups || []}
        onChange={(positionIds) =>
          props.onChangeFilter({
            ...props.filters,
            position_ids: positionIds,
          })
        }
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const categoryFilter = (
    <div css={style.filter} data-testid="AllergiesFilter|Category">
      <Select
        placeholder={props.t('Category')}
        value={props.filters.categories}
        options={[
          {
            label: 'Allergy',
            value: 'allergy',
          },
          {
            label: 'Medical alert',
            value: 'medicalAlert',
          },
        ]}
        onChange={(categories) =>
          props.onChangeFilter({
            ...props.filters,
            categories,
          })
        }
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  return (
    <header css={style.header}>
      <div css={style.titleContainer}>
        <h3 css={style.title}>{props.t('Medical Flags')}</h3>
        <div css={style.actions}>
          {permissions.medical.allergies.canCreate && (
            <div data-testid="AllergiesFilter|AddAllergy">
              {permissions.medical.allergies.canCreateNewAllergy && (
                <TextButton
                  text={props.t('Add allergy')}
                  type="primary"
                  kitmanDesignSystem
                  onClick={props.onClickAddAllergy}
                />
              )}
            </div>
          )}
          {window.featureFlags['medical-alerts-side-panel'] &&
            permissions.medical.alerts.canCreate && (
              <div css={style.titleContainer}>
                {permissions.medical.alerts.canCreate && (
                  <TextButton
                    text={props.t('Add medical alert')}
                    type="primary"
                    kitmanDesignSystem
                    onClick={props.onClickAddMedicalAlert}
                  />
                )}
              </div>
            )}
        </div>
      </div>

      <div css={style.filters} data-testid="AllergiesFilter|FilterContainer">
        {renderSearchFilter}
        {squadFilter}
        {severityFilter}
        {positionFilter}
        {categoryFilter}
      </div>

      <div css={style.mobileFilters}>
        {!props.hiddenFilters?.includes('squads') && squadFilter}
        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setIsFilterPanelShown(true)}
          kitmanDesignSystem
        />
        <SlidingPanelResponsive
          isOpen={isFilterPanelShown}
          title={props.t('Filters')}
          onClose={() => setIsFilterPanelShown(false)}
        >
          <div css={style.mobileFiltersPanel}>{renderSearchFilter}</div>
        </SlidingPanelResponsive>
      </div>
    </header>
  );
};

export const AllergiesFilterTranslated: ComponentType<Props> =
  withNamespaces()(AllergiesFilters);
export default AllergiesFilters;
