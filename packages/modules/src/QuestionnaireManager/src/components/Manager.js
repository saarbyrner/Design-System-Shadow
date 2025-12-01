// @flow
import $ from 'jquery';
import { Component } from 'react';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import debounce from 'lodash/debounce';
import { NavArrows, NoAthletes, PageHeader } from '@kitman/components';
import stickyHeader from '@kitman/common/src/utils/StickyHeaderTable';
import {
  headerSideScroll,
  scrollTableLeft,
  scrollTableRight,
} from '@kitman/common/src/utils/ScrollableTable';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { QuestionnaireVariable } from '@kitman/common/src/types';
import Sidebar from '../containers/Sidebar';
import CheckboxCells from '../containers/CheckboxCells';
import Footer from '../containers/Footer';
import Header from '../containers/Header';
import Controls from '../containers/Controls';
import AppStatus from '../containers/AppStatus';
import NoSearchResults from '../containers/NoSearchResults';
import NoVariables from '../containers/NoVariables';
import EmptyQuestionnaireWarning from '../containers/EmptyQuestionnaireWarning';
import ClearAllWarning from '../containers/ClearAllWarning';

type Props = {
  variables: Array<QuestionnaireVariable>,
  cantShowManager: boolean,
  allAthletes: Array<Athlete>,
  setSquadFilterLocalState: (number) => void,
  localSquadFilter: number | null,
};

type State = {
  screenWidth: number,
};

class Manager extends Component<Props, State> {
  /* eslint-disable */
  datagridWidth: number;
  cellWidth: number;
  extraPadding: number;
  cellsPerPage: number;
  sidebarWidth: number;
  scrollEnd: ?number;
  maxScroll: ?number;
  headerTop: number;
  /* eslint-enable */

  constructor(props: Props) {
    super(props);

    const screenWidth = $(window).width();

    this.state = {
      screenWidth,
    };

    this.datagridWidth = 792;
    this.cellWidth = 128;
    this.extraPadding = 60; // this is too allow extra room for the right nav button
    this.cellsPerPage = 6;
    this.sidebarWidth = 250;
    this.scrollEnd = null;
    this.maxScroll = null;
    this.headerTop = 430;

    this.getRowWidth = this.getRowWidth.bind(this);
    this.getRowWidthOffset = this.getRowWidthOffset.bind(this);
    this.updateScreenWidth = this.updateScreenWidth.bind(this);
    this.getCellsPerPage = this.getCellsPerPage.bind(this);
  }
  /* eslint-enable max-statements */

  componentDidMount() {
    this.datagridWidth = $('.js-scrollableTable__body').width();

    $(window).on(
      'resize',
      debounce(() => {
        this.updateScreenWidth();
      }, 250)
    );
    this.cellsPerPage = this.getCellsPerPage();

    this.setScrollEnd();
    this.setmaxScroll();
    headerSideScroll(this.scrollEnd);

    stickyHeader(
      this.getHeaderTopPosition(),
      'questionnaireManager--fixedHeader'
    );
    this.stickyFooter($(document).scrollTop());
    this.trackScroll();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.screenWidth !== this.state.screenWidth) {
      this.cellsPerPage = this.getCellsPerPage();
      this.datagridWidth = $('.js-scrollableTable__body').width();
    }

    // reinitiate scrolling if variable types or screen size has changed
    const shouldInitHeaderScroll =
      prevProps.variables[0].key !== this.props.variables[0].key ||
      prevState.screenWidth !== this.state.screenWidth;

