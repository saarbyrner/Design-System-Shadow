import { screen } from '@testing-library/react';
import * as Redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import {
  REDUCER_KEY,
  initialState,
  addRenderOptions,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
// eslint-disable-next-line jest/no-mocks-import
import { MOCK_CHART_ELEMENTS } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import {
  getVisualisationOptions,
  getPieVisualisationOptions,
} from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/utils';
import SeriesVisualisationModule from '..';

describe('analysis dashboard | <SeriesVisualisationModule />', () => {
  const mockDispatch = jest.fn();

  const visualisationOptions = getVisualisationOptions();
  const pieVisualisationOptions = getPieVisualisationOptions();

  const props = {
    widgetId: '1',
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders all of the visualisationOptions labels for xy charts', () => {
    renderWithStore(<SeriesVisualisationModule {...props} />);
    visualisationOptions.forEach((option) => {
      expect(screen.getByRole('button', { name: option.label })).toBeVisible();
    });
  });

  it('renders the visualisationOptions labels for pie charts', () => {
    renderWithStore(
      <SeriesVisualisationModule {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          activeWidgets: {
            1: {
              widget: {
                chart_type: CHART_TYPE.pie,
              },
            },
          },
        },
      }
    );
    pieVisualisationOptions.forEach((option) => {
      expect(screen.getByRole('button', { name: option.label })).toBeVisible();
    });
  });

  it('disables the button if visualisationOptions isEnabled = false', () => {
    renderWithStore(<SeriesVisualisationModule {...props} />);

    visualisationOptions.forEach((option) => {
      if (!option.isEnabled) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(
          screen.getByRole('button', { name: option.label })
        ).toHaveAttribute('aria-disabled', 'true');
      }
    });
  });

  it('dispatches addRenderOptions when selecting an enabled button', async () => {
    const user = userEvent.setup();
    renderWithStore(<SeriesVisualisationModule {...props} />);

    const columnButton = screen.getByRole('button', {
      name: visualisationOptions[0].label,
    });

    await user.click(columnButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      addRenderOptions({ key: 'type', value: visualisationOptions[0].value })
    );
  });

  it('disables the bar option when a bar series has already been configured', () => {
    renderWithStore(
      <SeriesVisualisationModule {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          activeWidgets: {
            1: {
              widget: {
                chart_elements: [{ ...MOCK_CHART_ELEMENTS[0] }], // bar series
              },
            },
          },
        },
      }
    );

    const barOption = screen.getByRole('button', { name: 'Bar' });

    expect(barOption).toHaveAttribute('aria-disabled', 'true');
  });

  describe('when the rep-charts-configure-axis feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag('rep-charts-configure-axis', true);
    });

    afterEach(() => {
      window.setFlag('rep-charts-configure-axis', false);
    });

    it('renders the axis config options', () => {
      renderWithStore(<SeriesVisualisationModule {...props} />);

      expect(screen.getByLabelText('Left axis')).toBeInTheDocument();
      expect(screen.getByLabelText('Right axis')).toBeInTheDocument();
    });

    it('renders the radio button checked from state', () => {
      renderWithStore(
        <SeriesVisualisationModule {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                widget: {
                  chart_elements: [{ ...MOCK_CHART_ELEMENTS[0] }],
                },
              },
            },
            dataSourceSidePanel: {
              dataSourceFormState: {
                config: {
                  render_options: {
                    axis_config: 'left',
                  },
                },
              },
            },
          },
        }
      );

      const radioButtons = screen.getAllByRole('radio');

      expect(radioButtons[0]).toBeChecked(); // left option checked
    });

    it('dispatches the correct action when selecting a axis config', async () => {
      const user = userEvent.setup();

      renderWithStore(<SeriesVisualisationModule {...props} />);

      const radioButtons = screen.getAllByRole('radio');

      await user.click(radioButtons[0]); // click left option

      expect(mockDispatch).toHaveBeenCalledWith(
        addRenderOptions({ key: 'axis_config', value: 'left' })
      );
    });
  });

  describe('when the rep-charts-configure-axis feature flag is disabled', () => {
    beforeAll(() => {
      window.setFlag('rep-charts-configure-axis', false);
    });

    it('hides the axis config options', () => {
      renderWithStore(<SeriesVisualisationModule {...props} />);

      expect(screen.queryByLabelText('Left axis')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Right axis')).not.toBeInTheDocument();
    });
  });
});
