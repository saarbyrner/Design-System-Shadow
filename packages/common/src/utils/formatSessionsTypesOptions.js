/* eslint-disable flowtype/require-valid-file-annotation */
// Format Session Types Options to the <GroupedDropdown /> items format
export default (activityGroups) =>
  activityGroups.map((activityGroup) => ({
    name: activityGroup.name,
    id: activityGroup.id,
  }));
