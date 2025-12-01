// @flow
import { withNamespaces } from 'react-i18next';
import { MuiColorInput, matchIsValidColor } from 'mui-color-input';
import { colors } from '@kitman/common/src/variables';
import {
  Box,
  Grid,
  IconButton,
  SelectWrapper,
  TextField,
  Typography,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { FORMATTING_RULE_TYPES } from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { WidgetType } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { CHART_BACKGROUND_ZONE_CONDITIONS } from '../constants';
import { getWidgetConditions, getWidgetRules } from '../utils';
import type { WidgetFormatRule } from '../types';

type Props = {
  ruleUnit: string,
  index: number,
  format: WidgetFormatRule,
  onRemoveFormattingRule: Function,
  onUpdateRuleType: Function,
  onUpdateRuleCondition: Function,
  onUpdateRuleValue: Function,
  onUpdateRuleToFrom: (
    label: string,
    value: string | number,
    index: number
  ) => void,
  onUpdateRuleColor: Function,
  widgetType: WidgetType,
  showTextDisplay?: boolean,
  onUpdateTextDisplay?: (value: string, index: number) => void,
};

const DEFAULT_COLOR = colors.red_100_20;

function FormattingRule(props: I18nProps<Props>) {
  const onUpdateCondition = (e) =>
    props.onUpdateRuleCondition(e.target.value, props.index);
  const onUpdateValue = (value) => props.onUpdateRuleValue(value, props.index);
  const onUpdateColor = (color) => {
    if (matchIsValidColor(color)) {
      props.onUpdateRuleColor(color, props.index);
    }
  };

  const presetConditions = (ruleType: string) => {
    const conditions = getWidgetConditions(props.widgetType, ruleType);
    if (conditions.length === 1) {
      props.onUpdateRuleCondition(conditions[0].value, props.index);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" mr={1} sx={{ display: 'inline-block' }}>
          {props.t('Rule {{number}}', { number: props.index + 1 })}
        </Typography>
        <IconButton
          sx={{
            paddingTop: '0',
            color: `${colors.grey_100}`,
          }}
          size="small"
          onClick={() => props.onRemoveFormattingRule(props.index)}
        >
          <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
        </IconButton>
      </Box>

      <Grid container spacing={1} sx={{ mb: 1.5 }}>
        <Grid item xs={12}>
          <SelectWrapper
            value={props.format.type || ''}
            onChange={(e) => {
              props.onUpdateRuleType(e.target.value, props.index);
              props.onUpdateRuleValue(null, props.index);
              if (e.target.value === FORMATTING_RULE_TYPES.reference_line) {
                presetConditions(e.target.value);
              }
            }}
            options={getWidgetRules(props.widgetType)}
            label={props.t('Rule type')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ mb: 1.5 }}>
        <Grid item xs={4}>
          <SelectWrapper
            label={props.t('Condition')}
            value={props.format.condition || ''}
            options={getWidgetConditions(props.widgetType, props.format.type)}
            onChange={onUpdateCondition}
            multiple={false}
            minWidth={0}
          />
        </Grid>
        <Grid item xs={4}>
          {props.format.condition ===
            CHART_BACKGROUND_ZONE_CONDITIONS.between && (
            <Grid item xs={12} sx={{ display: 'flex', gap: 0.5 }}>
              <TextField
                data-testid="FormattingRule|TextInput|Number"
                label={props.t('From')}
                value={props.format.from || ''}
                onChange={(e) =>
                  props.onUpdateRuleToFrom('from', e.target.value, props.index)
                }
                minWidth={0}
                type="number"
              />
              <TextField
                data-testid="FormattingRule|TextInput|Number"
                label={props.t('To')}
                value={props.format.to || ''}
                onChange={(e) =>
                  props.onUpdateRuleToFrom('to', e.target.value, props.index)
                }
                minWidth={0}
                type="number"
              />
            </Grid>
          )}
          {props.format.condition !==
            CHART_BACKGROUND_ZONE_CONDITIONS.between &&
            props.format.type !== 'string' && (
              <TextField
                data-testid="FormattingRule|TextInput|Number"
                label={props.ruleUnit || props.t('units')}
                value={props.format.value || ''}
                onChange={(e) => onUpdateValue(e.target.value)}
                minWidth={0}
                type="number"
              />
            )}
          {props.format.condition !==
            CHART_BACKGROUND_ZONE_CONDITIONS.between &&
            props.format.type === 'string' && (
              <TextField
                data-testid="FormattingRule|TextInput"
                label={props.ruleUnit || props.t('units')}
                value={props.format.value || ''}
                onChange={(e) => onUpdateValue(e.target.value)}
                minWidth={0}
              />
            )}
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <MuiColorInput
            data-testid="FormattingRule|ColorPicker"
            disabled={false}
            label={props.t('Colour')}
            value={props.format.color || DEFAULT_COLOR}
            onChange={onUpdateColor}
            format="hex"
            fallbackValue={colors.white}
            isAlphaHidden
          />
        </Grid>
      </Grid>

      {props?.showTextDisplay && (
        <Grid container spacing={1} sx={{ mb: 1.5 }}>
          <Grid item xs={12}>
            <TextField
              label={props.t('Text display')}
              value={props.format.textDisplay || ''}
              onChange={(e) => {
                if (props?.onUpdateTextDisplay) {
                  props.onUpdateTextDisplay(e.target.value, props.index);
                }
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export const FormattingRuleTranslated = withNamespaces()(FormattingRule);
export default FormattingRule;
