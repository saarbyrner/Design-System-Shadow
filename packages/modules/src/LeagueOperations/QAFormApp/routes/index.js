// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const FormListApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/QAFormApp/FormList')
);

const FormApp = lazy(() =>
  import('@kitman/modules/src/LeagueOperations/QAFormApp/Form')
);

const renderQAFormRoutes = () => {
  return (
    <Route path="qa">
      <Route path="forms" element={<FormListApp />} />
      <Route path="form/:id" element={<FormApp />} />
    </Route>
  );
};

export default renderQAFormRoutes;
