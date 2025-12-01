// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Button } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { endWidgetEditMode } from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { editWidgetSuccess } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import { getWidgetByIdFactory } from '../../../../redux/selectors/chartBuilder';

type Props = {
  widgetId: number,
};

function BuilderActionButtons(props: I18nProps<Props>) {
  const dispatch = useDispatch();
  const activeWidgetData = useSelector(getWidgetByIdFactory(props.widgetId));

  return (
    <Button
      content="done"
      color="primary"
      size="small"
      onClick={() => {
        dispatch(editWidgetSuccess(activeWidgetData));
        dispatch(endWidgetEditMode(props.widgetId));
      }}
    >
      {props.t('Done')}
    </Button>
  );
}

export const BuilderActionButtonsTranslated: ComponentType<Props> =
  withNamespaces()(BuilderActionButtons);
export default BuilderActionButtons;
