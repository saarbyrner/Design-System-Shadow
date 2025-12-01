// @flow
/* eslint-disable react/sort-comp */
import $ from 'jquery';
import { Component } from 'react';
import type { Status } from '@kitman/common/src/types/Status';
import classNames from 'classnames';
import { NavArrows } from '@kitman/components';
import stickyHeader from '@kitman/common/src/utils/StickyHeaderTable';
import {
  handleScroll,
  headerSideScroll,
  scrollTableLeft,
  scrollTableRight,
} from '@kitman/common/src/utils/ScrollableTable';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AthleteStatusCells from '../../containers/AthleteStatusCells';
import Sidebar from '../../containers/Sidebar';
import AthleteStatusHeader from '../../containers/AthleteStatusHeader';
import NoSearchResults from '../../containers/NoSearchResults';

type Props = {
  statuses: Array<Status>,
  isFilterShown: boolean,
  screenWidth: number,
};

export default class AthleteStatusTable extends Component<I18nProps<Props>> {
  datagridWidth: number;

  cellWidth: number;

  extraPadding: number;

  cellsPerPage: number;

  sidebarWidth: number;

  scrollEnd: ?number;

  maxScroll: ?number;

  constructor(props: I18nProps<Props>) {
    super(props);

    this.datagridWidth = 792;
    this.cellWidth = 96;
    this.extraPadding = 60; // this is too allow extra room for the right nav button
    this.cellsPerPage = 8;
    this.sidebarWidth = 278;
    this.scrollEnd = null;
    this.maxScroll = null;

    this.initHeaderScroll = this.initHeaderScroll.bind(this);
  }
  /* eslint-enable max-statements */

  componentDidMount() {
    this.initHeaderScroll();

    handleScroll($('.js-scrollableTable__body').scrollLeft(), this.scrollEnd);
    this.cellsPerPage = this.getCellsPerPage();
    const headerTopPos = this.getHeaderTopPosition();
    if (headerTopPos) {
      stickyHeader(headerTopPos, 'athleteStatusTable--fixedHeader');
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const headerTopPos = this.getHeaderTopPosition();
    if (nextProps.isFilterShown !== this.props.isFilterShown && headerTopPos) {
      // need to delay reinitiating the sticky header because opening the filter section
      // is animated and correct offset can be calculated after animation is done (300ms)
      setTimeout(() => {
        stickyHeader(
          this.getHeaderTopPosition(),
          'athleteStatusTable--fixedHeader'
        );
      }, 400);
    }

    if (nextProps.screenWidth !== this.props.screenWidth) {
      this.cellsPerPage = this.getCellsPerPage();
      this.initHeaderScroll();
      handleScroll($('.js-scrollableTable__body').scrollLeft(), this.scrollEnd);
    }
  }

  getCellsPerPage() {
    return $('.js-scrollableTable__body').width() / this.cellWidth;
  }

  initHeaderScroll = () => {
    this.datagridWidth = $('.athleteStatusTable__body').width();
    this.scrollEnd =
      this.props.statuses.length * this.cellWidth +
      this.extraPadding -
      this.datagridWidth;
    this.maxScroll = $('.athleteStatusTable__bodyInner').width();
    headerSideScroll(this.scrollEnd);
  };

  getHeaderTopPosition() {
    const $athleteStatusTable = $('.athleteStatusTable');
    return $athleteStatusTable.offset() ? $athleteStatusTable.offset().top : 0;
  }

  render() {
    let rowWidth =
      this.props.statuses.length * this.cellWidth + this.extraPadding;
    const pagePadding = 20; // left padding of table
    const rowMinWidth =
      this.props.screenWidth - this.sidebarWidth - pagePadding;
    rowWidth = rowWidth > rowMinWidth ? rowWidth : rowMinWidth;

    // the width include the addtional length for the sidebar (not just the cells)
    let rowWidthWidthOffset =
      this.props.statuses.length * this.cellWidth + this.sidebarWidth;
    rowWidthWidthOffset =
      rowWidthWidthOffset > this.props.screenWidth
        ? rowWidthWidthOffset
        : this.props.screenWidth;

    const getDisabledState = () =>
      this.props.statuses.length < Math.round(this.cellsPerPage) ||
      this.props.statuses.length % this.cellsPerPage === 0;

    // if there are less then the minimum number of statuses to fill one page
    // of the table, we want to disabled the right nav button
    const rightNavBtnClasses = classNames({
      navArrows__rightBtn: true,
      isDisabled: getDisabledState(),
    });

    const getDummyCells = () => {
      const minimumnumberOfCells = Math.round(
        (this.props.screenWidth - this.sidebarWidth) / this.cellWidth
      );
      return minimumnumberOfCells - this.props.statuses.length;
    };

    return (
      <div className="athleteStatusTable js-stickyHeaderTable">
        <div className="athleteStatusTable__sidebar">
          <Sidebar />
        </div>

        <div className="athleteStatusTable__header">
          <div className="athleteStatusTable__headerInnerWrapper">
            <NavArrows
              customClassname="athleteStatusTable__navArrows"
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
              className="athleteStatusTable__headerContent"
              style={{ width: rowWidthWidthOffset }}
            >
              <AthleteStatusHeader
                screenWidth={this.props.screenWidth}
                dummyCellsNumber={getDummyCells()}
              />
            </div>
          </div>
        </div>

        <div className="athleteStatusTable__body js-scrollableTable__body">
          <div
            className="athleteStatusTable__bodyInner"
            style={{ width: rowWidth }}
          >
            <AthleteStatusCells
              screenWidth={this.props.screenWidth}
              dummyCellsNumber={getDummyCells()}
              t={this.props.t}
            />
          </div>
        </div>

        <NoSearchResults />
      </div>
    );
  }
}
