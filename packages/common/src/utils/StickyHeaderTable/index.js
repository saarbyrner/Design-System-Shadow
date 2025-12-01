// @flow
import $ from 'jquery';

// makes the table header stick to the top of screen
// when {headerTopPosition} is reached when scrolling
const stickyHeader = (headerTopPosition: number, fixedClassName: string) => {
  // to enable re-initializing headerTopPosition we first unbind the scroll event
  $(document).unbind('scroll');

  $(document).on('scroll', () => {
    if ($(document).scrollTop() > headerTopPosition) {
      $('.js-stickyHeaderTable').addClass(fixedClassName);
    } else {
      $('.js-stickyHeaderTable').removeClass(fixedClassName);
    }
  });
};

export default stickyHeader;
