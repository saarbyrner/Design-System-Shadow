import renderTrainingSessionModal from '@kitman/modules/src/TrainingSessionModal';
import $ from 'jquery';

const trainingSessionModal = () => {
  const openTrainingSessionModal = (e) => {
    e.preventDefault();
    const formMode = e.currentTarget.dataset.formMode;
    const eventId = e.currentTarget.dataset.eventId;

    renderTrainingSessionModal(eventId, formMode);
  };

  $(document).ready(() => {
    const trainingSessionModalLink = document.getElementsByClassName(
      'js-trainingSessionModalLink'
    );

    for (let i = 0; i < trainingSessionModalLink.length; i++) {
      trainingSessionModalLink[i].addEventListener(
        'click',
        openTrainingSessionModal
      );
    }
  });
};

export default trainingSessionModal;
