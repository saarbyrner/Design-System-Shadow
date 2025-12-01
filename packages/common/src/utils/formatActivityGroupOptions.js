/* eslint-disable flowtype/require-valid-file-annotation */
// Format sideOptions to the <GroupedDropdown /> items format
export default (activityGroups) => {
  const formattedActivityGroupOptions = [];

  activityGroups.forEach((activityGroup) => {
    formattedActivityGroupOptions.push({
      isGroupOption: true,
      name: activityGroup.name,
    });

    activityGroup.activities.forEach((activity) => {
      formattedActivityGroupOptions.push({
        name: activity.name,
        id: activity.id,
        type: activityGroup.event_type,
      });
    });
  });

  return formattedActivityGroupOptions;
};
