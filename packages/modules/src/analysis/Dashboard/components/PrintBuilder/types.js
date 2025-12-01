// @flow
import { type LayoutItem } from 'react-grid-layout/lib/utils';
import type { WidgetData } from '@kitman/modules/src/analysis/Dashboard/types';

export type Orientation = 'landscape' | 'portrait';

export type PageSize = 'a4';

export type Page = {
  number: number,
  yOffset: number,
  widgets: Array<WidgetData>,
  layout: Array<LayoutItem>,
};

export type Pages = Array<Page>;

export type PrintLayout = Array<$Shape<LayoutItem>>;
