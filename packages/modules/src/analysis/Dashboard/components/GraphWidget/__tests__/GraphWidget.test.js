import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import $ from 'jquery';
import sinon from 'sinon';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  getDummyResponseData,
  DummyVariablesHash,
  getDummyData,
} from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import {
  getGraphTitles,
  formatGraphTitlesToString,
} from '@kitman/modules/src/analysis/shared/utils';
import {
  transformGraphResponse,
  transformSummaryResponse,
} from '@kitman/modules/src/analysis/GraphComposer/src/utils';
import GraphWidget from '..';

describe('<GraphWidget />', () => {
  const longitudinalGraphData = transformGraphResponse(
    getDummyResponseData('longitudinal', 'line', 123),
    'longitudinal'
  ).graphData;

  const props = {
    containerType: 'AnalyticalDashboard',
    graphData: longitudinalGraphData,
    dashboardId: 4,
    onDeleteGraph: jest.fn(),
    onUpdateAggregationPeriod: jest.fn(),
    onClickOpenGraphLinksModal: jest.fn(),
    onDuplicate: jest.fn(),
    onSortGraph: jest.fn(),
    reloadGraph: jest.fn(),
    canManageDashboard: true,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sinon.restore();
  });

  it('renders the component', () => {
    render(<GraphWidget {...props} />);

    const titleElement = screen.getByRole('heading', {
      name: 'BC - Skinfold Sum / Body Weight',
    });
    expect(titleElement).toBeInTheDocument();

    const legendItem = screen.getByText('Vincent Gutmann');
    expect(legendItem).toBeInTheDocument();
  });

  it('calls onUpdateAggregationPeriod with the correct arguments when updating the aggregation period', async () => {
    const user = userEvent.setup();
    render(<GraphWidget {...props} />);

    const monthButton = screen.getByRole('button', { name: 'Month' });
    await user.click(monthButton);

    await waitFor(() => {
      expect(props.onUpdateAggregationPeriod).toHaveBeenCalledWith(
        123,
        'month'
      );
    });
  });

  it('displays the title correctly', () => {
    render(<GraphWidget {...props} />);

    const titleElement = screen.getByRole('heading', {
      name: 'BC - Skinfold Sum / Body Weight',
    });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveAttribute(
      'title',
      'BC - Skinfold Sum / Body Weight'
    );
  });

  it('renders a dropdown menu', async () => {
    const user = userEvent.setup();
    const data = getDummyData('longitudinalEvent');
    data.id = 123;
    render(<GraphWidget {...props} graphData={data} />);

    const menuButton = screen.getByRole('button', { name: '' });
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText('Edit Graph')).toBeInTheDocument();
    });

    expect(screen.getByText('Rename Graph')).toBeInTheDocument();
    expect(screen.getByText('Link Graph to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Duplicate Widget')).toBeInTheDocument();

    const editGraphLink = screen.getByText('Edit Graph').closest('a');
    expect(editGraphLink).toHaveAttribute(
      'href',
      '/analysis/graph/builder?deeplink=analytical_dashboard&analytical_dashboard_id=4&graph_id=123#graphView'
    );
  });

  it('disables the graph link item when the graph contains drills', async () => {
    render(
      <GraphWidget {...props} graphData={getDummyData('longitudinalEvent')} />
    );

    const menuButton = screen.getByRole('button', { name: '' });
    await userEvent.click(menuButton);

    const linkItem = screen.getByText('Link Graph to Dashboard');
    const buttonElement = linkItem.closest('button');
    expect(buttonElement).toHaveClass('tooltipMenu__item--disabled');
  });

  it('does not render the menu when user does not have manage-analytical-dashboard permission', () => {
    render(<GraphWidget {...props} canManageDashboard={false} />);

    const menuButtons = screen.queryAllByRole('button');
    const menuButton = menuButtons.find((button) =>
      button.className.includes('graphWidget__menuButton')
    );
    expect(menuButton).toBeUndefined();
  });

  describe('When clicking the delete button and confirm', () => {
    it('calls the correct callback function', async () => {
      const user = userEvent.setup();
      const data = getDummyData('longitudinalEvent');
      const graphData = {
        ...data,
        name: 'graphName',
      };
      props.graphData = graphData;

      render(<GraphWidget {...props} />);

      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Are you sure you want to delete the graph "graphName"?'
          )
        ).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', {
        name: /delete/i,
      });
      await user.click(confirmButton);

      expect(props.onDeleteGraph).toHaveBeenCalledTimes(1);
    });
  });

  describe('When clicking the delete button and cancel', () => {
    it('hides the confirm modal', async () => {
      const user = userEvent.setup();
      const data = getDummyData('longitudinalEvent');
      const graphData = {
        ...data,
        name: 'graphName',
      };
      props.graphData = graphData;

      render(<GraphWidget {...props} />);

      // Open the menu
      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Are you sure you want to delete the graph "graphName"?'
          )
        ).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByText(
            'Are you sure you want to delete the graph "graphName"?'
          )
        ).not.toBeInTheDocument();
      });
      expect(props.onDeleteGraph).not.toHaveBeenCalled();
    });
  });

  describe('when the graph-sorting flag is on', () => {
    beforeEach(() => {
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('renders a sorting tooltip if the graph is sortable', () => {
      const summaryBarGraphData = transformGraphResponse(
        getDummyResponseData('summaryBar'),
        'summary_bar'
      ).graphData;

      const { container } = render(
        <GraphWidget {...props} graphData={summaryBarGraphData} />
      );

      const sortButton = container.querySelector('.graphWidget__sortButton');
      expect(sortButton).toBeInTheDocument();
    });
  });

  describe('When the graph is a summary graph', () => {
    const summaryGraphData = transformSummaryResponse(
      getDummyResponseData('summary'),
      DummyVariablesHash
    ).graphData;

    it('renders the correct edit graph link', async () => {
      const user = userEvent.setup();
      render(<GraphWidget {...props} graphData={summaryGraphData} />);

      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      await waitFor(() => {
        const editGraphLink = screen.getByText('Edit Graph').closest('a');
        expect(editGraphLink).toHaveAttribute(
          'href',
          '/analysis/graph/builder?deeplink=analytical_dashboard&analytical_dashboard_id=4&graph_id=1456#graphView'
        );
      });
    });

    it('displays the title correctly', () => {
      render(<GraphWidget {...props} graphData={summaryGraphData} />);

      const titleElement = screen.getByRole('heading', { name: '3 Metrics' });
      expect(titleElement).toBeInTheDocument();
    });
  });

  describe('When the graph fails to load', () => {
    const errorGraphData = {
      id: 5,
      graphGroup: 'longitudinal',
      graphType: 'table',
      isLoading: false,
      error: true,
    };

    it('renders the error state', () => {
      const reloadGraph = jest.fn();
      const { container } = render(
        <GraphWidget
          {...props}
          graphData={errorGraphData}
          reloadGraph={reloadGraph}
        />
      );

      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      expect(screen.getByText('Reload graph')).toBeInTheDocument();

      const errorImage = container.querySelector('.graphWidgetGraphImage img');
      expect(errorImage).toBeInTheDocument();
      expect(errorImage).toHaveAttribute(
        'src',
        '/img/graph-placeholders/table-graph-placeholder.png'
      );
    });

    it('renders a dropdown menu with only a Delete option', async () => {
      const user = userEvent.setup();
      render(<GraphWidget {...props} graphData={errorGraphData} />);

      // Open the menu
      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });

      expect(screen.queryByText('Edit Graph')).not.toBeInTheDocument();
      expect(screen.queryByText('Rename Graph')).not.toBeInTheDocument();
    });
  });

  describe('When the graph access is forbidden', () => {
    const forbiddenGraphData = {
      id: 5,
      graphGroup: 'longitudinal',
      graphType: 'table',
      isLoading: false,
      forbidden: true,
    };

    it('renders the forbidden state', () => {
      const { container } = render(
        <GraphWidget {...props} graphData={forbiddenGraphData} />
      );

      const forbiddenMessage = container.querySelector(
        '.graphWidget__noPermissionText'
      );
      expect(forbiddenMessage).toBeInTheDocument();
      expect(forbiddenMessage).toHaveTextContent(
        "You don't have permissions to see this graph"
      );
      expect(forbiddenMessage).toHaveTextContent(
        'Please contact your administrator to access this data.'
      );
    });
  });

  it("hides the rename button when the user doesn't have the manage dashboard permission", () => {
    render(<GraphWidget {...props} canManageDashboard={false} />);

    expect(screen.queryByText('Rename Graph')).not.toBeInTheDocument();
  });

  it('sets the correct state when renderRenameGraphModal is called', async () => {
    const user = userEvent.setup();
    render(
      <GraphWidget {...props} graphData={getDummyData('longitudinalEvent')} />
    );

    const menuButton = screen.getByRole('button', { name: '' });
    await user.click(menuButton);

    const renameButton = screen.getByRole('button', { name: /rename graph/i });
    await user.click(renameButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Modal' })).toBeInTheDocument();
    });

    expect(
      screen.getByRole('heading', { name: 'Rename Graph' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Graph Name')).toBeInTheDocument();
  });

  describe('when the graph has a custom name', () => {
    it('has the correct text displayed on delete confirmation', async () => {
      const user = userEvent.setup();
      const data = getDummyData('longitudinalEvent');
      const graphData = {
        ...data,
        name: 'Custom Graph Name',
      };

      render(<GraphWidget {...props} graphData={graphData} />);

      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Are you sure you want to delete the graph "Custom Graph Name"?'
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('when the graph does not have a custom name', () => {
    it('renders the correct title for the graph', () => {
      const customProps = { ...props };
      customProps.graphData.name = null;

      render(<GraphWidget {...customProps} />);

      const title = formatGraphTitlesToString(
        getGraphTitles(customProps.graphData)
      );

      const titleElement = screen.getByRole('heading', { name: title });
      expect(titleElement).toBeInTheDocument();
    });
  });

  describe('When clicking the confirm button in the rename modal', () => {
    describe('when request is successful', () => {
      const user = userEvent.setup();
      it('renames the graph', async () => {
        const mockReloadGraph = jest.fn();
        const graphData = getDummyData('longitudinalEvent');
        graphData.name = 'Original Name';

        const ajaxDeferred = {
          done: jest.fn().mockReturnThis(),
          fail: jest.fn().mockReturnThis(),
        };

        ajaxDeferred.done.mockImplementation((callback) => {
          callback();
          return ajaxDeferred;
        });

        sinon.stub($, 'ajax').returns(ajaxDeferred);

        render(
          <GraphWidget
            {...props}
            graphData={graphData}
            reloadGraph={mockReloadGraph}
          />
        );

        const menuButton = screen.getByRole('button', { name: '' });
        await user.click(menuButton);

        const renameButton = screen.getByText('Rename Graph');
        await user.click(renameButton);

        const input = screen.getByLabelText('Graph Name');
        fireEvent.change(input, { target: { value: 'New Name' } });

        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        await user.click(confirmButton);

        expect($.ajax.calledOnce).toBe(true);
      });
    });

    describe('when request fails', () => {
      it('shows an error', async () => {
        const user = userEvent.setup();
        const graphData = getDummyData('longitudinalEvent');
        graphData.name = 'Original Name';

        const ajaxDeferred = {
          done: jest.fn().mockReturnThis(),
          fail: jest.fn().mockReturnThis(),
        };

        ajaxDeferred.fail.mockImplementation((callback) => {
          callback();
          return ajaxDeferred;
        });

        sinon.stub($, 'ajax').returns(ajaxDeferred);

        render(<GraphWidget {...props} graphData={graphData} />);

        const menuButton = screen.getByRole('button', { name: '' });
        await user.click(menuButton);

        const renameButton = screen.getByRole('button', {
          name: 'Rename Graph',
        });
        await user.click(renameButton);

        const input = screen.getByLabelText('Graph Name');
        fireEvent.change(input, { target: { value: 'New Name' } });

        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        await user.click(confirmButton);

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('when graph is on a home dashboard', () => {
    it('does not have duplicate graph in menu options', async () => {
      const user = userEvent.setup();
      const data = getDummyData('longitudinalEvent');
      data.id = 123;
      props.containerType = 'HomeDashboard';

      render(<GraphWidget {...props} graphData={data} />);

      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Edit Graph')).toBeInTheDocument();
      });

      expect(screen.getByText('Rename Graph')).toBeInTheDocument();
      expect(screen.getByText('Link Graph to Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.queryByText('Duplicate Widget')).not.toBeInTheDocument();

      const editGraphLink = screen.getByText('Edit Graph').closest('a');
      expect(editGraphLink).toHaveAttribute(
        'href',
        '/analysis/graph/builder?deeplink=home_dashboard&graph_id=123#graphView'
      );
    });
  });

  describe('when the rep-dashboard-ui-upgrade & graph-sorting flag is on', () => {
    beforeEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', true);
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', false);
      window.setFlag('graph-sorting', false);
    });

    it('renders a sorting icon', () => {
      const summaryBarGraphData = transformGraphResponse(
        getDummyResponseData('summaryBar'),
        'summary_bar'
      ).graphData;

      const { container } = render(
        <GraphWidget {...props} graphData={summaryBarGraphData} />
      );

      const sortButton = container.querySelector('.graphWidget__sortButton');
      expect(sortButton).toBeInTheDocument();

      const legend = screen.getByText('Legend');
      expect(legend).toHaveClass('graphLegendList__toggleButton');
    });
  });
});
