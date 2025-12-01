// @flow
import moment from 'moment';

import { Button } from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { type CamelCasedImportsItem } from '@kitman/common/src/types/Imports';

import type { SubmissionsSubmitted, LastEdited } from '../types';
import styles from '../styles';

export const getColumns = () => [
  {
    field: `testName`,
    headerName: i18n.t('Test name'),
    flex: 1,
    renderCell: (params: { value: { url: string, name: string } }) => {
      return (
        <div css={styles.tableCells}>
          <Button sx={styles.link} href={params.value.url} variant="textOnly">
            {params.value.name}
          </Button>
        </div>
      );
    },
  },
  {
    field: `lastEdited`,
    headerName: i18n.t('Last edited'),
    flex: 1,
  },
  {
    field: `resultsSubmitted`,
    headerName: i18n.t('Results submitted'),
    flex: 1,
  },
];

export const getRows = (
  submissionsSubmitted: ?SubmissionsSubmitted,
  lastEdited: ?LastEdited
) => [
  {
    id: 'growthAndMaturationRow',
    testName: {
      name: i18n.t('Growth and maturation assessments'),
      url: '/growth_and_maturation/assessments',
    },
    lastEdited:
      lastEdited?.growth_and_maturation.date &&
      lastEdited.growth_and_maturation.by
        ? `${lastEdited.growth_and_maturation.date} by ${lastEdited.growth_and_maturation.by}`
        : '-',
    resultsSubmitted: submissionsSubmitted?.growth_and_maturation,
  },
  {
    id: 'baselineRow',
    testName: {
      name: i18n.t('Khamis-Roche baselines'),
      url: '/growth_and_maturation/assessments/baselines',
    },
    lastEdited:
      lastEdited?.baselines.date && lastEdited.baselines.by
        ? `${lastEdited.baselines.date} by ${lastEdited.baselines.by}`
        : '-',
    resultsSubmitted: submissionsSubmitted?.baselines,
  },
];

export const getLastEditedDate = (date: ?string) => {
  if (date) {
    return formatStandard({
      date: moment(date),
      showTime: true,
    });
  }
  return null;
};

export const getLastEditedSubmission = (
  submissionsArray: Array<CamelCasedImportsItem>
) => {
  return submissionsArray.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
};
