// @flow
import { imageFileTypes } from '@kitman/common/src/utils/mediaHelper';
import type { FiltersType } from './types';

export const playerTypesEnumLike = {
  player: 'player',
  goalkeeper: 'goalkeeper',
  referee: 'referee',
};

export const kitStatusEnumLike = {
  active: 'active',
  archived: 'archived',
};

export const equipmentsEnumLike = {
  jersey: 'jersey',
  shorts: 'shorts',
  socks: 'socks',
};

export const supportedFileText = imageFileTypes
  .join(', ')
  // $FlowIgnore[prop-missing] replaceAll is fully supported
  .replaceAll('image/', '');

export const defaultErrorTextEnum = {
  type: 'Please select a type',
  organisation: 'Please select a club',
  name: 'Please enter a kit name',
  color: 'Please select a kit color',
  equipmentColor: 'Please select a color',
  image: 'Please upload an image',
  unsupportedFile: 'Please upload a supported image',
};

export const defaultKitState = {
  type: '',
  name: '',
  color: '',
  organisation: null,
  jersey: {},
  shorts: {},
  socks: {},
  division: null,
  league_season: null,
};

export const defaultFilters: FiltersType = {
  search: '',
  clubs: [],
  colors: [],
  types: [],
};

export const UPDATE_KIT = 'UPDATE_KIT';
export const DELETE_KIT = 'DELETE_KIT';
export const DEACTIVATE_KIT = 'DEACTIVATE_KIT';
export const ACTIVATE_KIT = 'ACTIVATE_KIT';
export const BULK_ACTIVATE_KIT = 'BULK_ACTIVATE_KIT';
export const BULK_DEACTIVATE_KIT = 'BULK_DEACTIVATE_KIT';
