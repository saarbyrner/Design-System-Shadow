import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChatChannelSearch from '../ChatChannelSearch';
import testDataSearchableItemGroups from '../../../resources/testDataSearchableItemGroups';

jest.useFakeTimers();

describe('<ChatChannelSearch/> component', () => {
  const baseProps = {
    searchableItemGroups: testDataSearchableItemGroups,
    maxDisplayableResults: 10,
    directChannels: [],
    userRole: {
      identity: '6||123',
      orgId: '6',
      staffUserId: '123',
      permissions: {
        canViewMessaging: true,
        canCreatePrivateChannel: true,
        canCreateDirectChannel: true,
      },
    },
    onSwitchedChannel: jest.fn(),
    onDirectMessageUser: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders channels matching the search term', async () => {
    render(<ChatChannelSearch {...baseProps} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Channel' },
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(800);
    });

    expect(await screen.findByText('Channel 01')).toBeInTheDocument();
    expect(screen.getByText('Channel 02')).toBeInTheDocument();
    expect(screen.getByText('Channel 03')).toBeInTheDocument();
  });

  it('renders staff matching a full name search', async () => {
    render(<ChatChannelSearch {...baseProps} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'adam conway' },
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(800);
    });

    expect(await screen.findByText('Adam Conway : Staff')).toBeInTheDocument();
  });

  it('renders an athlete matching the search term', async () => {
    render(<ChatChannelSearch {...baseProps} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Billy' },
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(800);
    });

    expect(
      await screen.findByText('Billy Teammates (Squad B)')
    ).toBeInTheDocument();
  });

  it('renders a "no results" message when no matches are found', async () => {
    render(<ChatChannelSearch {...baseProps} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Obscure Name' },
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(800);
    });

    expect(await screen.findByText(/no result/i)).toBeInTheDocument();
  });

  it('calls onSwitchedChannel when an existing channel is selected', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ChatChannelSearch {...baseProps} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Channel 01' },
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(800);
    });

    const result = await screen.findByText('Channel 01');
    await user.click(result);

    expect(baseProps.onSwitchedChannel).toHaveBeenCalledTimes(1);
    expect(baseProps.onSwitchedChannel).toHaveBeenCalledWith('ch_01');
  });

  it('calls onDirectMessageUser when a staff member is selected', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ChatChannelSearch {...baseProps} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'David Kelly' },
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(800);
    });

    const result = await screen.findByText('David Kelly : Staff');
    await user.click(result);

    expect(baseProps.onDirectMessageUser).toHaveBeenCalledTimes(1);
    expect(baseProps.onDirectMessageUser).toHaveBeenCalledWith(
      '6||104',
      '104',
      'staff',
      'David Kelly'
    );
  });
});
