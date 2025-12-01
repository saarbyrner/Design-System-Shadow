import {
  data as getBenchmarkingClubsData,
  handler as getBenchmarkingClubsHandler,
} from '@kitman/services/src/mocks/handlers/benchmarking/getBenchmarkingClubs';
import {
  data as getBenchmarkingSeasonsData,
  handler as getBenchmarkingSeasonsHandler,
} from '@kitman/services/src/mocks/handlers/benchmarking/getBenchmarkingSeasons';
import {
  data as getBenchmarkingWindowsData,
  handler as getBenchmarkingWindowsHandler,
} from '@kitman/services/src/mocks/handlers/benchmarking/getBenchmarkingWindows';
import { data as getBenchmarkingResultsData } from '@kitman/services/src/mocks/handlers/benchmarking/getBenchmarkingResults';
import {
  data as getBenchmarkingAgeGroupsData,
  handler as getBenchmarkingAgeGroupHandler,
} from '@kitman/services/src/mocks/handlers/benchmarking/getBenchmarkAgeGroups';
import {
  data as getBenchmarkingMaturationStatusesData,
  handler as getBenchmarkingMaturationStatusesHandler,
} from '@kitman/services/src/mocks/handlers/benchmarking/getBenchmarkMaturationStatuses';
import {
  data as getBenchmarkingReportData,
  dataClub as getBenchmarkingReportDataClub,
  dataNational as getBenchmarkingReportDataNational,
} from '@kitman/services/src/mocks/handlers/benchmarking/getBenchmarkingReport';
import { data as submitBenchmarkTestValidationsData } from '@kitman/services/src/mocks/handlers/benchmarking/submitBenchmarkTestValidations';
import { handler as getBenchmarkingTestsHandler } from '@kitman/services/src/mocks/handlers/benchmarking/getBenchmarkingTests';

const benchmarkingHandlers = [
  getBenchmarkingClubsHandler,
  getBenchmarkingSeasonsHandler,
  getBenchmarkingWindowsHandler,
  getBenchmarkingAgeGroupHandler,
  getBenchmarkingMaturationStatusesHandler,
  getBenchmarkingTestsHandler,
];

export {
  getBenchmarkingClubsData,
  getBenchmarkingSeasonsData,
  getBenchmarkingWindowsData,
  getBenchmarkingResultsData,
  getBenchmarkingAgeGroupsData,
  getBenchmarkingMaturationStatusesData,
  getBenchmarkingReportData,
  getBenchmarkingReportDataClub,
  getBenchmarkingReportDataNational,
  submitBenchmarkTestValidationsData,
  benchmarkingHandlers,
};
