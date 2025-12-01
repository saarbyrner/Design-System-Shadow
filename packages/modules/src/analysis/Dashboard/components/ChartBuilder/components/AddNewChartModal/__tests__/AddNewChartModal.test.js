import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as ChartBuilderSlice from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { saveWidgetSuccess } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import { getDashboardLayout } from '@kitman/modules/src/analysis/Dashboard/redux/actions/dashboard';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import AddNewChartModal from '../index';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets'
    ),
    saveWidgetSuccess: jest.fn(() => ({
      type: 'SAVE_WIDGET_SUCCESS',
      payload: { widget: { type: 'graph' } },
    })),
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/actions/dashboard',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/actions/dashboard'
    ),
    getDashboardLayout: jest.fn(() => ({
      type: 'GET_DASHBOARD_LAYOUT',
      payload: [{ widget: { type: 'graph' } }],
    })),
  })
);

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('analysis dashboard | <AddNewChartModal />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  const mockBeginWidgetEditMode = jest.fn();
  const trackEventMock = jest.fn();

  beforeEach(() => {
    jest
      .spyOn(ChartBuilderSlice, 'beginWidgetEditMode')
      .mockReturnValue(mockBeginWidgetEditMode);
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  afterEach(() => {
    window.setFlag('rep-charts-pie-donut', false);
  });

  it('is not visible by default', async () => {
    renderWithStore(<AddNewChartModal {...props} />);

    await expect(screen.queryByText('New Chart')).not.toBeInTheDocument();
  });

  it('is visible when chartBuilder.isOpen is set to true', async () => {
    renderWithStore(
      <AddNewChartModal {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          newChartModal: { ...initialState.newChartModal, isOpen: true },
        },
      }
    );

    await expect(
      screen.queryByText('Select a chart type to begin with...')
    ).toBeVisible();
  });

  it('closes without saving when clicking cancel', async () => {
    renderWithStore(
      <AddNewChartModal {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          newChartModal: { ...initialState.newChartModal, isOpen: true },
        },
      }
    );

    await expect(
      screen.queryByText('Select a chart type to begin with...')
    ).toBeVisible();

    await userEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(
        screen.queryByText('Select a chart type to begin with...')
      ).not.toBeVisible();
    });

    expect(saveWidgetSuccess).not.toHaveBeenCalled();
  });

  it('saves the new widget, calls dashboard layout and closes the modal when clicking save', async () => {
    renderWithStore(
      <AddNewChartModal {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          newChartModal: { ...initialState.newChartModal, isOpen: true },
        },
      }
    );

    await expect(
      screen.queryByText('Select a chart type to begin with...')
    ).toBeVisible();

    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(
        screen.queryByText('Select a chart type to begin with...')
      ).not.toBeInTheDocument();
    });
    expect(saveWidgetSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        widget: { chart_type: 'value', name: 'Value', type: 'chart' },
      })
    );
    expect(getDashboardLayout).toHaveBeenCalledWith([
      expect.objectContaining({
        widget: { chart_type: 'value', name: 'Value', type: 'chart' },
      }),
    ]);
  });

  it('saves the new xy widget and closes the modal when clicking save', async () => {
    renderWithStore(
      <AddNewChartModal {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          newChartModal: { ...initialState.newChartModal, isOpen: true },
        },
      }
    );

    await expect(
      screen.queryByText('Select a chart type to begin with...')
    ).toBeVisible();

    await userEvent.click(screen.getByText('X and Y chart'));

    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(
        screen.queryByText('Select a chart type to begin with...')
      ).not.toBeInTheDocument();
    });
    expect(saveWidgetSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        widget: { chart_type: 'xy', name: 'X and Y chart', type: 'chart' },
      })
    );
  });

  it('saves the new pie widget and closes the modal when clicking save', async () => {
    window.setFlag('rep-charts-pie-donut', true);

    renderWithStore(
      <AddNewChartModal {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          newChartModal: { ...initialState.newChartModal, isOpen: true },
        },
      }
    );

    await expect(
      screen.queryByText('Select a chart type to begin with...')
    ).toBeVisible();

    await userEvent.click(screen.getByText('Pie and donut chart'));

    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(
        screen.queryByText('Select a chart type to begin with...')
      ).not.toBeInTheDocument();
    });
    expect(saveWidgetSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        widget: {
          chart_type: 'pie',
          name: 'Pie and donut chart',
          type: 'chart',
        },
      })
    );
  });

  it('dispatchs beginWidgetEditMode on save', async () => {
    renderWithStore(
      <AddNewChartModal {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          newChartModal: { ...initialState.newChartModal, isOpen: true },
        },
      }
    );

    await expect(
      screen.queryByText('Select a chart type to begin with...')
    ).toBeVisible();

    await userEvent.click(screen.getByText('X and Y chart'));

    await userEvent.click(screen.getByText('Save'));

    expect(mockBeginWidgetEditMode).toHaveBeenCalled();
  });

  it('renders a radio group with an option for each core chart type', async () => {
    renderWithStore(
      <AddNewChartModal {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          newChartModal: { ...initialState.newChartModal, isOpen: true },
        },
      }
    );

    await expect(
      screen.queryByText('Select a chart type to begin with...')
    ).toBeVisible();

    ['Value', 'X and Y Chart'].forEach((chartType) => {
      expect(
        screen.queryByRole('radio', { name: new RegExp(chartType, 'i') })
      ).toBeInTheDocument();
    });
  });

  it('calls trackEvent with correct data', async () => {
    renderWithStore(
      <AddNewChartModal {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          newChartModal: { ...initialState.newChartModal, isOpen: true },
        },
      }
    );

    await expect(
      screen.queryByText('Select a chart type to begin with...')
    ).toBeVisible();

    await userEvent.click(screen.getByText('X and Y chart'));

    await userEvent.click(screen.getByText('Save'));

    expect(trackEventMock).toHaveBeenCalledWith('Add Chart Widget', {
      chartType: 'xy',
    });
  });
});
