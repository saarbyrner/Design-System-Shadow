// @flow

import { css } from '@emotion/react';
import { EditableInput, LoadingSpinner } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';

const style = {
  loaderWrapper: css`
    margin: 0 8px;
  `,
  editTitleIcon: css`
    margin-left: 8px;
    cursor: pointer;
  `,
};

type Props = {
  initialValue?: string | Function,
  onSubmit: Function,
  isTitleSaving: boolean,
  title: ?string,
};
const EditableTitle = ({
  initialValue,
  onSubmit,
  title,
  isTitleSaving,
}: Props) => (
  <EditableInput
    value={initialValue}
    onSubmit={onSubmit}
    styles={{
      container: css`
        display: flex;
        align-items: start;
        button {
          margin-top: 2px;
        }
        input {
          min-width: 200px;
          max-width: 1000px;
          width: calc(${title?.length}ch + 8px);
        }
      `,
    }}
    renderContent={({ value, onClick }) => (
      <span>
        {value}
        {!isTitleSaving && (
          <i
            css={style.editTitleIcon}
            onClick={onClick}
            className="icon-edit"
            data-testid="edit-title-icon"
            onKeyDown={(e) => e.key === 'Enter' && onClick}
          />
        )}
        {isTitleSaving && (
          <div css={style.loaderWrapper}>
            <LoadingSpinner size={30} color={colors.grey_400} />
          </div>
        )}
      </span>
    )}
    maxWidth={1000}
    maxLength={191}
    withMaxLengthCounter
  />
);

export default EditableTitle;
