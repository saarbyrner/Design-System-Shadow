// @flow
import { Component } from 'react';
import $ from 'jquery';
import debounce from 'lodash/debounce';
import { withNamespaces } from 'react-i18next';

import { colors } from '@kitman/common/src/variables';
import { Dialogue, NoAthletes } from '@kitman/components';
import { statusesToIds, statusesToMap } from '@kitman/common/src/utils';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { Status } from '@kitman/common/src/types/Status';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import ModalRoot from '../containers/ModalRoot';
import Header from '../containers/Header';
import AthleteStatusTable from './AthleteStatusTable';

type Props = {
  athletes: Array<Athlete>,
  noSearchResults: boolean,
  statuses: Array<Status>,
  hideConfirmation?: () => void,
  confirmationMessage: { show: boolean, message: string, action: () => void },
  // TODO: this should be refactored, dispatch should not be used in a component
  dispatch: Function, //
  isFilterShown: boolean,
};

const containerStyle = {
  backgroundColor: colors.p06,
  overflow: 'hidden',
  marginBottom: '20px',
  minHeight: '500px',
  padding: '0 0 30px',
};

class App extends Component<
  I18nProps<Props>,
  {
    screenWidth: number,
    athletes: Array<Athlete>,
    needConfirmation: boolean,
    confirmationAction: Function,
    confirmationMessage: string,
    statuses: Array<Status>,
    statusOrder: Array<$PropertyType<Status, 'status_id'>>,
    statusMap: { [$PropertyType<Status, 'status_id'>]: Status },
  }
> {
  constructor(props: I18nProps<Props>) {
    super(props);

    const screenWidth = $('.main__inner').width();

    this.state = {
      screenWidth,
      athletes: props.athletes, // eslint-disable-line react/no-unused-state
      needConfirmation: false,
      confirmationAction: () => {},
      confirmationMessage: '',
      statuses: this.props.statuses,
      statusOrder: statusesToIds(this.props.statuses), // eslint-disable-line react/no-unused-state
      statusMap: statusesToMap(this.props.statuses), // eslint-disable-line react/no-unused-state
    };

    this.updateScreenWidth = this.updateScreenWidth.bind(this);
  }

  componentDidMount() {
    $(window).on(
      'resize',
      debounce(() => {
        this.updateScreenWidth();
      }, 250)
    );
  }

  updateScreenWidth = () => {
    const screenWidth = $('.main__inner').width();
    this.setState({
      screenWidth,
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.setState({
      statuses: nextProps.statuses,
      statusOrder: statusesToIds(nextProps.statuses), // eslint-disable-line react/no-unused-state
      statusMap: statusesToMap(nextProps.statuses), // eslint-disable-line react/no-unused-state
    });

    if (nextProps.confirmationMessage !== undefined) {
      this.setState({
        needConfirmation: nextProps.confirmationMessage.show,
        confirmationMessage: nextProps.confirmationMessage.message,
        confirmationAction: () =>
          nextProps.dispatch(nextProps.confirmationMessage.action),
      });
    }
  }

  render() {
    let controls;

    if (this.props.athletes.length > 0) {
      controls = (
        <div css={containerStyle}>
          <Header />

          <AthleteStatusTable
            statuses={this.state.statuses}
            noAthletes={this.props.noSearchResults}
            isFilterShown={this.props.isFilterShown}
            screenWidth={this.state.screenWidth}
            t={this.props.t}
          />
          <Dialogue
            confirmAction={this.state.confirmationAction}
            visible={this.state.needConfirmation}
            message={this.state.confirmationMessage}
            cancelAction={this.props.hideConfirmation}
            confirmButtonText={this.props.t('Yes, I am sure')}
          />
          <ModalRoot />
        </div>
      );
    } else {
      controls = (
        <div css={containerStyle} className="row">
          <NoAthletes />
        </div>
      );
    }
    return controls;
  }
}

export const AppTranslated = withNamespaces()(App);
export default App;
