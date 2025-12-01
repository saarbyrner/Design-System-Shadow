import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import moment from 'moment-timezone';
import ClosedIssuesTable from '../ClosedIssuesTable';

describe('ClosedIssuesTable', () => {
  let component;
  const props = {
    athleteId: 1,
    isPastAthlete: false,
    issues: data.closedIssues.issues,
    mockSetShowArchiveModal: jest.fn(),
    mockSetSelectedRow: jest.fn(),
    permissions: { issues: { canArchive: true } },
    t: (key) => key,
  };

  const renderComponent = (passedProps) => {
    render(
      <ClosedIssuesTable
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
      component = render(<ClosedIssuesTable {...props} />);
    });

    it('renders the correct title', async () => {
      expect(screen.getByText('Prior injury/illness')).toBeInTheDocument();
    });

    it('renders the data table columns properly', async () => {
      expect(
        await screen.findByText('Date of Injury/ Illness')
      ).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Date of resolution')).toBeInTheDocument();
    });

    it('renders the data table row properly', async () => {
      expect(await component.findByText('Oct 27, 2020')).toBeInTheDocument();
      expect(component.getAllByText('Injury')[0]).toBeInTheDocument();
      expect(
        component.getByText('Fracture tibia and fibula at ankle joint - [Left]')
      ).toBeInTheDocument();
      expect(
        component.getByText('Resolved October 31, 2020')
      ).toBeInTheDocument();

      expect(await component.findByText('Sep 13, 2020')).toBeInTheDocument();
      expect(component.getAllByText('Injury')[1]).toBeInTheDocument();
      expect(component.getByText('Ankle Fracture (Left)')).toBeInTheDocument();
      expect(
        component.getByText('Resolved October 15, 2020')
      ).toBeInTheDocument();

      expect(await component.findByText('Feb 4, 2020')).toBeInTheDocument();
      expect(component.getByText('Illness')).toBeInTheDocument();
      expect(component.getByText('Emotional stress')).toBeInTheDocument();
      expect(
        component.getByText('Left club January 11, 2024')
      ).toBeInTheDocument();
    });

    it('renders with max height', async () => {
      expect(
        await screen.findByText('Prior injury/illness')
      ).toBeInTheDocument();
      const dataGrid = component.container.querySelector('.dataGrid');
      expect(dataGrid).toHaveStyle('max-height: 500px');
    });
  });

  describe('render past athletes', () => {
    it('renders the correct label for Date of Resolution value for Past Athletes', async () => {
      component = render(<ClosedIssuesTable {...props} />);

      expect(
        await screen.findByText('Resolved October 31, 2020')
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Resolved October 15, 2020')
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Left club January 11, 2024')
      ).toBeInTheDocument();
    });

    it('renders the correct label for Date of Resolution when there is an unresolved issue', async () => {
      component = render(
        <ClosedIssuesTable
          {...props}
          issues={data.closedIssuesWithUnresolvedIssues}
        />
      );

      expect(
        await screen.findByText('Unresolved by prior Club')
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Resolved October 15, 2020')
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Left club January 11, 2024')
      ).toBeInTheDocument();
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
        closed: true,
        full_pathology: 'Fracture tibia and fibula at ankle joint - [Left]',
        id: 1,
        injury_status: {
          cause_unavailability: false,
          description: 'Resolved',
          restore_availability: true,
        },
        issue_type: 'Injury',
        occurrence_date: '2020-10-28T00:00:00+01:00',
        resolved_date: '2020-11-01T00:00:00+01:00',
      });
    });

    it('does not render the archive row action when athlete not IS on trial', async () => {
      renderComponent({ isAthleteOnTrial: true });
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.queryByText('Archive')).not.toBeInTheDocument();
      expect(props.mockSetShowArchiveModal).not.toHaveBeenCalled();
    });
  });
});
