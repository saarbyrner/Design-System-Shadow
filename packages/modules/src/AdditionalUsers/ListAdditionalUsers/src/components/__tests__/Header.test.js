import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { openMassUploadModal } from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';

import AdditionalUsersHeader from '../Header';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock(
  '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice',
  () => ({
    openMassUploadModal: jest.fn(),
  })
);
jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock(
  '@kitman/modules/src/AdditionalUsers/ListAdditionalUsers/src/components/AdditionalUsersCSVImporter',
  () => () => <div />
);

const props = {
  t: i18nextTranslateStub(),
};

const renderComponent = ({
  canCreateImports = true,
  canManageOfficials = true,
  canManageScouts = true,
  canManageMatchDirectors = true,
  canManageMatchMonitors = true,
} = {}) => {
  usePermissions.mockReturnValue({
    permissions: {
      settings: {
        canCreateImports,
        canManageOfficials,
        canManageScouts,
        canManageMatchDirectors,
        canManageMatchMonitors,
      },
    },
  });
  const { mockedStore } = renderWithRedux(
    <AdditionalUsersHeader {...props} />,
    {
      useGlobalStore: false,
      preloadedState: {},
    }
  );

  return mockedStore;
};

describe('<AdditionalUsersHeader />', () => {
  beforeEach(() => {
    window.featureFlags['league-ops-mass-create-athlete-staff'] = true;
  });

  it('renders the additional users title', () => {
    renderComponent();
    expect(screen.getByText('Manage Additional Users')).toBeInTheDocument();
  });

  describe('user can create imports', () => {
    it('renders the import and download buttons', () => {
      renderComponent();

      expect(
        screen.getByRole('button', { name: 'Create new user' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Upload users' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Download csv' })
      ).toBeInTheDocument();
    });

    it('should take user to create official form when create official is clicked', async () => {
      const mockLocationAssign = jest.fn();
      jest.mocked(useLocationAssign).mockReturnValue(mockLocationAssign);

      renderComponent();

      expect(
        screen.getByRole('button', { name: 'Create new user' })
      ).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Create new user' })
      );
      expect(screen.getByText('Create official')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Create official'));
      expect(mockLocationAssign).toHaveBeenCalledWith(
        '/administration/additional_users/official/new'
      );
    });

    it('should take user to create scout form when create scout is clicked', async () => {
      const mockLocationAssign = jest.fn();
      jest.mocked(useLocationAssign).mockReturnValue(mockLocationAssign);

      renderComponent();

      expect(
        screen.getByRole('button', { name: 'Create new user' })
      ).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Create new user' })
      );
      expect(screen.getByText('Create scout')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Create scout'));
      expect(mockLocationAssign).toHaveBeenCalledWith(
        '/administration/additional_users/scout/new'
      );
    });

    it('should take user to create match director form when create scout is clicked', async () => {
      const mockLocationAssign = jest.fn();
      jest.mocked(useLocationAssign).mockReturnValue(mockLocationAssign);

      renderComponent();

      expect(
        screen.getByRole('button', { name: 'Create new user' })
      ).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Create new user' })
      );
      expect(screen.getByText('Create match director')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Create match director'));
      expect(mockLocationAssign).toHaveBeenCalledWith(
        '/administration/additional_users/match_director/new'
      );
    });
  });

  it('should call openMassUploadModal when upload officials is clicked', async () => {
    renderComponent();

    expect(
      screen.getByRole('button', { name: 'Upload users' })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Upload users' }));
    expect(screen.getByText('Upload officials')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Upload officials'));
    expect(openMassUploadModal).toHaveBeenCalled();
  });

  it('should call openMassUploadModal when upload scouts is clicked', async () => {
    renderComponent();

    expect(
      screen.getByRole('button', { name: 'Upload users' })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Upload users' }));
    expect(screen.getByText('Upload scouts')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Upload scouts'));
    expect(openMassUploadModal).toHaveBeenCalled();
  });

  it('should trigger CSV download for officials when download officials csv is clicked', async () => {
    global.open = jest.fn();
    renderComponent();
    expect(
      screen.getByRole('button', { name: 'Download csv' })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Download csv' }));
    expect(screen.getByText('Download officials csv')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Download officials csv'));
    expect(global.open).toHaveBeenCalledWith(
      'https://kitman.imgix.net/kitman/official_mass_importer.csv'
    );
  });

  it('should trigger CSV download for scouts when download officials csv is clicked', async () => {
    global.open = jest.fn();
    renderComponent();
    expect(
      screen.getByRole('button', { name: 'Download csv' })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Download csv' }));
    expect(screen.getByText('Download scouts csv')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Download scouts csv'));
    expect(global.open).toHaveBeenCalledWith(
      'https://kitman.imgix.net/kitman/scout_mass_importer.csv'
    );
  });

  it('should trigger CSV download for match monitor when download monitor csv is clicked', async () => {
    global.open = jest.fn();
    const user = userEvent.setup();
    renderComponent();
    expect(
      screen.getByRole('button', { name: 'Download csv' })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Download csv' }));
    expect(screen.getByText('Download match monitor csv')).toBeInTheDocument();
    await user.click(screen.getByText('Download match monitor csv'));
    expect(global.open).toHaveBeenCalledWith(
      'https://kitman.imgix.net/kitman/match_monitor_mass_importer.csv'
    );
  });

  it('should not render the create new Match Director button when the user does not have permission', async () => {
    const user = userEvent.setup();

    renderComponent({
      canManageMatchDirectors: false,
    });

    await user.click(screen.getByRole('button', { name: 'Create new user' }));
    expect(screen.queryByText('Create match director')).not.toBeInTheDocument();
  });

  it('should not render the create scout, Upload scouts and Download scouts csv buttons when the user does not have permission', async () => {
    const user = userEvent.setup();

    renderComponent({
      canManageScouts: false,
    });

    await user.click(screen.getByRole('button', { name: 'Create new user' }));
    expect(screen.queryByText('Create scout')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Upload users' }));
    expect(screen.queryByText('Upload scouts')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Download csv' }));
    expect(screen.queryByText('Download scouts csv')).not.toBeInTheDocument();
  });

  it('should not render the create official, Upload officials and Download officials csv buttons when the user does not have permission', async () => {
    const user = userEvent.setup();

    renderComponent({
      canManageOfficials: false,
    });

    await user.click(screen.getByRole('button', { name: 'Create new user' }));
    expect(screen.queryByText('Create official')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Upload users' }));
    expect(screen.queryByText('Upload officials')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Download csv' }));
    expect(
      screen.queryByText('Download officials csv')
    ).not.toBeInTheDocument();
  });

  describe('user cannot create imports', () => {
    it('renders only the create new user button', () => {
      renderComponent({
        canCreateImports: false,
      });

      expect(
        screen.getByRole('button', { name: 'Create new user' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Upload users' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Download csv' })
      ).not.toBeInTheDocument();
    });
  });
});
