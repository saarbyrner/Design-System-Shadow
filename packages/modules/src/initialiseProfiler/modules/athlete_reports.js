import stickyHeader from '@kitman/common/src/utils/StickyHeaderTable';
import { headerSideScroll } from '@kitman/common/src/utils/ScrollableTable';

export default () => {
  //------------------------------------------------------------------------
  // /app/views/athletes/reports/_report.html.erb

  $(document).ready(() => {
    const $musculoskeletalTable = $('#musculoskeletal.athleteReportTable');
    const $wellbeingTable = $('#wellbeing.athleteReportTable');
    const dataGridWidth = 792;
    const cellWidth = 96;
    const linkContainerWidth = cellWidth + 15;
    const sideBarWidth = 278;

    const applyScrollableTable = (tableElement) => {
      const variablesLength = tableElement.attr('data-variable-length');
      const isStiffnessDisplayed =
        tableElement.attr('data-stiffness-display') === 'true';
      const getRowWidthOffset = (length) => {
        let rowWidthOffset =
          length * cellWidth + sideBarWidth + linkContainerWidth;
        // if stiffness is displayed, add an extra cellWidth
        rowWidthOffset = isStiffnessDisplayed
          ? rowWidthOffset + cellWidth
          : rowWidthOffset;
        return rowWidthOffset > 1080 ? rowWidthOffset : 1080;
      };

      const getRowWidth = (length) => {
        let rowWidth = length * cellWidth + linkContainerWidth;
        // if stiffness is displayed, add an extra cellWidth
        rowWidth = isStiffnessDisplayed ? rowWidth + cellWidth : rowWidth;
        return rowWidth > 830 ? rowWidth : 830;
      };

      const rowWidthOffset = getRowWidthOffset(variablesLength);
      const rowWidth = getRowWidth(variablesLength);
      const scrollEnd = rowWidth - dataGridWidth;

      tableElement
        .find('.athleteReportTable__headerContent')
        .width(rowWidthOffset);
      tableElement.find('.athleteReportTable__bodyInner').width(rowWidth);

      headerSideScroll(
        scrollEnd,
        tableElement.find('.athleteReportTable__body')
      );
    };

    if ($musculoskeletalTable.length > 0) {
      applyScrollableTable($musculoskeletalTable);
    }

    if ($wellbeingTable.length > 0) {
      applyScrollableTable($wellbeingTable);
    }

    if ($('.athleteReportTable').length > 0) {
      const headerTop = $(window).width() < 1200 ? 460 : 370;
      stickyHeader(headerTop, 'athleteReportTable--fixedHeader');
    }
  });
};
