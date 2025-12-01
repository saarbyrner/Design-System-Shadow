import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DateBasedIntegration from '@kitman/modules/src/ImportWorkflow/src/components/SourceSelection/sources/DateBasedIntegration';

setI18n(i18n);

describe('Import Workflow sources <DateBasedIntegration /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      orgTimezone: 'Europe/Dublin',
      event: {
        eventType: 'TRAINING_SESSION',
        date: '2018-02-26T09:00:00.000+01:00',
      },
      events: {
        loaded: false,
        date: '',
        data: [{}],
        integrationId: null,
      },
      backwardButton: '',
      integrationData: {
        id: 1,
      },
      onEventsLoad: jest.fn(),
      onFail: jest.fn(),
      onForward: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('renders the event date', () => {
      render(<DateBasedIntegration {...props} />);
      expect(
        screen.getByText('February 26, 2018 at 8:00 am')
      ).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    it('renders the event date', () => {
      render(<DateBasedIntegration {...props} />);
      // This will depend on what DateFormatter.formatStandard returns
      expect(screen.getByText('Feb 26, 2018 8:00 AM')).toBeInTheDocument();
    });
  });
});
