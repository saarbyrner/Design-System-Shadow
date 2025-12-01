import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import InputError from '../index';

describe('<InputError />', () => {
  const defaultProps = {
    formItem: '-2',
    isValidationCheckAllowed: true,
    t: i18nextTranslateStub(),
  };

  describe('renders the correct errors', () => {
    const lots = [
      {
        dispensed_quantity: 57,
        drug: {
          id: 2,
          name: 'drug 1',
          dispensable_drug_id: '123',
          med_strength: '400',
          med_strength_unit: 'mg',
          dose_form_desc: 'tablet',
          route_desc: 'oral',
          drug_name_desc: 'ibuprofen',
        },
        drug_type: 'FdbDispensableDrug',
        expiration_date: '2023-03-30',
        id: 1,
        label: '1 (exp. Mar 30, 2023) - Qty. 1',
        lot_number: '1',
        quantity: 143,
        value: 1,
      },
    ];
    const renderTestComponent = (props) =>
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                stockManagement: { canDispense: true },
                medications: {
                  canLog: true,
                },
              },
            },
          }}
        >
          <InputError {...{ ...defaultProps, ...props }} />
        </MockedPermissionContextProvider>
      );
    it('renders the value must be greater than 0 error', async () => {
      renderTestComponent();
      expect(screen.getByTestId('InputError|ZeroError')).toBeInTheDocument();
    });

    it('renders the value must be an integer error', async () => {
      renderTestComponent({ formItem: '2.2' });

      expect(screen.getByTestId('InputError|IntegerError')).toBeInTheDocument();
    });

    it('renders the Exceeded quantity of lot error', async () => {
      renderTestComponent({
        formItem: '145',
        lot: { dispensed_quantity: '145', id: 1 },
        lots,
        isEditing: false,
      });

      expect(
        screen.getByTestId('InputError|ExceededQuantityError')
      ).toBeInTheDocument();
    });

    it('only shows errors if isValidationCheckIsAllowed', async () => {
      renderTestComponent({
        formItem: '-2.2',
        lot: { dispensed_quantity: '145', id: 1 },
        lots,
        isEditing: false,
        isValidationCheckAllowed: false,
      });

      expect(
        screen.queryByText('Value must be greater than 0')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Value must be an integer')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Exceeded quantity of lot')
      ).not.toBeInTheDocument();
    });

    it('doesnt show errors if values are good', async () => {
      renderTestComponent({
        formItem: '2.0',
        lot: { dispensed_quantity: '143', id: 1 },
        lots,
        isEditing: false,
        isValidationCheckAllowed: true,
      });

      expect(
        screen.queryByText('Value must be greater than 0')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Value must be an integer')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Exceeded quantity of lot')
      ).not.toBeInTheDocument();
    });
  });
});
