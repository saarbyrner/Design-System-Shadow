import { isDevEnvironment } from '@kitman/common/src/utils';

const initMockServiceWorker = async () => {
  if (isDevEnvironment() && process.env.REACT_APP_MOCK_API) {
    const { worker } = await import('./browser');

    worker.start();
  }
};

export default initMockServiceWorker;
