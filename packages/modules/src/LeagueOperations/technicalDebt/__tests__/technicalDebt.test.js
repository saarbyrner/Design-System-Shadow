import {
  ASSOCIATION_ADMIN,
  ORGANISATION_ADMIN,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

import {
  getAllOptions,
  getAssociationAdminOptions,
  PENDING_ORGANISATION,
  PENDING_ASSOCIATION,
  REJECTED_ORGANISATION,
  REJECTED_ASSOCIATION,
  PENDING_PAYMENT,
  APPROVED,
  getApprovalOptions,
  getRequirementApprovalOptions,
} from '..';

describe('getAllOptions', () => {
  it('returns all the options', () => {
    expect(getAllOptions()).toStrictEqual([
      PENDING_ORGANISATION,
      REJECTED_ORGANISATION,
      PENDING_ASSOCIATION,
      REJECTED_ASSOCIATION,
      PENDING_PAYMENT,
      APPROVED,
    ]);
  });
});

const associationAdminAssertions = [
  PENDING_ORGANISATION,
  PENDING_ASSOCIATION,
  REJECTED_ORGANISATION,
  REJECTED_ASSOCIATION,
  APPROVED,
];

const organisationAdminAssertions = [
  {
    option: PENDING_ORGANISATION,
    expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
  },
  {
    option: PENDING_ASSOCIATION,
    expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
  },
  {
    option: REJECTED_ORGANISATION,
    expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
  },
  {
    option: REJECTED_ASSOCIATION,
    expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
  },
  {
    option: PENDING_PAYMENT,
    expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
  },
  { option: APPROVED, expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION] },
];

const filterForAssociationAdmin = (value) => {
  return getAllOptions()
    .filter((i) => i.value !== value)
    .filter((s) => s.value !== PENDING_PAYMENT.value);
};

describe('getAssociationAdminOptions', () => {
  test.each(associationAdminAssertions)(
    'returns the corrrect options when $value',
    ({ value }) => {
      const expected = filterForAssociationAdmin(value);
      expect(getAssociationAdminOptions(value)).toStrictEqual(expected);
    }
  );
});

describe('getOrganisationAdminOptions', () => {
  test.each(organisationAdminAssertions)(
    'returns the corrrect options when $option.value',
    ({ option, expected }) => {
      expect(
        getApprovalOptions({
          userType: ORGANISATION_ADMIN,
          currentStatus: option.value,
        })
      ).toStrictEqual(expected);
    }
  );
});

describe('getApprovalOptions', () => {
  describe('ASSOCIATION_ADMIN', () => {
    test.each(associationAdminAssertions)(
      'returns the corrrect options when $value',
      ({ value }) => {
        const expected = filterForAssociationAdmin(value);

        expect(
          getApprovalOptions({
            userType: ASSOCIATION_ADMIN,
            currentStatus: value,
          })
        ).toStrictEqual(expected);
      }
    );
  });

  describe('ORGANISATION_ADMIN', () => {
    test.each(organisationAdminAssertions)(
      'returns the corrrect options when $option.value',
      ({ option, expected }) => {
        expect(
          getApprovalOptions({
            currentStatus: option.value,
            userType: ORGANISATION_ADMIN,
          })
        ).toStrictEqual(expected);
      }
    );
  });
});

const associationAdminRequirementAssertions = [
  PENDING_ORGANISATION,
  PENDING_ASSOCIATION,
  REJECTED_ORGANISATION,
  REJECTED_ASSOCIATION,
  APPROVED,
];

describe('getRequirementApprovalOptions', () => {
  describe('ASSOCIATION_ADMIN', () => {
    test.each(associationAdminRequirementAssertions)(
      'returns the corrrect options when $value',
      ({ value }) => {
        const expected = filterForAssociationAdmin(value).filter(
          (i) => i !== PENDING_PAYMENT
        );

        expect(
          getRequirementApprovalOptions({
            userType: ASSOCIATION_ADMIN,
            currentStatus: value,
          })
        ).toStrictEqual(expected);
      }
    );
  });

  describe('ORGANISATION_ADMIN', () => {
    test.each(organisationAdminAssertions)(
      'returns the corrrect options when $option.value',
      ({ option, expected }) => {
        expect(
          getRequirementApprovalOptions({
            currentStatus: option.value,
            userType: ORGANISATION_ADMIN,
          })
        ).toStrictEqual(expected);
      }
    );
  });
});
