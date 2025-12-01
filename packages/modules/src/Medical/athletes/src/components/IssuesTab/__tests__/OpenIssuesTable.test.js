import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import moment from 'moment-timezone';
import OpenIssuesTable from '../OpenIssuesTable';

describe('OpenIssuesTable', () => {
  let component;

  const props = {
    athleteId: 1,
    issues: data.openIssues.issues,
    mockSetShowArchiveModal: jest.fn(),
    mockSetSelectedRow: jest.fn(),
    permissions: { issues: { canArchive: true } },
    t: (key) => key,
  };

  const renderComponent = (passedProps) => {
    render(
      <OpenIssuesTable
        {...props}
        setSelectedRow={props.mockSetSelectedRow}
        setShowArchiveModal={props.mockSetShowArchiveModal}
        {...passedProps}
      />
    );
  };

  beforeEach(() => {
    window.featureFlags = {};
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  describe('render', () => {
    beforeEach(() => {
      component = render(<OpenIssuesTable {...props} />);
    });

    it('renders the correct title', () => {
      expect(component.getByText('Open injury/ illness')).toBeInTheDocument();
    });

    it('renders the data table columns properly', async () => {
      expect(
        await component.findByText('Date of Injury/ Illness')
      ).toBeInTheDocument();
      expect(component.getByText('Type')).toBeInTheDocument();
      expect(component.getByText('Title')).toBeInTheDocument();
      expect(component.getByText('Status')).toBeInTheDocument();
    });

    it('renders the data table row properly', async () => {
      expect(await component.findByText('Nov 11, 2020')).toBeInTheDocument();
      expect(component.getAllByText('Injury')[0]).toBeInTheDocument();
      expect(component.getByText('Ankle Fracture (Left)')).toBeInTheDocument();
      expect(component.getByText('Causing unavailability')).toBeInTheDocument();

      expect(await component.findByText('Aug 6, 2020')).toBeInTheDocument();
      expect(component.getByText('Illness')).toBeInTheDocument();
      expect(component.getByText('Asthma and/or allergy')).toBeInTheDocument();
      expect(
        component.getByText('Not affecting availability')
      ).toBeInTheDocument();

      expect(component.getAllByText('May 23, 2020')[0]).toBeInTheDocument();
      expect(component.getAllByText('Injury')[1]).toBeInTheDocument();
      expect(
        component.getByText(
          'Fracture tibia and fibula at ankle joint - [Right]'
        )
      ).toBeInTheDocument();
      expect(component.getAllByText('Resolved')[0]).toBeInTheDocument();
    });

    it('renders the correct preliminary data', () => {
      expect(
        component.getByText('May 23, 2020 - Preliminary')
      ).toBeInTheDocument();
      expect(component.getByText('[N/A]')).toBeInTheDocument();
    });
  });

  describe('render, [Feature-flag archive-injury]', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      window.featureFlags = { 'archive-injury': true };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the archive row action when athlete NOT on trial', async () => {
      renderComponent();
      await userEvent.click(screen.getAllByRole('button')[0]);
      expect(screen.getByText('Archive')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Archive'));
      expect(props.mockSetShowArchiveModal).toHaveBeenCalledWith(true);
      expect(props.mockSetSelectedRow).toHaveBeenCalledWith({
        archive_reason: null,
        archived: false,
        archived_by: null,
        archived_date: null,
        closed: false,
        full_pathology: 'Ankle Fracture (Left)',
        id: 1,
        injury_status: {
          cause_unavailability: true,
          description: 'Causing unavailability',
          restore_availability: false,
        },
        issue: {
          id: 1,
          osics: {
            body_area: {
              id: 17,
              name: 'Ankle',
            },
            classification: {
              id: 23,
              name: 'Ankle Fracture (Left)',
            },
            icd: null,
            osics_code: 'FFC',
            pathology: {
              id: 321,
              name: 'Ankle Fracture (Left)',
            },
          },
        },
        issue_type: 'Injury',
        occurrence_date: '2020-11-12T00:00:00+01:00',
      });
    });

    it('does not render the archive row action when athlete not IS on trial', async () => {
      renderComponent({ isAthleteOnTrial: true });
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.queryByText('Archive')).not.toBeInTheDocument();
      expect(props.mockSetShowArchiveModal).toHaveBeenCalledTimes(0);
    });
  });
});
