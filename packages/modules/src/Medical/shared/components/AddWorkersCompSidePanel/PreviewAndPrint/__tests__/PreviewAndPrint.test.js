import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import PreviewAndPrint from '..';
import { getPathologyTitle } from '../../../../utils';

jest.mock('../../../../utils');

describe('<PreviewAndPrint />', () => {
  const defaultProps = {
    issue: { workers_comp: {} },
    isPolicyNumberRequired: true,
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockStateEmptyValues = {
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
        side: null,
        bodyArea: null,
      },
      additionalInformation: {
        firstName: null,
        lastName: null,
        address1: null,
        address2: null,
        city: null,
        state: null,
        zipCode: null,
        phoneNumber: null,
      },
    },
  };

  const getMockStore = (
    socialSecurityNumber = '123456789',
    lossDate = '2022-12-21T00:00:00.000Z'
  ) =>
    storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,
        claimInformation: {
          personName: { value: 1, label: 'Option 1' },
          policyNumber: '12345',
          contactNumber: '07827162731',
          lossDate,
          lossCity: 'Test City',
          lossState: 'Test State',
          lossJurisdiction: 'Optional',
          lossDescription: 'Test',
          side: 1,
          bodyArea: 1,
        },
        additionalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Street',
          address2: 'Street 2',
          city: 'City',
          state: 'State',
          zipCode: 'Zippy',
          phoneNumber: '12345',
          dateOfBirth: 'Aug 12, 2000',
          socialSecurityNumber,
          position: 'Forward',
        },
      },
    });

  it('should render content as expected', () => {
    render(
      <Provider store={getMockStore()}>
        <PreviewAndPrint {...defaultProps} />
      </Provider>
    );

    expect(screen.getByText('Claim')).toBeInTheDocument();
    expect(screen.getByText('Reported person name:')).toBeInTheDocument();
    expect(
      screen.getByText('Reported person contact phone:')
    ).toBeInTheDocument();
    expect(screen.getByText('Policy number:')).toBeInTheDocument();

    expect(screen.getByText('Loss date:')).toBeInTheDocument();
    expect(screen.getByText('Loss city:')).toBeInTheDocument();
    expect(screen.getByText('Loss state:')).toBeInTheDocument();
    expect(screen.getByText('Loss jurisdiction:')).toBeInTheDocument();
    expect(screen.getByText('Loss description:')).toBeInTheDocument();
    expect(screen.getByText('Side:')).toBeInTheDocument();
    expect(screen.getByText('Body area:')).toBeInTheDocument();

    expect(screen.getByText('Party')).toBeInTheDocument();
    expect(screen.getByText('First name:')).toBeInTheDocument();
    expect(screen.getByText('Last name:')).toBeInTheDocument();
    expect(screen.getByText('Date of birth:')).toBeInTheDocument();
    expect(screen.getByText('Social security number:')).toBeInTheDocument();
    expect(screen.getByText('Roster position:')).toBeInTheDocument();

    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Address 1:')).toBeInTheDocument();
    expect(screen.getByText('Address 2:')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('State:')).toBeInTheDocument();
    expect(screen.getByText('Zipcode:')).toBeInTheDocument();

    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Phone number:')).toBeInTheDocument();
  });

  it('should display data in fields from state', () => {
    getPathologyTitle.mockReturnValue('Test Pathology');

    render(
      <Provider store={getMockStore()}>
        <PreviewAndPrint {...defaultProps} />
      </Provider>
    );

    expect(screen.getByTestId('PreviewAndPrint|Title')).toHaveTextContent(
      'WC - Test Pathology - 12/21/2022'
    );
    expect(screen.getByTestId('PreviewAndPrint|PersonName')).toHaveTextContent(
      'Option 1'
    );
    expect(
      screen.getByTestId('PreviewAndPrint|ContactNumber')
    ).toHaveTextContent('07827162731');
    expect(
      screen.getByTestId('PreviewAndPrint|PolicyNumber')
    ).toHaveTextContent('12345');

    expect(screen.getByTestId('PreviewAndPrint|LossDate')).toHaveTextContent(
      'Dec 21, 2022'
    );
    expect(screen.getByTestId('PreviewAndPrint|LossCity')).toHaveTextContent(
      'Test City'
    );
    expect(screen.getByTestId('PreviewAndPrint|LossState')).toHaveTextContent(
      'Test State'
    );
    expect(
      screen.getByTestId('PreviewAndPrint|LossJurisdiction')
    ).toHaveTextContent('Optional');
    expect(
      screen.getByTestId('PreviewAndPrint|LossDescription')
    ).toHaveTextContent('Test');
    expect(screen.getByTestId('PreviewAndPrint|Side')).toHaveTextContent('-');
    expect(screen.getByTestId('PreviewAndPrint|BodyArea')).toHaveTextContent(
      '-'
    );

    expect(screen.getByTestId('PreviewAndPrint|FirstName')).toHaveTextContent(
      'John'
    );
    expect(screen.getByTestId('PreviewAndPrint|LastName')).toHaveTextContent(
      'Doe'
    );
    expect(screen.getByTestId('PreviewAndPrint|DateOfBirth')).toHaveTextContent(
      'Aug 12, 2000'
    );
    expect(screen.getByTestId('PreviewAndPrint|Position')).toHaveTextContent(
      'Forward'
    );

    expect(screen.getByTestId('PreviewAndPrint|Address1')).toHaveTextContent(
      'Street'
    );
    expect(screen.getByTestId('PreviewAndPrint|Address2')).toHaveTextContent(
      'Street 2'
    );
    expect(screen.getByTestId('PreviewAndPrint|City')).toHaveTextContent(
      'City'
    );
    expect(screen.getByTestId('PreviewAndPrint|State')).toHaveTextContent(
      'State'
    );
    expect(screen.getByTestId('PreviewAndPrint|Zipcode')).toHaveTextContent(
      'Zippy'
    );
    expect(screen.getByTestId('PreviewAndPrint|PhoneNumber')).toHaveTextContent(
      '12345'
    );
  });

  it('should display "-" for fields if data is null', () => {
    const mockStoreEmptyOptionals = storeFake(mockStateEmptyValues);

    render(
      <Provider store={mockStoreEmptyOptionals}>
        <PreviewAndPrint {...defaultProps} />
      </Provider>
    );

    expect(screen.getByTestId('PreviewAndPrint|PersonName')).toHaveTextContent(
      '-'
    );
    expect(
      screen.getByTestId('PreviewAndPrint|ContactNumber')
    ).toHaveTextContent('-');
    expect(
      screen.getByTestId('PreviewAndPrint|PolicyNumber')
    ).toHaveTextContent('-');

    expect(screen.getByTestId('PreviewAndPrint|LossDate')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PreviewAndPrint|LossCity')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PreviewAndPrint|LossState')).toHaveTextContent(
      '-'
    );
    expect(
      screen.getByTestId('PreviewAndPrint|LossJurisdiction')
    ).toHaveTextContent('-');
    expect(
      screen.getByTestId('PreviewAndPrint|LossDescription')
    ).toHaveTextContent('-');
    expect(screen.getByTestId('PreviewAndPrint|Side')).toHaveTextContent('-');
    expect(screen.getByTestId('PreviewAndPrint|BodyArea')).toHaveTextContent(
      '-'
    );

    expect(screen.getByTestId('PreviewAndPrint|FirstName')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PreviewAndPrint|LastName')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PreviewAndPrint|DateOfBirth')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PreviewAndPrint|Position')).toHaveTextContent(
      '-'
    );

    expect(screen.getByTestId('PreviewAndPrint|Address1')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PreviewAndPrint|Address2')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PreviewAndPrint|City')).toHaveTextContent('-');
    expect(screen.getByTestId('PreviewAndPrint|State')).toHaveTextContent('-');
    expect(screen.getByTestId('PreviewAndPrint|Zipcode')).toHaveTextContent(
      '-'
    );
    expect(screen.getByTestId('PreviewAndPrint|PhoneNumber')).toHaveTextContent(
      '-'
    );
  });

  it('should sensor social security number other than last 4 chars', () => {
    render(
      <Provider store={getMockStore('123456789')}>
        <PreviewAndPrint {...defaultProps} />
      </Provider>
    );

    expect(
      screen.getByTestId('PreviewAndPrint|SocialSecurityNumber')
    ).toHaveTextContent('xxx-xx-6789');
  });

  it('should handle hyphens in social security number', () => {
    render(
      <Provider store={getMockStore('1234-12-1234')}>
        <PreviewAndPrint {...defaultProps} />
      </Provider>
    );

    expect(
      screen.getByTestId('PreviewAndPrint|SocialSecurityNumber')
    ).toHaveTextContent('xxx-xx-1234');
  });

  it('should handle number type for social security number', () => {
    render(
      <Provider store={getMockStore(123456789)}>
        <PreviewAndPrint {...defaultProps} />
      </Provider>
    );

    expect(
      screen.getByTestId('PreviewAndPrint|SocialSecurityNumber')
    ).toHaveTextContent('xxx-xx-6789');
  });

  it('should set text content to "-" if value is undefined', () => {
    render(
      <Provider store={getMockStore(undefined)}>
        <PreviewAndPrint {...defaultProps} />
      </Provider>
    );

    expect(
      screen.getByTestId('PreviewAndPrint|SocialSecurityNumber')
    ).toHaveTextContent('-');
  });

  it('should display invalid CSS for missing fields', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 3,
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
        additionalInformation: {
          firstName: null,
          lastName: null,
          address1: null,
          address2: null,
          city: null,
          state: null,
          zipCode: null,
          phoneNumber: null,
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <PreviewAndPrint {...defaultProps} />
      </Provider>
    );

    expect(
      screen
        .getByTestId('PreviewAndPrint|PersonNameLabel')
        .className.includes('isInvalid')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|PolicyNumberLabel')
        .className.includes('isInvalid')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossDateLabel')
        .className.includes('isInvalid')
    ).toBe(true);
    expect(
      screen
        .getByTestId('PreviewAndPrint|LossCityLabel')
        .className.includes('isInvalid')
    ).toBe(true);
    expect(
      screen
        .getByTestId('PreviewAndPrint|LossStateLabel')
        .className.includes('isInvalid')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossDescriptionLabel')
        .className.includes('isInvalid')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|FirstNameLabel')
        .className.includes('isInvalid')
    ).toBe(true);
    expect(
      screen
        .getByTestId('PreviewAndPrint|LastNameLabel')
        .className.includes('isInvalid')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|Address1Label')
        .className.includes('isInvalid')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|CityLabel')
        .className.includes('isInvalid')
    ).toBe(true);
    expect(
      screen
        .getByTestId('PreviewAndPrint|StateLabel')
        .className.includes('isInvalid')
    ).toBe(true);
    expect(
      screen
        .getByTestId('PreviewAndPrint|ZipcodeLabel')
        .className.includes('isInvalid')
    ).toBe(true);
  });

  it('should NOT display invalid CSS for Policy Number when isPolicyNumberRequired is false and empty value', () => {
    const props = {
      ...defaultProps,
      isPolicyNumberRequired: false,
    };
    const mockStoreEmptyValues = storeFake(mockStateEmptyValues);

    render(
      <Provider store={mockStoreEmptyValues}>
        <PreviewAndPrint {...props} />
      </Provider>
    );
    expect(
      screen
        .getByTestId('PreviewAndPrint|PolicyNumberLabel')
        .className.includes('isInvalid')
    ).toBe(false);
  });

  it('should display invalid CSS for Policy Number when isPolicyNumberRequired is true and empty value', () => {
    const props = {
      ...defaultProps,
      isPolicyNumberRequired: true,
    };
    const mockStoreEmptyValues = storeFake(mockStateEmptyValues);

    render(
      <Provider store={mockStoreEmptyValues}>
        <PreviewAndPrint {...props} />
      </Provider>
    );
    expect(
      screen
        .getByTestId('PreviewAndPrint|PolicyNumberLabel')
        .className.includes('isInvalid')
    ).toBe(true);
  });

  it('should NOT display invalid CSS for non-missing fields', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 3,
        claimInformation: {
          personName: { value: 1, label: 'Option 1' },
          policyNumber: '12345',
          contactNumber: '07827162731',
          lossDate: '20 Dec 2022',
          lossCity: 'Test City',
          lossState: 'Test State',
          lossJurisdiction: 'Optional',
          lossDescription: 'Test',
        },
        additionalInformation: {
          firstName: 'Athlete',
          lastName: 'Athlete-Lastname',
          address1: '1234 Address rd.',
          address2: 'Apt. 1',
          city: 'LA',
          state: 'CA',
          zipCode: '90210',
          phoneNumber: '695-555-1234',
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <PreviewAndPrint {...defaultProps} />
      </Provider>
    );

    expect(
      screen
        .getByTestId('PreviewAndPrint|PersonNameLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|PolicyNumberLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossDateLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossCityLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossStateLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossDescriptionLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|FirstNameLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LastNameLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|Address1Label')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|CityLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|StateLabel')
        .className.includes('isInvalid')
    ).toBe(false);

    expect(
      screen
        .getByTestId('PreviewAndPrint|ZipcodeLabel')
        .className.includes('isInvalid')
    ).toBe(false);
  });

  it('should display submitted CSS for when status is submitted', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 3,
        claimInformation: {
          personName: { value: 1, label: 'Option 1' },
          policyNumber: '12345',
          contactNumber: '07827162731',
          lossDate: '20 Dec 2022',
          lossCity: 'Test City',
          lossState: 'Test State',
          lossJurisdiction: 'Optional',
          lossDescription: 'Test',
        },
        additionalInformation: {
          firstName: 'Athlete',
          lastName: 'Athlete-Lastname',
          address1: '1234 Address rd.',
          address2: 'Apt. 1',
          city: 'LA',
          state: 'CA',
          zipCode: '90210',
          phoneNumber: '695-555-1234',
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <PreviewAndPrint
          {...defaultProps}
          issue={{ workers_comp: { status: 'submitted' } }}
        />
      </Provider>
    );

    expect(
      screen
        .getByTestId('PreviewAndPrint|PersonName')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|PolicyNumber')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossDate')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossCity')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossState')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LossDescription')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|FirstName')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|LastName')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|Address1')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|City')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|State')
        .className.includes('isSubmitted')
    ).toBe(true);

    expect(
      screen
        .getByTestId('PreviewAndPrint|Zipcode')
        .className.includes('isSubmitted')
    ).toBe(true);
  });

  describe('title', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('[feature flag]  pm-mls-emr-demo-froi on', () => {
      beforeEach(() => {
        window.featureFlags['pm-mls-emr-demo-froi'] = true;
      });
      afterEach(() => {
        window.featureFlags['pm-mls-emr-demo-froi'] = false;
      });
      it('should display title as "FROI" if no data exists', () => {
        getPathologyTitle.mockReturnValue(undefined);

        render(
          <Provider store={getMockStore(undefined, undefined)}>
            <PreviewAndPrint {...defaultProps} />
          </Provider>
        );

        expect(screen.getByTestId('PreviewAndPrint|Title')).toHaveTextContent(
          'FROI'
        );
      });
    });

    it('should display title as "WC" if no data exists', () => {
      getPathologyTitle.mockReturnValue(undefined);

      render(
        <Provider store={getMockStore(undefined, undefined)}>
          <PreviewAndPrint {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PreviewAndPrint|Title')).toHaveTextContent(
        'WC'
      );
    });

    it('should display title as "WC - Pathology" if pathology exists but loss date does not', () => {
      getPathologyTitle.mockReturnValue('Test Pathology');

      render(
        <Provider store={getMockStore(undefined, undefined)}>
          <PreviewAndPrint {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PreviewAndPrint|Title')).toHaveTextContent(
        'WC - Test Pathology'
      );
    });

    it('should display title as "WC - Loss Date" if loss date exists but Pathology does not', () => {
      getPathologyTitle.mockReturnValue(undefined);

      render(
        <Provider store={getMockStore()}>
          <PreviewAndPrint {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PreviewAndPrint|Title')).toHaveTextContent(
        'WC - 12/21/2022'
      );
    });

    it('should display title as "WC - Pathology - Loss Date" if all data exists', () => {
      getPathologyTitle.mockReturnValue('Test Pathology');

      render(
        <Provider store={getMockStore()}>
          <PreviewAndPrint {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PreviewAndPrint|Title')).toHaveTextContent(
        'WC - Test Pathology - 12/21/2022'
      );
    });
  });

  describe('side and body area values', () => {
    it('should display "-" if no data exists', () => {
      render(
        <Provider store={getMockStore()}>
          <PreviewAndPrint {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('PreviewAndPrint|Side')).toHaveTextContent('-');
      expect(screen.getByTestId('PreviewAndPrint|BodyArea')).toHaveTextContent(
        '-'
      );
    });

    it('should display "-" if request status fails', () => {
      render(
        <Provider store={getMockStore()}>
          <PreviewAndPrint
            {...defaultProps}
            sideDetails={{ requestStatus: 'FAILURE' }}
          />
        </Provider>
      );

      expect(screen.getByTestId('PreviewAndPrint|Side')).toHaveTextContent('-');
      expect(screen.getByTestId('PreviewAndPrint|BodyArea')).toHaveTextContent(
        '-'
      );
    });

    it('should get text value from id and display if request status is success', () => {
      const mockStoreWithSideAndBodyArea = storeFake({
        addWorkersCompSidePanel: {
          isOpen: true,
          page: 1,
          claimInformation: {
            personName: { value: 1, label: 'Option 1' },
            policyNumber: '12345',
            contactNumber: '07827162731',
            lossDate: '2022-12-21T00:00:00.000Z',
            lossCity: 'Test City',
            lossState: 'Test State',
            lossJurisdiction: 'Optional',
            lossDescription: 'Test',
            side: 1,
            bodyArea: 1,
          },
          additionalInformation: {
            firstName: 'John',
            lastName: 'Doe',
            address1: 'Street',
            address2: 'Street 2',
            city: 'City',
            state: 'State',
            zipCode: 'Zippy',
            phoneNumber: '12345',
            dateOfBirth: 'Aug 12, 2000',
            socialSecurityNumber: '123456789',
            position: 'Forward',
          },
        },
      });

      render(
        <Provider store={mockStoreWithSideAndBodyArea}>
          <PreviewAndPrint
            {...defaultProps}
            sideDetails={{
              requestStatus: 'SUCCESS',
              options: [{ id: 1, name: 'Left' }],
            }}
            bodyAreaDetails={{
              requestStatus: 'SUCCESS',
              options: [{ id: 1, name: 'Head' }],
            }}
          />
        </Provider>
      );

      expect(screen.getByTestId('PreviewAndPrint|Side')).toHaveTextContent(
        'Left'
      );
      expect(screen.getByTestId('PreviewAndPrint|BodyArea')).toHaveTextContent(
        'Head'
      );
    });
  });
});
