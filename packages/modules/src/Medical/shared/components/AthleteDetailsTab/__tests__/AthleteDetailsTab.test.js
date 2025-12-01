import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import AthleteDetailsTab from '../index';

const mockedPermissionsContextValue = {
  permissions: {
    settings: {
      ...DEFAULT_CONTEXT_VALUE.permissions.settings,
      canViewSettingsInsurancePolicies: true,
      canViewSettingsEmergencyContacts: true,
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

const mockedAddresses = [
  {
    line1: '10 bothar na tra',
    line2: 'line2',
    line3: 'line3',
    city: 'dublin',
    state: 'dublin state',
    country: 'Ireland',
  },
  {
    line1: '22 seaview park',
    line2: 'line2',
    line3: 'line3',
    city: 'kerry',
    state: 'kerry state',
    country: 'Ireland',
  },
  {
    line1: 'The Oak',
    line2: 'Queenstate',
    line3: '',
    city: 'Athlone',
    state: '',
    country: 'Ireland',
  },
];

const mockedEmergencyContacts = [
  {
    id: 1,
    firstname: 'fredward jones bones',
    lastname: 'jr',
    contact_relation: 'sibling',
    email: 'gdfsa56@hmotmail.com',
    phone_numbers: [
      {
        country: 'IE',
        number: '085 240 5553',
        number_international: '+353 85 240 5553',
        number_international_e164: '+353852405553',
        type: null,
      },
      {
        country: 'IE',
        number: '087 654 3211',
        number_international: '+353 87 654 3211',
        number_international_e164: '+353876543211',
        type: null,
      },
    ],
  },
];

describe('<AthleteDetailsTab />', () => {
  describe('when the athlete-details-in-performance-medicine flag is on', () => {
    const props = {
      reloadData: false,
      athleteId: 40211,
      athleteData: {
        id: 40211,
        fullname: 'Albornoz Tomas',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        date_of_birth: null,
        age: null,
        height: null,
        country: 'Ireland',
        squad_names: [
          {
            id: 8,
            name: 'International Squad (Primary)',
          },
        ],
        allergy_names: ['Default Allergy', 'Asthma'],
        position_group_id: 25,
        position_group: 'Forward',
        position_id: 73,
        position: 'Second Row',
        availability: 'unavailable',
        unresolved_issues_count: 8,
      },

      t: i18nextTranslateStub(),
    };

    beforeEach(() => {
      window.featureFlags['athlete-details-in-performance-medicine'] = true;
    });

    afterEach(() => {
      window.featureFlags['athlete-details-in-performance-medicine'] = false;
    });

    it('renderes the loader when the request is pending', () => {
      render(
        <AthleteDetailsTab {...props} athleteDataRequestStatus="PENDING" />
      );

      const loader = screen.getByTestId(/AthleteDetailsLoader|lineLoader/i);
      expect(loader).toBeInTheDocument();
    });

    it('renderes the title when the request is done', () => {
      render(
        <AthleteDetailsTab {...props} athleteDataRequestStatus="SUCCESS" />
      );
      expect(screen.getByText(/Athlete details/i)).toBeInTheDocument();
    });

    it('renderes multiple addresses when receives more than one value for addresses', () => {
      render(
        <AthleteDetailsTab
          {...props}
          athleteData={{
            ...props.athleteData,
            addresses: mockedAddresses,
          }}
        />
      );
      const adresses = screen.getAllByText(/Address/i);
      expect(adresses).toHaveLength(3);
    });

    describe('when the athlete-insurance-details flag is on', () => {
      beforeEach(() => {
        window.featureFlags['athlete-insurance-details'] = true;
      });

      afterEach(() => {
        window.featureFlags['athlete-insurance-details'] = false;
      });

      describe('when canViewSettingsInsurancePolicies permission is true', () => {
        it('renderes the correct content when there are policies', () => {
          render(
            <MockedPermissionContextProvider
              permissionsContext={mockedPermissionsContextValue}
            >
              <AthleteDetailsTab
                {...props}
                athleteData={{
                  ...props.athleteData,
                  insurance_policies: [
                    {
                      attachments: [],
                      deductible_currency: 'USD',
                      group_number: '77',
                      id: 1,
                      policy_number: '454',
                      policy_type: 'hmo',
                      provider: 'fake provider',
                    },
                  ],
                }}
              />
            </MockedPermissionContextProvider>
          );
          const SideBarElement = screen.getByText('Insurance');
          expect(SideBarElement).toBeInTheDocument();
        });
      });
    });

    describe('when canViewSettingsEmergencyContacts permission is true', () => {
      it('renderes the correct content when there are emergency contacts', () => {
        render(
          <MockedPermissionContextProvider
            permissionsContext={mockedPermissionsContextValue}
          >
            <AthleteDetailsTab
              {...props}
              athleteData={{
                ...props.athleteData,
                emergency_contacts: mockedEmergencyContacts,
              }}
            />
          </MockedPermissionContextProvider>
        );
        const contactSection = screen.getByText(
          /Emergency contact information/i
        );
        expect(contactSection).toBeInTheDocument();
      });
    });
  });
});
