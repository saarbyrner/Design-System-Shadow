// @flow
import { areaSize, sportType } from '@kitman/common/src/types/Event';

export const tests = {
  getAreaSizeLabel: [
    [areaSize.Small, 'Small'],
    [areaSize.Medium, 'Medium'],
    [areaSize.Large, 'Large'],
    [areaSize.Xlarge, 'X-Large'],
    ['non-existent size', undefined],
  ],
  getDiagramPlaceholder: [
    [sportType.Soccer, '/img/soccer_drill_diagram_placeholder.svg'],
    [sportType.GAA, '/img/gaa_drill_diagram_placeholder.svg'],
    [sportType.RugbyUnion, '/img/rugby_drill_diagram_placeholder.svg'],
    [sportType.RugbyLeague, '/img/rugby_drill_diagram_placeholder.svg'],
    ['non-existent sport', '/img/soccer_drill_diagram_placeholder.svg'],
  ],
};
export default tests;
