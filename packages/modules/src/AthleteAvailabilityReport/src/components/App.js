// @flow
/* eslint-disable react/sort-comp */
import type { Node } from 'react';

import { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import stickyHeader from '@kitman/common/src/utils/StickyHeaderTable';
import {
  AppStatus,
  DateRangePicker,
  NavArrows,
  PageHeader,
} from '@kitman/components';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import {
  handleScroll,
  headerSideScroll,
  scrollTableLeft,
  scrollTableRight,
} from '@kitman/common/src/utils/ScrollableTable';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { SideBarTranslated as SideBar } from './SideBar';
import { HeaderTranslated as Header } from './Header';
import { BodyTranslated as Body } from './Body';
import { SidePanelTranslated as SidePanel } from './SidePanel';
import type { Athlete, ExpandedAthlete, InjuryStatus } from '../../types';

type Props = {
  athletes: Array<Athlete>,
  canViewIssues: boolean,
  canViewAbsence: boolean,
  timeRangeStart: string,
  timeRangeEnd: string,
  orgTimeZone: string,
  turnaroundList: Array<Turnaround>,
  injuryStatuses: Array<InjuryStatus>,
};

type State = {
  screenWidth: number,
  expandedAthleteDataById: { string: ExpandedAthlete },
  sessionDataByAthleteId: { string: ExpandedAthlete },
  isLegendOpen: boolean,
  feedbackModalStatus: ?string,
  feedbackModalMessage: ?string,
};

export type Event = {
  missed: number,
  percentage: number,
  ratio: number,
  total: number,
};

type AthleteStat = {
  full_name: string,
  id: string,
  stats: {
    games: Event,
    training_sessions: Event,
  },
};

class App extends Component<I18nProps<Props>, State> {
  datagridWidth: number;

  cellWidth: number;

  extraPadding: number;

  cellsPerPage: number;

  sidebarWidth: number;

  sidePanelWidth: number;

  scrollEnd: ?number;

  maxScroll: ?number;

  constructor(props: I18nProps<Props>) {
    super(props);

    this.datagridWidth = 792;
    this.cellWidth = 25;
    this.extraPadding = 35; // this is too allow extra room for the right nav button
    this.cellsPerPage = 8;
    this.sidebarWidth = 200;
    this.sidePanelWidth = 60;
    this.scrollEnd = null;
    this.maxScroll = null;

    this.state = {
      screenWidth: 1024,
      isLegendOpen: false,
      expandedAthleteDataById: {},
      sessionDataByAthleteId: {},
      feedbackModalStatus: null,
      feedbackModalMessage: null,
    };

    this.initHeaderScroll = this.initHeaderScroll.bind(this);
    this.requestExpandedAthleteData =
      this.requestExpandedAthleteData.bind(this);
    this.transformSessionDataResponse =
      this.transformSessionDataResponse.bind(this);
    this.requestSessionData = this.requestSessionData.bind(this);
  }
  /* eslint-enable max-statements */

  componentDidMount() {
    this.initHeaderScroll();
    if (window.getFlag('missing-games-ts-availability-report')) {
      this.requestSessionData();
    }

    $(window).on(
      'resize',
      debounce(() => {
        this.updateScreenWidth();
      }, 250)
    );

    this.setState({
      screenWidth: $(window).width(),
    });

    handleScroll($('.js-scrollableTable__body').scrollLeft(), this.scrollEnd);
    this.cellsPerPage = this.getCellsPerPage();
    const headerTopPos = this.getHeaderTopPosition();
    if (headerTopPos) {
      stickyHeader(headerTopPos, 'availabilityReportTable--fixedHeader');
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.screenWidth !== this.state.screenWidth) {
      this.cellsPerPage = this.getCellsPerPage();
      handleScroll($('.js-scrollableTable__body').scrollLeft(), this.scrollEnd);
    }
  }

  updateScreenWidth() {
    const screenWidth = $(window).width();
    this.setState({
      screenWidth,
    });
  }

  getHeaderTopPosition() {
    const $availabilityReportTable = $('.availabilityReportTable');
    return $availabilityReportTable.offset()
      ? $availabilityReportTable.offset().top
      : 0;
  }

  initHeaderScroll = () => {
    // BE sends as many availability marker as many days are in the date range
    const cellNumberSum = this.props.athletes[0].availabilities.length;

    this.datagridWidth = $('.availabilityReportTable__body').width();
    this.scrollEnd =
      cellNumberSum * this.cellWidth + this.extraPadding - this.datagridWidth;
    this.maxScroll = $('.availabilityReportTable__bodyInner').width();
    headerSideScroll(this.scrollEnd);
  };

  getCellsPerPage() {
    return Math.round(
      ($('.js-scrollableTable__body').width() - this.extraPadding) /
        this.cellWidth
    );
  }

  setErrorFeedbackModal() {
    this.setState({
      feedbackModalStatus: 'error',
      feedbackModalMessage: null,
    });
  }

  setLoadingFeedbackModal() {
    this.setState({
      feedbackModalStatus: 'loading',
      feedbackModalMessage: this.props.t('Loading...'),
    });
  }

  hideFeedbackModal() {
    this.setState({
      feedbackModalStatus: null,
      feedbackModalMessage: null,
    });
  }

  requestExpandedAthleteData = (athletId: string) => {
    const newExpandedAthleteDataById = {
      ...this.state.expandedAthleteDataById,
    };

    if (newExpandedAthleteDataById[athletId]) {
      delete newExpandedAthleteDataById[athletId];
      this.setState({
        expandedAthleteDataById: newExpandedAthleteDataById,
      });
      return;
    }

    this.setLoadingFeedbackModal();
    $.ajax({
      method: 'GET',
      url: `/athletes/${athletId}/availability_report`,
      contentType: 'application/json',
      data: {
        start_date: this.props.timeRangeStart,
        end_date: this.props.timeRangeEnd,
      },
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done((response) => {
        newExpandedAthleteDataById[athletId] = response;
        this.setState({
          expandedAthleteDataById: newExpandedAthleteDataById,
        });
        this.hideFeedbackModal();
      })
      .fail(() => {
        this.setErrorFeedbackModal();
      });
  };

  transformSessionDataResponse = (stats: Array<AthleteStat>) => {
    return stats.reduce((statMap, statRecord) => {
      return Object.assign(statMap, { [statRecord.id]: statRecord.stats });
    }, {});
  };

  requestSessionData = () => {
    this.setLoadingFeedbackModal();
    $.ajax({
      method: 'GET',
      url: `/athletes/availability_report/stats`,
      contentType: 'application/json',
      data: {
        start_date: this.props.timeRangeStart,
        end_date: this.props.timeRangeEnd,
      },
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done((response) => {
        const sessionDataByAthleteId = this.transformSessionDataResponse(
          response.stats
        );
        this.setState({
          sessionDataByAthleteId,
        });
        this.hideFeedbackModal();
      })
      .fail(() => {
        this.setErrorFeedbackModal();
      });
  };

  getLegendItems(): Node {
    return this.props.injuryStatuses.map((status) => {
      if (status.order === this.props.injuryStatuses.length) {
        return null;
      }
      return (
        <span
          key={`status_${status.id}`}
          className="availabilityReportTableHeader__legendItem"
        >
          <span
            className="availabilityReportTableHeader__legendItemColor"
            style={{ backgroundColor: `#${status.color}` }}
          />
          {status.description}
        </span>
      );
    });
  }

  render() {
    // BE sends as many availability marker as many days are in the date range
    const cellNumberSum = this.props.athletes[0].availabilities.length;

    let rowWidth = cellNumberSum * this.cellWidth + this.extraPadding;
    const pagePadding = 20; // left padding of table
    const rowMinWidth =
      this.state.screenWidth -
      this.sidebarWidth -
      pagePadding * 2 -
      this.sidePanelWidth;
    rowWidth = rowWidth > rowMinWidth ? rowWidth : rowMinWidth;

    // the width includes the additional length for the sidebar (not just the cells)
    let rowWidthOffset = cellNumberSum * this.cellWidth;
    rowWidthOffset =
      rowWidthOffset > rowMinWidth ? rowWidthOffset : rowMinWidth;

    const getDisabledState = () =>
      cellNumberSum < Math.round(this.cellsPerPage) ||
      cellNumberSum % this.cellsPerPage === 0;

    // if there are less than the minimum number of cells to fill one page
    // of the table, we want to disabled the right nav button
    const rightNavBtnClasses = classNames({
      navArrows__rightBtn: true,
      isDisabled: getDisabledState(),
    });

    // initHeaderScroll needs to be called from render to set correct dataGridWidth
    this.initHeaderScroll();

    return (
      <div className="athleteAvailabilityReport">
        <PageHeader>
          <div className="availabilityReportTableHeader">
            <div className="availabilityReportTableHeader__headerContent">
              <h3>{this.props.t('Availability Report')}</h3>
              <div className="availabilityReportTableHeader__legend">
                <span
                  className="availabilityReportTableHeader__legendOpener"
                  onClick={() => {
                    this.setState({ isLegendOpen: !this.state.isLegendOpen });
                  }}
                >
                  {this.props.t('Legend')}
                </span>
                <div
                  style={{
                    height: this.state.isLegendOpen
                      ? $(
                          '.availabilityReportTableHeader__legendContentInner'
                        ).height()
                      : 0,
                  }}
                  className={classNames(
                    'availabilityReportTableHeader__legendContent',
                    {
                      'availabilityReportTableHeader__legendContent--open':
                        this.state.isLegendOpen,
                    }
                  )}
                >
                  <div className="availabilityReportTableHeader__legendContentInner">
                    {this.getLegendItems()}
                    <span className="availabilityReportTableHeader__legendItem availabilityReportTableHeader__legendItem--absence">
                      <span className="availabilityReportTableHeader__legendItemColor availabilityReportTableHeader__legendItemColor--absence" />
                      {this.props.t('Absence')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="availabilityReportTableHeader__dateRangePicker">
              <DateRangePicker
                turnaroundList={this.props.turnaroundList}
                onChange={(value) => {
                  window.location.assign(
                    `/athletes/availability_report?start_date=${value.start_date}&end_date=${value.end_date}`
                  );
                }}
                value={{
                  start_date: this.props.timeRangeStart,
                  end_date: this.props.timeRangeEnd,
                }}
                position="left"
                maxDate={moment(new Date()).add(-1, 'days')}
              />
            </div>
          </div>
        </PageHeader>

        <div className="availabilityReportTable__container">
          <div
            className={classNames(
              'availabilityReportTable',
              'js-stickyHeaderTable',
              {
                'availabilityReportTable--withGamesAndSessions':
                  !!window.getFlag('missing-games-ts-availability-report'),
              }
            )}
          >
            <SideBar
              athletes={this.props.athletes}
              rightShadowPos={this.datagridWidth || 0}
              expandedAthleteData={this.state.expandedAthleteDataById}
              onExpandAthleteClick={this.requestExpandedAthleteData}
              canViewIssues={this.props.canViewIssues}
              canViewAbsence={this.props.canViewAbsence}
            />
            <div className="availabilityReportTable__header">
              <div className="availabilityReportTable__headerInner">
                <NavArrows
                  customClassname="availabilityReportTable__navArrows"
                  rightNavBtnClasses={rightNavBtnClasses}
                  onLeftBtnClick={() =>
                    scrollTableLeft(this.cellWidth, this.cellsPerPage)
                  }
                  onRightBtnClick={() =>
                    scrollTableRight(
                      this.cellWidth,
                      this.cellsPerPage,
                      this.maxScroll
                    )
                  }
                />
                <div
                  className="availabilityReportTable__headerContent"
                  style={{ width: rowWidthOffset }}
                >
                  <Header
                    timeRangeStart={this.props.timeRangeStart}
                    timeRangeEnd={this.props.timeRangeEnd}
                    orgTimeZone={this.props.orgTimeZone}
                  />
                </div>
              </div>
            </div>

            <div className="availabilityReportTable__body js-scrollableTable__body">
              <div
                className="availabilityReportTable__bodyInner js-scrollableTable__bodyinner"
                style={{ width: rowWidth }}
              >
                <Body
                  athletes={this.props.athletes}
                  canViewIssues={this.props.canViewIssues}
                  canViewAbsence={this.props.canViewAbsence}
                  expandedAthleteData={this.state.expandedAthleteDataById}
                  injuryStatuses={this.props.injuryStatuses}
                  data-testid="expanded-row"
                />
              </div>
            </div>
          </div>

          <SidePanel
            athletes={this.props.athletes}
            timeRangeStart={this.props.timeRangeStart}
            timeRangeEnd={this.props.timeRangeEnd}
            orgTimeZone={this.props.orgTimeZone}
            expandedAthleteData={this.state.expandedAthleteDataById}
            sessionDataByAthleteId={this.state.sessionDataByAthleteId}
            data-testid="session-data"
          />
        </div>

        <AppStatus
          status={this.state.feedbackModalStatus}
          message={this.state.feedbackModalMessage}
          hideConfirmation={this.hideFeedbackModal}
          close={this.hideFeedbackModal}
        />
      </div>
    );
  }
  /* eslint-enable max-statements */
}

export const AppTranslated = withNamespaces()(App);
export default App;
