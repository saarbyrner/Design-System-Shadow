/* eslint-disable react/sort-comp */
// @flow
import { Component } from 'react';
import { PageHeader } from '@kitman/components';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import AppStatus from '../containers/AppStatus';
import GraphForm from '../containers/GraphForm';
import GraphView from '../containers/GraphView';
import DashboardSelectorModal from '../containers/DashboardSelectorModal';
import { BreadcrumbTranslated as Breadcrumb } from './Breadcrumb';

type Props = {
  createNewGraph: Function,
  isEditingDashboard: boolean,
  isEditingGraph: boolean,
  currentDashboard: Dashboard,
};

class App extends Component<
  Props,
  {
    composeView: boolean,
    isEditing: boolean,
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      composeView: false,
      isEditing: false,
    };

    this.setView = this.setView.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onUrlHashChange = this.onUrlHashChange.bind(this);
  }

  componentDidMount = () => {
    // The view is defined by the url hash because
    // the user should be able to press the native back button
    // and go back to the previous view
    window.addEventListener('hashchange', this.onUrlHashChange);

    // set the initial view
    this.onUrlHashChange();
  };

  onUrlHashChange = () => {
    this.setView(location.hash); // eslint-disable-line no-restricted-globals

    // eslint-disable-next-line no-restricted-globals
    if (location.hash === '#create') {
      this.props.createNewGraph();
    }
  };

  componentWillUnmount() {
    document.removeEventListener('hashchange', this.onUrlHashChange);
  }

  setView = (locationHash: string) => {
    this.setState({
      composeView: locationHash === '#edit' || locationHash === '#create',
      isEditing: locationHash === '#edit',
    });
  };

  render() {
    return (
      <div className="graphComposer">
        <PageHeader>
          <Breadcrumb
            isEditingDashboard={this.props.isEditingDashboard}
            isEditingGraph={this.props.isEditingGraph}
            currentDashboard={this.props.currentDashboard}
          />
        </PageHeader>
        {this.state.composeView ? (
          <GraphForm isEditing={this.state.isEditing} />
        ) : (
          <GraphView />
        )}
        <DashboardSelectorModal />
        <AppStatus />
      </div>
    );
  }
}

export default App;
