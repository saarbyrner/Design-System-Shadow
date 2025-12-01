import { render, screen } from '@testing-library/react';
import { data } from '@kitman/services/src/mocks/handlers/planningHub/getEventDeletionPrompt';

import EventDeletionPrompt, { formatDate } from '../index';

describe('<EventDeletionPrompt />', () => {
  const mockProps = { isLoading: false, eventDeletionAttributes: {} };

  const mockLinkedMedicalRecords = { issues: data.issues };
  const mockLinkedMedicalRecordsWithoutPermission = {
    issues: data.issues.map((linkedIssue) => ({
      ...linkedIssue,
      permission_granted: false,
    })),
  };

  const mockLinkedCSVData = { imported_data: data.imported_data };

  const mockLinkedAssessments = { assessments: data.assessments };
  const mockLinkedAssessmentsWithoutPermission = {
    assessments: data.assessments.map((linkedAssessment) => ({
      ...linkedAssessment,
      permission_granted: false,
    })),
  };

  it('should show loading status if isLoading is truthy', () => {
    const { container } = render(
      <EventDeletionPrompt {...mockProps} isLoading />
    );

    expect(
      container.getElementsByClassName('MuiCircularProgress-svg')[0]
    ).toBeInTheDocument();
  });

  describe('Linked medical records', () => {
    it('should display correct content with links with correct href', () => {
      const { container } = render(
        <EventDeletionPrompt
          {...mockProps}
          eventDeletionAttributes={mockLinkedMedicalRecords}
        />
      );

      expect(screen.getAllByRole('link')).toHaveLength(
        mockLinkedMedicalRecords.issues.length * 2 // 2 links per issue
      );

      // Header text
      expect(
        container.getElementsByClassName('MuiChip-label')[0]
      ).toHaveTextContent(mockLinkedMedicalRecords.issues.length);
      expect(
        screen.getByText(
          'Medical record(s) must be unlinked in order to proceed with event deletion'
        )
      ).toBeInTheDocument();

      // Mapped medical records content
      mockLinkedMedicalRecords.issues.forEach((linkedIssue, index) => {
        const issueType =
          linkedIssue.detailed_issues[0].issue_type === 'Injury'
            ? 'injuries'
            : 'illnesses';

        // Event link
        expect(
          screen.getByText(
            `${linkedIssue.detailed_event.name} - ${formatDate(
              linkedIssue.detailed_event.start_date
            )}`
          )
        ).toBeInTheDocument();
        expect(
          screen.getAllByRole('link')[index === 0 ? index : index + 1]
        ).toHaveAttribute(
          'href',
          `/planning_hub/events/${linkedIssue.detailed_event.id}`
        );

        // Issue link
        expect(
          screen.getByText(
            `${linkedIssue.detailed_issues[0].athlete_fullname} - ${formatDate(
              linkedIssue.detailed_issues[0].occurrence_date
            )} - ${linkedIssue.detailed_issues[0].full_pathology}`
          )
        ).toBeInTheDocument();
        expect(
          screen.getAllByRole('link')[index === 0 ? index + 1 : index + 2]
        ).toHaveAttribute(
          'href',
          `/medical/athletes/${linkedIssue.detailed_issues[0].athlete_id}/${issueType}/${linkedIssue.detailed_issues[0].id}`
        );
      });

      // Footer text
      expect(
        screen.getByText(
          'Please re-link the injury/illness to an appropriate event.'
        )
      ).toBeInTheDocument();
    });

    it('should display correct content when permission_granted is false', () => {
      const { container } = render(
        <EventDeletionPrompt
          {...mockProps}
          eventDeletionAttributes={mockLinkedMedicalRecordsWithoutPermission}
        />
      );

      expect(screen.getAllByRole('link')).toHaveLength(
        mockLinkedMedicalRecords.issues.length
      );

      // Header text
      expect(
        container.getElementsByClassName('MuiChip-label')[0]
      ).toHaveTextContent(mockLinkedMedicalRecords.issues.length);
      expect(
        screen.getByText(
          'Medical record(s) must be unlinked in order to proceed with event deletion'
        )
      ).toBeInTheDocument();

      // Mapped medical records content
      mockLinkedMedicalRecords.issues.forEach((linkedIssue, index) => {
        // Event link
        expect(
          screen.getByText(
            `${linkedIssue.detailed_event.name} - ${formatDate(
              linkedIssue.detailed_event.start_date
            )}`
          )
        ).toBeInTheDocument();
        expect(screen.getAllByRole('link')[index]).toHaveAttribute(
          'href',
          `/planning_hub/events/${linkedIssue.detailed_event.id}`
        );

        // Issue Link
        expect(
          screen.getAllByText('No permission. Contact Admin.')[index]
        ).toBeInTheDocument();
      });

      // Footer text
      expect(
        screen.getByText(
          'Please re-link the injury/illness to an appropriate event.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Linked CSV/API data', () => {
    it('should display correct content with links with correct href', () => {
      const { container } = render(
        <EventDeletionPrompt
          {...mockProps}
          eventDeletionAttributes={mockLinkedCSVData}
        />
      );

      expect(screen.getAllByRole('link')).toHaveLength(
        mockLinkedCSVData.imported_data.length * 2 // 2 links per issue
      );

      // Header text
      expect(
        container.getElementsByClassName('MuiChip-label')[0]
      ).toHaveTextContent(mockLinkedCSVData.imported_data.length);
      expect(
        screen.getByText('CSV/API data import(s) will be deleted')
      ).toBeInTheDocument();

      // Mapped CSV/API data content
      mockLinkedCSVData.imported_data.forEach((linkedData, index) => {
        // Event link
        expect(
          screen.getByText(
            `${linkedData.detailed_event.name} - ${formatDate(
              linkedData.detailed_event.start_date
            )}`
          )
        ).toBeInTheDocument();
        expect(
          screen.getAllByRole('link')[index === 0 ? index : index + 1]
        ).toHaveAttribute(
          'href',
          `/planning_hub/events/${linkedData.detailed_event.id}`
        );

        // Data link
        expect(
          screen.getByText(linkedData.detailed_imports[0].name)
        ).toBeInTheDocument();
        expect(
          screen.getAllByRole('link')[index === 0 ? index + 1 : index + 2]
        ).toHaveAttribute(
          'href',
          `/planning_hub/events/${linkedData.detailed_event.id}#imported_data`
        );
      });

      // Footer text
      expect(
        screen.getByText('Please re-import the data to the appropriate event.')
      ).toBeInTheDocument();
    });
  });

  describe('Linked assessments', () => {
    it('should display correct content with links with correct href', () => {
      const { container } = render(
        <EventDeletionPrompt
          {...mockProps}
          eventDeletionAttributes={mockLinkedAssessments}
        />
      );

      expect(screen.getAllByRole('link')).toHaveLength(
        mockLinkedAssessments.assessments.length * 2 // 2 links per issue
      );

      // Header text
      expect(
        container.getElementsByClassName('MuiChip-label')[0]
      ).toHaveTextContent(mockLinkedAssessments.assessments.length);
      expect(
        screen.getByText('Assessment(s) will be unlinked')
      ).toBeInTheDocument();

      // Mapped Assessment content
      mockLinkedAssessments.assessments.forEach((linkedAssessment, index) => {
        // Event link
        expect(
          screen.getByText(
            `${linkedAssessment.detailed_event.name} - ${formatDate(
              linkedAssessment.detailed_event.start_date
            )}`
          )
        ).toBeInTheDocument();
        expect(
          screen.getAllByRole('link')[index === 0 ? index : index + 1]
        ).toHaveAttribute(
          'href',
          `/planning_hub/events/${linkedAssessment.detailed_event.id}`
        );

        // Assessment link
        expect(
          screen.getByText(linkedAssessment.detailed_assessments[0].name)
        ).toBeInTheDocument();
        expect(
          screen.getAllByRole('link')[index === 0 ? index + 1 : index + 2]
        ).toHaveAttribute(
          'href',
          `/planning_hub/events/${linkedAssessment.detailed_event.id}#collection`
        );
      });

      // Footer text
      expect(
        screen.getByText(
          'Please re-link the assessments to an appropriate event.'
        )
      ).toBeInTheDocument();
    });
  });

  it('should display correct content when permission_granted is false', () => {
    const { container } = render(
      <EventDeletionPrompt
        {...mockProps}
        eventDeletionAttributes={mockLinkedAssessmentsWithoutPermission}
      />
    );

    expect(screen.getAllByRole('link')).toHaveLength(
      mockLinkedAssessmentsWithoutPermission.assessments.length // only 1 link as no permission
    );

    // Header text
    expect(
      container.getElementsByClassName('MuiChip-label')[0]
    ).toHaveTextContent(
      mockLinkedAssessmentsWithoutPermission.assessments.length
    );
    expect(
      screen.getByText('Assessment(s) will be unlinked')
    ).toBeInTheDocument();

    // Mapped Assessment content
    mockLinkedAssessmentsWithoutPermission.assessments.forEach(
      (linkedAssessment, index) => {
        // Event link
        expect(
          screen.getByText(
            `${linkedAssessment.detailed_event.name} - ${formatDate(
              linkedAssessment.detailed_event.start_date
            )}`
          )
        ).toBeInTheDocument();
        expect(
          screen.getAllByRole('link')[index === 0 ? index : index + 1]
        ).toHaveAttribute(
          'href',
          `/planning_hub/events/${linkedAssessment.detailed_event.id}`
        );

        // Assessment link
        expect(
          screen.getByText('No permission. Contact Admin.')
        ).toBeInTheDocument();
      }
    );

    // Footer text
    expect(
      screen.getByText(
        'Please re-link the assessments to an appropriate event.'
      )
    ).toBeInTheDocument();
  });
});
