// @flow
import { colors } from '@kitman/common/src/variables';
import { useSelector } from 'react-redux';
import { Grid, Box } from '@kitman/playbook/components';
import { getPanelFormElement } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import {
  getElementByIdFactory,
  getModeFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  LAYOUT_ELEMENTS,
  DEFAULT_COLUMNS,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { parseFormInputElement } from '@kitman/modules/src/HumanInput/shared/utils';

const SectionForm = () => {
  const panelElement = useSelector(getPanelFormElement);
  const formElement = useSelector(
    getElementByIdFactory({
      id: panelElement.id,
      type: LAYOUT_ELEMENTS.MenuItem,
    })
  );
  const mode = useSelector(getModeFactory());

  return (
    <Box sx={{ flex: 2, overflowY: 'scroll' }}>
      <Grid
        container
        spacing={2}
        columns={4}
        p={0}
        m={0}
        sx={{
          maxWidth: '100%',
          overflowX: 'hidden',
          p: 0,
          whiteSpace: 'normal',
          '.MuiListItemText-primary': {
            color: colors.grey_100,
            fontWeight: 500,
          },
        }}
      >
        {formElement?.form_elements.map((element) => {
          return element.visible ? (
            <Grid
              item
              xs={DEFAULT_COLUMNS}
              key={element.config.element_id}
              sx={{ p: 0 }}
            >
              {parseFormInputElement({ element, mode })}
            </Grid>
          ) : null;
        })}
      </Grid>
    </Box>
  );
};

export default SectionForm;
