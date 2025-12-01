// @flow
import type {
  Annotation,
  AnnotationResponse,
} from '@kitman/common/src/types/Annotation';

const transformAnnotationResponse = (
  annotation: AnnotationResponse
): Annotation => {
  const transformedAnnotation = {
    ...annotation,
    annotation_type_id: 0,
    unUploadedFiles: [],
  };

  transformedAnnotation.annotation_type_id =
    transformedAnnotation.organisation_annotation_type.id;

  if (annotation.attachments.length > 0) {
    transformedAnnotation.attachments = annotation.attachments.map(
      (file) =>
        // $FlowFixMe
        file && {
          id: file.id,
          original_filename: file.filename,
          created: '',
          filesize: file.filesize,
          confirmed: file.confirmed,
        }
    );
  }

  // $FlowFixMe transformedAnnotation starts out as "AnnotationResponse" but ends up as "Annotation"
  return transformedAnnotation;
};

export default transformAnnotationResponse;
