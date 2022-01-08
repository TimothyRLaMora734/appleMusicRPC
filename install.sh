#!/bin/zsh

dir=$(cd `dirname $0` && pwd)
nodebin=$(which node)
firstpath=/absolute/path/to/repo
secondpath=/absolute/path/to/node
echo "[INFO] Running script"
echo "[+] Replacing paths in plist file..."
sed -i '' "s|$firstpath|$dir|g" sleequid.am-rpc.plist
sed -i '' "s|$secondpath|$nodebin|g" sleequid.am-rpc.plist
echo "[+] Copying plist file to ~/Library/LaunchAgents"
cp sleequid.am-rpc.plist ~/Library/LaunchAgents/
echo "[+] Starting daemon..."
launchctl load ~/Library/LaunchAgents/sleequid.am-rpc.plist
echo "[+] Started daemon... Check your discord status!"
echo "[+] Daemon will start every-time you login."
echo "[+] To stop daemon, run: sudo launchctl unload ~/Library/LaunchAgents/sleequid.am-rpc.plist"
echo "[+] To start daemon, run: sudo launchctl load ~/Library/LaunchAgents/sleequid.am-rpc.plist"
echo "[+] To remove daemon, run: sudo launchctl unload ~/Library/LaunchAgents/sleequid.am-rpc.plist && rm ~/Library/LaunchAgents/sleequid.am-rpc.plist"
echo "[+] To check daemon logs, run: sudo tail -f /var/log/syslog"
