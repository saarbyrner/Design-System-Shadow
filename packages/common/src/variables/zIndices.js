// @flow

// Which is the ResponsiveSidePanel z-index

const intercomZ = 2147483003;

const zIndices = {
  PHIandPIIBanners: 2147482000,
  navBarDropDown: 2147482500,
  intercomZ,
  slidingPanel: intercomZ + 3,
  drawer: intercomZ + 3,
  modal: intercomZ + 3,
  calendarEventTooltip: intercomZ + 3,
  dragOverlay: intercomZ + 4,
  toastDialog: intercomZ + 4,
  tooltip: intercomZ + 4,
  popover: intercomZ + 4,
  selectMenu: intercomZ + 4,
  draggableItemZ: 2147500000,
};

export default zIndices;
