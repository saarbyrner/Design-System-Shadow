// @flow
import { useEffect } from 'react';
import { trackIntercomEvent } from '@kitman/common/src/utils';
import { ManageAthletesContextProvider } from '../contexts/manageAthletesContext';
import { AthletesTabsTranslated as AthletesTabs } from './AthletesTabs';
import { PageHeaderTranslated as PageHeader } from './PageHeader';
import { BulkLabelActionsTranslated as BulkLabelActions } from './BulkLabelActions';

const ManageAthletesApp = () => {
  useEffect(() => trackIntercomEvent('viewed-athlete-settings'), []);

  return (
    <ManageAthletesContextProvider>
      <PageHeader />
      <AthletesTabs />
      {window.getFlag('labels-and-groups') && <BulkLabelActions />}
    </ManageAthletesContextProvider>
  );
};

export default ManageAthletesApp;
