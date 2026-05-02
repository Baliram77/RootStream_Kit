# Security

## Historical secret exposure (`gelato/.env.local`)

A `gelato/.env.local` file was committed in older git history (removed from the tree in April 2026). **Treat any secrets that ever appeared in that file as compromised until you confirm rotation.**

### Required response

1. **Rotate** every non-public value that could have been in that file, including RPC URLs with embedded keys, deployer keys, and third-party API keys.
2. **Repository history:** This repository’s **reachable** branch history was rewritten locally so **`gelato/.env.local` is no longer present in any commit on `main`.** Old clones and mirrors may still hold objects until they fetch and reset.
3. **Publishing:** Maintainers must **`git push --force-with-lease origin main`** (after coordinating with collaborators) so the sanitized history replaces `origin/main`. Forks and CI caches should be refreshed.
4. **Verification:** Confirm obsolete keys are revoked in provider dashboards after rotation.

---

## Gelato dependency posture (`elliptic`, ethers v5)

The **`@gelatonetwork/web3-functions-sdk`** depends on **ethers v5** (`@ethersproject/*`), which pulls **`elliptic`**. **`npm audit`** may report **[GHSA-848j-6mx2-7j84](https://github.com/advisories/GHSA-848j-6mx2-7j84)** (low severity). There is **no clean npm resolution** without **`npm audit fix --force`**, which risks breaking the SDK.

**Accepted mitigation:** document the residual low finding; run **`npm run audit:moderate`** in **`gelato/`** so CI fails only on moderate or higher; upgrade **`@gelatonetwork/web3-functions-sdk`** when Gelato publishes a release without the vulnerable chain.

See **`gelato/README.md`** for overrides (**`protobufjs`**, **`axios`**, **`follow-redirects`**, etc.) and audit notes.

---

Report new vulnerabilities through your usual channel (private advisory or maintainer email), not via public issues, until triaged.
