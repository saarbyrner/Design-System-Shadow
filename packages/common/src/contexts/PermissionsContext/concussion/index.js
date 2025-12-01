// @flow
export const defaultConcussionPermissions = {
  canAttachConcussionAssessments: false,
  canViewConcussionAssessments: false,
  canManageConcussionAssessments: false,
  canManageNpcAssessments: false,
  canViewNpcAssessments: false,
  canManageKingDevickAssessments: false,
  canViewKingDevickAssessments: false,
  canDeleteConcussionAssessments: false,
};

export const setConcussionPermissions = (
  concussionPermissions: Array<string>
) => {
  return {
    canAttachConcussionAssessments: concussionPermissions?.includes(
      'attach-concussion-assessments'
    ),
    canManageConcussionAssessments: concussionPermissions?.includes(
      'manage-concussion-assessments'
    ),
    canViewConcussionAssessments: concussionPermissions?.includes(
      'view-concussion-assessments'
    ),
    canManageNpcAssessments: concussionPermissions?.includes(
      'manage-npc-assessments'
    ),
    canViewNpcAssessments: concussionPermissions?.includes(
      'view-npc-assessments'
    ),
    canManageKingDevickAssessments: concussionPermissions?.includes(
      'manage-king-devick-assessments'
    ),
    canViewKingDevickAssessments: concussionPermissions?.includes(
      'view-king-devick-assessments'
    ),
    canDeleteConcussionAssessments: concussionPermissions?.includes(
      'delete-concussion-assessments'
    ),
  };
};
