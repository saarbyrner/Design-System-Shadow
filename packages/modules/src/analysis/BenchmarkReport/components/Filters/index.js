// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useState } from 'react';

import { Button } from '@kitman/playbook/components';
import type { GetBenchmarkReportParams } from '@kitman/services/src/services/benchmarking/getBenchmarkingReport';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { defaultBenchmarkReportParams } from '@kitman/modules/src/analysis/BenchmarkReport/components';
import {
  BIO_BAND_RANGE,
  TRAINING_VARIABLES_IDS,
  TESTING_WINDOWS_IDS,
  SEASONS,
  AGE_GROUPS_IDS,
  MATURATION_STATUS_IDS,
  CLUB_RESULTS,
  NATIONAL_RESULTS,
  POSITIONS_IDS,
} from '@kitman/modules/src/analysis/BenchmarkReport/consts';
import { getHasDefaultBioBandRange } from '@kitman/modules/src/analysis/BenchmarkReport/utils';
import { getFilterStyles } from '@kitman/modules/src/analysis/BenchmarkReport/components/Filters/styles';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { useGenerateResultsEvent } from '@kitman/common/src/utils/TrackingData/src/data/leagueBenchmarkReporting';

import useFilter from '../../hooks/useFilter';
import { type FilterValidations } from '../../types';
import {
  AgeGroups,
  Athletes,
  BenchmarkTests,
  Clubs,
  Seasons,
  TestingWindows,
  BioBand,
  MaturationStatuses,
  Positions,
  ClearCompareTo,
} from './components';
import styles from './styles';

type Props = {
  updateBenchmarkReportParams: Function,
};

