import { render, screen } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import selectEvent from 'react-select-event';
import GameDaySelect from '../session/GameDaySelect';

const defaultProps = {
  gameDayMinus: -2,
  gameDayPlus: 3,
  onUpdateEventDetails: jest.fn(),
  t: i18nextTranslateStub(),
};

const renderElement = (props = defaultProps) => {
  return render(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 600, itemHeight: 25 }}
    >
      <GameDaySelect {...props} />
    </VirtuosoMockContext.Provider>
  );
};

describe('PlanningEventSidePanel <GameDaySelect /> component', () => {
  it('renders', () => {
    const wrapper = renderElement();
    expect(
      wrapper.getByText('#sport_specific__Game_Day_+/-')
    ).toBeInTheDocument();
  });

  it('calls onUpdateEventDetails with correct values when onChange triggered', async () => {
    renderElement({ ...defaultProps, gameDayPlus: 1, gameDayMinus: undefined });

    const select = screen.getByLabelText('#sport_specific__Game_Day_+/-');

    selectEvent.openMenu(select);

    await selectEvent.select(select, '-1');

    expect(defaultProps.onUpdateEventDetails).toHaveBeenCalledWith({
      game_day_minus: -1,
      game_day_plus: 1,
    });
  });

  describe('renders Select with expected disabled options', () => {
    beforeEach(() => {
      renderElement();

      selectEvent.openMenu(
        screen.getByLabelText('#sport_specific__Game_Day_+/-')
      );
    });

    const cases = [
      { value: 7, label: '+7', isDisabled: true },
      { value: 6, label: '+6', isDisabled: true },
      { value: 5, label: '+5', isDisabled: true },
      { value: 4, label: '+4', isDisabled: true },
      { value: 3, label: '+3', isDisabled: false }, // gameDayPlus = 3
      { value: 2, label: '+2', isDisabled: true },
      { value: 1, label: '+1', isDisabled: true },
      { value: 0, label: '0', isDisabled: true },
      { value: -1, label: '-1', isDisabled: true },
      { value: -2, label: '-2', isDisabled: false }, // gameDayMinus = -2
      { value: -3, label: '-3', isDisabled: true },
      { value: -4, label: '-4', isDisabled: true },
      { value: -5, label: '-5', isDisabled: true },
      { value: -6, label: '-6', isDisabled: true },
      { value: -7, label: '-7', isDisabled: true },
    ];

    it.each(cases)('$label renders correctly', ({ label, isDisabled }) => {
      const element = screen.getByTitle(label).parentElement;
      const expectedClassName = isDisabled
        ? 'kitmanReactSelect__option--is-disabled'
        : 'kitmanReactSelect__option';
      expect(element).toHaveClass(expectedClassName);
    });
  });

  describe('renders Select with all options enabled', () => {
    beforeEach(() => {
      renderElement({
        ...defaultProps,
        gameDayMinus: undefined,
        gameDayPlus: undefined,
      });

      selectEvent.openMenu(
        screen.getByLabelText('#sport_specific__Game_Day_+/-')
      );
    });

    const cases = [
      { value: 7, label: '+7', isDisabled: false },
      { value: 6, label: '+6', isDisabled: false },
      { value: 5, label: '+5', isDisabled: false },
      { value: 4, label: '+4', isDisabled: false },
      { value: 3, label: '+3', isDisabled: false },
      { value: 2, label: '+2', isDisabled: false },
      { value: 1, label: '+1', isDisabled: false },
      { value: 0, label: '0', isDisabled: false },
      { value: -1, label: '-1', isDisabled: false },
      { value: -2, label: '-2', isDisabled: false },
      { value: -3, label: '-3', isDisabled: false },
      { value: -4, label: '-4', isDisabled: false },
      { value: -5, label: '-5', isDisabled: false },
      { value: -6, label: '-6', isDisabled: false },
      { value: -7, label: '-7', isDisabled: false },
    ];

    it.each(cases)('$label renders correctly', ({ label, isDisabled }) => {
      const element = screen.getByTitle(label).parentElement;
      const expectedClassName = isDisabled
        ? 'kitmanReactSelect__option--is-disabled'
        : 'kitmanReactSelect__option';
      expect(element).toHaveClass(expectedClassName);
    });
  });
});
