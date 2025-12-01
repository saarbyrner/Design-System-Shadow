import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import GraphTypeButtons from '..';

describe('Graph Composer <GraphTypeButtons /> component', () => {
  const props = {
    graphGroup: 'longitudinal',
    graphType: 'line',
    updateGraphType: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows an active state on the selected graph button', () => {
    const { container } = render(
      <GraphTypeButtons {...props} graphType="line" />
    );

    const graphTypeOptions = container.querySelector(
      '.graphView__graphTypeOptions'
    );
    expect(graphTypeOptions).toBeInTheDocument();

    const iconButtons = container.querySelectorAll('.graphView__graphTypeBtn');
    expect(iconButtons.length).toBeGreaterThan(0);
  });

  it('calls updateGraphType() when clicking a button', async () => {
    const user = userEvent.setup();
    const { container } = render(<GraphTypeButtons {...props} />);

    const iconButtons = container.querySelectorAll(
      '.graphView__graphTypeBtn button'
    );
    expect(iconButtons.length).toBeGreaterThan(1);

    await user.click(iconButtons[0]);
    expect(props.updateGraphType).toHaveBeenCalledWith('line');

    await user.click(iconButtons[1]);
    expect(props.updateGraphType).toHaveBeenCalledWith('column');
  });

  describe('when the graph group is longitudinal', () => {
    it('renders the right button list', () => {
      const { container } = render(
        <GraphTypeButtons {...props} graphGroup="longitudinal" />
      );

      const iconButtons = container.querySelectorAll(
        '.graphView__graphTypeBtn'
      );
      expect(iconButtons).toHaveLength(5);
    });
  });

  describe('when the graph group is summary', () => {
    it('renders the right button list', () => {
      const { container } = render(
        <GraphTypeButtons {...props} graphGroup="summary" />
      );

      const iconButtons = container.querySelectorAll(
        '.graphView__graphTypeBtn'
      );
      expect(iconButtons).toHaveLength(3);
    });
  });

  describe('when the graph group is summary_bar', () => {
    it('renders the right button list', () => {
      const { container } = render(
        <GraphTypeButtons {...props} graphGroup="summary_bar" />
      );

      const iconButtons = container.querySelectorAll(
        '.graphView__graphTypeBtn'
      );
      expect(iconButtons).toHaveLength(3);
    });
  });

  describe('when the graph group is summary_donut', () => {
    it('renders the right button list', () => {
      const { container } = render(
        <GraphTypeButtons {...props} graphGroup="summary_donut" />
      );

      const iconButtons = container.querySelectorAll(
        '.graphView__graphTypeBtn'
      );
      expect(iconButtons).toHaveLength(3);
    });
  });

  describe('when the graph group is summary_stack_bar', () => {
    it('renders the right button list', () => {
      const { container } = render(
        <GraphTypeButtons {...props} graphGroup="summary_stack_bar" />
      );

      const iconButtons = container.querySelectorAll(
        '.graphView__graphTypeBtn'
      );
      expect(iconButtons).toHaveLength(2);
    });
  });

  describe('when the graph group is value_visualisation', () => {
    it('renders the right button list', () => {
      const { container } = render(
        <GraphTypeButtons {...props} graphGroup="value_visualisation" />
      );

      const iconButtons = container.querySelectorAll(
        '.graphView__graphTypeBtn'
      );
      expect(iconButtons).toHaveLength(2);
    });
  });
});
