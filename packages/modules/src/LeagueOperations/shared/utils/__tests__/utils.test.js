import { render, screen } from '@testing-library/react';
import {
  renderStatusChip,
  getDateOrFallback,
  getAddressOrFallback,
  getCountryOrFallback,
  getAgeOrFallback,
  getClubAvatar,
  checkUrlParams,
  buildAddress,
  getSquadNumbers,
  renderDisciplinaryStatusChip,
  renderRegistrationSystemStatusChip,
  getStatusTooltip,
} from '..';

import { RegistrationStatusEnum } from '../../types/common';

import {
  DATE_ICE_AGE_ENDED,
  MOCK_REGISTRATION_PROFILE,
} from '../../../__tests__/test_utils';

import {
  INCOMPLETE,
  PENDING_ORGANISATION,
  PENDING_ASSOCIATION,
  REJECTED_ORGANISATION,
  REJECTED_ASSOCIATION,
  PENDING_PAYMENT,
  APPROVED,
  FALLBACK_DASH,
  ELIGIBLE,
  SUSPENDED,
  UNAPPROVED,
} from '../../consts';

jest.useFakeTimers();

describe('renderStatusChip', () => {
  const assertions = [
    {
      status: RegistrationStatusEnum.INCOMPLETE,
      expectedLabel: INCOMPLETE,
      icon: 'PendingOutlinedIcon',
    },
    {
      status: RegistrationStatusEnum.PENDING_ORGANISATION,
      expectedLabel: PENDING_ORGANISATION,
      icon: 'PendingOutlinedIcon',
    },
    {
      status: RegistrationStatusEnum.PENDING_ASSOCIATION,
      expectedLabel: PENDING_ASSOCIATION,
      icon: 'PendingOutlinedIcon',
    },
    {
      status: RegistrationStatusEnum.REJECTED_ORGANISATION,
      expectedLabel: REJECTED_ORGANISATION,
      icon: 'ErrorIcon',
    },
    {
      status: RegistrationStatusEnum.REJECTED_ASSOCIATION,
      expectedLabel: REJECTED_ASSOCIATION,
      icon: 'ErrorIcon',
    },
    {
      status: RegistrationStatusEnum.PENDING_PAYMENT,
      expectedLabel: PENDING_PAYMENT,
      icon: 'PendingOutlinedIcon',
    },
    {
      status: RegistrationStatusEnum.APPROVED,
      expectedLabel: APPROVED,
      icon: 'CheckCircleIcon',
    },
    {
      status: RegistrationStatusEnum.UNAPPROVED,
      expectedLabel: UNAPPROVED,
      icon: 'PendingOutlinedIcon',
    },
  ];

  it.each(assertions)(
    `returns status: $expectedLabel when status is $status`,
    ({ expectedLabel, icon, status }) => {
      render(<>{renderStatusChip(status)}</>);
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
      expect(screen.getByTestId(icon)).toBeInTheDocument();
    }
  );
});

describe('renderRegistrationSystemStatusChip', () => {
  const assertions = [
    {
      status: {
        id: 9,
        name: 'Pending League',
        type: 'pending_league',
      },
      expectedLabel: 'Pending League',
      icon: 'PendingOutlinedIcon',
    },
    {
      status: {
        id: 10,
        name: 'Pending Organisation',
        type: 'pending_organisation',
      },
      expectedLabel: 'Pending Organisation',
      icon: 'PendingOutlinedIcon',
    },
    {
      status: {
        id: 11,
        name: 'Pending Association',
        type: 'pending_association',
      },
      expectedLabel: 'Pending Association',
      icon: 'PendingOutlinedIcon',
    },
    {
      status: {
        id: 12,
        name: 'Unapproved',
        type: 'unapproved',
      },
      expectedLabel: 'Unapproved',
      icon: 'PendingOutlinedIcon',
    },
  ];

  it.each(assertions)(
    `returns status: $expectedLabel when status is $status`,
    ({ expectedLabel, icon, status }) => {
      render(<>{renderRegistrationSystemStatusChip(status)}</>);
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
      expect(screen.getByTestId(icon)).toBeInTheDocument();
    }
  );

  it('returns FALLBACK_DASH when status is null', () => {
    render(<>{renderRegistrationSystemStatusChip(null)}</>);
    expect(screen.getByText(FALLBACK_DASH)).toBeInTheDocument();
  });
});

describe('getStatusTooltip', () => {
  it('returns the correct tooltip for the status', () => {
    expect(getStatusTooltip(RegistrationStatusEnum.INCOMPLETE)).toBe(
      'Registration has missing requirements.'
    );
    expect(getStatusTooltip(RegistrationStatusEnum.PENDING_ORGANISATION)).toBe(
      'Requirements have been submitted and are awaiting club approval.'
    );
    expect(getStatusTooltip(RegistrationStatusEnum.PENDING_ASSOCIATION)).toBe(
      'Requirements have been submitted and are awaiting league approval.'
    );
    expect(getStatusTooltip(RegistrationStatusEnum.UNAPPROVED)).toBe(
      'User has been unapproved. Reach out to league admin for further details.'
    );
    expect(getStatusTooltip(null)).toBe(null);
    expect(getStatusTooltip(undefined)).toBe(null);
  });
});

