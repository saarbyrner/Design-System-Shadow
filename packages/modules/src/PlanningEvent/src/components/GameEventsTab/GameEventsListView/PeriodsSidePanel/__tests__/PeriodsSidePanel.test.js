import { render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import PeriodsSidePanel from '../PeriodsSidePanel';

describe('PeriodsSidePanel', () => {
  let component;

  const props = {
    event: {
      id: 1,
    },
    formationChanges: [
      {
        id: 1,
        kind: 'formation_change',
        absolute_minute: 0,
        relation: { id: 1, name: '4-4-2' },
        game_period_id: 1,
      },
      {
        id: 2,
        kind: 'formation_change',
        absolute_minute: 45,
        relation: { id: 2, name: '4-3-3' },
        game_period_id: 2,
      },
      {
        id: 3,
        kind: 'formation_change',
        absolute_minute: 90,
        relation: { id: 3, name: '4-3-1' },
        game_period_id: 3,
      },
      {
        id: 4,
        kind: 'formation_change',
        absolute_minute: 105,
        relation: { id: 4, name: '4-3-9' },
        game_period_id: 4,
      },
      {
        id: 5,
        kind: 'formation_change',
        absolute_minute: 30,
        relation: { id: 1, name: '4-3-4' },
        game_period_id: 1,
      },
    ],
    t: i18nextTranslateStub(),
    periods: [
      {
        id: 3,
        name: 'Extra Time 1st Half',
        duration: 15,
        additional_duration: null,
        order: 3,
      },
      {
        id: 1,
        name: '1st Half',
        duration: 45,
        additional_duration: 5,
        order: 1,
      },
      {
        id: 2,
        name: '2nd Half',
        duration: 45,
        additional_duration: 2,
        order: 2,
      },
      {
        id: 4,
        name: 'Extra Time 2nd Half',
        duration: 15,
        additional_duration: 2,
        order: 4,
      },
    ],
    onSelectPeriod: jest.fn(),
    onClickAddPeriod: jest.fn(),
    onDuplicate: jest.fn(),
    setIsPeriodsPanelOpen: jest.fn(),
    onSelectSummary: jest.fn(),
  };

  const renderComponent = (renderProps) =>
    render(<PeriodsSidePanel {...renderProps} />);

  describe('render', () => {
    beforeEach(() => {
      component = renderComponent(props);
    });

    it('renders the game summary', () => {
      expect(component.getByText('Game summary')).toBeInTheDocument();
      expect(component.getByText('120 mins')).toBeInTheDocument();
    });

    it('renders the period titles', () => {
      expect(component.getByText('1st Half')).toBeInTheDocument();
      expect(component.getByText('2nd Half')).toBeInTheDocument();
      expect(component.getByText('Extra Time 1st Half')).toBeInTheDocument();
      expect(component.getByText('Extra Time 2nd Half')).toBeInTheDocument();
    });

    it('renders the add period button', () => {
      expect(component.getByText('Add Period')).toBeInTheDocument();
    });

    it('calls onSelectPeriod when a period is selected', async () => {
      await userEvent.click(component.getByText('1st Half'));
      expect(props.onSelectPeriod).toHaveBeenCalledWith({
        additional_duration: 5,
        duration: 45,
        id: 1,
        name: '1st Half',
        order: 1,
      });
    });

    it('calls onClickAddPeriod when add period is selected', async () => {
      await userEvent.click(component.getByText('Add Period'));
      expect(props.onClickAddPeriod).toHaveBeenCalled();
    });

    it('calls onDuplicate when a duplicate icon is selected', async () => {
      await userEvent.click(component.getByTestId('duplicate-icon-4'));
      expect(props.onDuplicate).toHaveBeenCalledWith({
        additional_duration: 2,
        duration: 15,
        id: 4,
        name: 'Extra Time 2nd Half',
        order: 4,
      });
    });

    it('calls setIsPeriodsPanelOpen when a the close icon is selected', async () => {
      await userEvent.click(
        component.getByTestId('periods-side-panel-close-icon')
      );
      expect(props.onSelectSummary).toHaveBeenCalled();
      expect(props.setIsPeriodsPanelOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('Local Id Render', () => {
    beforeEach(() => {
      component = renderComponent({
        ...props,
        periods: [
          {
            localId: 3,
            name: '1st Half',
            duration: 15,
            additional_duration: null,
            order: 3,
          },
        ],
      });
    });

    it('renders the respective period', () => {
      expect(component.getByText('1st Half')).toBeInTheDocument();
    });
  });

  describe('Pitch View Enabled', () => {
    beforeEach(() => {
      component = renderComponent({
        ...props,
        pitchViewEnabled: true,
      });
    });

    it('does not render the add period button', () => {
      expect(component.queryByText('Add Period')).not.toBeInTheDocument();
    });
  });
});
