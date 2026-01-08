# Feedback Components

Import from: `@saarbyrne/playbook`

## Alert

Use `<Alert>` for important messages and notifications.

**When to use:**
- Success messages
- Error messages
- Warnings
- Informational messages

**Severity levels:**
- `error`: Errors that need attention
- `warning`: Warnings that should be noted
- `info`: General information
- `success`: Successful actions

**Example:**
```jsx
<Alert severity="success">
  Your changes have been saved successfully.
</Alert>
<Alert severity="error">
  An error occurred. Please try again.
</Alert>
```

## Snackbar

Use `<Snackbar>` for temporary notifications.

**When to use:**
- Brief notifications (3-5 seconds)
- Action confirmations
- Undo actions
- Non-blocking messages

**Example:**
```jsx
<Snackbar
  open={open}
  autoHideDuration={3000}
  onClose={handleClose}
  message="Item deleted"
/>
```

## Dialog

Use `<Dialog>` for modal dialogs and confirmations.

**When to use:**
- Confirmation dialogs
- Forms requiring focus
- Important decisions
- Blocking user input until dismissed

**Example:**
```jsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    Are you sure you want to delete this item?
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleDelete} color="error">Delete</Button>
  </DialogActions>
</Dialog>
```

## Progress

Use `<CircularProgress>` or `<LinearProgress>` for loading states.

**When to use:**
- Loading data
- Processing requests
- Determinate progress (known duration)
- Indeterminate progress (unknown duration)

**CircularProgress:**
```jsx
<CircularProgress />
```

**LinearProgress:**
```jsx
<LinearProgress />
<LinearProgress variant="determinate" value={progress} />
```

## Backdrop

Use `<Backdrop>` to dim background during loading or modal states.

**When to use:**
- Loading overlays
- With dialogs
- Blocking interactions

## Skeleton

Use `<Skeleton>` for loading placeholders.

**When to use:**
- Content loading states
- Better UX than spinners for known layouts
- Progressive loading

**Example:**
```jsx
<Skeleton variant="text" width={210} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={210} height={118} />
```
