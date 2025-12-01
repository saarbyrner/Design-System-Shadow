import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GraphSelector from '..';

describe('Graph Composer <GraphSelector /> component', () => {
  const props = {
    graphType: 'line',
    graphGroup: 'longitudinal',
    selectGraph: jest.fn(),
    canAccessMedicalGraph: true,
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    render(<GraphSelector {...props} />);
    expect(screen.getByText('Longitudinal Graphs')).toBeInTheDocument();
    expect(screen.getByText('Summary Graphs')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('shows graph buttons', () => {
    render(<GraphSelector {...props} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(13);
  });

  describe('when clicking a graph button', () => {
    it('shows an active state on the selected graph button', () => {
      // Test line graph button active
      render(<GraphSelector {...props} graphType="line" />);
      const buttons = screen.getAllByRole('button');

      // Line button should have active state
      expect(buttons[0]).toHaveClass('iconButton--isActive');
      // Other buttons should not have active state
      expect(buttons[1]).not.toHaveClass('iconButton--isActive');
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click line graph button (first button)
      await user.click(buttons[0]);
      expect(props.selectGraph).toHaveBeenCalledWith('line', 'longitudinal');

      // Click column graph button (second button)
      await user.click(buttons[1]);
      expect(props.selectGraph).toHaveBeenCalledWith('column', 'longitudinal');
    });
  });

  describe('summary column graph button', () => {
    it('shows an active state when the summary column graph is selected', () => {
      render(
        <GraphSelector {...props} graphType="column" graphGroup="summary_bar" />
      );
      const buttons = screen.getAllByRole('button');

      // Summary column button (index 6) should have active state
      expect(buttons[6]).toHaveClass('iconButton--isActive');
      // Longitudinal column button (index 1) should not have active state
      expect(buttons[1]).not.toHaveClass('iconButton--isActive');
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click summary column graph button (7th button - index 6)
      await user.click(buttons[6]);
      expect(props.selectGraph).toHaveBeenCalledWith('column', 'summary_bar');
    });
  });

  describe('summary donut graph button', () => {
    it('shows an active state when the summary donut graph is selected', () => {
      render(
        <GraphSelector
          {...props}
          graphType="donut"
          graphGroup="summary_donut"
        />
      );
      const buttons = screen.getAllByRole('button');

      // Donut button (index 10) should have active state
      expect(buttons[10]).toHaveClass('iconButton--isActive');
      // Other buttons should not have active state
      expect(buttons[0]).not.toHaveClass('iconButton--isActive');
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click summary donut graph button (11th button - index 10)
      await user.click(buttons[10]);
      expect(props.selectGraph).toHaveBeenCalledWith('donut', 'summary_donut');
    });
  });

  describe("when the user doesn't have medical-graphing permission", () => {
    it("doesn't show medical graph buttons", () => {
      render(<GraphSelector {...props} canAccessMedicalGraph={false} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(9);
    });
  });

  describe('summary stack column graph button', () => {
    it('shows an active state when the summary stack column graph is selected', () => {
      render(
        <GraphSelector
          {...props}
          graphType="column"
          graphGroup="summary_stack_bar"
        />
      );
      const buttons = screen.getAllByRole('button');

      // Summary stack column button (index 8) should have active state
      expect(buttons[8]).toHaveClass('iconButton--isActive');
      // Regular column buttons should not have active state
      expect(buttons[1]).not.toHaveClass('iconButton--isActive');
      expect(buttons[6]).not.toHaveClass('iconButton--isActive');
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click summary stack column graph button
      await user.click(buttons[8]);

      expect(props.selectGraph).toHaveBeenCalledWith(
        'column',
        'summary_stack_bar'
      );
    });
  });

  describe('longitudinal bar graph button', () => {
    it('shows an active state when the longitudinal bar graph is selected', () => {
      render(
        <GraphSelector {...props} graphType="bar" graphGroup="longitudinal" />
      );
      const buttons = screen.getAllByRole('button');

      // Longitudinal bar button (index 2) should have active state
      expect(buttons[2]).toHaveClass('iconButton--isActive');
      // Other bar buttons should not have active state
      expect(buttons[7]).not.toHaveClass('iconButton--isActive'); // summary bar
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click longitudinal bar graph button (3rd button - index 2)
      await user.click(buttons[2]);
      expect(props.selectGraph).toHaveBeenCalledWith('bar', 'longitudinal');
    });
  });

  describe('radar graph button', () => {
    it('shows an active state when the radar graph is selected', () => {
      render(
        <GraphSelector {...props} graphType="radar" graphGroup="summary" />
      );
      const buttons = screen.getAllByRole('button');

      // Radar button (index 4) should have active state
      expect(buttons[4]).toHaveClass('iconButton--isActive');
      // Other buttons should not have active state
      expect(buttons[0]).not.toHaveClass('iconButton--isActive');
      expect(buttons[1]).not.toHaveClass('iconButton--isActive');
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click radar graph button (5th button - index 4)
      await user.click(buttons[4]);
      expect(props.selectGraph).toHaveBeenCalledWith('radar', 'summary');
    });
  });

  describe('spider bar graph button', () => {
    it('shows an active state when the spider graph is selected', () => {
      render(
        <GraphSelector {...props} graphType="spider" graphGroup="summary" />
      );
      const buttons = screen.getAllByRole('button');

      // Spider button (index 5) should have active state
      expect(buttons[5]).toHaveClass('iconButton--isActive');
      // Other buttons should not have active state
      expect(buttons[4]).not.toHaveClass('iconButton--isActive'); // radar
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      await user.click(buttons[5]);
      expect(props.selectGraph).toHaveBeenCalledWith('spider', 'summary');
    });
  });

  describe('summary bar graph button', () => {
    it('shows an active state when the summary bar graph is selected', () => {
      render(
        <GraphSelector {...props} graphType="bar" graphGroup="summary_bar" />
      );
      const buttons = screen.getAllByRole('button');

      // Summary bar button (index 7) should have active state
      expect(buttons[7]).toHaveClass('iconButton--isActive');
      // Longitudinal bar button should not have active state
      expect(buttons[2]).not.toHaveClass('iconButton--isActive');
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click summary bar graph button (8th button - index 7)
      await user.click(buttons[7]);
      expect(props.selectGraph).toHaveBeenCalledWith('bar', 'summary_bar');
    });
  });

  describe('summary stack bar graph button', () => {
    it('shows an active state when the summary stack bar graph is selected', () => {
      render(
        <GraphSelector
          {...props}
          graphType="bar"
          graphGroup="summary_stack_bar"
        />
      );
      const buttons = screen.getAllByRole('button');

      // Summary stack bar button (index 9) should have active state
      expect(buttons[9]).toHaveClass('iconButton--isActive');
      // Regular bar buttons should not have active state
      expect(buttons[2]).not.toHaveClass('iconButton--isActive'); // longitudinal bar
      expect(buttons[7]).not.toHaveClass('iconButton--isActive'); // summary bar
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click summary stack bar graph button (10th button - index 9)
      await user.click(buttons[9]);
      expect(props.selectGraph).toHaveBeenCalledWith(
        'bar',
        'summary_stack_bar'
      );
    });
  });

  describe('summary pie graph button', () => {
    it('shows an active state when the summary pie graph is selected', () => {
      render(
        <GraphSelector {...props} graphType="pie" graphGroup="summary_donut" />
      );
      const buttons = screen.getAllByRole('button');

      // Pie button (index 11) should have active state
      expect(buttons[11]).toHaveClass('iconButton--isActive');
      // Donut button should not have active state (same group but different type)
      expect(buttons[10]).not.toHaveClass('iconButton--isActive');
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click summary pie graph button (12th button - index 11)
      await user.click(buttons[11]);
      expect(props.selectGraph).toHaveBeenCalledWith('pie', 'summary_donut');
    });
  });

  describe('value visualisation button', () => {
    it('shows an active state when the value visualisation is selected', () => {
      render(
        <GraphSelector
          {...props}
          graphType="values"
          graphGroup="value_visualisation"
        />
      );
      const buttons = screen.getAllByRole('button');

      // Value visualisation button (index 12) should have active state
      expect(buttons[12]).toHaveClass('iconButton--isActive');
      // Other buttons should not have active state
      expect(buttons[0]).not.toHaveClass('iconButton--isActive');
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click value visualisation button (last button - index 12)
      await user.click(buttons[12]);
      expect(props.selectGraph).toHaveBeenCalledWith(
        'value',
        'value_visualisation'
      );
    });
  });

  describe('combination graph button', () => {
    it('shows an active state when the combination graph is selected', () => {
      render(
        <GraphSelector
          {...props}
          graphType="combination"
          graphGroup="longitudinal"
        />
      );
      const buttons = screen.getAllByRole('button');

      // Combination graph button (index 3) should have active state
      expect(buttons[3]).toHaveClass('iconButton--isActive');
      // Other buttons should not have active state
      expect(buttons[0]).not.toHaveClass('iconButton--isActive');
    });

    it('fires the callback with the correct graph', async () => {
      const user = userEvent.setup();
      render(<GraphSelector {...props} />);

      const buttons = screen.getAllByRole('button');

      // Click combination graph button (4th button - index 3)
      await user.click(buttons[3]);
      expect(props.selectGraph).toHaveBeenCalledWith(
        'combination',
        'longitudinal'
      );
    });
  });
});
