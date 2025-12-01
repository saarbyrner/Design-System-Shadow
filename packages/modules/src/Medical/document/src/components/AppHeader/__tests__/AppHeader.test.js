import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import * as useHistoryGoModule from '@kitman/common/src/hooks/useHistoryGo';
import AppHeader from '@kitman/modules/src/Medical/document/src/components/AppHeader';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

const mockHistoryGo = jest.fn();
jest.mock('@kitman/common/src/hooks/useEventTracking');

const defaultProps = {
  athleteData: mockAthleteData,
  onExportAthleteIssuesData: jest.fn(),
  t: i18nextTranslateStub(),
};

const renderComponent = ({
  props = defaultProps,
  permissions = mockedDefaultPermissionsContextValue,
} = {}) =>
  renderWithUserEventSetup(
    <MockedPermissionContextProvider permissionsContext={permissions}>
      <AppHeader {...props} />
    </MockedPermissionContextProvider>
  );

describe('<AppHeader />', () => {
  const trackEventMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(useHistoryGoModule, 'default').mockReturnValue(mockHistoryGo);
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  describe('default permissions', () => {
    it('renders the correct content', async () => {
      renderComponent();

      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'https://kitman-staging.imgix.net/avatar.jpg'
      );

      expect(
        screen.getByText(defaultProps.athleteData.fullname)
      ).toBeInTheDocument();

      [
        'Date of birth',
        'Age',
        'Country',
        'Status',
        'Positions',
        'Team',
        'Open injury/ illness',
      ].forEach((heading) =>
        expect(
          screen.getByRole('heading', { name: heading, level: 4 })
        ).toBeInTheDocument()
      );

      const position = screen.getAllByText(
        defaultProps.athleteData.position_group
      )[0];
      expect(position).toBeInTheDocument();

      [
        defaultProps.athleteData.date_of_birth,
        defaultProps.athleteData.age,
        defaultProps.athleteData.country,
        '-',
        'unavailable',
        'International Squad, Academy Squad',
        '2',
      ].forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });

    it('calls historyGo when clicking on Back link', async () => {
      const { user } = renderComponent();

      const backLink = screen.getByRole('link', { name: 'Back' });

      await user.click(backLink);

      expect(mockHistoryGo).toHaveBeenCalledWith(-1);
    });

    it('renders the nfl player id only when it exists', () => {
      const dataWithNFLPlayerID = {
        ...defaultProps,
        athleteData: {
          ...defaultProps.athleteData,
          extended_attributes: {
            nfl_player_id: 12345,
          },
        },
      };

      renderComponent({ props: dataWithNFLPlayerID });

      ['NFL Player ID', '12345'].forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );
    });

    describe('print button', () => {
      it('renders the print button when the correct permission', async () => {
        const user = userEvent.setup();
        const mockedPermissionsContextValue = {
          permissions: {
            medical: {
              allergies: {
                canView: true,
              },
              issues: {
                canExport: true,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        };

        renderComponent({ permissions: mockedPermissionsContextValue });
        const printButton = screen.getByRole('button', {
          text: 'Print',
        });
        expect(printButton).toBeInTheDocument();
        await user.click(printButton);
        expect(trackEventMock).toHaveBeenCalledWith(
          performanceMedicineEventNames.clickPrintMedicalDocument
        );
      });

      it('does not render the print button when the correct permission is NOT set', () => {
        const mockedPermissionsContextValue = {
          permissions: {
            medical: {
              allergies: {
                canView: true,
              },
              issues: {
                canExport: false,
              },
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        };

        renderComponent({ permissions: mockedPermissionsContextValue });

        expect(
          screen.queryByRole('button', {
            text: 'Print',
          })
        ).not.toBeInTheDocument();
      });
    });
  });
});
