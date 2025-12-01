// @flow
import { TextLink } from '@kitman/components';

import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  avatar: css`
    border-radius: 50%;
    height: 32px;
    width: 32px;
    margin-right: 8px;
  `,
  name: css`
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
  `,
};

type Props = {
  avatarUrl: string,
  fullname: string,
  annotationableId: number,
};

const Athlete = (props: Props) => {
  return (
    <h2 css={styles.name} data-testid="Athlete|Root">
      <img css={styles.avatar} src={props.avatarUrl} alt={props.fullname} />
      <TextLink
        text={props.fullname}
        href={`/medical/athletes/${props.annotationableId}`}
      />
    </h2>
  );
};

export default Athlete;
