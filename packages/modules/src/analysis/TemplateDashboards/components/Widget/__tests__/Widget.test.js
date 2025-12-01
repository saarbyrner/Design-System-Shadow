import { screen, waitFor } from '@testing-library/react';
import { server } from '@kitman/services/src/mocks/server';
import { waitForRequest } from '@kitman/services/src/mocks/utils';
import { data } from '@kitman/services/src/mocks/handlers/analysis/getData';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Widget from '../index';
import { render } from '../../../testUtils';
import * as services from '../../../redux/services/templateDashboards';

const requestSpy = jest.fn();
const props = {
  t: i18nextTranslateStub(),
};

describe('TemplateDashboards|<Widget />', () => {
  beforeAll(() => {
    server.events.on('request:start', requestSpy);
  });

  beforeEach(() => {
    requestSpy.mockClear();
  });

  afterAll(() => {
    server.events.removeAllListeners();
  });

  it('renders with a widget title', () => {
    const updatedProps = {
      ...props,
      widget: { id: 123, chart_type: 'value', title: 'This is my widget' },
    };
    render(<Widget {...updatedProps} />);

    expect(screen.queryByText('This is my widget')).toBeVisible();
  });

  it('passes the correct parameters to the getData service', async () => {
    const updatedProps = {
      ...props,
      widget: {
        id: 123,
        chart_type: 'value',
        title: 'This is my widget',
        calculation: 'sum',
        data_source_type: 'Medical',
        input_params: {
          id: 123,
        },
        config: {
          foo: 'bar',
        },
        overlays: [],
      },
    };
    render(
      <Widget {...updatedProps} />,
      {},
      {
        templateDashboardsFilter: {
          isEditModeActive: false,
          editable: {
            population: {
              applies_to_squad: false,
              all_squads: false,
              position_groups: [],
              positions: [],
              athletes: [1, 2],
              squads: [],
              context_squads: [],
            },
            timescope: {
              time_period: 'today',
            },
          },
          active: {
            population: {
              applies_to_squad: false,
              all_squads: false,
              position_groups: [],
              positions: [],
              athletes: [1, 2],
              squads: [],
              context_squads: [],
            },
            timescope: {
              time_period: 'today',
            },
          },
        },
      }
    );

    const request = await waitForRequest('POST', '/reporting/charts/preview');

    expect(request.body).toStrictEqual({
      id: 123,
      chart_type: 'value',
      chart_elements: [
        {
          calculation: 'sum',
          data_source_type: 'Medical',
          input_params: { id: 123 },
          config: { foo: 'bar' },
          overlays: [],
          population: {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [],
            athletes: [1, 2],
            squads: [],
            context_squads: [],
          },
          time_scope: {
            time_period: 'today',
          },
        },
      ],
    });
  });

  it('renders the loading state when fetching data', async () => {
    const updatedProps = {
      ...props,
      widget: { id: 123, chart_type: 'value', title: 'This is my widget' },
    };
    render(<Widget {...updatedProps} />);

    expect(
      screen.queryByTestId('TemplateDashboards|Card.Loading')
    ).toBeVisible();

    await waitForRequest('POST', '/reporting/charts/preview');

    // And gets removed
    await waitFor(() => {
      expect(
        screen.queryByTestId('TemplateDashboards|Card.Loading')
      ).not.toBeInTheDocument();
    });
  });

  describe('Widget content', () => {
    it('renders value widget for chart type value', async () => {
      const value = data.value[0].value;
      const updatedProps = {
        ...props,
        widget: { id: 123, chart_type: 'value', title: 'This is my widget' },
      };
      render(<Widget {...updatedProps} />);

      await waitFor(() => {
        expect(screen.queryByText(value)).toBeInTheDocument();
      });
    });
  });

  describe('Widget content with error object', () => {
    beforeEach(() => {
      jest.spyOn(services, 'useGetDataQuery').mockReturnValue({
        data: [
          {
            id: '9',
            error: 'User not allowed to display protected data',
            status: 403,
          },
        ],
        isFetching: false,
      });
    });
    it('renders value widget for chart type value', async () => {
      const updatedProps = {
        ...props,
        widget: { id: 123, chart_type: 'value', title: 'This is my widget' },
      };
      render(<Widget {...updatedProps} />);

      await waitFor(() => {
        expect(screen.queryByText('-')).toBeInTheDocument();
      });
    });
  });
});
