import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  ASSOCIATION_ADMIN,
  ORGANISATION_ADMIN,
  ATHLETE,
  STAFF,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import {
  canCreateForm,
  canEditForm,
  canViewForm,
  canApproveForm,
  canEditSection,
  canViewSection,
  canApproveRequirement,
} from '../operations';

describe('canCreateForm', () => {
  [ATHLETE, STAFF].forEach((userType) => {
    describe(`GIVEN userType is ${userType.toUpperCase()}`, () => {
      [
        {
          status: {
            id: 1,
            type: RegistrationStatusEnum.INCOMPLETE,
            name: 'Incomplete',
          },
          expected: true,
        },
        {
          status: {
            id: 2,
            type: RegistrationStatusEnum.APPROVED,
            name: 'Approved',
          },
          expected: false,
        },
        {
          status: {
            id: 3,
            type: RegistrationStatusEnum.PENDING_ORGANISATION,
            name: 'Pending Organisation',
          },
          expected: false,
        },
        {
          status: {
            id: 4,
            type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
            name: 'Rejected Association',
          },
          expected: false,
        },
        {
          status: {
            id: 5,
            type: RegistrationStatusEnum.REJECTED_ORGANISATION,
            name: 'Rejected Organisation',
          },
          expected: false,
        },
        {
          status: {
            id: 6,
            type: RegistrationStatusEnum.PENDING_PAYMENT,
            name: 'Pending Payment',
          },
          expected: false,
        },
      ].forEach((assertion) => {
        describe(`WHEN status is ${assertion.status.type.toUpperCase()}`, () => {
          test(`THEN canCreateForm is ${assertion.expected}`, () => {
            expect(
              canCreateForm({
                key: userType.toLowerCase(),
                userType,
                registrationPermissions: {},
                registrationSystemStatus: assertion.status,
              })
            ).toBe(assertion.expected);
          });
        });
      });
    });
  });

  describe(`GIVEN userType is ${ORGANISATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        [
          {
            status: {
              id: 1,
              type: RegistrationStatusEnum.INCOMPLETE,
              name: 'Incomplete',
            },
            expected: true,
          },
          {
            status: {
              id: 2,
              type: RegistrationStatusEnum.APPROVED,
              name: 'Approved',
            },
            expected: false,
          },
          {
            status: {
              id: 3,
              type: RegistrationStatusEnum.PENDING_ASSOCIATION,
              name: 'Pending Association',
            },
            expected: false,
          },
          {
            status: {
              id: 4,
              type: RegistrationStatusEnum.PENDING_ORGANISATION,
              name: 'Pending Organisation',
            },
            expected: false,
          },
          {
            status: {
              id: 5,
              type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
              name: 'Rejected Association',
            },
            expected: false,
          },
          {
            status: {
              id: 6,
              type: RegistrationStatusEnum.REJECTED_ORGANISATION,
              name: 'Rejected Organisation',
            },
            expected: false,
          },
          {
            status: {
              id: 7,
              type: RegistrationStatusEnum.PENDING_PAYMENT,
              name: 'Pending Payment',
            },
            expected: false,
          },
        ].forEach((assertion) => {
          describe(`AND status is ${assertion.status.type.toUpperCase()}`, () => {
            describe(`AND the permission registration-create-${key} is ${assertion.expected}`, () => {
              test(`THEN canCreateForm is ${assertion.expected}`, () => {
                expect(
                  canCreateForm({
                    key,
                    userType: ORGANISATION_ADMIN,
                    registrationPermissions: {
                      [key]: {
                        canCreate: assertion.expected,
                      },
                    },
                    registrationSystemStatus: assertion.status,
                  })
                ).toBe(assertion.expected);
              });
            });
          });
        });
      });
    });
  });

  describe(`GIVEN userType is ${ASSOCIATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        [
          {
            type: RegistrationStatusEnum.INCOMPLETE,
            name: 'Incomplete',
            id: 1,
          },
          {
            type: RegistrationStatusEnum.APPROVED,
            name: 'Approved',
            id: 2,
          },
          {
            type: RegistrationStatusEnum.PENDING_ASSOCIATION,
            name: 'Pending Association',
            id: 3,
          },
          {
            type: RegistrationStatusEnum.PENDING_ORGANISATION,
            name: 'Pending Organisation',
            id: 4,
          },
          {
            type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
            name: 'Rejected Association',
            id: 5,
          },
        ].forEach((status) => {
          describe(`AND status is ${status.type.toUpperCase()}`, () => {
            test(`THEN canCreateForm is false`, () => {
              expect(
                canCreateForm({
                  key,
                  userType: ASSOCIATION_ADMIN,
                  registrationPermissions: {},
                  registrationSystemStatus: status,
                })
              ).toBe(false);
            });
          });
        });
      });
    });
  });
});

