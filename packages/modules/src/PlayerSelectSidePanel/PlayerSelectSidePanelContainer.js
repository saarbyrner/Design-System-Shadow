// @flow
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { AppStatus, InputText, Select, SlidingPanel } from '@kitman/components';
import type { Option, Options } from '@kitman/components/src/Select';
import type { Squad } from '@kitman/common/src/types/__common';
import style from '@kitman/common/src/styles/LeftSidePanelStyle.style';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  setPersistedPlayerSelectorFilters,
  getPersistedPlayerSelectorFilters,
} from './shared/utils';
import {
  onUpdateFilters,
  onClosePlayerSelect,
  onUpdateGrouping,
} from './redux/slices/playerSelectSlice';
import PaginatedList from './components/PaginatedList/PaginatedList';
import BackButton from './components/BackButton/BackButton';

import { useGetSquadAthleteSearchQuery } from './services/api/playerSelectApi';

import type {
  PlayerSelectGroups,
  PlayerSelectFilters,
} from './redux/slices/playerSelectSlice';

type Props = {
  isOpen: boolean,
  currentSquad: ?Squad,
  width?: number | string,
  left?: number,
};

const PlayerSelectSidePanelContainer = (props: Props) => {
  const { trackEvent } = useEventTracking();
  const dispatch = useDispatch();
  const { isPlayerSelectOpen, filters, grouping } = useSelector(
    (state) => state.playerSelectSlice
  );

  // created a 'dormant' state because there's logic that needs to run
  // only once, however that one time can only be once the RTK Query
  // comes back with data. I will look into making this cleaner
  // by not mixing strings with Objects however for expediency this works
  const [selectedParentOption, setSelectedParentOption] = useState<
    Option | null | 'dormant'
  >('dormant');

  const [searchValue, setSearchValue] = useState<string>('');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  const mapFiltersForPayload = (
    newFilters: Array<PlayerSelectFilters>
  ): Object => {
    const filtersObj = {
      injured: false,
      not_injured: false,
    };

    if (newFilters.length > 0) {
      newFilters.forEach((selectedFilter) => {
        filtersObj[selectedFilter] = true;
      });
    }
    return filtersObj;
  };

  const setFilters = (updatedFilters: Array<PlayerSelectFilters>): void => {
    dispatch(onUpdateFilters(updatedFilters));

    setPersistedPlayerSelectorFilters({
      scopeToDropdownType: 'PLAYER_SELECTOR|FILTER',
      fields: ['injured', 'not_injured'],
      newValues: mapFiltersForPayload(updatedFilters),
    });
  };

  const mapGroupingForPayload = (
    newGroups: Array<PlayerSelectGroups>
  ): Object => {
    const groupingObj = {
      position: false,
    };

    if (newGroups.length > 0) {
      newGroups.forEach((selectedGroup) => {
        groupingObj[selectedGroup] = true;
      });
    }
    return groupingObj;
  };
  const setGrouping = (updatedGrouping: Array<PlayerSelectGroups>): void => {
    dispatch(onUpdateGrouping(updatedGrouping));

    setPersistedPlayerSelectorFilters({
      scopeToDropdownType: 'PLAYER_SELECTOR|GROUPING',
      fields: ['position'],
      newValues: mapGroupingForPayload(updatedGrouping),
    });
  };

  const {
    data: squadList,
    isError,
    isFetching,
  } = useGetSquadAthleteSearchQuery(
    {
      squad_id: selectedParentOption?.value || props.currentSquad?.id,
      search_terms: searchValue,
      include_issue_occurrences: false,
      filters: mapFiltersForPayload(filters),
      grouping: mapGroupingForPayload(grouping),
    },
    {
      skip: !window.getFlag('player-selector-side-nav') || !isPlayerSelectOpen,
    }
  );

  const squadListToOptions = squadList?.available_squads?.map(
    ({ name, id }) => {
      return {
        label: name,
        value: id,
        parent: true,
        // eslint-disable-next-line no-nested-ternary
        options: squadList?.selected_squads[0]?.athletes
          ? squadList.selected_squads[0].athletes.map((athlete) => {
              return {
                label: athlete.fullname,
                value: athlete.id,
                ...athlete,
              };
            })
          : squadList?.selected_squads[0]?.positions
          ? squadList.selected_squads[0].positions
              .filter((position) => position && position.athletes?.length > 0)
              .map((position) => {
                return {
                  label: position.name,
                  value: position.id,
                  options: position.athletes.map((athlete) => {
                    return {
                      label: athlete.fullname,
                      value: athlete.id,
                      ...athlete,
                    };
                  }),
                  ...position,
                };
              })
          : [],
      };
    }
  );

  const [filteredOptions, setFilteredOptions] = useState<
    Array<Option> | Array<Options> | null
  >(squadListToOptions);

  useEffect(() => {
    if (
      isPlayerSelectOpen &&
      props.currentSquad &&
      squadListToOptions &&
      // only want function to run on first open of panel
      // otherwise will always update
      // "selectedParentOption" as props.currentSquad
      selectedParentOption === 'dormant'
    ) {
      const updatedParentOption = squadListToOptions.find(
        (parentOption) => parentOption.value === props.currentSquad?.id
      );
      setSelectedParentOption(() => updatedParentOption);
    }
    if (
      selectedParentOption &&
      selectedParentOption !== 'dormant' &&
      selectedParentOption.options
    ) {
      // need to update the parent option to reflect the new list
      // otherwise if already on a parent level the list doesn't update
      const updatedParentOption = squadListToOptions.find(
        (parentOption) => parentOption.value === selectedParentOption.value
      );

      if (Array.isArray(selectedParentOption.options)) {
        setFilteredOptions(updatedParentOption.options);
      }
    } else if (squadList) {
      setFilteredOptions(squadListToOptions);
    }
  }, [isPlayerSelectOpen, selectedParentOption, squadList]);

  useEffect(() => {
    if (isPlayerSelectOpen) {
      const persistedFilters = getPersistedPlayerSelectorFilters({
        defaultValues: filters,
        fields: ['injured', 'not_injured'],
        scopeToDropdownType: 'PLAYER_SELECTOR|FILTER',
      });

      const persistedGrouping = getPersistedPlayerSelectorFilters({
        defaultValues: filters,
        fields: ['position'],
        scopeToDropdownType: 'PLAYER_SELECTOR|GROUPING',
      });

      const filteredAndMappedFilters: Array<PlayerSelectFilters> =
        Object.entries(persistedFilters)
          .filter(([key, value]) => key && value)
          // $FlowIgnore only possible keys here are set above
          .map(([key]) => key);
      const filteredAndMappedGrouping: Array<PlayerSelectGroups> =
        Object.entries(persistedGrouping)
          .filter(([key, value]) => key && value)
          // $FlowIgnore only possible keys here are set above
          .map(([key]) => key);

      setFilters(filteredAndMappedFilters);
      setGrouping(filteredAndMappedGrouping);
    }
  }, [isPlayerSelectOpen]);

  const handleSearch = (val) => setSearchValue(val);
  const debounceHandleSearch = debounce(handleSearch, 400);

  const getHeaderContent = () => {
    return (
      <>
        <div css={style.headerContainer}>
          <h4 css={style.headerText}>Select player</h4>
          <div css={style.headerActionButton}>
            <button
              type="button"
              onClick={() => dispatch(onClosePlayerSelect())}
              css={style.headerActionButton}
              className="icon-close"
            />
          </div>
        </div>
      </>
    );
  };
  const getContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isFetching) {
      return <AppStatus status="loading" isEmbed message="Loading" />;
    }
    if (squadList) {
      return (
        <div css={style.squadList}>
          <PaginatedList
            selectedParentOption={selectedParentOption}
            setSelectedParentOption={setSelectedParentOption}
            filteredOptions={filteredOptions}
          />
        </div>
      );
    }
    return null;
  };
  const getFilterContent = () => {
    return (
      <>
        {isSearchVisible && (
          <div css={style.searchFilter}>
            <InputText
              kitmanDesignSystem
              onValidation={({ value }) => {
                debounceHandleSearch(value);
              }}
              placeholder="Search"
              searchIcon
              value={searchValue}
              autoFocus
            />
          </div>
        )}
        <div css={style.filterContainerWithSearchBar}>
          <div css={style.iconSearchButton}>
            <button
              type="button"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              css={style.iconSearchButton}
              className="icon-search"
            />
          </div>
          <div css={style.filters}>
            <Select
              appendToBody
              options={[
                { value: 'injured', label: 'Open injury/illness' },
                { value: 'not_injured', label: 'No open injury/illness' },
              ]}
              onChange={(selectedItems) => {
                trackEvent(
                  performanceMedicineEventNames.playerListFilterUpdated
                );
                setFilters(selectedItems);
              }}
              placeholder="Filter"
              value={filters}
              isMulti
              showAutoWidthDropdown
              inlineShownSelection
            />
          </div>
          <div css={style.filters}>
            <Select
              appendToBody
              options={[{ value: 'position', label: 'Position' }]}
              onChange={(selectedItems) => setGrouping(selectedItems)}
              placeholder="Group"
              value={grouping}
              isMulti
              showAutoWidthDropdown
              inlineShownSelection
            />
          </div>
        </div>
        <div className="kitmanReactSelect__backButtonContainer">
          {selectedParentOption && (
            <BackButton
              setSelectedParentOption={setSelectedParentOption}
              label="Rosters"
            />
          )}
          {selectedParentOption && typeof selectedParentOption !== 'string' && (
            <div css={style.squadLabel}>{selectedParentOption.label}</div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="playerSelectorSidePanel">
      <SlidingPanel
        hideHeader
        title="Select player"
        align="left"
        leftMargin={props.left}
        removeFixedLeftMargin={typeof props.left !== 'number'}
        cssTop={50}
        isOpen={props.isOpen}
        kitmanDesignSystem
        width={props.width || 269}
        styles={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {getHeaderContent()}
        {getFilterContent()}
        {getContent()}
      </SlidingPanel>
    </div>
  );
};

export default PlayerSelectSidePanelContainer;
