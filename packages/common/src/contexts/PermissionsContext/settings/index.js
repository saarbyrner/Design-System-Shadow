// @flow
import type { SettingsPermissions } from './types';

export const defaultSettingsPermissions: SettingsPermissions = {
  canViewSettingsAthletes: false,
  canManageStaffUsers: false,
  canViewSettingsQuestionnaire: false,
  canViewOrganisationSettings: false,
  canManagePrivacySettings: false,
  canViewSettingsEmergencyContacts: false,
  canViewSettingsInsurancePolicies: false,
  canViewPlanningAdmin: false,
  canViewImports: false,
  canCreateImports: false,
  canManageOfficials: false,
  canRunLeagueExports: false,
  canViewExportsArea: false,
  canManageScouts: false,
  canManageMatchDirectors: false,
  canManageMatchMonitors: false,
  canViewLabels: false,
  canAssignLabels: false,
  isLabelsAdmin: false,
  isSegmentsAdmin: false,
  canViewSegments: false,
  canViewStaffUsers: false,
};

export const setSettingsPermissions = (
  settingsPermissions: Array<string>
): SettingsPermissions => {
  return {
    canViewSettingsAthletes: settingsPermissions?.includes('settings-athletes'),
    canManageStaffUsers: settingsPermissions?.includes('settings-general'),
    canEditSquad: settingsPermissions?.includes('settings-manage-squads'),
    canManageOfficials: settingsPermissions?.includes(
      'settings-manage-officials'
    ),
    canViewSettingsQuestionnaire: settingsPermissions?.includes(
      'settings-questionnaire'
    ),
    canViewOrganisationSettings: settingsPermissions?.includes(
      'organisation-settings'
    ),
    canManagePrivacySettings: settingsPermissions?.includes(
      'manage-privacy-settings'
    ),
    canViewSettingsEmergencyContacts: settingsPermissions?.includes(
      'settings-emergency-contacts'
    ),
    canViewSettingsInsurancePolicies: settingsPermissions?.includes(
      'settings-insurance-policies'
    ),
    canViewPlanningAdmin: settingsPermissions?.includes('planning-admin'),
    canViewImports: settingsPermissions?.includes('view-imports'),
    canCreateImports: settingsPermissions?.includes('create-imports'),
    canRunLeagueExports: settingsPermissions?.includes('league-ops-exports'),
    canViewExportsArea: settingsPermissions?.includes('exports-area'),
    canManageScouts: settingsPermissions?.includes('settings-manage-scouts'),
    canManageMatchDirectors: settingsPermissions?.includes(
      'settings-manage-match-directors'
    ),
    canManageMatchMonitors: settingsPermissions?.includes(
      'settings-manage-match-monitors'
    ),
    canViewLabels: settingsPermissions?.includes('view-labels'),
    canAssignLabels: settingsPermissions?.includes('assign-labels'),
    isLabelsAdmin: settingsPermissions?.includes('labels-admin'),
    isSegmentsAdmin: settingsPermissions?.includes('groups-admin'),
    canViewSegments: settingsPermissions?.includes('view-groups'),
    canViewStaffUsers: settingsPermissions?.includes('view-staff-users'),
  };
};
