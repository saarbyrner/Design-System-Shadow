export default () => {
  $(document).ready(() => {
    const form = document.getElementById('activity-filter');
    $('#activity-filter-select').on('changed.bs.select', () => {
      $(form).submit();
    });
  });
};
