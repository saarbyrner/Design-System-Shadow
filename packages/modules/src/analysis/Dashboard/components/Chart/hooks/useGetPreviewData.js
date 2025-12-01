// @flow
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import { useGetDataQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import useShouldRefreshDashboard from '@kitman/modules/src/analysis/shared/hooks/useShouldRefreshDashboard';
import { isDashboardPivoted } from '@kitman/modules/src/analysis/Dashboard/utils';
import {
  updateLoaderLevel,
  refreshWidgetCache,
  updateCachedAt,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import {
  getWidgetRefreshCache,
  getLoaderLevelByWidgetId,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';

import type { ChartWidgetData, PivotData } from '../../ChartWidget/types';
import { formatGetDataParams } from '../../ChartBuilder/utils';

const useGetPreviewData = (
  isEmpty: boolean,
  widgetData: ChartWidgetData,
  pivotData: PivotData
) => {
  const dispatch = useDispatch();
  const widget = widgetData.widget;
  const refreshCache = useSelector(getWidgetRefreshCache(widgetData.id));

  const shouldRefreshDashboard = useShouldRefreshDashboard();

  const loaderLevel: number = useSelector(
    getLoaderLevelByWidgetId(widgetData.id)
  );

  const { data, isFetching, error, refetch, fulfilledTimeStamp } =
    useGetDataQuery(
      {
        ...formatGetDataParams(widget, pivotData),
        refresh_cache: (refreshCache || isDashboardPivoted()) ?? false,
      },
      {
        skip: isEmpty,
      }
    );

  const lastUpdatedTimeStamp = useRef<number>(0);

  useEffect(() => {
    if (!window.getFlag('rep-charts-v2-caching')) {
      return;
    }
    if (data && fulfilledTimeStamp > lastUpdatedTimeStamp.current) {
      lastUpdatedTimeStamp.current = fulfilledTimeStamp;
      dispatch(
        updateCachedAt({
          widgetId: widgetData.id,
          cachedAt: data?.map((i) => i?.metadata?.cached_at),
        })
      );
    }
  }, [data, fulfilledTimeStamp]);

  useEffect(() => {
    let timer;
    if (isFetching) {
      if (loaderLevel !== LOADING_LEVEL.LONG_LOAD) {
        dispatch(
          updateLoaderLevel({
            widgetId: widgetData.id,
            loaderLevel: LOADING_LEVEL.INITIAL_LOAD,
          })
        );
        if (window.getFlag('rep-charts-v2-caching')) {
          timer = setTimeout(() => {
            dispatch(
              updateLoaderLevel({
                widgetId: widgetData.id,
                loaderLevel: LOADING_LEVEL.LONG_LOAD,
              })
            );
          }, 4000);
        }
      }
    } else {
      dispatch(
        updateLoaderLevel({
          widgetId: widgetData.id,
          loaderLevel: LOADING_LEVEL.IDLE,
        })
      );
    }
    return () => clearTimeout(timer);
  }, [isFetching]);

  useEffect(() => {
    if (shouldRefreshDashboard) {
      refetch();
    }
  }, [shouldRefreshDashboard]);

  useEffect(() => {
    if (!refreshCache) {
      return;
    }
    refetch().finally(() => {
      dispatch(
        refreshWidgetCache({
          widgetId: widgetData.id,
          refreshCache: false,
        })
      );
    });
  }, [refreshCache]);

  return { data, isFetching, error, refetch };
};

export default useGetPreviewData;
