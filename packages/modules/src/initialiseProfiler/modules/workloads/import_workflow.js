import renderImportWorkflow from '@kitman/modules/src/ImportWorkflow';
import $ from 'jquery';
import { TrackEvent } from '@kitman/common/src/utils';
import { transformEvent } from './transform';

const importWorkflow = () => {
  const openImportWorkflowModal = (e) => {
    e.preventDefault();
    const event = JSON.parse(e.currentTarget.dataset.event);

    renderImportWorkflow(transformEvent(event));

    if (window.location.pathname.includes('workloads/training_sessions')) {
      TrackEvent(
        'Import Data',
        'Click',
        'Training Session (View) - Import Data'
      );
    }
  };

  $(document).ready(() => {
    const importWorkflowLinks = document.getElementsByClassName(
      'js-importWorkflowLink'
    );

    for (let i = 0; i < importWorkflowLinks.length; i++) {
      importWorkflowLinks[i].addEventListener('click', openImportWorkflowModal);
      importWorkflowLinks[i].classList.add('js-importWorkflowLink--ready');
    }
  });
};

export default importWorkflow;
