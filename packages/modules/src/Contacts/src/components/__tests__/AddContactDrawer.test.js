import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { getTranslations } from '@kitman/modules/src/Contacts/shared/utils';
import { useLeagueOperations } from '@kitman/common/src/hooks';
import { useGetTvChannelsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi';
import { axios } from '@kitman/common/src/utils/services';
import * as redux from 'react-redux';
import { getStoreForTest } from '@kitman/modules/src/MatchDay/shared/utils';
import AddContactDrawer from '../AddContactDrawer';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi'
);

describe('AddContactDrawer', () => {
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);

  const onSave = jest.fn();
  const onClose = jest.fn();
  const defaultProps = { onSave, onClose, isOpen: true };

  const mockTvChannels = [
    { id: 1, name: 'Espn' },
    { id: 2, name: 'Sky Sports' },
  ];

  const renderComponent = (props = {}, { isLeague, tvChannels = [] } = {}) => {
    useLeagueOperations.mockReturnValue({ isLeague });

    useGetTvChannelsQuery.mockReturnValue({
      data: tvChannels,
    });

    return renderWithProviders(
      <AddContactDrawer {...defaultProps} {...props} />,
      {
        store: getStoreForTest(),
      }
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByRole('heading', 'Add Contact')).toBeInTheDocument();
    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Roles')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Mailing list')).toBeInTheDocument();
    expect(screen.getByLabelText('DMN')).toBeInTheDocument();
    expect(screen.getByLabelText('DMR')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders "Associated with" dropdown for league users', () => {
    renderComponent({}, { isLeague: true });
    expect(screen.getByLabelText('Associated with')).toBeInTheDocument();
  });

  it('does not render TV field when there are no TV channels', () => {
    renderComponent({}, { tvChannels: [] });
    expect(screen.queryByLabelText('TV')).not.toBeInTheDocument();
  });

  it('renders TV field when there are TV channels', () => {
    renderComponent({}, { tvChannels: mockTvChannels });
    expect(screen.getByLabelText('TV')).toBeInTheDocument();
  });

  it('allows selecting a TV channel', async () => {
    const user = userEvent.setup();
    renderComponent({}, { tvChannels: mockTvChannels });
    const tvField = screen.getByLabelText('TV');
    await user.click(tvField);
    const option = screen.getByText('Sky Sports');
    await user.click(option);
    expect(tvField).toHaveValue('Sky Sports');
  });

  it('calls onClose on cancel', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when click on close icon', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByTestId('CloseIcon'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays error message correctly when submitting invalid form', async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText(textEnum.error.name)).toBeInTheDocument();
    expect(
      screen.getByText(textEnum.error.gameContactRoles)
    ).toBeInTheDocument();
    expect(screen.getByText(textEnum.error.mailingList)).toBeInTheDocument();
  });

  it('displays an error message when email already in use', async () => {
    const user = userEvent.setup();
    jest.spyOn(redux, 'useDispatch');
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);

    jest.spyOn(axios, 'patch').mockImplementation(() => {
      // eslint-disable-next-line no-throw-literal
      throw {
        response: { data: { errors: { email: ['has already been taken'] } } },
      };
    });

    renderComponent({
      data: {
        id: 1,
        name: 'name',
        organisation: { id: 1 },
        gameContactRoles: [
          {
            id: 1,
            name: 'AAA',
          },
        ],
        phone: '+4407336742159',
        email: 'contact@gmail.com',
        status: 'approved',
        dmn: true,
      },
    });

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'ERROR',
        title: textEnum.error.emailAlreadyTaken,
      },
      type: 'toasts/add',
    });
  });
});
