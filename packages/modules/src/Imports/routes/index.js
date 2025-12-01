// @flow
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const ListImportsApp = lazy(() =>
  import('@kitman/modules/src/Imports/ListImports')
);

const Imports = lazy(() => import('@kitman/modules/src/Imports'));

const renderImportRoutes = () => {
  if (window.featureFlags['league-ops-officials-filter-post-api']) {
    return (
      <>
        <Route path="settings/imports" element={<ListImportsApp />} />
        <Route path="administration/imports" element={<ListImportsApp />} />
      </>
    );
  }
  /**
   * @deprecated
   * Migrated to full RTK integration behind feature league-ops-officials-filter-post-api
   * Remove once QA'd
   * Use@kitman/modules/src/Imports/ListImports
   */
  return (
    <>
      <Route path="settings/imports" element={<Imports />} />
      <Route path="administration/imports" element={<Imports />} />
    </>
  );
};

export default renderImportRoutes;
