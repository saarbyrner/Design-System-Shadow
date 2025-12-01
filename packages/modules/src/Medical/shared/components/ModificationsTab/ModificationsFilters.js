// @flow
/* eslint-disable no-lone-blocks */
import type { ComponentType } from 'react';
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
  TooltipMenu,
} from '@kitman/components';
import { DateRangePicker } from '@kitman/playbook/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { ADD_MODIFICATION_BUTTON } from '@kitman/modules/src/Medical/shared/constants/elementTags';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import { convertDateRangeToTuple } from '@kitman/playbook/components/wrappers/CustomDateRangePicker/utils';
import type { NotesFilters, RequestStatus } from '../../types';
import style from '../styles/filters';

type Props = {
  filters: NotesFilters,
  onChangeFilter: (filters: NotesFilters) => void,
  showPlayerFilter: boolean,
  onClickAddModification: Function,
  squads: Array<Option>,
  authors: Array<Option>,
  squadAthletes: Array<Option>,
  hiddenFilters?: Array<string>,
  initialDataRequestStatus: RequestStatus,
};

const ModificationsFilters = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [isFilterPanelShown, setIsFilterPanelShown] = useState(false);

  const menuItems = (): Array<TooltipItem> => {
    if (props.hiddenFilters?.includes(ADD_MODIFICATION_BUTTON)) return [];
    return permissions.medical.modifications.canCreate
      ? [
          {
            description: props.t('Modification'),
            onClick: props.onClickAddModification,
          },
        ]
      : [];
  };

  const searchFilter = (
    <div css={style.filter}>
      <InputTextField
        placeholder={props.t('Search')}
        value={props.filters.content}
        onChange={({ target: { value } }) =>
          props.onChangeFilter({
            ...props.filters,
            content: value,
          })
        }
        searchIcon
        kitmanDesignSystem
      />
    </div>
  );
  const squadFilter = (
    <div css={style.filter}>
      <Select
        placeholder={props.t('Roster')}
        value={props.filters.squads}
        options={props.squads}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            squads: id,
          })
        }
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );
  const authorFilter = (
    <div css={style.filter}>
      <Select
        placeholder={props.t('Author')}
        value={props.filters.author}
        options={props.authors}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            author: id,
          })
        }
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );
  const playerFilter = (
    <div css={style.filter}>
      <Select
        placeholder={props.t('Player')}
        value={props.filters.athlete_id}
        options={props.squadAthletes}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            athlete_id: id,
          })
        }
        isClearable
        onClear={() =>
          props.onChangeFilter({
            ...props.filters,
            athlete_id: null,
          })
        }
        showAutoWidthDropdown
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
      />
    </div>
  );
  // These filters are provisionally hidden till the BE is prepared to populate these options
  {
    /* const availabilityFilter = (
     <div css={style.filter}>
     <Select
     placeholder={props.t('Availability')}
     options={[]}
     onChange={() => {}}
     isMulti
     showAutoWidthDropdown
     appendToBody
     inlineShownSelection
     />
     </div>
     );
     const statusFilter = (
     <div css={style.filter}>
     <Select
     placeholder={props.t('Status')}
     options={[]}
     onChange={() => {}}
     isMulti
     showAutoWidthDropdown
     appendToBody
     inlineShownSelection
     />
     </div>
     ); */
  }
  const dateFilter = (
    <div css={[style.filter, style['filter--daterange']]}>
      {!window.getFlag('pm-date-range-picker-custom') && (
        <DateRangePicker
          formatDensity="dense"
          localeText={{ start: props.t('From'), end: props.t('To') }}
          value={
            props.filters.date_range
              ? convertDateRangeToTuple(props.filters.date_range)
              : undefined
          }
          onChange={([startDate, endDate]) => {
            props.onChangeFilter({
              ...props.filters,
              date_range: {
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
              },
            });
          }}
        />
      )}

      {window.getFlag('pm-date-range-picker-custom') && (
        <CustomDateRangePicker
          variant="menuFilters"
          value={
            props.filters.date_range
              ? convertDateRangeToTuple(props.filters.date_range)
              : undefined
          }
          onChange={(daterange) => {
            if (props.onChangeFilter) {
              props.onChangeFilter({
                ...props.filters,
                date_range: daterange,
              });
            }
          }}
        />
      )}
    </div>
  );

  return (
    <header css={style.header}>
      <div css={style.titleContainer}>
        <h3 css={style.title}>{props.t('Modifications')}</h3>
        {menuItems().length > 0 && (
          <TooltipMenu
            appendToParent
            placement="bottom-end"
            offset={[0, 5]}
            menuItems={menuItems()}
            tooltipTriggerElement={
              <TextButton
                text={props.t('Add')}
                iconAfter="icon-chevron-down"
                type="primary"
                kitmanDesignSystem
              />
            }
            kitmanDesignSystem
          />
        )}
      </div>
      <div css={style.filters}>
        {searchFilter}
        {!props.hiddenFilters?.includes('squads') && squadFilter}
        {authorFilter}
        {props.showPlayerFilter && playerFilter}
        {/* availabilityFilter */}
        {/* statusFilter */}
        {dateFilter}
      </div>
      <div css={style.mobileFilters}>
        {dateFilter}
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
          <div css={style.mobileFiltersPanel}>
            {searchFilter}
            {!props.hiddenFilters?.includes('squads') && squadFilter}
            {authorFilter}
            {props.showPlayerFilter && playerFilter}
            {/* availabilityFilter */}
            {/* statusFilter */}
          </div>
        </SlidingPanelResponsive>
      </div>
    </header>
  );
};

export const ModificationsFiltersTranslated: ComponentType<Props> =
  withNamespaces()(ModificationsFilters);
export default ModificationsFilters;
