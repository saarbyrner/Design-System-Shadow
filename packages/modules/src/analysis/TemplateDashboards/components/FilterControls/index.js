// @flow
import { useSelector } from 'react-redux';

import { IconButton, InfoTooltip } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import {
  isGrowthAndMaturationReport,
  isStaffDevelopment,
} from '@kitman/modules/src/analysis/TemplateDashboards/utils';
import { getSortedData } from '@kitman/modules/src/analysis/TemplateDashboards/redux/selectors/filters';
import { useGetAllSquadAthletesQuery } from '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import { formatCSVData } from '@kitman/modules/src/analysis/TemplateDashboards/components/Table/utils';

import useSelectedPopulation from '../PopulationFilter/useSelectedPopulation';
import useSelectedTimeScope from '../TimeScopeFilter/useSelectedTimeScope';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    fontFamily: 'Open Sans',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '14px',
  },
  activeLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',

    span: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '300px',
    },
  },
  controls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',

    '.iconButton': {
      border: 'unset !important',
      background: 'unset',
      minWidth: 'unset',
      padding: 'unset',
    },

    '.iconButton::before': {
      color: colors.grey_200,
    },
  },
};

type Props = {
  onFilterIcon: Function,
};

const renderActiveLabel = (activeLabels: string, divider?: boolean = true) => {
  return (
    !!activeLabels && (
      <>
        <InfoTooltip placement="bottom-start" content={activeLabels}>
          <span className="FilterControlActiveLabel">{activeLabels}</span>
        </InfoTooltip>
        {divider && <span>|</span>}
      </>
    )
  );
};

function FilterControls(props: Props) {
  const { athletes, squads, users } = useSelectedPopulation({
    labelOnly: true,
  });
  const { data: allSquadAthletes = { squads: [] } } =
    useGetAllSquadAthletesQuery(
      isGrowthAndMaturationReport() ? {} : { refreshCache: true }
    );
  const { date } = useSelectedTimeScope({ labelOnly: true });
  const showAthleteDivider = !!squads || !!date;
  const sortedData = useSelector(getSortedData);

  const downloadCSV = useCSVExport(
    'Growth-and-maturation-table',
    formatCSVData(allSquadAthletes, sortedData ?? [])
  );

  const icon = isGrowthAndMaturationReport() ? 'file-icon-csv' : 'icon-print';

  const onClickIcon = isGrowthAndMaturationReport()
    ? downloadCSV
    : window.print;

  return (
    <div css={styles.root}>
      <div css={styles.activeLabel} onClick={props.onFilterIcon}>
        {!isStaffDevelopment() &&
          renderActiveLabel(athletes, showAthleteDivider)}
        {!isGrowthAndMaturationReport() && renderActiveLabel(squads, !!date)}
        {isStaffDevelopment() && renderActiveLabel(users)}
        {!isGrowthAndMaturationReport() && renderActiveLabel(date, false)}
      </div>
      <div css={styles.controls}>
        <IconButton onClick={onClickIcon} icon={icon} />
        <IconButton
          onClick={props.onFilterIcon}
          icon="icon-filter"
          kitmanDesignSystem
        />
      </div>
    </div>
  );
}

export default FilterControls;
