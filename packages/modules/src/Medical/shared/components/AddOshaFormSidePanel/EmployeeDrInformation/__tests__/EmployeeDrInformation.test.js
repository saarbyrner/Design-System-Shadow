import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import EmployeeDrInformation from '..';

jest.mock('@kitman/components/src/Select');
jest.mock('../../../../utils');

describe('<EmployeeDrInformation />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockStore = storeFake({
    addOshaFormSidePanel: {
      isOpen: true,
      page: 1,
      initialInformation: {},
      employeeDrInformation: {},
      caseInformation: {},
    },
  });

  const defaultProps = {
    issue: {
      osha: {},
    },
    isOpen: true,
    t: i18nextTranslateStub(),
  };

  const useDispatchMock = jest.fn();
  mockStore.dispatch = useDispatchMock;

  it('should render contents as expected', () => {
    render(
      <Provider store={mockStore}>
        <EmployeeDrInformation {...defaultProps} />
      </Provider>
    );

    expect(screen.getByTestId('AddOshaSidePanel|FullName')).toBeInTheDocument();
    expect(screen.getByTestId('AddOshaSidePanel|Street')).toBeInTheDocument();
    expect(screen.getByTestId('AddOshaSidePanel|City')).toBeInTheDocument();
    expect(screen.getByTestId('AddOshaSidePanel|State')).toBeInTheDocument();
    expect(screen.getByTestId('AddOshaSidePanel|Zip')).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|DateOfBirth')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|DateHired')
    ).toBeInTheDocument();
    expect(screen.getByText('Sex')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Information about the physician or other health care professional'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|PhysicianFullName')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'If treatment was given away from the worksite, where was it given?'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|FacilityName')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|FacilityStreet')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|FacilityCity')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|FacilityState')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|FacilityZip')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Was employee treated in an emergency room?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Was employee hospitalized overnight as an in-patient?')
    ).toBeInTheDocument();
  });

  it('should limit zipcode to 5 characters', async () => {
    const { container } = render(
      <Provider store={mockStore}>
        <EmployeeDrInformation {...defaultProps} />
      </Provider>
    );

    fireEvent.change(container.querySelector(`input[name="zip_code"]`), {
      target: { value: '123456' },
    });

    await waitFor(() => {
      expect(useDispatchMock).toHaveBeenCalledWith({
        fieldName: 'zip',
        type: 'UPDATE_EMPLOYEE_DR_INFORMATION_FIELD',
        value: '12345',
      });
    });
  });

  it('should limit facility zipcode to 5 characters', async () => {
    const { container } = render(
      <Provider store={mockStore}>
        <EmployeeDrInformation {...defaultProps} />
      </Provider>
    );

    fireEvent.change(container.querySelector(`input[name="facility_zip"]`), {
      target: { value: '123456' },
    });

    await waitFor(() => {
      expect(useDispatchMock).toHaveBeenCalledWith({
        fieldName: 'facilityZip',
        type: 'UPDATE_EMPLOYEE_DR_INFORMATION_FIELD',
        value: '12345',
      });
    });
  });
});
