import initAvailability from './charts_initialisers/availability';
import initSquadInjuryOccurrence from './charts_initialisers/squad_injury_occurrence';
import initSquadInjuryClassification from './charts_initialisers/squad_injury_classification';
import initInjuryProfile from './charts_initialisers/injury_profile';
import initSquadSitAndReach from './charts_initialisers/squad_sit_and_reach';
import initDaysAbsenceInjury from './charts_initialisers/days_absence_injury';
import initInjuryByActivity from './charts_initialisers/injury_by_activity';
import initSandcInjuries from './charts_initialisers/sandc_injuries';
import initSquadInjuryClassificationBreakdown from './charts_initialisers/squad_injury_classification_breakdown';
import initSquadInjuryOccurrenceBreakdown from './charts_initialisers/squad_injury_occurrence_breakdown';
import initSquadMoodAndStress from './charts_initialisers/squad_mood_and_stress';
import initWorkloadsAthletes from './charts_initialisers/workloads_athletes';
import initWorkload from './charts_initialisers/workload';
import initSpline from './charts_initialisers/spline';
import initSplineLr from './charts_initialisers/spline_lr';

export default () => {
  initAvailability();
  initSquadInjuryOccurrence();
  initSquadInjuryClassification();
  initInjuryProfile();
  initSquadSitAndReach();
  initDaysAbsenceInjury();
  initInjuryByActivity();
  initSandcInjuries();
  initSquadInjuryClassificationBreakdown();
  initSquadInjuryOccurrenceBreakdown();
  initSquadMoodAndStress();
  initWorkloadsAthletes();
  initWorkload();
  initSpline();
  initSplineLr();
};

export const initChartsInModal = () => {
  initSquadInjuryClassificationBreakdown();
  initSquadInjuryOccurrenceBreakdown();
};
