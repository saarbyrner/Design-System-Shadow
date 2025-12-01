# PixiJS Wrappers

These are wrappers around PixiJS’ primitives. They consider that once we upgrade
to React 17+, we will get rid of them, so it would be nice to have to do as
little refactorings as possible so the topmost priority to be as compatible with
React Pixi, the official plugin, as reasonably possible.

# Why PixiJS is Used Without a Ready Wrappers?

React Pixi isn’t used because it requires React 17+. Its 5.2.0 version is
compatible with the used React version but doesn’t support the latest PixiJS. An
older version of PixiJS isn’t maintained anymore, and has quite different API
surface which may require more refactoring once we move to React 17+.
react-pixi-fiber doesn’t inspire confidence in its maintenance.

# Why Are All the Components Not Placed in ‘@kitman/components’?

They aren’t real React components, just simple wrappers around PixiJS; and
temporary, so will be removed once we upgrade React to the next major version.

# Usage

Every file inside `components/` has docs in comments, inlcuding examples. To see
a real usage of some components, see Diagram Builder
`packages/modules/src/PlanningEvent/src/components/DiagramBuilderTab/index.js`.

If you need a global access to `app`, create a component which gets it via
`usePixiApp` and pass the component inside an instance of `<Stage />`. That
forces you to put all your PixiJS-related logic into one, separate component.
Also eliminates accidental (or intentional!) mix of regular React components and
these PixiJS-specific wrappers which only comply with React components’ API but
don’t render anything. Think of them as objects representing state and methods
of the corresponding PixiJS components.

`<Stage />` is the only component that accepts child components.

Use `useRef` instead of `useState` whenever possible to not trigger unnecessary
re-renders; use `useState` only when you need a re-render, e.g. to trigger
update based on props.

# Development

It’s important to call `destroy` method of a new or existing component in every
clean-up callback of `useEffect`. The general pattern is:

```ts
return () => {
  component.destroy();
  if (app.stage) app.stage.removeChild(component);
  if (app.ticker) app.ticker.remove(ticker);
  // if (app...) app... (run clean-up logic)
};
```

Also it’s important to return a clean-up function on every return in
`useEffect`’s callback. It may be the same function but often they will be
different because likely you will have different number of things requiring a
clean-up in each `return` statement.
