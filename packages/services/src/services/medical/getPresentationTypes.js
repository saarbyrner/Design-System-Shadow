// @flow
import $ from 'jquery';

export type PresentationType = {
  name: string,
  id: number,
  require_additional_input: boolean,
};

export type PresentationTypes = Array<PresentationType>;

const getPresentationTypes = (): Promise<PresentationTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/presentation_types',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getPresentationTypes;
