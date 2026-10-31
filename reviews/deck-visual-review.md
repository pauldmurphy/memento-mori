# MEMENTO MORI — Deck display and source review

Owner: Jamie Vale (`jamie`). Version reviewed: deck-v1, 2026-10-30. Artifact: [editable HTML deck](../package/deck/memento-mori-deck.html). Final creative approval remains Alex's separate decision.

## Completed source checks

- Read approved Lauren package copy and Alex's MM-DP-1/copy approval record before adapting text. Kept Callie's inheritance cost partial, the estate and publication choices separate, Daniel's refusal intact and the setting explicitly fictional. No screenplay dialogue or scripted scene sample appears in the deck.
- PowerShell static inspection counted sixteen slide sections, sixteen matching identified h1/h2 headings and sixteen closing sections. Slides 15–16 visibly identify ending spoilers.
- Static inspection found zero external image/link asset URLs, zero external script imports and zero FDX references in the deck. The asset CSV parses as three category records for editable text, original flat colors and local nonembedded fonts.
- `git diff --check -- package/deck` returned no whitespace findings.
- Source includes keyboard handlers, visible Previous/Next/count controls, an ending jump, live slide announcements, reduced-motion behavior, small-screen reflow and an all-slide print stylesheet. Their presence is a source check, not evidence of successful browser execution.

## Browser checks pending coordinator handoff

The coordinator will open the finished file, exercise navigation, inspect slide fit and review print styling. No browser-rendering, keyboard-execution, visual-fit or PDF-export success is claimed by the source checks above. Node was not available at the attempted shell PATH or the attempted conventional install path, so an inline JavaScript parse check did not run there. Use actual browser results to update this section before final delivery.
