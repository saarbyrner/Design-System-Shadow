import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getWeekOfTrainingFilterOptions } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';

import WeekOfTrainingFilter from '../components/WeekOfTrainingFilter';

describe('<WeekOfTrainingFilter />', () => {
  const mockOptions = getWeekOfTrainingFilterOptions();
  beforeEach(() => {
    window.setFlag('rep-defense-bmt-mvp', true);
  });

  afterEach(() => {
    window.setFlag('rep-defense-bmt-mvp', false);
  });

  const props = {
    t: i18nextTranslateStub(),
    isPanelOpen: true,
    onSelectWeekOfTraining: jest.fn(),
    selectedWeekOfTraining: [],
  };
  it('renders the Week of Training filter selector', () => {
    renderWithStore(<WeekOfTrainingFilter {...props} />);

    expect(screen.getByLabelText('Week of Training')).toBeInTheDocument();
  });

  it('renders the available weeks of training type options', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <WeekOfTrainingFilter {...props} />
      </VirtuosoMockContext.Provider>
    );

    await user.click(screen.getByLabelText('Week of Training'));

    mockOptions.forEach((week) => {
      expect(screen.getAllByText(week.label)[0]).toBeVisible();
    });
  });

  it('calls props.onSelectWeekOfTraining when clicking on a week', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <WeekOfTrainingFilter {...props} />
      </VirtuosoMockContext.Provider>
    );

    await user.click(screen.getByLabelText('Week of Training'));

    await user.click(screen.getByText(mockOptions[1].label));

    expect(props.onSelectWeekOfTraining).toHaveBeenCalledWith([
      mockOptions[1].value,
    ]);
  });

  it('renders the filters prefilled from props', () => {
    const updatedProps = {
      ...props,
      selectedWeekOfTraining: [mockOptions[1].value, mockOptions[2].value],
    };

    renderWithStore(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <WeekOfTrainingFilter {...updatedProps} />
      </VirtuosoMockContext.Provider>
    );

    const selectedFilterString = [
      mockOptions[1].label,
      mockOptions[2].label,
    ].join(', ');

    expect(screen.getByText(selectedFilterString)).toBeVisible();
  });

  it('calls back with empty arrays on unmount', () => {
    const updatedProps = {
      ...props,
      selectedWeekOfTraining: [mockOptions[1].value, mockOptions[2].value],
    };
    const { unmount } = renderWithStore(
      <WeekOfTrainingFilter {...updatedProps} />
    );

    unmount();
    expect(props.onSelectWeekOfTraining).toHaveBeenCalledWith([]);
  });

  it('will not call back with empty arrays on unmount when noChangeOnUnload is true', () => {
    const updatedProps = {
      ...props,
      noChangeOnUnload: true,
      selectedWeekOfTraining: [mockOptions[1].value, mockOptions[2].value],
    };
    const { unmount } = renderWithStore(
      <WeekOfTrainingFilter {...updatedProps} />
    );

    unmount();
    expect(props.onSelectWeekOfTraining).not.toHaveBeenCalledWith([]);
  });
});
