/* eslint-disable jest/no-conditional-expect */
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import selectEvent from 'react-select-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { data as drillsData } from '@kitman/services/src/mocks/handlers/planning/searchDrills';
import { data as activityTypes } from '@kitman/services/src/mocks/handlers/planningHub/getActivityTypes';
import { getIntensityTranslation } from '@kitman/common/src/utils/eventIntensity';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import Drills from '../Drills';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<Drills />', () => {
  const { ResizeObserver } = window;
  const trackEventMock = jest.fn();
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1100,
      height: 600,
    }));

    // Otherwise tests will fail.
    // https://github.com/jsdom/jsdom/issues/1695#issuecomment-559095940
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  const props = {
    onOpenArchive: jest.fn(),
    t: (string) => string,
  };

  it('shows the title, disabled ‘Edit’ and ‘Archive’ buttons', async () => {
    render(<Drills {...props} />);
    await waitFor(
      () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      { timeout: 5000 }
    );

    expect(screen.getByText('Drills')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeDisabled();
  });

  it('shows the search bar; the activity type, creator, principle filters', async () => {
    render(<Drills {...props} />);
    await waitFor(
      () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      { timeout: 5000 }
    );

    const searchBar = screen.getByPlaceholderText('Search drill name');
    expect(searchBar).toBeInTheDocument();

    const filters = searchBar.parentNode;
    const grid = filters.parentNode;
    const selectElementsLabels = grid.querySelectorAll(
      '.kitmanReactSelect .kitmanReactSelect__labelContainer'
    );
    const selectElements = [...selectElementsLabels].map(
      (element) => element.parentNode
    );
    Object.values({
      typeFilter: 'Activity type',
      creatorFilter: 'Creator',
      principleFilter: 'Principle',
    }).forEach((placeholder, i) => {
      expect(
        // <Select /> isn’t a real <input /> element itself, even though it
        // contains one for search through options, it doesn’t have a real
        // placeholder. That’s why getByPlaceholderText isn’t used.
        within(selectElements[i]).getByText(placeholder)
      ).toBeInTheDocument();
    });
  });

  it('shows the columns’ titles', async () => {
    render(<Drills {...props} />);
    await waitFor(
      () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      { timeout: 5000 }
    );

    [
      'Drill name',
      'Description',
      'Intensity',
      'Activity type',
      'Principle(s)',
      'Creator',
      'Squads',
    ].forEach((name) =>
      expect(screen.getByRole('columnheader', { name })).toBeInTheDocument()
    );
  });

  it('shows drills', async () => {
    render(<Drills {...props} />);
    await waitFor(
      () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      { timeout: 5000 }
    );

    drillsData.event_activity_drills.forEach(
      ({
        name,
        notes,
        intensity,
        event_activity_type: activityType,
        principles,
        created_by: createdBy,
      }) => {
        const drillName = screen.getByRole('gridcell', { name });
        const row = drillName.parentNode;

        expect(drillName).toBeInTheDocument();

        expect(
          within(row).getByText(notes.replace(/<[^>]*>/g, ''))
        ).toBeInTheDocument();

        const activityIntensity = getIntensityTranslation(
          intensity,
          (string) => string
        );
        if (activityIntensity && activityIntensity !== 'N/A') {
          expect(within(row).getByText(activityIntensity)).toBeInTheDocument();
        }

        const activityName = activityType?.name;
        if (activityName) {
          expect(within(row).getByText(activityName)).toBeInTheDocument();

          const squadName = activityTypes.find(
            ({ name: type }) => type === activityName
          ).squads[0].name;
          expect(within(row).getByText(squadName)).toBeInTheDocument();
        }

        if (principles?.length > 0) {
          principles.forEach(({ name: principle }) =>
            expect(within(row).getByText(principle)).toBeInTheDocument()
          );
        }

        expect(within(row).getByText(createdBy.fullname)).toBeInTheDocument();
      }
    );
  });

  describe('when filtered by an activity type', () => {
    it('shows only the drills with the selected activity type', async () => {
      render(<Drills {...props} />);
      await waitFor(
        () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      const searchBar = screen.getByPlaceholderText('Search drill name');
      const filters = searchBar.parentNode;
      const grid = filters.parentNode;
      const selectors = grid.querySelectorAll('.kitmanReactSelect input');
      const activityTypeSelector = selectors[0];

      expect(screen.getAllByRole('row').length).toEqual(10);
      selectEvent.openMenu(activityTypeSelector);
      await selectEvent.select(activityTypeSelector, ['Warm up']);
      await waitFor(
        () => expect(screen.getAllByRole('row').length).toEqual(5),
        { timeout: 2000 }
      );
    });
  });

  describe('when filtered by a creator', () => {
    it('shows only the drills with the selected creator', async () => {
      render(<Drills {...props} />);
      await waitFor(
        () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      const searchBar = screen.getByPlaceholderText('Search drill name');
      const filters = searchBar.parentNode;
      const grid = filters.parentNode;
      const selectors = grid.querySelectorAll('.kitmanReactSelect input');
      const creatorSelector = selectors[1];

      expect(screen.getAllByRole('row').length).toEqual(10);
      selectEvent.openMenu(creatorSelector);
      await selectEvent.select(creatorSelector, ["Stuart O'Brien"]);
      await waitFor(() => expect(screen.getAllByRole('row').length).toEqual(4));
    });
  });

  describe('when filtered by a principle', () => {
    it('shows only the drills with the selected principle', async () => {
      render(<Drills {...props} />);
      await waitFor(
        () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      const searchBar = screen.getByPlaceholderText('Search drill name');
      const filters = searchBar.parentNode;
      const grid = filters.parentNode;
      const selectors = grid.querySelectorAll('.kitmanReactSelect input');
      const principleSelector = selectors[2];

      expect(screen.getAllByRole('row').length).toEqual(10);
      selectEvent.openMenu(principleSelector);
      await selectEvent.select(principleSelector, ['Long pass']);
      await waitFor(() => expect(screen.getAllByRole('row').length).toEqual(2));
    });
  });

  describe('when ‘View drill archive’ from the header tooltip menu is clicked', () => {
    it('changes `window.location.hash` to `#archive`', async () => {
      const user = userEvent.setup();
      render(<Drills {...props} />);
      await waitFor(
        () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      const tooltip = within(
        screen.getByTestId('wrapper-top-tooltip-menu')
      ).getByRole('button');
      await user.click(tooltip);
      const viewDrillArchiveButton = screen.getByTestId(
        'TooltipMenu|PrimaryListItem'
      );
      await user.click(within(viewDrillArchiveButton).getByRole('link'));

      expect(window.location.hash).toEqual('#archive');
    });
  });

  describe('when ‘Archive drill’ from a drill tooltip menu is clicked', () => {
    it('removes the drill', async () => {
      const user = userEvent.setup();
      render(<Drills {...props} />);
      await waitFor(
        () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      const firstRowData = drillsData.event_activity_drills[0];
      expect(screen.getByText(firstRowData.name)).toBeInTheDocument();
      // Take the second row ([1]) because the first one is the grid header.
      const firstRow = screen.getAllByRole('row')[1];
      const tooltip = within(
        within(firstRow).getByTestId(`${firstRowData.id}-drill-tooltip-menu`)
      ).getByRole('button');
      await user.click(tooltip);

      const archiveDrillButton = screen.getByTestId(
        'TooltipMenu|PrimaryListItem'
      );

      await user.click(archiveDrillButton);

      expect(screen.queryByText(firstRowData.name)).not.toBeInTheDocument();
    });
  });

  describe('if archiving isn’t sucessfull', () => {
    beforeEach(() => {
      server.use(
        rest.post(
          '/planning_hub/event_activity_drills/:id/archive',
          async (_, res, ctx) => res(ctx.status(500))
        )
      );
    });

    it('shows ‘Something went wrong!’ message', async () => {
      const user = userEvent.setup();
      render(<Drills {...props} />);
      await waitFor(
        () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      const firstRowData = drillsData.event_activity_drills[0];
      expect(screen.getByText(firstRowData.name)).toBeInTheDocument();
      // Take the second row ([1]) because the first one is the grid header.
      const firstRow = screen.getAllByRole('row')[1];
      const tooltip = within(
        within(firstRow).getByTestId(`${firstRowData.id}-drill-tooltip-menu`)
      ).getByRole('button');
      await user.click(tooltip);
      const archiveDrillButton = screen.getByTestId(
        'TooltipMenu|PrimaryListItem'
      );

      await user.click(archiveDrillButton);
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });
});
