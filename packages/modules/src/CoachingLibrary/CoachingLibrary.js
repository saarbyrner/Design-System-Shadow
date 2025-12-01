// @flow
import { useState, useEffect } from 'react';
import useLocationHash from '@kitman/common/src/hooks/useLocationHash';
import { useInRouterContext } from 'react-router-dom';

import { Drills, DrillArchive } from './components';

export default () => {
  const isInRouterContext = useInRouterContext();
  const getContent = () => {
    switch (window.location.hash) {
      case '#archive':
        return <DrillArchive />;
      default:
        return <Drills />;
    }
  };
  const [content, setContent] = useState(getContent());
  useEffect(
    (): Function | typeof undefined => {
      if (isInRouterContext) {
        setContent(getContent());
      } else {
        const onHashChange = () => setContent(getContent());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
      }
      // Return here to satisfy ESLint’s consistent-return.
      // undefined instead of null because React asks it explicitly.
      return undefined;
    },
    isInRouterContext ? [useLocationHash()] : []
  );

  return content;
};
