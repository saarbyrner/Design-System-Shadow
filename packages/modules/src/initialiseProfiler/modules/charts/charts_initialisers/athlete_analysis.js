import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import Spinner from 'spin';
import { colors } from '@kitman/common/src/variables';
import spinnerOptions from '../../utilities/spinnerOptions';

HighchartsNoDataToDisplay(Highcharts);

const initSpinner = (divId) => {
  // place spinners
  const spinnerContainer = $('<div class="analysisGraphSpinner"></div>');
  const spinner = new Spinner(spinnerOptions()).spin();
  spinnerContainer.html(spinner.el);
  $(`#${divId}`).html(spinnerContainer);
};

const boundDates = (chart, startDate, endDate) => {
  const extremes = chart.xAxis[0].getExtremes();
  let newStartDate = startDate;
  let newEndDate = endDate;

  if (newStartDate >= extremes.min && newEndDate <= extremes.max) {
    return { start: newStartDate, end: newEndDate };
  }

  if (newStartDate < extremes.min && newEndDate > extremes.max) {
    newStartDate = extremes.min;
    newEndDate = extremes.max;
  } else if (newStartDate < extremes.min && newEndDate >= extremes.min) {
    newStartDate = extremes.min;
  } else if (newStartDate <= extremes.max && newEndDate > extremes.max) {
    newEndDate = extremes.max;
  } else {
    newStartDate = false;
  }

  if (
    chart.xAxis[0].toPixels(newEndDate) -
      chart.xAxis[0].toPixels(newStartDate) ===
    0
  ) {
    newStartDate = false;
  }

  return { start: newStartDate, end: newEndDate };
};

const addTurnaroundBand = (chart, startDate, endDate, label, divId) => {
  let newStartDate = startDate;
  let newEndDate = endDate;
  const dates = boundDates(chart, newStartDate, newEndDate);
  newStartDate = dates.start;
  newEndDate = dates.end;

  // if startDate is false, we shouldn't draw the band
  if (newStartDate) {
    const padding = 1;
    let x = null;
    let y = null;
    let w = null;
    let h = null;
    let r = null;
    let t = null;

    x = chart.xAxis[0].toPixels(newStartDate) + padding;
    y = $(`#${divId}`).height() - 79;
    w = chart.xAxis[0].toPixels(newEndDate) - x - padding;
    h = 24;
    r = 3;

    // (Number x, Number y, Number width, Number height, Number cornerRadius)
    t = chart.renderer // eslint-disable-line no-unused-vars
      .rect(x, y, w, h, r)
      .attr({
        'stroke-width': 0,
        fill: colors.s14,
        zIndex: 0,
        class: 'barRectangleTurnaround',
      })
      .add();

    chart.renderer
      .text(label, x + w / 2 - 10, y + 16)
      .attr({
        zIndex: 1,
        class: 'barTextTurnaround',
      })
      .css({
        color: colors.s17,
        fontSize: '12px',
        fontWeight: 'bold',
      })
      .add();
  }
};

const createTurnaroundBars = (chart, turnaroundMarkers, divId) => {
  turnaroundMarkers.forEach((turnaroundMarker) => {
    if (turnaroundMarker.turnaround_details.duration) {
      addTurnaroundBand(
        chart,
        turnaroundMarker.start_date,
        turnaroundMarker.date,
        turnaroundMarker.turnaround_details.turnaround,
        divId
      );
    }
  });
};

const addAvailabilityBand = (chart, startDate, endDate, divId) => {
  const padding = 1;
  let newStartDate = startDate;
  let newEndDate = endDate;
  const dates = boundDates(chart, newStartDate, newEndDate);
  newStartDate = dates.start;
  newEndDate = dates.end;

  // if startDate is false, we shouldn't draw the band
  if (startDate) {
    let x = null;
    let y = null;
    let w = null;
    let h = null;
    let r = null;

    // TODO: consider bounding dates
    x = chart.xAxis[0].toPixels(newStartDate) + padding;
    y = $(`#${divId}`).height() - 79;
    w = chart.xAxis[0].toPixels(newEndDate) - x - padding;
    h = 24;
    r = 5;

    // (Number x, Number y, Number width, Number height, Number cornerRadius)
    chart.renderer
      .rect(x, y, w, h, r)
      .attr({
        'stroke-width': 0,
        fill: colors.s11,
        opacity: 0.6,
        zIndex: 0,
        class: 'barRectangleTurnaround',
      })
      .add();
  }
};