const Filters = (props: I18nProps<Props>) => {
  const { organisation } = useOrganisation();
  // This needs to be revisited at a later date, as this is both unclear what the attribute is doing
  // and not scalable. A proper method for identifying a clubs category will be agreed with BE.
  const isCat1Club = !!organisation?.benchmark_reporting;
  const COMPARE_TO = 'compare_to';

  const { trackEvent } = useEventTracking();

  // If isCat1Club is truthy, we add an additional filter column
  const defaultWidthCalc = 4;
  const firstRowWidthCalc = isCat1Club ? 3 : defaultWidthCalc;

  const [hasGeneratedResults, setHasGeneratedResults] = useState(false);

  const benchmarkTestsFilter = useFilter(TRAINING_VARIABLES_IDS);
  const seasonsFilter = useFilter(SEASONS);
  const testingWindowsFilter = useFilter(TESTING_WINDOWS_IDS);
  const ageGroupsFilter = useFilter(AGE_GROUPS_IDS);
  const bioBandFilter = useFilter(BIO_BAND_RANGE);
  const maturationStatusesFilter = useFilter(MATURATION_STATUS_IDS);
  const positionGroupsFilter = useFilter(POSITIONS_IDS);
  const clubResultsFilter = useFilter(CLUB_RESULTS);
  const nationalResultsFilter = useFilter(NATIONAL_RESULTS);
  const compareToFilter = useFilter(COMPARE_TO);

  const benchmarkReportParams: GetBenchmarkReportParams = {
    training_variable_ids: benchmarkTestsFilter.filter,
    seasons: seasonsFilter.filter,
    testing_window_ids: testingWindowsFilter.filter,
    age_group_ids: window.getFlag('bm-testing-limit-season-and-age-filter')
      ? [ageGroupsFilter.filter]
      : ageGroupsFilter.filter,
    bio_band_range: bioBandFilter.filter,
    maturation_status_ids: maturationStatusesFilter.filter,
    position_ids: positionGroupsFilter.filter,
    club_results: clubResultsFilter.filter,
    national_results: nationalResultsFilter.filter,
    compare_to: {
      ...compareToFilter.filter,
    },
  };

  const getAgeGroupsValidationMessage = () => {
    if (isCat1Club && compareToFilter.filter.athlete_ids.length === 0) {
      if (
        window.getFlag('growth-and-maturation-area') &&
        getHasDefaultBioBandRange(bioBandFilter.filter)
      ) {
        return props.t(
          'An age is required if the "Any" bio-band option is selected and no individual athletes are selected'
        );
      }
      return props.t(
        'An age is required if no individual athletes are selected'
      );
    }

    return props.t(
      'An age is required if the "Any" bio-band option is selected'
    );
  };

  const areAgeGroupsValid = window.getFlag('bm-testing-limit-season-and-age-filter')
    ? ageGroupsFilter.filter ||
      (!ageGroupsFilter.filter &&
        !getHasDefaultBioBandRange(bioBandFilter.filter)) ||
      compareToFilter.filter.athlete_ids.length > 0
    : ageGroupsFilter.filter?.length > 0 ||
      (ageGroupsFilter.filter?.length === 0 &&
        !getHasDefaultBioBandRange(bioBandFilter.filter)) ||
      compareToFilter.filter.athlete_ids.length > 0;

  const getValidations = (): FilterValidations => ({
    [TRAINING_VARIABLES_IDS]: {
      isValid: benchmarkTestsFilter.filter.length > 0,
      errorMessage: props.t('At least 1 test is required'),
    },
    [SEASONS]: {
      isValid:
        seasonsFilter.filter.length > 0 ||
        compareToFilter.filter.athlete_ids.length > 0,
      errorMessage: props.t('At least 1 season is required'),
    },
    [TESTING_WINDOWS_IDS]: {
      isValid:
        testingWindowsFilter.filter.length > 0 ||
        compareToFilter.filter.athlete_ids.length > 0,
      errorMessage: props.t('At least 1 testing window is required'),
    },
    [AGE_GROUPS_IDS]: {
      isValid: areAgeGroupsValid,
      errorMessage: getAgeGroupsValidationMessage(),
    },
    ...(isCat1Club && {
      [CLUB_RESULTS]: {
        isValid:
          clubResultsFilter.filter ||
          nationalResultsFilter.filter ||
          compareToFilter.filter.athlete_ids.length > 0,
        errorMessage: props.t(
          'At least 1 result type is required if no individual athletes are selected'
        ),
      },
      [`${COMPARE_TO}${SEASONS}`]: {
        isValid:
          compareToFilter.filter.athlete_ids.length > 0
            ? compareToFilter.filter.seasons.length > 0
            : true,
        errorMessage: props.t('At least 1 season is required'),
      },
      [`${COMPARE_TO}${TESTING_WINDOWS_IDS}`]: {
        isValid:
          compareToFilter.filter.athlete_ids.length > 0
            ? compareToFilter.filter.testing_window_ids.length > 0
            : true,
        errorMessage: props.t('At least 1 testing window is required'),
      },
    }),
  });

  const validations = getValidations();

  const getIsFilterValid = (filterKey: string): boolean =>
    hasGeneratedResults ? validations[filterKey].isValid : true;

  const getIsFormValid = (): boolean =>
    // $FlowIgnore[incompatible-use] validation will always be made up of isValid & errorMessage object
    Object.values(validations).every((validation) => validation.isValid);

  const handleClearFilters = () => {
    // clearFilter only needs to be called on one of the filters as it updates the state of all filters
    benchmarkTestsFilter.clearFilters();
    props.updateBenchmarkReportParams(defaultBenchmarkReportParams);
    setHasGeneratedResults(false);
  };

  const generateResultsEvent = useGenerateResultsEvent({
    ...benchmarkReportParams,
    IsCat1: isCat1Club,
  });
  const handleGenerateResults = () => {
    setHasGeneratedResults(true);
    // only actually make request if all filters are valid
    if (getIsFormValid()) {
      props.updateBenchmarkReportParams(benchmarkReportParams);
      trackEvent(
        'Analysis — League Benchmark Reporting — Generate results',
        generateResultsEvent
      );
    }
  };

  return (
    <div css={styles.filtersRoot}>
      <div css={styles.row}>
        <div css={styles.testPanel}>
          <p css={styles.heading}>{props.t('Select tests and time range')}</p>
          <div css={styles.row}>
            <BenchmarkTests
              widthCalc={firstRowWidthCalc}
              isValid={getIsFilterValid(TRAINING_VARIABLES_IDS)}
              errorMessage={validations[TRAINING_VARIABLES_IDS].errorMessage}
            />
            <Seasons
              widthCalc={firstRowWidthCalc}
              isValid={getIsFilterValid(SEASONS)}
              errorMessage={validations[SEASONS].errorMessage}
            />
            <TestingWindows
              widthCalc={firstRowWidthCalc}
              isValid={getIsFilterValid(TESTING_WINDOWS_IDS)}
              errorMessage={validations[TESTING_WINDOWS_IDS].errorMessage}
            />
          </div>
        </div>
        {isCat1Club && (
          <span css={{ ...getFilterStyles(defaultWidthCalc), display: 'flex' }}>
            <span css={styles.verticalDivider} />
            <div css={styles.orgPanel}>
              <div>
                <p css={styles.heading}>{props.t('Show results for...')}</p>
                <Clubs
                  isValid={getIsFilterValid(CLUB_RESULTS)}
                  errorMessage={validations[CLUB_RESULTS]?.errorMessage}
                />
              </div>
            </div>
          </span>
        )}
      </div>
      <span css={styles.divider} />
      <div>
        <p css={styles.heading}>{props.t('Select group demographics')}</p>
        <div css={styles.row}>
          <AgeGroups
            widthCalc={defaultWidthCalc}
            isValid={getIsFilterValid(AGE_GROUPS_IDS)}
            errorMessage={validations[AGE_GROUPS_IDS].errorMessage}
          />
          {window.getFlag('growth-and-maturation-area') && (
            <>
              <BioBand widthCalc={defaultWidthCalc} />
              <MaturationStatuses widthCalc={defaultWidthCalc} />
            </>
          )}
          <Positions widthCalc={defaultWidthCalc} />
        </div>
      </div>
      <span css={styles.divider} />
      {isCat1Club && (
        <>
          <p css={styles.heading}>
            {props.t('Compare against my individual athletes')}
          </p>
          <div css={styles.row}>
            <Athletes widthCalc={defaultWidthCalc} />
            <Seasons
              isValid={getIsFilterValid(`${COMPARE_TO}${SEASONS}`)}
              errorMessage={
                validations[`${COMPARE_TO}${SEASONS}`]?.errorMessage
              }
              widthCalc={defaultWidthCalc}
              isComparison
            />
            <TestingWindows
              widthCalc={defaultWidthCalc}
              isComparison
              isValid={getIsFilterValid(`${COMPARE_TO}${TESTING_WINDOWS_IDS}`)}
              errorMessage={
                validations[`${COMPARE_TO}${TESTING_WINDOWS_IDS}`]?.errorMessage
              }
            />
            <ClearCompareTo widthCalc={defaultWidthCalc} />
          </div>
          <span css={styles.divider} />
        </>
      )}
      <div css={styles.filtersButtonsPanel}>
        <div css={styles.filtersButtons}>
          <Button color="secondary" onClick={handleClearFilters}>
            {props.t('Clear All')}
          </Button>
          <Button
            color="primary"
            onClick={handleGenerateResults}
            disabled={hasGeneratedResults ? !getIsFormValid() : false}
          >
            {props.t('Generate results')}
          </Button>
        </div>
      </div>
    </div>
  );
};
export const FiltersTranslated: ComponentType<Props> =
  withNamespaces()(Filters);
export default Filters;
