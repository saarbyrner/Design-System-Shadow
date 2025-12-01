import { handler as searchFormAnswerSets } from './search';
import { handler as getFormAnswerSetsAthletes } from './getFormAnswerSetsAthletes';
import { handler as searchFreeAgents } from './searchFreeAgents';
import { handler as searchByAthlete } from './searchByAthlete';

export default [
  searchFormAnswerSets,
  getFormAnswerSetsAthletes,
  searchFreeAgents,
  searchByAthlete,
];
