import { render, screen } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import selectEvent from 'react-select-event';
import { rest, server } from '@kitman/services/src/mocks/server';
import { PlanningEventStaffSelectTranslated as PlanningEventSelectStaff } from '../PlanningEventStaffSelect';

const mockedStaff = [
  {
    id: 1,
    firstname: 'Michael',
    lastname: 'Yao',
    fullname: 'Michael Yao',
  },
  {
    id: 2,
    firstname: 'Yao',
    lastname: 'Michael',
    fullname: 'Yao Michael',
  },
  {
    id: 3,
    firstname: 'Yao',
    lastname: 'Wilfried',
    fullname: 'Yao Wilfried',
  },
  {
    id: 4,
    firstname: 'Wilfried',
    lastname: 'Yao',
    fullname: 'Wilfried Yao',
  },
  {
    id: 5,
    firstname: 'John',
    lastname: 'Doe',
    fullname: 'John Doe',
  },
  {
    id: 6,
    firstname: 'Doe',
    lastname: 'John',
    fullname: 'Doe John',
  },
  {
    id: 7,
    firstname: 'John',
    lastname: 'John',
    fullname: 'John John',
  },
];

describe('<SelectStaff />', () => {
  const mockProps = {
    event: {
      mls_game_key: false,
      user_ids: [1, 2, 3, 4, 5],
    },
    eventValidity: {
      staff_id: {
        isInvalid: false,
      },
    },
    onUpdateEventDetails: jest.fn(),
    t: (text) => text,
  };

  const renderComponent = (props) => {
    return render(<PlanningEventSelectStaff {...props} />, {
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
    server.use(
      rest.get('/users/staff_only', (_, res, ctx) => res(ctx.json(mockedStaff)))
    );
  });

  it('should allow selecting more than 5 staff', async () => {
    renderComponent(mockProps);

    const wrapper = screen.getByTestId('PlanningEventSelectStaff');
    selectEvent.openMenu(wrapper.querySelector('.kitmanReactSelect input'));

    await selectEvent.select(
      wrapper.querySelector('.kitmanReactSelect input'),
      mockedStaff[5].fullname
    );

    expect(mockProps.onUpdateEventDetails.mock.calls).toEqual([
      [
        {
          user_ids: [1, 2, 3, 4, 5, 6],
        },
      ],
    ]);
  });

  it('should allow "Select all"', async () => {
    renderComponent(mockProps);

    const wrapper = screen.getByTestId('PlanningEventSelectStaff');
    selectEvent.openMenu(wrapper.querySelector('.kitmanReactSelect input'));
    const selectAll = screen.getByText('Select All');
    expect(selectAll).toBeInTheDocument();
  });

  it('should render "No staff selected" when there is no staff', async () => {
    renderComponent({
      ...mockProps,
      event: { ...mockProps.event, user_ids: [] },
    });
    expect(await screen.findByText('No staff selected')).toBeInTheDocument();
  });

  it('should not render "Select up to 5 staff"', () => {
    renderComponent(mockProps);
    expect(screen.queryByText('Select up to 5 staff')).not.toBeInTheDocument();
  });

  it(
    'should render "No staff selected" when there is user_ids on event but they do not' +
      'match any records in the staff response',
    async () => {
      renderComponent({
        ...mockProps,
        event: { ...mockProps.event, user_ids: [9999999] },
      });
      expect(await screen.findByText('No staff selected')).toBeInTheDocument();
    }
  );

  describe('as MLS org', () => {
    const mockMlsProps = {
      ...mockProps,
      onUpdateEventDetails: jest.fn(),
      event: {
        ...mockProps.event,
        mls_game_key: 'mls-123',
      },
    };

    it('should allow selecting up to 5 staff', async () => {
      renderComponent(mockMlsProps);

      const wrapper = screen.getByTestId('PlanningEventSelectStaff');
      selectEvent.openMenu(wrapper.querySelector('.kitmanReactSelect input'));

      await selectEvent.select(
        wrapper.querySelector('.kitmanReactSelect input'),
        mockedStaff[5].fullname
      );

      expect(mockMlsProps.onUpdateEventDetails.mock.calls).toEqual([]);
    });

    it('should hide "Select All"', () => {
      renderComponent(mockMlsProps);
      expect(screen.queryByText('Select All')).not.toBeInTheDocument();
    });

    it('should set the placeholder to "Select up to 5 staff"', () => {
      renderComponent({
        ...mockProps,
        onUpdateEventDetails: jest.fn(),
        event: {
          ...mockProps.event,
          mls_game_key: 'mls-123',
          user_ids: [],
        },
      });
      expect(screen.getByText('Select up to 5 staff')).toBeInTheDocument();
    });
  });
});
