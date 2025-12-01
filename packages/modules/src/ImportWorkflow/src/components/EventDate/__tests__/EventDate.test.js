import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import EventDate from '..';

describe('Import Workflow <EventDate /> component', () => {
  const props = {
    date: '2018-02-26T09:00:00.000+01:00',
    localTimezone: 'NZ',
    orgTimezone: 'Europe/Dublin',
    t: i18nextTranslateStub(),
  };

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    describe('when the format is DATETIME', () => {
      describe('when the local timezone and the org timezone are different', () => {
        it('renders the date, the org timezone time and the local time in parenthesis', () => {
          const { container } = render(
            <EventDate {...props} format="DATETIME" localTimezone="NZ" />
          );

          const eventDateEl = container.querySelector(
            '.importWorkflowEventDate'
          );
          expect(eventDateEl).toHaveTextContent(
            'February 26, 2018 at 8:00 am (9:00 pm NZ)'
          );
        });
      });

      describe('when the local timezone and the org timezone are the same', () => {
        it('renders the date and the time without the local time in parenthesis', () => {
          render(
            <EventDate
              {...props}
              format="DATETIME"
              localTimezone="Europe/Dublin"
            />
          );

          expect(
            screen.getByText('February 26, 2018 at 8:00 am')
          ).toBeInTheDocument();
        });
      });
    });

    describe('when the format is TIME', () => {
      describe('when the local timezone and the org timezone are different', () => {
        it('renders the org timezone time and the local time in parenthesis', () => {
          const { container } = render(
            <EventDate {...props} format="TIME" localTimezone="NZ" />
          );

          const eventDateEl = container.querySelector(
            '.importWorkflowEventDate'
          );
          expect(eventDateEl).toHaveTextContent('8:00 am (9:00 pm NZ)');
        });
      });

      describe('when the local timezone and the org timezone are the same', () => {
        it('renders the time without the local time in parenthesis', () => {
          render(
            <EventDate {...props} format="TIME" localTimezone="Europe/Dublin" />
          );

          expect(screen.getByText('8:00 am')).toBeInTheDocument();
        });
      });
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    describe('when the format is DATETIME', () => {
      describe('when the local timezone and the org timezone are different', () => {
        it('renders the date, the org timezone time and the local time in parenthesis', () => {
          const { container } = render(
            <EventDate {...props} format="DATETIME" localTimezone="NZ" />
          );

          const eventDateEl = container.querySelector(
            '.importWorkflowEventDate'
          );
          expect(eventDateEl).toHaveTextContent(
            'Feb 26, 2018 8:00 AM (9:00 PM NZ)'
          );
        });
      });

      describe('when the local timezone and the org timezone are the same', () => {
        it('renders the date and the time without the local time in parenthesis', () => {
          render(
            <EventDate
              {...props}
              format="DATETIME"
              localTimezone="Europe/Dublin"
            />
          );

          expect(screen.getByText('Feb 26, 2018 8:00 AM')).toBeInTheDocument();
        });
      });
    });

    describe('when the format is TIME', () => {
      describe('when the local timezone and the org timezone are different', () => {
        it('renders the org timezone time and the local time in parenthesis', () => {
          const { container } = render(
            <EventDate {...props} format="TIME" localTimezone="NZ" />
          );

          const eventDateEl = container.querySelector(
            '.importWorkflowEventDate'
          );
          expect(eventDateEl).toHaveTextContent('8:00 AM (9:00 PM NZ)');
        });
      });

      describe('when the local timezone and the org timezone are the same', () => {
        it('renders the time without the local time in parenthesis', () => {
          render(
            <EventDate {...props} format="TIME" localTimezone="Europe/Dublin" />
          );

          expect(screen.getByText('8:00 AM')).toBeInTheDocument();
        });
      });
    });
  });
});
