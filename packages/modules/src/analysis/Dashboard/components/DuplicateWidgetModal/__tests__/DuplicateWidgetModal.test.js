import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DuplicateWidgetModal from '..';

describe('<DuplicateWidgetModal />', () => {
  const props = {
    activeDashboard: { id: 1, name: 'Test Dashboard' },
    activeSquad: { id: 2, name: 'Test Squad' },
    dashboardData: {
      data: [
        { id: 1, name: 'Test Dashboard' },
        { id: 123, name: 'Test Dashboard 123' },
      ],
      isFetching: false,
      error: {},
      refetch: jest.fn(),
    },
    squadData: {
      data: [
        { id: 2, name: 'Test Squad' },
        { id: 246, name: 'Test Squad 246' },
      ],
      isFetching: false,
      error: undefined,
      refetch: jest.fn(),
    },
    isOpen: true,
    onChangeSelectedDashboard: jest.fn(),
    onChangeSelectedSquad: jest.fn(),
    onClickCloseModal: jest.fn(),
    onClickCloseAppStatus: jest.fn(),
    onClickSaveDuplicateWidget: jest.fn(),
    onChangeDuplicateWidgetName: jest.fn(),
    selectedDashboard: { id: 1, name: 'Test Dashboard' },
    selectedSquad: { id: 2, name: 'Test Squad' },
    widgetId: null,
    widgetName: '',
    widgetType: '',
    t: i18nextTranslateStub(),
    dashboard: { id: 1, name: 'Test Dashboard' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.getFlag = jest.fn();
    window.setFlag = jest.fn();
  });

  it('has the correct modal title when no widgetType is passed', () => {
    render(<DuplicateWidgetModal {...props} />);

    expect(screen.getByText('Duplicate Widget')).toBeInTheDocument();
  });

  it('has the correct modal title when widgetType chart is passed', () => {
    render(<DuplicateWidgetModal {...props} widgetType="chart" />);

    expect(screen.getByText('Duplicate Chart Widget')).toBeInTheDocument();
  });

  it('has the correct modal title when a widgetType is passed', () => {
    render(<DuplicateWidgetModal {...props} widgetType="athlete_profile" />);

    expect(screen.getByText('Duplicate Profile Widget')).toBeInTheDocument();
  });

  it('calls the correct props when closing the modal', async () => {
    const user = userEvent.setup();
    render(<DuplicateWidgetModal {...props} />);

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(props.onClickCloseModal).toHaveBeenCalledTimes(1);
    expect(props.onChangeSelectedSquad).toHaveBeenCalledWith(props.activeSquad);
    expect(props.onChangeSelectedDashboard).toHaveBeenCalledWith(
      props.activeDashboard
    );
  });

  describe('when the widget name is editable', () => {
    it('has a text input', () => {
      render(<DuplicateWidgetModal {...props} isNameEditable />);

      expect(screen.getByLabelText('Widget Name')).toBeInTheDocument();
    });
  });

  it('has a select dashboard dropdown', () => {
    render(<DuplicateWidgetModal {...props} />);

    expect(screen.getByLabelText('Select Dashboard')).toBeInTheDocument();
  });

  it('renders error when supplied and calls refetch function on retry for dashboard select', async () => {
    const user = userEvent.setup();
    const errorProps = {
      ...props,
      dashboardData: {
        ...props.dashboardData,
        error: { status: 500, error: 'Server Error' },
      },
    };

    render(<DuplicateWidgetModal {...errorProps} />);

    expect(
      screen.getByTestId('DuplicateWidgetModal|DashboardSelectError')
    ).toBeInTheDocument();
    expect(screen.getByText('Error loading dashboards.')).toBeInTheDocument();

    const retryLink = screen.getByTestId(
      'DuplicateWidgetModal|DashboardSelectErrorAction'
    );
    await user.click(retryLink);

    expect(errorProps.dashboardData.refetch).toHaveBeenCalledTimes(1);
  });

  it('has a footer with a save button', () => {
    render(<DuplicateWidgetModal {...props} />);

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
  });

  it('has a footer with a save button disabled when the name is editable and empty', () => {
    render(<DuplicateWidgetModal {...props} isNameEditable widgetName="" />);

    const buttonParent = screen.getByText('Save').closest('button');
    expect(buttonParent).toHaveAttribute('disabled');
  });

  it('calls the correct callback when clicking save', async () => {
    const user = userEvent.setup();
    const updatedProps = {
      ...props,
      dashboardData: {
        ...props.dashboardData,
        error: undefined,
      },
      selectedDashboard: { id: 1, name: 'Test Dashboard', squad_id: 2 },
      selectedSquad: { id: 2, name: 'Test Squad' },
    };

    render(<DuplicateWidgetModal {...updatedProps} />);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(props.onClickSaveDuplicateWidget).toHaveBeenCalledTimes(1);
  });

  describe('when the duplicate-across-squads flag is on', () => {
    beforeEach(() => {
      window.setFlag('duplicate-across-squads', true);
    });

    it('renders error when supplied and calls refetch function on retry', async () => {
      const user = userEvent.setup();
      const errorProps = {
        ...props,
        squadData: {
          ...props.squadData,
          error: { status: 500, error: 'Server Error' },
        },
      };

      render(<DuplicateWidgetModal {...errorProps} />);

      expect(screen.getByText('Error loading dashboards.')).toBeInTheDocument();

      const retryLink = screen.getByText('Retry.');

      await user.click(retryLink);
      expect(errorProps.dashboardData.refetch).toHaveBeenCalledTimes(1);
    });
  });
});
