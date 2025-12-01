import { REDUCER_KEY as registrationRequirementsSlice } from '../../slices/registrationRequirementsSlice';

import {
  getRequirementId,
  getUserId,
  getRegistrationProfile,
  getRegistrationProfileStatus,
  getRegistrationSystemStatusForCurrentRequirement,
  getIsPanelOpen,
  getRequirementById,
  getPanelFormElement,
  getIsSubmitStatusDisabled,
  getSelectedApprovalStatus,
  getSelectedApprovalAnnotation,
  getIsSubmitDisabledFactory,
  getRegistrationSectionStatus,
  getSectionStatuses,
  getPanelStatus,
  getPanelFormSectionId,
} from '../registrationRequirementsSelectors';

describe('Registration Requirements Selectors', () => {
  const MOCK_STATE = {
    [registrationRequirementsSlice]: {
      requirementId: 1,
      userId: 1,
      profile: {
        registration_status: { status: 'complete' },
        registrations: [
          {
            registration_requirement: { id: 1 },
            registration_system_status: {
              id: 1,
              type: 'approved',
              name: 'Approved',
            },
          },
        ],
      },
      panel: {
        isOpen: true,
        formElement: {
          id: 25681,
          element_id: 'playerdetails',
          title: 'Player Details',
        },
        sectionId: 2,
        status: 'active',
      },
      approval: {
        status: 'pending',
        annotation: 'an annotation',
      },
      statuses: [{ type: 'pending' }, { type: 'approved' }],
    },
  };

  it('getRequirementId()', () => {
    expect(getRequirementId(MOCK_STATE)).toBe(1);
  });

  it('getUserId()', () => {
    expect(getUserId(MOCK_STATE)).toBe(1);
  });

  it('getRegistrationProfile()', () => {
    expect(getRegistrationProfile(MOCK_STATE)).toEqual(
      MOCK_STATE[registrationRequirementsSlice].profile
    );
  });

  it('getRegistrationProfileStatus()', () => {
    const selector = getRegistrationProfileStatus();
    expect(selector(MOCK_STATE)).toBe('complete');
  });

  it('getIsPanelOpen()', () => {
    expect(getIsPanelOpen(MOCK_STATE)).toBe(true);
  });

  it('getPanelFormElement()', () => {
    expect(getPanelFormElement(MOCK_STATE)).toEqual(
      MOCK_STATE[registrationRequirementsSlice].panel.formElement
    );
  });

  it('getPanelFormSectionId()', () => {
    expect(getPanelFormSectionId(MOCK_STATE)).toBe(2);
  });

  it('getPanelStatus()', () => {
    expect(getPanelStatus(MOCK_STATE)).toBe('active');
  });

  it('getRequirementById()', () => {
    const selector = getRequirementById();
    expect(selector(MOCK_STATE)).toEqual(
      MOCK_STATE[registrationRequirementsSlice].profile.registrations[0]
    );
  });

  it('getIsSubmitStatusDisabled()', () => {
    expect(getIsSubmitStatusDisabled(MOCK_STATE)).toBe(false);
  });

  it('getSelectedApprovalStatus()', () => {
    expect(getSelectedApprovalStatus(MOCK_STATE)).toBe('pending');
  });

  it('getSectionStatuses()', () => {
    expect(getSectionStatuses(MOCK_STATE)).toEqual(
      MOCK_STATE[registrationRequirementsSlice].statuses
    );
  });

  it('getSelectedApprovalAnnotation()', () => {
    expect(getSelectedApprovalAnnotation(MOCK_STATE)).toBe('an annotation');
  });

  it('getIsSubmitDisabledFactory()', () => {
    const selector = getIsSubmitDisabledFactory();
    expect(selector(MOCK_STATE)).toBe(false);
  });

  it('getRegistrationSectionStatus()', () => {
    const selector = getRegistrationSectionStatus();
    expect(selector(MOCK_STATE)).toEqual([{ type: 'pending' }]);
  });

  it('getRegistrationSystemStatusForCurrentRequirement()', () => {
    const selector = getRegistrationSystemStatusForCurrentRequirement();
    expect(selector(MOCK_STATE)).toEqual({
      type: 'approved',
      name: 'Approved',
      id: 1,
    });
  });
});
