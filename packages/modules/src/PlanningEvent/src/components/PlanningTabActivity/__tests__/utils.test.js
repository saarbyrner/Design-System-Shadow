import { getAreaSizeLabel, getDiagramPlaceholder } from '../utils';

import { tests } from './utilsTests';

const getDescribeFor = (fn) => {
  const name = fn.name;

  return describe(`${name}`, () => {
    it.each(tests[name])(
      'when the argument is %s, it returns %s',
      (argument, expected) => expect(fn(argument)).toEqual(expected)
    );
  });
};

getDescribeFor(getAreaSizeLabel);

getDescribeFor(getDiagramPlaceholder);
