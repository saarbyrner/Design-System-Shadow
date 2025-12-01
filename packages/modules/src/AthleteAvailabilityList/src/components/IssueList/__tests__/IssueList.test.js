import { render, screen, within } from '@testing-library/react';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import athleteData from '@kitman/modules/src/AthleteAvailabilityList/utils/dummyAthleteData';
import injuryResponse from '@kitman/modules/src/AthleteAvailabilityList/utils//dummyInjuryResponse';
import illnessResponse from '@kitman/modules/src/AthleteAvailabilityList/utils/dummyIllnessResponse';

import IssueList from '..';

setI18n(i18n);

describe('Availability List IssueList component', () => {
  // include title_or_pathology in the mock data
  const mockInjuries = injuryResponse().map((injury) => {
    if (injury.osics.osics_pathology_id === 160) {
      return {
        ...injury,
        title_or_pathology: 'Abdominopelvic Structural abnormality',
      };
    }
    if (injury.osics.osics_pathology_id === 1099) {
      return { ...injury, title_or_pathology: 'Accessory bone foot' };
    }
    return injury;
  });

  const mockIllnesses = illnessResponse().map((illness) => {
    if (illness.osics.osics_pathology_id === 1671) {
      return { ...illness, title_or_pathology: '1st CMC joint instability' };
    }
    return illness;
  });

  const props = {
    athlete: {
      ...athleteData()[0],
      injuries: mockInjuries,
      illnesses: mockIllnesses,
    },
    injuryOsicsPathologies: [
      { id: 1168, name: 'Abdominopelvic Structural abnormality' },
      { id: 366, name: 'Accessory bone foot' },
    ],
    illnessOsicsPathologies: [
      { id: 1392, name: '1st CMC joint instability' },
      { id: 948, name: 'AC Joint contusion' },
    ],
    issueStatusOptions: [
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
    canManageIssues: true,
    canViewIssues: true,
    t: i18nextTranslateStub(),
  };

  it('renders', () => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={mockedDefaultPermissionsContextValue}
      >
        <IssueList {...props} />
      </MockedPermissionContextProvider>
    );
    expect(
      screen.getByText('Abdominopelvic Structural abnormality')
    ).toBeInTheDocument();
  });

  it('renders only unresolved issues', () => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={mockedDefaultPermissionsContextValue}
      >
        <IssueList {...props} />
      </MockedPermissionContextProvider>
    );
    expect(
      screen.getByText('Abdominopelvic Structural abnormality')
    ).toBeInTheDocument();
    expect(screen.getByText('Accessory bone foot')).toBeInTheDocument();
    expect(screen.getByText('1st CMC joint instability')).toBeInTheDocument();
    expect(screen.queryByText('AC Joint contusion')).not.toBeInTheDocument();
  });

  it('renders the Availability Label for issues causing unavailability', () => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={mockedDefaultPermissionsContextValue}
      >
        <IssueList {...props} />
      </MockedPermissionContextProvider>
    );

    const issueCausingUnavailabilityElement = screen
      .getByText('Abdominopelvic Structural abnormality')
      .closest('.availabilityIssueList__issue');
    const issueNotCausingUnavailabilityElement = screen
      .getByText('Accessory bone foot')
      .closest('.availabilityIssueList__issue');

    expect(
      within(issueCausingUnavailabilityElement).getByTestId(
        'unavailable-indicator'
      )
    ).toBeInTheDocument();
    expect(
      within(issueNotCausingUnavailabilityElement).queryByTestId(
        'unavailable-indicator'
      )
    ).not.toBeInTheDocument();
  });

  describe('when the user does not have manage issues or view issues permission', () => {
    beforeEach(() => {
      props.canManageIssues = false;
      props.canViewIssues = false;
    });

    afterEach(() => {
      props.canManageIssues = true;
      props.canViewIssues = true;
    });

    it('does not render issues', () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedDefaultPermissionsContextValue}
        >
          <IssueList {...props} />
        </MockedPermissionContextProvider>
      );
      expect(
        screen.queryByText('Abdominopelvic Structural abnormality')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Accessory bone foot')).not.toBeInTheDocument();
      expect(
        screen.queryByText('1st CMC joint instability')
      ).not.toBeInTheDocument();
    });
  });

  it('does not render EMR link for an injury', () => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={mockedDefaultPermissionsContextValue}
      >
        <IssueList {...props} />
      </MockedPermissionContextProvider>
    );
    expect(
      screen.getByText('Abdominopelvic Structural abnormality')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', {
        name: 'Abdominopelvic Structural abnormality',
      })
    ).not.toBeInTheDocument();
  });

  it('does not render EMR link for an illness', () => {
    render(
      <MockedPermissionContextProvider
        permissionsContext={mockedDefaultPermissionsContextValue}
      >
        <IssueList {...props} />
      </MockedPermissionContextProvider>
    );
    expect(screen.getByText('1st CMC joint instability')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: '1st CMC joint instability' })
    ).not.toBeInTheDocument();
  });
});
