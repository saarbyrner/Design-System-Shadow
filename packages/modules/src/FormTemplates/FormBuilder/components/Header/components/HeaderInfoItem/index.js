// @flow

import { Typography, Grid, Skeleton } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';

type Props = {
  label: string,
  value: string,
  isLoading: boolean,
};

const HeaderInfoItem = ({ label, value, isLoading }: Props) => {
  return (
    <Grid item>
      <Typography variant="subtitle1" color={colors.grey_100}>
        {isLoading ? <Skeleton width={80} height={20} /> : label}
      </Typography>
      <Typography variant="body2" color={colors.grey_200}>
        {isLoading ? (
          <Skeleton width={120} height={20} animation="wave" />
        ) : (
          value
        )}
      </Typography>
    </Grid>
  );
};

export default HeaderInfoItem;
