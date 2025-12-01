// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';

const ListSegmentsApp = lazy(() =>
  import('@kitman/modules/src/DynamicCohorts/Segments/ListSegments')
);

const CreateEditSegmentApp = lazy(() =>
  import('@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment')
);

const ListLabelsApp = lazy(() =>
  import('@kitman/modules/src/DynamicCohorts/Labels/ListLabels')
);

export const renderSegmentsRoutes = () => {
  return (
    <>
      <Route path="administration/groups">
        <Route path="" element={<ListSegmentsApp />} />
        <Route
          path="new"
          element={<CreateEditSegmentApp mode={MODES.CREATE} />}
        />
        <Route
          path=":id/edit"
          element={<CreateEditSegmentApp mode={MODES.EDIT} />}
        />
      </Route>
    </>
  );
};

export const renderLabelsRoutes = () => {
  return (
    <Route path="administration/labels">
      <Route path="manage" element={<ListLabelsApp />} />
    </Route>
  );
};
