// @flow
import { colors } from '@kitman/common/src/variables';

const style = {
  backButton: {
    margin: '8px 24px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  anchorText: {
    color: colors.grey_100,
    fontWeight: 600,
    '&:hover': {
      color: colors.grey_200,
    },
  },
};

const BackButton = ({
  setSelectedParentOption,
  label,
}: {
  setSelectedParentOption: Function,
  label: string,
}) => {
  return (
    <div css={style.backButton}>
      <a
        css={style.anchorText}
        className="kitmanReactSelect__backButton"
        onClick={() => setSelectedParentOption(null)}
      >
        <i css={style.anchorText} className="icon-next-left" />
        {label}
      </a>
    </div>
  );
};

export default BackButton;
