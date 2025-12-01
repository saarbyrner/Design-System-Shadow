// @flow
import $ from 'jquery';

export type CodingSystemIdentifier = {
  id: number,
  name: string,
  key: string,
};
export type CodingSystemIdentifiers = Array<CodingSystemIdentifier>;

const getCodingSystemIdentifiers = (): Promise<CodingSystemIdentifiers> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/coding_systems',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getCodingSystemIdentifiers;
