// @flow

import { handler as fetchAssignees } from './fetchAssignees';
import { handler as fetchShortRulesetsHandler } from './fetchShortRulesets';
import { handler as fetchRulesetsHandler } from './fetchRulesets';
import { handler as fetchVersionsHandler } from './fetchVersions';
import { handler as fetchVersionHandler } from './fetchVersion';
import { handler as fetchPredicateOptionsHandler } from './fetchPredicateOptions';

import { handler as updateAssignees } from './updateAssignees';
import { handler as updateOwnerVersionsHandler } from './updateOwnerVersions';
import { handler as updateOwnerRulesetHandler } from './updateOwnerRuleset';
import { handler as updateOwnerRulesetsHandler } from './updateOwnerRulesets';

import { handler as publishVersion } from './publishVersion';

import { handler as saveCondition } from './saveCondition';
import { handler as saveFollowupQuestions } from './saveFollowupQuestions';
import { handler as saveVersion } from './saveVersion';
import { handler as deleteCondition } from './deleteCondition';

export default [
  fetchAssignees,
  fetchRulesetsHandler,
  fetchShortRulesetsHandler,
  fetchVersionsHandler,
  fetchVersionHandler,
  fetchPredicateOptionsHandler,
  updateAssignees,
  updateOwnerVersionsHandler,
  updateOwnerRulesetHandler,
  updateOwnerRulesetsHandler,
  publishVersion,
  saveCondition,
  saveFollowupQuestions,
  saveVersion,
  deleteCondition,
];
