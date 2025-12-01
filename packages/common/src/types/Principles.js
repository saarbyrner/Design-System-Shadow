// @flow
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { CheckboxListItem } from '@kitman/components/src/CheckboxList';

export type PrincipleCategoryId = number | string;
export type PrincipleCategory = {
  id: PrincipleCategoryId,
  name: string,
  isNewCategory?: boolean,
};
export type PrincipleCategories = Array<PrincipleCategory>;
export type EditPrincipleCategory = {
  id?: PrincipleCategoryId,
  name: string,
  isNewCategory?: boolean,
};
export type EditPrincipleCategories = Array<EditPrincipleCategory>;

export type PrincipleType = {
  id: number | string,
  sport_id: number,
  sport: {
    id: number,
    perma_id: string,
    name: string,
    duration: number,
  },
  name: string,
};
export type PrincipleTypes = Array<PrincipleType>;

export type PrinciplePhase = {
  id: number | string,
  name: string,
};
export type PrinciplePhases = Array<PrinciplePhase>;

export type PrincipleItemId = number | string;
export type PrincipleItemType =
  | 'principle_categories'
  | 'phases'
  | 'principle_types'
  | 'squads';
export type PrincipleItems =
  | PrincipleCategories
  | PrincipleTypes
  | PrinciplePhases
  | Squads;

export type PrincipleId = number | string;
export type Principle = {
  id: PrincipleId,
  name: string,
  principle_categories: PrincipleCategories,
  principle_types: PrincipleTypes,
  phases: PrinciplePhases,
  squads: Squads,
  isNewPrinciple?: boolean,
};
export type Principles = Array<Principle>;

export type PrinciplesView = 'PRESENTATION' | 'EDIT';

export type PrincipleSelectItems = Array<CheckboxListItem>;

export type PrincipleFilter = {
  category: Array<number | string>,
  type: Array<number | string>,
  phase: Array<number | string>,
  squad: Array<number | string>,
};
export type PrincipleFilterItem = 'category' | 'phase' | 'type' | 'squad';

export type EditPrinciple = {
  id?: number | string,
  name: string,
  principle_category_ids: Array<number | string>,
  principle_type_ids: Array<number | string>,
  phase_ids: Array<number | string>,
  squad_ids: Array<number | string>,
  isNewPrinciple?: boolean,
};
export type EditPrinciples = Array<EditPrinciple>;
