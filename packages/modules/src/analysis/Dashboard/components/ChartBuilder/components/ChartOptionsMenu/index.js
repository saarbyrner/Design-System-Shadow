// @flow
// React
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';

// Components
import {
  Button,
  Checkbox,
  Popover,
  Box,
  FormGroup,
  FormControlLabel,
} from '@kitman/playbook/components';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ChartOptionTypes } from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import { getCheckboxChartOptions } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/utils';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import type { CoreChartType } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { defaultPieOptions } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/constants';

type Props = {
  selectedChartOptions: ChartOptionTypes,
  onChartOptionUpdate: (string, boolean) => void,
  chartType: CoreChartType,
};

const styles = {
  span: {
    marginLeft: '0.3rem',
    fontSize: '16px',
    display: 'inline-block',
  },
  popoverBody: {
    padding: '0.6rem',
    fontSize: '14px !important',
    paddingLeft: '0.8rem',
  },
};

function ChartOptionsMenu(props: I18nProps<Props>) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState<Array<string>>([]);

  const chartOptions = {
    checkboxOptions: getCheckboxChartOptions(props.chartType),
    textOptions: [
      {
        value: 'axis',
        label: props.t('Axis Options'),
      },
      {
        value: 'legend',
        label: props.t('Legend Options'),
      },
    ],
  };

  useEffect(() => {
    if (props.selectedChartOptions) {
      setSelectedOptions(
        Object.keys(props.selectedChartOptions).filter(
          (key) => props.selectedChartOptions[key] === true
        )
      );
    } else if (props.chartType === CHART_TYPE.pie) {
      setSelectedOptions(defaultPieOptions);
    }
  }, []);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const renderChartOptionsMenu = () => {
    const open = Boolean(anchorEl);
    const id = open ? 'chart-options-menu' : undefined;

    return (
      <Box>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          elevation={12}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div css={styles.popoverBody}>
            <FormGroup>
              {chartOptions.checkboxOptions.map(({ value, label }) => (
                <FormControlLabel
                  data-testid={value}
                  control={<Checkbox size="small" />}
                  key={value}
                  label={label}
                  css={{
                    '& .MuiTypography-root': {
                      fontSize: '14px',
                    },
                  }}
                  checked={selectedOptions.includes(value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setSelectedOptions((cur) => [...cur, value]);
                    } else {
                      const newOptions = [...selectedOptions];
                      newOptions.splice(selectedOptions.indexOf(value), 1);
                      setSelectedOptions(newOptions);
                    }
                    props.onChartOptionUpdate(value, e.target.checked);
                  }}
                />
              ))}
            </FormGroup>
          </div>
        </Popover>
      </Box>
    );
  };

  return (
    <div>
      <Button
        data-test-id="ChartBuilder|ChartOptionsButton"
        content="Chart Options"
        color="secondary"
        size="small"
        onClick={handleOpenPopover}
      >
        {props.t('Chart Options')}
        <span css={styles.span} className="icon-settings" />
      </Button>
      {renderChartOptionsMenu()}
    </div>
  );
}

export const ChartOptionsMenuTranslated: ComponentType<Props> =
  withNamespaces()(ChartOptionsMenu);
export default ChartOptionsMenu;
