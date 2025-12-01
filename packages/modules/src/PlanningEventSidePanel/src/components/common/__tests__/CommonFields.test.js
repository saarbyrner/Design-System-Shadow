import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import CommonFields from '../CommonFields';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
}));

describe('<CommonFields />', () => {
  const testEvent = {
    duration: '10',
    local_timezone: 'UTC',
    start_time: '2021-07-12T10:00:16+00:00',
    title: 'Test event',
    editable: false,
    type: 'some_other_event',
  };

  const editableEvent = { ...testEvent, editable: true };

  const simpleValidResult = {
    isInvalid: false,
  };

  const testValidity = {
    duration: simpleValidResult,
    local_timezone: simpleValidResult,
    start_time: simpleValidResult,
    title: simpleValidResult,
    date: simpleValidResult,
  };

  const customEvent = { ...testEvent, type: 'custom_event' };

  const onUpdateEventStartTime = jest.fn();
  const onUpdateEventDuration = jest.fn();
  const onUpdateEventDate = jest.fn();
  const onUpdateEventTimezone = jest.fn();
  const onUpdateEventTitle = jest.fn();

  const props = {
    event: testEvent,
    panelMode: 'CREATE',
    eventValidity: testValidity,
    onUpdateEventStartTime,
    onUpdateEventDuration,
    onUpdateEventDate,
    onUpdateEventTimezone,
    onUpdateEventTitle,
    t: i18nextTranslateStub(),
  };

  /**
   * @param {HTMLElement} container
   */
  const getTimezone = (container) =>
    container.querySelector('.kitmanReactSelect__control');

  const getDuration = () => screen.getByRole('spinbutton');

  /**
   * @param {HTMLElement} container
   */
  const getDateTimeComponents = (container) => {
    const timezone = getTimezone(container);
    const [date, startTime] = screen.getAllByRole('textbox').slice(0, 2);
    const duration = getDuration();
    return { date, startTime, duration, timezone };
  };

  /**
   * @param {HTMLElement} container
   */
  const getDateTimeComponentsWithTitle = (container) => {
    const timezone = getTimezone(container);
    const [title, date, startTime] = screen.getAllByRole('textbox').slice(0, 3);
    const duration = getDuration();
    return { title, date, startTime, duration, timezone };
  };

  /**
   * @param {HTMLElement} container
   * @returns {number}
   */
  const getNumberOfSelects = (container) =>
    container.querySelectorAll(
      '[class="kitmanReactSelect"]' // This selector is used because an inner element also has the exact same class, and another one
    ).length;

  const disabledReactSelectClass = 'kitmanReactSelect__control--is-disabled';

  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Test Org',
        association_name: 'Test Association',
      },
    });
  });

  it('renders properly', () => {
    render(<CommonFields {...props} />);
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  describe('date time editing', () => {
    it('does not disable date time editing in create mode', () => {
      const { container } = render(<CommonFields {...props} />);

      const { date, startTime, timezone, duration } =
        getDateTimeComponents(container);

      expect(date).toBeEnabled();
      expect(startTime).toBeEnabled();
      expect(timezone).not.toHaveClass(disabledReactSelectClass);
      expect(duration).toBeInTheDocument();
    });

    it('does disable date time editing in edit mode if event not editable', () => {
      const { container } = render(
        <CommonFields {...props} panelMode="EDIT" />
      );

      const { date, startTime, timezone, duration } =
        getDateTimeComponents(container);

      expect(date).toBeDisabled();
      expect(startTime).toBeDisabled();
      expect(timezone).toHaveClass(disabledReactSelectClass);
      expect(duration).toBeInTheDocument();
    });
    it('does not disable date time editing in edit mode if event is editable', () => {
      const { container } = render(
        <CommonFields {...props} event={editableEvent} panelMode="EDIT" />
      );

      const { date, startTime, timezone, duration } =
        getDateTimeComponents(container);

      expect(date).toBeEnabled();
      expect(startTime).toBeEnabled();
      expect(timezone).not.toHaveClass(disabledReactSelectClass);
      expect(duration).toBeInTheDocument();
    });

    describe('when the planning-show-event-title-in-creation-and-edit Feature Flag is true', () => {
      const invalidTextClass = 'inputText--invalid';
      beforeEach(() => {
        window.setFlag('planning-show-event-title-in-creation-and-edit', true);
      });

      afterEach(() => {
        window.setFlag('planning-show-event-title-in-creation-and-edit', false);
      });

      it('renders the title input when allowEditTitle present in props', () => {
        const { container } = render(
          <CommonFields {...props} allowEditTitle />
        );
        const { title, date, timezone, duration, startTime } =
          getDateTimeComponentsWithTitle(container);
        expect(duration).toBeInTheDocument();
        expect(startTime).toBeInTheDocument();
        expect(date).toBeInTheDocument();
        expect(timezone).toBeInTheDocument();
        expect(title).toBeInTheDocument();
      });

      it('does not render the title input when allowEditTitle is not present in props', () => {
        const { container } = render(<CommonFields {...props} />);
        const { date, timezone, duration, startTime } =
          getDateTimeComponents(container);
        expect(duration).toBeInTheDocument();
        expect(startTime).toBeInTheDocument();
        expect(date).toBeInTheDocument();
        expect(timezone).toBeInTheDocument();
        expect(screen.queryByLabelText('Title')).not.toBeInTheDocument();
      });

      it('can show validation error messages', () => {
        const testErrorMessage = 'Test date related error';
        const eventValidity = {
          title: {
            isInvalid: true,
          },
          start_time: {
            isInvalid: true,
            messages: [testErrorMessage],
          },
        };

        const { container } = render(
          <CommonFields
            {...props}
            eventValidity={eventValidity}
            allowEditTitle
          />
        );

        const { title, date } = getDateTimeComponentsWithTitle(container);
        expect(title.parentElement.parentElement).toHaveClass(invalidTextClass);
        expect(date.parentElement.parentElement).toHaveClass(invalidTextClass);
        // I know this is very convoluted - couldn't find a better way to replicate an old Mocha test
        expect(
          date.parentElement.parentElement.parentElement.parentElement
            .children[1]
        ).toHaveTextContent(testErrorMessage);
      });

      it('will not show a validation error messages when eventValidity says fields are valid', () => {
        const { container } = render(
          <CommonFields {...props} allowEditTitle />
        );

        const { title, date } = getDateTimeComponentsWithTitle(container);
        expect(title.parentElement.parentElement).not.toHaveClass(
          invalidTextClass
        );
        expect(date.parentElement.parentElement).not.toHaveClass(
          invalidTextClass
        );

        // I know this is very convoluted - couldn't find a better way to replicate an old Mocha test
        // Making sure there is no error label
        expect(
          date.parentElement.parentElement.parentElement.parentElement.children
            .length
        ).toBe(1);
      });
    });

    describe('when the custom-events FF is on', () => {
      beforeEach(() => {
        window.featureFlags['custom-events'] = true;
      });

      afterEach(() => {
        window.featureFlags['custom-events'] = false;
      });

      it('should not display the repeat events select component because the repeat-events is not on', () => {
        const { container } = render(<CommonFields {...props} />);
        const numberOfSelects = getNumberOfSelects(container);
        expect(numberOfSelects).toBe(1); // just timezone
      });

      it('should not display the repeat events select component because the event is not a custom event', () => {
        window.featureFlags['repeat-events'] = true;
        const { container } = render(<CommonFields {...props} />);
        const numberOfSelects = getNumberOfSelects(container);
        expect(numberOfSelects).toBe(1); // just timezone
        window.featureFlags['repeat-events'] = false;
      });

      it('should not display the repeat events select component because the event a custom event, but the repeat-events FF is off', () => {
        const { container } = render(
          <CommonFields {...props} event={customEvent} />
        );
        const numberOfSelects = getNumberOfSelects(container);
        expect(numberOfSelects).toBe(1); // just timezone
      });

      it('should display the repeat events select component', () => {
        window.featureFlags['repeat-events'] = true;
        const { container } = render(
          <CommonFields {...props} event={customEvent} />
        );
        const numberOfSelects = getNumberOfSelects(container);
        expect(numberOfSelects).toBe(2); // timezone + repeat event
        window.featureFlags['repeat-events'] = false;
      });
    });

    describe('when the event-locations FF is on', () => {
      beforeEach(() => {
        window.featureFlags['event-locations'] = true;
      });

      afterEach(() => {
        window.featureFlags['event-locations'] = false;
      });

      it('should display the location selection component', () => {
        const { container } = render(<CommonFields {...props} />);
        const numberOfSelects = getNumberOfSelects(container);
        expect(numberOfSelects).toBe(2); // timezone + location
      });

      describe('if planning-custom-org-event-details is on', () => {
        beforeEach(() => {
          window.setFlag('planning-custom-org-event-details', true);
        });

        afterEach(() => {
          window.setFlag('planning-custom-org-event-details', false);
        });

        it('should not display the global location select if it is a session', () => {
          const { container } = render(
            <CommonFields
              {...props}
              event={{ ...testEvent, type: 'session_event' }}
            />
          );
          const numberOfSelects = getNumberOfSelects(container);
          expect(numberOfSelects).toBe(2); // timezone + repeat event select
        });

        it('should not display the global location select if it is a game', () => {
          const { container } = render(
            <CommonFields
              {...props}
              event={{ ...testEvent, type: 'game_event' }}
            />
          );
          const numberOfSelects = getNumberOfSelects(container);
          expect(numberOfSelects).toBe(1); // timezone only
        });

        it('should display the global location select if it is a custom event', () => {
          const { container } = render(
            <CommonFields {...props} event={customEvent} />
          );
          const numberOfSelects = getNumberOfSelects(container);
          expect(numberOfSelects).toBe(2); // timezone and location
        });
      });
    });

    it('should render no participants checkbox if feature flags are true', () => {
      window.setFlag('create-session-no-participants', true);
      window.setFlag('planning-dual-write', true);
      window.setFlag(
        'full-participation-by-default-on-creation-of-sessions',
        true
      );

      render(
        <CommonFields
          {...props}
          event={{ ...testEvent, type: 'session_event', panelMode: 'CREATE' }}
        />
      );

      expect(
        screen.getByRole('checkbox', { name: 'Create with no participants' })
      ).toBeInTheDocument();
    });

    it(
      'should not render no participants checkbox if `pac-event-sidepanel-sessions-games-show-athlete-dropdown`' +
        'flag is true',
      () => {
        window.setFlag('create-session-no-participants', true);
        window.setFlag('planning-dual-write', true);
        window.setFlag(
          'full-participation-by-default-on-creation-of-sessions',
          true
        );
        window.setFlag(
          'pac-event-sidepanel-sessions-games-show-athlete-dropdown',
          true
        );

        render(
          <CommonFields
            {...props}
            event={{ ...testEvent, type: 'session_event', panelMode: 'CREATE' }}
          />
        );

        expect(
          screen.queryByRole('checkbox', {
            name: 'Create with no participants',
          })
        ).not.toBeInTheDocument();
      }
    );

    it('should not render the Attendance component if the event type is custom_event', () => {
      window.setFlag(
        'pac-event-sidepanel-sessions-games-show-athlete-dropdown',
        true
      );
      render(
        <CommonFields
          {...props}
          event={{ ...testEvent, type: 'custom_event' }}
        />
      );
      expect(screen.queryByText('Attendance')).not.toBeInTheDocument();
    });
  });
});
