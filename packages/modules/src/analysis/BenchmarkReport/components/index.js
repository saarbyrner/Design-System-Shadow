// @flow
import { withNamespaces } from 'react-i18next';
import { useState } from 'react';

import { colors } from '@kitman/common/src/variables';
import type { GetBenchmarkReportParams } from '@kitman/services/src/services/benchmarking/getBenchmarkingReport';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { DEFAULT_BIO_BAND_RANGE } from '@kitman/modules/src/analysis/BenchmarkReport/consts';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';

import { FiltersTranslated as Filters } from './Filters';
import { TableTranslated as Table } from './Table';

const styles = {
  benchmarkDashboard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '14px',
    margin: '14px',
  },
  benchmarkDashboardTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: colors.grey_300,
  },
};

export const defaultBenchmarkReportParams = {
  training_variable_ids: [],
  seasons: [],
  testing_window_ids: [],
  age_group_ids: [],
  bio_band_range: DEFAULT_BIO_BAND_RANGE,
  maturation_status_ids: [],
  position_ids: [],
  club_results: false,
  national_results: true,
  compare_to: {
    seasons: [],
    athlete_ids: [],
    training_variable_ids: [],
  },
};

const BenchmarkDashboard = (props: I18nProps<{}>) => {
  useBrowserTabTitle(props.t('League Benchmark Reporting'));

  const [benchmarkReportParams, setBenchmarkReportParams] =
    useState<GetBenchmarkReportParams>(defaultBenchmarkReportParams);
  // Passing filtersBenchmarkReportParams to the table as a param instead of
  // using filters directly on the table. This is to avoid having a request
  // sent every time the user changes a filter option.
  const updateBenchmarkReportParams = (
    filtersBenchmarkReportParams: GetBenchmarkReportParams
  ) => {
    setBenchmarkReportParams(filtersBenchmarkReportParams);
  };

  return (
    <div css={styles.benchmarkDashboard}>
      <h1 css={styles.benchmarkDashboardTitle}>{props.t('Benchmarking')}</h1>
      <Filters updateBenchmarkReportParams={updateBenchmarkReportParams} />
      <Table benchmarkReportParams={benchmarkReportParams} />
    </div>
  );
};

export const BenchmarkDashboardTranslated =
  withNamespaces()(BenchmarkDashboard);
export default BenchmarkDashboard;
