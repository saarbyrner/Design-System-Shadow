// @flow
import $ from 'jquery';
import type { JQueryAjaxSettings } from 'jquery';

const ajaxPromise = (ajaxParams: string | JQueryAjaxSettings): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax(ajaxParams).done(resolve).fail(reject);
  });
};

export default ajaxPromise;
