import { data } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_benchmark_csv';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

import {
  isEmailValid,
  isDateValid,
  isInList,
  parseBoolean,
  parseGender,
  getDataTypeGuideline,
  getCommonRulesetFields,
  growthAndMaturationTemplateColumns,
  benchmarkingTemplateColumns,
  baselinesTemplateColumns,
  getIsIntegerValid,
  constructIdleLabel,
  buildAthleteCellData,
  mergeColumns,
} from '../index';

const legacyBuildCellContent = jest.requireActual('../cells/cellBuilder');
const newBuildCellContent = jest.requireActual('../../New/utils/cellBuilder');

describe('utils', () => {
  it('isEmailValid', () => {
    let emailValid = isEmailValid({ email: 'test' });
    expect(emailValid).toEqual(false);

    emailValid = isEmailValid({ email: 'test@email.com' });
    expect(emailValid).toEqual(true);
  });

  it('isDateValid', () => {
    let dateValid = isDateValid({ date: 'test' });
    expect(dateValid).toEqual(false);

    dateValid = isDateValid({ date: '2023/12/31' });
    expect(dateValid).toEqual(true);

    dateValid = isDateValid({
      date: '2023/12/31',
      acceptedFormats: ['31/12/2023'],
    });
    expect(dateValid).toEqual(false);
  });

  it('isInList', () => {
    let inList = isInList({ value: 'test', items: ['no test', 0] });
    expect(inList).toEqual(false);

    inList = isInList({ value: 'test', items: ['test', 0] });
    expect(inList).toEqual(true);
  });

  it('parseBoolean', () => {
    expect(parseBoolean(true)).toEqual(true);
    expect(parseBoolean('true')).toEqual(true);
    expect(parseBoolean('yes')).toEqual(true);
    expect(parseBoolean('y')).toEqual(true);

    expect(parseBoolean(false)).toEqual(false);
    expect(parseBoolean('false')).toEqual(false);
    expect(parseBoolean('no')).toEqual(false);
    expect(parseBoolean('n')).toEqual(false);
  });

  it('parseGender', () => {
    expect(parseGender('male')).toEqual(true);
    expect(parseGender('m')).toEqual(true);
    expect(parseGender('female')).toEqual(true);
    expect(parseGender('f')).toEqual(true);
    expect(parseGender('other')).toEqual(true);
    expect(parseGender('o')).toEqual(true);

    expect(parseGender('something else')).toEqual(false);
  });

  it('getCommonRulesetFields', () => {
    expect(getCommonRulesetFields('athlete')).toMatchSnapshot();
    expect(getCommonRulesetFields('staff member')).toMatchSnapshot();
  });

  describe('getDataTypeGuideline', () => {
    it('should render as expected in default state', () => {
      expect(
        getDataTypeGuideline({
          label: 'test_key',
          isRequired: false,
          acceptedValues: ['This is an example'],
        })
      ).toMatchSnapshot();
    });

    it('should render as expected if required', () => {
      expect(
        getDataTypeGuideline({
          label: 'test_key',
          isRequired: true,
          acceptedValues: ['This is an example'],
        })
      ).toMatchSnapshot();
    });

    it('should render as expected if case insensitive', () => {
      expect(
        getDataTypeGuideline({
          label: 'test_key',
          acceptedValues: ['This is an example'],
          caseInsensitive: true,
        })
      ).toMatchSnapshot();
    });

    it('should render as expected if multiple guidelines', () => {
      expect(
        getDataTypeGuideline({
          label: 'test_key',
          isRequired: false,
          acceptedValues: ['This is an example', 'This is another example'],
        })
      ).toMatchSnapshot();
    });
  });

  describe('template columns', () => {
    it('should return as expected when calling growthAndMaturationTemplateColumns', () => {
      expect(growthAndMaturationTemplateColumns).toMatchSnapshot();
    });

    it('should return as expected when calling baselinesTemplateColumns', () => {
      expect(baselinesTemplateColumns).toMatchSnapshot();
    });

    it('should return as expected when calling benchmarkingTemplateColumns', () => {
      expect(benchmarkingTemplateColumns).toMatchSnapshot();
    });
  });

  describe('getIsIntegerValid', () => {
    it('should return false if string of chars is passed', () => {
      expect(getIsIntegerValid('xyz')).toBe(false);
    });

    it('should return false if empty string is passed', () => {
      expect(getIsIntegerValid(' ')).toBe(false);
    });

    it('should return false if a negative number is passed', () => {
      expect(getIsIntegerValid(-1)).toBe(false);
    });

    it('should return true if number is passed', () => {
      expect(getIsIntegerValid(1)).toBe(true);
    });

    it('should return true if string number is passed', () => {
      expect(getIsIntegerValid('1')).toBe(true);
    });

    it('should return true if number with decimals is passed', () => {
      expect(getIsIntegerValid(1.123)).toBe(true);
    });
  });

  describe('constructIdleLabel', () => {
    const acceptedFileTypes = ['txt/csv', 'png'];
    const customLabel = 'I want it to be something different this time.';

    it('should return translated string with accepted file types if no custom label is passed', () => {
      expect(constructIdleLabel(acceptedFileTypes)).toEqual(
        'Drag & drop your files or <b>Browse</b><br /><span class="filepond--label-description">Accepted file types: txt&#x2F;csv,png</span>'
      );
    });

    it('should return translated string with custom label if passed', () => {
      expect(constructIdleLabel(acceptedFileTypes, customLabel)).toEqual(
        'Drag & drop your files or <b>Browse</b><br /><span class="filepond--label-description">I want it to be something different this time.</span>'
      );
    });
  });

  describe('buildAthleteCellData', () => {
    const mockColumns = Object.keys(data.validData[0]).map((cell) => ({
      id: cell,
      row_key: cell,
      content: <div />,
    }));

    const legacySpy = jest.spyOn(legacyBuildCellContent, 'default');
    const newSpy = jest.spyOn(newBuildCellContent, 'default');

    it('should use legacy buildCellContent if isMUI is false (default)', () => {
      buildAthleteCellData(
        data.validData,
        { athlete_id: () => true },
        jest.fn(),
        mockColumns
      );

      expect(legacySpy).toHaveBeenCalled();
    });

    it('should use new buildCellContent if isMUI is true', () => {
      buildAthleteCellData(
        data.validData,
        { athlete_id: () => true },
        jest.fn(),
        mockColumns,
        true
      );

      expect(newSpy).toHaveBeenCalled();
    });
  });

  describe('mergeColumns', () => {
    it.each([
      {
        description: 'columns is undefined and parsedCsv is undefined',
        input: { columns: undefined, parsedCsv: undefined },
        expected: [],
      },
      {
        description: 'columns is empty',
        input: { columns: [], parsedCsv: [{ foo: 'bar' }] },
        expected: [
          {
            id: 'foo',
            row_key: 'foo',
            content: <DefaultHeaderCell title="foo" />,
          },
        ],
      },
      {
        description: 'parsedCsv is undefined',
        input: {
          columns: [
            {
              id: 'foo',
              row_key: 'foo',
              content: <DefaultHeaderCell title="foo" />,
            },
          ],
          parsedCsv: undefined,
        },
        expected: [
          {
            id: 'foo',
            row_key: 'foo',
            content: <DefaultHeaderCell title="foo" />,
          },
        ],
      },
      {
        description: 'parsedCsv is empty',
        input: {
          columns: [
            {
              id: 'foo',
              row_key: 'foo',
              content: <DefaultHeaderCell title="foo" />,
            },
          ],
          parsedCsv: [],
        },
        expected: [
          {
            id: 'foo',
            row_key: 'foo',
            content: <DefaultHeaderCell title="foo" />,
          },
        ],
      },
      {
        description:
          'parsedCsv has columns partially overlapping with columns’ ones',
        input: {
          columns: [
            {
              id: 'existing',
              row_key: 'existing',
              content: <DefaultHeaderCell title="existing" />,
            },
          ],
          parsedCsv: [{ existing: 1, newOne: 42 }],
        },
        expected: [
          {
            id: 'existing',
            row_key: 'existing',
            content: <DefaultHeaderCell title="existing" />,
          },
          {
            id: 'newOne',
            row_key: 'newOne',
            content: <DefaultHeaderCell title="newOne" />,
          },
        ],
      },
      {
        description: 'columns and parsedCsv have the exact same columns',
        input: {
          columns: [
            {
              id: 'foo',
              row_key: 'foo',
              content: <DefaultHeaderCell title="foo" />,
            },
            {
              id: 'bar',
              row_key: 'bar',
              content: <DefaultHeaderCell title="bar" />,
            },
          ],
          parsedCsv: [{ foo: 123, bar: 456 }],
        },
        expected: [
          {
            id: 'foo',
            row_key: 'foo',
            content: <DefaultHeaderCell title="foo" />,
          },
          {
            id: 'bar',
            row_key: 'bar',
            content: <DefaultHeaderCell title="bar" />,
          },
        ],
      },
      {
        description: 'parsedCsv has keys which columns doesn’t',
        input: {
          columns: [
            {
              id: 'existing',
              row_key: 'existing',
              content: <DefaultHeaderCell title="existing" />,
            },
          ],
          parsedCsv: [
            {
              existing: 1,
              newOne: 'val1',
              newTwo: 'val2',
            },
          ],
        },
        expected: [
          {
            id: 'existing',
            row_key: 'existing',
            content: <DefaultHeaderCell title="existing" />,
          },
          {
            id: 'newOne',
            row_key: 'newOne',
            content: <DefaultHeaderCell title="newOne" />,
          },
          {
            id: 'newTwo',
            row_key: 'newTwo',
            content: <DefaultHeaderCell title="newTwo" />,
          },
        ],
      },
      {
        description:
          'parsedCsv’s second row has extra keys that don’t appear in the first row',
        input: {
          columns: [
            {
              id: 'colOne',
              row_key: 'colOne',
              content: <DefaultHeaderCell title="colOne" />,
            },
          ],
          parsedCsv: [
            {
              colOne: 1,
              colTwo: 2,
            },
            {
              colOne: 1,
              colTwo: 2,
              colThree: 3, // Only appears in the second row
            },
          ],
        },
        expected: [
          {
            id: 'colOne',
            row_key: 'colOne',
            content: <DefaultHeaderCell title="colOne" />,
          },
          {
            id: 'colTwo',
            row_key: 'colTwo',
            content: <DefaultHeaderCell title="colTwo" />,
          },
        ],
      },
      {
        description: 'parsedCsv has numeric keys',
        input: {
          columns: [
            {
              id: 'alpha',
              row_key: 'alpha',
              content: <DefaultHeaderCell title="alpha" />,
            },
          ],
          parsedCsv: [
            {
              123: 'numericKeyValue',
              alpha: 'existsAlready',
            },
          ],
        },
        expected: [
          {
            id: 'alpha',
            row_key: 'alpha',
            content: <DefaultHeaderCell title="alpha" />,
          },
          {
            id: '123',
            row_key: '123',
            content: <DefaultHeaderCell title="123" />,
          },
        ],
      },
      {
        description: 'parsedCsv has an empty string as a key',
        input: {
          columns: [
            {
              id: 'existingKey',
              row_key: 'existingKey',
              content: <DefaultHeaderCell title="existingKey" />,
            },
          ],
          parsedCsv: [
            {
              '': 'emptyStringKeyValue',
              ' weird-key ': 'weirdValue',
              existingKey: 'remains',
            },
          ],
        },
        expected: [
          {
            id: 'existingKey',
            row_key: 'existingKey',
            content: <DefaultHeaderCell title="existingKey" />,
          },
          {
            id: '',
            row_key: '',
            content: <DefaultHeaderCell title="" />,
          },
          {
            id: ' weird-key ',
            row_key: ' weird-key ',
            content: <DefaultHeaderCell title=" weird-key " />,
          },
        ],
      },
      {
        description: 'columns has duplicate id',
        input: {
          columns: [
            {
              id: 'dup',
              row_key: 'dup',
              content: <DefaultHeaderCell title="dup" />,
            },
            {
              id: 'dup',
              row_key: 'dup',
              content: <DefaultHeaderCell title="dup-2" />,
            },
          ],
          parsedCsv: [
            {
              dup: 'alreadyExists',
              newCol: 'newVal',
            },
          ],
        },
        expected: [
          {
            id: 'dup',
            row_key: 'dup',
            content: <DefaultHeaderCell title="dup" />,
          },
          {
            id: 'dup',
            row_key: 'dup',
            content: <DefaultHeaderCell title="dup-2" />,
          },
          {
            id: 'newCol',
            row_key: 'newCol',
            content: <DefaultHeaderCell title="newCol" />,
          },
        ],
      },
      {
        description: 'some column objects are missing id',
        input: {
          columns: [
            {
              row_key: 'noIdHere',
              content: <DefaultHeaderCell title="noIdHere" />,
            },
            {
              id: 'withId',
              row_key: 'withId',
              content: <DefaultHeaderCell title="withId" />,
            },
          ],
          parsedCsv: [
            {
              withId: 'exists',
              colNew: 42,
            },
          ],
        },
        expected: [
          {
            row_key: 'noIdHere',
            content: <DefaultHeaderCell title="noIdHere" />,
          },
          {
            id: 'withId',
            row_key: 'withId',
            content: <DefaultHeaderCell title="withId" />,
          },
          {
            id: 'colNew',
            row_key: 'colNew',
            content: <DefaultHeaderCell title="colNew" />,
          },
        ],
      },
    ])('returns correct value when $description', ({ input, expected }) => {
      const { columns, parsedCsv } = input;
      expect(mergeColumns(columns, parsedCsv)).toEqual(expected);
    });
  });
});
