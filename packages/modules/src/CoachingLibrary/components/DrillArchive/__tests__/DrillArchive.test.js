/* eslint-disable jest/no-conditional-expect */
import { render, screen, within, waitFor } from '@testing-library/react';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import selectEvent from 'react-select-event';
import { data as drillsData } from '@kitman/services/src/mocks/handlers/planning/searchDrills';
import { data as activityTypes } from '@kitman/services/src/mocks/handlers/planningHub/getActivityTypes';
import { getIntensityTranslation } from '@kitman/common/src/utils/eventIntensity';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import DrillArchive from '../DrillArchive';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<DrillArchive />', () => {
  const { ResizeObserver } = window;
  const trackEventMock = jest.fn();
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 600,
    }));
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  const props = { t: (string) => string };

  const filtersPlaceholders = {
    typeFilter: 'Activity type',
    creatorFilter: 'Creator',
    principleFilter: 'Principle',
  };

  it('shows the search bar; the activity type, creator, principle filters', async () => {
    render(<DrillArchive {...props} />);
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
    Object.values(filtersPlaceholders).forEach((placeholder, i) => {
      expect(
        // <Select /> isn’t a real <input /> element itself, even though it
        // contains one for search through options, it doesn’t have a real
        // placeholder. That’s why getByPlaceholderText isn’t used.
        within(selectElements[i]).getByText(placeholder)
      ).toBeInTheDocument();
    });
  });

  it('shows the columns’ titles', async () => {
    render(<DrillArchive {...props} />);
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
    render(<DrillArchive {...props} />);
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
      const activityName = 'Warm up';
      render(<DrillArchive {...props} />);
      await waitFor(
        () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      const searchBar = screen.getByPlaceholderText('Search drill name');
      const filters = searchBar.parentNode;
      const grid = filters.parentNode;

      const selectElementsLabels = grid.querySelectorAll(
        '.kitmanReactSelect .kitmanReactSelect__labelContainer'
      );
      const selectElements = [...selectElementsLabels].map(
        (element) => element.parentNode
      );

      const activityTypeSelector = selectElements
        .find((s) => within(s).queryByText(filtersPlaceholders.typeFilter))
        .querySelector('.kitmanReactSelect input');

      expect(screen.getAllByRole('row').length).toEqual(
        drillsData.event_activity_drills.length + 1 // + 1 for the header row.
      );
      selectEvent.openMenu(activityTypeSelector);
      await selectEvent.select(activityTypeSelector, [activityName]);
      await waitFor(() =>
        expect(screen.getAllByRole('row').length).toEqual(
          drillsData.event_activity_drills.filter(
            ({ event_activity_type: type }) => type?.name === activityName
          ).length + 1 // + 1 for the header row.
        )
      );
    });
  });

  describe('when filtered by a creator', () => {
    it('shows only the drills with the selected creator', async () => {
      const creatorName = "Stuart O'Brien";
      render(<DrillArchive {...props} />);
      await waitFor(
        () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      const searchBar = screen.getByPlaceholderText('Search drill name');
      const filters = searchBar.parentNode;
      const grid = filters.parentNode;

      const selectElementsLabels = grid.querySelectorAll(
        '.kitmanReactSelect .kitmanReactSelect__labelContainer'
      );
      const selectElements = [...selectElementsLabels].map(
        (element) => element.parentNode
      );

      const creatorSelector = selectElements
        .find((s) => within(s).queryByText(filtersPlaceholders.creatorFilter))
        .querySelector('.kitmanReactSelect input');

      expect(screen.getAllByRole('row').length).toEqual(
        drillsData.event_activity_drills.length + 1 // + 1 for the header row.
      );
      selectEvent.openMenu(creatorSelector);
      await selectEvent.select(creatorSelector, [creatorName]);
      await waitFor(() =>
        expect(screen.getAllByRole('row').length).toEqual(
          drillsData.event_activity_drills.filter(
            ({ created_by: { fullname } }) => fullname === creatorName
          ).length + 1 // + 1 for the header row.
        )
      );
    });
  });

  describe('when filtered by a principle', () => {
    it('shows only the drills with the selected principle', async () => {
      render(<DrillArchive {...props} />);
      await waitFor(
        () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      const searchBar = screen.getByPlaceholderText('Search drill name');
      const filters = searchBar.parentNode;
      const grid = filters.parentNode;

      const selectElementsLabels = grid.querySelectorAll(
        '.kitmanReactSelect .kitmanReactSelect__labelContainer'
      );
      const selectElements = [...selectElementsLabels].map(
        (element) => element.parentNode
      );

      const principleSelector = selectElements
        .find((s) => within(s).queryByText(filtersPlaceholders.principleFilter))
        .querySelector('.kitmanReactSelect input');

      expect(screen.getAllByRole('row').length).toEqual(
        drillsData.event_activity_drills.length + 1 // + 1 for the header row.
      );
      selectEvent.openMenu(principleSelector);
      await selectEvent.select(principleSelector, ['Long pass']);
      await waitFor(() => expect(screen.getAllByRole('row').length).toEqual(2));
    });
  });
});