describe('canEditForm', () => {
  [ATHLETE, STAFF].forEach((userType) => {
    describe(`GIVEN userType is ${userType.toUpperCase()}`, () => {
      [
        {
          status: {
            id: 1,
            type: RegistrationStatusEnum.INCOMPLETE,
            name: 'Incomplete',
          },
          expected: false,
        },
        {
          status: {
            id: 2,
            type: RegistrationStatusEnum.APPROVED,
            name: 'Approved',
          },
          expected: false,
        },
        {
          status: {
            id: 3,
            type: RegistrationStatusEnum.PENDING_ORGANISATION,
            name: 'Pending Organisation',
          },
          expected: false,
        },
        {
          status: {
            id: 4,
            type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
            name: 'Rejected Association',
          },
          expected: true,
        },
        {
          status: {
            id: 5,
            type: RegistrationStatusEnum.REJECTED_ORGANISATION,
            name: 'Rejected Organisation',
          },
          expected: true,
        },
        {
          status: {
            id: 6,
            type: RegistrationStatusEnum.PENDING_PAYMENT,
            name: 'Pending Payment',
          },
          expected: false,
        },
      ].forEach((assertion) => {
        describe(`WHEN status is ${assertion.status.type.toUpperCase()}`, () => {
          test(`THEN canEditForm is ${assertion.expected}`, () => {
            expect(
              canEditForm({
                key: userType.toLowerCase(),
                userType,
                registrationPermissions: {},
                registrationSystemStatus: assertion.status,
              })
            ).toBe(assertion.expected);
          });
        });
      });
    });
  });

  describe(`GIVEN userType is ${ORGANISATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        [true, false].forEach((permission) => {
          describe(`AND the permission registration-edit-${key} is ${permission}`, () => {
            [
              {
                status: {
                  id: 1,
                  type: RegistrationStatusEnum.INCOMPLETE,
                  name: 'Incomplete',
                },
                expected: false,
              },
              {
                status: {
                  id: 2,
                  type: RegistrationStatusEnum.APPROVED,
                  name: 'Approved',
                },
                expected: false,
              },
              {
                status: {
                  id: 3,
                  type: RegistrationStatusEnum.PENDING_ASSOCIATION,
                  name: 'Pending Association',
                },
                expected: false,
              },
              {
                status: {
                  id: 3,
                  type: RegistrationStatusEnum.PENDING_ORGANISATION,
                  name: 'Pending Organisation',
                },
                expected: permission,
              },
              {
                status: {
                  id: 4,
                  type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
                  name: 'Rejected Association',
                },
                expected: permission,
              },
              {
                status: {
                  id: 5,
                  type: RegistrationStatusEnum.REJECTED_ORGANISATION,
                  name: 'Rejected Organisation',
                },
                expected: permission,
              },
              {
                status: {
                  id: 6,
                  type: RegistrationStatusEnum.PENDING_PAYMENT,
                  name: 'Pending Payment',
                },
                expected: false,
              },
            ].forEach((assertion) => {
              describe(`AND status is ${assertion.status.type.toUpperCase()}`, () => {
                test(`THEN canEditForm is ${assertion.expected}`, () => {
                  expect(
                    canEditForm({
                      key,
                      userType: ORGANISATION_ADMIN,
                      registrationPermissions: {
                        [key]: {
                          canEdit: permission,
                        },
                      },
                      registrationSystemStatus: assertion.status,
                    })
                  ).toBe(assertion.expected);
                });
              });
            });
          });
        });
      });
    });
  });

  describe(`GIVEN userType is ${ASSOCIATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        [true, false].forEach((permission) => {
          describe(`AND the permission registration-edit-${key} is ${permission}`, () => {
            [
              {
                status: {
                  id: 1,
                  type: RegistrationStatusEnum.INCOMPLETE,
                  name: 'Incomplete',
                },
                expected: false,
              },
              {
                status: {
                  id: 2,
                  type: RegistrationStatusEnum.APPROVED,
                  name: 'Approved',
                },
                expected: false,
              },
              {
                status: {
                  id: 3,
                  type: RegistrationStatusEnum.PENDING_ASSOCIATION,
                  name: 'Pending Association',
                },
                expected: permission,
              },
              {
                status: {
                  id: 4,
                  type: RegistrationStatusEnum.PENDING_ORGANISATION,
                  name: 'Pending Organisation',
                },
                expected: permission,
              },
              {
                status: {
                  id: 5,
                  type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
                  name: 'Rejected Association',
                },
                expected: permission,
              },
              {
                status: {
                  id: 6,
                  type: RegistrationStatusEnum.REJECTED_ORGANISATION,
                  name: 'Rejected Organisation',
                },
                expected: permission,
              },
              {
                status: {
                  id: 7,
                  type: RegistrationStatusEnum.PENDING_PAYMENT,
                  name: 'Pending Payment',
                },
                expected: permission,
              },
            ].forEach((assertion) => {
              describe(`AND status is ${assertion.status.type.toUpperCase()}`, () => {
                test(`THEN canEditForm is ${assertion.expected}`, () => {
                  expect(
                    canEditForm({
                      key,
                      userType: ASSOCIATION_ADMIN,
                      registrationPermissions: {
                        [key]: {
                          canEdit: permission,
                        },
                      },
                      registrationSystemStatus: assertion.status,
                    })
                  ).toBe(assertion.expected);
                });
              });
            });
          });
        });
      });
    });
  });
});

