import { render, screen } from '@testing-library/react';
import {
  expect, // Keep Jest expect
} from '@jest/globals';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AppHeader from '../index';

describe('<AppHeader />', () => {
  const defaultPermissions = DEFAULT_CONTEXT_VALUE.permissions.medical;

  const props = {
    diagnosticType: 'MRI',
    athleteData: { id: 1, ...mockAthleteData },
    t: i18nextTranslateStub(), // Use the preferred translation stub
  };

  // Helper function to render with specific permissions and props
  const renderWithPermissions = (permissions, testProps = props) => {
    const mockedPermissionsContextValue = {
      permissions: {
        medical: {
          ...defaultPermissions,
          ...permissions,
        },
      },
      permissionsRequestStatus: 'FAILURE', // Assuming this status is fine for these tests
    };

    return render(
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <AppHeader {...testProps} />
      </MockedPermissionContextProvider>
    );
  };

  describe('default permissions', () => {
    it('renders the correct content', () => {
      render(<AppHeader {...props} />);

      // Back navigation link
      const backNavigation = screen.getByRole('link', { name: /back/i });
      expect(backNavigation).toHaveTextContent('Back');
      expect(backNavigation).toHaveAttribute('href', '#');

      // Athlete avatar image
      const athleteAvatar = screen.getByRole('img', {
        alt: /John Doe/i,
      });
      expect(athleteAvatar).toHaveAttribute(
        'src',
        'https://kitman-staging.imgix.net/avatar.jpg'
      );

      // Athlete name and diagnostic type
      // Using getByText with a regex to match the combined text
      const athleteName = screen.getByText(
        `John Doe - ${props.diagnosticType}`
      );
      expect(athleteName).toBeInTheDocument(); // Just check presence, text content is verified by the query

      // Athlete allergies (should not be present by default)
      // Using queryByTestId to check for absence
      const athleteAllergy = screen.queryByTestId('TextTag');
      expect(athleteAllergy).not.toBeInTheDocument();
    });
  });

  describe('[permissions] permissions.medical.allergies.canView', () => {
    // Modify props for this describe block to include allergies
    const propsWithAllergies = {
      ...props,
      athleteData: {
        ...props.athleteData,
        allergies: [
          {
            id: 21,
            display_name: 'Ibuprofen allergy',
            severity: 'mild',
          },
          {
            id: 87,
            display_name: 'Peanut allergy',
            severity: 'severe',
          },
        ],
      },
    };

    it('renders the correct content', () => {
      renderWithPermissions(
        {
          // Permissions object
          issues: { canEdit: true },
          allergies: {
            canView: true,
          },
        },
        propsWithAllergies // Pass propsWithAllergies here
      );

      // Athlete allergies (should be present with permission)
      // Using getAllByTestId to find all allergy tags
      const athleteAllergies = screen.getAllByTestId('TextTag');
      expect(athleteAllergies).toHaveLength(2); // Expecting two allergy tags

      // Check the text content of the allergy tags
      expect(athleteAllergies[0]).toHaveTextContent('Ibuprofen allergy');
      expect(athleteAllergies[1]).toHaveTextContent('Peanut allergy');
    });
  });
});
