import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/updateWidget';
import updateWidget from '../updateWidget';

describe('updateWidget', () => {
  it('calls the correct endpoint and returns the correct data', async () => {
    const returnedData = await updateWidget({
      widgetId: 12,
      containerId: 1234,
      containerType: 'AnalyticalDashboard',
      widget: {
        type: 'chart',
      },
    });

    expect(returnedData).toEqual({
      container_widget: {
        ...serverResponse.container_widget,
        widget_type: 'chart',
        widget: {
          type: 'chart',
        },
        widget_render: {
          type: 'chart',
        },
      },
    });
  });
});
