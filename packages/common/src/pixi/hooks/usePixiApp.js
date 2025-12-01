// @flow
import { useContext } from 'react';

import { Pixi } from '@kitman/common/src/pixi/contexts';
import { type PixiApp } from '@kitman/common/src/pixi/types/pixi';

const usePixiApp = (): PixiApp => useContext<PixiApp>(Pixi);

export default usePixiApp;