describe('canViewForm', () => {
  [ATHLETE, STAFF].forEach((userType) => {
    describe(`GIVEN userType is ${userType.toUpperCase()}`, () => {
      test(`THEN canViewForm is true`, () => {
        expect(
          canViewForm({
            key: userType.toLowerCase(),
            userType,
            registrationPermissions: {},
          })
        ).toBe(true);
      });
    });
  });

  describe(`GIVEN userType is ${ORGANISATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        [
          { view: false, requirements: false, outcome: false },
          { view: false, requirements: true, outcome: false },
          { view: true, requirements: false, outcome: false },
          { view: true, requirements: true, outcome: true },
        ].forEach((perms) => {
          describe(`AND the permission registration-view-requirements is ${perms.requirements}`, () => {
            describe(`AND the permission registration-view-${key} is ${perms.view}`, () => {
              test(`THEN canViewForm is ${perms.outcome}`, () => {
                expect(
                  canViewForm({
                    key,
                    userType: ORGANISATION_ADMIN,
                    registrationPermissions: {
                      [key]: {
                        canView: perms.view,
                      },
                      requirements: {
                        canView: perms.requirements,
                      },
                    },
                  })
                ).toBe(perms.outcome);
              });
            });
          });
        });
      });
    });
  });

  describe(`GIVEN userType is ${ASSOCIATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        [
          { view: false, requirements: false, outcome: false },
          { view: false, requirements: true, outcome: false },
          { view: true, requirements: false, outcome: false },
          { view: true, requirements: true, outcome: true },
        ].forEach((perms) => {
          describe(`AND the permission registration-view-requirements is ${perms.requirements}`, () => {
            describe(`AND the permission registration-view-${key} is ${perms.view}`, () => {
              test(`THEN canViewForm is ${perms.outcome}`, () => {
                expect(
                  canViewForm({
                    key,
                    userType: ORGANISATION_ADMIN,
                    registrationPermissions: {
                      [key]: {
                        canView: perms.view,
                      },
                      requirements: {
                        canView: perms.requirements,
                      },
                    },
                  })
                ).toBe(perms.outcome);
              });
            });
          });
        });
      });
    });
  });
});

