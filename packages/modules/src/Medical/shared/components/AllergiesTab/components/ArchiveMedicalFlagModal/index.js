// @flow
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import {
  getArchiveMedicalFlagReasons,
  archiveMedicalAlert,
  archiveAllergy,
} from '@kitman/services';
import handleError from '@kitman/modules/src/Medical/shared/hooks/handleError';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import {
  addToast,
  updateToast,
  removeToast,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import type {
  AllergyDataResponse,
  AthleteMedicalAlertDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';
import { Modal, Select, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ErrorDetailType } from '../../../../hooks/handleError';

type Props = {
  selectedMedicalFlag: AllergyDataResponse | AthleteMedicalAlertDataResponse,
  isOpen: boolean,
  onClose: Function,
  setRequestStatus: Function,
  enableReloadData?: Function,
};

const ArchiveMedicalFlagModal = (props: I18nProps<Props>) => {
  const [archiveReason, setArchiveReason] = useState<number>(0);
  const [archiveModalOptions, setArchiveModalOptions] = useState([]);
  const [medicalFlagType, setMedicalFlagType] = useState(
    props.t('medical flag')
  );
  const [previousErrors, setPreviousErrors] = useState<Array<ErrorDetailType>>(
    []
  );
  const [modalPrefix, setModalPrefix] = useState<string>('');
  const isMountedCheck = useIsMountedCheck();
  const dispatch = useDispatch();

  const handleLocalErrors = (error, errorMetaData, localData) => {
    let errorWasHandled = false; // Unless changed to true will result in Global Error Screen being triggered
    let shouldCloseModal = true; // Default to close modal
    const toastId = `${localData.id}-${error.key}`;

    // Remove 'Archiving..' toast
    dispatch(removeToast(localData.id));

    // Keep track of reoccuring errors
    setPreviousErrors((prev) => {
      const uniqueErrors = [...prev, error].filter(
        (err, index, self) =>
          index ===
          self.findIndex(
            (e) =>
              e.key === err.key &&
              e.message === err.message &&
              e.type === err.type
          )
      );
      return uniqueErrors;
    });

    // Handle errors one by one
    const isRecordNotFoundError = error.type === 'record_not_found';
    const isExecutionError = error.type === 'execution';
    if (isRecordNotFoundError) {
      switch (error.key) {
        case 'name': {
          errorWasHandled = true;

          const nameErrorOccurredPreviously = previousErrors.some(
            (prevError) =>
              prevError.key === 'name' &&
              prevError.message === 'Record (name) not found' &&
              prevError.type === 'record_not_found'
          );

          if (nameErrorOccurredPreviously) {
            shouldCloseModal = false;
            setModalPrefix(props.t('Reattempt - '));
          }

          dispatch({
            type: 'ADD_TOAST',
            payload: {
              toast: {
                id: toastId,
                title: props.t('Error retrieving by name'),
                status: 'ERROR',
              },
            },
          });
          break;
        }
        case 'id': {
          errorWasHandled = true;

          dispatch({
            type: 'ADD_TOAST',
            payload: {
              toast: {
                id: toastId,
                title: props.t('Error retrieving by id'),
                status: 'ERROR',
              },
            },
          });
          break;
        }
        default: {
          dispatch({
            type: 'ADD_TOAST',
            payload: {
              toast: {
                id: toastId,
                title: props.t('Error occurred'),
                status: 'ERROR',
              },
            },
          });
          break;
        }
      }
    } else if (isExecutionError) {
      errorWasHandled = true;
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          toast: {
            id: toastId,
            title: `Error occurred ${error.message} code: ${errorMetaData.code}`,
            status: 'ERROR',
          },
        },
      });
    }

    // Conditionally clean up UI after error
    if (shouldCloseModal !== false) {
      props.onClose();
    }

    return errorWasHandled;
  };

  useEffect(() => {
    getArchiveMedicalFlagReasons()
      .then((reasons) => {
        if (!isMountedCheck()) return;
        const modalOptions = reasons.map((option) => {
          return {
            label: option.name,
            value: option.id,
          };
        });
        setArchiveModalOptions(modalOptions);
      })
      .catch(() => props.setRequestStatus('FAILURE'));
  }, []);

  useEffect(() => {
    setMedicalFlagType(
      props.selectedMedicalFlag?.allergen
        ? props.t('allergy')
        : props.t('medical alert')
    );
  }, [props.selectedMedicalFlag]);

  const archiveMedicalFlagByType = (
    archiveFunction,
    medicalFlag: any,
    reason
  ) => {
    archiveFunction(medicalFlag, reason)
      .then((data) => {
        if (data.id) {
          props.setRequestStatus('SUCCESS');
          dispatch(
            updateToast(data.id, {
              // capitalizes first letter of medical flag type
              title: `${
                medicalFlagType.charAt(0).toUpperCase() +
                medicalFlagType.slice(1)
              } archived successfully`,
              status: 'SUCCESS',
            }),
            setTimeout(() => dispatch(removeToast(data.id)), 4000)
          );
          props.enableReloadData?.(true);
          props.onClose();
        }
      })
      .catch((err) => {
        handleError(err, handleLocalErrors, medicalFlag);
      });
  };

  const onArchiveMedicalFlag = (medicalFlag, reason) => {
    dispatch(
      addToast({
        title: `Archiving ${medicalFlagType}`,
        status: 'LOADING',
        id: medicalFlag.id,
      })
    );

    if (medicalFlag.allergen && !medicalFlag.medical_alert) {
      return archiveMedicalFlagByType(archiveAllergy, medicalFlag, reason);
    }
    if (medicalFlag.medical_alert && !medicalFlag.allergen) {
      return archiveMedicalFlagByType(archiveMedicalAlert, medicalFlag, reason);
    }
    return false;
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={props.onClose}
      onClose={props.onClose}
    >
      <Modal.Header>
        <Modal.Title data-testid="archive-modal-header">
          {modalPrefix} {props.t('Archive')} {medicalFlagType}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>
          {props.t(
            `Please provide the reason why this ${medicalFlagType} is being archived`
          )}
        </p>

        <Select
          label={props.t('Reason for archiving:')}
          options={archiveModalOptions}
          onChange={(reason) => setArchiveReason(reason)}
          value={archiveReason}
          menuPosition="fixed"
          appendToBody
        />
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={() => {
            setArchiveReason(0);
            props.onClose();
          }}
          type="subtle"
          isDisabled={false}
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Archive')}
          type="primaryDestruct"
          onClick={() => {
            setArchiveReason(0);
            onArchiveMedicalFlag(props.selectedMedicalFlag, archiveReason);
          }}
          isDisabled={!archiveReason}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const ArchiveMedicalFlagModalTranslated: ComponentType<Props> =
  withNamespaces()(ArchiveMedicalFlagModal);
export default ArchiveMedicalFlagModal;
