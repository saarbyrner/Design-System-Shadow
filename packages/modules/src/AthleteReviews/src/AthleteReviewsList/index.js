// @flow
import { useEffect, type ComponentType, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { useLazySearchReviewListQuery } from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';

import { AppStatus } from '@kitman/components';
import { Grid, Paper, Typography } from '@kitman/playbook/components';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { ActionsTranslated as Actions } from './Actions';
import { FiltersTranslated as Filters } from './Filters';
import { TableTranslated as Table } from './Table';
import { getAthleteId, getDefaultAthleteReviewsFilters } from '../shared/utils';

type Props = {};

const AthleteReviewsList = ({ t }: I18nProps<Props>) => {
  const pathname = useLocationPathname();
  const athleteId = getAthleteId(pathname);

  const [filters, setFilters] = useState(getDefaultAthleteReviewsFilters());
  const [
    fetchReviews,
    {
      isError: isReviewListError,
      isFetching: isReviewListFetching,
      currentData: {
        events: reviewListEvents = [],
        next_id: nextId = null,
      } = {},
    },
  ] = useLazySearchReviewListQuery();

  const getNextReviews = () => {
    if (nextId) {
      fetchReviews(
        {
          athleteId,
          filters: { ...filters },
          nextId,
        },
        true
      );
    }
  };

  useEffect(() => {
    fetchReviews({ athleteId, filters, nextId: null }, true);
  }, [filters]);

  if (isReviewListError) {
    return <AppStatus status="error" />;
  }

  return (
    <>
      <Typography variant="h5" mb={2} pl={1}>
        {t('Personal goals & reviews archive')}
      </Typography>
      <Paper sx={{ p: 3 }} pl={1}>
        <Grid component="header" container spacing={2}>
          <Grid xs item>
            <Filters filters={filters} setFilters={setFilters} />
          </Grid>
          <Grid xs item>
            <Actions athleteId={athleteId} />
          </Grid>
        </Grid>

        <Table
          athleteId={athleteId}
          reviewList={reviewListEvents}
          getNextReviews={getNextReviews}
          isReviewListFetching={isReviewListFetching}
        />
      </Paper>
    </>
  );
};

export const AthleteReviewsListTranslated: ComponentType<Props> =
  withNamespaces()(AthleteReviewsList);
export default AthleteReviewsList;
