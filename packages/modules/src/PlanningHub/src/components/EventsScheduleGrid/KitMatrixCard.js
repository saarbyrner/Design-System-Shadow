// @flow
import { Paper } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';

type Props = {
  type: string,
  backgroundColor: string,
  isDisabled?: boolean,
};

const KitMatrixCard = ({ backgroundColor, type, isDisabled }: Props) => {
  const isAwayType = type === 'awayGoalkeeper' || type === 'awayPlayer';
  // eslint-disable-next-line no-nested-ternary
  const backgroundColorValue = backgroundColor
    ? `#${backgroundColor}`
    : isAwayType && !isDisabled
    ? colors.grey_100_50
    : colors.white;

  return (
    <Paper
      data-testid="KitMatrixCard"
      elevation={3}
      sx={{
        width: 30,
        height: 30,
        position: 'relative',
        borderRadius: '8px',
        border: '1px solid #8F96A1',
        backgroundColor: backgroundColorValue,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'none',
        ...(!backgroundColor && {
          '&:before': {
            content: '""',
            position: 'absolute',
            // calculate the length of the diagonal
            width: `${30 * Math.sqrt(2) - 8}px`,
            height: '1px',
            backgroundColor: colors.red_100,
            top: '1px',
            left: '3px',
            transform: 'rotate(45deg)',
            transformOrigin: 'top left',
          },
        }),
      }}
    />
  );
};

export default KitMatrixCard;
