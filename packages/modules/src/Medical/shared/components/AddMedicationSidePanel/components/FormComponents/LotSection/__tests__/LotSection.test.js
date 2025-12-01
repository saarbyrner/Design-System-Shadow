import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import LotSection from '../index';
import { mockLots } from '../../../../mocks/mockData';

describe('<LotSection />', () => {
  const formState = {
    athlete_id: null,
    prescriber: {
      id: null,
      name: '',
    },
    prescription_date: '',
    illness_occurrence_ids: [],
    injury_occurrence_ids: [],
    chronic_issue_ids: [],
    medication: {
      value: null,
      label: '',
      stockId: null,
    },
    stock_lots: [
      {
        id: null,
        dispensed_quantity: null,
      },
    ],
    optional_lot_number: '',
    directions: '',
    dose: '',
    quantity: '',
    frequency: '',
    route: '',
    start_date: '',
    end_date: '',
    duration: '',
    note: '',
  };
  const defaultProps = {
    isValidationCheckAllowed: false,
    formState,
    dispatch: jest.fn(),
    setRequestStatus: jest.fn(),
    isEditing: false,
    lots: [...mockLots.stock_lots, ...mockLots.stock_lots],
    setLots: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderTestComponent = (props) =>
    render(
      <MockedPermissionContextProvider
        permissionsContext={{
          ...mockedDefaultPermissionsContextValue,
          permissions: {
            ...mockedDefaultPermissionsContextValue.permissions,
            medical: {
              ...defaultMedicalPermissions,
            },
          },
        }}
      >
        <LotSection {...{ ...defaultProps, ...props }} />
      </MockedPermissionContextProvider>
    );

  describe('shows lot section based on actionType', () => {
    it('shows required lot section if actionType is Dispense', async () => {
      renderTestComponent({ actionType: 'Dispense' });

      expect(
        screen.getByTestId('AddMedicationSidePanel|Lot')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddMedicationSidePanel|LotQuantity')
      ).toBeInTheDocument();
    });
    it('shows required lot section if actionType is Log', async () => {
      renderTestComponent({ actionType: 'Log' });

      expect(
        screen.getByTestId('AddMedicationSidePanel|OptionalLot')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddMedicationSidePanel|OptionalLotQuantity')
      ).toBeInTheDocument();
    });
  });
  describe('shows add lot button and bin button', () => {
    it('show addLotButton if stock lots exceed fetched lots', async () => {
      renderTestComponent({ actionType: 'Dispense' });

      expect(
        screen.getByTestId('AddMedicationSidePanel|AddLotButton')
      ).toBeInTheDocument();
    });

    it('hides the trash icon if stock lots is 1', async () => {
      renderTestComponent({
        actionType: 'Dispense',
        formState: {
          ...formState,
          stock_lots: [
            { id: 1, dispensed_quantity: 20 },
            { id: 2, dispensed_quantity: 40 },
          ],
        },
      });

      expect(
        screen.getAllByTestId('AddMedicationSidePanel|RemoveLotButton')
      ).toHaveLength(2);
    });

    it('shows the trash icon if stock lots are greater than 1', async () => {
      renderTestComponent({
        actionType: 'Dispense',
        formState: {
          ...formState,
          stock_lots: [{ id: 1, dispensed_quantity: 20 }],
        },
      });
      expect(
        screen.getByRole('button').querySelector('.icon-bin')
      ).not.toBeInTheDocument();
    });
  });
});
