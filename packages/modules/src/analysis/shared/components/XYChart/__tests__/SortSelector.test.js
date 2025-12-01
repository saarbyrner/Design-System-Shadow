import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { SORT_ORDER } from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import _cloneDeep from 'lodash/cloneDeep';
import { colors } from '@kitman/common/src/variables';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
// eslint-disable-next-line jest/no-mocks-import
import { MOCK_STATE_WITH_DATA } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import { REDUCER_KEY } from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import SortSelector from '../components/SortSelector';
import useChartContext from '../hooks/useChartContext';

jest.mock('../hooks/useChartContext');

describe('analysis shared|SortSelector', () => {
  const mockOnSortChange = jest.fn();

  const mockProps = {
    t: i18nextTranslateStub(),
    onSortChange: mockOnSortChange,
  };

  const renderComponent = (props = mockProps) => {
    const { mockedStore } = renderWithRedux(<SortSelector {...props} />, {
      useGlobalStore: false,
      preloadedState: MOCK_STATE_WITH_DATA,
    });

    return mockedStore;
  };

  const baseSeries = {
    '123_0': {
      id: '123_0',
      name: 'Availability',
      sortConfig: { sortBy: '', sortOrder: '' },
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be in the document', () => {
    useChartContext.mockReturnValueOnce({ series: baseSeries });
    renderComponent();
    expect(screen.queryByTestId('XYChart|SortSelector')).toBeInTheDocument();
  });

  it('should close the popover on clicking outside', async () => {
    const user = userEvent.setup();
    useChartContext.mockReturnValueOnce({ series: baseSeries });
    renderComponent();
    await user.click(screen.queryByTestId('XYChart|SortSelector'));

    await userEvent.click(document.body);

    expect(screen.queryByTestId('sort-selector-menu')).not.toBeInTheDocument();
  });

  it('should load in level 1 if sortConfig is null', async () => {
    const series = _cloneDeep(baseSeries);
    series['123_0'].sortConfig = null;
    useChartContext.mockReturnValue({ series });
    const user = userEvent.setup();

    renderComponent();
    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));

    expect(screen.getByText('Sort Data')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
  });

  it('should load in level 1 with multiple datasources if sortConfig is null', async () => {
    const user = userEvent.setup();
    const series = _cloneDeep(baseSeries);
    series['123_0'].sortConfig = null;
    series['123_1'] = {
      id: '123_1',
      name: 'Participation',
      sortConfig: null,
    };
    useChartContext.mockReturnValue({ series });
    renderComponent();
    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));

    expect(screen.getByText('Sort Data')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
    expect(screen.getByText('Participation')).toBeInTheDocument();
  });

  it('should load in level 2 with preselected sort order if sortConfig is not null', async () => {
    const user = userEvent.setup();
    const series = _cloneDeep(baseSeries);
    series['123_0'].sortConfig = {
      sortOrder: SORT_ORDER.ALPHABETICAL,
      sortBy: '123_0',
    };
    useChartContext.mockReturnValue({ series });
    renderComponent();
    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));

    expect(screen.queryByTestId(SORT_ORDER.ALPHABETICAL)).toHaveStyle({
      backgroundColor: colors.grey_100,
      color: colors.p06,
    });
  });

  it('should display sort options in Level 2', async () => {
    const user = userEvent.setup();

    const series = _cloneDeep(baseSeries);
    series['123_0'].sortConfig = {
      sortOrder: SORT_ORDER.ALPHABETICAL,
      sortBy: '123_0',
    };
    useChartContext.mockReturnValue({ series });

    renderComponent();

    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));

    expect(screen.getByText('High - Low')).toBeInTheDocument();
    expect(screen.getByText('Low - High')).toBeInTheDocument();
    expect(screen.getByText('A - Z')).toBeInTheDocument();
  });

  it('should include "Default" as an option when defaultSortFunction is undefined on the series', async () => {
    const user = userEvent.setup();

    const series = _cloneDeep(baseSeries);
    series['123_0'].defaultSortFunction = undefined;

    useChartContext.mockReturnValue({ series });

    renderComponent();

    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));

    await user.click(screen.getByText('Availability'));

    expect(screen.queryByText('Default')).toBeInTheDocument();
  });

  it('should include "Default" as an option when defaultSortFunction is not present on the series', async () => {
    const user = userEvent.setup();

    const series = _cloneDeep(baseSeries);

    useChartContext.mockReturnValue({ series });

    renderComponent();

    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));

    await user.click(screen.getByText('Availability'));

    expect(screen.queryByText('Default')).toBeInTheDocument();
  });

  it('includes "Default" as an option when defaultSortFunction is defined on the series', async () => {
    const user = userEvent.setup();

    const series = _cloneDeep(baseSeries);
    series['123_0'].defaultSortFunction = () => {};

    useChartContext.mockReturnValue({ series });

    renderComponent();

    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));

    await user.click(screen.getByText('Availability'));

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('should support switching back to level 1 from level 2', async () => {
    const user = userEvent.setup();

    const series = _cloneDeep(baseSeries);
    series['123_0'].sortConfig = {
      sortOrder: SORT_ORDER.ALPHABETICAL,
      sortBy: '123_0',
    };
    useChartContext.mockReturnValue({ series });

    renderComponent();

    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));
    await user.click(screen.queryByTestId('XYChart|SortSelector|Header'));

    expect(screen.getByText('Sort Data')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
  });

  it('invokes onSortChange when user changes sort order', async () => {
    const user = userEvent.setup();
    const propsWithConfig = {
      ...mockProps,
      chartId: 123,
    };

    const series = _cloneDeep(baseSeries);
    series['123_0'].sortConfig = {
      sortOrder: SORT_ORDER.ALPHABETICAL,
      sortBy: '123_0',
    };
    useChartContext.mockReturnValue({ series });

    renderComponent(propsWithConfig);

    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));
    await user.click(screen.getByText('Low - High'));

    expect(mockProps.onSortChange).toHaveBeenCalledWith({
      ...MOCK_STATE_WITH_DATA[REDUCER_KEY]['123'].config,
      sortConfig: { sortBy: '123_0', sortOrder: SORT_ORDER.LOW_TO_HIGH },
    });
  });
  it('invokes onSortChange without previous config when chartId is not present', async () => {
    const user = userEvent.setup();
    const propsWithoutConfig = {
      ...mockProps,
      chartId: undefined,
    };

    const series = _cloneDeep(baseSeries);
    series['123_0'].sortConfig = {
      sortOrder: SORT_ORDER.ALPHABETICAL,
      sortBy: '123_0',
    };
    useChartContext.mockReturnValue({ series });

    renderComponent(propsWithoutConfig);

    await user.click(screen.queryByTestId('XYChart|SortSelector|Button'));
    await user.click(screen.getByText('Low - High'));

    expect(mockProps.onSortChange).toHaveBeenCalledWith({
      sortConfig: { sortBy: '123_0', sortOrder: SORT_ORDER.LOW_TO_HIGH },
    });
  });
});
