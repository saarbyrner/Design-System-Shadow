// @flow
import { IconButton } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';

type Props = {
  canBuildGraph: boolean,
  graphType: string,
  expandGraph: Function,
};

const Actions = (props: Props) => (
  <div className="graphViewActions">
    <div className="graphViewActions__btn">
      <IconButton
        icon="icon-print"
        onClick={() => {
          // Graphs need to be redraw on printing because thes
          // width of the container is different on print view
          window.dispatchEvent(new Event('resize'));

          TrackEvent(
            'Graph Builder',
            'Click',
            `Print ${props.graphType} Graph`
          );
          window.print();
        }}
      />
    </div>

    <div className="graphViewActions__btn">
      <IconButton
        icon="icon-expand"
        onClick={() => {
          TrackEvent(
            'Graph Builder',
            'Click',
            `Expand ${props.graphType} Graph`
          );
          props.expandGraph();
        }}
      />
    </div>

    {props.canBuildGraph ? (
      <div className="graphViewActions__btn">
        <a href="#edit">
          <IconButton
            onClick={() => {
              TrackEvent('Graph Builder', 'Click', 'Graph Editor Link');
            }}
            icon="icon-edit"
          />
        </a>
      </div>
    ) : null}
  </div>
);

export default Actions;
