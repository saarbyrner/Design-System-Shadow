// @flow
import AssessmentResultsTable from '@kitman/modules/src/GrowthAndMaturation/src/components/Assessments';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

const LeagueBenchmarkingApp = () => (
  <AssessmentResultsTable type={IMPORT_TYPES.LeagueBenchmarking} />
);

export default LeagueBenchmarkingApp;
