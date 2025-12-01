// @flow
import type { Node } from 'react';
import { Box, Typography } from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import type { Squad } from '@kitman/modules/src/LeagueOperations/shared/types/common';

import styles from './styles';

const getSquadStatics = ({ squad }: { squad: Squad }): Node => {
  const statistics = [
    {
      title: i18n.t('Club'),
      value: squad.organisations[0]?.name,
    },

    {
      title: i18n.t('Country'),
      value: squad.address?.country.name || '-',
    },

    {
      title: i18n.t('Staff'),
      value: squad.total_coaches,
    },
    {
      title: i18n.t('Players'),
      value: squad.total_athletes,
    },
  ];

  const renderStatistics = (): Node => {
    return (
      <Box sx={styles.statistics}>
        {statistics.map((stat) => {
          return (
            <Box css={styles.statistic} key={stat.title}>
              <Typography variant="h6" css={styles.statisticTitle}>
                {stat.title}
              </Typography>
              <Typography variant="p" css={styles.value}>
                {stat.value}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  return renderStatistics();
};

export default getSquadStatics;
