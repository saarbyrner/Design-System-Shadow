import importWorkflow from './import_workflow';
import trainingSessionModal from './trainingSessionModal';
import gameModal from './gameModal';
import workloadPlans from './plans';
import initTurnarounds from './turnarounds';

export default () => {
  importWorkflow();
  trainingSessionModal();
  gameModal();
  workloadPlans();
  initTurnarounds();
};
