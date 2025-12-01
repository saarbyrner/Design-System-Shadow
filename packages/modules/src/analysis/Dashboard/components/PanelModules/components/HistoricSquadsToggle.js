// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { SegmentedControl } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';

type Props = {
  isHistoricSquadActive: boolean,
  setHistoricSquadActive: (boolean) => void,
};

const toggleTypes = {
  CURRENT_SQUADS: 'current_squads',
  HISTORIC_SQUADS: 'historic_squads',
};

function HistoricSquadsToggle({
  isHistoricSquadActive,
  setHistoricSquadActive,
  t,
}: I18nProps<Props>) {
  return (
    <Panel.Field>
      <SegmentedControl
        buttons={[
          {
            value: toggleTypes.CURRENT_SQUADS,
            name: t('Current squads'),
          },
          {
            value: toggleTypes.HISTORIC_SQUADS,
            name: t('Historical squads'),
          },
        ]}
        selectedButton={
          isHistoricSquadActive
            ? toggleTypes.HISTORIC_SQUADS
            : toggleTypes.CURRENT_SQUADS
        }
        onClickButton={(selected) => {
          setHistoricSquadActive(selected === toggleTypes.HISTORIC_SQUADS);
        }}
        width="full"
        color={colors.grey_200}
      />
    </Panel.Field>
  );
}

export const HistoricSquadsToggleTranslated: ComponentType<Props> =
  withNamespaces()(HistoricSquadsToggle);
export default HistoricSquadsToggle;
