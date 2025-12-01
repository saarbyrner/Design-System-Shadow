// @flow
import type {
  PrincipleItems,
  PrincipleSelectItems,
} from '@kitman/common/src/types/Principles';

export const getPrincipleSelectItems = (
  principleItems: PrincipleItems
): PrincipleSelectItems =>
  principleItems.map((item) => ({
    value: item.id,
    label: item.name,
  }));
