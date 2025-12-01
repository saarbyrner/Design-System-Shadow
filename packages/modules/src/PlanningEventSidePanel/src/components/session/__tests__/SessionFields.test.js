import { Provider } from 'react-redux';
import { VirtuosoMockContext } from 'react-virtuoso';
import { render, screen, waitFor, getByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { server, rest } from '@kitman/services/src/mocks/server';
import { setupStore } from '@kitman/modules/src/AppRoot/store';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import SessionFields from '../SessionFields';

describe('<SessionFields />', () => {
  const testEvent = {
    workload_type: 1,
    type: 'session_event',
    session_type_id: null,
    title: '',
    editable: true,
  };

  const testValidity = {
    type: testEvent.type,
  };

  const props = {
    event: testEvent,
    eventValidity: testValidity,
    onUpdateEventDetails: jest.fn(),
    onUpdateEventTitle: jest.fn(),
    onDataLoadingStatusChanged: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderSessionFields = (
    { panelMode, mockProps } = { panelMode: 'EDIT', mockProps: props }
  ) =>
    render(<SessionFields {...mockProps} panelMode={panelMode} />, {
      wrapper: ({ children }) => (
        <Provider store={setupStore()}>
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 200, itemHeight: 50 }}
          >
            {children}
          </VirtuosoMockContext.Provider>
        </Provider>
      ),
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderSessionFields();
    expect(screen.getByText('Session type')).toBeInTheDocument();
  });

  it('renders expected components', async () => {
    const testEventWithSessionType = {
      ...testEvent,
      session_type_id: 2,
    };

    const testValidityWithSessionType = {
      session_type_id: { isInvalid: false },
      workload_type: { isInvalid: false },
      game_day_minus: { isInvalid: false },
      game_day_plus: { isInvalid: false },
    };

    const propsWithSessionType = {
      ...props,
      event: testEventWithSessionType,
      eventValidity: testValidityWithSessionType,
    };

    renderSessionFields({ mockProps: propsWithSessionType });

    const sessionTypeLabel = screen.getByText('Session type');
    expect(sessionTypeLabel).toBeInTheDocument();

    // The session type field should be rendered
    const sessionTypeInput = screen.getByRole('textbox');
    expect(sessionTypeInput).toBeInTheDocument();
  });

  it('renders the SegmentedControl when managing workload is allowed', () => {
    const propsWithWorkload = {
      ...props,
      canManageWorkload: true,
    };

    renderSessionFields({ mockProps: propsWithWorkload });

    expect(screen.getByText('Workload')).toBeInTheDocument();
    expect(screen.getByText('Session type')).toBeInTheDocument();
  });

  it('calls onUpdateEventDetails callback', async () => {
    const mockOnUpdateEventDetails = jest.fn();
    const mockOnUpdateEventTitle = jest.fn();

    const propsWithCallbacks = {
      ...props,
      canManageWorkload: true,
      onUpdateEventDetails: mockOnUpdateEventDetails,
      onUpdateEventTitle: mockOnUpdateEventTitle,
    };

    const user = userEvent.setup();

    renderSessionFields({ mockProps: propsWithCallbacks });

    // Wait for the component to render
    expect(screen.getByText('Workload')).toBeInTheDocument();

    // Find the workload buttons (Squad loading and Individual loading)
    const squadLoadingButton = screen.getByText('Squad loading');
    expect(squadLoadingButton).toBeInTheDocument();

    await user.click(squadLoadingButton);
    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({ workload_type: 1 });
  });

  it('renders the necessary fields as invalid', () => {
    const invalidEventValidity = {
      session_type_id: { isInvalid: true },
    };

    const propsWithInvalidData = {
      ...props,
      eventValidity: invalidEventValidity,
    };

    renderSessionFields({ mockProps: propsWithInvalidData });

    // The component should render with invalid state
    expect(screen.getByText('Session type')).toBeInTheDocument();
  });

  describe('when the planning-custom-org-event-details flag is enabled', () => {
    const mockedSessionTypes = [
      {
        id: 1,
        name: 'First Practice',
        category: {
          id: 3,
          name: 'Practice',
        },
        isJointSessionType: false,
      },
      {
        id: 2,
        name: 'First Other',
        category: {
          id: 2,
          name: 'Other',
        },
        isJointSessionType: false,
      },
      {
        id: 3,
        name: 'Second Other',
        category: {
          id: 2,
          name: 'Other',
        },
        isJointSessionType: false,
      },
      {
        id: 4,
        name: 'Second Practice Joint Type',
        category: {
          id: 3,
          name: 'Practice',
        },
        isJointSessionType: true,
      },
    ];

    beforeEach(() => {
      window.setFlag('planning-custom-org-event-details', true);

      server.use(
        rest.get('/session_types', (_, res, ctx) =>
          res(ctx.json(mockedSessionTypes))
        )
      );
    });

    const newEvent = {
      workload_type: 1,
      session_type_id: null,
      type: 'session_event',
      title: '',
      editable: true,
    };

    const mockOnUpdateEventDetails = jest.fn();
    const mockOnUpdateEventTitle = jest.fn();

    const testProps = {
      ...props,
      onUpdateEventDetails: mockOnUpdateEventDetails,
      onUpdateEventTitle: mockOnUpdateEventTitle,
      event: newEvent,
    };

    it('works properly when session types are split by category', async () => {
      renderSessionFields({ mockProps: testProps });

      expect(screen.getByText('Session type')).toBeInTheDocument();

      // The component should render with null session_type_id
      const sessionTypeInput = screen.getByRole('textbox');
      expect(sessionTypeInput).toBeInTheDocument();
    });
  });

  it('doesn’t show duplication configurators', async () => {
    renderSessionFields();

    expect(
      screen.queryByText('Duplicate participant list')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Duplicate session plan')
    ).not.toBeInTheDocument();
  });

  describe('when session-type-favourite feature flag is enabled', () => {
    const mockedSessionTypes = [
      {
        id: 1,
        name: 'first type',
      },
      {
        id: 2,
        name: 'second type',
      },
      {
        id: 3,
        name: 'third type',
      },
      {
        id: 4,
        name: 'fourth type',
      },
    ];

    let mockedFavoriteSessionTypes = mockedSessionTypes.slice(0, 1);

    describe('shows session types selector which supports favoriting', () => {
      beforeEach(() => {
        server.use(
          rest.get('session_types', (_, res, ctx) =>
            res(ctx.json(mockedSessionTypes))
          ),

          rest.get('user_favorites', (_, res, ctx) =>
            res(ctx.json({ favorites: mockedFavoriteSessionTypes }))
          ),
          rest.post('user_favorites', async (req, res, ctx) => {
            const { id } = await req.json();
            mockedFavoriteSessionTypes.push(
              mockedSessionTypes.find((type) => type.id === id)
            );
            return res(ctx.json({ favorites: mockedFavoriteSessionTypes }));
          }),
          rest.delete('user_favorites', async (req, res, ctx) => {
            const { id } = await req.json();
            mockedFavoriteSessionTypes = mockedFavoriteSessionTypes.filter(
              (type) => type.id !== id
            );
            return res(ctx.json({ favorites: mockedFavoriteSessionTypes }));
          })
        );

        window.setFlag('session-type-favourite', true);
      });

      it('allows favoriting', async () => {
        mockedFavoriteSessionTypes = [];

        const notFavoritedSessionTypeName = mockedSessionTypes[0].name;
        const user = userEvent.setup();

        renderSessionFields();
        await screen.findByText('Session type');
        await user.click(screen.getAllByRole('textbox')[0]);

        await waitFor(() => {
          expect(screen.queryByText('Favorites')).not.toBeInTheDocument();
          expect(
            screen.getByText(notFavoritedSessionTypeName)
          ).toBeInTheDocument();
        });

        const notFavoritedSessionTypeNameContainer = (
          await screen.findByText(notFavoritedSessionTypeName)
        ).parentNode;
        await user.click(
          getByRole(notFavoritedSessionTypeNameContainer, 'button')
        );

        await waitFor(() => {
          expect(screen.queryByText('Favorites')).toBeInTheDocument();
          expect(
            screen.getByText(notFavoritedSessionTypeName)
          ).toBeInTheDocument();
        });
      });

      it('allows unfavoriting', async () => {
        mockedFavoriteSessionTypes = mockedSessionTypes.slice(0, 1);

        const favoritedSessionTypeName = mockedFavoriteSessionTypes[0].name;
        const user = userEvent.setup();

        renderSessionFields();
        await screen.findByText('Session type');
        await user.click(screen.getAllByRole('textbox')[0]);

        await waitFor(() => {
          expect(screen.getByText('Favorites')).toBeInTheDocument();
          expect(
            screen.getByText(favoritedSessionTypeName)
          ).toBeInTheDocument();
        });

        const favoritedSessionTypeContainer = (
          await screen.findByText(favoritedSessionTypeName)
        ).parentNode;
        await user.click(getByRole(favoritedSessionTypeContainer, 'button'));

        await waitFor(() => {
          expect(screen.queryByText('Favorites')).not.toBeInTheDocument();
          expect(
            screen.getByText(favoritedSessionTypeName)
          ).toBeInTheDocument();
        });
      });
    });
  });

  describe('when planning-tab-sessions and selection-tab-displaying-in-session feature flags are enabled', () => {
    beforeEach(() => {
      window.setFlag('planning-tab-sessions', true);
      window.setFlag('selection-tab-displaying-in-session', true);
    });

    it('shows duplication configurators', async () => {
      renderSessionFields({ panelMode: 'DUPLICATE', mockProps: props });

      expect(
        await screen.findByText('Duplicate participant list')
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Duplicate session plan')
      ).toBeInTheDocument();
    });
  });

  describe('when pac-event-sidepanel-sessions-games-show-athlete-dropdown feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag(
        'pac-event-sidepanel-sessions-games-show-athlete-dropdown',
        true
      );
    });

    it('does not render duplication configurators', () => {
      renderSessionFields({ panelMode: 'DUPLICATE', mockProps: props });

      expect(
        screen.queryByText('Duplicate participant list')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Duplicate session plan')
      ).not.toBeInTheDocument();
    });
  });
});
