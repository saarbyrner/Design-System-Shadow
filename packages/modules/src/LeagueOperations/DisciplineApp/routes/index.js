// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const DisciplineApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/DisciplineApp')
);

const DisciplineProfileApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/DisciplineProfileApp')
);

const renderDisciplineRoutes = () => {
  return (
    <Route path="league-fixtures">
      <Route path="discipline" element={<DisciplineApp />} />
      <Route path="discipline/:id" element={<DisciplineProfileApp />} />
    </Route>
  );
};

export default renderDisciplineRoutes;
