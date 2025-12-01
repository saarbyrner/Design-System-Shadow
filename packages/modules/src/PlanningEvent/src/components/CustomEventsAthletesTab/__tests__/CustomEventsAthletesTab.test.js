import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetPaginatedAthleteEventsQuery,
  useUpdateAthleteEventsMutation,
  useUpdateAthleteAttendanceMutation,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi';
import { data as participationLevels } from '@kitman/services/src/mocks/handlers/getParticipationLevels';
import data from '../utils/athleteEventsMock';
import CustomEventsAthletesTab from '../index';
import { createAthletePagePath } from '../utils/helpers';
import { setupStore } from '../../../../../AppRoot/store';

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi'
    ),
    useGetPaginatedAthleteEventsQuery: jest.fn(),
    useUpdateAthleteEventsMutation: jest.fn(),
    useUpdateAthleteAttendanceMutation: jest.fn(),
  })
);

describe('CustomEventsAthletesTab', () => {
  const props = {
    event: { id: 2 },
    participationLevels,
    t: i18nextTranslateStub(),
    canEditEvent: true,
  };

  beforeEach(() => {
    useGetPaginatedAthleteEventsQuery.mockReturnValue({
      data: { athlete_events: data },
      isSuccess: true,
    });
    useUpdateAthleteEventsMutation.mockReturnValue([
      'updateAthleteEvents',
      { isSuccess: true },
    ]);
    useUpdateAthleteAttendanceMutation.mockReturnValue([
      'updateAthleteAttendance',
      { isSuccess: true },
    ]);
  });

  const componentRender = (mockProps = props) =>
    render(
      <Provider store={setupStore({})}>
        <CustomEventsAthletesTab {...mockProps} />
      </Provider>
    );

  describe('default render', () => {
    beforeEach(() => {
      componentRender();
    });

    it('should render the athlete names in the table', () => {
      data.forEach(({ athlete }) =>
        expect(screen.getByText(athlete.fullname)).toBeInTheDocument()
      );
    });

    it('should render the athlete positions in the table', () => {
      data.forEach(({ athlete }) =>
        expect(screen.getByText(athlete.position.name)).toBeInTheDocument()
      );
    });

    it('should render the athlete squads in the table', () => {
      data.forEach(({ athlete }) => {
        athlete.athlete_squads.forEach(({ name }) =>
          expect(screen.getByText(name)).toBeInTheDocument()
        );
      });
    });

    it('Fullnames should contain an href attribute', () => {
      data.forEach(({ athlete }) =>
        expect(screen.getByText(athlete.fullname)).toHaveAttribute(
          'href',
          createAthletePagePath(athlete.id)
        )
      );
    });

    it('should have an add athletes button when canEditEvent is true', () => {
      expect(
        screen.getByRole('button', { name: 'Add Athletes' })
      ).toBeInTheDocument();
    });
  });

  it('should not have an add athletes button when canEditEvent is false', () => {
    componentRender({ ...props, canEditEvent: false });
    expect(
      screen.queryByRole('button', { name: 'Add Athletes' })
    ).not.toBeInTheDocument();
  });
});
