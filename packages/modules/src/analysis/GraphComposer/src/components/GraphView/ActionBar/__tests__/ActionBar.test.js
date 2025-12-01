import { render } from '@testing-library/react';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import ActionBar from '..';

const mockGraphTypeButtons = jest.fn();
const mockDecoratorSelectorTranslated = jest.fn();
const mockActions = jest.fn();

jest.mock('../GraphTypeButtons', () =>
  jest.fn((props) => {
    mockGraphTypeButtons(props);
    return (
      <div data-testid="graph-type-buttons">
        <button type="button" onClick={() => props.updateGraphType('line')}>
          Line
        </button>
      </div>
    );
  })
);

jest.mock('../DecoratorSelector', () => ({
  DecoratorSelectorTranslated: jest.fn(({ onChange, ...props }) => {
    mockDecoratorSelectorTranslated(props);
    return (
      <div data-testid="decorator-selector">
        <button type="button" onClick={() => onChange({ test: 'decorators' })}>
          Change Decorators
        </button>
      </div>
    );
  }),
}));

jest.mock('../Actions', () =>
  jest.fn(({ expandGraph, ...props }) => {
    mockActions(props);
    return (
      <div data-testid="actions">
        <button type="button" onClick={expandGraph}>
          Expand
        </button>
      </div>
    );
  })
);

describe('Graph Composer <ActionBar /> component', () => {
  const props = {
    graphGroup: 'longitudinal',
    graphType: 'line',
    canBuildGraph: true,
    graphData: getDummyData('longitudinal'),
    updateGraphType: jest.fn(),
    updateDecorators: jest.fn(),
    openGraphModal: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows graph type buttons', () => {
    render(<ActionBar {...props} graphType="line" />);
    expect(mockGraphTypeButtons).toHaveBeenCalledWith(
      expect.objectContaining({
        graphGroup: 'longitudinal',
        graphType: 'line',
        updateGraphType: props.updateGraphType,
      })
    );
  });

  describe('when clicking a graph button', () => {
    it('fires the callback with the correct graph', () => {
      const { getByText } = render(<ActionBar {...props} />);

      getByText('Line').click();
      expect(props.updateGraphType).toHaveBeenCalledWith('line');
    });
  });

  describe('when the graph is longitudinal', () => {
    it('renders a DecoratorSelector', () => {
      render(
        <ActionBar
          {...props}
          graphData={{ ...props.graphData, graphGroup: 'longitudinal' }}
        />
      );

      expect(mockDecoratorSelectorTranslated).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: {
            illnesses: true,
            injuries: true,
            data_labels: true,
            hide_nulls: false,
            hide_zeros: false,
          },
          decorators: props.graphData.decorators,
        })
      );
    });
  });

  describe('when the graph is summary_bar', () => {
    it('renders a DecoratorSelector', () => {
      render(
        <ActionBar
          {...props}
          graphData={{ ...props.graphData, graphGroup: 'summary_bar' }}
        />
      );

      expect(mockDecoratorSelectorTranslated).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: {
            illnesses: false,
            injuries: false,
            data_labels: true,
            hide_nulls: true,
            hide_zeros: true,
          },
        })
      );
    });
  });

  describe('when the graph is summary_stack_bar', () => {
    it('renders a DecoratorSelector', () => {
      render(
        <ActionBar
          {...props}
          graphData={{ ...props.graphData, graphGroup: 'summary_stack_bar' }}
        />
      );

      expect(mockDecoratorSelectorTranslated).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: {
            illnesses: false,
            injuries: false,
            data_labels: true,
            hide_nulls: true,
            hide_zeros: true,
          },
        })
      );
    });
  });

  describe('when the graph is not longitudinal', () => {
    it("doesn't render an DecoratorSelector", () => {
      render(
        <ActionBar
          {...props}
          graphData={{ ...props.graphData, graphGroup: 'summary' }}
        />
      );

      expect(mockDecoratorSelectorTranslated).not.toHaveBeenCalled();
    });
  });

  it('expands the graph when clicking the expand button', () => {
    const { getByText } = render(<ActionBar {...props} />);

    getByText('Expand').click();
    expect(props.openGraphModal).toHaveBeenCalledTimes(1);
  });

  describe('the graph is event based', () => {
    const newData = {
      ...getDummyData('longitudinalEvent'),
      graphGroup: 'longitudinal',
    };

    it('does not show injury and illness decorator selector', () => {
      render(<ActionBar {...props} graphData={newData} />);

      expect(mockDecoratorSelectorTranslated).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: {
            injuries: false,
            illnesses: false,
            data_labels: true,
            hide_nulls: false,
            hide_zeros: false,
          },
        })
      );
    });
  });
});
