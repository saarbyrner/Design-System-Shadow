import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import { generalData } from '@kitman/services/src/mocks/handlers/planning/getEventLocations';
import { LocationSelectTranslated as LocationSelect } from '../LocationSelect';

describe('LocationSelect', () => {
  const testValidity = {
    event_location: { isInvalid: false },
  };
  const baseProps = {
    event: {},
    onUpdateEventDetails: jest.fn(),
    eventValidity: testValidity,
  };
  describe('when there is not an existing event location selected', () => {
    it('renders properly', async () => {
      render(<LocationSelect {...baseProps} />, {
        wrapper: ({ children }) => (
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 10000, itemHeight: 50 }}
          >
            {children}
          </VirtuosoMockContext.Provider>
        ),
      });
      expect(screen.getByText('Search locations...')).toBeInTheDocument();
    });
  });

  describe('when there is an existing event location saved', () => {
    it('and the event location is already included in the list', async () => {
      render(
        <LocationSelect
          {...baseProps}
          event={{ type: 'session', event_location: { id: generalData[0].id } }}
        />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 10000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        }
      );
      expect(screen.getByText('Location')).toBeInTheDocument();
      // Click to open select
      await userEvent.click(screen.getByRole('textbox'));

      // type into the selector
      await userEvent.type(screen.getByRole('textbox'), generalData[0].name);

      await waitFor(() =>
        // the label of the grouping and the actual option should be visible, and the current selection
        expect(screen.getAllByText(generalData[0].name).length).toEqual(3)
      );
    });

    it('and the event location is NOT already included in the list', async () => {
      render(
        <LocationSelect
          {...baseProps}
          event={{
            event_location: {
              id: 1300,
              name: 'Green Stadium',
              parent_event_location_id: null,
              parents: [],
            },
          }}
        />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 10000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        }
      );
      expect(screen.getByText('Location')).toBeInTheDocument();
      // Click to open select
      await userEvent.click(screen.getByRole('textbox'));
      await userEvent.type(screen.getByRole('textbox'), 'Green Stadium');

      await waitFor(() =>
        // the label of the grouping and the actual option should be visible, and the current selection
        expect(screen.getAllByText('Green Stadium').length).toEqual(3)
      );
    });
  });

  describe('featureFlags[game-details] Game Event', () => {
    it('renders the dropdown options without parent and allows the user to select an option', async () => {
      window.featureFlags = { 'game-details': true };
      render(
        <LocationSelect
          {...baseProps}
          event={{
            event_location: { id: generalData[0].id },
            type: 'game_event',
          }}
        />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 10000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        }
      );
      // general data [0] should be in the document
      const select = screen.getByRole('textbox');
      await userEvent.click(select);

      await act(async () => {
        await userEvent.type(select, generalData[1].name.slice(0, 3)); // search by typing
        await waitFor(() => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        // click that option
        await userEvent.click(screen.getByText(generalData[1].name));
      });

      // expected on update event details to be called with general data [1]
      expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
        event_location: { id: generalData[1].id, name: generalData[1].name },
      });

      window.featureFlags = { 'game-details': false };
    });
  });
});
