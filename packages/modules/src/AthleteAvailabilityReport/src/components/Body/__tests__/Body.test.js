import { render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import colors from '@kitman/common/src/variables/colors';
import Body from '../index';
import {
  athleteData,
  expandedAthleteData,
} from '../../../../utils/dummyAthleteData';

// Mock Tippy.js to render its content directly for easier testing
jest.mock('@tippyjs/react', () => ({
  __esModule: true,
  default: ({ content, children }) => (
    <div>
      {children}
      <div data-testid="tippy-content">{content}</div>
    </div>
  ),
}));

describe('Availability Report <Body /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      athletes: athleteData(),
      canViewIssues: true,
      canViewAbsence: true,
      expandedAthleteData: {},
      injuryStatuses: [
        {
          cause_unavailability: true,
          description: 'Causing unavailability (time-loss)',
          id: 1,
          injury_status_system_id: 1,
          order: 1,
          restore_availability: false,
          color: colors.s25,
        },
        {
          cause_unavailability: false,
          description: 'Not affecting availability (medical attention)',
          id: 2,
          injury_status_system_id: 1,
          order: 2,
          restore_availability: true,
          color: colors.s08,
        },
        {
          cause_unavailability: false,
          description: 'Resolved',
          id: 3,
          injury_status_system_id: 1,
          order: 3,
          restore_availability: true,
          color: null,
        },
      ],
      t: i18nextTranslateStub(),
    };
  });

  it('renders', () => {
    const { container } = render(<Body {...props} />);
    expect(
      container.querySelector('.availabilityReportTable__rowWrapper')
    ).toBeInTheDocument();
  });

  it('renders the correct number of rows', () => {
    const { container } = render(<Body {...props} />);
    expect(
      container.querySelectorAll('.availabilityReportTable__row').length
    ).toBe(3);
  });

  it('renders the correct cells', () => {
    const { container } = render(<Body {...props} />);
    const firstRow = container.querySelectorAll(
      '.availabilityReportTable__row'
    )[0];
    expect(
      firstRow.querySelectorAll(
        '.availabilityReportTable__availabilityBarsCell'
      ).length
    ).toBe(10);
  });

  describe('when the expandedAthleteData is defined', () => {
    const expandedDummyData = { ...expandedAthleteData() };
    beforeEach(() => {
      props.expandedAthleteData = { [expandedDummyData.id]: expandedDummyData };
    });

    it('renders the correct number of expanded rows', () => {
      const { container } = render(<Body {...props} />);
      // 3 main rows + 2 expanded rows from dummy data = 5
      expect(
        container.querySelectorAll('.availabilityReportTable__row').length
      ).toBe(5);
    });

    it('renders the correct tooltip content', () => {
      render(<Body {...props} />);
      const tooltip = screen.getAllByTestId('tippy-content')[0];
      expect(within(tooltip).getAllByText('Absence')[0]).toBeInTheDocument();
      expect(
        within(tooltip).getByText('International Duty')
      ).toBeInTheDocument();
    });

    describe('when the standard-date-formatting flag is off', () => {
      beforeEach(() => {
        window.featureFlags = { 'standard-date-formatting': false };
      });
      afterEach(() => {
        window.featureFlags = {};
      });

      it('renders the correct date format in tooltip', () => {
        render(<Body {...props} />);
        const tooltip = screen.getAllByTestId('tippy-content')[0];
        expect(within(tooltip).getByText('22 Aug 2018')).toBeInTheDocument();
        expect(within(tooltip).getAllByText('477 days')[0]).toBeInTheDocument();
      });
    });

    describe('when the standard-date-formatting flag is on', () => {
      beforeEach(() => {
        window.featureFlags = { 'standard-date-formatting': true };
      });
      afterEach(() => {
        window.featureFlags = {};
      });

      it('renders the correct date format in tooltip', () => {
        render(<Body {...props} />);
        const tooltip = screen.getAllByTestId('tippy-content')[0];
        expect(within(tooltip).getByText('Aug 22, 2018')).toBeInTheDocument();
        expect(within(tooltip).getAllByText('477 days')[0]).toBeInTheDocument();
      });
    });
  });
});
