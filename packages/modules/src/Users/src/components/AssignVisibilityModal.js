// @flow
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import colors from '@kitman/common/src/variables/colors';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Modal, TextButton, Select } from '@kitman/components';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { StaffUserTypes } from '@kitman/services/src/services/medical/getStaffUsers';
import type { Annotations } from '@kitman/services/src/services/medical/bulkUpdateNotes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useBulkUpdateNotesQuery } from '../../../Medical/shared/redux/services/medical';
import { setInactiveUsers, setAssignVisibilityModal } from '../redux/actions';
import {
  getInactiveUsers,
  getAllActiveUsers,
  getAssignVisibilityModal,
} from '../redux/selectors';

const styles = {
  staffSelect: css`
    margin-top: 20px;
  `,
  ownerSelect: css`
    margin-top: 20px;
    padding: 20px;
    padding-right: 0;
    border: 1px solid ${colors.grey_100_50};
    border-left: 5px solid ${colors.grey_100_50};
    border-right: none;
  `,
};

type Props = {
  toastAction: Function,
};

const AssignVisibilityModal = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const [users, setUsers] = useState<Array<number>>([]);
  const [owner, setOwner] = useState<?number>(null);
  const [notes, setNotes] = useState<?Annotations>(null);

  const inactiveUsers = useSelector(getInactiveUsers);
  const { open, user } = useSelector(getAssignVisibilityModal);
  const activeUsers = useSelector(getAllActiveUsers);

  const mapStaffToOptions = (staffUsers: StaffUserTypes) => {
    const options: Array<Option> = staffUsers.map((staff) => ({
      value: staff.id,
      label: [staff.firstname, ' ', staff.lastname].join(''),
    }));
    return options;
  };

  const updateInactiveUsers = () => {
    const newInactiveUsers = [...inactiveUsers];
    const index = newInactiveUsers.findIndex(
      (inactiveUser) => inactiveUser.id === user.id
    );
    if (index !== -1) {
      delete newInactiveUsers[index].orphaned_annotation_ids;
      dispatch(setInactiveUsers(newInactiveUsers));
    }
  };

  const handleCloseModal = () => {
    setUsers([]);
    setOwner(null);
    dispatch(
      setAssignVisibilityModal({
        open: false,
        user: null,
      })
    );
  };

  useEffect(() => {
    if (users.length === 1) {
      setOwner(users[0]);
    } else {
      setOwner(null);
    }
  }, [users]);

  const { isSuccess: isAssignVisibilitySuccess } = useBulkUpdateNotesQuery(
    notes,
    {
      skip: !notes,
    }
  );

  useEffect(() => {
    if (isAssignVisibilitySuccess) {
      props.toastAction({
        type: 'CREATE_TOAST',
        toast: {
          id: user.id,
          title: props.t('Visibility assigned successfully'),
          status: 'SUCCESS',
        },
      });

      updateInactiveUsers();
      handleCloseModal();
    }
  }, [isAssignVisibilitySuccess]);

  const handleAssignVisibility = () => {
    const annotations = user.orphaned_annotation_ids.map((annotationId) => ({
      id: annotationId,
      created_by: owner,
      allow_list: users,
    }));

    setNotes({ annotations });
  };

  return (
    <Modal isOpen={open} onPressEscape={handleCloseModal} width="large">
      <Modal.Header>
        <Modal.Title>{props.t('Assign visibility')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>
          {user &&
            user.orphaned_annotation_ids &&
            `${
              user.orphaned_annotation_ids.length === 1
                ? props.t('There is {{count}} private note', {
                    count: user.orphaned_annotation_ids.length,
                  })
                : props.t('There are {{count}} private notes', {
                    count: user.orphaned_annotation_ids.length,
                  })
            } visible to the user. Select active users to assign visibility of these private items.`}
        </p>
        <div css={styles.staffSelect}>
          <Select
            options={mapStaffToOptions(activeUsers ?? [])}
            label={props.t('Select users to assign visibility')}
            invalid={false}
            value={users}
            onChange={(staff) => setUsers(staff)}
            isMulti
            appendToBody
          />
        </div>
        <div css={styles.ownerSelect}>
          <Select
            options={mapStaffToOptions(activeUsers ?? []).filter((activeUser) =>
              users.includes(activeUser.value)
            )}
            label={props.t('Select a user to assign as owner')}
            invalid={false}
            value={owner}
            onChange={(activeUser) => setOwner(activeUser)}
            appendToBody
            isSearchable={false}
            isDisabled={!users.length}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          type="subtle"
          onClick={handleCloseModal}
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Assign now')}
          type="primary"
          isDisabled={users.length === 0 || !owner}
          onClick={handleAssignVisibility}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const AssignVisibilityModalTranslated: ComponentType<Props> =
  withNamespaces()(AssignVisibilityModal);
export default AssignVisibilityModal;
