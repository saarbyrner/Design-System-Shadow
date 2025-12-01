import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import * as PermissionsContext from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import ExportMenu from '../index';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

const i18nT = i18nextTranslateStub();

const props = {
  t: i18nT,
};

describe('<ExportMenu />', () => {
  const canRunLeagueExportsTrue = {
    permissions: {
      settings: {
        canRunLeagueExports: true,
      },
    },
  };

  useLeagueOperations.mockReturnValue({
    isLeague: true,
  });

  usePreferences.mockReturnValue({
    preferences: {
      manage_league_game: true,
    },
  });

  describe('[FEATURE FLAG] league-ops-governance-export', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-governance-export'] = true;

      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(canRunLeagueExportsTrue);
    });

    afterEach(() => {
      window.featureFlags['league-ops-governance-export'] = false;
      jest.clearAllMocks();
    });

    it('renders the governance export option when true', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ExportMenu {...props} />);
      const downloadButton = screen.getByText('Download');

      expect(screen.getByText('Download')).toBeInTheDocument();

      await user.click(downloadButton);
      expect(screen.getByText('Governance Export')).toBeInTheDocument();
      expect(screen.queryByText('Yellow Card Export')).not.toBeInTheDocument();
      expect(screen.queryByText('Red Card Export')).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] league-ops-cards-export', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-cards-export'] = true;

      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(canRunLeagueExportsTrue);
    });

    afterEach(() => {
      window.featureFlags['league-ops-cards-export'] = false;
      jest.clearAllMocks();
    });

    it('renders the governance export option when true', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ExportMenu {...props} />);
      const downloadButton = screen.getByText('Download');

      expect(screen.getByText('Download')).toBeInTheDocument();

      await user.click(downloadButton);
      expect(screen.getByText('Yellow Card Export')).toBeInTheDocument();
      expect(screen.getByText('Red Card Export')).toBeInTheDocument();

      expect(screen.queryByText('Governance Export')).not.toBeInTheDocument();
    });
  });

  describe('[PERMISSION] league-ops-match-report-export', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('renders the match report export option when true', async () => {
      const user = userEvent.setup();
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          settings: {
            canRunLeagueExports: true,
          },
        },
      });
      renderWithProviders(<ExportMenu {...props} />);
      const downloadButton = screen.getByRole('button', { name: 'Download' });
      await user.click(downloadButton);
      expect(screen.getByText('Match Report Export')).toBeInTheDocument();
    });

    it('does not render the match report export option when false', async () => {
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          settings: {
            canRunLeagueExports: false,
          },
        },
      });
      renderWithProviders(<ExportMenu {...props} />);
      const downloadButton = screen.queryByRole('button', { name: 'Download' });
      expect(downloadButton).not.toBeInTheDocument();
    });
  });

  describe('[PERMISSION] canRunLeagueExports', () => {
    beforeEach(() => {
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          settings: {
            canRunLeagueExports: false,
          },
        },
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('does not render when false', async () => {
      renderWithProviders(<ExportMenu {...props} />);
      expect(() => screen.getByText('Download')).toThrow();
    });
  });

  describe('No FF render and no permissions', () => {
    it('does not render the download button as there are no options', async () => {
      renderWithProviders(<ExportMenu {...props} />);
      expect(screen.queryByText('Download')).not.toBeInTheDocument();
    });
  });

  describe('[PERMISSION] scout-access-export', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('renders the scout export option when true', async () => {
      const user = userEvent.setup();
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          scoutAccessManagement: {
            canExportScout: true,
          },
          settings: {
            canRunLeagueExports: false,
          },
        },
      });
      renderWithProviders(<ExportMenu {...props} />);
      const downloadButton = screen.getByRole('button', { name: 'Download' });
      await user.click(downloadButton);
      expect(
        screen.getByText('Visiting scout attendees export')
      ).toBeInTheDocument();
    });

    it('renders the scout attendees export option when true', async () => {
      const user = userEvent.setup();
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          scoutAccessManagement: {
            canExportScout: true,
          },
          settings: {
            canRunLeagueExports: false,
          },
        },
      });
      renderWithProviders(<ExportMenu {...props} />);
      const downloadButton = screen.getByRole('button', { name: 'Download' });
      await user.click(downloadButton);
      expect(
        screen.getByText('Internal scout schedule export')
      ).toBeInTheDocument();
    });

    it('does not renders the scout export option when false', async () => {
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          scoutAccessManagement: {
            canExportScout: false,
          },
          settings: {
            canRunLeagueExports: false,
          },
        },
      });
      renderWithProviders(<ExportMenu {...props} />);
      const downloadButton = screen.queryByRole('button', { name: 'Download' });
      expect(downloadButton).not.toBeInTheDocument();
    });

    describe('Fixtures mass upload', () => {
      beforeEach(() => {
        window.featureFlags = { 'league-game-mass-game-upload': true };
        jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
          permissions: {
            settings: {
              canRunLeagueExports: true,
              canCreateImports: true,
            },
            leagueGame: {
              manageGameInformation: true,
            },
          },
        });
      });

      afterEach(() => {
        jest.clearAllMocks();
        window.featureFlags = {};
      });

      it('renders download CSV template button when user has correct permissions', async () => {
        const user = userEvent.setup();
        renderWithProviders(<ExportMenu {...props} />);
        const downloadButton = screen.getByRole('button', { name: 'Download' });
        await user.click(downloadButton);
        expect(screen.getByText('Game template csv')).toBeInTheDocument();
      });
    });
  });

  describe('[PERMISSION] matchMonitorReportExport', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-match-monitor-v3'] = true;
    });

    afterEach(() => {
      window.featureFlags['league-ops-match-monitor-v3'] = false;
      jest.clearAllMocks();
    });

    it('renders the match monitor export option when is true', async () => {
      const user = userEvent.setup();
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          settings: {
            canRunLeagueExports: true,
          },
          matchMonitor: {
            matchMonitorReportExport: true,
          },
        },
      });
      renderWithProviders(<ExportMenu {...props} />);
      const downloadButton = screen.getByRole('button', { name: 'Download' });
      await user.click(downloadButton);
      expect(screen.getByText('Match Monitor Export')).toBeInTheDocument();
    });

    it('does not renders the match monitor export option when false', async () => {
      const user = userEvent.setup();
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          settings: {
            canRunLeagueExports: true,
          },
          matchMonitor: {
            matchMonitorReportExport: false,
          },
        },
      });
      renderWithProviders(<ExportMenu {...props} />);
      const downloadButton = screen.getByRole('button', { name: 'Download' });
      await user.click(downloadButton);
      expect(
        screen.queryByText('Match Monitor Export')
      ).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] league-ops-match-monitor-v3', () => {
    describe('Flag is false', () => {
      it('does not render the match monitor option', async () => {
        const user = userEvent.setup();
        jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
          permissions: {
            settings: {
              canRunLeagueExports: true,
            },
            matchMonitor: {
              matchMonitorReportExport: true,
            },
          },
        });
        renderWithProviders(<ExportMenu {...props} />);
        const downloadButton = screen.getByRole('button', { name: 'Download' });
        await user.click(downloadButton);
        expect(
          screen.queryByText('Match Monitor Export')
        ).not.toBeInTheDocument();
      });
    });
    describe('Flag is true', () => {
      beforeEach(() => {
        window.featureFlags['league-ops-match-monitor-v3'] = true;
      });

      afterEach(() => {
        window.featureFlags['league-ops-match-monitor-v3'] = false;
        jest.clearAllMocks();
      });

      it('renders the match monitor option', async () => {
        const user = userEvent.setup();
        jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
          permissions: {
            settings: {
              canRunLeagueExports: true,
            },
            matchMonitor: {
              matchMonitorReportExport: true,
            },
          },
        });
        renderWithProviders(<ExportMenu {...props} />);
        const downloadButton = screen.getByRole('button', { name: 'Download' });
        await user.click(downloadButton);
        expect(screen.getByText('Match Monitor Export')).toBeInTheDocument();
      });
    });
  });
});
