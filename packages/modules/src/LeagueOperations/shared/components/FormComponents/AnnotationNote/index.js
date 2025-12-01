// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { type Node } from 'react';
import { Grid, FormControl, TextField } from '@kitman/playbook/components';

type Props = {
  onChange: ({ annotation: string }) => void,
};

const AnnotationNote = (props: I18nProps<Props>): Node => {
  return (
    <Grid item xs={12} sx={{ p: 2 }}>
      <FormControl fullWidth>
        <TextField
          multiline
          label={props.t('Note')}
          rows={5}
          onChange={(e) => {
            props.onChange({ annotation: e.target.value.trim() });
          }}
        />
      </FormControl>
    </Grid>
  );
};

export default AnnotationNote;
export const AnnotationNoteTranslated = withNamespaces()(AnnotationNote);
