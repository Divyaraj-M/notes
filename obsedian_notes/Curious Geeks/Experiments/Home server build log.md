---
description: ""
objective: "Why I turned an old laptop into a server"
status: running
result: ""
started: ""
updated: ""
closed: ""
tags:
  - curious_geeks/experiment
dg-publish: true
permalink: /experiments/home-server/
---

**Technical write-up:** [[How to convert old laptop into a server?]]


### Build log

| Date       | Problem                                                                                         | Decision                                                                                                                                                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-22 | Anything running on the box is reachable by anything else on the network                        | Turned on the firewall and bound the AI server to the machine itself instead of the network. I reach it by logging in through Tailscale. Exposed, it's an open API and anyone who finds it runs prompts on my hardware for free.        |
| 2026-08-22 | Tailscale expires after about six months and renewing it needs a keyboard                       | Turned off key expiry. Otherwise it dies months from now, when I've forgotten all of this, and the fix is finding a monitor for a machine that lives in a bag.                                                                          |
| 2026-08-22 | The machine travels with me between my rented place and home, so the network changes every time | Installed Tailscale before the first move. It keeps one address on any network. The local IP changes and nothing I saved has to change with it. A fixed IP or port forwarding was never an option for a machine that doesn't sit still. |
| 2026-08-22 | Fixing the network while depending on that same network to reach the machine                    | Debugged wifi over the ethernet connection, and used netplan's auto-revert instead of applying changes directly. Get it wrong on a machine with no screen and you're locked out.                                                        |
| 2026-08-22 | The wifi config looked correct and silently never connected                                     | Two causes, neither visible in the error: the config style I used isn't supported for wireless, and the wifi package Ubuntu Server needs wasn't installed.                                                                              |
| 2026-08-22 | The server wouldn't get on wifi                                                                 | Ran a cable. Ethernet is now the primary connection and wifi the backup. A machine I can't look at shouldn't depend on the flakiest link in the house.                                                                                  |
