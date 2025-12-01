import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { closeTableWidgetModal } from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidgetModal';
import TableWidgetModalContainer from '../Modal';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidgetModal',
  () => ({
    closeTableWidgetModal: jest.fn(() => ({
      type: 'CLOSE_TABLE_WIDGET_MODAL',
    })),
  })
);

describe('TableWidgetModal Container', () => {
  const defaultState = {
    dashboard: {},
    dashboardApi: {},
    tableWidgetModal: {
      isOpen: true,
    },
    staticData: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render the modal when isOpen is false', () => {
    const closedState = {
      ...defaultState,
      tableWidgetModal: { isOpen: false },
    };

    renderWithStore(
      <TableWidgetModalContainer t={(key) => key} />,
      {},
      closedState
    );

    expect(screen.queryByText('Create Table')).not.toBeInTheDocument();
  });

  it('renders the modal when isOpen is true', () => {
    renderWithStore(
      <TableWidgetModalContainer t={(key) => key} />,
      {},
      defaultState
    );

    expect(screen.getByText('Create Table')).toBeInTheDocument();
  });

  it('dispatches the correct action when onClickCloseModal is called', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <TableWidgetModalContainer t={(key) => key} />,
      {},
      defaultState
    );

    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find((button) =>
      button.className.includes('icon-close')
    );

    await user.click(closeButton);

    expect(closeTableWidgetModal).toHaveBeenCalled();
  });
});
