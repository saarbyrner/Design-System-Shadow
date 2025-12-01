// @flow
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { CircularProgress, Typography } from '@kitman/playbook/components';
import useRelativeFontSize from '@kitman/modules/src/analysis/shared/hooks/useRelativeFontSize';
import { colors } from '@kitman/common/src/variables';
import { getFormattedCellValue } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import type { TableWidgetCellValue } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { Calculation } from '@kitman/modules/src/analysis/shared/types/charts';
import { getLoaderLevelByWidgetId } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import AnimatedCalculateLoader from '@kitman/modules/src/analysis/shared/components/CachingLoader/AnimatedCalculateLoader';

type Props = {
  value: TableWidgetCellValue,
  calculation: Calculation | string,
  unit: string,
  isEmpty: boolean,
  widgetId: number,
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  value: { lineHeight: '1', fontWeight: 'bold' },
  unit: { fontWeight: '300', color: colors.cool_mid_grey },
  placeholder: { textAlign: 'center', imgPadding: '10px' },
  levelTwoLoadingContainer: {
    inset: 0,
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },
  levelTwoLoaderTitle: {
    color: colors.grey_200,
    fontWeight: 600,
  },
  levelTwoLoaderSubtitle: {
    color: colors.grey_100,
    fontWeight: 400,
  },
};

const MAX_VALUE_FONT_SIZE = 200;
const MIN_UNIT_FONT_SIZE = 12;

function Value(props: I18nProps<Props>) {
  const [valueFontSize, valueContainerRef, valueRef] =
    useRelativeFontSize(MAX_VALUE_FONT_SIZE);
  const value = getFormattedCellValue(props.value, props.calculation) || ' - ';
  const unitFontSize =
    valueFontSize / 6 < MIN_UNIT_FONT_SIZE
      ? MIN_UNIT_FONT_SIZE
      : valueFontSize / 6;
  const loaderLevel: number = useSelector(
    getLoaderLevelByWidgetId(props.widgetId)
  );

  return (
    <div
      data-testid="WidgetChart|Value"
      css={styles.root}
      ref={valueContainerRef}
    >
      {loaderLevel === LOADING_LEVEL.IDLE && !props.isEmpty && (
        <>
          <div
            ref={valueRef}
            style={{ fontSize: valueFontSize, lineHeight: 1 }}
          >
            {value}
          </div>
          <div css={styles.unit} style={{ fontSize: unitFontSize }}>
            {props.unit}
          </div>
        </>
      )}
      {loaderLevel === LOADING_LEVEL.INITIAL_LOAD && <CircularProgress />}
      {loaderLevel === LOADING_LEVEL.LONG_LOAD && (
        <div css={styles.levelTwoLoadingContainer}>
          <AnimatedCalculateLoader />
          <div css={styles.levelTwoLoaderTitle}>
            {props.t('Calculating large dataset')}
          </div>
          <div css={styles.levelTwoLoaderSubtitle}>
            {props.t('This may take a while...')}
          </div>
        </div>
      )}
      {props.isEmpty && (
        <div css={styles.placeholder}>
          <img
            alt={props.t('')}
            src="/img/graph-placeholders-modal/value-visualisation-placeholder.svg"
          />
          <Typography sx={{ fontWeight: '600' }} variant="body1">
            {props.t('Nothing to see yet')}
          </Typography>
          <Typography variant="body2">
            {props.t('A data type and time period is required')}
          </Typography>
        </div>
      )}
    </div>
  );
}

export const ValueTranslated: ComponentType<Props> = withNamespaces()(Value);
export default Value;
