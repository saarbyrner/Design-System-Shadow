// @flow
import { type Node } from 'react';
import _isEqual from 'lodash/isEqual';

import { DEFAULT_BIO_BAND_RANGE } from '@kitman/modules/src/analysis/BenchmarkReport/consts';
import i18n from '@kitman/common/src/utils/i18n';
import { Tooltip, IconButton } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

export const getHasDefaultBioBandRange = (filter: Array<number>) =>
  _isEqual(filter, DEFAULT_BIO_BAND_RANGE);

export const renderToolTip = (columnTitle: string, tooltipText: string) => (
  <>
    <span
      // replicating columnHeaderTitle mui styling
      css={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontWeight: 500,
      }}
    >
      {columnTitle}
    </span>
    <Tooltip title={tooltipText} arrow>
      <IconButton>
        <KitmanIcon name={KITMAN_ICON_NAMES.InfoOutlined} fontSize="small" />
      </IconButton>
    </Tooltip>
  </>
);

export const getColumnsData = (): (Array<{
  field: string,
  headerName: string,
  width?: number,
  renderHeader?: () => Node,
}>) => [
  {
    field: 'athlete_name',
    headerName: i18n.t('Athlete name'),
    width: 180,
  },
  {
    field: 'age_group',
    headerName: i18n.t('Age group'),
    sortComparator: (a, b) => {
      const getNumericAgeGroup = (group: string) =>
        Number(
          group
            .split('')
            .filter((char) => !Number.isNaN(Number.parseInt(char, 10)))
            .join('')
        );
      return getNumericAgeGroup(a) - getNumericAgeGroup(b);
    },
    width: 102,
  },
  {
    field: 'test',
    headerName: i18n.t('Test'),
    width: 180,
  },
  {
    field: 'label',
    headerName: i18n.t('Results'),
  },
  {
    field: 'athletes',
    headerName: `#${i18n.t('Athletes')}`,
  },
  {
    field: 'results',
    headerName: `#${i18n.t('Results')}`,
  },
  {
    field: 'mean',
    headerName: i18n.t('Mean'),
  },
  {
    field: 'min',
    headerName: i18n.t('Minimum'),
  },
  {
    field: 'max',
    headerName: i18n.t('Maximum'),
  },
  {
    field: 'standard_deviation',
    headerName: i18n.t('Standard deviation'),
    width: 150,
  },
  {
    field: 'age_group_on_day_of_test',
    headerName: i18n.t('Age group (at most recent test date)'),
    width: 300,
    renderHeader: () =>
      renderToolTip(
        i18n.t('Age group (at most recent test date)'),
        i18n.t(
          'Most recent test athlete had within the selected season(s) and test windows'
        )
      ),
  },
  {
    field: 'most_recent_test_result',
    headerName: i18n.t('Most recent result'),
    width: 200,
    renderHeader: () =>
      renderToolTip(
        i18n.t('Most recent result'),
        i18n.t(
          'Most recent result athlete had within the selected season(s) and test windows'
        )
      ),
  },
  {
    field: 'z_score_club',
    headerName: i18n.t('Club z-score'),
    width: 150,
    renderHeader: () =>
      renderToolTip(
        i18n.t('Club z-score'),
        i18n.t(
          'Club z-score is calculated based on the Mean of age group that matches the athletes age group at the time of the test'
        )
      ),
  },
  {
    field: 'z_score_national',
    headerName: i18n.t('National z-score'),
    width: 180,
    renderHeader: () =>
      renderToolTip(
        i18n.t('National z-score'),
        i18n.t(
          'National z-score is calculated based on the Mean of age group that matches the athletes age group at the time of the test'
        )
      ),
  },
];
