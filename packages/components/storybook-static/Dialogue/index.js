// @flow
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

// set the i18n instance
setI18n(i18n);

type Props = {
  message: string,
  type?: 'info' | 'confirm',
  isEmbed?: boolean,
  visible: boolean,
  cancelButtonText?: string,
  confirmButtonText?: string,
  cancelAction?: Function,
  confirmAction: Function,
};

const Dialogue = (props: I18nProps<Props>) => {
  const renderBtnContainer = () =>
    props.type === 'info' && props.cancelAction ? (
      <div className="reactDialogue__buttonContainer">
        <TextButton
          onClick={props.cancelAction}
          text={props.t('Ok')}
          type="primary"
        />
      </div>
    ) : (
      <div className="reactDialogue__buttonContainer">
        {props.cancelAction ? (
          <div className="reactDialogue__cancelButtonContainer">
            <TextButton
              onClick={props.cancelAction}
              text={
                props.cancelButtonText
                  ? props.cancelButtonText
                  : props.t('Cancel')
              }
              type="secondary"
            />
          </div>
        ) : null}
        <TextButton
          onClick={props.confirmAction}
          text={
            props.confirmButtonText
              ? props.confirmButtonText
              : props.t('Confirm')
          }
          type="primary"
        />
      </div>
    );

  return (
    <div
      role="dialog"
      className={`
      reactDialogue
      ${!props.visible ? 'reactDialogue--hidden' : ''}
      ${props.isEmbed ? 'reactDialogue--embed' : ''}
    `}
    >
      <div className="reactDialogue__background" />
      <div className="reactDialogue__container">
        <div>
          <p className="reactDialogue__message">{props.message}</p>
          {renderBtnContainer()}
        </div>
      </div>
    </div>
  );
};

export default Dialogue;
export const DialogueTranslated = withNamespaces()(Dialogue);
