// @flow
import { colors } from '@kitman/common/src/variables';
import { getContentTypeIcon } from '@kitman/common/src/utils/mediaHelper';
import { InfoTooltip } from '@kitman/components';

const style = {
  cell: {
    display: 'flex',
    alignItems: 'start',
    color: `${colors.grey_300}`,
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    background: `${colors.white}`,
  },
  fileTypeIcon: {
    color: `${colors.grey_300}`,
    fontSize: '16px',
  },
};

type Props = {
  longText: string,
  valueLimit?: number,
  onlyShowIcon?: boolean,
  fileType?: string,
};

const TextCellTooltip = (props: Props) => {
  const VALUE_LENGTH_LIMIT = props.valueLimit ? props.valueLimit : 40;
  const shortText =
    props.longText?.length > VALUE_LENGTH_LIMIT
      ? `${props.longText.substring(0, VALUE_LENGTH_LIMIT - 4)} ...`
      : props.longText;

  const textContentToRender = props.onlyShowIcon ? (
    <i
      css={style.fileTypeIcon}
      className={getContentTypeIcon(props.fileType ? props.fileType : '')}
    />
  ) : (
    shortText
  );

  return (
    <InfoTooltip content={props.longText}>
      <div data-testid="TextCellTooltip|Cell" css={style.cell}>
        {textContentToRender}
      </div>
    </InfoTooltip>
  );
};

export default TextCellTooltip;
