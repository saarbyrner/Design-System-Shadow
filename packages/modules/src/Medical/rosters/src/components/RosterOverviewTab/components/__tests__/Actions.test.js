import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical';
import { defaultConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';

import Actions from '../Actions';

jest.mock('@kitman/common/src/hooks/useEventTracking');

const mockTrackEvent = jest.fn();

const defaultProps = {
  onOpenPanel: () => {},
  filters: {
    athlete_name: null,
    positions: [],
    squads: [],
    availabilities: [],
    issues: [],
  },
  t: i18nextTranslateStub(),
};

const defaultPermissions = {
  medical: {
    ...defaultMedicalPermissions,
  },
  concussion: {
    ...defaultConcussionPermissions,
  },
};

const renderTestComponent = (permissions = defaultPermissions, props) =>
  renderWithRedux(
    <MockedPermissionContextProvider
      permissionsContext={{ ...DEFAULT_CONTEXT_VALUE, permissions }}
    >
      <Actions {...{ ...defaultProps, ...props }} />
    </MockedPermissionContextProvider>,
    {
      useGlobalStore: false,
      preloadedState: { globalApi: {} },
    }
  );

const openMenu = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Add' }));
};

const onCallFunction = jest.fn();

describe('<Actions/>', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  });
  describe('[PERMISSIONS]', () => {
    it('does not render actions when the user has no permissions', () => {
      renderTestComponent();
      expect(() =>
        screen.getByRole('button', {
          name: 'Add',
        })
      ).toThrow();
    });

    it('renders when the user has at least one permissions', async () => {
      renderTestComponent({
        ...defaultPermissions,
        medical: {
          ...defaultPermissions.medical,
          issues: {
            canCreate: true,
          },
        },
      });

      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('medical.issues.canCreate has the Injury/ Illness option', async () => {
      renderTestComponent({
        ...defaultPermissions,
        medical: {
          ...defaultPermissions.medical,
          issues: {
            canCreate: true,
          },
        },
      });

      await openMenu();
      expect(screen.getByText('Injury/ Illness')).toBeInTheDocument();
    });

    it('medical.notes.canCreate has the Note option', async () => {
      renderTestComponent({
        ...defaultPermissions,
        medical: {
          ...defaultPermissions.medical,
          notes: {
            canCreate: true,
          },
        },
      });

      await openMenu();
      expect(screen.getByText('Note')).toBeInTheDocument();
    });

    it('medical.modifications.canCreate has the Modification option', async () => {
      renderTestComponent({
        ...defaultPermissions,
        medical: {
          ...defaultPermissions.medical,
          modifications: {
            canCreate: true,
          },
        },
      });

      await openMenu();
      expect(screen.getByText('Modification')).toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAGS] medical parity', () => {
    const testCases = [
      {
        title: 'Diagnostic',
        perm: { diagnostics: { canCreate: true } },
        permTitle: 'diagnostics',
        calledWith: 'DIAGNOSTIC',
      },
      {
        flag: 'medical-documents-files-area',
        title: 'File',
        perm: { documents: { canCreate: true } },
        permTitle: 'documents',
        calledWith: 'FILE',
      },
      {
        title: 'Treatment',
        perm: { treatments: { canCreate: true } },
        permTitle: 'treatments',
        calledWith: 'TREATMENT',
      },
      {
        title: 'Allergy',
        perm: { allergies: { canCreate: true } },
        permTitle: 'allergies',
        calledWith: 'ALLERGY',
      },
      {
        flag: 'chronic-injury-illness',
        title: 'Chronic condition',
        perm: { issues: { canCreate: true } },
        permTitle: 'issues',
        calledWith: 'CHRONIC_CONDITION',
      },
      {
        flag: 'medical-alerts-side-panel',
        title: 'Medical Alert',
        perm: { alerts: { canCreate: true } },
        permTitle: 'alerts',
        calledWith: 'MEDICAL_ALERT',
      },
      {
        flag: 'medical-procedure',
        title: 'Procedure',
        perm: { procedures: { canCreate: true } },
        permTitle: 'procedures',
        calledWith: 'PROCEDURE',
      },
      {
        title: 'Vaccination',
        perm: { vaccinations: { canCreate: true } },
        permTitle: 'vaccinations',
        calledWith: 'VACCINATION',
      },
      {
        title: 'TUE',
        perm: { tue: { canCreate: true } },
        permTitle: 'tue',
        calledWith: 'TUE',
      },
    ];
    testCases.forEach((testCase) => {
      describe(`${testCase.flag}`, () => {
        beforeEach(() => {
          window.featureFlags[testCase.flag] = true;
          window.setFlag('pm-show-tue', true);
        });

        afterEach(() => {
          window.featureFlags[testCase.flag] = false;
        });

        it(`does not render the ${testCase.title} option without the permission`, () => {
          renderTestComponent();
          expect(() =>
            screen.getByRole('button', {
              name: 'Add',
            })
          ).toThrow();
        });

        it(`[PERMISSION]: medical.${testCase.permTitle}.canCreate has the ${testCase.title} option`, async () => {
          renderTestComponent(
            {
              ...defaultPermissions,
              medical: {
                ...defaultPermissions.medical,
                ...testCase.perm,
              },
            },
            {
              ...defaultProps,
              onOpenPanel: onCallFunction,
            }
          );

          await openMenu();
          expect(screen.getByText(testCase.title)).toBeInTheDocument();
        });

        it(`[ACTIONS]: calls the correct action`, async () => {
          const user = userEvent.setup();

          renderTestComponent(
            {
              ...defaultPermissions,
              medical: {
                ...defaultPermissions.medical,
                ...testCase.perm,
              },
            },
            {
              ...defaultProps,
              onOpenPanel: onCallFunction,
            }
          );

          await openMenu();
          const tooltipButton = screen.getByRole('button', {
            name: testCase.title,
          });
          await user.click(tooltipButton);
          expect(onCallFunction).toHaveBeenCalledWith(testCase.calledWith);
        });
      });
    });
  });

  describe('[FEATURE FLAGS] concussion', () => {
    const testCases = [
      {
        flag: 'concussion-medical-area',
        title: 'Concussion test',
        subtitle: 'Near point of convergence (NPC)',
        perm: {
          canManageNpcAssessments: true,
          canManageConcussionAssessments: true,
        },
        permTitle: 'canManageNpcAssessments',
      },
      {
        flag: 'concussion-medical-area',
        title: 'Concussion test',
        subtitle: 'King-Devick',
        perm: {
          canManageKingDevickAssessments: true,
          canManageConcussionAssessments: true,
        },
        permTitle: 'canManageKingDevickAssessments',
      },
    ];
    testCases.forEach((testCase) => {
      describe(`${testCase.flag}`, () => {
        beforeEach(() => {
          window.featureFlags[testCase.flag] = true;
        });

        afterEach(() => {
          window.featureFlags[testCase.flag] = false;
        });

        it(`does not render the ${testCase.title} option without the permission`, () => {
          renderTestComponent();
          expect(() =>
            screen.getByRole('button', {
              name: 'Add',
            })
          ).toThrow();
        });

        it(`[PERMISSION]: concussion.${testCase.permTitle}.canCreate has the ${testCase.title} option`, async () => {
          renderTestComponent({
            ...defaultPermissions,
            concussion: {
              ...defaultPermissions.concussion,
              ...testCase.perm,
            },
          });

          await openMenu();
          expect(screen.getByText(testCase.title)).toBeInTheDocument();
        });

        it(`[ACTIONS]: calls the correct action`, async () => {
          renderTestComponent(
            {
              ...defaultPermissions,
              concussion: {
                ...defaultPermissions.concussion,
                ...testCase.perm,
              },
            },
            {
              ...defaultProps,
              onOpenPanel: onCallFunction,
            }
          );

          await openMenu();
          expect(screen.getByText(testCase.title)).toBeInTheDocument();

          expect(screen.getByText(testCase.subtitle)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Mixpanel Events', () => {
    it('[TRACK-EVENT] tracks Add -> Injury/Illness event', async () => {
      const user = userEvent.setup();

      renderTestComponent({
        ...defaultPermissions,
        medical: {
          ...defaultPermissions.medical,
          issues: {
            canCreate: true,
          },
        },
      });

      const addButton = screen.getByRole('button', { name: 'Add' });

      expect(addButton).toBeInTheDocument();

      await user.click(addButton);

      const injuryIllnessButton = screen.getByRole('button', {
        name: 'Injury/ Illness',
      });

      expect(injuryIllnessButton).toBeInTheDocument();

      await user.click(injuryIllnessButton);

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'Click Add -> Injury/Illness',
        {
          level: 'team',
          tab: tabHashes.OVERVIEW,
        }
      );
    });

    it('[TRACK-EVENT] - clickAddMedicalNote', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        ...defaultPermissions,
        medical: {
          ...defaultPermissions.medical,
          notes: {
            canCreate: true,
          },
        },
      });

      await openMenu();
      const noteOption = screen.getByText('Note');
      await user.click(noteOption);
      expect(mockTrackEvent).toHaveBeenCalledWith(
        performanceMedicineEventNames.clickAddMedicalNote,
        {
          level: 'team',
          tab: tabHashes.OVERVIEW,
          actionElement: 'Add menu',
        }
      );
    });
  });
});
