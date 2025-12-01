// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import {
  useFetchDisciplineSuspensionIssueQuery,
  useFetchDisciplineCompetitionsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import { getProfile } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors';
import Grid from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/Grid';
import GridContainer from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridContainer';
import LimitedChips from '@kitman/modules/src/LeagueOperations/shared/components/LimitedChips';
import { Box, Tooltip } from '@kitman/playbook/components';
import { OppositionList } from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/SuspensionNotice';
import type { SuspensionStatus } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import { transformSuspensionRows, onBuildActions } from './utils';

type CurrentSuspensionParam = {
  profileId: ?number,
  suspensionStatus: ?SuspensionStatus,
};

const TabSuspensionProfile = (props: CurrentSuspensionParam) => {
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const dispatch = useDispatch();
  const profile = useSelector(getProfile);
  const { isLeague } = useLeagueOperations();
  const { data, isLoading, isFetching } =
    useFetchDisciplineSuspensionIssueQuery({
      userId: props.profileId,
      suspensionStatus: props.suspensionStatus,
      page,
      per_page: pageSize,
    });

  const { data: disciplineCompetitionsData = [] } =
    useFetchDisciplineCompetitionsQuery();

  const users = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 0;

  const actionColumns =
    props.suspensionStatus === 'current' ||
    (isLeague && props.suspensionStatus === 'past')
      ? [
          {
            field: 'actions',
            headerName: '',
            flex: 0,
            sortable: false,
            filterable: false,
            align: 'right',
            minWidth: 80,
            renderCell: (row) => {
              return onBuildActions({
                row: row.row,
                openPanel: true,
                dispatch,
                profile,
              });
            },
          },
        ]
      : [];

  const columns = [
    {
      field: 'duration',
      headerName: i18n.t('Duration'),
      flex: 1,
      sortable: false,
      minWidth: 250,
      renderCell: (params) => {
        const getOppositionTeamToolTip =
          params.row.kind === 'number_of_games' &&
          params.row.game_events.length > 0;

        const renderTitle =
          (getOppositionTeamToolTip && (
            <OppositionList
              organisations={profile.organisations}
              games={params.row.game_events || []}
            />
          )) ||
          params.value;

        return (
          <Tooltip title={renderTitle}>
            <Box
              sx={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {params.value}
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: 'reason',
      headerName: i18n.t('Reason'),
      flex: 1,
      sortable: false,
      minWidth: 200,
    },
    {
      field: 'competition',
      headerName: i18n.t('Competition'),
      flex: 1,
      sortable: false,
      minWidth: 200,
      renderCell: (row) => <LimitedChips items={row.value} />,
    },
    {
      field: 'notes',
      headerName: i18n.t('Notes'),
      flex: 2,
      sortable: false,
      minWidth: 300,
    },
    ...actionColumns,
  ];

  const rows = transformSuspensionRows(users, disciplineCompetitionsData);

  return (
    <GridContainer>
      {[
        <Grid
          key="grid"
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          totalPages={totalPages}
          page={page}
          setPage={(pageNumber) => setPage(pageNumber)}
          isFetching={isFetching}
        />,
      ]}
    </GridContainer>
  );
};

export default TabSuspensionProfile;
