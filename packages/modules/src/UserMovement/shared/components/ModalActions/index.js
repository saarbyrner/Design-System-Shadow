/* eslint-disable camelcase */
// @flow
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { Button } from '@kitman/playbook/components';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import {
  TRADE,
  MULTI_ASSIGN,
  movementTypeOptions,
} from '@kitman/modules/src/UserMovement/shared/constants';
import {
  onToggleModal,
  onReset,
} from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';
import { getFormState } from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import {
  initialFilters,
  getActiveSquadID,
} from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/hooks/useManageAthletesGrid';
import { getTitle } from '@kitman/modules/src/UserMovement/shared/config';

import {
  getOrganisation,
  getActiveSquad,
} from '@kitman/common/src/redux/global/selectors';
import {
  useCreateMovementRecordMutation,
  useLazySearchAthletesQuery,
} from '@kitman/modules/src/UserMovement/shared/redux/services';
import { getCurrentStatus } from '@kitman/modules/src/AthleteManagement/shared/redux/selectors';

const CREATE_MOVEMENT_RECORD_ID = 'CREATE_MOVEMENT_RECORD_ID';

const commomButtonProps = {
  disableRipple: true,
  size: 'small',
};

const ModalActions = (props: I18nProps<{}>) => {
  const dispatch = useDispatch();
  const currentOrganisation = useSelector(getOrganisation());
  const { trackEvent } = useEventTracking();

  const squadIds = useSelector(getActiveSquad());
  const statuses = useSelector(getCurrentStatus);
  const isAssociationAdmin = !!currentOrganisation?.association_admin;
  const {
    user_id,
    transfer_type,
    join_organisation_ids,
    join_squad_ids,
    leave_organisation_ids,
  } = useSelector(getFormState);
  const [lazyFetchManageAthletes] = useLazySearchAthletesQuery();

  const [onCreateMovementRecord, { isLoading: isCreateMovementRecordLoading }] =
    useCreateMovementRecordMutation();

  const initialArgs = initialFilters({
    isActive: statuses.activeStatus === 'ACTIVE',
    squadIds: getActiveSquadID(isAssociationAdmin, squadIds),
  });

  const selectedMovement = movementTypeOptions.find(
    (option) => option.value === transfer_type
  );

  const handleCreateMovementRecord = () => {
    onCreateMovementRecord({
      user_id,
      transfer_type: transfer_type === MULTI_ASSIGN ? TRADE : transfer_type,
      joined_at: moment().format(dateTransferFormat),
      join_squad_ids,
      join_organisation_ids,
      leave_organisation_ids,
    })
      .unwrap()
      .then(() => {
        dispatch(
          add({
            status: 'SUCCESS',
            title: props.t('{{transfer_type}} successfully created', {
              transfer_type: getTitle({ type: transfer_type }),
            }),
          })
        );
        trackEvent('Move Player', {
          Type: [selectedMovement?.label],
        });
        dispatch(onReset());
        lazyFetchManageAthletes({ ...initialArgs });
      })
      .catch(() => {
        dispatch(
          add({
            id: CREATE_MOVEMENT_RECORD_ID,
            status: 'ERROR',
            title: props.t('Error creating {{transfer_type}}', {
              transfer_type: getTitle({ type: transfer_type }),
            }),
          })
        );
        dispatch(onToggleModal());
      })
      .then(() => {
        setTimeout(() => {
          dispatch(remove(CREATE_MOVEMENT_RECORD_ID));
        }, 5000);
      });
  };

  return (
    <Fragment>
      <Button
        {...commomButtonProps}
        variant="text"
        onClick={() => dispatch(onToggleModal())}
        disabled={isCreateMovementRecordLoading}
      >
        {props.t('Cancel')}
      </Button>
      <Button
        {...commomButtonProps}
        color="primary"
        onClick={handleCreateMovementRecord}
        disabled={isCreateMovementRecordLoading}
      >
        {props.t('Confirm')}
      </Button>
    </Fragment>
  );
};

export const ModalActionsTranslated = withNamespaces()(ModalActions);
export default ModalActions;
