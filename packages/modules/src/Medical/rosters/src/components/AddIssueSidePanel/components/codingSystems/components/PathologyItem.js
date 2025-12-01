// @flow
import { IconButton } from '@kitman/components';
import style from '../../../AddIssueSidePanelStyle';

type Props = {
  label: string,
  value: ?string | number,
  withEdit?: boolean,
  onEdit?: Function,
};

const PathologyItem = (props: Props) => {
  return (
    <>
      <span css={style.pathologyDescriptionLabel}>{props.label}</span>
      <div css={style.flexRow}>
        <span css={style.pathologyDescriptionValue}>{props.value}</span>
        {props.withEdit && (
          <IconButton
            icon="icon-edit"
            isTransparent
            isSmall
            onClick={props.onEdit}
          />
        )}
      </div>
    </>
  );
};

export default PathologyItem;
