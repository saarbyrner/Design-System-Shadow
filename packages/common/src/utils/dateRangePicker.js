/* eslint-disable flowtype/require-valid-file-annotation */
import 'bootstrap-select';
import 'daterangepicker';
import $ from 'jquery';
import i18n from './i18n';
import * as DateFormatter from './dateFormatter';

export const getDateRangeText = (startDateUtc, endDateUtc, timezone) => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatRange(
      startDateUtc.tz(timezone),
      endDateUtc.tz(timezone)
    );
  }

  return `${startDateUtc.tz(timezone).format('D MMM YYYY')} - ${endDateUtc
    .tz(timezone)
    .format('D MMM YYYY')}`;
};

export default class BootstrapDateRangePicker {
  constructor(daterangeElement, turnaroundList, onApply, position, options) {
    if (typeof $ === 'undefined') {
      return;
    }

    this.resetTurnaroundSelect = this.resetTurnaroundSelect.bind(this);

    this.turnaroundList = turnaroundList;
    this.daterangeElement = $(daterangeElement);
    this.daterangeContainer = this.daterangeElement.parent();
    this.onApply = onApply;

    const timezone = $('body').attr('data-timezone');
    const dataLimitTsStart = $('body').attr('data-limit-ts-start');

    // If the timezone data attributes is not set, bail out.
    if (!timezone) {
      return;
    }

    const dateRangePickerOptions = options ? { ...options } : {};
    const dateRangePickerTemplate = `<div class="daterangepicker dropdown-menu" id="dateRangePicker">
        <div class="ranges"></div>
        <div class="drp-calendar left">
          <div class="calendar-table"></div>
          <div class="calendar-time"></div>
        </div>
        <div class="drp-calendar right">
          <div class="calendar-table"></div>
          <div class="calendar-time"></div>
        </div>
        <div class="drp-buttons turnaround__footer">
          <button class="cancelBtn btn km-btn-secondary km-btn-small" type="button"></button>
          <button class="applyBtn btn km-btn-primary km-btn-small" disabled="disabled" type="button"></button>
        </div>
      </div>`;
    const startDate = $('form#ts_controls')
      .find('input[name="ts_start"]')
      .val();
    const endDate = $('form#ts_controls').find('input[name="ts_end"]').val();
    this.daterangeElement.daterangepicker({
      parentEl: this.daterangeContainer,
      locale: {
        format: 'DD MMM YYYY',
        separator: ' - ',
        applyLabel: i18n.t('Apply'),
        cancelLabel: i18n.t('Cancel'),
        fromLabel: i18n.t('From'),
        toLabel: i18n.t('To'),
        customRangeLabel: i18n.t('Custom'),
        weekLabel: i18n.t('W'),
        daysOfWeek: [
          i18n.t('Su'),
          i18n.t('Mo'),
          i18n.t('Tu'),
          i18n.t('We'),
          i18n.t('Th'),
          i18n.t('Fr'),
          i18n.t('Sa'),
        ],
        monthNames: [
          i18n.t('January'),
          i18n.t('February'),
          i18n.t('March'),
          i18n.t('April'),
          i18n.t('May'),
          i18n.t('June'),
          i18n.t('July'),
          i18n.t('August'),
          i18n.t('September'),
          i18n.t('October'),
          i18n.t('November'),
          i18n.t('December'),
        ],
        firstDay: 1,
      },
      startDate: moment.tz(startDate, timezone),
      endDate: moment.tz(endDate, timezone),
      minDate: moment(dataLimitTsStart),
      linkedCalendars: false,
      opens: position || 'left',
      template: dateRangePickerTemplate,
      ...dateRangePickerOptions,
    });

    this.addTurnaroundSelectorsToPicker();

    this.daterangeElement.on('apply.daterangepicker', (ev, picker) => {
      // Date range picker startDate and endDate are start of day
      // and end of day as moment.js date objects
      // Pluck the date and time part of them (ignore the offset)
      // and set the form input date times to UTC
      // dates in the org's timezone

      const startDateUtc = this.timePickerDateToUTC(picker.startDate, timezone);
      const endDateUtc = this.timePickerDateToUTC(picker.endDate, timezone);

      const daterangeText = getDateRangeText(
        startDateUtc.clone(),
        endDateUtc.clone(),
        timezone
      );

      const startDateServerFormat = this.formatDate(startDateUtc);
      const endDateServerFormat = this.formatDate(endDateUtc);

      $('form#ts_controls')
        .find('input[name="ts_start"]')
        .val(startDateServerFormat);
      $('form#ts_controls')
        .find('input[name="ts_end"]')
        .val(endDateServerFormat);

      const value = {
        start: startDateServerFormat,
        end: endDateServerFormat,
        text: daterangeText,
      };

      this.onApply(value); // Callback on apply
    });

    // eslint-disable-next-line func-names
    this.daterangeElement.on('hide.daterangepicker', function () {
      $(this).blur();
    });
  }

  addTurnaroundSelectorsToPicker() {
    // Init the two turnaround selectors and populate them on the page
    const fromSelect = this.buildTurnaroundList('from_select');
    const toSelect = this.buildTurnaroundList('to_select');
    const turnaroundHtml = this.buildTurnaroundSelectorHTML(
      fromSelect,
      toSelect
    );
    // Insert the turnaroundHtml into the daterangepicker
    this.daterangeContainer.find('.daterangepicker').append(turnaroundHtml);

    // Attach listeners to each select on change
    this.attachListenersToSelects();
    this.resetTurnaroundSelect();
  }

