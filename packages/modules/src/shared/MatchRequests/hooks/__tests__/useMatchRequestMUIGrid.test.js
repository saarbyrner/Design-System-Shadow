import { renderHook } from '@testing-library/react-hooks';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { userEventRequestStatuses } from '@kitman/common/src/consts/userEventRequestConsts';
import { data as userEventRequests } from '@kitman/services/src/mocks/handlers/leaguefixtures/getUserEventRequestsHandler';
import { menuButtonTypes } from '@kitman/modules/src/shared/FixtureScheduleView/helpers';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import { useMatchRequestMUIGrid } from '../useMatchRequestMUIGrid';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/hooks/useEventTracking');

const renderCellComponent = (Component) => {
  renderWithRedux(<>{Component}</>);
};

describe('useMatchRequestMUIGrid', () => {
  const defaultProps = {
    rowApiRequestStatus: userEventRequestStatuses.pending,
    userEventRequests: [],
    handleUserEventStatusActionUpdate: jest.fn(),
    setRejectRequestModal: jest.fn(),
    setUploadModal: jest.fn(),
    handleUserEventRequestAttachmentUpdate: jest.fn(),
    handleSetMenuButtonAction: jest.fn(),
  };
  beforeEach(() => {
    useLeagueOperations.mockReturnValue({
      organisationId: 5,
    });
    useEventTracking.mockReturnValue({
      trackEvent: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('no user event requests are passed into hook', () => {
    it('should return the rows as an empty array', () => {
      const { result } = renderHook(() => useMatchRequestMUIGrid(defaultProps));
      expect(result.current.rows).toStrictEqual([]);
    });
  });

  describe('user event requests are passed into hook', () => {
    it('should return the transformed rows', () => {
      const { result } = renderHook(() =>
        useMatchRequestMUIGrid({ ...defaultProps, userEventRequests })
      );
      expect(result.current.rows).toStrictEqual([
        {
          attachment: {
            filename: 'testFilename.pdf',
            filetype: 'pdf',
            url: 'testurl.com',
          },
          editable: true,
          id: 1,
          requestDate: 'Jun 23, 2024',
          requestTime: '10:30 AM',
          reviewDate: 'Jun 28, 2024',
          reviewTime: '12:30 PM',
          scout: 'Ted Burger-admin-eu',
          status: 'pending',
          team: 'Manchester United',
          teamIcon: 'testimage.jpg',
          actions: {
            handleMenuButtonAction: expect.any(Function),
            isVisible: true,
          },
        },
      ]);
    });
    it('should render Approve/Reject buttons when request is editable and pending', async () => {
      const user = userEvent.setup();
      const { result } = renderHook(() =>
        useMatchRequestMUIGrid({ ...defaultProps, userEventRequests })
      );

      const { columns, rows } = result.current;
      const accessColumn = columns.find(
        (col) => col.field === 'accessRequests'
      );
      const cell = accessColumn.renderCell({ row: rows[0] });

      renderCellComponent(cell);

      expect(screen.getByText('Approve')).toBeInTheDocument();
      expect(screen.getByText('Reject')).toBeInTheDocument();

      await user.click(screen.getByText('Approve'));
      expect(
        defaultProps.handleUserEventStatusActionUpdate
      ).toHaveBeenCalledWith({
        status: userEventRequestStatuses.approved,
        requestIds: [1],
      });

      await user.click(screen.getByText('Reject'));
      expect(defaultProps.setRejectRequestModal).toHaveBeenCalledWith({
        isOpen: true,
        requestIds: [1],
      });
    });

    it('should render the file name if request has attachment', () => {
      const { result } = renderHook(() =>
        useMatchRequestMUIGrid({ ...defaultProps, userEventRequests })
      );

      const { columns, rows } = result.current;

      const matchColumn = columns.find(
        (col) => col.field === 'scoutAttachment'
      );
      const cell = matchColumn.renderCell({ row: rows[0] });

      renderCellComponent(cell);
      expect(screen.getByText('testFilename.pdf')).toBeInTheDocument();
    });

    it('should delete attachment on click when editable', async () => {
      const user = userEvent.setup();
      const { result } = renderHook(() =>
        useMatchRequestMUIGrid({ ...defaultProps, userEventRequests })
      );

      const { columns, rows } = result.current;

      const matchColumn = columns.find(
        (col) => col.field === 'scoutAttachment'
      );
      const cell = matchColumn.renderCell({ row: rows[0] });

      renderCellComponent(cell);
      const deleteButton = screen.getByRole('button');
      await user.click(deleteButton);

      expect(
        defaultProps.handleUserEventRequestAttachmentUpdate
      ).toHaveBeenCalledWith([1], null);
    });

    it('should allow a user to access the withdraw request menu button when their org id is the same as the user event request', async () => {
      const user = userEvent.setup();
      const { result } = renderHook(() =>
        useMatchRequestMUIGrid({ ...defaultProps, userEventRequests })
      );

      const { columns, rows } = result.current;

      const matchColumn = columns.find((col) => col.field === 'actions');
      const cell = matchColumn.renderCell({ value: rows[0]?.actions });

      renderCellComponent(cell);
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);
      await user.click(screen.getByText('Withdraw request'));

      expect(defaultProps.handleSetMenuButtonAction).toHaveBeenCalledWith({
        id: 1,
        type: menuButtonTypes.withdraw,
      });
    });

    it('should prevent the user from seeing the withdraw request action if their orgId is different to the user event request org', () => {
      useLeagueOperations.mockReturnValue({
        organisationId: 10,
      });

      const { result } = renderHook(() =>
        useMatchRequestMUIGrid({ ...defaultProps, userEventRequests })
      );

      const { columns, rows } = result.current;

      const matchColumn = columns.find((col) => col.field === 'actions');
      const cell = matchColumn.renderCell({ value: rows[0]?.actions });

      renderCellComponent(cell);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  it('should add review date/time column to the grid', () => {
    const { result } = renderHook(() =>
      useMatchRequestMUIGrid({ ...defaultProps, userEventRequests })
    );

    const { columns } = result.current;

    expect(columns.some((col) => col.field === 'reviewDate')).toBe(true);
    expect(columns.some((col) => col.field === 'reviewTime')).toBe(true);
  });

  it('should populate review date and time when request is approved', () => {
    const approvedRequest = {
      ...userEventRequests[0],
      status: userEventRequestStatuses.approved,
      reviewed_at: '2025-10-14T13:33:03Z',
    };

    const { result } = renderHook(() =>
      useMatchRequestMUIGrid({
        ...defaultProps,
        userEventRequests: [approvedRequest],
      })
    );

    const [row] = result.current.rows;

    expect(row.reviewDate).toBe('Oct 14, 2025');
    expect(row.reviewTime).toBe('13:33 PM');
  });
});
