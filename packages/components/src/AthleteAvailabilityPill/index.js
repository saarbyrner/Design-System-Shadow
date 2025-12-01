// @flow

import type { AthleteAvailabilities } from '@kitman/common/src/types/Event';
import getAthleteAvailabilityStyles from '@kitman/common/src/utils/getAthleteAvailabilityStyles';
import styles from './styles';

type Props = {
  availability?: AthleteAvailabilities,
};

const AthleteAvailabilityPill = ({ availability }: Props) => {
  if (!availability) {
    return null;
  }
  const { color, backgroundColor } = getAthleteAvailabilityStyles(availability);
  return (
    <div css={styles.label.default} style={{ backgroundColor }}>
      <div css={styles.dot.default} style={{ backgroundColor: color }} />
      <p>{availability}</p>
    </div>
  );
};

export default AthleteAvailabilityPill;
