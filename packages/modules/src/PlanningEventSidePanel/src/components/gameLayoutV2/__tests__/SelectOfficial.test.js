import { render, screen, waitFor } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import selectEvent from 'react-select-event';
import { rest, server } from '@kitman/services/src/mocks/server';
import { SelectOfficialTranslated as SelectOfficial } from '../SelectOfficial';

const mockedOfficials = [
  {
    id: 1,
    firstname: 'John',
    lastname: 'Referee',
    fullname: 'John Referee',
  },
  {
    id: 2,
    firstname: 'Jane',
    lastname: 'Official',
    fullname: 'Jane Official',
  },
  {
    id: 3,
    firstname: 'Mike',
    lastname: 'Linesman',
    fullname: 'Mike Linesman',
  },
  {
    id: 4,
    firstname: 'Sarah',
    lastname: 'Judge',
    fullname: 'Sarah Judge',
  },
  {
    id: 5,
    firstname: 'Tom',
    lastname: 'Umpire',
    fullname: 'Tom Umpire',
  },
  {
    id: 6,
    firstname: 'Lisa',
    lastname: 'Referee',
    fullname: 'Lisa Referee',
  },
  {
    id: 7,
    firstname: 'David',
    lastname: 'Official',
    fullname: 'David Official',
  },
];

describe('<SelectOfficial />', () => {
  const mockProps = {
    isOpen: true,
    userIds: [1, 2, 3],
    onUpdateUserIds: jest.fn(),
    isDisabled: false,
    squad: {
      division: [{ id: 1 }],
    },
    t: (text) => text,
  };

  const renderComponent = (props) => {
    return render(<SelectOfficial {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    server.use(
      rest.get('/users/official_only', (_, res, ctx) =>
        res(ctx.json(mockedOfficials))
      )
    );
  });

  it('should render the SelectOfficial component', async () => {
    renderComponent(mockProps);

    const component = screen.getByTestId('SelectOfficial');
    expect(component).toBeInTheDocument();

    await waitFor(() => {
      expect(component.querySelector('.kitmanReactSelect')).toBeInTheDocument();
    });
  });

  it('should display the Official label', () => {
    renderComponent(mockProps);

    expect(screen.getByText('Official')).toBeInTheDocument();
  });

  it('should allow selecting officials', async () => {
    renderComponent(mockProps);

    await waitFor(() => {
      expect(screen.getByTestId('SelectOfficial')).toBeInTheDocument();
    });

    const wrapper = screen.getByTestId('SelectOfficial');
    const selectInput = wrapper.querySelector('.kitmanReactSelect input');

    selectEvent.openMenu(selectInput);

    await selectEvent.select(selectInput, mockedOfficials[3].fullname);

    expect(mockProps.onUpdateUserIds).toHaveBeenCalledWith([1, 2, 3, 4]);
  });

  it('should allow "Select all" functionality', async () => {
    renderComponent(mockProps);

    await waitFor(() => {
      expect(screen.getByTestId('SelectOfficial')).toBeInTheDocument();
    });

    const wrapper = screen.getByTestId('SelectOfficial');
    const selectInput = wrapper.querySelector('.kitmanReactSelect input');

    selectEvent.openMenu(selectInput);

    await waitFor(() => {
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });
  });

  it('should allow "Clear all" functionality', async () => {
    renderComponent(mockProps);

    await waitFor(() => {
      expect(screen.getByTestId('SelectOfficial')).toBeInTheDocument();
    });

    const wrapper = screen.getByTestId('SelectOfficial');
    const selectInput = wrapper.querySelector('.kitmanReactSelect input');

    selectEvent.openMenu(selectInput);

    await waitFor(() => {
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });
  });

  it('should handle multi-select properly', async () => {
    const propsWithEmptySelection = {
      ...mockProps,
      userIds: [],
      onUpdateUserIds: jest.fn(),
    };

    renderComponent(propsWithEmptySelection);

    await waitFor(() => {
      expect(screen.getByTestId('SelectOfficial')).toBeInTheDocument();
    });

    const wrapper = screen.getByTestId('SelectOfficial');
    const selectInput = wrapper.querySelector('.kitmanReactSelect input');

    selectEvent.openMenu(selectInput);

    await selectEvent.select(selectInput, mockedOfficials[0].fullname);
    expect(propsWithEmptySelection.onUpdateUserIds).toHaveBeenCalledWith([1]);

    propsWithEmptySelection.onUpdateUserIds.mockClear();

    await selectEvent.select(selectInput, mockedOfficials[1].fullname);
    expect(propsWithEmptySelection.onUpdateUserIds).toHaveBeenCalled();
  });

  it('should be disabled when isDisabled prop is true', () => {
    const disabledProps = {
      ...mockProps,
      isDisabled: true,
    };

    renderComponent(disabledProps);

    const wrapper = screen.getByTestId('SelectOfficial');
    const selectInput = wrapper.querySelector('input');
    expect(selectInput).toBeDisabled();
  });

  it('should not fetch officials when isOpen is false', () => {
    const closedProps = {
      ...mockProps,
      isOpen: false,
    };

    renderComponent(closedProps);

    expect(screen.getByText('Official')).toBeInTheDocument();
    expect(screen.getByTestId('SelectOfficial')).toBeInTheDocument();
  });

  it('should pass division_id when fetching officials', () => {
    const propsWithDivision = {
      ...mockProps,
      squad: {
        division: [{ id: 123 }],
      },
    };

    renderComponent(propsWithDivision);

    expect(screen.getByText('Official')).toBeInTheDocument();
  });

  it('should handle empty userIds array', () => {
    const propsWithEmptyUserIds = {
      ...mockProps,
      userIds: [],
    };

    renderComponent(propsWithEmptyUserIds);

    expect(screen.getByText('Official')).toBeInTheDocument();
    const selectComponent = screen.getByTestId('SelectOfficial');
    expect(selectComponent).toBeInTheDocument();
  });

  it('should handle undefined userIds', () => {
    const propsWithUndefinedUserIds = {
      ...mockProps,
      userIds: undefined,
    };

    renderComponent(propsWithUndefinedUserIds);

    expect(screen.getByText('Official')).toBeInTheDocument();
    const selectComponent = screen.getByTestId('SelectOfficial');
    expect(selectComponent).toBeInTheDocument();
  });
});
