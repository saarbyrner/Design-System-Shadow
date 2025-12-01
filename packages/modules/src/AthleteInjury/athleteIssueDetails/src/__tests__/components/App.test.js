import { render, screen } from '@testing-library/react';
import App from '../../components/App';
import bamicGrades from '../../../../resources/bamicGrades';

import DummyIssueStatusOptions from '../../../../utils/DummyIssueStatusOptions';
import { InjuryDataRequested } from '../../../../utils/InjuryData';

jest.mock('../../../../athleteIssueEditor', () => jest.fn());

jest.mock('../../components/ActivityName', () => ({
  ActivityNameTranslated: ({ children, ...props }) => (
    <div data-testid="ActivityName" {...props}>
      {props.activityType === 'training'
        ? 'Collision (34 min)'
        : 'Tackled (34 min)'}
    </div>
  ),
}));

jest.mock('../../components/AthleteMedications', () => ({
  AthleteMedicationsTranslated: ({ children, ...props }) => (
    <div data-testid="AthleteMedications" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('../../components/AthleteAvailabilityHistoryDetails', () => ({
  AthleteAvailabilityHistoryDetailsTranslated: ({ children, ...props }) => (
    <div data-testid="AthleteAvailabilityHistoryDetails" {...props}>
      {children}
    </div>
  ),
}));

describe('Athlete Issue Details <App /> component', () => {
  let props;

  beforeEach(() => {
    window.featureFlags = {};

    props = {
      athleteName: 'Jon Doe',
      issueStatusOptions: DummyIssueStatusOptions,
      currentIssue: InjuryDataRequested(),
      formType: 'INJURY',
      isIssueEditPermitted: true,
      bamicGrades,
      osicsPathologies: [
        {
          id: 2,
          name: 'Traction injury to apophysis ankle',
        },
        {
          id: 12,
          name: 'Bimalleolar fracture',
        },
      ],
      osicsClassifications: [
        {
          id: 1,
          name: 'Apophysitis',
        },
        {
          id: 11,
          name: 'Ligament',
        },
      ],
      osicsBodyAreas: [
        {
          id: 1,
          name: 'Ankle',
        },
        {
          id: 10,
          name: 'Lower Leg',
        },
      ],
      issueTypes: [
        {
          id: 1,
          name: 'Overuse',
        },
        {
          id: 2,
          name: 'Traumatic',
        },
      ],
      sides: [
        {
          id: 1,
          name: 'Left',
        },
        {
          id: 2,
          name: 'Center',
        },
      ],
      positionGroups: [
        {
          id: 1,
          name: 'Back',
          positions: [],
        },
        {
          id: 2,
          name: 'Forward',
          positions: [
            {
              id: 2,
              name: 'Hooker',
            },
          ],
        },
      ],
      activityGroups: [
        {
          name: 'Rugby Game',
          event_type: 'game',
          activities: [
            { name: 'Tackled', id: 1 },
            { name: 'Tackling', id: 2 },
            { name: 'Collision', id: 3 },
            { name: 'Scrum', id: 8 },
            { name: 'Lineout', id: 9 },
            { name: 'Other Contact', id: 10 },
          ],
        },
        {
          name: 'Rugby Training',
          event_type: 'training',
          activities: [
            { name: 'Tackled', id: 11 },
            { name: 'Tackling', id: 12 },
            { name: 'Collision', id: 13 },
            { name: 'Scrum', id: 18 },
            { name: 'Lineout', id: 19 },
            { name: 'Other Contact', id: 20 },
          ],
        },
      ],
      periods: [
        {
          id: 456,
          name: 'First Half',
          duration: 40,
          order: 1,
        },
        {
          id: 457,
          name: 'Second Half',
          duration: 40,
          order: 2,
        },
      ],
      periodTerm: 'Custom Period',
      orgTimeZone: 'Europe/Dublin',
      t: (key) => key,
    };
  });

  it('renders', () => {
    render(<App {...props} />);
    expect(screen.getByText('Issue Details')).toBeInTheDocument();
  });

  it('renders the correct title', () => {
    render(<App {...props} />);
    expect(screen.getByText('Issue Details')).toBeInTheDocument();
  });

  describe('When the issue has multiple occurrences', () => {
    beforeEach(() => {
      props.currentIssue.has_recurrence = true;
    });

    it('renders the correct title', () => {
      render(<App {...props} />);
      expect(
        screen.getByText('Issue Details (Recurrence)')
      ).toBeInTheDocument();
    });

    describe('When the issue is the first occurrence', () => {
      beforeEach(() => {
        props.currentIssue.is_first_occurrence = true;
      });

      it('renders the correct title for injury', () => {
        render(<App {...props} formType="INJURY" />);
        expect(
          screen.getByText('Issue Details (This injury has a Recurrence)')
        ).toBeInTheDocument();
      });

      it('renders the correct title for illness', () => {
        render(<App {...props} formType="ILLNESS" />);
        expect(
          screen.getByText('Issue Details (This illness has a Recurrence)')
        ).toBeInTheDocument();
      });
    });
  });

  describe('When there is no creator name specified for the issue', () => {
    beforeEach(() => {
      props.currentIssue.created_by = '';
    });

    it('renders the correct creator details', () => {
      render(<App {...props} />);
      expect(screen.queryByText('by')).not.toBeInTheDocument();
    });
  });

  it('renders the examination date', () => {
    render(<App {...props} />);
    expect(screen.getByText('Examined on {{date}}')).toBeInTheDocument();
  });

  describe('When the issue has no recurrence, only one occurrence', () => {
    beforeEach(() => {
      props.currentIssue.has_recurrence = false;
    });

    it('renders the correct title', () => {
      render(<App {...props} />);
      expect(screen.getByText('Issue Details')).toBeInTheDocument();
    });
  });

  it('renders the edit button with the right text', () => {
    render(<App {...props} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('passes the correct props to the AthleteAvailabilityHistoryDetails component', () => {
    render(<App {...props} />);
    const availabilityComp = screen.getByTestId(
      'AthleteAvailabilityHistoryDetails'
    );
    expect(availabilityComp).toBeInTheDocument();
  });

  it('displays the correct OSICS pathology name', () => {
    render(<App {...props} />);
    expect(screen.getByText('Bimalleolar fracture')).toBeInTheDocument();
  });

  it('displays the correct OSICS classification', () => {
    render(<App {...props} />);
    expect(screen.getByText('Ligament')).toBeInTheDocument();
  });

  it('displays the correct OSICS body area with the correct body side', () => {
    render(<App {...props} />);
    expect(screen.getByText('Lower Leg')).toBeInTheDocument();
  });

  it('displays the correct OSICS codes', () => {
    render(<App {...props} />);
    expect(screen.getByText('OSICS: D32131')).toBeInTheDocument();
    expect(screen.getByText('ICD11: 3')).toBeInTheDocument();
  });

  it('renders the correct number of notes', () => {
    render(<App {...props} />);
    expect(
      screen.getByText(props.currentIssue.notes[0].note)
    ).toBeInTheDocument();
    expect(
      screen.getByText(props.currentIssue.notes[1].note)
    ).toBeInTheDocument();
    expect(
      screen.getByText(props.currentIssue.notes[2].note)
    ).toBeInTheDocument();
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('renders the correct number of attachments', () => {
      render(<App {...props} />);
      expect(screen.getAllByText('(10 Jun 2018)').length).toBe(2);
      expect(screen.getAllByText('(12 Jun 2018)').length).toBe(2);
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('renders the correct number of attachments', () => {
      render(<App {...props} />);
      expect(screen.getAllByText('(Jun 10, 2018)').length).toBe(2);
      expect(screen.getAllByText('(Jun 12, 2018)').length).toBe(2);
    });
  });

  describe('when the attachment is an audio file', () => {
    beforeEach(() => {
      const audioAttachment =
        props.currentIssue.diagnostics[0].attachments.slice();
      audioAttachment.push({
        id: 678904,
        url: 'https://injpro-staging.s3.eu-west-1.amazonaws.com/kitman/y.mp3',
        filename: 'xz123CT_123.mp3',
        filetype: 'mp3',
        filesize: 32,
        audio_file: true,
      });
      props.currentIssue.diagnostics[0].attachments = audioAttachment;
    });

    it('displays an audio player for the attachment', () => {
      render(<App {...props} />);
      const audioPlayer = screen.getByText(
        'Your browser does not support embedded audio files.'
      );
      expect(audioPlayer).toBeInTheDocument();
    });
  });

  describe('when there are no notes added', () => {
    beforeEach(() => {
      props.currentIssue.notes = [];
    });

    it('displays an empty text', () => {
      render(<App {...props} />);
      expect(
        screen.getByText('There are no notes added for this injury occurrence.')
      ).toBeInTheDocument();
    });
  });

  it('renders the modification/info if there is one for the issue', () => {
    render(<App {...props} />);
    expect(
      screen.getByText(props.currentIssue.modification_info)
    ).toBeInTheDocument();
  });

  describe('when there is no modifications/info added', () => {
    beforeEach(() => {
      props.currentIssue.modification_info = '';
    });

    it('displays an empty text', () => {
      render(<App {...props} />);
      expect(
        screen.getByText(
          '#sport_specific__There_are_no_modifications/info_added_for_this_athlete.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('when a completed training session or game is linked to the injury', () => {
    beforeEach(() => {
      props.currentIssue.session_completed = true;
    });

    it('displays the correct activity type', () => {
      render(<App {...props} />);
      expect(screen.getByText('(completed)')).toBeInTheDocument();
    });
  });

  describe('when the injury is linked to a game', () => {
    beforeEach(() => {
      props.currentIssue.game_id = 'game_id';
      props.currentIssue.training_session_id = null;
      props.currentIssue.activity_id = 1;
    });

    it('displays the game name', () => {
      render(<App {...props} />);
      const activityName = screen.getByTestId('ActivityName');
      expect(activityName).toBeInTheDocument();
    });

    it('displays the position when the injury occurred', () => {
      render(<App {...props} />);
      expect(screen.getByText('Hooker')).toBeInTheDocument();
    });

    it('displays the correct activity type', () => {
      render(<App {...props} />);
      expect(screen.getByText('Tackled (34 min)')).toBeInTheDocument();
    });
  });

  describe('when the injury is linked to a training session', () => {
    beforeEach(() => {
      props.currentIssue.activity_type = 'training';
      props.currentIssue.game_id = null;
      props.currentIssue.training_session_id = 'training_session_id';
      props.currentIssue.activity_id = 13;
    });

    it('displays the correct activity type', () => {
      render(<App {...props} />);
      expect(screen.getByText('Collision (34 min)')).toBeInTheDocument();
    });

    it('displays the training session name', () => {
      render(<App {...props} />);
      expect(screen.getByText('Training session')).toBeInTheDocument();
      const activityName = screen.getByTestId('ActivityName');
      expect(activityName).toBeInTheDocument();
    });
  });

  describe('When the user does not have any diagnostics on the injury', () => {
    beforeEach(() => {
      props.currentIssue.diagnostics = null;
    });

    it('shows the correct message for the Diagnostics and Medications sections', () => {
      render(<App {...props} />);
      expect(
        screen.getByText(
          'No Diagnostic / Intervention Attachments added to this injury occurrence.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText('No Medications added to this injury occurrence.')
      ).toBeInTheDocument();
    });
  });

  describe('When the user does not have any diagnostics on the illness', () => {
    beforeEach(() => {
      props.currentIssue.diagnostics = null;
    });

    it('shows the correct message for the Diagnostics and Medications sections', () => {
      render(<App {...props} formType="ILLNESS" />);
      expect(
        screen.getByText(
          'No Diagnostic / Intervention Attachments added to this illness.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText('No Medications added to this illness.')
      ).toBeInTheDocument();
    });
  });

  describe('When the user has diagnostics on the injury but no attachments and the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      props.currentIssue.diagnostics[0].attachments = [];
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('shows only the diagnostic type and date', () => {
      render(<App {...props} formType="ILLNESS" />);
      expect(
        screen.getByText(props.currentIssue.diagnostics[0].type)
      ).toBeInTheDocument();
      expect(screen.getByText('(10 Jun 2018)')).toBeInTheDocument();
    });
  });

  describe('When the user has diagnostics on the injury but no attachments and the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      props.currentIssue.diagnostics[0].attachments = [];
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('shows only the diagnostic type and date', () => {
      render(<App {...props} formType="ILLNESS" />);
      expect(
        screen.getByText(props.currentIssue.diagnostics[0].type)
      ).toBeInTheDocument();
      expect(screen.getByText('(Jun 10, 2018)')).toBeInTheDocument();
    });
  });

  describe('When the user has diagnostics with medications', () => {
    it('renders the Athlete Medications', () => {
      render(<App {...props} />);
      expect(screen.getByTestId('AthleteMedications')).toBeInTheDocument();
    });
  });

  describe('Onset section', () => {
    it('Displays the onset section', () => {
      render(<App {...props} />);
      expect(screen.getByText('Onset')).toBeInTheDocument();
      expect(screen.getByText('Overuse')).toBeInTheDocument();
    });
  });

  describe('when the [injury-game-period] feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['injury-game-period'] = true;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('Displays the period field with the correct data', () => {
      render(<App {...props} />);
      expect(screen.getByText(props.periodTerm)).toBeInTheDocument();
      expect(screen.getByText('First Half')).toBeInTheDocument();
    });
  });

  describe('when the form type is ILLNESS', () => {
    beforeEach(() => {
      props.formType = 'ILLNESS';
    });

    describe('when the standard-date-formatting flag is off', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
      });

      it('displays the date of the illness', () => {
        render(<App {...props} />);
        expect(screen.getByText('Date of Illness')).toBeInTheDocument();
        expect(screen.getByText('5 May 2018')).toBeInTheDocument();
      });
    });

    describe('when the standard-date-formatting flag is on', () => {
      beforeEach(() => {
        window.featureFlags['standard-date-formatting'] = true;
      });

      afterEach(() => {
        window.featureFlags['standard-date-formatting'] = false;
      });
      it('displays the date of the illness', () => {
        render(<App {...props} />);
        expect(screen.getByText('Date of Illness')).toBeInTheDocument();
        expect(screen.getByText('May 5, 2018')).toBeInTheDocument();
      });
    });

    it('displays the correct titles', () => {
      render(<App {...props} />);
      expect(screen.getByText('Nature of Illness')).toBeInTheDocument();
      expect(screen.getByText('Illness Notes')).toBeInTheDocument();
    });

    it('does not display the injury related event details', () => {
      render(<App {...props} />);
      expect(screen.queryByText('Activity')).not.toBeInTheDocument();
    });

    describe('when there are no notes added', () => {
      beforeEach(() => {
        props.currentIssue.notes = [];
      });

      it('displays an empty text', () => {
        render(<App {...props} />);
        expect(
          screen.getByText('There are no notes added for this illness.')
        ).toBeInTheDocument();
      });
    });

    describe('Onset section', () => {
      it('Displays the onset section', () => {
        render(<App {...props} />);
        expect(screen.getByText('Onset')).toBeInTheDocument();
        expect(screen.getByText('Overuse')).toBeInTheDocument();
      });
    });
  });

  describe('When the user does not have permission to edit an issue', () => {
    beforeEach(() => {
      props.isIssueEditPermitted = false;
    });

    it('does not render the footer section with the edit button', () => {
      render(<App {...props} />);
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  describe('When the user has the readOnly permission', () => {
    it('does not render the edit button', () => {
      const updateCurrentIssue = { ...props.currentIssue, read_only: true };
      render(<App {...props} currentIssue={updateCurrentIssue} />);
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  describe('when the custom-pathologies feature flag is on', () => {
    beforeEach(() => {
      window.featureFlags['custom-pathologies'] = true;
    });

    it('displays the supplementary pathology', () => {
      props.currentIssue.supplementary_pathology = 'Something';
      render(<App {...props} />);
      expect(screen.getByText('Something')).toBeInTheDocument();
    });
  });

  describe('when the custom-pathologies feature flag is off', () => {
    beforeEach(() => {
      window.featureFlags['custom-pathologies'] = false;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('displays the proper pathology', () => {
      props.currentIssue.supplementary_pathology = 'Something';
      render(<App {...props} />);
      expect(screen.getByText('Bimalleolar fracture')).toBeInTheDocument();
    });

    describe('when the include-bamic-on-injury feature flag is enabled', () => {
      beforeEach(() => {
        window.featureFlags['include-bamic-on-injury'] = true;
      });

      afterEach(() => {
        window.featureFlags['include-bamic-on-injury'] = false;
      });

      it('displays BAMIC values', () => {
        const bamicIssue = {
          ...props.currentIssue,
          bamic_grade_id: 1,
          bamic_site_id: 1,
        };
        render(<App {...props} currentIssue={bamicIssue} />);
        expect(screen.getByText('Grade (site)')).toBeInTheDocument();
        expect(
          screen.getByText('Grade 0 (a - myofascial (peripheral))')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when the treatment-on-view-issue feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['treatment-on-view-issue'] = true;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the treatment section', () => {
      render(<App {...props} />);
      expect(screen.getByText('Treatments')).toBeInTheDocument();
    });
  });

  describe('when the rehab-tracker feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['rehab-tracker'] = true;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the rehab section', () => {
      render(<App {...props} />);
      expect(screen.getByText('Rehab')).toBeInTheDocument();
    });
  });

  describe('when the print-treatment-rehab-modals feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['print-treatment-rehab-modals'] = true;
    });

    afterEach(() => {
      window.featureFlags = {
        'print-treatment-rehab-modals': false,
      };
    });

    it('shows the print button', () => {
      render(<App {...props} />);
      expect(screen.getByText('Print')).toBeInTheDocument();
    });
  });

  describe('when the issue-collapsable-reorder feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['issue-collapsable-reorder'] = true;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders accordions for the sections', () => {
      render(<App {...props} />);
      expect(screen.getAllByText('Event Details')[0]).toBeInTheDocument();
    });

    it('renders an expand all checkbox', () => {
      render(<App {...props} />);
      expect(screen.getByText('Expand All')).toBeInTheDocument();
    });
  });
});
