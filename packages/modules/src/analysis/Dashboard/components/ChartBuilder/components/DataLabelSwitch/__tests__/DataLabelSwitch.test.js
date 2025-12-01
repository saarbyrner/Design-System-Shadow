import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { updateChartConfig } from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import DataLabelSwitch from '../index';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: (args) => jest.fn(args),
}));

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder',
  () => ({
    updateChartConfig: jest.fn((args) => ({
      type: 'chartBuilder/updateChartConfig',
      payload: args,
    })),
  })
);

const getWidgetData = (checked = true) => ({
  id: 123,
  chart_id: 1234,
  config: {
    show_labels: checked,
  },
});

describe('analysis dashboard | <DataLabelSwitch />', () => {
  const onUpdateChartWidget = jest.fn();
  const props = {
    t: i18nextTranslateStub(),
    onUpdateChartWidget,
    widget: getWidgetData(),
  };

  describe('switch with label', () => {
    const TEST_LABEL = 'Data labels';

    it('renders switch with label and checked property', () => {
      renderWithStore(<DataLabelSwitch {...props} />);

      expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('triggers onUpdateChartWidget when clicked', async () => {
      const user = userEvent.setup();
      renderWithStore(<DataLabelSwitch {...props} />);

      expect(screen.getByRole('checkbox')).toBeChecked();

      await user.click(screen.getByRole('checkbox'));
      expect(onUpdateChartWidget).toHaveBeenCalledWith({ show_labels: false });
    });

    it('renders switch with unchecked property', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <DataLabelSwitch {...props} widget={getWidgetData(false)} />
      );

      expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toBeChecked();

      await user.click(screen.getByRole('checkbox'));
      expect(onUpdateChartWidget).toHaveBeenCalledWith({ show_labels: true });
    });
  });

  describe('redux actions', () => {
    it('calls updateChartConfig with the expected chart_id', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <DataLabelSwitch {...props} widget={getWidgetData(false)} />
      );

      expect(screen.getByRole('checkbox')).not.toBeChecked();
      await user.click(screen.getByRole('checkbox'));

      expect(updateChartConfig).toHaveBeenCalledWith({
        chartId: 1234,
        partialConfig: { show_labels: true },
      });
      expect(updateChartConfig).toHaveBeenCalledTimes(1);
    });
  });
});
