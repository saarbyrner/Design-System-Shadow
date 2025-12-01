// @flow
import { withNamespaces } from 'react-i18next';
import { InputTextField, Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const scheduledOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'notScheduled', label: 'Not Scheduled' },
];

type Props = {
  searchText: string,
  searchStatus: string,
  searchScheduled: string,
  setSearchText: Function,
  setSearchStatus: Function,
  setSearchScheduled: Function,
};

function Filter(props: I18nProps<Props>) {
  return (
    <>
      <div className="row filter">
        <div className="col-lg-3">
          <InputTextField
            onChange={(e) => props.setSearchText(e.target.value)}
            value={props.searchText}
            placeholder={props.t('Search forms')}
            searchIcon
            kitmanDesignSystem
          />
        </div>
        <div className="col-lg-2">
          <Select
            value={props.searchStatus}
            options={statusOptions}
            onChange={props.setSearchStatus}
            onClear={props.setSearchStatus}
            isClearable
            placeholder={props.t('Status')}
            t={props.t}
          />
        </div>
        <div className="col-lg-2">
          <Select
            value={props.searchScheduled}
            options={scheduledOptions}
            onChange={props.setSearchScheduled}
            onClear={props.setSearchScheduled}
            placeholder={props.t('Scheduled')}
            isClearable
            t={props.t}
          />
        </div>
      </div>
    </>
  );
}

export const FilterTranslated = withNamespaces()(Filter);
export default Filter;
