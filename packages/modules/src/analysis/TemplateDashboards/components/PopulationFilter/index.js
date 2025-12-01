// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { AthleteSelect, Select, SegmentedControl } from '@kitman/components';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import { colors } from '@kitman/common/src/variables';
import { Box } from '@kitman/playbook/components';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { isValidTimescope } from '@kitman/modules/src/analysis/TemplateDashboards/components/TimeScopeFilter/utils';
import useFilter from '@kitman/modules/src/analysis/TemplateDashboards/hooks/useFilter';
import {
  useGetPastAthletesQuery,
  useGetAllSquadAthletesQuery,
  useGetStaffUsersQuery,
} from '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards';
import {
  getSortedStaffUsers,
  isDevelopmentJourney,
  isGrowthAndMaturationReport,
  isStaffDevelopment,
} from '@kitman/modules/src/analysis/TemplateDashboards/utils/index';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { PastAthlete } from '@kitman/services/src/services/analysis/getPastAthletes';

function PopulationFilter(props: I18nProps<{}>) {
  const { filter, setFilter } = useFilter('population');
  const { filter: timescope } = useFilter('timescope');
  const { data, isFetching } = useGetAllSquadAthletesQuery(
    isGrowthAndMaturationReport() ? {} : { refreshCache: true }
  );

  const { data: permissions, isSuccess: getPermissionsSuccess } =
    useGetPermissionsQuery();

  const canPerformHistoricReporting =
    getPermissionsSuccess &&
    permissions.analysis.historicReporting.canReport &&
    window.getFlag('rep-historic-reporting-dev-journey');

  const allSquads = data?.squads.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
  const { data: staffUsers = [] } = useGetStaffUsersQuery({
    skip: isStaffDevelopment(),
  });
  const sortedStaffUsers = useMemo(
    () => getSortedStaffUsers(staffUsers),
    [staffUsers]
  );

  const {
    data: pastAthletesData = [],
    isFetching: isGetPastAthletesFetching,
  }: {
    data: Array<PastAthlete>,
    isFetching: boolean,
  } = useGetPastAthletesQuery(
    { time_scope: timescope },
    {
      // Don't request past athletes if don't need them or request would fail
      skip:
        !isDevelopmentJourney() ||
        !canPerformHistoricReporting ||
        !isValidTimescope(timescope),
    }
  );

  const onAthletes = (population) => {
    const updatedFilter = {
      ...population[0],
      context_squads: [],
    };
    if (population[0]) {
      setFilter(updatedFilter);
    } else {
      setFilter(EMPTY_SELECTION);
    }
  };

  const onSquad = (contextSquads) => {
    const updatedFilter = {
      ...filter,
      context_squads: contextSquads,
    };
    setFilter(updatedFilter);
  };

  const onStaff = (user) => {
    const updatedFilter = {
      ...filter,
      users: [user],
    };
    setFilter(updatedFilter);
  };

  const onSelectAllAthletes = (options) => {
    const athleteIds = options.map((option) => {
      return option.id;
    });

    setFilter({
      ...EMPTY_SELECTION,
      athletes: [...filter.athletes, ...athleteIds],
    });
  };

  const onClearAllAthletes = (options) => {
    const athleteIds = options.map((option) => {
      return option.id;
    });

    setFilter({
      ...EMPTY_SELECTION,
      athletes: filter.athletes.filter((id) => !athleteIds.includes(id)),
    });
  };

  const isAthleteOnly = isDevelopmentJourney();
  const extendedAthleteSelectProps = {
    isMulti: !isAthleteOnly,
    hiddenTypes:
      isAthleteOnly || isGrowthAndMaturationReport()
        ? ['position_groups', 'positions', 'squads']
        : [],
  };

  const renderAthleteSelect = () => (
    <AthleteSelect
      data-testid="PopulationFilter|AthleteSelect"
      label={props.t('Athletes')}
      value={[filter]}
      squadAthletes={data?.squads || []}
      onChange={onAthletes}
      isLoading={isFetching}
      onSelectAllClick={onSelectAllAthletes}
      onClearAllClick={onClearAllAthletes}
      clearSearchValueOnUnmount
      {...extendedAthleteSelectProps}
    />
  );

  return (
    <>
      {isStaffDevelopment() && (
        <Select
          label={props.t('Staff Member')}
          onChange={onStaff}
          value={filter.users?.[0] || null}
          options={sortedStaffUsers}
        />
      )}
      {!isStaffDevelopment() &&
        !isDevelopmentJourney() &&
        renderAthleteSelect()}
      {isDevelopmentJourney() && (
        <>
          {canPerformHistoricReporting ? (
            <>
              <Box mb={1} mt={1}>
                <SegmentedControl
                  buttons={[
                    {
                      name: props.t('Current Athletes'),
                      value: 'current_athletes',
                    },
                    { name: props.t('Past Athletes'), value: 'past_athletes' },
                  ]}
                  maxWidth={450}
                  onClickButton={(selected) =>
                    setFilter({
                      ...filter,
                      past_athletes: selected === 'past_athletes',
                    })
                  }
                  isDisabled={isGetPastAthletesFetching}
                  selectedButton={
                    filter?.past_athletes ? 'past_athletes' : 'current_athletes'
                  }
                  color={colors.grey_200}
                />
              </Box>
              {filter?.past_athletes ? (
                <Select
                  data-testid="PopulationFilter|PastAthletes"
                  label={props.t('Athletes')}
                  placeholder={props.t('Past Athletes')}
                  options={pastAthletesData.map(
                    ({ fullname, id }: PastAthlete) => ({
                      label: fullname,
                      value: id,
                    })
                  )}
                  onChange={(selectedPastAthleteId) => {
                    setFilter({
                      ...filter,
                      athletes: [selectedPastAthleteId],
                      context_squads: [],
                    });
                  }}
                  value={filter.athletes[0]}
                  isLoading={isGetPastAthletesFetching}
                  inlineShownSelectionMaxWidth={380}
                />
              ) : (
                renderAthleteSelect()
              )}
            </>
          ) : (
            renderAthleteSelect()
          )}
        </>
      )}
      {!isGrowthAndMaturationReport() && !isStaffDevelopment() && (
        <Select
          data-testid="PopulationFilter|Squad"
          label={props.t('Squad')}
          placeholder={props.t('All Squads')}
          options={allSquads || []}
          onChange={onSquad}
          value={filter.context_squads}
          isLoading={isFetching}
          inlineShownSelectionMaxWidth={380}
          inlineShownSelection
          isMulti
          appendToBody
        />
      )}
    </>
  );
}

export const PopulationFilterTranslated = withNamespaces()(PopulationFilter);
export default PopulationFilter;
