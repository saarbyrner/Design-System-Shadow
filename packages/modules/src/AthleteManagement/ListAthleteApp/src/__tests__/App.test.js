import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetPermissionsQuery,
  useFetchOrganisationPreferenceQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import ListAthletesApp from '../App';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
  useFetchOrganisationPreferenceQuery: jest.fn(),
}));
setI18n(i18n);
const i18nT = i18nextTranslateStub();

const props = {
  isAssociationAdmin: false,
  isLeagueStaffUser: true,
  activeSquad: null,
  t: i18nT,
};

describe('<ListAthletesApp/>', () => {
  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        settings: {
          canCreateImports: false,
          canViewSettingsQuestionnaire: false,
        },
        general: {
          canManageAbsence: false,
        },
        userMovement: {
          player: {
            medicalTrial: false,
            trade: false,
          },
        },
      },
    });

    useFetchOrganisationPreferenceQuery.mockReturnValue({
      data: {
        value: false,
      },
    });
  });
  describe('Club level', () => {
    it('renders at a club level', async () => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = false;
      renderWithProviders(<ListAthletesApp {...props} />);
      expect(
        screen.getByRole('heading', {
          level: 6,
          name: /Manage Athletes/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'New Athlete' })
      ).toBeInTheDocument();
    });
  });
  describe('League level', () => {
    it('renders at a league level', async () => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = true;
      renderWithProviders(<ListAthletesApp {...props} isAssociationAdmin />);
      expect(
        screen.getByRole('heading', {
          level: 6,
          name: /Manage Athletes/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe('ExportMenu', () => {
    const insuranceDetailsButtonText = 'Insurance Details (.csv)';
    const getDownloadButton = () =>
      screen.getByRole('button', { name: 'Download' });

    const clickOnDownloadButton = async (user) => {
      const downloadButton = getDownloadButton();

      expect(downloadButton).toBeInTheDocument();

      await user.click(downloadButton);
    };

    beforeEach(() => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          general: {},
          settings: {
            canRunLeagueExports: true,
            canViewSettingsAthletes: true,
          },
        },
      });
    });

    afterEach(() => {
      window.featureFlags['form-based-athlete-profile'] = false;
    });

    it('shows the download button when the correct permissions are enabled', () => {
      renderWithProviders(<ListAthletesApp {...props} />);

      const downloadButton = getDownloadButton();

      expect(downloadButton).toBeInTheDocument();

      fireEvent.click(downloadButton);

      expect(
        screen.getByRole('button', { name: 'Registration Player Export' })
      ).toBeInTheDocument();
    });

    describe('when form-based-athlete-profile FF is true', () => {
      beforeEach(() => {
        window.featureFlags['form-based-athlete-profile'] = true;
      });

      afterEach(() => {
        window.featureFlags['form-based-athlete-profile'] = false;
      });

      describe('Athlete Profile', () => {
        it('shows the Athlete Profile button when canViewSettingsAthletes permission is true', async () => {
          useGetPermissionsQuery.mockReturnValue({
            data: {
              general: {},
              settings: {
                canRunLeagueExports: true,
                canViewSettingsAthletes: true,
              },
            },
          });

          const user = userEvent.setup();

          renderWithProviders(<ListAthletesApp {...props} />);

          await clickOnDownloadButton(user);

          expect(
            screen.getByRole('button', { name: 'Athlete Profile' })
          ).toBeInTheDocument();
        });

        it('hide the Athlete Profile button when canViewSettingsAthletes permission is false', async () => {
          useGetPermissionsQuery.mockReturnValue({
            data: {
              general: {},
              settings: {
                canRunLeagueExports: true,
                canViewSettingsAthletes: false,
              },
            },
          });
          // This FF is on to show the button and validate the Athlete Details export is not an option

          const user = userEvent.setup();

          renderWithProviders(<ListAthletesApp {...props} />);

          await clickOnDownloadButton(user);

          expect(
            screen.queryByRole('button', { name: 'Athlete Profile' })
          ).not.toBeInTheDocument();
        });
      });

      it('does not show the export insurance button when the user does not have permissions', async () => {
        const user = userEvent.setup();
        renderWithProviders(<ListAthletesApp {...props} />);

        useGetPermissionsQuery.mockReturnValue({
          data: {
            general: {},
            settings: {
              canViewSettingsInsurancePolicies: false,
            },
          },
        });

        await clickOnDownloadButton(user);

        expect(
          screen.queryByRole('button', { name: insuranceDetailsButtonText })
        ).not.toBeInTheDocument();
      });

      it('does not show the export insurance button when the FF is off', async () => {
        const user = userEvent.setup();
        renderWithProviders(<ListAthletesApp {...props} />);

        await clickOnDownloadButton(user);

        expect(
          screen.queryByRole('button', { name: insuranceDetailsButtonText })
        ).not.toBeInTheDocument();
      });
    });

    describe('when export-insurance-details FF is true', () => {
      beforeEach(() => {
        window.featureFlags['export-insurance-details'] = true;
      });

      afterEach(() => {
        window.featureFlags['export-insurance-details'] = false;
      });

      it('shows the export insurance button when the FF is on and the user has permissions', async () => {
        useGetPermissionsQuery.mockReturnValue({
          data: {
            general: {},
            settings: {
              canViewSettingsInsurancePolicies: true,
            },
          },
        });
        const user = userEvent.setup();
        renderWithProviders(<ListAthletesApp {...props} />);

        await clickOnDownloadButton(user);

        expect(
          screen.getByRole('button', { name: insuranceDetailsButtonText })
        ).toBeInTheDocument();
      });

      it('does not show the export insurance button when the FF is on but the user does not have permissions', async () => {
        // Need this, otherwise there won't be any menu items -> no Download button ->
        // can't check the export button isn't there (according to permissions)
        useGetPermissionsQuery.mockReturnValue({
          data: {
            general: {},
            settings: {
              canRunLeagueExports: true,
              canViewSettingsInsurancePolicies: false,
            },
          },
        });
        const user = userEvent.setup();
        renderWithProviders(<ListAthletesApp {...props} />);

        await clickOnDownloadButton(user);

        expect(
          screen.queryByRole('button', { name: insuranceDetailsButtonText })
        ).not.toBeInTheDocument();
      });
    });

    it('hides the download button when permissions checks are not met', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          general: {},
          settings: {
            canRunLeagueExports: false,
          },
        },
      });
      renderWithProviders(<ListAthletesApp {...props} />);

      expect(
        screen.queryByRole('button', { name: 'Download' })
      ).not.toBeInTheDocument();
    });
  });
});
