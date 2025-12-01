import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/addWidget';
import addWidget from '../addWidget';

describe('addWidget', () => {
  it('calls the correct endpoint and returns the correct data', async () => {
    const returnedData = await addWidget({
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
