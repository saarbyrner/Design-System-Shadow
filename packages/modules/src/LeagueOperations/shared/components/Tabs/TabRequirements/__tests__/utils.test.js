import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registrations_sections';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import transformToRequirementRows, { isSectionActionable } from '../utils';

describe('transformToRequirementRows', () => {
  it('correctly parses a requirement to a requirement row object', () => {
    expect(transformToRequirementRows([response.data[0]])).toStrictEqual([
      {
        id: 1,
        requirement: {
          text: 'Section 1',
          isActionable: true,
        },
        registration_status: 'pending_organisation',
        registration_system_status: {
          id: 9,
          name: 'Pending Organisation',
          type: 'pending_organisation',
        },
        onRowClick: expect.any(Function),
      },
    ]);
  });
  it('correctly parses all the requirement rows', () => {
    expect(transformToRequirementRows(response.data)).toHaveLength(2);
  });
});

describe('isSectionActionable', () => {
  const assertions = [
    {
      status: RegistrationStatusEnum.APPROVED,
      registrationSystemStatus: {
        id: 1,
        name: 'Approved',
        type: RegistrationStatusEnum.APPROVED,
      },
      expected: false,
    },
    {
      status: RegistrationStatusEnum.PENDING_ORGANISATION,
      registrationSystemStatus: {
        id: 2,
        name: 'Pending Organisation',
        type: RegistrationStatusEnum.PENDING_ORGANISATION,
      },
      expected: true,
    },
    {
      status: RegistrationStatusEnum.PENDING_ASSOCIATION,
      registrationSystemStatus: {
        id: 3,
        name: 'Pending Association',
        type: RegistrationStatusEnum.PENDING_ASSOCIATION,
      },
      expected: true,
    },
    {
      status: RegistrationStatusEnum.REJECTED_ORGANISATION,
      registrationSystemStatus: {
        id: 4,
        name: 'Rejected Organisation',
        type: RegistrationStatusEnum.REJECTED_ORGANISATION,
      },
      expected: true,
    },
    {
      status: RegistrationStatusEnum.PENDING_PAYMENT,
      registrationSystemStatus: {
        id: 5,
        name: 'Pending Payment',
        type: RegistrationStatusEnum.PENDING_PAYMENT,
      },
      expected: true,
    },
    {
      status: RegistrationStatusEnum.INCOMPLETE,
      registrationSystemStatus: {
        id: 6,
        name: 'Incomplete',
        type: RegistrationStatusEnum.INCOMPLETE,
      },
      expected: false,
    },
  ];

  assertions.forEach((assertion) => {
    test(`when the status is ${
      assertion.value
    } expected is ${assertion.expected.toString()}`, () => {
      expect(
        isSectionActionable({
          status: assertion.status,
          registrationSystemStatus: assertion.registrationSystemStatus,
        })
      ).toBe(assertion.expected);
    });
  });
});
