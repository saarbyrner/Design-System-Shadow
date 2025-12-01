/* eslint-disable func-names */
//------------------------------------------------------------------------
// /app/views/shared/workloads/_turnarounds.html.erb

const initTurnarounds = () => {
  $(document).ready(() => {
    const turnaroundsRootElement = document.getElementById(
      'workload_turnarounds'
    );
    if (turnaroundsRootElement) {
      const selectedTurnaroundId =
        turnaroundsRootElement.dataset.selectedTurnaroundId;
      $(`#turnaroundTabs a[href="#turnaround-${selectedTurnaroundId}"]`).tab(
        'show'
      );
      $('#turnaroundTabs a').on('click', function (e) {
        e.preventDefault();
        // Set the active tab unless the 'More' tab is clicked
        if ($(this).attr('href') !== '#') {
          $(this).tab('show');
        }
      });
    }
  });
};

export default initTurnarounds;
