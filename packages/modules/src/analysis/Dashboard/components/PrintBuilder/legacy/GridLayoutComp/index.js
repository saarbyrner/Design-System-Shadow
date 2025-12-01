// @flow
import GridLayout from 'react-grid-layout';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { WidgetLayout } from '@kitman/modules/src/analysis/shared/types';
import type { WidgetData, User } from '../../../../types';
import WidgetRenderer from '../../../../containers/WidgetRenderer';

type Props = {
  widgets: Array<WidgetData>,
  layout: Array<WidgetLayout>,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  annotationTypes: Array<Object>,
  onUpdateDashboardLayout: Function,
  size: {
    width: number,
    height: number,
  },
  currentUser: User,
  appliedSquadAthletes?: SquadAthletesSelection,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
};

const DashboardGridLayout = GridLayout;

const GridLayoutComp = (props: Props) => {
  return (
    <DashboardGridLayout
      width={props.size.width}
      className="layout"
      isDraggable
      isResizable
      onResizeStop={(layout) => {
        props.onUpdateDashboardLayout(layout);
      }}
      onLayoutChange={(layout) => {
        props.onUpdateDashboardLayout(layout);
      }}
      compactType={null}
      useCSSTransforms
      // $FlowFixMe some props of the layout are undefined first because of the HOC
      layout={props.layout}
      autoSize
      margin={[10, 10]}
      containerPadding={[0, 0]}
      rowHeight={100}
      cols={6}
    >
      {props.widgets.map((widgetData) => (
        <div key={widgetData.id}>
          <WidgetRenderer
            widgetData={widgetData}
            squadAthletes={props.squadAthletes}
            squads={props.squads}
            annotationTypes={props.annotationTypes}
            currentUser={props.currentUser}
            appliedSquadAthletes={props.appliedSquadAthletes}
            pivotedDateRange={props.pivotedDateRange}
            pivotedTimePeriod={props.pivotedTimePeriod}
            pivotedTimePeriodLength={props.pivotedTimePeriodLength}
          />
        </div>
      ))}
    </DashboardGridLayout>
  );
};

export default GridLayoutComp;
