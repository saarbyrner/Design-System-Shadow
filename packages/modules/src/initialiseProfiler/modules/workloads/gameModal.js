// @flow
import renderGameModal from '@kitman/modules/src/GameModal';
import $ from 'jquery';

const gameModal = () => {
  const openGameModal = (e: Event) => {
    e.preventDefault();
    // Flow doesn’t know an event has `dataset` property.
    // $FlowIgnore[prop-missing]
    const eventId = e.currentTarget.dataset.eventId;
    // Flow doesn’t know an event has `dataset` property.
    // $FlowIgnore[prop-missing]
    const formMode = e.currentTarget.dataset.formMode;

    renderGameModal(eventId, formMode);
  };

  $(document).ready(() => {
    const gameModalLink = document.getElementsByClassName('js-gameModalLink');

    for (let i = 0; i < gameModalLink.length; i++) {
      gameModalLink[i].addEventListener('click', openGameModal);
    }
  });
};

export default gameModal;
