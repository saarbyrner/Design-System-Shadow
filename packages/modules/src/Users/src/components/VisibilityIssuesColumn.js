// @flow
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { TextButton } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { User } from '../types';
import { setAssignVisibilityModal } from '../redux/actions';

const styles = {
  tableHeader: css`
    width: fit-content;
    margin-bottom: 16px;
  `,
  searchInput: css`
    margin-left: 24px;
  `,
  visibilityIssues: css`
    display: flex;
    align-items: center;

    > div {
      display: flex;
      align-items: center;

      color: ${colors.red_100};
      font-weight: 500;
      margin-right: 10px;
    }

    .icon-error-active {
      margin-right: 3px;
    }
  `,
};

type Props = {
  user: User,
};

function VisibilityIssuesColumn(props: I18nProps<Props>) {
  const dispatch = useDispatch();

  const handleOnClick = () => {
    dispatch(
      setAssignVisibilityModal({
        open: true,
        user: props.user,
      })
    );
  };

  return (
    <>
      {props.user.orphaned_annotation_ids &&
      props.user.orphaned_annotation_ids.length !== 0 ? (
        <div css={styles.visibilityIssues}>
          <div>
            <i className="icon-error-active" />
            <div>
              {`${props.user.orphaned_annotation_ids.length} ${
                props.user.orphaned_annotation_ids.length === 1
                  ? props.t('private note')
                  : props.t('private notes')
              }`}
            </div>
          </div>
          <TextButton
            type="secondary"
            size="small"
            onClick={handleOnClick}
            text="Resolve"
            kitmanDesignSystem
          />
        </div>
      ) : (
        '-'
      )}
    </>
  );
}

export const VisibilityIssuesColumnTranslated = withNamespaces()(
  VisibilityIssuesColumn
);
export default VisibilityIssuesColumn;
