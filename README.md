<h1>Apple Music Rich Presence <code>--unofficial</code></h1>
Discord Rich Presence for Apple Music (macOS)!

## Features

- Super fast.
- Coded in TypeScript.
- Cache artworks.

## Supported OS

- macOS Catalina+ (10.15+)

## How to use

Run `yarn build` inside cloned repo, then run `yarn start` to start RPC.

## Daemon

```code
chmod +x install.sh
./install.sh
```

This script will install the daemon and start it automatically.

## How to remove daemon

```code
launchctl unload ~/Library/LaunchAgents/sleequid.am-rpc.plist
rm ~/Library/LaunchAgents/sleequid.am-rpc.plist
```

## Screenshots

<details>
  <summary>Open screenshots</summary>

![image](https://user-images.githubusercontent.com/9348108/147834057-577c4fca-e553-4dfd-8b19-f53087669eda.png)
![image](https://user-images.githubusercontent.com/9348108/147834084-a913e7c6-4400-47d4-875e-65bf88291307.png)

</details>

---

This project is not affiliated with Apple. It's only fan-made project.
