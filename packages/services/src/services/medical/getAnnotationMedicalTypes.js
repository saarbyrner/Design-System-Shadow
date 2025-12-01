// @flow
import $ from 'jquery';
import type { NoteType } from '@kitman//modules/src/Medical/shared/types';

export type AnnotationMedicalType = {
  id: number,
  name: string,
  type: NoteType,
  creation_allowed: boolean, // Some annotations are just historic display,  user can't create
};
export type AnnotationMedicalTypes = Array<AnnotationMedicalType>;

const getAnnotationMedicalTypes = (): Promise<AnnotationMedicalTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/annotations/medical_types',
    })
      .done((annotations) => {
        if (
          window.featureFlags['rehab-note'] &&
          window.featureFlags['display-telephone-note']
        ) {
          resolve(annotations);
        } else {
          resolve(
            annotations.filter((annotation) => {
              if (
                !window.featureFlags['rehab-note'] &&
                annotation.type === 'OrganisationAnnotationTypes::RehabSession'
              ) {
                return false;
              }
              if (
                !window.featureFlags['display-telephone-note'] &&
                annotation.type === 'OrganisationAnnotationTypes::Telephone'
              ) {
                return false;
              }
              return true;
            })
          );
        }
      })
      .fail(reject);
  });
};

export default getAnnotationMedicalTypes;
