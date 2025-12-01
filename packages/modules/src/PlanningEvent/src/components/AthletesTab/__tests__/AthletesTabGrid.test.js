import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import AthletesTabGrid from '../AthletesTabGrid';
import updateAttributes from '../../../services/updateAttributes';

jest.mock('../../../services/updateAttributes');
const mockedUpdateAttributes = updateAttributes;

describe('<AthletesTabGrid />', () => {
  const mockedParticipationLevels = [
    {
      value: 'full',
      label: 'Full',
      description: 'Full',
      canonical_participation_level: 'full',
      include_in_group_calculations: true,
    },
    {
      value: 'no_participation',
      label: 'No Participation',
      description: 'No Participation',
      canonical_participation_level: 'none',
      include_in_group_calculations: false,
    },
  ];

  const mockedParticipationLevelReasons = [
    { value: 1, label: 'Injury' },
    { value: 2, label: 'Out (Non-Injury)' },
    { value: 3, label: 'Other' },
  ];
  const mockedColumns = [
    { row_key: 'athlete', name: 'Athlete', id: 1, default: true },
    {
      row_key: 'participation_level',
      name: 'Participation Level',
      id: 2,
      default: true,
    },

    {
      row_key: 'participation_level_reason',
      name: 'Participation Level Reason',
      id: 3,
      default: true,
    },
    {
      row_key: 'include_in_group_calculations',
      name: 'Include In Group Calculations',
      id: 4,
      default: true,
    },
    {
      row_key: '%_difference',
      name: '% Difference',
      id: 5,
      default: false,
    },
    { row_key: 'squads', name: 'Squads', id: 6, default: true },
  ];
  const mockedAthletesGrid = {
    columns: mockedColumns,
    rows: [
      {
        id: 1,
        athlete: {
          availability: 'available',
          avatar_url: 'john_do_avatar.jpg',
          fullname: 'John Doh',
        },
        related_issues: [],
        participation_level: 'full',
        include_in_group_calculations: false,
        '%_difference': { value: 1, comment: null },
        squads: [
          { name: 'Primary', primary: true },
          { name: 'Not Primary', primary: false },
        ],
      },
      {
        id: 2,
        athlete: {
          availability: 'available',
          avatar_url: 'john_do_avatar.jpg',
          fullname: 'John Doe but with a more doe-ier name',
        },
        related_issues: [
          {
            id: 1,
            type: 'Injury',
            pathology: 'Bad Head',
            code: 'KJBX',
            status: 'Out',
          },
        ],
        participation_level: 'no_participation',
        participation_level_reason: 1,
        include_in_group_calculations: false,
        '%_difference': { value: 1, comment: null },
        squads: [
          { name: 'Primary', primary: true },
          { name: 'Not Primary', primary: false },
        ],
      },
      {
        id: 3,
        athlete: {
          avatar_url: 'john_do_avatar.jpg',
          fullname: 'Athlete moved out of org',
        },
        related_issues: [
          {
            id: 133369,
            type: 'Injury',
            pathology: 'Knee',
            code: 'KJBX',
            status: 'Out',
          },
          {
            id: 234,
            type: 'Injury',
            pathology: 'Player left club testing - edited by org b',
            code: null,
            status: 'Out',
          },
        ],
        participation_level: 'no_participation',
        participation_level_reason: 3,
        free_note: { value: 'Disabled Text Field' },
        include_in_group_calculations: false,
        '%_difference': { value: 1, comment: null },
        squads: [],
      },
    ],
  };

  const props = {
    athletesGrid: mockedAthletesGrid,
    participationLevels: mockedParticipationLevels,
    participationLevelReasons: mockedParticipationLevelReasons,
    event: { id: 5 },
    athleteFilter: {
      positions: [],
      squads: [],
      availabilities: [],
    },
    canEditEvent: true,
    canViewAvailabilities: false,
    t: i18nextTranslateStub(),
  };

  it('correctly renders participation level reason in VIEW mode', () => {
    render(<AthletesTabGrid {...props} canEditEvent={false} />);

    // Check for athlete with single related issue (Bad Head + Injury reason)
    // Should render: "Injury: Bad Head"
    expect(screen.getByText('Injury: Bad Head')).toBeInTheDocument();

    // Check for athlete with multiple related issues (Knee + Other issue + Other reason)
    // Should render: "2 - Other: Knee, Preliminary Injury"
    // (second issue has no code, so becomes "Preliminary Injury")
    expect(
      screen.getByText('2 - Other: Knee, Preliminary Injury')
    ).toBeInTheDocument();
  });

  describe('when planning-participation-reason is false', () => {
    const mockOnAttributesUpdate = jest.fn();
    const mockOnAttributesBulkUpdate = jest.fn();

    const propsWithHandlers = {
      ...props,
      onAttributesUpdate: mockOnAttributesUpdate,
      onAttributesBulkUpdate: mockOnAttributesBulkUpdate,
    };

    beforeAll(() => {
      window.featureFlags = {};
    });

    afterAll(() => {
      window.featureFlags = {};
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders the correct content', () => {
      render(<AthletesTabGrid {...propsWithHandlers} />);

      // Check headers
      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('Participation Level')).toBeInTheDocument();
      expect(screen.getByText('% Difference')).toBeInTheDocument();

      expect(screen.getByText('John Doh')).toBeInTheDocument();
      expect(
        screen.getByText('John Doe but with a mo ...')
      ).toBeInTheDocument();
    });

    it('renders the athlete availability when the user has the availability permission', () => {
      render(<AthletesTabGrid {...propsWithHandlers} canViewAvailabilities />);

      // Check availability indicators are rendered
      const availabilityElements = document.querySelectorAll(
        '.planningEventGridTab__availabilityCircle--available'
      );
      expect(availabilityElements.length).toBeGreaterThan(0);
    });

    it("disables the 'Include in group calculation' field when an athlete did not participate", () => {
      const modifiedProps = {
        ...propsWithHandlers,
        athletesGrid: {
          ...propsWithHandlers.athletesGrid,
          rows: [
            {
              ...propsWithHandlers.athletesGrid.rows[0],
              participation_level: 'no_participation',
            },
          ],
        },
      };

      render(<AthletesTabGrid {...modifiedProps} />);

      // The toggle switch should be disabled for non-participating athletes
      const toggleSwitches = document.querySelectorAll(
        'input[type="checkbox"]'
      );
      expect(toggleSwitches[0]).toBeDisabled();
    });

    describe('when the requests are successful', () => {
      const mockedUpdateAttributesResponse = {
        columns: [],
        rows: [
          {
            id: 1,
            participation_level: 'no_participation',
            include_in_group_calculations: true,
          },
        ],
        next_id: null,
      };

      beforeEach(() => {
        mockedUpdateAttributes.mockResolvedValue(
          mockedUpdateAttributesResponse
        );
      });

      it("updates the 'include in group calculation' toggle after toggling it", async () => {
        const user = userEvent.setup();
        render(<AthletesTabGrid {...propsWithHandlers} />);

        // Find and click the toggle switch
        const toggleSwitches = document.querySelectorAll(
          'input[type="checkbox"]'
        );
        await user.click(toggleSwitches[0]);

        // Wait for the update to complete
        await act(async () => {
          await Promise.resolve();
        });

        expect(mockOnAttributesUpdate).toHaveBeenCalledWith(
          {
            id: 1,
            participation_level: 'no_participation',
            include_in_group_calculations: true,
          },
          1
        );
      });
    });

    it('does not show the edit fields when the user is not an event admin', () => {
      render(<AthletesTabGrid {...propsWithHandlers} canEditEvent={false} />);

      // Should not have any Select dropdowns for participation
      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      // Should not have any toggle switches
      expect(document.querySelectorAll('input[type="checkbox"]')).toHaveLength(
        0
      );
    });
  });

  describe('when the planning-participation-reason feature flag is enabled', () => {
    const mockOnAttributesUpdate = jest.fn();
    const mockOnAttributesBulkUpdate = jest.fn();

    const planningColumns = [
      ...mockedColumns,
      {
        row_key: 'participation_level_reason',
        name: 'Participation Level Reasons',
        id: 6,
        default: true,
      },
      { row_key: 'free_note', name: 'Notes', id: 8, default: true },
    ];

    const issueProp = [
      {
        id: 38574,
        first_event: '2022-12-15T00:00:00.000+00:00',
        last_event: '2022-12-15T00:00:00.000+00:00',
        pathology: 'Foot Problem',
        code: 'FP1',
        type: 'injury',
        status: 'open',
      },
      {
        id: 34771,
        first_event: '2022-12-15T00:00:00.000+00:00',
        last_event: '2022-12-15T00:00:00.000+00:00',
        pathology: 'Sore Throat',
        code: 'ST',
        type: 'illness',
        status: 'closed',
      },
    ];

    const planningProps = {
      athletesGrid: {
        columns: planningColumns,
        rows: [
          {
            id: 1,
            athlete: {
              availability: 'available',
              avatar_url: 'john_do_avatar.jpg',
              fullname: 'John Doh',
              issues: issueProp,
            },
            participation_level: 'no_participation',
            participation_level_reason: 2,
            free_note: null,
            include_in_group_calculations: false,
            '%_difference': { value: 1, comment: null },
            squads: [
              { name: 'Primary', primary: true },
              { name: 'Not Primary', primary: false },
            ],
          },
          {
            id: 2,
            athlete: {
              availability: 'available',
              avatar_url: 'john_do_avatar.jpg',
              fullname: 'John Doe but with a more doe-ier name',
              issues: [],
            },
            participation_level: 'full',
            participation_level_reason: null,
            free_note: null,
            include_in_group_calculations: false,
            '%_difference': { value: 1, comment: null },
            squads: [
              { name: 'Primary', primary: true },
              { name: 'Not Primary', primary: false },
            ],
          },
          {
            id: 3,
            athlete: {
              availability: 'unavailable',
              avatar_url: '',
              fullname: 'Athlete with free notes',
              issues: [],
            },
            participation_level: 'no_participation',
            participation_level_reason: 3,
            free_note: { value: 'Test Note' },
            include_in_group_calculations: false,
            '%_difference': { value: 1, comment: null },
            squads: [
              { name: 'Primary', primary: true },
              { name: 'Not Primary', primary: false },
            ],
          },
          {
            id: 4,
            athlete: {
              avatar_url: 'john_do_avatar.jpg',
              fullname: 'Athlete moved out of org',
            },
            participation_level: 'no_participation',
            participation_level_reason: 3,
            free_note: { value: 'Disabled Text Field' },
            include_in_group_calculations: false,
            '%_difference': { value: 1, comment: null },
            squads: [],
          },
          {
            id: 5,
            athlete: {
              avatar_url: 'john_do_avatar.jpg',
              fullname: 'Second moved athlete',
            },
            participation_level: 'no_participation',
            participation_level_reason: 1,
            related_issue: {
              id: 102,
              type: 'Injury',
              pathology: 'Head Scalp Laceration [N/A]',
              code: '010400',
              status: 'Preliminary',
            },
            free_note: null,
            include_in_group_calculations: false,
            '%_difference': { value: 1, comment: null },
            squads: [],
          },
        ],
      },
      participationLevels: mockedParticipationLevels,
      participationLevelReasons: mockedParticipationLevelReasons,
      event: { id: 4 },
      athleteFilter: {
        positions: [],
        squads: [],
        availabilities: [],
      },
      canEditEvent: true,
      canViewAvailabilities: true,
      onAttributesUpdate: mockOnAttributesUpdate,
      onAttributesBulkUpdate: mockOnAttributesBulkUpdate,
      t: i18nextTranslateStub(),
    };

    const mockedPLRResponse = {
      ...planningProps.athletesGrid,
      rows: [
        {
          ...planningProps.athletesGrid.rows[0],
          participation_level_reason: 1,
        },
      ],
    };

    beforeAll(() => {
      window.featureFlags = {
        'planning-participation-reason': true,
      };
    });

    afterAll(() => {
      window.featureFlags = {};
    });

    beforeEach(() => {
      jest.clearAllMocks();
      mockedUpdateAttributes.mockResolvedValue(mockedPLRResponse);
    });

    it('renders the Participation Level Reason Selector', () => {
      render(<AthletesTabGrid {...planningProps} />);

      expect(
        screen.getByText('Participation Level Reasons')
      ).toBeInTheDocument();
    });

    it('shows the notes column', () => {
      render(<AthletesTabGrid {...planningProps} />);

      expect(screen.getByText('Notes')).toBeInTheDocument();
    });

    it('finds the input field for athlete with participation level reason set to Other and they have an existing note AND it is NOT editable', () => {
      render(<AthletesTabGrid {...planningProps} canEditEvent={false} />);

      // In view mode, the input should not be editable (rendered as text)
      expect(screen.getByText('Disabled Text Field')).toBeInTheDocument();
    });
  });
});
