// @flow

import type { Node } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  Grid,
  FormGroup,
  Divider,
  Button,
} from '@kitman/playbook/components';
import { ExpandMore } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { onUpdatePermission } from '@kitman/services/src/services/permissions/redux/slices/permissionsDetailsSlice';
import PermissionCheckbox from '@kitman/modules/src/StaffProfile/shared/components/PermissionCheckbox';
import {
  getPermissionsFactory,
  getUserPermissionsFactory,
} from '@kitman/services/src/services/permissions/redux/selectors/permissionsDetailsSelectors';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

const PermissionsBody = (props: I18nProps<{}>): Node => {
  const dispatch = useDispatch();
  const permissionModules = useSelector(getPermissionsFactory());
  const user = useSelector(getUserPermissionsFactory());
  const { permissions: userPermissions } = user;
  const { permissions: appPermissions } = usePermissions();
  const validPermissionModules = permissionModules?.filter(
    (module) => module.permissions.length
  );
  // Initialize expanded state with all accordions expanded
  const [expanded, setExpanded] = useState(
    validPermissionModules?.reduce((acc, module) => {
      acc[module.key] = true;
      return acc;
    }, {})
  );

  const handleExpandAll = () => {
    // Determine the new expanded state based on whether ANY are currently expanded
    const anyExpanded = validPermissionModules?.some(
      (module) => expanded[module.key]
    );
    const newExpandedState = validPermissionModules?.reduce((acc, module) => {
      acc[module.key] = !anyExpanded;
      return acc;
    }, {});
    setExpanded(newExpandedState);
  };

  const handleAccordionChange = (moduleKey) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [moduleKey]: !prevExpanded[moduleKey],
    }));
  };

  return (
    <Box mt={3}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <Typography variant="h6" mb={2}>
            {props.t('Advanced Permissions')}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            display: 'flex',
            justifyContent: 'end',
            pr: 2,
          }}
        >
          <Button onClick={handleExpandAll} variant="contained">
            {/* Check if ANY accordions are expanded */}
            {validPermissionModules?.some((module) => expanded[module.key])
              ? props.t('Collapse All')
              : props.t('Expand All')}
          </Button>
        </Grid>
      </Grid>

      {validPermissionModules?.map((permissionModule) => {
        const { name, key: moduleKey, id, permissions } = permissionModule;
        return (
          <Accordion
            key={`accordion-${moduleKey}`}
            expanded={expanded[moduleKey] || false} // Default to false if not in state
            onChange={() => handleAccordionChange(moduleKey)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel-${id}-content`}
              id={`panel-${id}-header`}
            >
              <Typography>{name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl sx={{ mx: 3, mt: -1 }} variant="standard">
                <FormGroup key={`module-${moduleKey}`}>
                  <Grid container spacing={0}>
                    {permissions.map(
                      ({
                        name: permissionName,
                        key: permissionKey,
                        description,
                      }) => {
                        const checked = Boolean(
                          userPermissions[moduleKey][permissionKey]
                        );
                        return (
                          <Grid item md={6} xs={4} key={permissionKey}>
                            <PermissionCheckbox
                              checked={checked}
                              handleChange={() => {
                                dispatch(
                                  onUpdatePermission({
                                    module: moduleKey,
                                    permissionKey,
                                    value: !checked,
                                  })
                                );
                              }}
                              permissionName={permissionName}
                              permissionKey={permissionKey}
                              description={description}
                              disabled={
                                !appPermissions.settings.canManageStaffUsers
                              }
                            />
                          </Grid>
                        );
                      }
                    )}
                  </Grid>
                </FormGroup>
              </FormControl>
              <Divider />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export const PermissionsBodyTranslated = withNamespaces()(PermissionsBody);
export default PermissionsBody;
