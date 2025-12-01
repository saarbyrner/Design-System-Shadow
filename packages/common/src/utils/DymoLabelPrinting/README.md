## DYMO Label Printer

This code is a copy & paste from the source of `react-dymo-hooks` package with
some basic Flow typing implemented & minor tweaks. The accompanying hook
`useDymoLabelPrinter()` is only used in the Diagnostic entity view, for orders
that come from a specific provider - **Quest**.

The button to trigger the printing option only shows if eligible DYMO printers
are recognised & connected to their device. The hook invokes `printLabel` with a
predetermined XML structure, relevant to the exact specimen tube label size that
the lab in question use.
