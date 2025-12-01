// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';

import {
  AppStatus,
  FormValidator,
  LegacyModal as Modal,
  MultiSelectDropdown,
  TabBar,
  TextButton,
  ToggleSwitch,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { ModalStatus } from '@kitman/common/src/types';
import type { ActionsTableColumn } from '@kitman/modules/src/analysis/Dashboard/types';
import AthleteSelector from '@kitman/modules/src/analysis/Dashboard/containers/AthleteSelector';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

type Props = {
  onClickCloseModal: Function,
  isOpen: boolean,
  selectedAnnotationTypes: Array<number>,
  selectedPopulation: SquadAthletesSelection,
  selectedHiddenColumns: Array<ActionsTableColumn>,
  annotationTypes: Array<Object>,
  status: ?ModalStatus,
  onSelectAnnotationType: Function,
  onUnselectAnnotationType: Function,
  onSetPopulation: Function,
  onHiddenColumnsChange: Function,
  onClickSaveActionsWidget: Function,
  onClickCloseAppStatus: Function,
};

function ActionsWidgetModal(props: I18nProps<Props>) {
  const { trackEvent } = useEventTracking();

  const onSubmit = () => {
    trackEvent(reportingEventNames.actionsWidget);
    props.onClickSaveActionsWidget();
  };

  const actionSettingsTab = {
    title: props.t('Action settings'),
    content: (
      <>
        <div className="actionsWidgetModal__field">
          <MultiSelectDropdown
            label={props.t('Note type')}
            listItems={props.annotationTypes.filter(
              (annotationType) =>
                annotationType.type ===
                'OrganisationAnnotationTypes::Evaluation'
            )}
            onItemSelect={(item) => {
              if (item.checked) {
                props.onSelectAnnotationType(parseInt(item.id, 10));
              } else {
                props.onUnselectAnnotationType(parseInt(item.id, 10));
              }
            }}
            selectedItems={props.selectedAnnotationTypes.map((selectedItem) => {
              return selectedItem.toString();
            })}
            customClass={classNames({
              'dropdownWrapper--validationFailure':
                props.selectedAnnotationTypes.length === 0,
            })}
          />
        </div>
        <div className="actionsWidgetModal__field">
          <AthleteSelector
            data-testid="ActionsWidgetModal|AthleteSelector"
            showDropdownButton
            selectedSquadAthletes={props.selectedPopulation}
            label={props.t('#sport_specific__Athletes')}
            onSelectSquadAthletes={(squadAthletesSelection) => {
              props.onSetPopulation(squadAthletesSelection);
            }}
          />
        </div>
      </>
    ),
  };

  const onToggleHiddenColumn = (toggledColumn) => {
    const newHiddenColumns = props.selectedHiddenColumns.includes(toggledColumn)
      ? props.selectedHiddenColumns.filter((column) => column !== toggledColumn)
      : [...props.selectedHiddenColumns, toggledColumn];
    props.onHiddenColumnsChange(newHiddenColumns);
  };

  const tableSettingsTab = {
    title: props.t('Table settings'),
    content: (
      <>
        <h3 className="actionsWidgetModal__sectionTitle">
          {props.t('View on table')}
        </h3>
        <div className="actionsWidgetModal__hideColumnSection">
          <div className="actionsWidgetModal__radioBtnLabel">
            {props.t('Due date')}
          </div>
          <ToggleSwitch
            isSwitchedOn={!props.selectedHiddenColumns.includes('due_date')}
            toggle={() => onToggleHiddenColumn('due_date')}
          />

          <div className="actionsWidgetModal__radioBtnLabel">
            {props.t('Time remaining')}
          </div>
          <ToggleSwitch
            isSwitchedOn={
              !props.selectedHiddenColumns.includes('time_remaining')
            }
            toggle={() => onToggleHiddenColumn('time_remaining')}
          />

          <div className="actionsWidgetModal__radioBtnLabel">
            {props.t('Also assigned')}
          </div>
          <ToggleSwitch
            isSwitchedOn={!props.selectedHiddenColumns.includes('assignment')}
            toggle={() => onToggleHiddenColumn('assignment')}
          />
        </div>
      </>
    ),
  };
  return (
    <Modal
      title={props.t('Actions Widget Settings')}
      isOpen={props.isOpen}
      close={() => props.onClickCloseModal()}
      style={{ overflow: 'visible', height: '490px' }}
      width={690}
    >
      <FormValidator successAction={onSubmit}>
        <div className="actionsWidgetModal">
          <div className="actionsWidgetModal__form">
            <TabBar
              customStyles=".rc-tabs-bar { padding: 0 24px; }, .rc-tabs::before { background-color: unset }, .rc-tabs-tabpane { position: relative; background-color: unset }"
              kitmanDesignSystem
              tabPanes={[actionSettingsTab, tableSettingsTab]}
            />
          </div>
          <div className="actionsWidgetModal__footer">
            <TextButton text={props.t('Save')} type="primary" isSubmit />
          </div>
        </div>
        <AppStatus status={props.status} close={props.onClickCloseAppStatus} />
      </FormValidator>
    </Modal>
  );
}

export default ActionsWidgetModal;
export const ActionsWidgetModalTranslated =
  withNamespaces()(ActionsWidgetModal);
