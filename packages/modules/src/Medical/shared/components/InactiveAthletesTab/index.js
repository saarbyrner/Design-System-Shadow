// @flow
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  InputTextField,
  TextButton,
  SlidingPanelResponsive,
  Select,
} from '@kitman/components';
import type { RequestStatus } from '@kitman/common/src/types';
import getInactiveAthletes from '@kitman/services/src/services/getInactiveAthletes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { InactiveAthletesGridTranslated as InactiveAthletesGrid } from './components/InactiveAthletesGrid';
import { filtersStyle, gridStyle, cellStyle } from '../CommonGridStyle';

type Props = {
  reloadData: boolean,
};

type InactiveAthlete = {
  id: string,
  fullname: string,
  avatar_url: string,
  squadIdList: [],
};

const InactiveAthletesTab = (props: I18nProps<Props>) => {
  const [inactiveAthletes, setInactiveAthletes] = useState<
    Array<InactiveAthlete>
  >([]);
  const [filteredInactiveAthletes, setFilteredInactiveAthletes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [squads, setSquads] = useState([]);
  const [squadIds, setSquadIds] = useState([]);

  useEffect(() => {
    if (!props.reloadData) {
      return;
    }
    getInactiveAthletes()
      .then((res) => {
        setRequestStatus('SUCCESS');
        if (res?.squads?.length) {
          // we display all athletes regardless of squad
          // athletes can belong to multiple squads
          // so we create a map of athletes using their id as key
          // to merge duplicates
          const athletes = {};
          res.squads.forEach((squad) => {
            if (squad?.athletes?.length) {
              // eslint-disable-next-line max-nested-callbacks
              squad.athletes.forEach((athlete) => {
                // Athlete iterated already; add current squadid to squadIdList too
                if (athletes[athlete.id]) {
                  const updatedSquadList = [
                    ...athletes[athlete.id].squadIdList,
                    squad.id,
                  ];

                  athletes[athlete.id].squadIdList = updatedSquadList;
                }
                // Athlete is in one squad (so far)
                else {
                  athletes[athlete.id] = {
                    ...athlete,
                    squadIdList: [squad.id],
                  };
                }
              });
            }
            return [];
          });
          setSquads(res.squads);

          // $FlowFixMe
          setInactiveAthletes(Object.values(athletes));
        }
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  }, [props.reloadData]);

  useEffect(() => {
    setFilteredInactiveAthletes(
      inactiveAthletes.filter((athlete) => {
        const query = searchQuery.trim().toLowerCase();
        const athleteName = athlete?.fullname?.toLowerCase();
        const hasQuery = query.length > 0;
        const hasSquadIds = squadIds.length > 0;
        const athleteInSquad = squadIds.some((id) =>
          athlete.squadIdList.includes(id)
        );

        if (hasQuery && hasSquadIds) {
          return athleteName.includes(query) && athleteInSquad;
        }

        if (hasQuery) {
          return athleteName.includes(query);
        }

        if (hasSquadIds) {
          return athleteInSquad;
        }

        return true;
      })
    );
  }, [inactiveAthletes, searchQuery, squadIds]);

  const onSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const onSquadsChange = useCallback((ids) => {
    setSquadIds(ids);
  }, []);

  const grid = useMemo(() => {
    return {
      rows: filteredInactiveAthletes,
    };
  }, [filteredInactiveAthletes]);

  const searchBar = (
    <div css={filtersStyle.filter}>
      <InputTextField
        kitmanDesignSystem
        onChange={onSearch}
        placeholder={props.t('Search athletes')}
        searchIcon
        value={searchQuery}
      />
    </div>
  );

  const squadFilter = (
    <div css={filtersStyle.filter}>
      <Select
        options={squads.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        onChange={onSquadsChange}
        value={squadIds}
        placeholder={props.t('Squads')}
        isDisabled={requestStatus === 'PENDING'}
        isMulti
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  return (
    <div css={gridStyle.wrapper}>
      <header css={cellStyle.header}>
        <div css={cellStyle.titleContainer}>
          <h3 css={[cellStyle.title, { marginBottom: 24 }]}>
            {props.t('Inactive athletes')}
          </h3>
        </div>
        <div
          css={[filtersStyle.wrapper, filtersStyle['filters--desktop']]}
          data-testid="DesktopFilters"
        >
          {searchBar}
          {squadFilter}
        </div>
        <div
          css={[filtersStyle.wrapper, filtersStyle['filters--mobile']]}
          data-testid="MobileFilters"
        >
          <TextButton
            text={props.t('Filters')}
            iconAfter="icon-filter"
            type="secondary"
            onClick={() => setShowFilterPanel(true)}
            kitmanDesignSystem
          />

          <SlidingPanelResponsive
            isOpen={showFilterPanel}
            title={props.t('Filters')}
            onClose={() => setShowFilterPanel(false)}
          >
            <div css={filtersStyle.filtersPanel}>
              {searchBar}
              {squadFilter}
            </div>
          </SlidingPanelResponsive>
        </div>
      </header>
      <InactiveAthletesGrid
        grid={grid}
        isLoading={requestStatus === 'PENDING'}
      />
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </div>
  );
};

export const InactiveAthletesTabTranslated: ComponentType<Props> =
  withNamespaces()(InactiveAthletesTab);
export default InactiveAthletesTab;
