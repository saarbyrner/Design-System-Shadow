// @flow
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { zIndices, colors } from '@kitman/common/src/variables';

import Toast from '@kitman/components/src/Toast/KitmanDesignSystem/Toast/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const style = {
  wrapper: css`
    align-items: flex-end;
    bottom: 100px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    justify-content: flex-end;
    position: fixed;
    right: 24px;
    z-index: ${zIndices.toastDialog};

    // on mobile
    @media (max-width: 425px) {
      right: 0px;
      left: 0px;
    }
  `,
  toastItem: css`
    display: flex;
    grid-column: 1 / 3;
  `,
  linkItems: css`
    display: flex;
    grid-column: 1 / 3;
    gap: 24px;
  `,
  title: css`
    font-size: 14px;
    margin-left: 10px;
  `,
  link: css`
    color: ${colors.grey_100} !important;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    &:hover {
      color: ${colors.grey_100};
      text-decoration: underline;
    }
  `,
};

type Props = {
  isVisible: boolean,
  editGame: Function,
  close: Function,
};

const MandatoryFieldsToast = (props: I18nProps<Props>) => {
  return (
    props.isVisible && (
      <div css={style.wrapper}>
        <Toast id="mandatoryFieldToast" status="WARNING" onClose={() => {}}>
          <div css={style.toastItem}>
            <Toast.Icon />
            <h6 css={style.title}>
              {props.t(
                'Game events cannot be added until mandatory game details are complete.'
              )}
            </h6>
          </div>
          <div css={style.linkItems}>
            <div />
            <a css={style.link} onClick={props.editGame}>
              {props.t('Edit game details')}
            </a>
            <a css={style.link} onClick={props.close}>
              {props.t('Ignore')}
            </a>
          </div>
        </Toast>
      </div>
    )
  );
};

export const MandatoryFieldsToastTranslated =
  withNamespaces()(MandatoryFieldsToast);
export default MandatoryFieldsToast;
