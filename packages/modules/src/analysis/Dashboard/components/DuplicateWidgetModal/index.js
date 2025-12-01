// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  AppStatus,
  InputText,
  Modal,
  Select,
  TextButton,
} from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import type { ModalStatus } from '@kitman/common/src/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';

type QueryData = {
  data: Array<Object>,
  isFetching: boolean,
  refetch: Function,
  error: Object,
};

type Props = {
  dashboard: Dashboard,
  isNameEditable: boolean,
  isOpen: boolean,
  onChangeDuplicateWidgetName: Function,
  onChangeSelectedDashboard: Function,
  onChangeSelectedSquad: Function,
  onClickCloseAppStatus: Function,
  onClickCloseModal: Function,
  onClickSaveDuplicateWidget: Function,
  selectedDashboard: Dashboard,
  selectedSquad: Squad,
  activeDashboard: Dashboard,
  activeSquad: Squad,
  status: ?ModalStatus,
  widgetName: string,
  widgetType: string,
  dashboardData: QueryData,
  squadData: QueryData,
};

const style = {
  container: { padding: '20px 0' },
  field: { marginBottom: '30px', width: '360px' },
  error: { fontWeight: '600', fontSize: '12px', color: colors.red_100 },
  refetchLink: {
    fontWeight: '600',
    fontSize: '12px',
    color: colors.blue_100,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

function DuplicateWidgetModal(props: I18nProps<Props>) {
  const {
    data: squads = [],
    isFetching: isFetchingSquads,
    error: squadsError,
    refetch: refetchSquads,
  } = props.squadData;
  const {
    data: dashboards = [],
    isFetching: isFetchingDashboards,
    error: dashboardsError,
    refetch: refetchDashboards,
  } = props.dashboardData;
  const emptyName = props.isNameEditable && !props.widgetName?.trim();

  const widgetTypeTitles = {
    annotation: props.t('Notes'),
    athlete_profile: props.t('Profile'),
    header: props.t('Header'),
    graph: props.t('Graph'),
    action: props.t('Actions'),
    table: props.t('Table'),
    chart: props.t('Chart'),
  };

  const canSave = useMemo(() => {
    if (dashboardsError || squadsError || emptyName) {
      return false;
    }

    return props.selectedDashboard.squad_id === props.selectedSquad.id;
  }, [
    props.selectedSquad,
    props.selectedDashboard,
    dashboardsError,
    squadsError,
    emptyName,
  ]);

  const closeModal = () => {
    props.onChangeSelectedSquad(props.activeSquad);
    props.onChangeSelectedDashboard(props.activeDashboard);
    props.onClickCloseModal(props.activeDashboard);
  };

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onPressEscape={() => props.onClickCloseModal(props.dashboard)}
        close={closeModal}
      >
        <Modal.Header>
          <Modal.Title data-testid="DuplicateWidgetModal|Title">
            {widgetTypeTitles[props.widgetType]
              ? props.t('Duplicate {{widgetType}} Widget', {
                  widgetType: widgetTypeTitles[props.widgetType],
                })
              : props.t('Duplicate Widget')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <div css={style.container}>
            {props.isNameEditable ? (
              <div css={style.field}>
                <InputText
                  value={props.widgetName}
                  label={props.t('Widget Name')}
                  maxLength={255}
                  onValidation={(input) =>
                    props.onChangeDuplicateWidgetName(input.value)
                  }
                  required
                  data-testid="DuplicateWidgetModal|Input"
                  kitmanDesignSystem
                  showRemainingChars={false}
                />
              </div>
            ) : null}
            {window.getFlag('duplicate-across-squads') && (
              <div css={style.field}>
                <Select
                  data-testid="DuplicateWidgetModal|SquadSelect"
                  onChange={(id) => {
                    const selectedItem =
                      squads.find((squad) => squad.id === id) || {};
                    props.onChangeSelectedSquad(selectedItem);
                  }}
                  options={squads.map((squad) => ({
                    value: squad.id,
                    label:
                      squad.id === props.activeSquad.id
                        ? props.t('{{squadName}} (Current)', {
                            squadName: squad.name,
                          })
                        : squad.name,
                  }))}
                  label={props.t('Select Squad')}
                  value={props.selectedSquad.id}
                  onClear={() => {}}
                  appendToBody
                  isLoading={isFetchingSquads}
                  isDisabled={isFetchingSquads}
                  invalid={!isFetchingSquads && squadsError}
                />
                {!isFetchingSquads && squadsError && (
                  <>
                    <span
                      data-testid="DuplicateWidgetModal|SquadSelectError"
                      css={style.error}
                    >
                      {props.t('Error loading squads.')}
                    </span>
                    <a
                      data-testid="DuplicateWidgetModal|SquadSelectErrorAction"
                      css={style.refetchLink}
                      onClick={() => refetchSquads()}
                    >
                      {props.t(' Retry.')}
                    </a>
                  </>
                )}
              </div>
            )}
            <div css={{ width: '360px' }}>
              <Select
                data-testid="DuplicateWidgetModal|DashboardSelect"
                onChange={(dashboardId) => {
                  const selectedItem =
                    dashboards.find(
                      (dashboard) => dashboard.id === dashboardId
                    ) || {};
                  props.onChangeSelectedDashboard(selectedItem);
                }}
                options={dashboards.map((dashboard) => ({
                  value: dashboard.id,
                  label:
                    dashboard.id === props.activeDashboard.id &&
                    window.getFlag('duplicate-across-squads')
                      ? props.t('{{dashboardName}} (Current)', {
                          dashboardName: dashboard.name,
                        })
                      : dashboard.name,
                }))}
                label={props.t('Select Dashboard')}
                value={props.selectedDashboard.id}
                onClear={() => {}}
                appendToBody
                isLoading={isFetchingDashboards}
                isDisabled={isFetchingDashboards}
                invalid={!isFetchingDashboards && dashboardsError}
              />
              {!isFetchingDashboards && dashboardsError && (
                <>
                  <span
                    data-testid="DuplicateWidgetModal|DashboardSelectError"
                    css={style.error}
                  >
                    {props.t('Error loading dashboards.')}
                  </span>
                  <a
                    data-testid="DuplicateWidgetModal|DashboardSelectErrorAction"
                    css={style.refetchLink}
                    onClick={() => refetchDashboards()}
                  >
                    {props.t(' Retry.')}
                  </a>
                </>
              )}
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <TextButton
            text={props.t('Cancel')}
            onClick={closeModal}
            kitmanDesignSystem
          />
          <TextButton
            data-testid="DuplicateWidgetModal|SaveButton"
            isDisabled={!canSave}
            text={props.t('Save')}
            type="primary"
            onClick={() => {
              props.onClickSaveDuplicateWidget();
            }}
            kitmanDesignSystem
          />
        </Modal.Footer>
      </Modal>

      <AppStatus status={props.status} close={props.onClickCloseAppStatus} />
    </>
  );
}

export default DuplicateWidgetModal;
export const DuplicateWidgetModalTranslated =
  withNamespaces()(DuplicateWidgetModal);
