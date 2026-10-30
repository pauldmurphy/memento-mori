# Repository setup record

Prepared October 30, 2026 for Paul Murphy.

## Delivered

- Preserved copies of the squad blueprint and setup prompt under `docs/squad/`.
- Original treatment preserved locally at the ignored path `source/MEMENTO MORI.txt`, with its byte length and SHA-256 recorded in `source/manifest.json`. Its full text is excluded from the public repository pending explicit publication approval.
- Eight specialist charters and a populated native Squad roster, routing, name registry and consistent registry/history transaction.
- Existing built-in Scribe, Ralph, Rai and Fact Checker retained. Sam Ellis remains Scribe's project-facing alias.
- Repository-local team and local state backend; the machine-specific shared-team path has been removed from project configuration.
- Project instructions, governance, Fountain workflow, development brief and bounded first assignment.
- Working continuity, reveal, research, episode and review templates; package checklist; reusable project validator.
- SDK-generated coordinator capabilities refreshed. This generated block uses Squad's generic software capability vocabulary; it does not expand the creative team's assignments or authority beyond the actual charters and project governance.

## Validation performed

- `node scripts/validate-development.mjs`: nine project checks passed in the prepared local checkout, covering source integrity, format/scope, identity consistency, support agents, coordinator payload, policy and local links. In a fresh checkout without the private local treatment, source-byte verification is explicitly skipped and the other checks still run.
- `squad health --json` with installed Squad 1.1.0: pass. Eight roster members, eight registry charters, eight routing rules and reachable local state; environment-variable check skipped because none are required.
- `squad doctor`: ten passed, zero failed, one warning, two informational notices. The warning is that `copilot --version` could not be verified in this environment; Copilot-driven execution and watch capabilities were not demonstrated. Informational notices concern expected global-install dependency locations.
- Hash-sensitive casting JSON uses LF attributes, preventing Windows checkout conversion from invalidating the registry/history manifest.

These checks validate the repository setup. Development diagnosis, creative approval, historical verification, professional consultation, the pilot screenplay and Fountain-to-PDF rendering remain pending.
