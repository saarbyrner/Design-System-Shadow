import { sortBenchmarkReport } from '../utils';

describe('utils', () => {
  describe('sortBenchmarkReport', () => {
    it('sorts data correctly', () => {
      expect(
        [
          {
            athlete_name: null,
            result_type: 'my_club',
            test: '05m Sprint',
          },
          {
            athlete_name: null,
            result_type: 'my_club',
            test: '10m Sprint',
          },
          {
            athlete_name: null,
            result_type: 'national',
            test: '05m Sprint',
          },
          {
            athlete_name: null,
            result_type: 'national',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Khayon',
            athlete_lastname: 'Edwards',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Khayon',
            athlete_lastname: 'Edwards Jr.',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Zane',
            athlete_lastname: 'Monlouis',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Zane',
            athlete_lastname: 'Monlouis',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Charles',
            athlete_lastname: 'Sagoe',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Charles',
            athlete_lastname: 'Sagoe',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Alexei',
            athlete_lastname: 'Fedorushchenko',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Alexei',
            athlete_lastname: 'Fedorushchenko',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Ifeoluwa',
            athlete_lastname: 'Ibrahim',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Ifeoluwa',
            athlete_lastname: 'Ibrahim',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Oluwatoyosi',
            athlete_lastname: 'Ogunnaike',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Oluwatoyosi',
            athlete_lastname: 'Ogunnaike',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Bless',
            athlete_lastname: 'Akolbire',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Bless',
            athlete_lastname: 'Akolbire',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Demar',
            athlete_lastname: 'Bascoe-Fisher',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Demar',
            athlete_lastname: 'Bascoe-Fisher',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Nathan',
            athlete_lastname: 'Butler-Oyedeji',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Nathan',
            athlete_lastname: 'Butler-Oyedeji',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Jack',
            athlete_lastname: 'Henry-Francis',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Jack',
            athlete_lastname: 'Henry-Francis',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Louie',
            athlete_lastname: 'Copley',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Louie',
            athlete_lastname: 'Copley',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Maximilian',
            athlete_lastname: 'Kuczynski',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Maximilian',
            athlete_lastname: 'Kuczynski',
            result_type: 'individual',
            test: '10m Sprint',
          },
          {
            athlete_firstname: 'Brian',
            athlete_lastname: 'Okonkwo',
            result_type: 'individual',
            test: '05m Sprint',
          },
          {
            athlete_firstname: 'Brian',
            athlete_lastname: 'Okonkwo',
            result_type: 'individual',
            test: '10m Sprint',
          },
        ].sort(sortBenchmarkReport)
      ).toEqual([
        {
          athlete_name: null,
          result_type: 'national',
          test: '05m Sprint',
        },
        {
          athlete_name: null,
          result_type: 'my_club',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Bless',
          athlete_lastname: 'Akolbire',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Demar',
          athlete_lastname: 'Bascoe-Fisher',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Nathan',
          athlete_lastname: 'Butler-Oyedeji',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Louie',
          athlete_lastname: 'Copley',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Khayon',
          athlete_lastname: 'Edwards',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Alexei',
          athlete_lastname: 'Fedorushchenko',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Jack',
          athlete_lastname: 'Henry-Francis',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Ifeoluwa',
          athlete_lastname: 'Ibrahim',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Maximilian',
          athlete_lastname: 'Kuczynski',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Zane',
          athlete_lastname: 'Monlouis',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Oluwatoyosi',
          athlete_lastname: 'Ogunnaike',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Brian',
          athlete_lastname: 'Okonkwo',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_firstname: 'Charles',
          athlete_lastname: 'Sagoe',
          result_type: 'individual',
          test: '05m Sprint',
        },
        {
          athlete_name: null,
          result_type: 'national',
          test: '10m Sprint',
        },
        {
          athlete_name: null,
          result_type: 'my_club',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Bless',
          athlete_lastname: 'Akolbire',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Demar',
          athlete_lastname: 'Bascoe-Fisher',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Nathan',
          athlete_lastname: 'Butler-Oyedeji',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Louie',
          athlete_lastname: 'Copley',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Khayon',
          athlete_lastname: 'Edwards Jr.',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Alexei',
          athlete_lastname: 'Fedorushchenko',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Jack',
          athlete_lastname: 'Henry-Francis',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Ifeoluwa',
          athlete_lastname: 'Ibrahim',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Maximilian',
          athlete_lastname: 'Kuczynski',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Zane',
          athlete_lastname: 'Monlouis',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Oluwatoyosi',
          athlete_lastname: 'Ogunnaike',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Brian',
          athlete_lastname: 'Okonkwo',
          result_type: 'individual',
          test: '10m Sprint',
        },
        {
          athlete_firstname: 'Charles',
          athlete_lastname: 'Sagoe',
          result_type: 'individual',
          test: '10m Sprint',
        },
      ]);
    });
  });
});
