import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import mockedRegistrationHistory from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_history';
import useChangeStatusPanel from '../hooks/useChangeStatusPanel';
import ChangeStatusPanel from '..';

jest.mock('../hooks/useChangeStatusPanel');

describe('ChangeStatusPanel', () => {
  const i18nT = i18nextTranslateStub(i18n);

  const renderComponent = ({
    isUserUnapproved = false,
    isUnapprovingUser = false,
    isPanelStateValid = true,
    isOpen = true,
    registrationHistory = undefined,
  } = {}) => {
    useChangeStatusPanel.mockReturnValue({
      handleOnClose: jest.fn(),
      onSave: jest.fn(),
      handleStatusChange: jest.fn(),
      handleTracking: jest.fn(),
      panelState: {
        status: RegistrationStatusEnum.APPROVED,
        reasonId: '1',
      },
      reasons: [
        {
          id: '1',
          name: 'Reason 1',
        },
      ],
      username: 'Naruto Uzumaki',
      isUserUnapproved,
      isUnapprovingUser,
      isPanelStateValid,
      modalBody: null,
      registrationHistory,
    });
    const props = {
      t: i18nT,
    };

    renderWithRedux(<ChangeStatusPanel {...props} />, {
      preloadedState: {
        [REDUCER_KEY]: {
          panel: {
            isOpen,
          },
        },
      },
      useGlobalStore: false,
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render the reason and notes fields when the user is currently approved', () => {
    renderComponent({
      isUserUnapproved: false,
    });

    expect(
      screen.getByText('Change Status for Naruto Uzumaki')
    ).toBeInTheDocument();
    expect(screen.getByText('Status of the user')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approved' })).toBeEnabled();
    expect(screen.queryByLabelText('Reason')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Notes')).not.toBeInTheDocument();
  });

  it('should render all the fields when the user is currently unapproved', () => {
    renderComponent({
      isUserUnapproved: true,
      isUnapprovingUser: true,
    });

    expect(
      screen.getByText('Change Status for Naruto Uzumaki')
    ).toBeInTheDocument();
    expect(screen.getByText('Status of the user')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unapproved' })).toBeEnabled();
    expect(screen.getByLabelText('Reason')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('should not render any fields when the modal state [isOpen] is false', () => {
    renderComponent({
      isOpen: false,
    });

    expect(
      screen.queryByText('Change Status for Naruto Uzumaki')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Status of the user')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Approved' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Unapproved' })
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Reason')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Notes')).not.toBeInTheDocument();
  });

  it('should not render the registration history when the registration history is undefined', () => {
    renderComponent({
      registrationHistory: undefined,
    });

    expect(screen.queryByText('Show status history')).not.toBeInTheDocument();
  });

  it('should not render the registration history when the registration history is empty', () => {
    renderComponent({
      registrationHistory: {
        ...mockedRegistrationHistory,
        status_history: [],
      },
    });

    expect(screen.queryByText('Show status history')).not.toBeInTheDocument();
  });

  it('should render the registration history when the registration history is defined', () => {
    renderComponent({
      registrationHistory: mockedRegistrationHistory,
    });
    expect(screen.getByText('Show status history')).toBeInTheDocument();
  });

  it('reasons dropdown should not be disabled and should be able to see the previous reason when the user is unapproving', () => {
    renderComponent({
      isUserUnapproved: true,
      isUnapprovingUser: true,
    });
    const reasonsDropdown = screen.getByLabelText('Reason');
    expect(reasonsDropdown).toBeEnabled();
    expect(reasonsDropdown).toHaveValue('Reason 1');
  });
});
