import moment from 'moment-timezone';
import * as DateFormatter from '../dateFormatter';

describe('dateFormatter', () => {
  let testDate;

  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  describe('when calling formatShortOrgLocale in English (United States) locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('en-us');
    });

    it('formats a moment to a locale date string with year', () => {
      expect(
        DateFormatter.formatShortOrgLocale(testDate, 'en-US', true)
      ).toEqual('Tue Mar 2, 2021');
    });

    it('formats a moment to a locale date string without year', () => {
      expect(
        DateFormatter.formatShortOrgLocale(testDate, 'en-US', false)
      ).toEqual('Tue, Mar 2');
    });

    it('formats a moment to the embedded date locale value if not set', () => {
      expect(DateFormatter.formatShortOrgLocale(testDate, null, false)).toEqual(
        'Tue 2 Mar'
      );
    });

    it('formats a moment with a different locale value', () => {
      expect(
        DateFormatter.formatShortOrgLocale(testDate, 'en-IE', true)
      ).toEqual('Tue Mar 2, 2021');
    });
  });

  // formatStandard US
  describe('when calling formatStandard in English (United States) locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('en-us');
    });

    it('formats a moment to a short locale date string', () => {
      expect(DateFormatter.formatStandard({ date: testDate })).toEqual(
        'Mar 2, 2021'
      );
    });

    it('formats a moment to a long locale date string', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          displayLongDate: true,
        })
      ).toEqual('March 2, 2021');
    });

    it('formats a moment to a short locale date string with time', () => {
      expect(
        DateFormatter.formatStandard({ date: testDate, showTime: true })
      ).toEqual('Mar 2, 2021 1:00 PM');
    });

    it('formats a moment to a long locale date string with time', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showTime: true,
          displayLongDate: true,
        })
      ).toEqual('March 2, 2021 1:00 PM');
    });

    it('formats a moment to a short locale date string with timezone', () => {
      expect(
        DateFormatter.formatStandard({ date: testDate, showTimezone: true })
      ).toEqual('Mar 2, 2021 UTC');
    });

    it('formats a moment to a long locale date string with timezone', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          displayLongDate: true,
          showTimezone: true,
        })
      ).toEqual('March 2, 2021 UTC');
    });

    it('formats a moment to a short locale date string with time and timezone', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showTime: true,
          showTimezone: true,
        })
      ).toEqual('Mar 2, 2021 1:00 PM UTC');
    });

    it('formats a moment to a long locale date string with time and timezone', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showTime: true,
          displayLongDate: true,
          showTimezone: true,
        })
      ).toEqual('March 2, 2021 1:00 PM UTC');
    });
  });

  // formatStandard GB
  describe('when calling formatStandard in English (GB) locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('en-gb');
    });

    it('formats a moment to a short locale date string', () => {
      expect(DateFormatter.formatStandard({ date: testDate })).toEqual(
        '2 Mar 2021'
      );
    });

    it('formats a moment to a long locale date string', () => {
      expect(
        DateFormatter.formatStandard({ date: testDate, displayLongDate: true })
      ).toEqual('2 March 2021');
    });

    it('formats a moment to a short locale date string with time', () => {
      expect(
        DateFormatter.formatStandard({ date: testDate, showTime: true })
      ).toEqual('2 Mar 2021 13:00');
    });

    it('formats a moment to a short locale complete date string', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showCompleteDate: true,
        })
      ).toEqual('Tue, 2 Mar 2021 13:00');
    });

    it('formats a moment to a long locale date string with time', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showTime: true,
          displayLongDate: true,
        })
      ).toEqual('2 March 2021 13:00');
    });

    it('formats a moment to a long locale complete date string', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showCompleteDate: true,
          displayLongDate: true,
        })
      ).toEqual('Tuesday, 2 March 2021 13:00');
    });
  });

  // formatStandard ES
  describe('when calling formatStandard in Spanish locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('es');
    });

    it('formats a moment to a short locale date string', () => {
      expect(DateFormatter.formatStandard({ date: testDate })).toEqual(
        '2 de mar. de 2021'
      );
    });

    it('formats a moment to a long locale date string', () => {
      expect(
        DateFormatter.formatStandard({ date: testDate, displayLongDate: true })
      ).toEqual('2 de marzo de 2021');
    });

    it('formats a moment to a short locale date string with time', () => {
      expect(
        DateFormatter.formatStandard({ date: testDate, showTime: true })
      ).toEqual('2 de mar. de 2021 13:00');
    });

    it('formats a moment to a short locale complete date string', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showCompleteDate: true,
        })
      ).toEqual('mar., 2 de mar. de 2021 13:00');
    });

    it('formats a moment to a long locale date string with time', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showTime: true,
          displayLongDate: true,
        })
      ).toEqual('2 de marzo de 2021 13:00');
    });

    it('formats a moment to a long locale complete date string', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showCompleteDate: true,
          displayLongDate: true,
        })
      ).toEqual('martes, 2 de marzo de 2021 13:00');
    });
  });

  // formatStandard JA
  describe('when calling formatStandard in Japanese locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('ja');
    });

    it('formats a long and short locale dates the same', () => {
      expect(DateFormatter.formatStandard({ date: testDate })).toEqual(
        '2021年3月2日'
      );
      expect(
        DateFormatter.formatStandard({ date: testDate, displayLongDate: true })
      ).toEqual('2021年3月2日');
    });

    it('formats a moment to a short locale date string with time', () => {
      expect(
        DateFormatter.formatStandard({ date: testDate, showTime: true })
      ).toEqual('2021年3月2日 13:00');
    });

    it('formats a moment to a short locale complete date string', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showCompleteDate: true,
        })
      ).toEqual('2021年3月2日(火) 13:00');
    });

    it('formats a moment to a long locale date string with time', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showTime: true,
          displayLongDate: true,
        })
      ).toEqual('2021年3月2日 13:00');
    });

    it('formats a moment to a long locale complete date string', () => {
      expect(
        DateFormatter.formatStandard({
          date: testDate,
          showCompleteDate: true,
          displayLongDate: true,
        })
      ).toEqual('2021年3月2日 火曜日 13:00');
    });

    it('formats a moment to a short locale date string', () => {
      expect(DateFormatter.formatShort(testDate)).toEqual('2021/03/02');
    });

    it('formats a moment to a very short locale date string', () => {
      expect(DateFormatter.formatVeryShort(testDate)).toEqual('2021/03/02');
    });
  });

  // formatRelativeToNow US
  describe('when calling formatRelativeToNow in English (United States) locale', () => {
    beforeEach(() => {
      testDate = moment('2020-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('en-us');
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('formats a moment correctly when < 1 minute', () => {
      const fakeNowDate = new Date('2020-03-02T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'a few seconds ago'
      );
    });

    it('formats a moment correctly when < 10 minutes', () => {
      const fakeNowDate = new Date('2020-03-02T13:09:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '9 minutes ago'
      );
    });

    it('formats a moment correctly when < 1 hour', () => {
      const fakeNowDate = new Date('2020-03-02T13:40:00Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '40 minutes ago'
      );
    });

    it('formats a moment correctly when an 1 hour', () => {
      const fakeNowDate = new Date('2020-03-02T14:00:00Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Today at 1:00 PM'
      );
    });

    it('formats a moment correctly when < 1 day', () => {
      const fakeNowDate = new Date('2020-03-02T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Today at 1:00 PM'
      );
    });

    it('formats a moment correctly when < 1 week', () => {
      const fakeNowDate = new Date('2020-03-07T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Last Monday at 1:00 PM'
      );
    });

    it('formats a moment correctly when 1 week', () => {
      const fakeNowDate = new Date('2020-03-09T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Mar 2, 2020 1:00 PM'
      );
    });

    it('formats a moment correctly when 2 weeks', () => {
      const fakeNowDate = new Date('2020-03-16T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Mar 2, 2020 1:00 PM'
      );
    });

    it('formats a moment correctly when 1 month', () => {
      const fakeNowDate = new Date('2020-04-09T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Mar 2, 2020 1:00 PM'
      );
    });

    it('formats a moment correctly when <1 year', () => {
      const fakeNowDate = new Date('2020-11-07T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Mar 2, 2020 1:00 PM'
      );
    });

    it('formats a moment correctly when >1 year', () => {
      const fakeNowDate = new Date('2021-03-06T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Mar 2, 2020'
      );
    });
  });

  // formatRelativeToNow GB
  describe('when calling formatRelativeToNow in English (GB) locale', () => {
    beforeEach(() => {
      testDate = moment('2020-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('en-gb');
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('formats a moment correctly when < 1 minute', () => {
      const fakeNowDate = new Date('2020-03-02T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'a few seconds ago'
      );
    });

    it('formats a moment correctly when < 10 minutes', () => {
      const fakeNowDate = new Date('2020-03-02T13:09:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '9 minutes ago'
      );
    });

    it('formats a moment correctly when < 1 hour', () => {
      const fakeNowDate = new Date('2020-03-02T13:40:00Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '40 minutes ago'
      );
    });

    it('formats a moment correctly when an 1 hour', () => {
      const fakeNowDate = new Date('2020-03-02T14:00:00Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Today at 13:00'
      );
    });

    it('formats a moment correctly when < 1 day', () => {
      const fakeNowDate = new Date('2020-03-02T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Today at 13:00'
      );
    });

    it('formats a moment correctly when < 1 week', () => {
      const fakeNowDate = new Date('2020-03-07T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'Last Monday at 13:00'
      );
    });

    it('formats a moment correctly when 1 week', () => {
      const fakeNowDate = new Date('2020-03-09T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2 Mar 2020 13:00'
      );
    });

    it('formats a moment correctly when 2 weeks', () => {
      const fakeNowDate = new Date('2020-03-16T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2 Mar 2020 13:00'
      );
    });

    it('formats a moment correctly when 1 month', () => {
      const fakeNowDate = new Date('2020-04-09T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2 Mar 2020 13:00'
      );
    });

    it('formats a moment correctly when <1 year', () => {
      const fakeNowDate = new Date('2020-11-07T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2 Mar 2020 13:00'
      );
    });

    it('formats a moment correctly when >1 year', () => {
      const fakeNowDate = new Date('2021-03-06T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual('2 Mar 2020');
    });
  });

  // formatRelativeToNow ES
  describe('when calling formatRelativeToNow in Spanish locale', () => {
    beforeEach(() => {
      testDate = moment('2020-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('es');
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('formats a moment correctly when < 1 minute', () => {
      const fakeNowDate = new Date('2020-03-02T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'hace unos segundos'
      );
    });

    it('formats a moment correctly when < 10 minutes', () => {
      const fakeNowDate = new Date('2020-03-02T13:09:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'hace 9 minutos'
      );
    });

    it('formats a moment correctly when < 1 hour', () => {
      const fakeNowDate = new Date('2020-03-02T13:40:00Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'hace 40 minutos'
      );
    });

    it('formats a moment correctly when an 1 hour', () => {
      const fakeNowDate = new Date('2020-03-02T14:00:00Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'hoy a las 13:00'
      );
    });

    it('formats a moment correctly when < 1 day', () => {
      const fakeNowDate = new Date('2020-03-02T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'hoy a las 13:00'
      );
    });

    it('formats a moment correctly when < 1 week', () => {
      const fakeNowDate = new Date('2020-03-07T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        'el lunes pasado a las 13:00'
      );
    });

    it('formats a moment correctly when 1 week', () => {
      const fakeNowDate = new Date('2020-03-09T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2 de mar. de 2020 13:00'
      );
    });

    it('formats a moment correctly when 2 weeks', () => {
      const fakeNowDate = new Date('2020-03-16T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2 de mar. de 2020 13:00'
      );
    });

    it('formats a moment correctly when 1 month', () => {
      const fakeNowDate = new Date('2020-04-09T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2 de mar. de 2020 13:00'
      );
    });

    it('formats a moment correctly when <1 year', () => {
      const fakeNowDate = new Date('2020-11-07T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2 de mar. de 2020 13:00'
      );
    });

    it('formats a moment correctly when >1 year', () => {
      const fakeNowDate = new Date('2021-03-06T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2 de mar. de 2020'
      );
    });
  });

  // formatRelativeToNow JA
  describe('when calling formatRelativeToNow in Japanese locale', () => {
    beforeEach(() => {
      testDate = moment('2020-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('ja');
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('formats a moment correctly when < 1 minute', () => {
      const fakeNowDate = new Date('2020-03-02T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual('数秒前');
    });

    it('formats a moment correctly when < 10 minutes', () => {
      const fakeNowDate = new Date('2020-03-02T13:09:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual('9分前');
    });

    it('formats a moment correctly when < 1 hour', () => {
      const fakeNowDate = new Date('2020-03-02T13:40:00Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual('40分前');
    });

    it('formats a moment correctly when an 1 hour', () => {
      const fakeNowDate = new Date('2020-03-02T14:00:00Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual('今日 13:00');
    });

    it('formats a moment correctly when < 1 day', () => {
      const fakeNowDate = new Date('2020-03-02T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual('今日 13:00');
    });

    it('formats a moment correctly when < 1 week', () => {
      const fakeNowDate = new Date('2020-03-07T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '月曜日 13:00'
      );
    });

    it('formats a moment correctly when 1 week', () => {
      const fakeNowDate = new Date('2020-03-09T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2020年3月2日 13:00'
      );
    });

    it('formats a moment correctly when 2 weeks', () => {
      const fakeNowDate = new Date('2020-03-16T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2020年3月2日 13:00'
      );
    });

    it('formats a moment correctly when 1 month', () => {
      const fakeNowDate = new Date('2020-04-09T13:00:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2020年3月2日 13:00'
      );
    });

    it('formats a moment correctly when <1 year', () => {
      const fakeNowDate = new Date('2020-11-07T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2020年3月2日 13:00'
      );
    });

    it('formats a moment correctly when >1 year', () => {
      const fakeNowDate = new Date('2021-03-06T18:59:10Z'); // UTC FORMAT
      jest.setSystemTime(fakeNowDate);
      expect(DateFormatter.formatRelativeToNow(testDate)).toEqual(
        '2020年3月2日'
      );
    });
  });

  // formatRange US
  describe('when calling formatRange in English (United States) locale', () => {
    const locale = 'en-us';
    beforeEach(() => {
      testDate = moment('2020-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale(locale);
    });

    it('displays multiple dates when multiDateFormat is true', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z');
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2, true)).toEqual(
        '1:00 PM, Monday March 2, 2020 - 7:00 PM, Monday March 1, 2021 '
      );
    });

    it('displays a dash between two dates', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z'); // UTC FORMAT (different more recent date than testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        'Mar 2, 2020 - Mar 1, 2021'
      );
    });

    it('does not sort the two dates, they display in order given', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z'); // UTC FORMAT (different more recent date than testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate2, testDate)).toEqual(
        'Mar 1, 2021 - Mar 2, 2020'
      );
    });

    it('displays a single date if the dates are identical', () => {
      const testDate2 = moment('2020-03-02T13:00:00Z'); // UTC FORMAT (same date as testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        'Mar 2, 2020'
      );
    });

    it('displays a single date if the dates are the same day', () => {
      const testDate2 = moment('2020-03-02T17:00:00Z'); // UTC FORMAT (same day as testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        'Mar 2, 2020'
      );
    });
  });

  // formatRange GB
  describe('when calling formatRange in English (GB) locale', () => {
    const locale = 'en-gb';
    beforeEach(() => {
      testDate = moment('2020-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale(locale);
    });

    it('displays multiple dates when multiDateFormat is true', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z');
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2, true)).toEqual(
        '13:00, Monday 2 March 2020 - 19:00, Monday 1 March 2021 '
      );
    });

    it('displays a dash between two dates', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z'); // UTC FORMAT (different more recent date than testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        '2 Mar 2020 - 1 Mar 2021'
      );
    });

    it('does not sort the two dates, they display in order given', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z'); // UTC FORMAT (different more recent date than testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate2, testDate)).toEqual(
        '1 Mar 2021 - 2 Mar 2020'
      );
    });

    it('displays a single date if the dates are identical', () => {
      const testDate2 = moment('2020-03-02T13:00:00Z'); // UTC FORMAT (same date as testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        '2 Mar 2020'
      );
    });

    it('displays a single date if the dates are the same day', () => {
      const testDate2 = moment('2020-03-02T17:00:00Z'); // UTC FORMAT (same day as testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        '2 Mar 2020'
      );
    });
  });

  // formatRange ES
  describe('when calling formatRange in Spanish locale', () => {
    const locale = 'es';
    beforeEach(() => {
      testDate = moment('2020-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale(locale);
    });

    it('displays multiple dates when multiDateFormat is true', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z');
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2, true)).toEqual(
        '13:00, lunes 2 de marzo de 2020 - 19:00, lunes 1 de marzo de 2021 '
      );
    });

    it('displays a dash between two dates', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z'); // UTC FORMAT (different more recent date than testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        '2 de mar. de 2020 - 1 de mar. de 2021'
      );
    });

    it('does not sort the two dates, they display in order given', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z'); // UTC FORMAT (different more recent date than testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate2, testDate)).toEqual(
        '1 de mar. de 2021 - 2 de mar. de 2020'
      );
    });

    it('displays a single date if the dates are identical', () => {
      const testDate2 = moment('2020-03-02T13:00:00Z'); // UTC FORMAT (same date as testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        '2 de mar. de 2020'
      );
    });

    it('displays a single date if the dates are the same day', () => {
      const testDate2 = moment('2020-03-02T17:00:00Z'); // UTC FORMAT (same day as testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        '2 de mar. de 2020'
      );
    });
  });

  // formatRange JA
  describe('when calling formatRange in Japanese locale', () => {
    const locale = 'ja';
    beforeEach(() => {
      testDate = moment('2020-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale(locale);
    });

    it('displays multiple dates when multiDateFormat is true', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z');
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2, true)).toEqual(
        '13:00, 月曜日 2020年3月2日 - 19:00, 月曜日 2021年3月1日 '
      );
    });

    it('displays a dash between two dates', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z'); // UTC FORMAT (different more recent date than testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        '2020年3月2日 - 2021年3月1日'
      );
    });

    it('does not sort the two dates, they display in order given', () => {
      const testDate2 = moment('2021-03-01T19:00:00Z'); // UTC FORMAT (different more recent date than testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate2, testDate)).toEqual(
        '2021年3月1日 - 2020年3月2日'
      );
    });

    it('displays a single date if the dates are identical', () => {
      const testDate2 = moment('2020-03-02T13:00:00Z'); // UTC FORMAT (same date as testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        '2020年3月2日'
      );
    });

    it('displays a single date if the dates are the same day', () => {
      const testDate2 = moment('2020-03-02T17:00:00Z'); // UTC FORMAT (same day as testDate)
      testDate2.locale(locale);
      expect(DateFormatter.formatRange(testDate, testDate2)).toEqual(
        '2020年3月2日'
      );
    });
  });

  // formatJustTime US
  describe('when calling formatJustTime in English (United States) locale', () => {
    const locale = 'en-us';

    it('does not display seconds unless parameter is set', () => {
      const testTime1 = moment('2020-03-02T13:10:05Z'); // UTC FORMAT
      testTime1.locale(locale);

      const testTime2 = moment('2020-03-02T10:10:05Z'); // UTC FORMAT
      testTime2.locale(locale);

      expect(DateFormatter.formatJustTime(testTime1)).toEqual('1:10 PM');

      expect(DateFormatter.formatJustTime(testTime2)).toEqual('10:10 AM');
    });

    it('can display seconds when parameter is set', () => {
      const testTime1 = moment('2020-03-02T13:10:05Z'); // UTC FORMAT
      testTime1.locale(locale);

      const testTime2 = moment('2020-03-02T10:10:05Z'); // UTC FORMAT
      testTime2.locale(locale);

      expect(DateFormatter.formatJustTime(testTime1, true)).toEqual(
        '1:10:05 PM'
      );

      expect(DateFormatter.formatJustTime(testTime2, true)).toEqual(
        '10:10:05 AM'
      );
    });
  });

  // formatJustTime GB
  describe('when calling formatJustTime in English (GB) locale', () => {
    const locale = 'en-gb';

    it('does not display seconds unless parameter is set', () => {
      const testTime1 = moment('2020-03-02T13:10:05Z'); // UTC FORMAT
      testTime1.locale(locale);

      const testTime2 = moment('2020-03-02T10:10:05Z'); // UTC FORMAT
      testTime2.locale(locale);

      expect(DateFormatter.formatJustTime(testTime1)).toEqual('13:10');

      expect(DateFormatter.formatJustTime(testTime2)).toEqual('10:10');
    });

    it('can display seconds when parameter is set', () => {
      const testTime1 = moment('2020-03-02T13:10:05Z'); // UTC FORMAT
      testTime1.locale(locale);

      const testTime2 = moment('2020-03-02T10:10:05Z'); // UTC FORMAT
      testTime2.locale(locale);

      expect(DateFormatter.formatJustTime(testTime1, true)).toEqual('13:10:05');

      expect(DateFormatter.formatJustTime(testTime2, true)).toEqual('10:10:05');
    });
  });

  // formatJustTime ES
  describe('when calling formatJustTime in Spanish locale', () => {
    const locale = 'es';

    it('does not display seconds unless parameter is set', () => {
      const testTime1 = moment('2020-03-02T13:10:05Z'); // UTC FORMAT
      testTime1.locale(locale);

      const testTime2 = moment('2020-03-02T10:10:05Z'); // UTC FORMAT
      testTime2.locale(locale);

      expect(DateFormatter.formatJustTime(testTime1)).toEqual('13:10');

      expect(DateFormatter.formatJustTime(testTime2)).toEqual('10:10');
    });

    it('can display seconds when parameter is set', () => {
      const testTime1 = moment('2020-03-02T13:10:05Z'); // UTC FORMAT
      testTime1.locale(locale);

      const testTime2 = moment('2020-03-02T10:10:05Z'); // UTC FORMAT
      testTime2.locale(locale);

      expect(DateFormatter.formatJustTime(testTime1, true)).toEqual('13:10:05');

      expect(DateFormatter.formatJustTime(testTime2, true)).toEqual('10:10:05');
    });
  });

  // formatJustTime JA
  describe('when calling formatJustTime in Japan locale', () => {
    const locale = 'ja';

    it('does not display seconds unless parameter is set', () => {
      const testTime1 = moment('2020-03-02T13:10:05Z'); // UTC FORMAT
      testTime1.locale(locale);

      const testTime2 = moment('2020-03-02T10:10:05Z'); // UTC FORMAT
      testTime2.locale(locale);

      expect(DateFormatter.formatJustTime(testTime1)).toEqual('13:10');

      expect(DateFormatter.formatJustTime(testTime2)).toEqual('10:10');
    });

    it('can display seconds when parameter is set', () => {
      const testTime1 = moment('2020-03-02T13:10:05Z'); // UTC FORMAT
      testTime1.locale(locale);

      const testTime2 = moment('2020-03-02T10:10:05Z'); // UTC FORMAT
      testTime2.locale(locale);

      expect(DateFormatter.formatJustTime(testTime1, true)).toEqual('13:10:05');

      expect(DateFormatter.formatJustTime(testTime2, true)).toEqual('10:10:05');
    });
  });

  // formatJustTimeWithAMPM
  describe('when calling formatJustTimeWithAMPM', () => {
    it('displays the appropriate time', () => {
      const testTime1 = moment('2020-03-02T13:10:05Z'); // UTC FORMAT
      expect(DateFormatter.formatJustTimeWithAMPM(testTime1)).toEqual(
        '01:10 PM'
      );
    });
  });

  // formatShort & formatVeryShort US
  describe('when calling short formats in English (United States) locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('en-us');
    });

    it('formats a moment to a short locale date string', () => {
      expect(DateFormatter.formatShort(testDate)).toEqual('03/02/2021');
    });

    it('formats a moment to a very short locale date string', () => {
      expect(DateFormatter.formatVeryShort(testDate)).toEqual('3/2/2021');
    });
  });

  // formatShort & formatVeryShort US
  describe('when calling short formats in English (GB) locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('en-gb');
    });

    it('formats a moment to a short locale date string', () => {
      expect(DateFormatter.formatShort(testDate)).toEqual('02/03/2021');
    });

    it('formats a moment to a very short locale date string', () => {
      expect(DateFormatter.formatVeryShort(testDate)).toEqual('2/3/2021');
    });
  });

  // formatShort & formatVeryShort ES
  describe('when calling short formats in Spanish locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('es');
    });

    it('formats a moment to a short locale date string', () => {
      expect(DateFormatter.formatShort(testDate)).toEqual('02/03/2021');
    });

    it('formats a moment to a very short locale date string', () => {
      expect(DateFormatter.formatVeryShort(testDate)).toEqual('2/3/2021');
    });
  });

  // dayDateYear US
  describe('when calling dayDateYear in English (United States) locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('en-us');
    });

    it('formats a moment to date string containing day name, date number, full year', () => {
      expect(DateFormatter.dayDateYear(testDate)).toEqual(
        'Tuesday March 2, 2021'
      );
    });
  });

  // dayDateYear GB
  describe('when calling dayDateYear in English (GB) locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('en-bg');
    });

    it('formats a moment to date string containing day name, date number, full year', () => {
      expect(DateFormatter.dayDateYear(testDate)).toEqual(
        'Tuesday March 2, 2021'
      );
    });
  });

  describe('when calling dayDateYear in Spanish locale', () => {
    beforeEach(() => {
      testDate = moment('2021-03-02T13:00:00Z'); // UTC FORMAT
      testDate.locale('es');
    });

    it('formats a moment to date string containing day name, date number, full year', () => {
      expect(DateFormatter.dayDateYear(testDate)).toEqual(
        'martes 2 de marzo de 2021'
      );
    });
  });

  describe('formatTwoDigitYear', () => {
    it('return two digit year of the date', () => {
      expect(
        DateFormatter.formatTwoDigitYear(moment('2021-03-02T13:00:00Z'))
      ).toEqual('21');
    });

    it('returns an empty string if the date is invalid', () => {
      expect(DateFormatter.formatTwoDigitYear(moment('test'))).toEqual('');
    });
  });

  describe('formatDateWithTime', () => {
    describe('English (United States) locale', () => {
      beforeEach(() => {
        testDate = moment('2024-07-15T13:03:49Z');
        testDate.locale('en-us');
      });
      it('formats a moment to the correct format', () => {
        expect(DateFormatter.formatDateWithTime({ date: testDate })).toEqual(
          'Jul 15, 2024 - 1:03pm'
        );
      });
    });

    describe('English (GB) locale', () => {
      beforeEach(() => {
        testDate = moment('2024-07-15T11:03:49Z');
        testDate.locale('en-gb');
      });
      it('formats a moment to the correct format', () => {
        expect(DateFormatter.formatDateWithTime({ date: testDate })).toEqual(
          'Jul 15, 2024 - 11:03am'
        );
      });
    });
  });

  describe('humanizeTimestamp', () => {
    const locale = 'en-IE';

    // Past Timestamps
    it('should return a "few seconds ago" for a recent timestamp', () => {
      const now = moment();
      const recentTimestamp = now.clone().subtract(5, 'seconds').toISOString();
      expect(DateFormatter.humanizeTimestamp(locale, recentTimestamp)).toBe(
        'a few seconds ago'
      );
    });
    it('should return "a minute ago" for a timestamp of one minute ago', () => {
      const now = moment();
      const oneMinuteAgo = now.clone().subtract(1, 'minutes').toISOString();
      expect(DateFormatter.humanizeTimestamp(locale, oneMinuteAgo)).toBe(
        'a minute ago'
      );
    });
    it('should return "an hour ago" for a timestamp one hour ago', () => {
      const now = moment();
      const oneHourAgo = now.clone().subtract(1, 'hours').toISOString();
      expect(DateFormatter.humanizeTimestamp(locale, oneHourAgo)).toBe(
        'an hour ago'
      );
    });

    it('should return "a day ago" for a timestamp one day ago', () => {
      const now = moment();
      const oneDayAgo = now.clone().subtract(1, 'days').toISOString();
      expect(DateFormatter.humanizeTimestamp(locale, oneDayAgo)).toBe(
        'a day ago'
      );
    });

    it('should return "a month ago" for a timestamp one month ago', () => {
      const now = moment();
      const oneMonthAgo = now.clone().subtract(1, 'months').toISOString();
      expect(DateFormatter.humanizeTimestamp(locale, oneMonthAgo)).toBe(
        'a month ago'
      );
    });

    // Future Timestamps
    it('should return "in a minute" when timestamp is one minute in the future', () => {
      const futureTimestamp = moment().add(1, 'minute');
      expect(DateFormatter.humanizeTimestamp(locale, futureTimestamp)).toBe(
        'in a minute'
      );
    });

    it('should return "in an hour" when timestamp is one hour in the future', () => {
      const futureTimestamp = moment().add(1, 'hours');
      expect(DateFormatter.humanizeTimestamp(locale, futureTimestamp)).toBe(
        'in an hour'
      );
    });
  });

  describe('formatDateToUserTimezone', () => {
    beforeEach(() => {
      testDate = moment('2024-07-15T13:03:49Z');
    });
    it('formats a moment to the correct format', () => {
      expect(
        DateFormatter.formatDateToUserTimezone({
          date: testDate,
          showTimezone: true,
        })
      ).toEqual('Jul 15th, 2024 1:03PM UTC');
    });

    it('returns an empty string if the date is invalid', () => {
      expect(
        DateFormatter.formatDateToUserTimezone({
          date: moment('test'),
          showTimezone: true,
        })
      ).toEqual('');
    });

    it('returns the date without timezone if showTimezone is false', () => {
      expect(
        DateFormatter.formatDateToUserTimezone({
          date: testDate,
          showTimezone: false,
        })
      ).toEqual('Jul 15th, 2024 1:03PM');
    });
  });
});
