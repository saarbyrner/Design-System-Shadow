// @flow
import $ from 'jquery';

// Set the scroll button disabled style if the end of scrollable area is reached
export const handleScroll = (scrollPosition: number, scrollEnd: ?number) => {
  if (scrollPosition === 0) {
    $('.navArrows__leftBtn').addClass('isDisabled');
  } else if (scrollPosition === scrollEnd) {
    $('.navArrows__rightBtn').addClass('isDisabled');
  } else {
    $('.navArrows__rightBtn').removeClass('isDisabled');
    $('.navArrows__leftBtn').removeClass('isDisabled');
  }

  $('.js-scrollableTable__header').css('left', `-${scrollPosition}px`);
};

export const headerSideScroll = (
  scrollEnd: ?number,
  customElement?: Object
) => {
  const scrollElement = customElement || $('.js-scrollableTable__body');
  scrollElement.on('scroll', (e) => {
    window.requestAnimationFrame(() => {
      handleScroll(e.target.scrollLeft, scrollEnd);
    });
  });
};

// handle the left side scrolling on table
export const scrollTableLeft = (cellWidth: number, cellsPerPage: number) => {
  const scrollLength = cellWidth * cellsPerPage;
  const scrollPos = $('.js-scrollableTable__body').scrollLeft() - scrollLength;
  const scrollTo = Math.max(scrollPos, 0);

  if (scrollTo === 0) {
    $('.scrollableTable__button--left').addClass('.isDisabled');
  }
  $('.js-scrollableTable__body').animate({ scrollLeft: scrollTo }, 375);
};

// Handle the right side scrolling on table
export const scrollTableRight = (
  cellWidth: number,
  cellsPerPage: number,
  maxScroll: ?number // the scroll limit (eg. width of container)
) => {
  const scrollLength = cellWidth * cellsPerPage;
  const scrollPos = $('.js-scrollableTable__body').scrollLeft() + scrollLength;
  const scrollTo = maxScroll ? Math.min(scrollPos, maxScroll) : null;
  $('.js-scrollableTable__body').animate({ scrollLeft: scrollTo }, 375);
};
