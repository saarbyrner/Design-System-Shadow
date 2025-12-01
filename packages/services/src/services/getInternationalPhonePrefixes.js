// @flow
import $ from 'jquery';

export type PhonePrefix = [string, string]; // [ country phone prefix and name, the country code]

const getInternationalPhonePrefixes = (): Promise<Array<PhonePrefix>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/country_codes',
    })
      .done((data) => {
        resolve(data.country_codes);
      })
      .fail(reject);
  });
};

export default getInternationalPhonePrefixes;