const setMinYAxisValue = (chart) => {
  let minY = chart.yAxis[0].getExtremes().min;

  for (let i = 1; i < chart.yAxis.length; i++) {
    if (chart.yAxis[i].getExtremes().min < minY) {
      minY = chart.yAxis[i].getExtremes().min;
    }
  }

  for (let i = 0; i < chart.yAxis.length; i++) {
    chart.yAxis[i].setExtremes(minY, chart.yAxis[i].getExtremes().max);
  }
};

const hideEventMarkerDropdowns = () => {
  $('.highcharts-event-marker-dropdown')
    .css({
      left: '-9999px',
      top: '0',
    })
    .removeClass('show');
};

export default () => {
  const initChart = (athleteAnalysisChart) => {
    const divId = athleteAnalysisChart.dataset.divId;
    const chartSeries = JSON.parse(athleteAnalysisChart.dataset.chartSeries);
    const eventMarkers = JSON.parse(athleteAnalysisChart.dataset.eventMarkers);
    const turnaroundMarkers = JSON.parse(
      athleteAnalysisChart.dataset.turnaroundMarkers
    );
    const athleteId = athleteAnalysisChart.dataset.athleteId;
    const startDate = athleteAnalysisChart.dataset.startDate;
    const endDate = athleteAnalysisChart.dataset.endDate;
    const variablesLabel = JSON.parse(
      athleteAnalysisChart.dataset.variablesLabel
    );
    const availabilities = JSON.parse(
      athleteAnalysisChart.dataset.availabilities
    );

    // On load - set up a spinner for this type of graph
    initSpinner(divId);

    const addAvailabilityBandsForAthlete = {};
    addAvailabilityBandsForAthlete[`${athleteId}`] = (chart) => {
      availabilities.forEach((availability) => {
        addAvailabilityBand(
          chart,
          availability.start_date,
          availability.end_date,
          divId
        );
      });
    };

    const createEventMarkersForAthlete = {};
    createEventMarkersForAthlete[`${athleteId}`] = (chart) => {
      // Injury Occurrences
      eventMarkers.forEach((eventMarker, index) => {
        const x = chart.xAxis[0].toPixels(eventMarker.date);
        const y = 42;

        // Create path for the triangle
        const path = [
          'M',
          x - 8,
          y - 15,
          'L',
          x + 7,
          y - 15,
          'L',
          x - 1,
          y - 30,
          'z',
        ];

        // Dropdown
        const dropdown = {
          width: 200,
          height: eventMarker.descriptions.length * 40 + 15,
          stroke: colors.s17,
          x: x - 100,
          y: 56,
          radius: 4,
        };

        // Generate a dropdown in static html
        dropdown.id = `${divId}_event_dropdown_${index}`;
        dropdown.items = '<ul class="highcharts-event-dropdown-list">';
        eventMarker.descriptions.forEach((description) => {
          dropdown.items += `<li>${description}</li>`;
        });
        dropdown.items += '</ul>';

        const marker = chart.renderer
          .g('event-marker')
          .attr({
            'data-target': dropdown.id,
          })
          .add()
          // eslint-disable-next-line func-names
          .on('click', function () {
            const target = $(this).data('target');
            const $target = $(`#${target}`);
            if ($target.hasClass('show')) {
              return;
            }
            hideEventMarkerDropdowns();
            const thisLeft = $target.data('left');
            const thisTop = $target.data('top');
            $target
              .css({
                left: thisLeft,
                top: thisTop,
              })
              .addClass('show');
          });

        $('body').on('click', (event) => {
          if (!$(event.target).closest('.highcharts-event-marker').length) {
            hideEventMarkerDropdowns();
          }
        });

        chart.renderer
          .path(path)
          .attr({ fill: eventMarker.contains_injury ? colors.s11 : colors.s12 })
          .add(marker);

        const eventsCount = eventMarker.descriptions.length;
        let eventsCountOffset = 4;
        if (eventsCount > 9) {
          eventsCountOffset = 8;
        } else if (eventsCount > 99) {
          eventsCountOffset = 12;
        }
        chart.renderer
          .text(eventsCount, x - eventsCountOffset, y)
          .attr({
            zIndex: 1,
          })
          .css({
            color: colors.p03,
            fontSize: '12px',
            fontWeight: 'bold',
          })
          .add(marker);

        // Create new div
        dropdown.div = $('<div></div>')
          .attr({
            id: dropdown.id,
            'data-left': `${dropdown.x}px`,
            'data-top': `${dropdown.y}px`,
          })
          .addClass('highcharts-event-marker-dropdown')
          .html(dropdown.items);

        $(`#${divId} .highcharts-container`).append(dropdown.div);
      });
    };

    window[`render_${divId}`] = () => {
      const colours = [
        colors.s03,
        colors.s21,
        colors.s05,
        colors.s19,
        colors.s04,
        colors.s07,
        colors.s09,
        colors.s17,
        colors.s10,
        colors.s12,
        colors.p01,
        colors.p02,
      ];

      // Clear away the loading spinner first
      $(`#${divId}`).find('.analysisGraphSpinner').remove();
      window[`${divId}`] = new Highcharts.Chart(
        {
          colors: colours,
          chart: {
            renderTo: divId,
            // TODO - Wal - Height and Width here like this ?
            height: $(`#${divId}`).height(),
            width: $(`#${divId}`).width(),
            type: 'line',
            marginTop: 50,
            spacingRight: 70,
            margin: [0, 30, 100, 80],
            backgroundColor: colors.p06,
            style: {
              fontFamily: 'Open Sans, sans-serif',
            },
          },
          title: {
            text: '',
          },
          xAxis: {
            gridLineColor: colors.s15,
            gridLineDashStyle: 'dot',
            gridLineWidth: 1,
            tickColor: colors.s14,
            minorGridLineWidth: 1,
            minorGridLineColor: colors.s15,
            minorGridLineDashStyle: 'dot',
            ordinal: false,
            tickLength: 0,
            lineWidth: 0,
            type: 'datetime',
            tickAmount: 10,
            tickPixelInterval: 50,
            dateTimeLabelFormats: {
              millisecond: '%H:%M:%S.%L',
              second: '%H:%M:%S',
              minute: '%H:%M',
              hour: '%H:%M',
              day: '%e<br/>%b',
              week: '%e<br>%b',
              month: "%b '%y",
              year: '%Y',
            },
            min: parseInt(startDate, 10),
            max: parseInt(endDate, 10),
            labels: {
              style: { color: colors.s16 },
              y: 70,
              autoRotation: 0,
            },
          },
          yAxis: variablesLabel.map((label) => ({
            lineWidth: 0,
            lineColor: colors.s15,
            gridLineWidth: 1,
            gridLineDashStyle: 'dot',
            gridLineColor: colors.s15,
            labels: {
              style: {
                color: colors.p02,
              },
            },
            title: {
              text: label,
            },
            visible: false,
            remove: false,
          })),
          tooltip: {
            borderColor: colors.s17,
            borderWidth: 1.5,
            shadow: true,
            backgroundColor: colors.p06,
            useHTML: true,
            zIndex: 1001,
            shared: true,
            style: {
              padding: '16px',
            },
            crosshairs: {
              width: 2,
              color: colors.s16,
              dashStyle: 'shortdot',
            },
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            series: {
              connectNulls: true,
              stickyTracking: false,
              tooltip: { snap: 20 },
            },
            line: {
              cursor: 'pointer',
              marker: {
                enabled: true,
                radius: 4,
                symbol: 'circle',
              },
              states: {
                hover: {
                  lineWidth: 2,
                },
              },
            },
          },
          credits: {
            enabled: false,
          },
          series: chartSeries.map((serie, index) => ({
            name: serie.label,
            yAxis: index,
            point: {
              events: {
                click() {
                  window[`${divId}`].series.forEach((series) => {
                    series.yAxis.update({ visible: false });
                  });
                  if (this.series.yAxis.visible === false) {
                    this.series.yAxis.update({ visible: true });
                  }
                },
              },
            },
            data: serie.data.map((data) => [Date.parse(data.day), data.value]),
          })),
        },
        (chart) => {
          setMinYAxisValue(chart);
          createTurnaroundBars(chart, turnaroundMarkers, divId);
          addAvailabilityBandsForAthlete[`${athleteId}`](chart);
          createEventMarkersForAthlete[`${athleteId}`](chart);
        }
      );
    };
  };

  $(() => {
    const athleteAnalysisChart = document.getElementsByClassName(
      'athlete_analysis_chart'
    );

    for (let i = 0; i < athleteAnalysisChart.length; i++) {
      initChart(athleteAnalysisChart.item(i));
    }
  });
};
