import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import sinon from 'sinon';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import AllergiesTab from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
  addAllergySidePanel: {
    isOpen: true,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addMedicalAlertSidePanel: {
    isOpen: true,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  medicalHistory: {},
});

describe('<AllergiesTab/>', () => {
  const dispatchSpy = sinon.spy();

  beforeEach(() => {
    window.featureFlags['medical-alerts-side-panel'] = true;

    i18nextTranslateStub();
    storeFake({
      medicalApi: {},
      medicalHistory: {},
    });
    store.dispatch = dispatchSpy;
  });

  const props = {
    allergies: [
      {
        id: 8,
        athlete_id: 80524,
        athlete: {
          id: 80524,
          firstname: 'Daniel Athlete',
          lastname: 'Athlete',
          fullname: 'Athlete, Daniel Athlete',
          shortname: 'D Athlete',
          availability: 'unavailable',
          position: 'Loose-head Prop',
        },
        display_name: 'Aprodine',
        allergen_type: 'DrfirstDrug',
        allergen: {
          rcopia_id: '2630',
          name: 'Aprodine',
          groups: [
            { group_id: '11726', name: 'Sympathomimetic Agents' },
            { group_id: '11266', name: 'Antihistamines' },
            { group_id: '1170', name: 'Antihistamines - Alkylamine' },
            { group_id: '298', name: 'Ephedrine Analogues' },
          ],
        },
        name: '',
        ever_been_hospitalised: false,
        require_epinephrine: true,
        symptoms: 'Sore foot, head, toes, ears and eyes.',
        severity: 'severe',
        restricted_to_doc: false,
        restricted_to_psych: false,
        diagnosed_on: null,
      },
      {
        id: 10,
        athlete_id: 80524,
        athlete: {
          id: 80524,
          firstname: 'Daniel Athlete',
          lastname: 'Athlete',
          fullname: 'Athlete, Daniel Athlete',
          shortname: 'D Athlete',
          availability: 'unavailable',
          position: 'Loose-head Prop',
        },
        display_name: 'ACAM2000 (National Stockpile)',
        allergen_type: 'DrfirstDrug',
        allergen: {
          rcopia_id: '13100000112249',
          name: 'ACAM2000 (National Stockpile)',
          groups: [
            { group_id: '11584', name: 'Viral And Tumor Causing Vaccines' },
            { group_id: '1122', name: 'Smallpox Vaccines' },
          ],
        },
        name: '',
        ever_been_hospitalised: false,
        require_epinephrine: false,
        symptoms: 'Sample symptoms might go here.',
        severity: 'moderate',
        restricted_to_doc: false,
        restricted_to_psych: false,
        diagnosed_on: '2022-10-25',
      },
    ],
    next_id: 1,
  };

  describe('rendering content', () => {
    it('renders Allergies tab & filters by default', () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                allergies: {
                  canView: true,
                },
                alerts: {
                  canView: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <AllergiesTab {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      expect(
        screen.getByTestId('AllergiesFilter|FilterContainer')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AllergiesFilter|Severity')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AllergiesFilter|Position')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AllergiesFilter|Category')
      ).toBeInTheDocument();

      // Two search/squad filters exist, one for large screens, one for mobile devices. 1st is desktop/large screens
      const searchInputs = screen.getAllByTestId('AllergiesFilter|Search');
      expect(searchInputs).toHaveLength(2);
      expect(searchInputs[0]).toBeInTheDocument();

      const squadSelects = screen.getAllByTestId('AllergiesFilter|Squad');
      expect(squadSelects).toHaveLength(2);
      expect(squadSelects[0]).toBeInTheDocument();
    });
  });
});
