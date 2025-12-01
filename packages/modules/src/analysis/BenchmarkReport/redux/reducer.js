// @flow
import { benchmarkReportApi } from './service';
import filtersReducer, {
  REDUCER_KEY as benchmarkReportKey,
} from './slices/filters';

export default {
  benchmarkReportApi: benchmarkReportApi.reducer,
  [benchmarkReportKey]: filtersReducer,
};
