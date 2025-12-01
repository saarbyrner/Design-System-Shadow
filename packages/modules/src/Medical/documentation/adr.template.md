# [Ascending number]. [Title of decision]

The title should give the reader the information on what was decided upon.

_Example:_

1. App level logging with Serilog and Application Insights

## Date:

The date the decision was made.

## Status: [status]

`Status: Proposed | Accepted | Deprecated | Superseded`

- A proposed design can be reviewed by the development team prior to accepting
  it.
- A previous decision can be superseded by a new one, or the ADR record marked
  as deprecated in case it is not valid anymore.

## Context:

The text should provide the reader an understanding of the problem

_Example:_

> Due to the microservices design of the platform, we need to ensure consistency
> of logging throughout each service so tracking of usage, performance, errors
> etc. can be performed end-to-end. A single logging/monitoring framework should
> be used where possible to achieve this, whilst allowing the flexibility for
> integration/export into other tools at a later stage. The developers should be
> equipped with a simple interface to log messages and metrics.

> If the development team had a data-driven approach to back the decision, i.e.
> a study that evaluates the potential choices against a set of objective
> criteria by following the guidance in Trade Studies, the study should be
> referred to in this section.

## Decision:

The decision made, it should begin with 'We will...' or 'We have agreed to ....

_Example:_

> We have agreed to utilize Serilog as the Dotnet Logging framework of choice at
> the application level, with integration into Log Analytics and Application
> Insights for analysis.

## Consequences:

The resulting context, after having applied the decision.

_Example:_

> Sampling will need to be configured in Application Insights so that it does
> not become overly-expensive when ingesting millions of messages, but also does
> not prevent capture of essential information. The team will need to only log
> what is agreed to be essential for monitoring as part of design reviews, to
> reduce noise and unnecessary levels of sampling.
