// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetSquadsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import TabLayout from '@kitman/components/src/TabLayout';
import { SearchFilterTranslated as Search } from '@kitman/modules/src/ElectronicFiles/shared/components/Filters/Search';
import { SelectMultipleFilterTranslated as SelectMultiple } from '@kitman/modules/src/ElectronicFiles/shared/components/Filters/SelectMultiple';
import type { Filters as GridFilters } from '@kitman/services/src/services/consent/searchAthletes';
import type { Option } from '@kitman/playbook/types';

import { CONSENT_STATUS_KEY } from '@kitman/common/src/types/Consent';

setI18n(i18n);

type Props = {
  onSearch: (searchString: string) => void,
  onUpdateFilter: (partialFilter: $Shape<GridFilters>) => void,
};

const Filters = ({ onSearch, onUpdateFilter, t }: I18nProps<Props>) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [squadIds, setSquadIds] = useState<Array<Option>>([]);
  const [consentFilterValues, setConsentFilterValues] = useState<Array<Option>>(
    []
  );
  const { data: organisationSquads = [] } = useGetSquadsQuery();

  return (
    <TabLayout.Filters>
      <TabLayout.Filter>
        <Search
          onChange={(searchString) => {
            setSearchValue(searchString);
            onSearch(searchString);
          }}
          value={searchValue}
        />
      </TabLayout.Filter>
      <TabLayout.Filter>
        <SelectMultiple
          multiple
          label={t('Squads')}
          options={organisationSquads.map((squad) => ({
            label: squad.name,
            id: squad.id,
          }))}
          value={squadIds}
          onChange={(squads: Array<Option>) => {
            setSquadIds(squads);
            onUpdateFilter({
              squad_ids: squads.length
                ? squads.map((squad) => Number(squad.id))
                : null,
              page: 1,
            });
          }}
        />
      </TabLayout.Filter>
      <TabLayout.Filter>
        <SelectMultiple
          label={t('Consent')}
          options={[
            { id: CONSENT_STATUS_KEY.Consented, label: t('Consented') },
            { id: CONSENT_STATUS_KEY.NoConsent, label: t('No consent') },
          ]}
          value={consentFilterValues}
          onChange={(value) => {
            setConsentFilterValues(value);
            onUpdateFilter({
              consent_status: value.length
                ? value.map((v) => String(v.id))
                : null,
              page: 1,
            });
          }}
        />
      </TabLayout.Filter>
    </TabLayout.Filters>
  );
};

export const FiltersTranslated: ComponentType<Props> =
  withNamespaces()(Filters);
export default Filters;
