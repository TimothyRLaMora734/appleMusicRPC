#!/bin/zsh

dir=$(cd `dirname $0` && pwd)
nodebin=$(which node)
firstpath=/absolute/path/to/repo
secondpath=/absolute/path/to/node
echo "[INFO] Running script"
echo "[+] Replacing paths in plist file..."
sed -i '' "s|$firstpath|$dir|g" ririxidev.am-rpc.plist
sed -i '' "s|$secondpath|$nodebin|g" ririxidev.am-rpc.plist
echo "[+] Copying plist file to ~/Library/LaunchAgents"
cp ririxidev.am-rpc.plist ~/Library/LaunchAgents/
echo "[+] Starting daemon..."
launchctl load ~/Library/LaunchAgents/ririxidev.am-rpc.plist
echo "[+] Started daemon..."
echo "[+] Daemon will start every-time you login."
echo "[+] To stop daemon, run: sudo launchctl unload ~/Library/LaunchAgents/ririxidev.am-rpc.plist"
echo "[+] To start daemon, run: sudo launchctl load ~/Library/LaunchAgents/ririxidev.am-rpc.plist"
echo "[+] To remove daemon, run: sudo launchctl unload ~/Library/LaunchAgents/ririxidev.am-rpc.plist && rm ~/Library/LaunchAgents/ririxidev.am-rpc.plist"