    if (shouldInitHeaderScroll) {
      this.setScrollEnd();
      this.setmaxScroll();

      // if screenWidth had changed need to reinitiate the scrolling after setting
      // scrollEnd and maxScroll to disable the arrow buttons at the right time
      headerSideScroll(this.scrollEnd);
      $('.navArrows__rightBtn').removeClass('isDisabled');
      $('.questionnaireManager__body').scrollLeft(0);
    }
  }

  getHeaderTopPosition() {
    const $questionnaireManagerHeader = $(
      '.questionnaireManager__headerContent'
    );
    return $questionnaireManagerHeader.offset()
      ? $questionnaireManagerHeader.offset().top
      : 0;
  }

  getCellsPerPage = () => {
    return $('.js-scrollableTable__body').width() / this.cellWidth;
  };

  setScrollEnd() {
    this.scrollEnd =
      this.props.variables.length * this.cellWidth +
      this.extraPadding -
      this.datagridWidth;
  }

  setmaxScroll() {
    this.maxScroll = $('.questionnaireManager__bodyInner').width();
  }

  getRowWidth = () => {
    const rowWidth =
      this.props.variables.length * this.cellWidth + this.extraPadding;
    const pagePadding = 20; // left padding of table
    const rowMinWidth =
      this.state.screenWidth - this.sidebarWidth - pagePadding;

    return rowWidth > rowMinWidth ? rowWidth : rowMinWidth;
  };

  getRowWidthOffset = () => {
    // the width include the addtional length for the sidebar (not just the cells)
    const rowWidthOffset =
      this.props.variables.length * this.cellWidth + this.sidebarWidth;
    return rowWidthOffset > this.state.screenWidth
      ? rowWidthOffset
      : this.state.screenWidth;
  };

  getDisabledState() {
    // get initial disabled state, on scrolling disabled state is controlled
    // through the headerSideScroll method
    return (
      this.props.variables.length < Math.round(this.cellsPerPage) ||
      this.props.variables.length % this.cellsPerPage === 0
    );
  }

  updateScreenWidth = () => {
    const screenWidth = $(window).width();
    this.setState({
      screenWidth,
    });
  };

  trackScroll() {
    $(document).on('scroll', () => {
      const scrollTop = $(document).scrollTop();
      this.stickyFooter(scrollTop);
    });
  }

  stickyFooter(scrollTop: number) {
    const credentialFooterHeight = 20;
    const scrollBottom = $(document).height() - credentialFooterHeight;
    if (scrollTop < scrollBottom - $(window).height()) {
      $('.js-managerTable').addClass('questionnaireManager--fixedFooter');
    } else {
      $('.js-managerTable').removeClass('questionnaireManager--fixedFooter');
    }
  }

  render() {
    let questionnaireManagerContent;

    const questionnaireManagerClasses = classNames('questionnaireManager', {
      'questionnaireManager--cantShowManager': this.props.cantShowManager,
    });

    const rightNavBtnClasses = classNames({
      navArrows__rightBtn: true,
      isDisabled: this.getDisabledState(),
    });

    if (this.props.allAthletes.length > 0) {
      questionnaireManagerContent = (
        <div className={questionnaireManagerClasses}>
          <PageHeader>
            <Controls
              setSquadFilterLocalState={this.props.setSquadFilterLocalState}
              localSquadFilter={this.props.localSquadFilter}
            />
          </PageHeader>

          <div className="questionnaireManager__container js-managerTable js-stickyHeaderTable">
            <div className="questionnaireManager__sidebar">
              <Sidebar />
            </div>

            <div className="questionnaireManager__header">
              <NavArrows
                customClassname="questionnaireManager__navArrows"
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
                className="questionnaireManager__headerContent"
                style={{ width: this.getRowWidthOffset() }}
              >
                <Header variableWidth={this.cellWidth} />
              </div>
            </div>

            <div className="questionnaireManager__body js-scrollableTable__body">
              <div
                className="questionnaireManager__bodyInner"
                style={{ width: this.getRowWidth() }}
              >
                <CheckboxCells cellWidth={this.cellWidth} />
              </div>

              <NoSearchResults />
              <NoVariables />
            </div>

            <div className="questionnaireManager__footer">
              <Footer />
            </div>
          </div>
          <AppStatus />
          <EmptyQuestionnaireWarning />
          <ClearAllWarning />
        </div>
      );
    } else {
      questionnaireManagerContent = <NoAthletes />;
    }

    return questionnaireManagerContent;
  }
}

export default Manager;
export const ManagerTranslated = withNamespaces()(Manager);
