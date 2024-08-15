# CarThing Pomodoro Timer
More info on [Reddit](https://www.reddit.com/r/carthinghax/comments/1esdkse/transformed_into_a_pomodo_timer/)

## Installation on MacOS
*Note: This manual is compiled from information in the 
[superbird-tool](https://github.com/bishopdynamics/superbird-tool) and
[DeskThing](https://github.com/ItsRiprod/DeskThing) repositories.
If you find any inaccuracies, please feel free to update or fix them.*

1. **Install [Homebrew](https://brew.sh)**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```   
 
1. **Install Dependencies**
   ```bash
   brew install python3 libusb android-platform-tools
   ```  

1. **Install Hacking Tool**  
   *This is required for the superbird-tool to function.*
   ```bash
    python3 -m pip install --break-system-packages git+https://github.com/superna9999/pyamlboot
   ```  
 
1. **Switch to the working directory.**
   ```bash
   cd ~/Downloads
   ```

1. **Download superbird-tool**
   ```bash
   git clone https://github.com/Car-Thing-Hax-Community/superbird-tool.git
   ```
  
1. **Download firmware that supports ADB**  
Firmware with enabled adb is required. I've used 
[8.4.4_adb_enabled-new](https://mega.nz/folder/NxNXQCaT#-n1zkoXsJuw-5rQ-ZYzRJw/folder/Ak9FVKxJ).  
Unpacked it to `~/Downloads/8.4.4_adb_enabled-new/`.  

1. **Flash a firmware to CarThing**  
    Press 1 and 4 buttons on CarThing and connect it to your computer.
    The screen will be black, it's normal. Check if the device is recognized:  
   ```bash
   cd superbird-tool
   ./superbird_tool.py --find_device
   ```  
   Switch to the burn mode and flash the firmware:   
   ```bash
   ./superbird_tool.py --burn_mode
   ./superbird_tool.py --restore_device ~/Downloads/8.4.4_adb_enabled-new/
    ```
   Switch the booting mode to slot B if ADB is not working on slot A:  
   ```bash
    ./superbird_tool.py --disable_avb2 B
   ```
   After reboot the device should load as normal and you can replace default application with Pomodoro Timer.
  
1. **Download a upload latest version of Pomodoro App**
    ```bash
    cd ~/Downloads
    git clone git@github.com:veikus/carthing-pomodoro.git
    ```
    Copy the app to the device:
    ```bash
   adb -s 123456 shell mount -o remount,rw /
    adb -s 123456 shell rm -rf /usr/share/qt-superbird-app/webapp
    adb -s 123456 push ~/Downloads/pomodoro/ /usr/share/qt-superbird-app/webapp
    adb -s 123456 shell supervisorctl restart chromium
   ```