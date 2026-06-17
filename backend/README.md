# Termux + Ubuntu (Proot) Backend Service

This directory contains the Python backend required to bridge your Next.js dashboard to a real Android device.

## Installation

1. Install Termux from F-Droid (do not use Google Play version).
2. Start Termux and install required system tools (`adb`, `python`):
   ```bash
   pkg update && pkg upgrade
   pkg install python python-pip android-tools
   ```
3. Copy this folder to your device.
4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Local Configuration

Before running the server, you need to enable Wireless Debugging or establish a local ADB connection on your device so the `subprocess` calls can execute correctly:
```bash
adb tcpip 5555
adb connect 127.0.0.1:5555
```

## Running the Server

Set your secure API key matching the one you will enter in the Next.js `Security Vault` popup, and start `uvicorn`:

```bash
export APP_SECRET_KEY="my_ultra_secure_key_123"
uvicorn main:app --host 0.0.0.0 --port 8000
```

Because Termux uses an ARM64 CPU context isolated on your specific device, any command running through `adb shell` driven by the FastAPI websockets payload will trigger natively on the active UI thread of your smartphone screen.
