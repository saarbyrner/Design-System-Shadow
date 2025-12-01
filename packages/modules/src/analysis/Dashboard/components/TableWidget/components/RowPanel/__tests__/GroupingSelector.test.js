import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  EDIT_GROUPING_KEY,
  NO_GROUPING,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import GroupingSelector from '../components/GroupingSelector';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder');
const onSelectedGrouping = jest.fn();

describe('Table Widget | RowPanel: <GroupingSelector />', () => {
  const mockProps = {
    isLoading: false,
    onSelectGroupings: onSelectedGrouping,
    selectedGrouping: 'athlete_id',
    options: [
      {
        label: 'Athlete',
        value: 'athlete_id',
      },
      {
        label: 'Squad',
        value: 'squad',
      },
      {
        label: 'No grouping',
        value: 'no_grouping',
      },
    ],
    t: i18nextTranslateStub(),
  };

  it('renders the selector label', () => {
    render(<GroupingSelector {...mockProps} />);

    expect(screen.getByText('Group by')).toBeVisible();
  });

  it('renders the selected populations', () => {
    render(<GroupingSelector {...mockProps} />);

    expect(screen.getByText('Athlete')).toBeVisible();
  });

  it('calls "onSelectedGrouping" with the expected arguments', async () => {
    const user = userEvent.setup();
    render(<GroupingSelector {...mockProps} />);

    const groupBySelectors = screen.getAllByLabelText('Group by');

    await user.click(groupBySelectors[0]);
    await user.click(screen.getByText('Squad'));

    expect(onSelectedGrouping).toHaveBeenCalledWith({
      0: 'squad',
    });
  });

  it('calls "onSelectGroupings" with the expected arguments when isHistoric is true', async () => {
    render(<GroupingSelector {...mockProps} isHistoric />);

    expect(onSelectedGrouping).toHaveBeenCalledWith({
      [EDIT_GROUPING_KEY]: NO_GROUPING,
    });
  });
});
