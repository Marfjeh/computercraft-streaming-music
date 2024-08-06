# Streaming music in Minecraft (ComputerCraft CC: Tweaked mod)

**Install:** `pastebin get manTdeiG music`

**Run:** `music`

## How to use

1. Install the [CC: Tweaked](https://tweaked.cc/) mod to your world/server.
2. Craft an Advanced Computer and connect it to a speaker, or craft an Advanced Noisy Pocket Computer.
3. Open the computer and then drag and drop the `music.lua` script on top of the Minecraft window to transfer the file over.
4. Run the `music` command and enjoy your music!

## How to self-host

The ComputerCraft program connects to a web server to download the music files.

### Note: make sure if you are using this locally, that you configured computercraft to connect localhost if you run it on the same machine as where the game / server runs.
### ! allowing localhost is a security breach if used on a public minecraft server. i suggest you running this on a simple VPS instead, or use the orginial code and run it on firebase.

If you understand the warning, then you can proceed.

1. clone this repo and cd in the directory and to functions. 
2. execute npm install to install the dependencies.
3. then execute `npm start`


