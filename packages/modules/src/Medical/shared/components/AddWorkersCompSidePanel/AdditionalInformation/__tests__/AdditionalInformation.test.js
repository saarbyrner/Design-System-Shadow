import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import AdditionalInformation, { formatSSN } from '..';

describe('<AdditionalInformation />', () => {
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
      additionalInformation: {
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
      },
    },
  });

  const props = {
    t: i18nextTranslateStub(),
    issue: {
      workers_comp: {},
    },
  };

  const mockAthleteData = {
    id: 1234,
    firstname: 'John',
    lastname: 'Doe',
    date_of_birth: '23/08/1997',
    social_security_number: '123456789',
    position: 'Forward',
  };

  it('should show correct headings', () => {
    render(
      <Provider store={mockStore}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(screen.getByText('Party')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('should render the correct form fields', () => {
    render(
      <Provider store={mockStore}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      screen.getByTestId('AdditionalInformation|FirstName')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AdditionalInformation|LastName')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AdditionalInformation|DateOfBirth')
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('h6')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AdditionalInformation|Position')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AdditionalInformation|Address1')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AdditionalInformation|Address2')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AdditionalInformation|City')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AdditionalInformation|State')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AdditionalInformation|ZipCode')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AdditionalInformation|PhoneNumber')
    ).toBeInTheDocument();
  });

  it('should have values from state in fields', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,
        additionalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Street 1',
          address2: 'Street 2',
          city: 'City',
          zipCode: 'Zippy',
          phoneNumber: '12345',
          dateOfBirth: '23/08/1997',
          socialSecurityNumber: '6789',
          position: 'Forward',
        },
      },
    });

    const { container } = render(
      <Provider store={mockStoreUpdated}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      container.getElementsByClassName('edit-in-place__title')[0]
    ).toHaveTextContent('John');

    expect(
      container.getElementsByClassName('edit-in-place__title')[1]
    ).toHaveTextContent('Doe');

    expect(
      screen.getByTestId('AdditionalInformation|DateOfBirthValue')
    ).toHaveTextContent('23/08/1997');

    expect(
      screen.getByTestId('AdditionalInformation|PositionValue')
    ).toHaveTextContent('Forward');

    expect(container.querySelector('input[name="address_1"]')).toHaveValue(
      'Street 1'
    );
    expect(container.querySelector('input[name="address_2"]')).toHaveValue(
      'Street 2'
    );
    expect(container.querySelector('input[name="city"]')).toHaveValue('City');
    expect(container.querySelector('input[name="zip_code"]')).toHaveValue(
      'Zippy'
    );
    expect(container.querySelector('input[name="phone_number"]')).toHaveValue(
      '12345'
    );
  });

  it('should have empty string values or "-" values if additionalInformation state not overwritten', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,
        additionalInformation: {
          firstName: null,
          lastName: null,
          address1: null,
          address2: null,
          city: null,
          zipCode: null,
          phoneNumber: null,
          dateOfBirth: null,
        },
      },
    });

    const { container } = render(
      <Provider store={mockStoreUpdated}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      container.getElementsByClassName('edit-in-place__title')[0]
    ).toHaveTextContent('');

    expect(
      container.getElementsByClassName('edit-in-place__title')[1]
    ).toHaveTextContent('');

    expect(
      screen.getByTestId('AdditionalInformation|DateOfBirthValue')
    ).toHaveTextContent('-');

    expect(
      screen.getByTestId('AdditionalInformation|PositionValue')
    ).toHaveTextContent('-');

    expect(container.querySelector('input[name="address_1"]')).toHaveValue('');
    expect(container.querySelector('input[name="address_2"]')).toHaveValue('');
    expect(container.querySelector('input[name="city"]')).toHaveValue('');
    expect(container.querySelector('input[name="zip_code"]')).toHaveValue('');
    expect(container.querySelector('input[name="phone_number"]')).toHaveValue(
      ''
    );
  });

  it('should sensor social security number other than last 4 chars', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,
        additionalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Street 1',
          address2: 'Street 2',
          city: 'City',
          zipCode: 'Zippy',
          phoneNumber: '12345',
          dateOfBirth: '23/08/1997',
          socialSecurityNumber: '123456789',
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('h6')
    ).toHaveTextContent('xxx-xx-6789');
  });

  it('should handle hyphens in social security number', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,
        additionalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Street 1',
          address2: 'Street 2',
          city: 'City',
          zipCode: 'Zippy',
          phoneNumber: '12345',
          dateOfBirth: '23/08/1997',
          socialSecurityNumber: '1234-12-1234',
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('h6')
    ).toHaveTextContent('xxx-xx-1234');
  });

  it('should handle number type for social security number', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,
        additionalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Street 1',
          address2: 'Street 2',
          city: 'City',
          zipCode: 'Zippy',
          phoneNumber: '12345',
          dateOfBirth: '23/08/1997',
          socialSecurityNumber: '123456789',
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('h6')
    ).toHaveTextContent('xxx-xx-6789');
  });

  it('should should set text content to "-" if value is undefined', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,
        additionalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Street 1',
          address2: 'Street 2',
          city: 'City',
          zipCode: 'Zippy',
          phoneNumber: '12345',
          dateOfBirth: '23/08/1997',
          socialSecurityNumber: undefined,
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('h6')
    ).toHaveTextContent('-');
  });

  it('formatSSN function should return a correctly formatted SSN when a passed an SSN at least 9 characters long', () => {
    // Correct format and length
    expect(formatSSN('123456789')).toBe('123-45-6789');
    expect(formatSSN('1234567899')).toBe('123-45-67899');

    // incorrect length / data types
    expect(formatSSN('12345678')).toBe('-');
    expect(formatSSN('')).toBe('-');
    expect(formatSSN()).toBe('-');
    expect(formatSSN(null)).toBe('-');
    expect(formatSSN(undefined)).toBe('-');
    expect(formatSSN(123456789)).toBe('-');
    expect(formatSSN([])).toBe('-');
    expect(formatSSN({})).toBe('-');
  });

  it('should render button to athlete details page', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,

        additionalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Street 1',
          address2: 'Street 2',
          city: 'City',
          zipCode: 'Zippy',
          phoneNumber: '12345',
          dateOfBirth: '23/08/1997',
          socialSecurityNumber: undefined,
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('a')
    ).toHaveAttribute('href', '/settings/athletes/1234/edit');

    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('a')
    ).toContainHTML('button');

    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('button')
    ).toHaveClass('icon-new-tab');
  });

  it('should add invalid class to SSN element when SSN is not valid', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,

        additionalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Street 1',
          address2: 'Street 2',
          city: 'City',
          zipCode: 'Zippy',
          phoneNumber: '12345',
          dateOfBirth: '23/08/1997',
          socialSecurityNumber: null,
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('label[class*="-isInvalid"]')
    ).toBeTruthy();
  });

  it('should not add invalid class to SSN element when SSN is valid', () => {
    const mockStoreUpdated = storeFake({
      addWorkersCompSidePanel: {
        isOpen: true,
        page: 1,

        additionalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Street 1',
          address2: 'Street 2',
          city: 'City',
          zipCode: 'Zippy',
          phoneNumber: '12345',
          dateOfBirth: '23/08/1997',
          socialSecurityNumber: '123456789',
        },
      },
    });

    render(
      <Provider store={mockStoreUpdated}>
        <AdditionalInformation {...props} athleteData={mockAthleteData} />
      </Provider>
    );

    expect(
      screen
        .getByTestId('AdditionalInformation|SocialSecurityNumber')
        .querySelector('label[class*="-isInvalid"]')
    ).toBeFalsy();
  });
});
