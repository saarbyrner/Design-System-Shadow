import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Redux from 'react-redux';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { updateInheritGroupings } from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
import { INHERIT_GROUPING } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import { FormulaGroupingSectionTranslated as FormulaGroupingSection } from '..';

const defaultProps = {
  canGoPrevious: false,
  widgetId: 1,
  input: {
    dataSource: { type: 'TableMetric' },
  },
  formattedData: {},
  addDataSourceGrouping: jest.fn(),
};

const renderComponent = (props = defaultProps) =>
  renderWithStore(<FormulaGroupingSection {...props} />);

describe('<FormulaGroupingSection />', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders the GroupingSection header', () => {
    renderComponent();

    expect(screen.getByText('Groupings')).toBeVisible();
  });

  it('renders the inherit grouping switch when canGoPrevious is true', () => {
    renderComponent({
      ...defaultProps,
      canGoPrevious: true,
    });

    expect(screen.getByText('Inherit grouping from value')).toBeVisible();
    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    expect(screen.getByLabelText('No')).toBeInTheDocument();
  });

  it('dispatches updateInheritGroupings with right payload when "No" is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      canGoPrevious: true,
    });

    const noOption = screen.getByLabelText('No');

    await user.click(noOption);
    expect(mockDispatch).toHaveBeenCalledWith(
      updateInheritGroupings(INHERIT_GROUPING.no)
    );
  });

  it('dispatches updateInheritGroupings with right payload when "Yes" is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      canGoPrevious: true,
    });

    const noOption = screen.getByLabelText('Yes');

    await user.click(noOption);
    expect(mockDispatch).toHaveBeenCalledWith(
      updateInheritGroupings(INHERIT_GROUPING.yes)
    );
  });
});
