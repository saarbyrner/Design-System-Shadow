// @flow
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import _round from 'lodash/round';
import { colors } from '@kitman/common/src/variables';
import {
  Button,
  Box,
  Divider,
  Drawer,
  Typography,
} from '@kitman/playbook/components';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import { useTheme } from '@kitman/playbook/hooks';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import type { WidgetType } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { WidgetFormatRule } from './types';
import { FormattingRuleTranslated as FormattingRule } from './components/FormattingRule';
import { isRuleSelectionValid } from './utils';

type Props = {
  appliedFormat: Array<WidgetFormatRule>,
  panelName: string,
  ruleUnit: string,
  isOpen: boolean,
  onAddFormattingRule: Function,
  onClickSave: Function,
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
  togglePanel: Function,
  isSuggestedThresholdLoading: boolean,
  hasSuggestedThresholdErrored: boolean,
  hasSuggestedThreshold: boolean,
  suggestedThreshold: number,
  widgetType: WidgetType,
  showTextDisplay?: boolean,
  onUpdateTextDisplay?: (value: string, index: number) => void,
};

function FormattingPanel(props: I18nProps<Props>) {
  const theme = useTheme();

  const onKeyDown = (event) => {
    const ENTER_KEY_CODE = 13;
    const ESC_KEY_CODE = 27;
    const { keyCode } = event;

    if (!props.isOpen) {
      return;
    }

    if (
      keyCode === ENTER_KEY_CODE &&
      isRuleSelectionValid(props.widgetType, props.appliedFormat)
    ) {
      props.onClickSave();
    }

    if (keyCode === ESC_KEY_CODE) {
      props.togglePanel();
    }
  };

  const getSuggestedThreshold = () => {
    if (props.isSuggestedThresholdLoading) {
      return '...';
    }

    if (props.hasSuggestedThresholdErrored) {
      return '-';
    }

    return _round(props.suggestedThreshold, 2);
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [props.isOpen]);

  return (
    <Drawer
      open={props.isOpen}
      anchor="right"
      onClose={props.togglePanel}
      sx={drawerMixin({ theme, isOpen: props.isOpen })}
    >
      <DrawerLayout.Title
        title={
          props.widgetType === CHART_TYPE.xy
            ? props.t('Formatting rules')
            : props.t('Conditional formatting')
        }
        onClose={props.togglePanel}
      />
      <Divider
        sx={{
          mt: 1,
        }}
      />
      <DrawerLayout.Content>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontWeight: 600 }} variant="subtitle2">
            {props.panelName}
          </Typography>

          <Button
            color="secondary"
            size="small"
            disabled={props.appliedFormat.length === 10}
            onClick={() => {
              props.onAddFormattingRule();
            }}
          >
            {props.t('Add rule')}
          </Button>
        </Box>

        {props.hasSuggestedThreshold && (
          <Box>
            <Typography variant="body2">
              {props.t('Suggested Threshold: {{threshold}} %', {
                threshold: getSuggestedThreshold(),
              })}
            </Typography>
          </Box>
        )}

        {props.appliedFormat.length === 0 && (
          <Box>
            <Typography
              sx={{
                color: colors.grey_100,
                textAlign: 'center',
                margin: '40px 0',
              }}
              variant="body2"
            >
              {props.t('No formatting rules added')}
            </Typography>
          </Box>
        )}

        <Divider
          sx={{
            mt: 2,
            mb: 1,
          }}
        />

        {props.appliedFormat.map((format, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={`${index}-${format?.type}`} sx={{ margin: '5px' }}>
              <FormattingRule
                ruleUnit={props.ruleUnit}
                index={index}
                format={format}
                onRemoveFormattingRule={props.onRemoveFormattingRule}
                onUpdateRuleType={props.onUpdateRuleType}
                onUpdateRuleCondition={props.onUpdateRuleCondition}
                onUpdateRuleValue={props.onUpdateRuleValue}
                onUpdateRuleToFrom={props.onUpdateRuleToFrom}
                onUpdateRuleColor={props.onUpdateRuleColor}
                widgetType={props.widgetType}
                showTextDisplay={props.showTextDisplay}
                onUpdateTextDisplay={props.onUpdateTextDisplay}
              />
              <Divider
                sx={{
                  mt: 3,
                  mb: 1,
                }}
              />
            </Box>
          );
        })}
      </DrawerLayout.Content>
      <DrawerLayout.Actions>
        <Button color="secondary" onClick={() => props.togglePanel()}>
          {props.t('Cancel')}
        </Button>
        <Button
          onClick={() => props.onClickSave()}
          disabled={
            !isRuleSelectionValid(props.widgetType, props.appliedFormat)
          }
        >
          {props.t('Save')}
        </Button>
      </DrawerLayout.Actions>
    </Drawer>
  );
}

export default FormattingPanel;
export const FormattingPanelTranslated = withNamespaces()(FormattingPanel);
