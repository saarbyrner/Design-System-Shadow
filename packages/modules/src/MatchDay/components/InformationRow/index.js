// @flow
import { Stack, Typography } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';

const styles = {
  label: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: 600,
    color: colors.grey_300,
  },
  labelText: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: 400,
    color: colors.grey_200,
  },
};

type InformationRowProps = {
  label: string,
  value: string | number,
  hideInfo?: boolean,
};

const InformationRow = ({ label, value, hideInfo }: InformationRowProps) => {
  return (
    <Stack direction="row" gap={1}>
      <Typography sx={styles.label}>{label}</Typography>
      <Typography sx={styles.labelText}>
        {hideInfo ? 'Lorem ipsum' : value}
      </Typography>
    </Stack>
  );
};

export default InformationRow;
