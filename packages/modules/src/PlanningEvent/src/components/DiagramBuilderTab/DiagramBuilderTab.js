// @flow
import { Stage } from '@kitman/common/src/pixi/components';
import { DiagramBuilder } from '@kitman/modules/src/PlanningEvent/src/components/DiagramBuilderTab/components/DiagramBuilder';

export type DiagramBuilderProps = {
  width: number,
  height: number,
  background: string,
};

export default ({ width, height, background }: DiagramBuilderProps) => {
  return (
    <Stage width={width} height={height} background={background}>
      <DiagramBuilder />
    </Stage>
  );
};
