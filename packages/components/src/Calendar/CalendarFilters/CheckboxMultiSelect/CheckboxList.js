// @flow
import type { ComponentType } from 'react';

import Checkbox from '@kitman/components/src/Checkbox/New';

import styles from './utils/styles';
import type { CheckboxItems } from '../utils/types';

type Props = {
  shownItems: CheckboxItems,
  onClick: (id: string) => void,
  localSelected: Set<string>,
  disabledOptions?: Set<string>,
};

const CheckboxList: ComponentType<Props> = ({
  shownItems,
  onClick,
  localSelected,
  disabledOptions,
}: Props) => {
  return (
    <div css={styles.checkboxContainer}>
      <ul>
        {shownItems.map((item) => {
          const { value, label } = item;
          const valueString = value.toString();
          return (
            <li key={value}>
              <Checkbox
                id={valueString}
                onClick={onClick}
                checked={localSelected.has(valueString)}
                name={label}
                disabled={disabledOptions?.has(value)}
              />
              <label>{label}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CheckboxList;
