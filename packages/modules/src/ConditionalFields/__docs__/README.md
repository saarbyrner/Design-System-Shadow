# Conditional Fields / Logic Builder

aka CFIS, NCIS: Kitman Nights

## Overview

**This is a living document that's meant to be updated with every PR**

This directory contains the creation of conditional field rulesets within iP.
Currently rulesets are created by the APS team in Console and for many reasons
the workflow is unsustainable and needs to be addressed before EPL Launch.

For more details on the BIG picture please see
[Jira ticket PM-7](https://kitmanlabs.atlassian.net/browse/PM-7)

The first iteration will only focus on creating rulesets from the ORG level.
Let's see how far we can get before launch (end of Aug.). Ideally we have both
the Org and Association level.
[Jira ticket PM-111](https://kitmanlabs.atlassian.net/browse/PM-111)

## File Structure

```
.
└── packages/modules/src/
    ├── ConditionalFields
    ├── __docs__/
    │   ├── README.md
    │   └── CF.drawio
    ├── OrganisationApp/ (this renders the organisation level)
    │   ├── components/
    │   │   ├── ClubRulesetsTab (renders the rulesets on club level)
    │   │   └── App.js
    │   └── index.js
    ├── RulesetLevelApp/ (this renders the individual ruleset's versions )
    │   ├── components/
    │   │   └── App.js (renders the TABS - Versions & Assignees)
    │   └── index.js
    └── shared/
        ├── hooks/
        │   └── useRulesetsGrid.js (fetches rulesets Org or Association lvl)
        │
        ├── redux ( RTK)
        │   └── slices (using Registration implementation for scalability)
        │
        ├── routes/
        │   ├── rulesets (CFIS landingPage)
        │   ├── ruleset (renders VersionsGrid)
        │   └── version (renders Build view of Conditions)
        ├── menu/
        │   └── menuItem (will use Registration flow here)
        │
        ├── services/
        │   ├── api (will use RTK - following Registration)
        │   │   ├── fetchRulesets (returns rulesets for org)
        │   │   ├── fetchVersions (returns all versions of a ruleset)
        │   │   ├── fetchAssignees (returns all assignees of a ruleset version)
        │   │   ├── fetchVersion (returns version of a ruleset)
        │   │   ├── fetchPredicateOptions (returns options for Predicate and Locations dropdowns)
        │   │   ├── updateOwnerVersions (bumps the versions of the scoped ruleset)
        │   │   ├── mocks (mocked data in separate files)
        │   │   └── handlers (MSW handlers for each service -)
        │   │       └── handlers.js (main export imported into packages/services/src/mocks/handlers/index.js )
        │
        └── components/
            ├── Cells (common cells to grid)
            ├── CommonGridStyle (styles for all grids)
            ├── ConditionalFieldsGrid (common grid between org and association lvls)
            ├── RulesetsGrid (builds the cell content for rulesets grid)
            ├── ConditionalFieldsGrid (common grid between org and association lvls)
            ├── RulesetAppHeader (rendered in RulesetLevelApp common header between org and association lvls)
            ├── VersionAppHeader (is special b/c contains ability to edit the ruleset name - rendered in RulesetLevelApp common header between org and association lvls)
            └── OrganisationAppHeader (rendered in OrganisationApp)

```

## State Management

### Redux - Will use RTK and Redux store.

although this area is relatively small for now and doesn't need a redux store to
hold anything just yet (side panel action can be added here in future), I want
to leverage caching, loading, and error states and our product already uses RTK
(could use React Query but RTK is great and already here so why change horses
mid race?).

Will follow the of managing the Redux Store with `slices`. This will allow this
area to be more flexible, organized, and scalable. The idea of splitting concern
within the Redux Store makes a lot of sense as we're able to focus on the data
that matters within the scope we're working in.

TLDR - less noise makes live easier

### Hooks - will create Custom hooks

For more localized state management a custom hook will be used. The data
management is a bit complex for local state, so for both organization and
readability reasons we will use a hook for the Grid management in the
<RulesetsGrid /> and <VersionsGrid /> components as well as the formState of the
<VersionView /> where the questions are created

## Additional Info

### FFs & Permissions

FF to toggle the CFIS Icon in the <MainNavBar />:
`conditional-fields-creation-in-ip`

Permissions:

Permission to toggle the CFIS Icon in the <MainNavBar />:
`injury-surveillance-admin`/`permissions.injurySurveillance.canAdmin`
OR
`logic-builder`/`logic-builder-medical-admin`

within `conditionalFields` directory will add these two permissions: \
New permission - canView - View Conditional Fields \
New permission - canCreate - Manage Conditional Fields

### Sharable Components

<Condition /> and <Question /> components will be rendered multiple times in
same view so good to have them shared. Within those components will have smaller
components that are either new in this directory or shared from HI area.
