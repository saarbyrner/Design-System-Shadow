import { render, screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import useManageAthleteEventsGrid from '@kitman/modules/src/PlanningEvent/src/hooks/useManageAthleteEventsGrid';
import { data as participationLevels } from '@kitman/services/src/mocks/handlers/getParticipationLevels';
import saveEvent from '@kitman/modules/src/PlanningEvent/src/services/saveEvent';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import data from '../utils/athleteEventsMock';
import AthletesTabTable from '../components/AthletesTabTable';

jest.mock('@kitman/modules/src/PlanningEvent/src/services/saveEvent');
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/hooks/useManageAthleteEventsGrid'
);
jest.mock('@kitman/common/src/hooks/useLocationSearch');

describe('<AthletesTableTable />', () => {
  const props = {
    event: { id: 3 },
    t: i18nextTranslateStub(),
    participationLevels,
    canEditEvent: true,
    isVirtualEvent: false,
  };

  const additionalHeaderSwitchCount = 1;

  const updateAthleteAttendanceMock = jest.fn();
  const resetAthleteEventsGridMock = jest.fn();

  const mockManageAthleteEventsGrid = (
    mockData = { athlete_events: data },
    isError = false
  ) => {
    useManageAthleteEventsGrid.mockReturnValue({
      data: mockData,
      isError,
      isSuccess: !isError,
      updateAthleteAttendance: updateAthleteAttendanceMock.mockReturnValue({
        unwrap: () => Promise.resolve({}),
      }),
      resetAthleteEventsGrid: resetAthleteEventsGridMock,
      getNextAthleteEvents: jest.fn(),
    });
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the error when the query has an error', async () => {
    mockManageAthleteEventsGrid({}, true);
    render(<AthletesTabTable {...props} />);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });

  it('renders the table when the query succeeds', async () => {
    mockManageAthleteEventsGrid();
    render(<AthletesTabTable {...props} />);

    await waitFor(() => {
      expect(useManageAthleteEventsGrid).toHaveBeenCalled();
    });

    data.forEach(({ athlete }) =>
      expect(screen.getByText(athlete.fullname)).toBeInTheDocument()
    );

    data.forEach(({ athlete }) => {
      athlete.athlete_squads.forEach(({ name }) =>
        expect(screen.getByText(name)).toBeInTheDocument()
      );
    });
  });

  it('shows the attendance column', async () => {
    mockManageAthleteEventsGrid();
    render(<AthletesTabTable {...props} />);

    await waitFor(() => {
      expect(useManageAthleteEventsGrid).toHaveBeenCalled();
    });

    // there should be as many switches as athletes in the list, plus the header switch
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toEqual(data.length + additionalHeaderSwitchCount);

    // the amount of TOGGLED switches should match the amount of athletes with particpation level set to FULL
    expect(switches.filter((toggle) => toggle.checked === true).length).toEqual(
      data.filter(
        ({ participation_level: level }) =>
          level.canonical_participation_level === 'full'
      ).length
    );

    // the amount of UNTOGGLED switches should match the amount of athletes with particpation level set to NONE
    expect(
      switches.filter((toggle) => toggle.checked === false).length
    ).toEqual(
      data.filter(
        ({ participation_level: level }) =>
          level.canonical_participation_level === 'none'
      ).length + additionalHeaderSwitchCount
    );
  });

  it('shows the attendance column with parent toggle enabled, if all child toggles enabled', async () => {
    const athletesWithFullParticipation = data.filter(
      // eslint-disable-next-line camelcase
      ({ participation_level }) =>
        participation_level.canonical_participation_level === 'full'
    );
    mockManageAthleteEventsGrid({
      athlete_events: athletesWithFullParticipation,
    });
    render(<AthletesTabTable {...props} />);

    await waitFor(() => {
      expect(useManageAthleteEventsGrid).toHaveBeenCalled();
    });

    const switches = screen.getAllByRole('switch');

    // the amount of TOGGLED switches should match the amount of athletes with particpation level set to FULL plus parent toggle
    expect(switches.filter((toggle) => toggle.checked === true).length).toEqual(
      athletesWithFullParticipation.length + additionalHeaderSwitchCount
    );
  });

  it('shows no full toggles when every athlete has no attendance', async () => {
    mockManageAthleteEventsGrid({ athlete_events: [data[1], data[2]] }, false);
    render(<AthletesTabTable {...props} />);

    await waitFor(() => {
      expect(useManageAthleteEventsGrid).toHaveBeenCalled();
    });

    // there should be as many switches as athletes in the list, plus the header switch
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toEqual(3);

    // the amount of TOGGLED switches should be zero
    expect(switches.filter((toggle) => toggle.checked === true).length).toEqual(
      0
    );

    // the amount of UNTOGGLED switches should match the amount of athletes with particpation level set to NONE
    // the header switch should also be untoggled
    expect(
      switches.filter((toggle) => toggle.checked === false).length
    ).toEqual(
      data.filter(
        ({ participation_level: level }) =>
          level.canonical_participation_level === 'none'
      ).length + additionalHeaderSwitchCount
    );
  });

  it('does not enable toggle, if there are no athlete events', async () => {
    mockManageAthleteEventsGrid({
      athlete_events: [],
    });
    render(<AthletesTabTable {...props} />);

    await waitFor(() => {
      expect(useManageAthleteEventsGrid).toHaveBeenCalled();
    });

    const switches = screen.getAllByRole('switch');
    expect(switches.filter((toggle) => toggle.checked === true).length).toEqual(
      0
    );
  });

  it('shows the loading text when the attendance header switch is clicked', async () => {
    mockManageAthleteEventsGrid({ athlete_events: [data[1], data[2]] }, false);
    render(<AthletesTabTable {...props} />);
    const headerSwitch = screen.getAllByRole('switch')[0];
    await userEvent.click(headerSwitch);

    await waitFor(() => {
      expect(useManageAthleteEventsGrid).toHaveBeenCalled();
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('enables toggles when canEditEvent is true', async () => {
    mockManageAthleteEventsGrid({ athlete_events: [data[1], data[2]] }, false);
    render(<AthletesTabTable {...props} />);

    await waitFor(() =>
      expect(screen.queryByTestId('AppStatus|loading')).not.toBeInTheDocument()
    );

    const switches = screen.getAllByRole('switch');
    switches.forEach((toggle) => {
      expect(toggle.disabled).toBe(false);
    });
  });

  it('disables toggles when canEditEvent is false', async () => {
    mockManageAthleteEventsGrid({ athlete_events: [data[1], data[2]] }, false);
    render(<AthletesTabTable {...props} canEditEvent={false} />);

    await waitFor(() =>
      expect(screen.queryByTestId('AppStatus|loading')).not.toBeInTheDocument()
    );

    const switches = screen.getAllByRole('switch');
    switches.forEach((toggle) => {
      expect(toggle.disabled).toBe(true);
    });
  });

  describe('virtual event', () => {
    beforeEach(() => {
      mockManageAthleteEventsGrid();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should save event and update attributes when updating participants, if isVirtualEvent', async () => {
      useLocationSearch.mockReturnValue(
        new URLSearchParams({ original_start_time: '2024-05-22T09:20:00.000Z' })
      );
      saveEvent.mockResolvedValue(props.event);
      render(<AthletesTabTable {...props} />);

      const headerSwitch = screen.getAllByRole('switch')[2];
      await userEvent.click(headerSwitch);

      await waitFor(() => {
        expect(saveEvent).toHaveBeenCalled();
      });

      expect(updateAthleteAttendanceMock).toHaveBeenCalled();
      expect(resetAthleteEventsGridMock).toHaveBeenCalled();
    });

    it('should not save event, but update attributes, if not isVirtualEvent', async () => {
      render(<AthletesTabTable {...props} />);

      const headerSwitch = screen.getAllByRole('switch')[0];
      await userEvent.click(headerSwitch);

      await waitFor(() => {
        expect(updateAthleteAttendanceMock).toHaveBeenCalled();
      });

      expect(saveEvent).not.toHaveBeenCalled();
      expect(resetAthleteEventsGridMock).toHaveBeenCalled();
    });

    describe('updateAthleteAttendance - ensuring correct values sent', () => {
      const expectedRequestWithVirtualAttendance = {
        athleteId: null,
        athletes: [{ id: 80524, participation_level: 1 }],
        attributes: { participation_level: 1 },
        disableGrid: true,
        eventId: 3,
        filters: {},
        tab: 'athletes_tab',
      };

      const expectedRequestWithoutVirtualAttendance = {
        athleteId: 15642,
        attributes: { participation_level: 1 },
        disableGrid: true,
        eventId: 3,
        filters: {},
        tab: 'athletes_tab',
      };

      it('should send correct values when event has virtual event attendance', async () => {
        mockManageAthleteEventsGrid({
          athlete_events: data.filter(
            (athlete) => athlete.participation_level.id === 1 // participation_level full
          ),
        });
        useLocationSearch.mockReturnValue(
          new URLSearchParams({
            original_start_time: '2024-05-22T09:20:00.000Z',
          })
        );
        saveEvent.mockResolvedValue(props.event);
        render(<AthletesTabTable {...props} />);

        const headerSwitch = screen.getAllByRole('switch')[2];
        await userEvent.click(headerSwitch);

        await waitFor(() => {
          expect(updateAthleteAttendanceMock).toHaveBeenCalledWith(
            expectedRequestWithVirtualAttendance
          );
        });
      });

      it('should send correct values when event does not have virtual event attendance', async () => {
        mockManageAthleteEventsGrid({
          athlete_events: data.filter(
            (athlete) => athlete.participation_level.id === 2 // participation_level none
          ),
        });
        useLocationSearch.mockReturnValue(
          new URLSearchParams({
            original_start_time: '2024-05-22T09:20:00.000Z',
          })
        );
        saveEvent.mockResolvedValue(props.event);
        render(<AthletesTabTable {...props} />);

        const headerSwitch = screen.getAllByRole('switch')[2];
        await userEvent.click(headerSwitch);

        await waitFor(() => {
          expect(updateAthleteAttendanceMock).toHaveBeenCalledWith(
            expectedRequestWithoutVirtualAttendance
          );
        });
      });
    });
  });
});