describe('canApproveForm', () => {
  [ATHLETE, STAFF].forEach((key) => {
    describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
      [
        {
          id: 1,
          type: RegistrationStatusEnum.INCOMPLETE,
          name: 'Incomplete',
        },
        {
          id: 2,
          type: RegistrationStatusEnum.APPROVED,
          name: 'Approved',
        },
        {
          id: 3,
          type: RegistrationStatusEnum.PENDING_ASSOCIATION,
          name: 'Pending Association',
        },
        {
          id: 4,
          type: RegistrationStatusEnum.PENDING_ORGANISATION,
          name: 'Pending Organisation',
        },
        {
          id: 5,
          type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
          name: 'Rejected Association',
        },
        {
          id: 6,
          type: RegistrationStatusEnum.REJECTED_ORGANISATION,
          name: 'Rejected Organisation',
        },
        {
          id: 7,
          type: RegistrationStatusEnum.PENDING_PAYMENT,
          name: 'Pending Payment',
        },
      ].forEach((status) => {
        describe(`AND status is ${status.type.toUpperCase()}`, () => {
          test(`THEN canApproveForm is false`, () => {
            expect(
              canApproveForm({
                key,
                userType: key,
                registrationPermissions: {},
                registrationSystemStatus: status,
              })
            ).toBe(false);
          });
        });
      });
    });
  });

  describe(`GIVEN userType is ${ORGANISATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        describe(`WHEN permissions registration-manage-status & registration-view-requirements & registration-view-${key} are all true`, () => {
          test(`THEN canApproveForm is true for ${RegistrationStatusEnum.PENDING_ORGANISATION.toUpperCase()} status`, () => {
            expect(
              canApproveForm({
                key,
                userType: ORGANISATION_ADMIN,
                registrationPermissions: {
                  [key]: {
                    canView: true,
                  },
                  requirements: {
                    canView: true,
                  },
                  status: {
                    canEdit: true,
                  },
                },
                registrationSystemStatus: {
                  id: 4,
                  type: RegistrationStatusEnum.PENDING_ORGANISATION,
                  name: 'Pending Organisation',
                },
              })
            ).toBe(true);
          });
        });
      });
    });
  });
  describe(`GIVEN userType is ${ASSOCIATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        describe(`WHEN permissions registration-manage-status & registration-view-requirements & registration-view-${key} are all true`, () => {
          describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
            [
              {
                id: 1,
                type: RegistrationStatusEnum.INCOMPLETE,
                name: 'Incomplete',
              },
              {
                id: 2,
                type: RegistrationStatusEnum.APPROVED,
                name: 'Approved',
              },
              {
                id: 3,
                type: RegistrationStatusEnum.PENDING_ASSOCIATION,
                name: 'Pending Association',
              },
              {
                id: 4,
                type: RegistrationStatusEnum.PENDING_ORGANISATION,
                name: 'Pending Organisation',
              },
              {
                id: 5,
                type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
                name: 'Rejected Association',
              },
              {
                id: 6,
                type: RegistrationStatusEnum.REJECTED_ORGANISATION,
                name: 'Rejected Organisation',
              },
              {
                id: 7,
                type: RegistrationStatusEnum.PENDING_PAYMENT,
                name: 'Pending Payment',
              },
            ].forEach((status) => {
              describe(`AND status is ${status.type.toUpperCase()}`, () => {
                test(`THEN canApproveForm is true for ${status.type.toUpperCase()}`, () => {
                  expect(
                    canApproveForm({
                      key,
                      userType: ORGANISATION_ADMIN,
                      registrationPermissions: {
                        [key]: {
                          canView: true,
                        },
                        requirements: {
                          canView: true,
                        },
                        status: {
                          canEdit: true,
                        },
                      },
                      registrationSystemStatus: {
                        id: 4,
                        type: RegistrationStatusEnum.PENDING_ORGANISATION,
                        name: 'Pending Organisation',
                      },
                    })
                  ).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });
});

describe('canEditSection', () => {
  [ATHLETE, STAFF].forEach((userType) => {
    describe(`GIVEN userType is ${userType.toUpperCase()}`, () => {
      [
        {
          status: {
            id: 1,
            type: RegistrationStatusEnum.INCOMPLETE,
            name: 'Incomplete',
          },
          expected: false,
        },
        {
          status: {
            id: 2,
            type: RegistrationStatusEnum.APPROVED,
            name: 'Approved',
          },
          expected: false,
        },
        {
          status: {
            id: 3,
            type: RegistrationStatusEnum.PENDING_ASSOCIATION,
            name: 'Pending Association',
          },
          expected: false,
        },
        {
          status: {
            id: 4,
            type: RegistrationStatusEnum.PENDING_ORGANISATION,
            name: 'Pending Organisation',
          },
          expected: false,
        },
        {
          status: {
            id: 5,
            type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
            name: 'Rejected Association',
          },
          expected: true,
        },
        {
          status: {
            id: 6,
            type: RegistrationStatusEnum.REJECTED_ORGANISATION,
            name: 'Rejected Organisation',
          },
          expected: true,
        },
        {
          status: {
            id: 7,
            type: RegistrationStatusEnum.PENDING_PAYMENT,
            name: 'Pending Payment',
          },
          expected: false,
        },
      ].forEach((assertion) => {
        describe(`WHEN status is ${assertion.status.type.toUpperCase()} and isRegistrationCompletable is truthy`, () => {
          test(`THEN canEditSection is ${assertion.expected}`, () => {
            expect(
              canEditSection({
                userType,
                registrationSystemStatus: assertion.status,
                isRegistrationCompletable: true,
              })
            ).toBe(assertion.expected);
          });
        });

        describe(`WHEN status is ${assertion.status.type.toUpperCase()} and isRegistrationCompletable is falsy`, () => {
          test(`THEN canEditSection is false`, () => {
            expect(
              canEditSection({
                userType,
                registrationSystemStatus: assertion.status,
                isRegistrationCompletable: false,
              })
            ).toBe(false);
          });
        });
      });
    });
  });
});

describe('canViewSection', () => {
  [ATHLETE, STAFF].forEach((userType) => {
    describe(`GIVEN userType is ${userType.toUpperCase()}`, () => {
      [
        {
          status: {
            id: 1,
            type: RegistrationStatusEnum.INCOMPLETE,
            name: 'Incomplete',
          },
          expected: false,
        },
        {
          status: {
            id: 2,
            type: RegistrationStatusEnum.APPROVED,
            name: 'Approved',
          },
          expected: false,
        },
        {
          status: {
            id: 3,
            type: RegistrationStatusEnum.PENDING_ORGANISATION,
            name: 'Pending Organisation',
          },
          expected: true,
        },
        {
          status: {
            id: 5,
            type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
            name: 'Rejected Association',
          },
          expected: true,
        },
        {
          status: {
            id: 6,
            type: RegistrationStatusEnum.REJECTED_ORGANISATION,
            name: 'Rejected Organisation',
          },
          expected: true,
        },
        {
          status: {
            id: 7,
            type: RegistrationStatusEnum.PENDING_PAYMENT,
            name: 'Pending Payment',
          },
          expected: true,
        },
      ].forEach((assertion) => {
        describe(`WHEN status is ${assertion.status.type.toUpperCase()}`, () => {
          test(`THEN canViewSection is ${assertion.expected}`, () => {
            expect(
              canViewSection({
                userType,
                registrationPermissions: {},
                registrationSystemStatus: assertion.status,
              })
            ).toBe(assertion.expected);
          });
        });
      });
    });
  });

  describe(`GIVEN userType is ${ORGANISATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        [
          {
            status: {
              id: 1,
              type: RegistrationStatusEnum.INCOMPLETE,
              name: 'Incomplete',
            },
            expected: false,
          },
          {
            status: {
              id: 3,
              type: RegistrationStatusEnum.PENDING_ASSOCIATION,
              name: 'Pending Association',
            },
            expected: true,
          },
          {
            status: {
              id: 4,
              type: RegistrationStatusEnum.PENDING_ORGANISATION,
              name: 'Pending Organisation',
            },
            expected: true,
          },
          {
            status: {
              id: 5,
              type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
              name: 'Rejected Association',
            },
            expected: true,
          },
          {
            status: {
              id: 6,
              type: RegistrationStatusEnum.REJECTED_ORGANISATION,
              name: 'Rejected Organisation',
            },
            expected: true,
          },
          {
            status: {
              id: 7,
              type: RegistrationStatusEnum.PENDING_PAYMENT,
              name: 'Pending Payment',
            },
            expected: true,
          },
        ].forEach((assertion) => {
          describe(`AND status is ${assertion.status.type.toUpperCase()}`, () => {
            describe(`AND the permission registration-create-${key} is ${assertion.expected}`, () => {
              test(`THEN canViewSection is ${assertion.expected}`, () => {
                expect(
                  canViewSection({
                    userType: ORGANISATION_ADMIN,
                    registrationPermissions: {
                      [key]: {
                        canView: assertion.expected,
                      },
                    },
                    registrationSystemStatus: assertion.status,
                  })
                ).toBe(assertion.expected);
              });
            });
          });
        });
      });
    });
  });

  describe(`GIVEN userType is ${ASSOCIATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        [
          {
            status: {
              id: 1,
              type: RegistrationStatusEnum.INCOMPLETE,
              name: 'Incomplete',
            },
            expected: false,
          },
          {
            status: {
              id: 3,
              type: RegistrationStatusEnum.PENDING_ASSOCIATION,
              name: 'Pending Association',
            },
            expected: true,
          },
          {
            status: {
              id: 4,
              type: RegistrationStatusEnum.PENDING_ORGANISATION,
              name: 'Pending Organisation',
            },
            expected: true,
          },
          {
            status: {
              id: 5,
              type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
              name: 'Rejected Association',
            },
            expected: true,
          },
          {
            status: {
              id: 6,
              type: RegistrationStatusEnum.REJECTED_ORGANISATION,
              name: 'Rejected Organisation',
            },
            expected: true,
          },
          {
            status: {
              id: 7,
              type: RegistrationStatusEnum.PENDING_PAYMENT,
              name: 'Pending Payment',
            },
            expected: true,
          },
        ].forEach((assertion) => {
          describe(`AND status is ${assertion.status.type.toUpperCase()}`, () => {
            describe(`AND the permission registration-create-${key} is ${assertion.expected}`, () => {
              test(`THEN canViewSection is ${assertion.expected}`, () => {
                expect(
                  canViewSection({
                    userType: ASSOCIATION_ADMIN,
                    registrationPermissions: {
                      [key]: {
                        canView: assertion.expected,
                      },
                    },
                    registrationSystemStatus: assertion.status,
                  })
                ).toBe(assertion.expected);
              });
            });
          });
        });
      });
    });
  });
});

describe('canApproveRequirement', () => {
  [ATHLETE, STAFF].forEach((key) => {
    describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
      [
        {
          type: RegistrationStatusEnum.INCOMPLETE,
          name: 'Incomplete',
          id: 1,
        },
        {
          type: RegistrationStatusEnum.APPROVED,
          name: 'Approved',
          id: 2,
        },
        {
          type: RegistrationStatusEnum.PENDING_ASSOCIATION,
          name: 'Pending Association',
          id: 3,
        },
        {
          type: RegistrationStatusEnum.PENDING_ORGANISATION,
          name: 'Pending Organisation',
          id: 4,
        },
        {
          type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
          name: 'Rejected Association',
          id: 5,
        },
        {
          type: RegistrationStatusEnum.REJECTED_ORGANISATION,
          name: 'Rejected Organisation',
          id: 6,
        },
      ].forEach((status) => {
        describe(`AND status is ${status.type.toUpperCase()}`, () => {
          test(`THEN canApproveRequirement is false`, () => {
            expect(
              canApproveRequirement({
                key,
                userType: key,
                registrationPermissions: {},
                registrationSystemStatus: status,
              })
            ).toBe(false);
          });
        });
      });
    });
  });

  describe(`GIVEN userType is ${ORGANISATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        describe(`WHEN permissions registration-manage-status & registration-view-requirements & registration-view-${key} are all true`, () => {
          describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
            [
              {
                type: RegistrationStatusEnum.PENDING_ORGANISATION,
                name: 'Pending Organisation',
                id: 4,
              },
              {
                type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
                name: 'Rejected Association',
                id: 5,
              },
              {
                type: RegistrationStatusEnum.REJECTED_ORGANISATION,
                name: 'Rejected Organisation',
                id: 6,
              },
            ].forEach((status) => {
              describe(`AND status is ${status.type.toUpperCase()}`, () => {
                test(`THEN canApproveRequirement is true for ${status.type.toUpperCase()}`, () => {
                  expect(
                    canApproveRequirement({
                      key,
                      userType: ORGANISATION_ADMIN,
                      registrationPermissions: {
                        [key]: {
                          canView: true,
                        },
                        requirements: {
                          canView: true,
                        },
                        status: {
                          canEdit: true,
                        },
                      },
                      registrationSystemStatus: status,
                    })
                  ).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });
  describe(`GIVEN userType is ${ASSOCIATION_ADMIN.toUpperCase()}`, () => {
    [ATHLETE, STAFF].forEach((key) => {
      describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
        describe(`WHEN permissions registration-manage-status & registration-view-requirements & registration-view-${key} are all true`, () => {
          describe(`WHEN the form owner is of type ${key.toUpperCase()} `, () => {
            [
              {
                type: RegistrationStatusEnum.INCOMPLETE,
                name: 'Incomplete',
                id: 1,
              },
              {
                type: RegistrationStatusEnum.APPROVED,
                name: 'Approved',
                id: 2,
              },
              {
                type: RegistrationStatusEnum.PENDING_ASSOCIATION,
                name: 'Pending Association',
                id: 3,
              },
              {
                type: RegistrationStatusEnum.PENDING_ORGANISATION,
                name: 'Pending Organisation',
                id: 4,
              },
              {
                type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
                name: 'Rejected Association',
                id: 5,
              },
            ].forEach((status) => {
              describe(`AND status is ${status.type.toUpperCase()}`, () => {
                test(`THEN canApproveRequirement is true for ${status.type.toUpperCase()}`, () => {
                  expect(
                    canApproveRequirement({
                      key,
                      userType: ASSOCIATION_ADMIN,
                      registrationPermissions: {
                        [key]: {
                          canView: true,
                        },
                        requirements: {
                          canView: true,
                        },
                        status: {
                          canEdit: true,
                        },
                      },
                      registrationSystemStatus: status,
                    })
                  ).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });
});
