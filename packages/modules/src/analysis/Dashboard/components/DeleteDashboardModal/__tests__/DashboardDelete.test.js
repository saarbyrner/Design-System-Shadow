import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import $ from 'jquery';
import DeleteDashboardModal from '..';

const mockLocationAssign = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    assign: mockLocationAssign,
  },
  writable: true,
});

describe('Analytical Dashboard <DeleteDashboardModal /> component', () => {
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    dashboard: {
      id: 4,
      name: 'Dashboard Name',
    },
    modalType: null,
    onClickCloseButton: jest.fn(),
    onRequestStart: jest.fn(),
    onRequestFail: jest.fn(),
    t: i18nT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationAssign.mockClear();
  });

  it('renders', () => {
    renderWithStore(<DeleteDashboardModal {...props} />);

    expect(screen.getByTestId('AppStatus')).toBeInTheDocument();
  });

  it("opens the confirm modal when modalType is 'confirm'", () => {
    renderWithStore(<DeleteDashboardModal {...props} modalType="confirm" />);

    const appStatus = screen.getByTestId('AppStatus-confirm');
    expect(appStatus).toBeInTheDocument();

    expect(
      screen.getByText(
        'Are you sure you want to delete the “Dashboard Name” dashboard and all its content?'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  describe('When confirming the deletion and the request succeed', () => {
    let ajaxSpy;

    beforeEach(() => {
      ajaxSpy = jest.spyOn($, 'ajax').mockImplementation(() => {
        const mockServerResponse = {
          done: jest.fn((callback) => {
            callback();
            return mockServerResponse;
          }),
          fail: jest.fn(() => mockServerResponse),
        };
        return mockServerResponse;
      });
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    it('sends the correct request', async () => {
      const user = userEvent.setup();
      renderWithStore(<DeleteDashboardModal {...props} modalType="confirm" />);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      expect(props.onRequestStart).toHaveBeenCalledTimes(1);

      // Check that the correct AJAX request was made
      expect(ajaxSpy).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/analysis/dashboard/4',
        contentType: 'application/json',
      });

      // Check that redirect was called
      expect(mockLocationAssign).toHaveBeenCalledWith('/analysis/dashboard');
    });
  });

  describe('When confirming the deletion and the request fails', () => {
    let ajaxSpy;

    beforeEach(() => {
      ajaxSpy = jest.spyOn($, 'ajax').mockImplementation(() => {
        const mockServerResponse = {
          done: jest.fn(() => mockServerResponse),
          fail: jest.fn((callback) => {
            callback();
            return mockServerResponse;
          }),
        };
        return mockServerResponse;
      });
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    it('calls onRequestFail prop when the request fail', async () => {
      const user = userEvent.setup();
      renderWithStore(<DeleteDashboardModal {...props} modalType="confirm" />);
      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      await user.click(deleteButton);

      expect(props.onRequestFail).toHaveBeenCalledTimes(1);
    });
  });
});
