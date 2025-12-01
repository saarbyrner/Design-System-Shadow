# User Movement (2023/2024)

## Overview

As part of the User Movement Capability, we’re bringing the functionality to move users from console into IP.

User Movements can be of a temporary basis (MEDICAL_TRIAL | LOAN) or a permanent basic (TRADE | RELEASE).

A user can be moved between two organisations, that are both under a parent association.

## SMEs

- [PM] Nick Cunningham
- [BE] Darragh O'Brien
- [BE] Vinnie Ordobas
- [BE] Tiago Andreani
- [FE] Marius Guei
- [FE] Emmett Daly

Before undertaking any work in this area, please consult with one, or more, of the above SMEs.

## FE Overview

This module should only contain logic and/or items directly related to `UserMovement`.

The logic and/or components within this module should be extensible and resusable in any area within IP.

The FE will be rolled out using RTK Queries and Redux slices, which are included within the `<AppRoot/>` and thus, the root store.

### State management

- [`userMovementApi`](packages/modules/src/UserMovement/shared/redux/services/index.js)
- Slice name: `UserMovement.services`

This hosts all rtk queries related specifically to user movement flows

---

- [`userMovementDrawerSlice`](packages/modules/src/UserMovement/shared/redux/slices/userMovementDrawerSlice.js)
- Slice name: `userMovementDrawerSlice`

Currently, this is only in use to support the Medical Trial flow which is live for NFL. This will be deprecated and deleted

---

- [`movementProfileSlice`](packages/modules/src/UserMovement/shared/redux/slices/movementProfileSlice.js)
- Slice name: `UserMovement.slice.profile`

Currently, this is only in use to support the Medical Trial flow which is live for NFL. This will be deprecated and deleted

---

- [`createMovementSlice`](packages/modules/src/UserMovement/shared/redux/slices/createMovementSlice.js)
- Slice name: `UserMovement.slice.createMovement`

Currently, this supports movements of types Trade, but is extensible to the other types. Medical Trial will be moved into this slice and the profile will be bound to the `form.user_id` once the `movementProfileSlice` adn `userMovementDrawerSlice` are deprecated

### Users

- User (unsupported for now)
  - Scout
  - Official
  - Staff
- Athlete (supported)

### User MovementTypes

#### Description

- Medical Trial [`MEDICAL_TRIAL`]
  - This is NFL specific, for now. Allows for sharing of medical records with another organisation for a set period. Hard duration of 3 days for now
  - User will be visible in both organisations
- Release [`RELEASE`]
  - A user will be released from their current Organisation or Association and visible in Association level roster only
- Retire [`RETIRE`]
  - A user will be retired from either Organisation or Association and will be visible in Association roster only
- Trade [`TRADE`]
  - A user is traded from Organisation A to Organisation B. Appears in Org B roster only
- Multi Assign [`MULTI_ASSIGN`]
  - A user is added to another organisation. User appears in all rosters they are assigned to

#### Status

| Type            | Organisation | Organisations level        | Feature Flag                               | Permission                             | Status               |
| --------------- | ------------ | -------------------------- | ------------------------------------------ | -------------------------------------- | -------------------- |
| `MEDICAL_TRIAL` | NFL Only     | Organisation               | `league-ops-player-movement-medical-trial` | `manage-player-movement-medical-trial` | Live                 |
| `TRADE`         | All          | Association                | `league-ops-player-movement-trade`         | `manage-player-movement-trade`         | Awaiting release     |
| `RELEASE`       | All          | Association                | `league-ops-player-movement-release`       | `manage-player-movement-release`       | Awaiting development |
| `RETIRE`        | All          | Association                | N/A                                        | N/A                                    | Awaiting development |
| `MULTI_ASSIGN`  | All          | Association                | `league-ops-player-movement-trade`         | `league-ops-player-movement-trade`     | Awaiting development |

## Revision History

V1, Dec 23: Introduction of Medical Trials at an Association Level [JIRA Epic](https://kitmanlabs.atlassian.net/browse/LO-783)

V2, Jan 24: Refinement of movement types and availablity at an organisation or association level [JIRA issue](https://kitmanlabs.atlassian.net/browse/LO-834)

V3, Feb 24: Revision of movememnt types, slices, state management and supported functionality

V4, Mar 24: Revision of organisation level, and UI update 
