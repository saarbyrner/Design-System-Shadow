// @flow
import { useEffect } from 'react';
import { TrackEvent } from '@kitman/common/src/utils';
import { withNamespaces } from 'react-i18next';
import type { GraphType, GraphGroup } from '@kitman/common/src/types/Graphs';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import FormSection from './FormSection';
import CommonGraphForm from '../../containers/GraphForm/CommonGraphForm';
import FormSummary from '../../containers/GraphForm/Summary';
import { GraphSelectorTranslated as GraphSelector } from './GraphSelector';

type Props = {
  graphGroup: GraphGroup,
  graphType: GraphType,
  updateGraphFormType: Function,
  isEditing: boolean,
  canAccessMedicalGraph: boolean,
  fetchCodingSystemCategories: Function,
};

const GraphForm = (props: I18nProps<Props>) => {
  let graphForm;
  const { organisation } = useOrganisation();

  useEffect(() => {
    const codingSystemKey = window.getFlag('multi-coding-pipepline-graph')
      ? organisation.coding_system_key
      : codingSystemKeys.OSICS_10;
    props.fetchCodingSystemCategories(codingSystemKey);
  }, [organisation]);

  switch (props.graphGroup) {
    case 'longitudinal':
    case 'summary_bar':
    case 'summary_donut':
    case 'value_visualisation':
    case 'summary_stack_bar':
      graphForm = <CommonGraphForm />;
      break;
    case 'summary':
      graphForm = <FormSummary />;
      break;
    default:
      graphForm = null;
      break;
  }

  return (
    <div className="graphComposer__form">
      {!props.isEditing ? (
        <FormSection title={props.t('Graph Type')} border="bottom">
          <GraphSelector
            graphType={props.graphType}
            graphGroup={props.graphGroup}
            selectGraph={(graphType, graphGroup) => {
              TrackEvent('Graph Builder', 'Click', `${graphType} Graph icon`);
              props.updateGraphFormType(graphType, graphGroup);
            }}
            canAccessMedicalGraph={props.canAccessMedicalGraph}
          />
        </FormSection>
      ) : null}
      {graphForm}
    </div>
  );
};

export const GraphFormTranslated = withNamespaces()(GraphForm);
export default GraphForm;
