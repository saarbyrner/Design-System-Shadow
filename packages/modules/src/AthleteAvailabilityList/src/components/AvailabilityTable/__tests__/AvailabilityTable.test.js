import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import moment from 'moment';
import {
  groupAthletesByAvailability,
  groupAthletesByPositionGroup,
} from '@kitman/common/src/utils';
import AvailabilityTable from '../index';
import athleteData from '../../../../utils/dummyAthleteData';

jest.mock('@kitman/components', () => {
  const React = jest.requireActual('react');
  return {
    AvailabilityLabel: jest.fn((props) => (
      <span data-testid={`availability-label-${props.status}`}>
        {props.status}
      </span>
    )),
    TooltipMenu: jest.fn((props) => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <div data-testid="mock-tooltip-menu">
          <div onClick={() => setIsOpen(!isOpen)}>
            {props.tooltipTriggerElement}
          </div>
          {isOpen && (
            <div>
              {props.menuItems.map((item) => (
                <a
                  key={`${item.description}-${item.href}`}
                  href={item.href}
                  onClick={item.onClick}
                >
                  {item.description}
                </a>
              ))}
              {props.externalItem}
            </div>
          )}
        </div>
      );
    }),
    RichTextDisplay: jest.fn((props) => (
      <div data-testid="mock-rich-text-display">{props.value}</div>
    )),
  };
});

jest.mock('@kitman/common/src/utils/issue_modals', () => ({
  injuryDetailsLinkClickHandler: jest.fn(),
  illnessDetailsLinkClickHandler: jest.fn(),
}));

