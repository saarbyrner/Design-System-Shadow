import { render, screen } from '@testing-library/react';

import { athleteAvailabilities } from '@kitman/common/src/types/Event';
import { data as mockPaginatedAthleteEvents } from '@kitman/services/src/mocks/handlers/planning/getAthleteEvents';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  getSelectionHeaders,
  statusFormatter,
  getActivityDrillKey,
  handleBulkUpdateEventParticipationLevel,
  BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
  ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX,
  PARTICIPATION_SELECTORS_COLUMN_KEY,
  GROUP_CALCULATIONS_TOGGLERS_COLUMN_KEY,
} from '../utils';

describe('Athletes Selection Tab Utils', () => {
  let selectionHeaders;
  beforeEach(() => {
    selectionHeaders = getSelectionHeaders({
      activities: [
        {
          athletes: [],
          duration: null,
          id: 1,
          principles: [],
          event_activity_drill: {
            name: '4x4',
          },
          event_activity_type: {
            id: 1,
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
          event_activity_drill: {
            name: 'Cardio',
          },
          event_activity_type: {
            id: 2,
            name: 'Training',
            squads: [{ id: 8, name: 'International Squad' }],
          },
          users: [],
        },
      ],
      t: i18nextTranslateStub,
    });
  });

  describe('getSelectionHeaders', () => {
    it('returns correct headers', () => {
      expect(selectionHeaders).toMatchObject([
        {
          key: BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
          name: '',
          frozen: true,
          width: 45,
          minWidth: 45,
          maxWidth: 45,
          formatter: expect.any(Function),
        },
        {
          key: 'athlete',
          name: '',
          frozen: true,
          resizable: true,
          width: 200,
          summaryFormatter: expect.any(Function),
          formatter: expect.any(Function),
        },
        {
          key: 'status',
          name: '',
          resizable: true,
          width: 130,
          summaryFormatter: expect.any(Function),
          formatter: expect.any(Function),
        },
        {
          key: PARTICIPATION_SELECTORS_COLUMN_KEY,
          name: '',
          width: 200,
          resizable: true,
          formatter: expect.any(Function),
          summaryFormatter: expect.any(Function),
        },
        {
          key: GROUP_CALCULATIONS_TOGGLERS_COLUMN_KEY,
          name: '',
          minWidth: 100,
          maxWidth: 150,
          width: 100,
          resizable: true,
          formatter: expect.any(Function),
        },
        {
          key: `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX}4x4_0`,
          name: '4x4',
          id: 1,
          athletes: [],
          summaryFormatter: expect.any(Function),
          formatter: expect.any(Function),
          minWidth: 90,
          resizable: true,
        },
        {
          key: `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX}cardio_1`,
          name: 'Cardio',
          id: 2,
          athletes: [],
          summaryFormatter: expect.any(Function),
          formatter: expect.any(Function),
          minWidth: 90,
          resizable: true,
        },
      ]);
    });
  });

  describe('MUI getSelectionHeaders', () => {
    beforeEach(() => {
      window.setFlag('planning-area-mui-data-grid', true);
    });

    it('returns correct headers', () => {
      expect(selectionHeaders).toMatchObject([
        {
          key: BULK_ACTIVITY_TOGGLERS_COLUMN_KEY,
          name: '',
          frozen: true,
          width: 45,
          minWidth: 45,
          maxWidth: 45,
          formatter: expect.any(Function),
        },
        {
          key: 'athlete',
          name: '',
          frozen: true,
          resizable: true,
          width: 200,
          formatter: expect.any(Function),
          summaryFormatter: expect.any(Function),
        },
        {
          key: 'status',
          name: '',
          resizable: true,
          width: 130,
          formatter: expect.any(Function),
          summaryFormatter: expect.any(Function),
        },
        {
          key: 'participation',
          name: '',
          width: 200,
          resizable: true,
          formatter: expect.any(Function),
          summaryFormatter: expect.any(Function),
        },
        {
          formatter: expect.any(Function),
          key: GROUP_CALCULATIONS_TOGGLERS_COLUMN_KEY,
          maxWidth: 150,
          minWidth: 100,
          name: '',
          resizable: true,
          width: 100,
        },
        {
          key: `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX}4x4_0`,
          name: '4x4',
          id: 1,
          athletes: [],
          minWidth: 90,
          resizable: true,
        },
        {
          key: `${ACTIVITY_TOGGLERS_COLUMN_KEY_PREFIX}cardio_1`,
          name: 'Cardio',
          id: 2,
          athletes: [],
          minWidth: 90,
          resizable: true,
        },
      ]);
    });
  });

  describe('statusFormatter', () => {
    it('shows availability when it’s present', () => {
      const status = statusFormatter(
        { athlete: { availability: athleteAvailabilities.Injured } },
        (s) => s
      );
      render(status);

      expect(
        screen.getByText(athleteAvailabilities.Injured)
      ).toBeInTheDocument();
      expect(screen.queryByText('No status')).not.toBeInTheDocument();
    });

    it('shows ‘No status’ when there’s no availability', () => {
      const status = statusFormatter({ athlete: {} }, (s) => s);
      render(status);

      expect(screen.getByText('No status')).toBeInTheDocument();
    });
  });

  it('getActivityDrillKey', () => {
    const drillKey = getActivityDrillKey('Tester', 13);

    expect(drillKey).toEqual('tester_13');
  });

  describe('handleBulkUpdateEventParticipationLevel', () => {
    it('dispatches athlete events from BE response', async () => {
      const dispatchSpy = jest.fn();
      const setRequestStatusTableActionSpy = jest.fn();

      await handleBulkUpdateEventParticipationLevel({
        selectedParticipationLevel: 3868,
        eventId: 4401975,
        filters: {
          athleteName: '',
          positions: [],
          availabilities: [],
          participationLevels: [],
        },
        sortBy: 'position',
        dispatch: dispatchSpy,
        setRequestStatusTableAction: setRequestStatusTableActionSpy,
        fetchEventActivityStates: jest.fn(),
      });

      expect(setRequestStatusTableActionSpy).toHaveBeenCalledWith('SUCCESS');
      expect(dispatchSpy).toHaveBeenCalledWith({
        athletes: mockPaginatedAthleteEvents.athlete_events,
        type: 'SET_ATHLETE_EVENTS',
      });
    });
  });
});
