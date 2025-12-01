/* eslint-disable jest/no-standalone-expect */
import * as redux from 'react-redux';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { data as eventDataRows } from '@kitman/services/src/mocks/handlers/planning/getEventsUsers';
import { PlanningEventContextProvider } from '@kitman/modules/src/PlanningEvent/src/contexts/PlanningEventContext';

import StaffSelectionSession from '..';

const { ResizeObserver } = window;

let mockDispatch;

beforeEach(() => {
  mockDispatch = jest.fn();
  jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);
  window.ResizeObserver = ResizeObserverPolyfill;
  window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 1000,
    height: 1000,
  }));
  window.setFlag('session-type-favourite', true);
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.resetAllMocks();
});

const planningEventContextProviderValue = {
  dispatch: jest.fn(),
  athleteEvents: [],
  selectionHeadersSummaryState: [],
};

const defaultProps = {
  requestStatus: 'SUCCESS',
  event: { id: 1, event_users: [], type: 'session_event' },
  onUpdateEvent: jest.fn(),
  eventSessionActivities: [
    {
      athletes: [],
      duration: null,
      id: 1,
      principles: [],
      event_activity_drill: { name: '4x4' },
      event_activity_type: {
        id: 2,
        name: 'Warm Up',
        squads: [{ id: 8, name: 'International Squad' }],
      },
      users: [],
    },
    {
      athletes: [],
      duration: null,
      id: 2,
      principles: [],
      event_activity_drill: { name: 'Cardio' },
      event_activity_type: {
        id: 2,
        name: 'Training',
        squads: [{ id: 8, name: 'International Squad' }],
      },
      users: [],
    },
  ],
  t: i18nextTranslateStub(),
};

const componentRender = (props = defaultProps) => {
  return renderWithRedux(
    <PlanningEventContextProvider value={planningEventContextProviderValue}>
      <StaffSelectionSession {...props} />
    </PlanningEventContextProvider>
  );
};

