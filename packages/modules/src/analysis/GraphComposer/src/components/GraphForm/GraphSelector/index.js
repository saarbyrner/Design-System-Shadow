// @flow
import { IconButton } from '@kitman/components';

import { withNamespaces } from 'react-i18next';
import type {
  GraphType,
  GraphGroup,
} from '@kitman/modules/src/analysis/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  graphType: GraphType,
  graphGroup: GraphGroup,
  selectGraph: (GraphType, GraphGroup) => void,
  canAccessMedicalGraph: boolean,
};

const GraphSelector = (props: I18nProps<Props>) => (
  <div className="graphSelector">
    <div className="graphSelector__section">
      <p className="graphSelector__sectionLabel">
        {props.t('Longitudinal Graphs')}
      </p>
      <abbr
        className="graphSelector__btn"
        title={props.t('Longitudinal Graphs')}
      >
        <IconButton
          icon="icon-line-graph"
          isActive={
            props.graphGroup === 'longitudinal' && props.graphType === 'line'
          }
          onClick={() => props.selectGraph('line', 'longitudinal')}
        />
      </abbr>
      <abbr className="graphSelector__btn" title={props.t('Column Graph')}>
        <IconButton
          icon="icon-column-graph"
          isActive={
            props.graphGroup === 'longitudinal' && props.graphType === 'column'
          }
          onClick={() => props.selectGraph('column', 'longitudinal')}
        />
      </abbr>
      <abbr className="graphSelector__btn" title={props.t('Bar Graph')}>
        <IconButton
          icon="icon-bar-graph"
          isActive={
            props.graphGroup === 'longitudinal' && props.graphType === 'bar'
          }
          onClick={() => props.selectGraph('bar', 'longitudinal')}
        />
      </abbr>
      <abbr className="graphSelector__btn" title={props.t('Combination Graph')}>
        <IconButton
          icon="icon-combination-graph"
          isActive={
            props.graphGroup === 'longitudinal' &&
            props.graphType === 'combination'
          }
          onClick={() => props.selectGraph('combination', 'longitudinal')}
        />
      </abbr>
    </div>
    <div className="graphSelector__section">
      <p className="graphSelector__sectionLabel">{props.t('Summary Graphs')}</p>
      <abbr className="graphSelector__btn" title={props.t('Radar Graph')}>
        <IconButton
          icon="icon-radar-graph"
          isActive={
            props.graphGroup === 'summary' && props.graphType === 'radar'
          }
          onClick={() => props.selectGraph('radar', 'summary')}
        />
      </abbr>
      <abbr className="graphSelector__btn" title={props.t('Spider Graph')}>
        <IconButton
          icon="icon-spider-graph"
          isActive={
            props.graphGroup === 'summary' && props.graphType === 'spider'
          }
          onClick={() => props.selectGraph('spider', 'summary')}
        />
      </abbr>
      <abbr className="graphSelector__btn" title={props.t('Column Graph')}>
        <IconButton
          icon="icon-column-graph"
          isActive={
            props.graphGroup === 'summary_bar' && props.graphType === 'column'
          }
          onClick={() => props.selectGraph('column', 'summary_bar')}
        />
      </abbr>
      <abbr className="graphSelector__btn" title={props.t('Bar Graph')}>
        <IconButton
          icon="icon-bar-graph"
          isActive={
            props.graphGroup === 'summary_bar' && props.graphType === 'bar'
          }
          onClick={() => props.selectGraph('bar', 'summary_bar')}
        />
      </abbr>
      {props.canAccessMedicalGraph ? (
        <abbr
          className="graphSelector__btn"
          title={props.t('Stacked Column Graph')}
        >
          <IconButton
            icon="icon-stack-column-graph"
            isActive={
              props.graphGroup === 'summary_stack_bar' &&
              props.graphType === 'column'
            }
            onClick={() => props.selectGraph('column', 'summary_stack_bar')}
          />
        </abbr>
      ) : null}
      {props.canAccessMedicalGraph ? (
        <abbr
          className="graphSelector__btn"
          title={props.t('Stacked Bar Graph')}
        >
          <IconButton
            icon="icon-stack-bar-graph"
            isActive={
              props.graphGroup === 'summary_stack_bar' &&
              props.graphType === 'bar'
            }
            onClick={() => props.selectGraph('bar', 'summary_stack_bar')}
          />
        </abbr>
      ) : null}
      {props.canAccessMedicalGraph && (
        <abbr className="graphSelector__btn" title={props.t('Donut Chart')}>
          <IconButton
            icon="icon-donut-graph"
            isActive={
              props.graphGroup === 'summary_donut' &&
              props.graphType === 'donut'
            }
            onClick={() => props.selectGraph('donut', 'summary_donut')}
          />
        </abbr>
      )}
      {props.canAccessMedicalGraph ? (
        <abbr className="graphSelector__btn" title={props.t('Pie Chart')}>
          <IconButton
            icon="icon-pie-graph"
            isActive={
              props.graphGroup === 'summary_donut' && props.graphType === 'pie'
            }
            onClick={() => props.selectGraph('pie', 'summary_donut')}
          />
        </abbr>
      ) : null}
    </div>
    <div className="graphSelector__section">
      <p className="graphSelector__sectionLabel">{props.t('Other')}</p>
      <abbr className="graphSelector__btn" title={props.t('Numeric Value')}>
        <IconButton
          icon="icon-value-graph"
          isActive={props.graphGroup === 'value_visualisation'}
          onClick={() => props.selectGraph('value', 'value_visualisation')}
        />
      </abbr>
    </div>
  </div>
);

export const GraphSelectorTranslated = withNamespaces()(GraphSelector);
export default GraphSelector;
