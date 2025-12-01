/* eslint-disable func-names */
// /app/views/users/_user_permissions_form.html.erb
export default () => {
  $(document).ready(() => {
    const userPermissionGroupRootElement = document.getElementById(
      'user_permission_group_id'
    );
    if (userPermissionGroupRootElement) {
      const permissionGroups = JSON.parse(
        userPermissionGroupRootElement.dataset.permissionGroups
      );

      $('#user_permission_group_id').on('change', function () {
        const permissions = permissionGroups[$(this).val()];
        if (typeof permissions !== 'undefined') {
          $('.js-permissions-checkbox').prop('checked', false);
          permissions.forEach((p) => {
            $(`#permissions_${p}`).prop('checked', true);
          });
        }
      });
    }
  });
};
