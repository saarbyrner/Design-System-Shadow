// @flow
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';

import { SlidingPanelResponsive, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TimeScopeFilterTranslated as TimeScopeFilter } from '../TimeScopeFilter';
import { PopulationFilterTranslated as PopulationFilter } from '../PopulationFilter';
import { isGrowthAndMaturationReport } from '../../utils/index';

type Props = {
  isOpen: boolean,
  onClose: Function,
  onApply: Function,
  onClear: Function,
  dashboardKey: string,
};

const styles = {
  panelActions: css`
    bottom: 0;
    position: absolute;
  `,
  panelContent: css`
    .kitmanReactSelect {
      margin-bottom: 15px;
    }
  `,
};

function FilterPanel(props: I18nProps<Props>) {
  return (
    <SlidingPanelResponsive
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.t('Filter')}
    >
      <SlidingPanelResponsive.Content styles={styles.panelContent}>
        {!isGrowthAndMaturationReport() && (
          <TimeScopeFilter dashboardKey={props.dashboardKey} />
        )}
        <PopulationFilter />
      </SlidingPanelResponsive.Content>
      <SlidingPanelResponsive.Actions styles={styles.panelActions}>
        <TextButton
          onClick={props.onClear}
          type="textOnly"
          text={props.t('Clear')}
          kitmanDesignSystem
        />
        <TextButton
          onClick={props.onApply}
          type="primary"
          kitmanDesignSystem
          text={props.t('Apply')}
        />
      </SlidingPanelResponsive.Actions>
    </SlidingPanelResponsive>
  );
}

export const FilterPanelTranslated = withNamespaces()(FilterPanel);
export default FilterPanel;
