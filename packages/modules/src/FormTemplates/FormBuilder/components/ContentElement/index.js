// @flow
import { type ComponentType, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import {
  Autocomplete,
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
} from '@kitman/playbook/components';
import {
  deleteQuestionFromCurrentMenuItem,
  deleteQuestionFromCurrentGroupLayoutElement,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TextareaTranslated as Textarea } from '@kitman/modules/src/FormTemplates/FormBuilder/components/ContentElement/components/Textarea';
import HTMLEditor from '@kitman/modules/src/FormTemplates/FormBuilder/components/ContentElement/components/HTMLEditor';
import {
  type Option,
  options,
} from '@kitman/modules/src/FormTemplates/FormBuilder/components/ContentElement/constants';

import { colors } from '@kitman/common/src/variables';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  isChildOfGroup?: boolean,
  groupIndex?: number,
};

const ContentElement = ({
  t,
  questionElement,
  questionIndex,
  isChildOfGroup,
  groupIndex,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  /**
   * Make component element driven so it preserves the selects content_type
   *  or initially defaults to the HTML option
   */
  const selectedOption =
    options.find(
      (option) =>
        option.id === questionElement.config.custom_params?.content_type
    ) || options[0];

  const [paragraphType, setParagraphType] = useState<Option>(selectedOption);

  const paragraphHasTitle = !!questionElement.config.title;

  const renderComponent = () => {
    switch (paragraphType?.id) {
      case 'html': {
        return (
          <HTMLEditor
            questionElement={questionElement}
            questionIndex={questionIndex}
            isChildOfGroup={isChildOfGroup}
            groupIndex={groupIndex}
          />
        );
      }
      case null: {
        return (
          <Textarea
            questionElement={questionElement}
            questionIndex={questionIndex}
            isChildOfGroup={isChildOfGroup}
            groupIndex={groupIndex}
          />
        );
      }
      default:
        return <>Option not supported</>;
    }
  };

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${colors.grey_disabled}`,
        p: 1,
      }}
    >
      <Box
        display="flex"
        sx={{ mb: 1 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" color={colors.grey_200}>
          {t('Paragraph')}
        </Typography>
        <Box display="flex" alignItems="center">
          <IconButton
            aria-label="delete"
            onClick={() => {
              if (isChildOfGroup) {
                dispatch(
                  deleteQuestionFromCurrentGroupLayoutElement({
                    groupIndex,
                    questionIndex,
                  })
                );
              } else {
                dispatch(deleteQuestionFromCurrentMenuItem(questionIndex));
              }
            }}
          >
            <KitmanIcon name={KITMAN_ICON_NAMES.Delete} />
          </IconButton>
        </Box>
      </Box>
      <Grid sx={{ pb: 2 }} container spacing={3}>
        <Grid item>
          <Autocomplete
            value={paragraphType}
            options={options}
            sx={{ width: 300, mb: 1 }}
            renderInput={(params) => <TextField {...params} label="Type" />}
            onChange={(e, value) => {
              setParagraphType(value);
              updateQuestionElement(
                {
                  questionIndex,
                  field: 'config',
                  value: {
                    ...questionElement.config,
                    custom_params: {
                      ...questionElement.config.custom_params,
                      content_type: value.id,
                    },
                    text: '',
                  },
                },
                dispatch,
                isChildOfGroup,
                groupIndex
              );
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label={t('Name')}
            value={questionElement.config.title}
            sx={{ width: 300, mb: 1 }}
            error={!paragraphHasTitle}
            helperText={
              paragraphHasTitle ? '' : t('Paragraph name is requried')
            }
            onChange={(e) =>
              updateQuestionElement(
                {
                  questionIndex,
                  field: 'config',
                  value: {
                    ...questionElement.config,
                    title: e.target.value,
                  },
                },
                dispatch,
                isChildOfGroup,
                groupIndex
              )
            }
          />
        </Grid>
      </Grid>
      {renderComponent()}
    </Box>
  );
};

export const ContentElementTranslated: ComponentType<Props> =
  withNamespaces()(ContentElement);
export default ContentElement;
