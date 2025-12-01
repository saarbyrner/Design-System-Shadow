// @flow
import { Box, Typography } from '@kitman/playbook/components';
import { DelayedLoadingFeedback } from '@kitman/components';
import {
  STATUS,
  CONNECTION_ERROR,
} from '@kitman/modules/src/analysis/LookerDashboardGroup/constants';
import type { StatusType } from '@kitman/modules/src/analysis/LookerDashboardGroup/types';

const style = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: '12.5rem',
};

type Props = {
  status: StatusType,
};

const DashboardStatus = ({ status }: Props) => {
  const renderContent = () => {
    switch (status) {
      case STATUS.LOADING:
        return <DelayedLoadingFeedback />;
      case STATUS.CONNECTION_ERROR:
      case STATUS.ERROR_LOADING_DASHBOARD:
        return (
          <Typography variant="subtitle1" align="center">
            {CONNECTION_ERROR}
          </Typography>
        );

      default:
        return null;
    }
  };

  return <Box sx={style}>{renderContent()}</Box>;
};

export default DashboardStatus;