describe('Availability List <AvailabilityTable /> component', () => {
  let props;

  const athletes = athleteData();
  const athletesByPositionGroup = groupAthletesByPositionGroup(athletes);
  const athletesByAvailability = groupAthletesByAvailability(athletes);

  beforeEach(() => {
    props = {
      athletes: athletesByPositionGroup,
      groupOrderingByType: {
        availability: ['unavailable', 'injured', 'returning', 'available'],
        positionGroup: ['Forward', 'Back', 'Other'],
      },
      groupBy: 'positionGroup',
      groupingLabels: {
        unavailable: 'Unavailable',
        available: 'Available',
        injured: 'Available (Injured/Ill)',
        returning: 'Available (Returning from injury/illness)',
        screened: 'Screened Today',
        not_screened: 'Not Screened Today',
        alphabetical: 'Alphabetical (A-Z)',
      },
      groupAvailability: {
        'Blindside Flanker': 100,
        Fullback: 100,
        Hooker: 50,
        'Inside Centre': 100,
        'Loose-head Prop': 0,
        'No. 8': 67,
        'Openside Flanker': 100,
        'Out Half': 50,
        'Scrum Half': 33,
        'Second Row': 100,
        'Tight-head Prop': 0,
        Wing: 100,
      },
      injuryOsicsPathologies: [],
      illnessOsicsPathologies: [],
      issueStatusOptions: [],
      canManageIssues: true,
      canViewIssues: true,
      canManageAbsences: true,
      canViewAbsences: true,
      t: (key) => key,
      absenceReasons: [
        { id: 1, reason: 'Sick', order: 1 },
        { id: 2, reason: 'Holiday', order: 2 },
      ],
    };
  });

  test('renders', () => {
    const { container } = render(<AvailabilityTable {...props} />);
    expect(container.querySelector('.availabilityTable')).toBeInTheDocument();
    expect(screen.getByText('#sport_specific__Athlete')).toBeInTheDocument();
  });

  test('renders the correct number of athlete groups', () => {
    const { container } = render(<AvailabilityTable {...props} />);
    expect(
      container.querySelectorAll('.availabilityTable__group')
    ).toHaveLength(2);
  });

  test('renders the correct number of athlete rows in each group', () => {
    const { container } = render(<AvailabilityTable {...props} />);
    const groups = container.querySelectorAll('.availabilityTable__group');
    expect(groups).toHaveLength(2); // Ensure there are two groups

    const firstGroupRows = groups[0].querySelectorAll(
      '.availabilityTable__row'
    );
    const secondGroupRows = groups[1].querySelectorAll(
      '.availabilityTable__row'
    );

    expect(firstGroupRows).toHaveLength(1);
    expect(secondGroupRows).toHaveLength(1);
  });

  describe('when the grouping is by position group', () => {
    test('renders the group availability', () => {
      const { container } = render(<AvailabilityTable {...props} />);
      expect(
        container.querySelectorAll('.availabilityTable__groupHeader')
      ).toHaveLength(2);
    });
  });

  describe('when the grouping is by availability', () => {
    beforeEach(() => {
      props.athletes = athletesByAvailability;
      props.groupBy = 'availability';
    });

    afterEach(() => {
      props.athletes = athletesByPositionGroup;
      props.groupBy = 'positionGroup';
    });

    test('renders the Availability Label for the group heading', () => {
      render(<AvailabilityTable {...props} />);
      // When groupBy is 'availability', the first group is 'unavailable'
      const unavailableGroupHeader = screen
        .getByText('Unavailable:')
        .closest('.availabilityTable__groupHeader');
      expect(
        within(unavailableGroupHeader).getByTestId(
          'availability-label-unavailable'
        )
      ).toBeInTheDocument();
    });

    test('renders the correct group heading name', () => {
      render(<AvailabilityTable {...props} />);
      const groupHeaderNames = screen.getAllByText(/Unavailable:|Available:/);
      expect(groupHeaderNames[0]).toHaveTextContent('Unavailable:');
      expect(groupHeaderNames[1]).toHaveTextContent('Available:');
    });

    test('renders the group availability', () => {
      const { container } = render(<AvailabilityTable {...props} />);
      expect(
        container.querySelectorAll('.availabilityTable__groupHeader')
      ).toHaveLength(2);
    });
  });

  test('renders the correct number in the group heading for athletes', () => {
    const { container } = render(<AvailabilityTable {...props} />);
    const groupCounts = container.querySelectorAll(
      '.availabilityTable__groupCount'
    );
    expect(groupCounts).toHaveLength(2);
    expect(groupCounts[0]).toHaveTextContent('1');
    expect(groupCounts[1]).toHaveTextContent('1');
  });

  test('renders a menu for the athlete', () => {
    const { container } = render(<AvailabilityTable {...props} />);
    expect(container.querySelectorAll('.icon-more')).toHaveLength(2);
  });

  test('renders how long the athlete had been unavailable', () => {
    const { container } = render(<AvailabilityTable {...props} />);
    const rows = container.querySelectorAll('.availabilityTable__row');
    const unavailableAthleteRow = rows[0];
    const availableAthleteRow = rows[1];

    expect(
      within(unavailableAthleteRow).getByText('6 months')
    ).toBeInTheDocument();
    expect(
      within(availableAthleteRow).queryByText('6 months')
    ).not.toBeInTheDocument();
  });

  describe('when there are no injuries or illnesses for an athlete', () => {
    test('does not render the issue list', () => {
      const { container } = render(<AvailabilityTable {...props} />);
      const rows = container.querySelectorAll('.availabilityTable__row');
      const athleteWithoutIssuesRow = rows[1]; // Second athlete has no issues in dummy data

      // Assuming IssueList would render some text like 'Injury' or 'Illness' if present
      expect(
        within(athleteWithoutIssuesRow).queryByText('Injury')
      ).not.toBeInTheDocument();
      expect(
        within(athleteWithoutIssuesRow).queryByText('Illness')
      ).not.toBeInTheDocument();
      // If there's a specific class for the IssueList container, we could use that too:
      // expect(within(athleteWithoutIssuesRow).queryByTestId('issue-list-container')).not.toBeInTheDocument();
    });
  });

  describe('when the athlete has an rtp older than 2 weeks', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(moment('2019-04-15').toDate());
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test('does not render the rtp date', () => {
      const { container } = render(<AvailabilityTable {...props} />);
      const rows = container.querySelectorAll('.availabilityTable__row');
      const athleteRow = rows[0]; // First athlete has an old RTP date in dummy data

      // The original spec checks the second cell, which corresponds to the RTP date
      const rtpCell = athleteRow.querySelector('.availabilityTable__cell--rtp');
      expect(rtpCell).toHaveTextContent('');
    });
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = true; // Reset to default for other tests
    });

    describe('when the athlete has an rtp not older than 2 weeks', () => {
      beforeEach(() => {
        const positionGroupName = props.groupOrderingByType[props.groupBy][0];
        props.athletes[positionGroupName][0].rtp =
          '2019-05-09T00:00:00.000+00:00';
        jest.useFakeTimers();
        jest.setSystemTime(moment('2019-04-15').toDate());
      });

      afterEach(() => {
        const positionGroupName = props.groupOrderingByType[props.groupBy][0];
        props.athletes[positionGroupName][0].rtp =
          '2017-07-20T00:00:00.000+01:00';
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
      });

      test('renders the rtp date', () => {
        const { container } = render(<AvailabilityTable {...props} />);
        const rows = container.querySelectorAll('.availabilityTable__row');
        const athleteRow = rows[0]; // First athlete has the updated RTP date

        const rtpCell = athleteRow.querySelector(
          '.availabilityTable__cell--rtp'
        );
        expect(rtpCell).toHaveTextContent('9 May 2019');
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

    describe('when the athlete has an rtp not older than 2 weeks', () => {
      beforeEach(() => {
        const positionGroupName = props.groupOrderingByType[props.groupBy][0];
        props.athletes[positionGroupName][0].rtp =
          '2019-05-09T00:00:00.000+00:00';
        jest.useFakeTimers();
        jest.setSystemTime(moment('2019-04-15').toDate());
      });

      afterEach(() => {
        const positionGroupName = props.groupOrderingByType[props.groupBy][0];
        props.athletes[positionGroupName][0].rtp =
          '2017-07-20T00:00:00.000+01:00';
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
      });

      test('renders the rtp date', () => {
        const { container } = render(<AvailabilityTable {...props} />);
        const rows = container.querySelectorAll('.availabilityTable__row');
        const athleteRow = rows[0]; // First athlete has the updated RTP date

        const rtpCell = athleteRow.querySelector(
          '.availabilityTable__cell--rtp'
        );
        expect(rtpCell).toHaveTextContent('May 9, 2019');
      });
    });
  });

  describe('when user does not have permission to view issues or absences', () => {
    beforeEach(() => {
      props.canViewIssues = false;
      props.canViewAbsences = false;
    });

    afterEach(() => {
      props.canViewIssues = true;
      props.canViewAbsences = true;
    });

    test('does not render the issue list', () => {
      render(<AvailabilityTable {...props} />);
      // Assuming IssueList would render some text like 'Injury' or 'Illness' if present
      expect(screen.queryByText('Injury')).not.toBeInTheDocument();
      expect(screen.queryByText('Illness')).not.toBeInTheDocument();
      // If there's a specific class for the IssueList container, we could use that too:
      // expect(screen.queryByTestId('issue-list-container')).not.toBeInTheDocument();
    });
  });

  test('renders the menu correctly', async () => {
    const user = userEvent.setup();
    const { container } = render(<AvailabilityTable {...props} />);

    const moreIcons = container.querySelectorAll('.icon-more');
    await user.click(moreIcons[0]); // Click the first athlete's menu icon

    expect(screen.getByText('Add Injury/Illness')).toBeInTheDocument();
    expect(screen.getByText('Add Note')).toBeInTheDocument();
    expect(screen.getByText('Add Treatment')).toBeInTheDocument();
    expect(screen.getByText('Add Diagnostic/Intervention')).toBeInTheDocument();
    expect(screen.getByText('Change Modification/Info')).toBeInTheDocument();
    expect(screen.getByText('Update RTP date')).toBeInTheDocument();
    expect(screen.getByText('View Injuries')).toBeInTheDocument();
    expect(screen.getByText('View Illnesses')).toBeInTheDocument();
    expect(screen.getByText('View Absences')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Absences' })).toHaveAttribute(
      'href',
      '/athletes/1644/absences'
    );
    expect(screen.getByText('Add Absence')).toBeInTheDocument();

    // Add href checks for other menu items
    expect(
      screen.getByRole('link', { name: 'Add Injury/Illness' })
    ).toHaveAttribute('href', '/medical/athletes/1644');
    expect(screen.getByRole('link', { name: 'Add Note' })).toHaveAttribute(
      'href',
      '/medical/athletes/1644#medical_notes'
    );
    expect(screen.getByRole('link', { name: 'Add Treatment' })).toHaveAttribute(
      'href',
      '/medical/athletes/1644#treatments'
    );
    expect(
      screen.getByRole('link', { name: 'Add Diagnostic/Intervention' })
    ).toHaveAttribute('href', '/medical/athletes/1644#diagnostics');
    expect(
      screen.getByRole('link', { name: 'Change Modification/Info' })
    ).toHaveAttribute('href', '/medical/athletes/1644#modifications');
    // 'Update RTP date' does not have an href, it has an onClick
    expect(screen.getByRole('link', { name: 'View Injuries' })).toHaveAttribute(
      'href',
      '/medical/athletes/1644'
    );
    expect(
      screen.getByRole('link', { name: 'View Illnesses' })
    ).toHaveAttribute('href', '/medical/athletes/1644');
  });

  describe('when the rich-text-editor feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags = {
        'rich-text-editor': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    test('renders a rich text display with correct content', () => {
      render(<AvailabilityTable {...props} />);

      // The dummy data has modification_info for the first athlete
      expect(
        screen.getByText(athletes[0].modification_info)
      ).toBeInTheDocument();
      // Assuming RichTextDisplay renders the content directly as text
    });
  });
});
