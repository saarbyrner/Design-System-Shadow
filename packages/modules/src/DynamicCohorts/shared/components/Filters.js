// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { DateRangePicker, InputTextField, Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetStaffUsersQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { mapStaffToOptions } from '@kitman/modules/src/PlanningEventSidePanel/src/components/custom/CustomEventLayout';
import style from '@kitman/modules/src/DynamicCohorts/shared/styles';
import { useFilter } from '../utils/hooks/useFilter';
import type { SetFilterFunctionType } from '../utils/types';

type Props = { stateKey: string, setFilter: SetFilterFunctionType };

const Filters = ({ t, stateKey, setFilter }: I18nProps<Props>) => {
  const { data: staffUsers } = useGetStaffUsersQuery();

  const { filter: searchValueFilter, setFilter: setSearchValueFilter } =
    useFilter('searchValue', stateKey, setFilter);
  const { filter: createdByFilter, setFilter: setCreatedByFilter } = useFilter(
    'createdBy',
    stateKey,
    setFilter
  );
  const { filter: createdOnFilter, setFilter: setCreatedOnFilter } = useFilter(
    'createdOn',
    stateKey,
    setFilter
  );

  return (
    <div css={style.sharedFilters} data-testid="Filters">
      <InputTextField
        placeholder={t('Search')}
        onChange={(event) => {
          setSearchValueFilter(event.target.value);
        }}
        value={searchValueFilter}
        kitmanDesignSystem
        searchIcon
      />
      <Select
        placeholder={t('Created by')}
        options={mapStaffToOptions(staffUsers ?? [])}
        onChange={setCreatedByFilter}
        value={createdByFilter}
        isMulti
      />
      <DateRangePicker
        value={createdOnFilter}
        placeholder={t('Created on')}
        onChange={(dateRange) => setCreatedOnFilter(dateRange)}
        isClearable
        turnaroundList={[]}
        allowFutureDate
        position="center"
        kitmanDesignSystem
      />
    </div>
  );
};

export const FiltersTranslated: ComponentType<Props> =
  withNamespaces()(Filters);
export default Filters;
