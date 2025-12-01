// @flow
import { useState, useEffect, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  useGetBenchmarkingClubsQuery,
  useGetBenchmarkingWindowsQuery,
  useGetBenchmarkingSeasonsQuery,
  useLazyGetBenchmarkingResultsQuery,
  useLazySubmitBenchmarkTestValidationsQuery,
  resetApiState,
} from '@kitman/modules/src/Benchmarking/shared/redux/benchmarkTestValidationApi';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import * as BenchmarkTypes from '@kitman/modules/src/Benchmarking/shared/types/index';
import { AppStatus } from '@kitman/components';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { resetSelections } from '@kitman/modules/src/Benchmarking/shared/redux/benchmarkTestValidationSlice';
import BenchmarkTestSelector from '@kitman/modules/src/Benchmarking/BenchmarkTestValidationApp/src/components/BenchmarkTestSelector';
import BenchmarkValidator from '@kitman/modules/src/Benchmarking/BenchmarkTestValidationApp/src/components/BenchmarkValidator';

import styles from './styles';

const BenchmarkingTestValidationApp = (props: I18nProps<{}>) => {
  const [clubs, setClubs] = useState<BenchmarkTypes.BenchmarkClubs>([]);
  const [windows, setWindows] = useState<BenchmarkTypes.BenchmarkWindows>([]);
  const [seasons, setSeasons] = useState<BenchmarkTypes.BenchmarkSeasons>([]);

  const dispatch = useDispatch();
  const { selections } = useSelector((state) => state.benchmarkTestValidation);

  const hasInvalidSelections: boolean = Object.values(selections).some(
    // $FlowIgnore value is always present at this point as it's set in initialState
    (selection) => selection.value === ''
  );

  const {
    data: clubsResponse,
    isLoading: isClubsLoading,
    isError: isClubsError,
  } = useGetBenchmarkingClubsQuery();
  const {
    data: windowsResponse,
    isLoading: isWindowsLoading,
    isError: isWindowsError,
  } = useGetBenchmarkingWindowsQuery();
  const {
    data: seasonsResponse,
    isLoading: isSeasonsLoading,
    isError: isSeasonsError,
  } = useGetBenchmarkingSeasonsQuery();
  const [
    getResultsData,
    { data: resultsData, isLoading: isResultsLoading, isError: isResultsError },
  ] = useLazyGetBenchmarkingResultsQuery();
  const [
    submitBenchmarkTestValidations,
    {
      isLoading: isSubmitValidationsLoading,
      isError: isSubmitValidationsError,
      isSuccess,
    },
  ] = useLazySubmitBenchmarkTestValidationsQuery();

  const isLoading =
    isClubsLoading || isWindowsLoading || isSeasonsLoading || isResultsLoading;
  const hasErrored =
    isClubsError || isWindowsError || isSeasonsError || isResultsError;

  const getConstructedTitle = (): string => {
    const formattedSeason = `${resultsData.season}/${resultsData.season + 1}`;

    return `${resultsData.organisation.name}, ${resultsData.testing_window.name} ${formattedSeason}`;
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        add({
          status: 'SUCCESS',
          title: props.t('Validation successful.'),
          id: 1,
        })
      );
      // Resets state in store
      dispatch(resetSelections());
      // Resets state in queries
      dispatch(resetApiState());
    }

    if (isSubmitValidationsError) {
      dispatch(
        add({
          status: 'ERROR',
          title: props.t('Failed to validate tests.'),
          id: 2,
        })
      );
    }
  }, [isSuccess, isSubmitValidationsError]);

  useEffect(() => {
    if (clubsResponse && windowsResponse && seasonsResponse) {
      setClubs(
        clubsResponse.map((club) => ({
          value: club.id,
          label: club.name,
        }))
      );
      setWindows(
        windowsResponse.map((testingWindow) => ({
          value: testingWindow.id,
          label: testingWindow.name,
        }))
      );
      setSeasons(
        seasonsResponse.map((season) => ({
          value: season,
          label: `${season.toString()}/${(season + 1).toString()}`,
        }))
      );
    }
  }, [clubsResponse, windowsResponse, seasonsResponse]);

  return (
    <>
      {isLoading || hasErrored ? (
        <AppStatus
          status={isLoading ? 'loading' : 'error'}
          message={isLoading && props.t('Loading...')}
        />
      ) : (
        <>
          <div css={styles.header}>
            <h1 className="kitmanHeading--L1">
              {props.t('Benchmark test validation')}
            </h1>
          </div>

          <div css={styles.contentContainer}>
            <BenchmarkTestSelector
              clubs={clubs}
              windows={windows}
              seasons={seasons}
              shouldDisable={hasInvalidSelections}
              fetchResults={getResultsData}
            />

            {!hasInvalidSelections && resultsData && (
              <BenchmarkValidator
                dataToValidate={resultsData}
                title={getConstructedTitle()}
                submitValidations={submitBenchmarkTestValidations}
                isLoading={isSubmitValidationsLoading}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

const BenchmarkingTestValidationAppTranslated: ComponentType<{}> =
  withNamespaces()(BenchmarkingTestValidationApp);
export default BenchmarkingTestValidationAppTranslated;
