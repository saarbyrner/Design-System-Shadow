import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import ClaimInformation from '..';

jest.mock('../../../../utils');
jest.mock('@kitman/components/src/Select');

describe('<ClaimInformation />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockStore = storeFake({
    addWorkersCompSidePanel: {
      isOpen: true,
      page: 1,
      claimInformation: {
        personName: '',
        contactNumber: '',
        policyNumber: '',
        lossDate: '',
        lossCity: '',
        lossState: '',
        lossJurisdiction: '',
        lossDescription: '',
        side: '',
        bodyArea: '',
      },
    },
  });

  const defaultProps = {
    staffUsers: [],
    issue: {
      workers_comp: {},
      title: 'Test issue title',
    },
    isChronicIssue: false,
    t: i18nextTranslateStub(),
    isOpen: true,
    sideDetails: {
      requestStatus: 'FAILURE',
      options: [],
    },
    bodyAreaDetails: {
      requestStatus: 'FAILURE',
      options: [],
    },
    isPolicyNumberRequired: true,
  };

  it('should render form contents', () => {
    render(
      <Provider store={mockStore}>
        <ClaimInformation {...defaultProps} />
      </Provider>
    );

    expect(
      screen.getByTestId('AddWorkersCompSidePanel|PersonName')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|PolicyNumber')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|ContactNumber')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|LossDate')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|LossCity')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|LossState')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|LossJurisdiction')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|LossDescription')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|Side')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddWorkersCompSidePanel|BodyArea')
    ).toBeInTheDocument();
  });

  it('should have values in inputs from redux state', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,
        claimInformation: {
          personName: 'Option 1',
          policyNumber: '12345',
          contactNumber: '07827162731',
          lossDate: '20 Dec 2022',
          lossCity: 'Test City',
          lossState: 'Test State',
          lossJurisdiction: 'Optional',
          lossDescription: 'Test',
        },
      },
    });

    const { container } = render(
      <Provider store={mockStoreUpdated}>
        <ClaimInformation {...defaultProps} />
      </Provider>
    );

    expect(
      container.querySelector('input[name="reported_person_contact_phone"')
    ).toHaveValue('07827162731');
    expect(container.querySelector('input[name="policy_number"')).toHaveValue(
      '12345'
    );
    expect(container.querySelector('input[name="loss_city"')).toHaveValue(
      'Test City'
    );
    expect(
      container.querySelector('input[name="loss_jurisdiction"')
    ).toHaveValue('Optional');
    expect(
      container.querySelector('input[name="loss_description"')
    ).toHaveValue('Test');
  });

  it('should have empty string values if claimInformation state not overwritten', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,
        claimInformation: {
          personName: null,
          policyNumber: null,
          contactNumber: null,
          lossDate: null,
          lossCity: null,
          lossState: null,
          lossJurisdiction: null,
          lossDescription: null,
        },
      },
    });

    const { container } = render(
      <Provider store={mockStoreUpdated}>
        <ClaimInformation {...defaultProps} />
      </Provider>
    );

    expect(
      container.querySelector('input[name="reported_person_contact_phone"')
    ).toHaveValue('');
    expect(container.querySelector('input[name="policy_number"')).toHaveValue(
      ''
    );
    expect(container.querySelector('input[name="loss_city"')).toHaveValue('');
    expect(
      container.querySelector('input[name="loss_jurisdiction"')
    ).toHaveValue('');
    expect(
      container.querySelector('input[name="loss_description"')
    ).toHaveValue('');
  });

  it('should not display optional text on top of Policy number field if isPolicyNumberRequired is true', () => {
    render(
      <Provider store={mockStore}>
        <ClaimInformation {...defaultProps} />
      </Provider>
    );

    const policyNumberField = screen.getByTestId(
      'AddWorkersCompSidePanel|PolicyNumber'
    );

    expect(policyNumberField).not.toHaveTextContent('Optional');
  });

  it('should display optional text on top of Policy number field if isPolicyNumberRequired is true', () => {
    const props = {
      ...defaultProps,
      isPolicyNumberRequired: false,
    };

    render(
      <Provider store={mockStore}>
        <ClaimInformation {...props} />
      </Provider>
    );

    const policyNumberField = screen.getByTestId(
      'AddWorkersCompSidePanel|PolicyNumber'
    );

    expect(policyNumberField).toHaveTextContent('Optional');
  });
});