describe('renderDisciplinaryStatusChip', () => {
  const assertions = [
    {
      status: ELIGIBLE,
      expectedLabel: 'Eligible',
      icon: 'CheckCircleIcon',
    },
    {
      status: SUSPENDED,
      expectedLabel: 'Suspended',
      icon: 'ErrorIcon',
    },
  ];

  it.each(assertions)(
    `returns status: $expectedLabel when disciplinary status is $status`,
    ({ expectedLabel, icon, status }) => {
      render(<>{renderDisciplinaryStatusChip(status)}</>);
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
      expect(screen.getByTestId(icon)).toBeInTheDocument();
    }
  );
});

describe('getDateOrFallback', () => {
  it('correctly gets the date when provided', () => {
    expect(getDateOrFallback(DATE_ICE_AGE_ENDED, 'YYYY-MM-DD')).toStrictEqual(
      'Jul 19, 2024'
    );
  });
  it('correctly gets the date fallback', () => {
    expect(getDateOrFallback()).toStrictEqual(FALLBACK_DASH);
  });
});

describe('getAddressOrFallback', () => {
  it('correctly gets the address when provided', () => {
    expect(
      getAddressOrFallback(MOCK_REGISTRATION_PROFILE.address)
    ).toStrictEqual(['Cazadero', '/', 'Tennessee']);
  });
  it('correctly gets the address fallback', () => {
    expect(getAddressOrFallback()).toStrictEqual([FALLBACK_DASH]);
  });
});

describe('getCountryOrFallback', () => {
  it('correctly gets the country when provided', () => {
    expect(
      getCountryOrFallback(MOCK_REGISTRATION_PROFILE.address)
    ).toStrictEqual('Guadeloupe');
  });
  it('correctly gets the country fallback', () => {
    expect(getCountryOrFallback()).toStrictEqual(FALLBACK_DASH);
  });
});

describe('getAgeOrFallback', () => {
  const fakeNowDate = new Date('2024-04-11T14:55:22.065Z');
  jest.setSystemTime(fakeNowDate);
  it('correctly gets the age when provided', () => {
    expect(
      getAgeOrFallback(MOCK_REGISTRATION_PROFILE.date_of_birth)
    ).toStrictEqual(35);
  });
  it('correctly gets the age fallback', () => {
    expect(getAgeOrFallback()).toStrictEqual(FALLBACK_DASH);
  });
});

describe('getClubAvatar', () => {
  it('correctly gets the club logo', () => {
    expect(
      getClubAvatar(MOCK_REGISTRATION_PROFILE.organisations[0])
    ).toStrictEqual({
      avatar_src:
        'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
      href: '/registration/organisations?id=1267',
      id: 1267,
      text: 'KL Galaxy',
    });
  });
  it('correctly gets the club logo but without link', () => {
    expect(
      getClubAvatar(MOCK_REGISTRATION_PROFILE.organisations[0], true)
    ).toStrictEqual({
      avatar_src:
        'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
      id: 1267,
      text: 'KL Galaxy',
    });
  });
});

describe('checkUrlParams', () => {
  it('should return true if URLSearchParams has entries', () => {
    const urlParams = new URLSearchParams();
    urlParams.append('key', 'value');
    expect(checkUrlParams(urlParams)).toBe(true);
  });

  it('should return false if URLSearchParams is empty', () => {
    const urlParams = new URLSearchParams();
    expect(checkUrlParams(urlParams)).toBe(false);
  });

  it('should return false if URLSearchParams is null', () => {
    const urlParams = null;
    expect(checkUrlParams(urlParams)).toBe(false);
  });
});

describe('buildAddress', () => {
  it('should correctly format the address with all fields provided', () => {
    const address = {
      id: 1,
      city: 'San Francisco',
      country: { abbreviation: 'US', id: 840, name: 'United States' },
      line1: '123 Market St',
      line2: 'Suite 400',
      line3: 'Unit 5',
      state: 'CA',
      zipcode: '94105',
    };
    const result = buildAddress(address);
    expect(result).toEqual(
      '123 Market St, Suite 400, Unit 5, CA, 94105, United States'
    );
  });

  it('should correctly format the address with missing optional fields', () => {
    const address = {
      id: 2,
      city: 'Dublin',
      country: { abbreviation: 'IE', id: 372, name: 'Ireland' },
      line1: "47 O'Connell Street Upper",
      line2: null,
      line3: null,
      state: 'Dublin',
      zipcode: null,
    };
    const result = buildAddress(address);
    expect(result).toEqual("47 O'Connell Street Upper, Dublin, Ireland");
  });

  it('should return an empty string if all address parts are missing', () => {
    const address = {
      id: 3,
      city: '',
      country: { abbreviation: '', id: 0, name: '' },
      line1: '',
      line2: null,
      line3: null,
      state: '',
      zipcode: null,
    };
    const result = buildAddress(address);
    expect(result).toEqual('');
  });
});

describe('getSquadNumbers', () => {
  it('should return the squad numbers if the array is not empty', () => {
    const squadNumbers = [4, 6, '10'];
    const result = getSquadNumbers(squadNumbers);
    expect(result).toEqual(squadNumbers);
  });

  it('should return FALLBACK_DASH if the array is empty', () => {
    const squadNumbers = [];
    const result = getSquadNumbers(squadNumbers);
    expect(result).toEqual(FALLBACK_DASH);
  });

  it('should return FALLBACK_DASH if the array is null or undefined', () => {
    let squadNumbers = null;
    let result = getSquadNumbers(squadNumbers);
    expect(result).toEqual(FALLBACK_DASH);

    squadNumbers = undefined;
    result = getSquadNumbers(squadNumbers);
    expect(result).toEqual(FALLBACK_DASH);
  });
});
