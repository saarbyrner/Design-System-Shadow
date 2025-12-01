// @flow
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@kitman/playbook/components';

const DelayedLoadingFeedback = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div data-testid="DelayedLoadingFeedback">
      {show && (
        <Box
          className="delayedLoadingFeedback"
          gap={1}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <CircularProgress size={22} thickness={5} aria-label="Loading" />
          <p className="delayedLoadingFeedback__text">Loading ...</p>
        </Box>
      )}
    </div>
  );
};
export default DelayedLoadingFeedback;
