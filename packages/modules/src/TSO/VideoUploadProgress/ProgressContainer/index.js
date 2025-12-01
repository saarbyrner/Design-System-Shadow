// @flow
import { UploadProgress, LoadingSpinner } from '@kitman/components';
import styles from './styles';

type Props = {
  title: string,
  onDelete?: Function,
  onTitleClick?: Function,
  progress: number,
};

const ProgressContainer = (props: Props) => {
  return (
    <div css={styles.container} data-testid="ProgressContainer">
      <button
        type="button"
        css={styles.deleteButton}
        onClick={() => props.onDelete?.()}
      >
        <span className="icon-bin" />
      </button>

      {props.onTitleClick ? (
        <button
          type="button"
          css={styles.titleButton}
          onClick={() => props.onTitleClick?.()}
        >
          {props.title}
        </button>
      ) : (
        <p>{props.title}</p>
      )}

      {props.progress === 0 ? (
        <LoadingSpinner size={16} strokeWidth={6} color="#3b4960" />
      ) : (
        <UploadProgress
          progress={props.progress}
          radius={12}
          strokeWidth={2.5}
        />
      )}
    </div>
  );
};

export default ProgressContainer;
