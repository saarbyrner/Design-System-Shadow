import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';
import DuplicateDashboardModal from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<DuplicateDashboardModal />', () => {
  const props = {
    dashboardName: '',
    isOpen: true,
    onChangeDashboardName: jest.fn(),
    onClickCloseAppStatus: jest.fn(),
    onClickCloseModal: jest.fn(),
    onClickSaveDuplicateDashboard: jest.fn(),
    status: null,
    selectedSquad: {},
    activeSquad: { id: 123 },
    squadData: {
      data: [
        { id: 2, name: 'Test Squad' },
        { id: 246, name: 'Test Squad 246' },
      ],
      isFetching: false,
      refetch: jest.fn(),
      error: undefined,
    },
    onChangeSelectedSquad: jest.fn(),
    t: (key) => key,
  };

  let mockTrackEvent;

  beforeEach(() => {
    mockTrackEvent = jest.fn();
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('contains a modal', () => {
    renderWithStore(<DuplicateDashboardModal {...props} />);

    expect(screen.getByText('Duplicate Dashboard')).toBeInTheDocument();
  });

  it('calls the correct props when closing the modal', async () => {
    const user = userEvent.setup();
    const propsWithHandler = { ...props, onClickCloseModal: jest.fn() };

    renderWithStore(<DuplicateDashboardModal {...propsWithHandler} />);

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(propsWithHandler.onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('has a text input', () => {
    renderWithStore(<DuplicateDashboardModal {...props} />);

    expect(screen.getByLabelText('Dashboard Name')).toBeInTheDocument();
  });

  it('has a footer with a save button', () => {
    renderWithStore(<DuplicateDashboardModal {...props} />);

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls the correct callback when clicking save', async () => {
    const user = userEvent.setup();
    const propsWithHandler = {
      ...props,
      onClickSaveDuplicateDashboard: jest.fn(),
    };

    renderWithStore(<DuplicateDashboardModal {...propsWithHandler} />);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(
      propsWithHandler.onClickSaveDuplicateDashboard
    ).toHaveBeenCalledTimes(1);
  });

  it('calls trackEvent with "Duplicate Dashboard" when save is clicked', async () => {
    const user = userEvent.setup();

    renderWithStore(<DuplicateDashboardModal {...props} />);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      reportingEventNames.duplicateDashboard
    );
  });

  describe('when the duplicate-across-squads flag is on', () => {
    beforeEach(() => {
      window.setFlag('duplicate-across-squads', true);
    });

    it('has a select squad dropdown', () => {
      renderWithStore(<DuplicateDashboardModal {...props} />);

      expect(screen.getByLabelText('Select Squad')).toBeInTheDocument();
    });

    it('disables the squads select when is fetching is true', () => {
      const loadingProps = {
        ...props,
        squadData: {
          ...props.squadData,
          isFetching: true,
        },
      };

      renderWithStore(<DuplicateDashboardModal {...loadingProps} />);

      const squadSelect = screen.getByLabelText('Select Squad');
      expect(squadSelect).toBeDisabled();
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

      renderWithStore(<DuplicateDashboardModal {...errorProps} />);

      expect(
        screen.getByTestId('DuplicateDashboardModal|SquadSelectError')
      ).toBeInTheDocument();
      expect(screen.getByText('Error loading squads.')).toBeInTheDocument();

      const retryLink = screen.getByTestId(
        'DuplicateDashboardModal|SquadSelectErrorAction'
      );
      await user.click(retryLink);

      expect(errorProps.squadData.refetch).toHaveBeenCalledTimes(1);
    });
  });
});
