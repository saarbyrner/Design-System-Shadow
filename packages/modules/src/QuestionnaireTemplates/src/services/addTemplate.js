// @flow
import $ from 'jquery';
import type { Template } from '../../types/__common';

const addTemplate = (templateName: string): Promise<{ template: Template }> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/settings/questionnaire_templates/',
      contentType: 'application/json',
      data: JSON.stringify({ name: templateName }),
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default addTemplate;