describe('StaffSelectionSession', () => {
  describe('<ReactDataGrid />', () => {
    beforeEach(async () => {
      componentRender();
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
    });

    it('has correct number of rows and columns', () => {
      expect(screen.getAllByRole('columnheader')).toHaveLength(4);
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    it('shows correct data for each row', () => {
      const userFormatters = screen.getAllByTestId('userFormatter');
      expect(userFormatters).toHaveLength(3);
    });

    describe('activity togglers', () => {
      beforeEach(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
      });

      it('can toggle an activity', async () => {
        const user = userEvent.setup();
        const row = screen.getAllByRole('row')[1];
        const toggle = within(row).getAllByRole('switch')[0];

        expect(toggle).not.toBeChecked();
        await user.click(toggle);
        expect(toggle).toBeChecked();
      });

      it('can toggle multiple activities', async () => {
        const user = userEvent.setup();
        const row = screen.getAllByRole('row')[1];
        const toggles = within(row).getAllByRole('switch');

        await Promise.all(
          toggles.map(async (toggle) => {
            expect(toggle).not.toBeChecked();
            await user.click(toggle);
            expect(toggle).toBeChecked();
          })
        );
      });

      describe('bulk toggle', () => {
        it('can toggle all activities in a row', async () => {
          const user = userEvent.setup();
          const row = screen.getAllByRole('row')[1];
          const bulkToggle = within(row).getByRole('checkbox');
          const toggles = within(row).getAllByRole('switch');

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).toBeChecked();
            })
          );
        });

        it('de-selects all activities if all are selected', async () => {
          const user = userEvent.setup();
          const row = screen.getAllByRole('row')[1];
          const bulkToggle = within(row).getByRole('checkbox');
          const toggles = within(row).getAllByRole('switch');

          await Promise.all(
            toggles.map(async (toggle) => {
              await user.click(toggle);
              expect(toggle).toBeChecked();
            })
          );

          expect(bulkToggle).toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).not.toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).not.toBeChecked();
            })
          );
        });

        it('selects all activities if all are de-selected', async () => {
          const user = userEvent.setup();
          const row = screen.getAllByRole('row')[1];
          const bulkToggle = within(row).getByRole('checkbox');

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).toBeChecked();

          await Promise.all(
            within(row)
              .getAllByRole('switch')
              .map(async (toggle) => {
                expect(toggle).toBeChecked();
              })
          );
        });

        it('selects all activities if at least one is selected', async () => {
          const user = userEvent.setup();
          const row = screen.getAllByRole('row')[1];
          const bulkToggle = within(row).getByRole('checkbox');
          const toggles = within(row).getAllByRole('switch');

          const firstToggle = toggles[0];
          await user.click(firstToggle);
          expect(firstToggle).toBeChecked();

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).toBeChecked();
            })
          );
        });

        it('does not select any activities if none are selected', async () => {
          const user = userEvent.setup();
          const row = screen.getAllByRole('row')[1];
          const bulkToggle = within(row).getByRole('checkbox');
          const toggles = within(row).getAllByRole('switch');

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).toBeChecked();
            })
          );

          await user.click(bulkToggle);
          expect(bulkToggle).not.toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).not.toBeChecked();
            })
          );
        });
      });
    });
  });

  describe('<MUI data grid />', () => {
    beforeEach(() => {
      window.setFlag('planning-area-mui-data-grid', true);
    });

    afterEach(() => {
      window.setFlag('planning-area-mui-data-grid', false);
    });

    beforeEach(async () => {
      componentRender();
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
    });

    it('has correct number of rows and columns', () => {
      expect(screen.getAllByRole('columnheader')).toHaveLength(4);
      eventDataRows.forEach(({ user: { fullname } }) => {
        expect(screen.getByRole('row', { name: fullname })).toBeInTheDocument();
      });
    });

    it('shows correct data for each row', () => {
      const userFormatters = screen.getAllByTestId('userFormatter');
      expect(userFormatters).toHaveLength(3);
    });

    describe('activity togglers', () => {
      it('can toggle an activity', async () => {
        const user = userEvent.setup();
        const row = screen.getAllByRole('row', { name: /out out/i })[0];
        const toggle = within(row).getAllByRole('switch')[0];

        expect(toggle).not.toBeChecked();
        await user.click(toggle);
        expect(toggle).toBeChecked();
      });

      it('can toggle multiple activities', async () => {
        const user = userEvent.setup();
        const row = screen.getAllByRole('row', { name: /out out/i })[0];
        const toggles = within(row).getAllByRole('switch');

        await Promise.all(
          toggles.map(async (toggle) => {
            expect(toggle).not.toBeChecked();
            await user.click(toggle);
            expect(toggle).toBeChecked();
          })
        );
      });

      describe('bulk toggle', () => {
        it('can toggle all activities in a row', async () => {
          const user = userEvent.setup();
          const toggleRow = screen.getAllByRole('row', { name: /out out/i })[0];
          const bulkToggle = screen.getAllByRole('checkbox')[0];
          const toggles = within(toggleRow).getAllByRole('switch');

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).toBeChecked();
            })
          );
        });

        it('de-selects all activities if all are selected', async () => {
          const user = userEvent.setup();
          const toggleRow = screen.getAllByRole('row', { name: /out out/i })[0];
          const bulkToggle = screen.getAllByRole('checkbox')[0];
          const toggles = within(toggleRow).getAllByRole('switch');

          await Promise.all(
            toggles.map(async (toggle) => {
              await user.click(toggle);
              expect(toggle).toBeChecked();
            })
          );

          expect(bulkToggle).toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).not.toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).not.toBeChecked();
            })
          );
        });

        it('selects all activities if all are de-selected', async () => {
          const user = userEvent.setup();
          const toggleRow = screen.getAllByRole('row', { name: /out out/i })[0];
          const bulkToggle = screen.getAllByRole('checkbox')[0];

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).toBeChecked();

          await Promise.all(
            within(toggleRow)
              .getAllByRole('switch')
              .map(async (toggle) => {
                expect(toggle).toBeChecked();
              })
          );
        });

        it('selects all activities if at least one is selected', async () => {
          const user = userEvent.setup();
          const toggleRow = screen.getAllByRole('row', { name: /out out/i })[0];
          const bulkToggle = screen.getAllByRole('checkbox')[0];
          const toggles = within(toggleRow).getAllByRole('switch');

          const firstToggle = toggles[0];
          await user.click(firstToggle);
          expect(firstToggle).toBeChecked();

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).toBeChecked();
            })
          );
        });

        it('does not select any activities if none are selected', async () => {
          const user = userEvent.setup();
          const toggleRow = screen.getAllByRole('row', { name: /out out/i })[0];
          const bulkToggle = screen.getAllByRole('checkbox')[0];
          const toggles = within(toggleRow).getAllByRole('switch');

          expect(bulkToggle).not.toBeChecked();
          await user.click(bulkToggle);
          expect(bulkToggle).toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).toBeChecked();
            })
          );

          await user.click(bulkToggle);
          expect(bulkToggle).not.toBeChecked();

          await Promise.all(
            toggles.map(async (toggle) => {
              expect(toggle).not.toBeChecked();
            })
          );
        });
      });
    });
  });
});
