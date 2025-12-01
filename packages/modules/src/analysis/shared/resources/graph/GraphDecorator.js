import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { colors } from '@kitman/common/src/variables';
import i18n from '@kitman/common/src/utils/i18n';

HighchartsNoDataToDisplay(Highcharts);

export default (data, decoratorType, graphType) => {
  const formattedData = data.map((decorator) => ({
    x: decorator.date,
    y: 1,
    color: decorator.has_unavailability ? colors.s11 : colors.s15,
    events: decorator.events,
  }));

  return {
    yAxis: 0,
    type: 'line',
    name: 'Decorators',
    data: formattedData,
    dataLabels: {
      enabled: true,
      useHTML: true,
      verticalAlign: 'top',
      crop: false,
      overflow: 'none',
      x: graphType === 'bar' ? -30 : 0,
      y: graphType === 'bar' ? 15 : -15,
      // eslint-disable-next-line object-shorthand, func-names
      formatter: function () {
        let iconClass = '';
        if (decoratorType === 'ILLNESS') {
          iconClass =
            'graphComposerDecoratorLabel__icon--illness icon-thermometer';
        } else if (decoratorType === 'INJURY') {
          iconClass = 'icon-healthcare';
        }

        return `
          <div class="graphComposerDecoratorLabel ${
            graphType === 'bar' ? 'graphComposerDecoratorLabel--barGraph' : ''
          }">
            <span class="graphComposerDecoratorLabel__counter">${
              this.point.events.length
            }</span>
            <span style='color:${
              this.color
            }' class="graphComposerDecoratorLabel__icon ${iconClass}"></span>
          </div>
        `;
      },
    },
    tooltip: {
      headerFormat: '',
      pointFormatter() {
        const date = Highcharts.dateFormat('%e %b %Y', new Date(this.x));
        let eventList = '';
        this.events.forEach((event) => {
          eventList += `<li>
            <strong class="graphComposerEventTooltip__athleteName">
              ${event.athlete_name}
            </strong>
            <p class="graphComposerEventTooltip__details">
              ${event.description}
              </br>
              ${event.status} (${event.days} ${i18n.t('day', {
            count: event.days,
          })})
              </br>
              ${
                event.caused_unavailability
                  ? `
                ${i18n.t(
                  'Caused'
                )} <span class="graphComposerEventTooltip__unavailibility">${i18n.t(
                      'unavailability'
                    )}</span>
              `
                  : ''
              }
            </p>
          </li>`;
        });

        return `<div class="graphComposerEventTooltip">
          <div class="graphComposerEventTooltip__date">${date}</div>
          <ul class="graphComposerEventTooltip__eventList">${eventList}</ul>
        </div>`;
      },
    },
    lineWidth: 0,
    marker: {
      enabled: false,
      states: {
        hover: {
          enabled: false,
        },
      },
    },
    states: {
      hover: {
        lineWidthPlus: 0,
      },
      halo: {
        opacity: 0,
        size: 0,
      },
    },
    dataGrouping: {
      enabled: false,
    },
  };
};
