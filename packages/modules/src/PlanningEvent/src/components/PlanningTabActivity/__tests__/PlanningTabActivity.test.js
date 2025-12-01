import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { server, rest } from '@kitman/services/src/mocks/server';
import { axios } from '@kitman/common/src/utils/services';
import { intensities, areaSize } from '@kitman/common/src/types/Event';
import { getIntensityTranslation } from '@kitman/common/src/utils/eventIntensity';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { defaultDisplayEllipsisWidth } from '@kitman/components/src/TextTag';
import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';

import { PlanningTabActivity } from '../PlanningTabActivity';

jest.mock(
  '@kitman/modules/src/img/planning/soccer_drill_diagram_placeholder.svg',
  () => null
);
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<PlanningTabActivity />', () => {
  const noteContent = 'Note.';
  const activity = {
    duration: 65,
    event_activity_drill: {
      name: 'Name',
      notes: `<div>${noteContent}</div>`,
      intensity: intensities.Moderate,
      diagram: {
        url: 'https://example.com/a.jpeg',
      },
      event_activity_type: {
        name: 'activity type',
      },
    },
    event_activity_type: {
      name: 'session level activity type',
    },
    area_size: areaSize.Small,
    principles: [1, 2, 3].map((id) => ({
      id,
      name: `principle ${id}`,
      phases: [{ name: 'phase' }],
      principle_categories: [{ name: `category ${id}` }],
      principle_types: [{ name: `type ${id}` }],
    })),
    note: `Activity ${noteContent}`,
    participants: {
      athletes: {
        available: 1,
        total: 2,
      },
      staff: {
        available: 3,
        total: 4,
      },
    },
  };
  const onActivityUpdate = jest.fn();
  const onOpenPrinciples = jest.fn();

  const props = {
    activity,
    organisationSport: 'soccer',
    onActivityUpdate,
    onOpenPrinciples,
    t: i18nextTranslateStub(),
    areCoachingPrinciplesEnabled: true,
    onOpenDrill: jest.fn(),
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });

    server.use(
      rest.get('https://example.com/a.jpeg', (req, res, ctx) =>
        res(ctx.json({ image: 'image' }))
      )
    );
  });

  describe('when prop `activity` is passed', () => {
    it('shows all relevant fields of `activity`', async () => {
      render(<PlanningTabActivity {...props} />);

      expect(screen.getByText(`${activity.duration} mins`)).toBeInTheDocument();
      const intensityName = getIntensityTranslation(
        activity.event_activity_drill.intensity,
        (string) => string
      );
      expect(screen.getByText(intensityName)).toBeInTheDocument();
      expect(
        screen.getByText(activity.event_activity_type.name)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          activity.event_activity_drill.event_activity_type.name
        )
      ).not.toBeInTheDocument();
      screen.getByText(noteContent);
      expect(
        screen.getByText(activity.event_activity_drill.name)
      ).toBeInTheDocument();
      expect(screen.queryByText('No drill name used')).not.toBeInTheDocument();
    });

    it('calls `onOpenDrill` on clicks on relevant parts', async () => {
      const user = userEvent.setup();
      render(<PlanningTabActivity {...props} />);

      expect(screen.getByText(`${activity.duration} mins`)).toBeInTheDocument();
      const intensityName = getIntensityTranslation(
        activity.event_activity_drill.intensity,
        (string) => string
      );
      // The first click.
      await user.click(screen.getByText(intensityName));

      const activityType = screen.getByText(activity.event_activity_type.name);
      // The second click.
      await user.click(activityType);
      const heading = activityType.parentNode;
      // The third click.
      await user.click(heading);
      screen.getByText(noteContent);
      // The fourth click.
      await user.click(screen.getByText(activity.event_activity_drill.name));
      expect(props.onOpenDrill).toHaveBeenCalledTimes(4);
    });

    it('shows session level activity type when the associated drill doesn’t have one', async () => {
      const drill = { ...activity.event_activity_drill };
      delete drill.event_activity_type;
      render(
        <PlanningTabActivity
          {...props}
          activity={{ ...activity, event_activity_drill: drill }}
        />
      );

      expect(
        screen.getByText(activity.event_activity_type.name)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          activity.event_activity_drill.event_activity_type.name
        )
      ).not.toBeInTheDocument();
    });

    it('shows session level activity type when the associated drill’s one equals ‘Not Selected in PMA’', async () => {
      const mockActivity = {
        ...activity,
        event_activity_drill: {
          ...activity.event_activity_drill,
          event_activity_type: {
            name: 'Not Selected in PMA',
          },
        },
      };
      render(<PlanningTabActivity {...props} activity={mockActivity} />);

      expect(
        screen.getByText(mockActivity.event_activity_type.name)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          mockActivity.event_activity_drill.event_activity_type.name
        )
      ).not.toBeInTheDocument();
    });

    it('shows ‘No activity type selected’ when there’s no associated activity type', async () => {
      const activityWithoutActivityType = { ...activity };
      delete activityWithoutActivityType.event_activity_type;
      delete activityWithoutActivityType.event_activity_drill
        .event_activity_type;
      render(
        <PlanningTabActivity
          {...props}
          activity={activityWithoutActivityType}
        />
      );

      expect(screen.getByText('No activity type selected')).toBeInTheDocument();
    });

    it('allows changing `activity.duration`', async () => {
      const user = userEvent.setup();
      render(<PlanningTabActivity {...props} />);

      let activityDuration = screen.getByText(`${activity.duration} mins`);
      await user.click(activityDuration);
      const activityDurationInput = screen.getByDisplayValue(activity.duration);
      await user.clear(activityDurationInput);
      const userInput = '22';
      fireEvent.change(activityDurationInput, { target: { value: userInput } });
      const buttons = screen.getAllByRole('button');
      const activityDurationInputSubmitConfirmButton = buttons.find((button) =>
        button.querySelector('.icon-check')
      );
      await user.click(activityDurationInputSubmitConfirmButton);
      activityDuration = screen.getByText(`${userInput} mins`);

      expect(activityDuration).toBeInTheDocument();
      expect(onActivityUpdate).toHaveBeenCalledTimes(1);
      expect(onActivityUpdate).toHaveBeenCalledWith({
        ...activity,
        duration: parseInt(userInput, 10),
      });
    });

    it('doesn’t show ‘Add’ buttons', async () => {
      render(<PlanningTabActivity {...props} />);

      expect(screen.queryByText('Add:')).not.toBeInTheDocument();
    });

    it('shows ‘No drill name used’ when there is no activity name', async () => {
      render(
        <PlanningTabActivity
          {...props}
          activity={{
            ...activity,
            event_activity_drill: {
              ...activity.event_activity_drill,
              name: undefined,
            },
          }}
        />
      );

      expect(screen.getByText('No drill name used')).toBeInTheDocument();
      expect(
        screen.queryByText(activity.event_activity_drill.name)
      ).not.toBeInTheDocument();
    });

    it('shows athletes count if `pac-sessions-session-plan-see-staff-and-athlete-numbers` feature flag is enabled', () => {
      window.featureFlags = {
        'pac-sessions-session-plan-see-staff-and-athlete-numbers': true,
      };
      render(<PlanningTabActivity {...props} activity={activity} />);

      expect(
        screen.getByText(
          `${activity.participants.athletes.available}/${activity.participants.athletes.total}`
        )
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          `${activity.participants.staff.available}/${activity.participants.staff.total}`
        )
      ).not.toBeInTheDocument();
    });

    it('shows participants counts if `pac-sessions-session-plan-see-staff-and-athlete-numbers` and `planning-selection-tab` feature flags are enabled', () => {
      window.featureFlags = {
        'pac-sessions-session-plan-see-staff-and-athlete-numbers': true,
        'planning-selection-tab': true,
      };
      render(<PlanningTabActivity {...props} activity={activity} />);

      expect(
        screen.getByText(
          `${activity.participants.athletes.available}/${activity.participants.athletes.total}`
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          `${activity.participants.staff.available}/${activity.participants.staff.total}`
        )
      ).toBeInTheDocument();
    });

    it('doesn’t show participants counts if `pac-sessions-session-plan-see-staff-and-athlete-numbers` feature flag is disabled', () => {
      render(<PlanningTabActivity {...props} activity={activity} />);

      expect(
        screen.queryByText(
          `${activity.participants.athletes.available}/${activity.participants.athletes.total}`
        )
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          `${activity.participants.staff.available}/${activity.participants.staff.total}`
        )
      ).not.toBeInTheDocument();
    });

    it('calls `onOpenTab` on participants counts click if `pac-sessions-session-plan-see-staff-and-athlete-numbers` and `planning-selection-tab` feature flags are enabled', async () => {
      const user = userEvent.setup();
      window.featureFlags = {
        'pac-sessions-session-plan-see-staff-and-athlete-numbers': true,
        'planning-selection-tab': true,
      };
      const onOpenTab = jest.fn();
      render(
        <PlanningTabActivity
          {...props}
          activity={activity}
          onOpenTab={onOpenTab}
        />
      );

      await user.click(
        screen.getByTestId(KITMAN_ICON_NAMES.PeopleOutlinedIcon)
      );

      expect(onOpenTab).toHaveBeenCalledWith('#athlete_selection');

      await user.click(
        screen.getByTestId(KITMAN_ICON_NAMES.RecordVoiceOverOutlinedIcon)
      );

      expect(onOpenTab).toHaveBeenCalledWith('#staff_selection');
    });

    it('opens and closes the drill diagram on click', async () => {
      const user = userEvent.setup();
      render(<PlanningTabActivity {...props} activity={activity} />);

      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();

      await user.click(screen.getByRole('img'));

      expect(screen.getByRole('presentation')).toBeInTheDocument();

      await user.click(screen.getByRole('img'));

      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });

    describe('and when `isInPrintView` prop is passed', () => {
      it('shows athletes count if `pac-sessions-session-plan-see-staff-and-athlete-numbers` feature flag is enabled', () => {
        window.featureFlags = {
          'pac-sessions-session-plan-see-staff-and-athlete-numbers': true,
        };
        render(
          <PlanningTabActivity {...props} isInPrintView activity={activity} />
        );

        expect(
          screen.getByText(
            `${activity.participants.athletes.available}/${activity.participants.athletes.total}`
          )
        ).toBeInTheDocument();
        expect(
          screen.queryByText(
            `${activity.participants.staff.available}/${activity.participants.staff.total}`
          )
        ).not.toBeInTheDocument();
      });

      it('shows participants counts if `pac-sessions-session-plan-see-staff-and-athlete-numbers` and `planning-selection-tab` feature flags are enabled', () => {
        window.featureFlags = {
          'pac-sessions-session-plan-see-staff-and-athlete-numbers': true,
          'planning-selection-tab': true,
        };
        render(
          <PlanningTabActivity {...props} isInPrintView activity={activity} />
        );

        expect(
          screen.getByText(
            `${activity.participants.athletes.available}/${activity.participants.athletes.total}`
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            `${activity.participants.staff.available}/${activity.participants.staff.total}`
          )
        ).toBeInTheDocument();
      });

      it('doesn’t show participants counts if `pac-sessions-session-plan-see-staff-and-athlete-numbers` feature flag is disabled', () => {
        render(
          <PlanningTabActivity {...props} isInPrintView activity={activity} />
        );

        expect(
          screen.queryByText(
            `${activity.participants.athletes.available}/${activity.participants.athletes.total}`
          )
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(
            `${activity.participants.staff.available}/${activity.participants.staff.total}`
          )
        ).not.toBeInTheDocument();
      });

      it('doesn’t call `onOpenTab` on participants counts click if `pac-sessions-session-plan-see-staff-and-athlete-numbers` and `planning-selection-tab` feature flags are enabled', async () => {
        const user = userEvent.setup();
        window.featureFlags = {
          'pac-sessions-session-plan-see-staff-and-athlete-numbers': true,
          'planning-selection-tab': true,
        };
        const onOpenTab = jest.fn();
        render(
          <PlanningTabActivity
            {...props}
            isInPrintView
            activity={activity}
            onOpenTab={onOpenTab}
          />
        );

        await user.click(
          screen.getByTestId(KITMAN_ICON_NAMES.PeopleOutlinedIcon)
        );
        await user.click(
          screen.getByTestId(KITMAN_ICON_NAMES.RecordVoiceOverOutlinedIcon)
        );

        expect(onOpenTab).not.toHaveBeenCalled();
      });
    });
  });

  describe('when prop `activity` isn’t passed', () => {
    const addButtonsLabels = ['Duration', 'Area size', 'Note', 'Principles'];

    it('doesn’t show any fields of `activity`', async () => {
      render(<PlanningTabActivity t={i18nextTranslateStub()} />);

      expect(screen.queryByText(activity.duration)).not.toBeInTheDocument();
    });

    it('shows all ‘Add’ buttons', async () => {
      render(<PlanningTabActivity {...props} activity={null} />);

      const addButtonsContainer = screen.getByText('Add:').parentNode;

      addButtonsLabels.forEach((label) =>
        expect(within(addButtonsContainer).getByText(label)).toBeInTheDocument()
      );
    });

    it('allows clicking ‘Add’ buttons', async () => {
      const user = userEvent.setup();
      render(<PlanningTabActivity {...props} activity={null} />);

      const inputsLabels = [
        'Duration (mins):',
        'Area size:',
        'Note:',
        'Principles',
      ];
      const addButtonsContainer = screen.getByText('Add:').parentNode;
      /* eslint-disable-next-line no-restricted-syntax */
      for (const [index, label] of addButtonsLabels.entries()) {
        const button = within(addButtonsContainer).getByText(label).parentNode;
        /* eslint-disable-next-line no-await-in-loop */
        await user.click(button);
        expect(screen.getByText(inputsLabels[index])).toBeInTheDocument();
      }
    });
  });

  it('calls `onOpenPrinciples` button when principles’ add button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlanningTabActivity {...props} activity={null} />);

    await user.click(screen.getByText('Principles'));
    expect(onOpenPrinciples).toHaveBeenCalled();
  });

  it('doesn’t truncate principles names', async () => {
    const principles = props.activity.principles;
    const firstPrinciple = principles[0];

    firstPrinciple.name = Array(defaultDisplayEllipsisWidth + 1)
      .fill('a')
      .join('');
    render(
      <PlanningTabActivity
        {...props}
        activity={{
          ...props.activity,
          principles,
        }}
      />
    );

    const details = ['principle_categories', 'phases', 'principle_types']
      .map((field) => firstPrinciple[field][0].name)
      .join(', ');
    expect(
      screen.getByText(`${firstPrinciple.name} (${details})`)
    ).toBeInTheDocument();
  });

  describe('shows the correct diagram for each sport', () => {
    const activityWithOutDrillDiagram = {
      ...activity,
      event_activity_drill: {
        ...activity.event_activity_drill,
        diagram: null,
      },
    };

    it('shows the correct image for rugby', () => {
      render(
        <PlanningTabActivity
          {...props}
          activity={activityWithOutDrillDiagram}
          organisationSport="rugby_union"
        />
      );
      const drillDiagram = screen.getByRole('img', {
        name: /drill diagram/i,
      });
      expect(drillDiagram).toBeInTheDocument();
      expect(drillDiagram.src).toContain(
        'http://localhost/img/rugby_drill_diagram_placeholder.svg'
      );
    });

    it('shows the correct image for soccer', () => {
      render(
        <PlanningTabActivity
          {...props}
          activity={activityWithOutDrillDiagram}
          organisationSport="soccer"
        />
      );
      const drillDiagram = screen.getByRole('img', {
        name: /drill diagram/i,
      });
      expect(drillDiagram).toBeInTheDocument();
      expect(drillDiagram.src).toContain(
        'http://localhost/img/soccer_drill_diagram_placeholder.svg'
      );
    });

    it('shows the correct image for gaa', () => {
      render(
        <PlanningTabActivity
          {...props}
          activity={activityWithOutDrillDiagram}
          organisationSport="gaa"
        />
      );
      const drillDiagram = screen.getByRole('img', {
        name: /drill diagram/i,
      });
      expect(drillDiagram).toBeInTheDocument();
      expect(drillDiagram.src).toContain(
        'http://localhost/img/gaa_drill_diagram_placeholder.svg'
      );
    });

    it('shows the correct image for empty organisation sport', () => {
      render(
        <PlanningTabActivity
          {...props}
          activity={activityWithOutDrillDiagram}
          organisationSport={null}
        />
      );
      const drillDiagram = screen.getByRole('img', {
        name: /drill diagram/i,
      });
      expect(drillDiagram).toBeInTheDocument();
      expect(drillDiagram.src).toContain(
        'http://localhost/img/soccer_drill_diagram_placeholder.svg'
      );
    });

    it('fetches drill diagram with Axios if `isInPrintView` prop is passed', async () => {
      const getSpy = jest.fn(() => ({ data: new Blob() }));
      jest.spyOn(axios, 'get').mockImplementation(getSpy);

      render(
        <PlanningTabActivity
          {...props}
          activity={{
            ...activity,
            event_activity_drill: {
              ...activity.event_activity_drill,
              diagram: {
                url: 'http://localhost/diagram-url',
              },
            },
          }}
          organisationSport={null}
          isInPrintView
        />
      );

      await waitFor(() =>
        expect(getSpy).toHaveBeenCalledWith('http://localhost/diagram-url', {
          responseType: 'blob',
        })
      );
    });
  });
});
