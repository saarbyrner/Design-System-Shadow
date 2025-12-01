// @flow
import { createContext } from 'react';

import { type PixiApp } from '@kitman/common/src/pixi/types/pixi';

const Pixi = createContext<PixiApp>(null);

export default Pixi;
