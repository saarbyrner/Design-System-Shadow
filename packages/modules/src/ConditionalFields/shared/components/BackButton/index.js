// @flow
import { useDispatch } from 'react-redux';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import { withNamespaces } from 'react-i18next';
import { Link } from '@kitman/components';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

import { reset as resetToasts } from '@kitman/modules/src/Toasts/toastsSlice';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { onResetFormState } from '../../redux/slices/conditionBuildViewSlice';

type Props = {
  text?: string,
};

const style = {
  backButton: css`
    align-items: center;
    color: ${colors.grey_100} !important;
    display: flex;
    margin-bottom: 16px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    max-width: 120px;
    &:hover {
      color: ${colors.grey_100};
      text-decoration: none;
    }
    i {
      display: inline-block;
      margin-right: 4px;
    }
  `,
};

const BackButton = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const historyGo = useHistoryGo();
  return (
    <Link
      css={style.backButton}
      href="#"
      onClick={() => {
        historyGo(-1);
        dispatch(onResetFormState());
        dispatch(resetToasts());
      }}
    >
      <i className="icon-next-left" />
      {props.text || props.t('Back')}
    </Link>
  );
};

export const BackButtonTranslated = withNamespaces()(BackButton);
export default BackButton;
