// @flow
import classnames from 'classnames';
import TemplateView from './templateView/TemplateView';
import ListView from './listView/ListView';
import AssessmentsView from '../containers/AssessmentsView';
import AppStatus from '../containers/AppStatus';
import Toasts from '../containers/Toasts';
import AppHeader from '../containers/AppHeader';

import type { ViewType } from '../types';

type Props = {
  viewType: ViewType,
};

const getView = (viewType: ViewType) => {
  if (window.featureFlags['assessments-grid-view']) {
    if (viewType === 'TEMPLATE') {
      return <TemplateView />;
    }
    return <AssessmentsView />;
  }
  return <ListView />;
};

const App = (props: Props) => {
  return (
    <div
      className={classnames('assessments', {
        'assessments--assessments-grid-view-enabled':
          window.featureFlags['assessments-grid-view'],
      })}
    >
      {window.featureFlags['assessments-grid-view'] && <AppHeader />}
      {getView(props.viewType)}
      <AppStatus />
      <Toasts />
    </div>
  );
};

export default App;
