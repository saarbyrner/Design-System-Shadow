// @flow

import { Box } from '@kitman/playbook/components';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { useDispatch } from 'react-redux';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import { RichTextEditor } from '@kitman/components';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  isChildOfGroup?: boolean,
  groupIndex?: number,
};

const HTMLEditor = ({
  questionElement,
  questionIndex,
  isChildOfGroup,
  groupIndex,
}: Props) => {
  const dispatch = useDispatch();

  return (
    <Box sx={{ width: '70%', mb: 2 }}>
      <RichTextEditor
        onChange={(content) => {
          updateQuestionElement(
            {
              questionIndex,
              field: 'config',
              value: {
                ...questionElement.config,
                text: content,
              },
            },
            dispatch,
            isChildOfGroup,
            groupIndex
          );
        }}
        value={questionElement.config.text || ''}
        kitmanDesignSystem
      />
    </Box>
  );
};

export default HTMLEditor;
