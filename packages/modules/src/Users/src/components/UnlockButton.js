// @flow
import i18n from '@kitman/common/src/utils/i18n';
import style from './style';

type UnlockButtonProps = {
  username: string,
  accessLocked: boolean,
  handleUnlockUser: Function,
};

const UnlockButton = (props: UnlockButtonProps) => {
  return (
    <>
      {props.accessLocked && (
        <div css={style.container}>
          <div css={style.iconContainer}>
            <i className="icon-lock" css={style.iconStyling} />
          </div>
          <button
            type="button"
            onClick={() => props.handleUnlockUser(props.username)}
            css={style.buttonStyling}
          >
            <h6 css={style.unlockText}>{i18n.t('Unlock')}</h6>
          </button>
        </div>
      )}
    </>
  );
};

export default UnlockButton;
