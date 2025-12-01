import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { mockPastAthlete } from '../../../../mocks/mockData';
import AllergyAlertSection from '../index';

const mockAthlete = {
  ...mockPastAthlete,
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
  athlete_medical_alerts: [
    {
      display_name: 'Fabior 0.1 % topical foam',
      type: 'DrFirst',
    },
  ],
};

describe('<AllergyAlertSection />', () => {
  const props = {
    athleteData: {},
    t: i18nextTranslateStub(),
  };

  describe('checks feature flags show allergies/alerts section', () => {
    beforeEach(() => {
      window.featureFlags['medical-alerts-side-panel'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-alerts-side-panel'] = false;
    });
    it('hides allergies and alerts section form if feature flags are false', async () => {
      act(() => {
        render(
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  allergies: {
                    canViewNewAllergy: true,
                  },
                  alerts: {
                    canView: true,
                  },
                },
              },
            }}
          >
            <AllergyAlertSection {...props} athleteData={mockAthlete} />
          </MockedPermissionContextProvider>
        );
      });
      expect(
        screen.getByTestId('AddMedicationSidePanel|AllergiesSection')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddMedicationSidePanel|AlertsSection')
      ).toBeInTheDocument();
    });
  });
  describe('checks feature flags hides allergies/alerts section', () => {
    beforeEach(() => {
      window.featureFlags['medical-alerts-side-panel'] = false;
    });
    it('hides allergies and alerts section form if feature flags are false', async () => {
      act(() => {
        render(
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  allergies: {
                    canViewNewAllergy: false,
                  },
                  alerts: {
                    canView: false,
                  },
                },
              },
            }}
          >
            <AllergyAlertSection {...props} athleteData={mockAthlete} />
          </MockedPermissionContextProvider>
        );
      });
      expect(
        screen.queryByTestId('AddMedicationSidePanel|AllergiesSection')
      ).not.toBeInTheDocument();
    });
  });
});
