import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as chartBuilderModule from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { deleteWidget } from '../../../redux/actions/widgets';
import { openDuplicateWidgetModal } from '../../../redux/actions/duplicateWidgetModal';
import Widget from '../index';

jest.mock('../../../redux/actions/widgets', () => ({
  ...jest.requireActual('../../../redux/actions/widgets'),
  deleteWidget: jest.fn().mockReturnValue({ type: null }),
}));

jest.mock('../../../redux/actions/duplicateWidgetModal', () => ({
  ...jest.requireActual('../../../redux/actions/duplicateWidgetModal'),
  openDuplicateWidgetModal: jest.fn().mockReturnValue({ type: null }),
}));

describe('<Widget />', () => {
  const props = {
    t: i18nextTranslateStub(),
    widgetId: 123,
    widgetName: 'My Dashboard Widget',
    widgetType: 'graph',
  };

  it('renders with children and default menu items', async () => {
    renderWithStore(
      <Widget {...props}>
        <div>Test Child</div>
      </Widget>
    );

    expect(screen.queryByText('Test Child')).toBeVisible();

    expect(
      screen.queryByLabelText('My Dashboard Widget Menu Icon')
    ).toBeVisible();

    await userEvent.click(
      screen.getByLabelText('My Dashboard Widget Menu Icon')
    );

    ['Edit', 'Duplicate', 'Delete'].forEach((menuItem) => {
      expect(screen.queryByText(menuItem)).toBeVisible();
    });
  });

  it('calls the openDuplicatWideget modal action when duplicate is clicked', async () => {
    renderWithStore(
      <Widget {...props}>
        <div>Test Child</div>
      </Widget>
    );

    await userEvent.click(
      screen.getByLabelText('My Dashboard Widget Menu Icon')
    );

    expect(openDuplicateWidgetModal).not.toHaveBeenCalled();

    await userEvent.click(screen.getByText('Duplicate'));

    expect(openDuplicateWidgetModal).toHaveBeenCalled();
    expect(openDuplicateWidgetModal).toHaveBeenCalledWith(
      props.widgetId,
      props.widgetType,
      false,
      `${props.widgetName} copy`
    );
  });

  it('renders items on the right when passed in to renderItemRight', () => {
    renderWithStore(
      <Widget {...props} renderHeaderRight={() => <div>render right</div>}>
        <div>Test Child</div>
      </Widget>
    );

    expect(screen.getByText('render right')).toBeInTheDocument();
  });

  it('renders additional menu items when supplied', async () => {
    const onFoo = jest.fn();
    const onBar = jest.fn();
    renderWithStore(
      <Widget
        {...props}
        menuItems={[
          { description: 'Foo', onClick: onFoo },
          { description: 'Bar', onClick: onBar },
        ]}
      >
        <div>Test Child</div>
      </Widget>
    );

    await userEvent.click(
      screen.getByLabelText('My Dashboard Widget Menu Icon')
    );

    ['Edit', 'Duplicate', 'Delete'].forEach((menuItem) => {
      expect(screen.queryByText(menuItem)).toBeVisible();
    });
    expect(screen.queryByText('Foo')).toBeVisible();
    expect(screen.queryByText('Bar')).toBeVisible();

    await userEvent.click(screen.getByText('Foo'));

    expect(onFoo).toHaveBeenCalled();
  });

  it('hides the widgetMenu when hideWidgetMenu is true', async () => {
    renderWithStore(
      <Widget {...props} hideWidgetMenu>
        <div>Test Child</div>
      </Widget>
    );

    expect(screen.queryByText('Test Child')).toBeVisible();

    expect(
      screen.queryByLabelText('My Dashboard Widget Menu Icon')
    ).not.toBeInTheDocument();
  });

  describe('when using the edit action', () => {
    it('calls onEdit when edit action is clicked', async () => {
      const onEdit = jest.fn();

      renderWithStore(
        <Widget {...props} onEdit={onEdit} canEdit>
          <div>Test Child</div>
        </Widget>
      );

      await userEvent.click(
        screen.getByLabelText('My Dashboard Widget Menu Icon')
      );

      expect(onEdit).not.toHaveBeenCalled();

      await userEvent.click(screen.getByText('Edit'));

      expect(onEdit).toHaveBeenCalled();
    });

    it('does not call onEdit when edit action is clicked and canEdit is false', async () => {
      const onEdit = jest.fn();

      renderWithStore(
        <Widget {...props} onEdit={onEdit} canEdit={false}>
          <div>Test Child</div>
        </Widget>
      );

      await userEvent.click(
        screen.getByLabelText('My Dashboard Widget Menu Icon')
      );

      expect(onEdit).not.toHaveBeenCalled();

      await userEvent.click(screen.getByText('Edit'));

      expect(onEdit).not.toHaveBeenCalled();
    });
  });

  describe('when using the delete action', () => {
    it('displays a confirm dialog when clicking delete', async () => {
      renderWithStore(
        <Widget {...props}>
          <div>Test Child</div>
        </Widget>
      );

      await userEvent.click(
        screen.getByLabelText('My Dashboard Widget Menu Icon')
      );

      await userEvent.click(screen.getByText('Delete'));

      await waitFor(() => {
        expect(screen.getByText('Confirm widget deletion')).toBeVisible();
      });

      expect(deleteWidget).not.toHaveBeenCalled();

      expect(
        screen.getByText(
          'Are you sure you want to delete "My Dashboard Widget"?'
        )
      ).toBeVisible();

      expect(screen.getByText('Delete "My Dashboard Widget"')).toBeVisible();
    });

    it('calls the delete redux action when you confirm deletion', async () => {
      renderWithStore(
        <Widget {...props}>
          <div>Test Child</div>
        </Widget>
      );

      await userEvent.click(
        screen.getByLabelText('My Dashboard Widget Menu Icon')
      );

      await userEvent.click(screen.getByText('Delete'));

      await waitFor(() => {
        expect(screen.getByText('Confirm widget deletion')).toBeVisible();
      });

      await userEvent.click(
        screen.getByRole('button', {
          name: 'Delete "My Dashboard Widget"',
        })
      );

      expect(deleteWidget).toHaveBeenCalled();
    });

    it('closes the dialog and doesnt call delete redux action when cancelling', async () => {
      renderWithStore(
        <Widget {...props}>
          <div>Test Child</div>
        </Widget>
      );

      await userEvent.click(
        screen.getByLabelText('My Dashboard Widget Menu Icon')
      );

      await userEvent.click(screen.getByText('Delete'));

      await waitFor(() => {
        expect(screen.getByText('Confirm widget deletion')).toBeVisible();
      });

      await userEvent.click(
        screen.getByRole('button', {
          name: 'Cancel',
        })
      );
      await waitFor(() => {
        expect(screen.getByText('Confirm widget deletion')).not.toBeVisible();
      });

      expect(deleteWidget).not.toHaveBeenCalled();
    });
  });

  describe('when editing a title', () => {
    it('does not display an input when editing a title when onChangeWidgetName is not provided', async () => {
      renderWithStore(
        <Widget {...props}>
          <div>Test Child</div>
        </Widget>
      );

      await userEvent.click(screen.getByText(props.widgetName));

      expect(
        screen.queryByDisplayValue(props.widgetName)
      ).not.toBeInTheDocument();
    });

    it('displays an input when clicking the title and calls the onChangeWidgetName callback when changed', async () => {
      const onChangeWidgetName = jest.fn();
      renderWithStore(
        <Widget {...props} onChangeWidgetName={onChangeWidgetName}>
          <div>Test Child</div>
        </Widget>
      );

      await userEvent.click(screen.getByText(props.widgetName));

      const input = screen.queryByDisplayValue(props.widgetName);

      expect(input).toBeInTheDocument();

      fireEvent.change(input, {
        target: { value: `${props.widgetName} with change` },
      });

      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(onChangeWidgetName).toHaveBeenCalledWith(
        `${props.widgetName} with change`
      );
    });

    it('passes the right params to duplicate widget modal when onChangeWidgetName is supplied', async () => {
      const onChangeWidgetName = jest.fn();
      renderWithStore(
        <Widget {...props} onChangeWidgetName={onChangeWidgetName}>
          <div>Test Child</div>
        </Widget>
      );

      await userEvent.click(
        screen.getByLabelText('My Dashboard Widget Menu Icon')
      );

      expect(openDuplicateWidgetModal).not.toHaveBeenCalled();

      await userEvent.click(screen.getByText('Duplicate'));

      expect(openDuplicateWidgetModal).toHaveBeenCalled();
      expect(openDuplicateWidgetModal).toHaveBeenCalledWith(
        props.widgetId,
        props.widgetType,
        true,
        `${props.widgetName} copy`
      );
    });
  });

  describe('when "rep-charts-v2-caching" is off', () => {
    const initialState = chartBuilderModule.initialState;
    const REDUCER_KEY = chartBuilderModule.REDUCER_KEY;

    it('does not show last calculated when the loader becomes idle', async () => {
      window.setFlag('rep-charts-v2-caching', false);
      const timestamp = ['2025-02-24T14:55:29.000+00:00'];
      renderWithStore(
        <Widget {...props} cachedAt={timestamp} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            loaderLevelMap: {
              [props.widgetId]: 0,
            },
          },
        }
      );
      expect(screen.queryByText(/Last Calculated:/)).not.toBeInTheDocument();
    });

    it('does not show "calculating" when the loader is on level two', async () => {
      window.setFlag('rep-charts-v2-caching', false);
      renderWithStore(
        <Widget {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            loaderLevelMap: {
              [props.widgetId]: 2,
            },
          },
        }
      );
      expect(screen.queryByText(/Calculating.../)).not.toBeInTheDocument();
    });

    it('does not show "Refresh data"', async () => {
      window.setFlag('rep-charts-v2-caching', false);
      const user = userEvent.setup();
      renderWithStore(
        <Widget {...props}>
          <div>Test Child</div>
        </Widget>
      );

      await user.click(screen.getByLabelText('My Dashboard Widget Menu Icon'));
      expect(screen.queryByText('Refresh data')).not.toBeInTheDocument();
    });
  });

  describe('when "rep-charts-v2-caching" is true', () => {
    const initialState = chartBuilderModule.initialState;
    const REDUCER_KEY = chartBuilderModule.REDUCER_KEY;

    beforeEach(() => {
      jest
        .spyOn(chartBuilderModule, 'refreshWidgetCache')
        .mockReturnValue(() => ({}));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    const state = {
      [REDUCER_KEY]: {
        ...initialState,
        loaderLevelMap: {
          [props.widgetId]: 0,
        },
        cachedAtMap: {
          [props.widgetId]: ['2025-02-24T14:55:29.000+00:00'],
        },
      },
    };
    it('shows last calculated when the loader becomes idle', async () => {
      window.setFlag('rep-charts-v2-caching', true);
      renderWithStore(<Widget {...props} />, {}, state);
      expect(screen.getByText(/Last Calculated:/)).toBeInTheDocument();
    });

    it('shows "calculating" when the loader is on level two', async () => {
      window.setFlag('rep-charts-v2-caching', true);
      renderWithStore(
        <Widget {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            loaderLevelMap: {
              [props.widgetId]: 2,
            },
          },
        }
      );
      expect(screen.getByText(/Calculating.../)).toBeInTheDocument();
    });

    it('calls the refreshWidgetCache action when "Refresh data" is clicked', async () => {
      window.setFlag('rep-charts-v2-caching', true);
      const user = userEvent.setup();
      renderWithStore(
        <Widget {...props} chartElements={[{}]}>
          <div>Test Child</div>
        </Widget>
      );

      await user.click(screen.getByLabelText('My Dashboard Widget Menu Icon'));
      const refreshButton = screen.getByRole('button', {
        name: 'Refresh data',
      });

      await user.click(refreshButton);
      expect(chartBuilderModule.refreshWidgetCache).toHaveBeenCalledWith({
        refreshCache: true,
        widgetId: 123,
      });
    });

    it('prominently displays a refresh button on the widget', async () => {
      window.setFlag('rep-charts-v2-caching', true);

      renderWithStore(<Widget {...props} />, {}, state);

      expect(
        screen.getByTestId('refresh-widget-cache-button')
      ).toBeInTheDocument();
    });

    it('calls the refreshWidgetCache action when refresh button is clicked', async () => {
      window.setFlag('rep-charts-v2-caching', true);
      const user = userEvent.setup();
      renderWithStore(<Widget {...props} />, {}, state);

      const refreshButton = screen.getByTestId('refresh-widget-cache-button');

      await user.click(refreshButton);
      expect(chartBuilderModule.refreshWidgetCache).toHaveBeenCalledWith({
        refreshCache: true,
        widgetId: 123,
      });
    });
  });

  it('when chartElements is false it applies the correct disabled style', async () => {
    window.setFlag('rep-charts-v2-caching', true);
    const user = userEvent.setup();
    renderWithStore(
      <Widget {...props} chartElements={[]}>
        <div>Test Child</div>
      </Widget>
    );

    await user.click(screen.getByLabelText('My Dashboard Widget Menu Icon'));

    const refreshButton = screen.getByRole('button', {
      name: 'Refresh data',
    });
    expect(refreshButton).toHaveClass('tooltipMenu__item--disabled');
  });
});
