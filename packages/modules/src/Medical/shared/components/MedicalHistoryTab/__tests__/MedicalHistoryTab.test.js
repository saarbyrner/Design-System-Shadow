import { render, screen, waitFor } from '@testing-library/react';
import { TestProviders } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import MedicalHistoryTab from '..';

const renderComponent = (component) => {
  return render(
    <TestProviders
      store={{
        addVaccinationSidePanel: {
          isOpen: false,
          initialInfo: {
            isAthleteSelectable: false,
          },
        },
        addTUESidePanel: {
          isOpen: false,
          initialInfo: {
            isAthleteSelectable: false,
          },
        },
        medicalHistory: {},
        medicalApi: {},
      }}
    >
      <MockedPermissionContextProvider
        permissionsContext={{
          permissions: {
            medical: {
              tue: {
                canView: true,
                canCreate: true,
              },
              vaccinations: {
                canView: true,
                canCreate: true,
              },
            },
          },
        }}
      >
        {component}
      </MockedPermissionContextProvider>
    </TestProviders>
  );
};

describe('<MedicalHistoryTab />', () => {
  it('renders correctly', async () => {
    window.setFlag('pm-show-tue', true);
    renderComponent(<MedicalHistoryTab athleteId={1234} />);

    await waitFor(() => {
      expect(screen.getByTestId('MedicalHistoryTab')).toBeInTheDocument();
      expect(screen.getByTestId('VaccinationsHistory')).toBeInTheDocument();
      expect(screen.getByTestId('TUEHistory')).toBeInTheDocument();
    }, 5000);
  });

  it('does not render TUEHistory when pm-show-tue flag is off', async () => {
    window.setFlag('pm-show-tue', false);
    renderComponent(<MedicalHistoryTab athleteId={1234} />);

    await waitFor(() => {
      expect(screen.getByTestId('MedicalHistoryTab')).toBeInTheDocument();
      expect(screen.getByTestId('VaccinationsHistory')).toBeInTheDocument();
      expect(screen.queryByTestId('TUEHistory')).not.toBeInTheDocument();
    }, 5000);
  });
});
