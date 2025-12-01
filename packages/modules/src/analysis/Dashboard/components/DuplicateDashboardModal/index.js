// @flow
import { withNamespaces } from 'react-i18next';

import {
  AppStatus,
  InputText,
  Modal,
  Select,
  TextButton,
} from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ModalStatus } from '@kitman/common/src/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

type Props = {
  dashboardName: string,
  isOpen: boolean,
  onChangeDashboardName: Function,
  onClickCloseAppStatus: Function,
  onClickCloseModal: Function,
  onClickSaveDuplicateDashboard: Function,
  status: ?ModalStatus,
  selectedSquad: Squad,
  activeSquad: Squad,
  squadData: {
    data: Array<Squad>,
    isFetching: boolean,
    refetch: Function,
    error: Object,
  },
  onChangeSelectedSquad: Function,
};

const style = {
  field: {
    marginBottom: '30px',
    width: '360px',
  },
  error: {
    fontWeight: '600',
    fontSize: '12px',
    color: colors.red_100,
  },
  refetchLink: {
    fontWeight: 600,
    fontSize: '12px',
    color: colors.blue_100,
    cursor: 'pointer',

    ':hover': {
      textDecoration: 'underline',
    },
  },
};

function DuplicateDashboardModal(props: I18nProps<Props>) {
  const {
    data: squads = [],
    isFetching: isFetchingSquads,
    error: squadsError,
    refetch: refetchSquads,
  } = props.squadData;
  const { trackEvent } = useEventTracking();

  const onSave = () => {
    trackEvent(reportingEventNames.duplicateDashboard);
    props.onClickSaveDuplicateDashboard();
  };

  return (
    <>
      <Modal
        onPressEscape={() => {
          props.onClickCloseModal();
        }}
        isOpen={props.isOpen}
        close={() => props.onClickCloseModal()}
      >
        <Modal.Header>
          <Modal.Title>{props.t('Duplicate Dashboard')}</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <div css={style.field}>
            <InputText
              value={props.dashboardName}
              label={props.t('Dashboard Name')}
              maxLength={40}
              onValidation={(input) => props.onChangeDashboardName(input.value)}
              required
              t={props.t}
              kitmanDesignSystem
              showRemainingChars={false}
            />
          </div>
          {window.getFlag('duplicate-across-squads') && (
            <>
              <div css={style.field}>
                <Select
                  data-testid="DuplicateDashboardModal|SquadSelect"
                  onChange={(squadId) => {
                    const selectedItem =
                      squads.find((squad) => squad.id === squadId) || {};
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
                  t={props.t}
                  onClear={() => {}}
                  appendToBody
                  isLoading={isFetchingSquads}
                  isDisabled={isFetchingSquads}
                  invalid={!isFetchingSquads && squadsError}
                />
              </div>
              {!isFetchingSquads && squadsError && (
                <>
                  <span
                    data-testid="DuplicateDashboardModal|SquadSelectError"
                    css={style.error}
                  >
                    {props.t('Error loading squads.')}
                  </span>
                  <a
                    data-testid="DuplicateDashboardModal|SquadSelectErrorAction"
                    css={style.refetchLink}
                    onClick={() => refetchSquads()}
                  >
                    {props.t(' Retry.')}
                  </a>
                </>
              )}
            </>
          )}
        </Modal.Content>

        <Modal.Footer>
          <TextButton
            data-testid="DuplicateDashboardModal|CancelButton"
            text={props.t('Cancel')}
            onClick={() => {
              props.onClickCloseModal();
            }}
            kitmanDesignSystem
          />
          <TextButton
            data-testid="DuplicateDashboardModal|SaveButton"
            text={props.t('Save')}
            size="small"
            type="primary"
            onClick={onSave}
            kitmanDesignSystem
          />
        </Modal.Footer>
      </Modal>
      <AppStatus status={props.status} close={props.onClickCloseAppStatus} />
    </>
  );
}

export default DuplicateDashboardModal;
export const DuplicateDashboardModalTranslated = withNamespaces()(
  DuplicateDashboardModal
);
