// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  validateURL,
  getValidHref,
  containsWhitespace,
} from '@kitman/common/src/utils';
import {
  AppStatus,
  InputTextField,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import { saveDiagnosticLinks } from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useDiagnosticLinkForm from './hooks/useDiagnosticLinkForm';
import type { RequestStatus } from '../../types';
import style from './styles';

type Props = {
  isOpen: boolean,
  onClose: Function,
  diagnosticId: number,
  onSaveLink: Function,
  athleteId: number,
  initialDataRequestStatus: RequestStatus,
};

const AddDiagnosticLinkSidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [isLinkValidationCheckAllowed, setIsLinkValidationCheckAllowed] =
    useState(false);

  const { formState, dispatch } = useDiagnosticLinkForm();
  useEffect(() => {
    if (props.athleteId) {
      dispatch({ type: 'SET_ATHLETE_ID', athleteId: props.athleteId });
    }

    if (!props.isOpen) {
      dispatch({ type: 'CLEAR_FORM' });
    }
  }, [props.athleteId, props.isOpen]);

  useEffect(() => {
    if (props.diagnosticId) {
      dispatch({ type: 'SET_DIAGNOSTIC_ID', diagnosticId: props.diagnosticId });
    }
  }, [props.diagnosticId]);

  const clearDiagnosticLinks = () => {
    dispatch({
      type: 'REMOVE_ATTACHMENT_TYPE',
      queuedAttachmentType: 'LINK',
    });
    dispatch({
      type: 'CLEAR_QUEUED_LINKS',
    });
    dispatch({
      type: 'SET_LINK_URI',
      linkUri: '',
    });
    dispatch({
      type: 'SET_LINK_TITLE',
      linkTitle: '',
    });
    setIsLinkValidationCheckAllowed(false);
  };

  const onSaveLink = () => {
    setIsLinkValidationCheckAllowed(true);

    const requiredLinkFields = [
      formState.linkTitle.length > 0,
      validateURL(formState.linkUri) && !containsWhitespace(formState.linkUri),
    ];
    const allRequiredLinkFieldsAreValid = requiredLinkFields.every(
      (item) => item
    );

    // If the validation fails, abort
    if (!allRequiredLinkFieldsAreValid) {
      return;
    }
    // If validation passes, dispatch
    dispatch({
      type: 'UPDATE_QUEUED_LINKS',
      queuedLinks: [
        {
          title: formState.linkTitle,
          uri: getValidHref(formState.linkUri),
        },
      ],
    });
    dispatch({
      type: 'SET_LINK_URI',
      linkUri: '',
    });
    dispatch({
      type: 'SET_LINK_TITLE',
      linkTitle: '',
    });
    setIsLinkValidationCheckAllowed(false);
    // checkDisabled(formState.queuedLinks);
  };
  const onSave = () => {
    const requiredFields = [
      formState.diagnosticId,
      formState.athleteId,
      formState.queuedLinks.length > 0,
    ];

    const allRequiredFieldsAreValid = requiredFields.every((item) => item);

    // If the validation fails, abort
    if (!allRequiredFieldsAreValid) {
      return;
    }
    saveDiagnosticLinks(
      // $FlowFixMe athleteId cannot be null here as validation will have caught it
      formState.athleteId,
      // $FlowFixMe diagnosticId cannot be null here as validation will have caught it
      formState.diagnosticId,
      formState.queuedLinks
    )
      .then((fetchedUpdatedDiagnostic) => {
        setRequestStatus('SUCCESS');
        props.onSaveLink(fetchedUpdatedDiagnostic);
        props.onClose();
      })
      .catch(() => setRequestStatus('FAILURE'));
  };

  return (
    <div css={style.sidePanel}>
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={props.t('Add link to diagnostic')}
        onClose={() => {
          clearDiagnosticLinks();
          props.onClose();
        }}
        width={659}
      >
        <div css={style.content}>
          {' '}
          <div css={[style.linkContainer]}>
            <div css={style.linkTitle}>
              <InputTextField
                data-testid="AddDiagnosticLinkSidePanel|Title"
                label={props.t('Title')}
                value={formState.linkTitle || ''}
                onChange={(e) => {
                  dispatch({
                    type: 'SET_LINK_TITLE',
                    linkTitle: e.target.value,
                  });
                }}
                invalid={
                  isLinkValidationCheckAllowed &&
                  formState.linkTitle.length === 0
                }
                kitmanDesignSystem
              />
            </div>
            <div css={style.linkUri}>
              <InputTextField
                data-testid="AddDiagnosticLinkSidePanel|Link"
                label={props.t('Link')}
                value={formState.linkUri || ''}
                onChange={(e) => {
                  dispatch({
                    type: 'SET_LINK_URI',
                    linkUri: e.target.value,
                  });
                }}
                invalid={
                  isLinkValidationCheckAllowed &&
                  (!validateURL(formState.linkUri) ||
                    containsWhitespace(formState.linkUri)) &&
                  formState.linkUri.length >= 0
                }
                kitmanDesignSystem
              />
            </div>
            <div css={style.linkAddButton}>
              <TextButton
                text={props.t('Add')}
                type="secondary"
                onClick={onSaveLink}
                kitmanDesignSystem
              />
            </div>
            {formState.queuedLinks.length > 0 && (
              <div css={style.renderedLinkContainer}>
                {formState.queuedLinks.map((queuedLink) => {
                  const textForURI = queuedLink.uri.startsWith('//')
                    ? queuedLink.uri.substring(2)
                    : queuedLink.uri;
                  return (
                    <div css={style.linkRender} key={queuedLink.id}>
                      <TextButton
                        onClick={() =>
                          dispatch({
                            type: 'REMOVE_QUEUED_LINK',
                            id: queuedLink.id,
                          })
                        }
                        iconBefore="icon-bin"
                        type="subtle"
                        kitmanDesignSystem
                      />
                      <div>
                        <span>{queuedLink.title}</span>-
                        <a
                          href={queuedLink.uri}
                          css={style.attachmentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {' '}
                          {textForURI}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div css={style.actions}>
          <TextButton
            isDisabled={formState.queuedLinks.length === 0}
            onClick={onSave}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
        {(requestStatus === 'FAILURE' ||
          props.initialDataRequestStatus === 'FAILURE') && (
          <AppStatus status="error" />
        )}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddDiagnosticLinkSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddDiagnosticLinkSidePanel);
export default AddDiagnosticLinkSidePanel;
