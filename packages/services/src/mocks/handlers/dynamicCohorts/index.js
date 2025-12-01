import createSegment from './Segments/createSegment';
import updateSegment from './Segments/updateSegment';
import fetchSegment from './Segments/fetchSegment';
import searchAthletes from './Segments/searchAthletes';
import searchSegments from './Segments/searchSegments';
import deleteSegment from './Segments/deleteSegment';
import bulkUpdateAthleteLabels from './Labels/bulkUpdateAthleteLabels';
import deleteLabel from './Labels/deleteLabel';

export default [
  createSegment,
  updateSegment,
  fetchSegment,
  searchAthletes,
  searchSegments,
  deleteSegment,
  bulkUpdateAthleteLabels,
  deleteLabel,
];
