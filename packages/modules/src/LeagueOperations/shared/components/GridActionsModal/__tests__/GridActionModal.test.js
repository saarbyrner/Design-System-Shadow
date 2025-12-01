import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import useGridActions from '@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions';
import GridActionsModal from '../index';

jest.mock('@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions');

const createMockStore = (state) => ({
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(() => state),
});

const mockModal = {
  isOpen: true,
  action: 'test-action',
  text: {
    header: 'Test Header',
    body: 'Test Body',
    secondaryBody: 'Test Secondary Body',
  },
};

const defaultState = {
  'LeagueOperations.registration.slice.grids': {
    modal: mockModal,
  },
};

const renderWithStore = (storeState = defaultState) => {
  const store = createMockStore(storeState);
  render(
    <Provider store={store}>
      <GridActionsModal />
    </Provider>
  );
};

describe('GridActionsModal', () => {
  const mockOnConfirm = jest.fn();
  const mockHandleModalClose = jest.fn();

  beforeEach(() => {
    useGridActions.mockReturnValue({
      onConfirm: mockOnConfirm,
      handleModalClose: mockHandleModalClose,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct content', () => {
    renderWithStore();

    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByText('Test Body')).toBeInTheDocument();
    expect(screen.getByText('Test Secondary Body')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('calls handleModalClose when Cancel button is clicked', () => {
    renderWithStore();

    const cancelButton = screen.getByText('Cancel');
    cancelButton.click();

    expect(mockHandleModalClose).toHaveBeenCalled();
  });

  it('calls onConfirm when Confirm button is clicked', () => {
    renderWithStore();

    const confirmButton = screen.getByText('Confirm');
    confirmButton.click();

    expect(mockOnConfirm).toHaveBeenCalledWith(mockModal.action);
  });

  it('does not render modal when isOpen is false', () => {
    const closedModalState = {
      ...defaultState,
      'LeagueOperations.registration.slice.grids': {
        modal: {
          ...mockModal,
          isOpen: false,
        },
      },
    };

    renderWithStore(closedModalState);

    expect(screen.queryByText('Test Header')).not.toBeInTheDocument();
  });
});
