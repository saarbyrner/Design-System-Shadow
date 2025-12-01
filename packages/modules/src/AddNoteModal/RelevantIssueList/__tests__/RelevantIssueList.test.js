import { screen } from '@testing-library/react';

import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import athleteData from '@kitman//modules/src/AthleteAvailabilityList/utils/dummyAthleteData';
import RelevantIssueList from '../index';


describe('Availability List <RelevantIssueList /> component', () => {
  let props;

  const athletes = athleteData();

  beforeEach(() => {
    props = {
      type: 1,
      injuries: athletes[0].injuries,
      illnesses: athletes[0].illnesses,
      injuryOsicsPathologies: [
        { id: 1168, name: 'Abdominopelvic Structural abnormality' },
        { id: 366, name: 'Accessory bone foot' },
      ],
      illnessOsicsPathologies: [
        { id: 1392, name: '1st CMC joint instability' },
        { id: 948, name: 'AC Joint contusion' },
      ],
      sides: [
        {
          id: 1,
          name: 'left',
        },
        {
          id: 2,
          name: 'right',
        },
        {
          id: 3,
          name: 'center',
        },
      ],
      relevantInjuryIds: [],
      relevantIllnessIds: [],
      injuryStatuses: [
        {
          cause_unavailability: true,
          description: 'Causing unavailability (time-loss)',
          id: 1,
          injury_status_system_id: 1,
          order: 1,
          restore_availability: false,
        },
        {
          cause_unavailability: false,
          description: 'Not affecting availability (medical attention)',
          id: 2,
          injury_status_system_id: 1,
          order: 2,
          restore_availability: true,
        },
        {
          cause_unavailability: false,
          description: 'Resolved',
          id: 3,
          injury_status_system_id: 1,
          order: 3,
          restore_availability: true,
        },
      ],
      updateRelevantInjuries: jest.fn(),
      updateRelevantIllnesses: jest.fn(),
      t: (key) => key,
    };
  });

  it('renders', () => {
    renderWithUserEventSetup(<RelevantIssueList {...props} />);
    expect(screen.getByText('Relevant Injuries')).toBeInTheDocument();
  });

  describe('when there are no issues', () => {
    beforeEach(() => {
      props.injuries = [];
      props.illnesses = [];
    });

    it('displays an empty text', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.getByText('#sport_specific__There_are_no_issues_for_this_athlete.')).toBeInTheDocument();
    });
  });

  describe('when type is injury', () => {
    it('displays the correct issue list', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.getByText('Relevant Injuries')).toBeInTheDocument();
    });

    it('renders the correct number of injuries', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    });
  });

  describe('when type is illness', () => {
    beforeEach(() => {
      props.type = 2;
    });

    it('displays the correct issue list', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.getByText('Relevant Illnesses')).toBeInTheDocument();
    });

    it('renders the correct number of illnesses', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    });
  });

  describe('when type is medical', () => {
    beforeEach(() => {
      props.type = 3;
    });

    it('displays the correct issue lists', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.getByText('Relevant Injuries')).toBeInTheDocument();
      expect(screen.getByText('Relevant Illnesses')).toBeInTheDocument();
    });
  });

  describe('when the coding system is ICD', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
      props.injuries = [
        {
          events_order: [],
          events: [],
          coding: {
            [codingSystemKeys.ICD]: { diagnosis: 'ICD Injury' },
          },
        },
      ];
      props.illnesses = [
        {
          events_order: [],
          events: [],
          coding: {
            [codingSystemKeys.ICD]: { diagnosis: 'ICD Illness' },
          },
        },
      ];
      props.type = 3;
    });
    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('displays the correct issue lists', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.getByText('ICD Injury')).toBeInTheDocument();
      expect(screen.getByText('ICD Illness')).toBeInTheDocument();
    });
  });

  describe('when the coding system is Datalys', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
      props.injuries = [
        {
          events_order: [],
          events: [],
          coding: {
            [codingSystemKeys.DATALYS]: { pathology: 'Datalys Injury' },
          },
        },
      ];
      props.illnesses = [
        {
          events_order: [],
          events: [],
          coding: {
            [codingSystemKeys.DATALYS]: { pathology: 'Datalys Illness' },
          },
        },
      ];
      props.type = 3;
    });
    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('displays the correct issue lists', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.getByText('Datalys Injury')).toBeInTheDocument();
      expect(screen.getByText('Datalys Illness')).toBeInTheDocument();
    });
  });

  describe('when the coding system is Clinical Impressions', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
      props.injuries = [
        {
          events_order: [],
          events: [],
          coding: {
            [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
              pathology: 'Datalys Injury',
            },
          },
        },
      ];
      props.illnesses = [
        {
          events_order: [],
          events: [],
          coding: {
            [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
              pathology: 'Datalys Illness',
            },
          },
        },
      ];
      props.type = 3;
    });
    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('displays the correct issue lists', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.getByText('Datalys Injury')).toBeInTheDocument();
      expect(screen.getByText('Datalys Illness')).toBeInTheDocument();
    });
  });

  describe('when type is standard note', () => {
    beforeEach(() => {
      props.type = 0;
    });

    it('does not render an issue list', () => {
      renderWithUserEventSetup(<RelevantIssueList {...props} />);
      expect(screen.queryByText('Relevant Injuries')).not.toBeInTheDocument();
    });
  });

  describe('when an issue checkbox is checked for injuries', () => {
    it('calls the correct callback', async () => {
      const { user } = renderWithUserEventSetup(<RelevantIssueList {...props} />);
      await user.click(screen.getAllByRole('checkbox')[0]);
      expect(props.updateRelevantInjuries).toHaveBeenCalledWith(props.injuries[0].issue_id);
    });
  });

  describe('when an issue checkbox is checked for illnesses', () => {
    beforeEach(() => {
      props.type = 2;
    });

    it('calls the correct callback', async () => {
      const { user } = renderWithUserEventSetup(<RelevantIssueList {...props} />);
      await user.click(screen.getAllByRole('checkbox')[0]);
      expect(props.updateRelevantIllnesses).toHaveBeenCalledWith(props.illnesses[0].issue_id);
    });
  });
});