  buildTurnaroundSelectorHTML(fromSelect, toSelect) {
    // Initial HTML to contain the turnaround selectors
    const turnaroundHtml = $('<div class="turnaround_selects"></div>');
    turnaroundHtml.append(`<h3>${i18n.t('Turnarounds')}</h3>`);
    turnaroundHtml.append(
      `<label class="turnaround__label justify-content-start mt-4 mb-2">${i18n.t(
        'From'
      )}</label>`
    );
    turnaroundHtml.append(fromSelect);
    turnaroundHtml.append(
      `<label class="turnaround__label justify-content-start mt-3 mb-2">${i18n.t(
        'To'
      )}</label>`
    );
    turnaroundHtml.append(toSelect);

    return turnaroundHtml;
  }

  // Functions for applying selected turnaround dates
  attachListenersToSelects() {
    // Logic here that handles:
    // Setting the 'from' turnaround, will change the start date and
    // If no 'to' turnaround, will also set the end date - and set the 'to' turnaround so as to
    // limit the choices to dates after that turnaround
    // Setting the 'to' turnaround, will change the end date
    // If no 'from', then the 'from' will match the 'to'
    // Lastly, changing the dates on the calendars manually will erase the turnaround selections
    this.daterangeContainer.find('#from_select').on('change', (e) => {
      const optionId = e.target.value;
      if (!optionId) {
        return;
      }

      // eslint-disable-next-line func-names, no-shadow
      const turnaround = $.grep(this.turnaroundList, function (e) {
        return e.id == optionId; // eslint-disable-line eqeqeq
      });
      const fromStartDate = turnaround[0].from;

      this.setStartDate(fromStartDate);
      // If no "to" set, update that selector
      if ($('#to_select').val() === '') {
        this.setSelectorToPosition(optionId, '#to_select');
        this.setEndDate(turnaround[0].to);
      } else {
        // If the "to" has a value, but has a date before the current one, empty it
        // eslint-disable-next-line func-names, no-shadow
        const toTurnaround = $.grep(this.turnaroundList, function (e) {
          return e.id == $('#to_select').val(); // eslint-disable-line eqeqeq
        });
        const toEndDate = toTurnaround[0].to;
        if (new Date(fromStartDate) > new Date(toEndDate)) {
          this.setSelectorToPosition(optionId, '#to_select');
          this.setEndDate(turnaround[0].to);
        }
      }

      this.updateView();
    });

    this.daterangeContainer.find('#to_select').on('change', (e) => {
      const optionId = e.target.value;
      if (!optionId) {
        return;
      }

      // eslint-disable-next-line func-names, no-shadow
      const turnaround = $.grep(this.turnaroundList, function (e) {
        return e.id == optionId; // eslint-disable-line eqeqeq
      });
      const toDate = turnaround[0].to;

      this.setEndDate(toDate);
      // If no "from" set, update that selector
      if ($('#from_select').val() === '') {
        this.setSelectorToPosition(optionId, '#from_select');
        this.setStartDate(turnaround[0].from);
      } else {
        // If the "from" has a value, but has a "to" date after the current one, empty it
        // eslint-disable-next-line func-names, no-shadow
        const fromTurnaround = $.grep(this.turnaroundList, function (e) {
          return e.id == $('#from_select').val(); // eslint-disable-line eqeqeq
        });
        const fromDate = fromTurnaround[0].from;
        if (new Date(toDate) < new Date(fromDate)) {
          this.setSelectorToPosition(optionId, '#from_select');
          this.setStartDate(turnaround[0].from);
        }
      }

      this.updateView();
    });

    this.daterangeContainer
      .find('.calendar')
      .on('click', 'td.available', this.resetTurnaroundSelect);
  }

  resetTurnaroundSelect() {
    this.daterangeContainer
      .find('.turnaround_selects select')
      .selectpicker('val', '');
  }

  setStartDate(date) {
    this.daterangeElement.data('daterangepicker')?.setStartDate(date);
    this.updateView();
  }

  setEndDate(date) {
    this.daterangeElement.data('daterangepicker')?.setEndDate(date);
    this.updateView();
  }

  updateView() {
    this.daterangeElement.data('daterangepicker')?.updateView();
  }

  setSelectorToPosition(position, selector) {
    if (this.daterangeContainer.find(selector).val() === position) {
      return;
    }
    this.daterangeContainer.find(selector).selectpicker('val', position);
  }

  // Build turnaround lists
  buildTurnaroundList(id) {
    // Simple at first, just create the dropdown for all items in turnaround_list
    // Next step: Filter based on what's in the other filter
    const dropdown = $(
      `<select id="${id}" class="selectpicker km-search-select" data-none-selected-text="" data-width="100%"><option value=""></option></select>`
    );
    $(this.turnaroundList).each((index, option) => {
      dropdown.append(
        $('<option></option>').attr('value', option.id).text(option.name)
      );
    });
    return dropdown;
  }

  stopEventPropagation(e) {
    e.stopPropagation();
  }

  disable() {
    this.daterangeElement[0].addEventListener(
      'click',
      this.stopEventPropagation,
      true
    );
  }

  enable() {
    this.daterangeElement[0].removeEventListener(
      'click',
      this.stopEventPropagation,
      true
    );
  }

  timePickerDateToUTC(timePickerDate, timezone) {
    const timezonedDate = moment.tz(
      timePickerDate.format('YYYY-MM-DD HH:mm:ss'), // Ignore the date offsets given by the library
      timezone
    );
    return timezonedDate.utc();
  }

  formatDate(utcDate) {
    return utcDate.format();
  }
}
