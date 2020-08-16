Project
=========
![](https://circleci.com/gh/GameVsPlayer/Project.svg?style=shield)

> ## Installation
  <details>
    <summary>Ubuntu</summary>   
    <ul>
    <li>bash git clone https://github.com/GameVsPlayer/Project</li>
    <li>cd GameVsPlayer/Project</li>
    <li>curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash</li>
    <li>echo 'source $NVM_DIR/nvm.sh' >> $BASH_ENV</li>
    <li>nvm install 14.7 && nvm use 14.7</li>
    <li>npm -g install typescript</li>
    <li>wget https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && sudo dpkg -i packages-microsoft-prod.deb</li>
    <li>sudo apt-get update && sudo apt-get install -y apt-transport-https && sudo apt-get update && sudo apt-get install -y dotnet-sdk-3.1</li>
    <li>npm i --prefix bot && npm i</li>
    <li>tsc -p bot/tsconfig.json</li>
    <li>npm i --prefix backend</li>
    <li>tsc -p backend/tsconfig.json</li>
    <li>npm i --prefix frontend</li>
    <li>npm run build --prefix frontend</li>
    </ul>
    </details>
    <details>
    <summary>Windows</summary>   
    <ul>
    <li> <a href="https://github.com/GameVsPlayer/Project/archive/master.zip">Download from github</a> </li>
    <li> unzip and enter the Project directory</li>
    <li> <a href="https://nodejs.org/en/"> install node </a></li>
    <li> npm -g install typescript</li>
    <li> <a href="https://dotnet.microsoft.com/download/dotnet-core/thank-you/runtime-aspnetcore-3.1.7-windows-x64-installer"> install .net core</a></li>
    <li> npm i --prefix bot && npm i</li>
    <li> tsc -p bot/tsconfig.json</li>
    <li> npm i --prefix backend</li>
    <li> tsc -p backend/tsconfig.json</li>
    <li> npm i --prefix frontend</li>
    <li> npm run build --prefix frontend</li>
    </ul>
    </details>

## Setup
<details>
<summary></summary>
    <ul>
    <li> open the bot directory rename the example.env to just .env </li>
    <li> fill in the settings</li>
    <details>
    <summary>points explained in the order of the .env file</summary>
    <ul>
    <li><a href="https://osu.ppy.sh/p/api/">osuAPI</a></li>
    <li><a href="https://dev.twitch.tv/docs/authentication#registration">Twitch ID</a></li>
    <li><a href="https://discord.com/developers/applications">create a new application go to bot and copy token</a></li>
    <li>Discord ID of the owner</li>
    <li>Discord ID of the bot</li>
    <li><a href="https://console.cloud.google.com/marketplace/product/google/youtube.googleapis.com?q=youtube%20data%20api%20v3/">Youtube API key</a></li>
    <li>ID of the owners server</li>
    <li><a href="https://developer.climacell.co/">climacell</a></li>
    <li><a href="https://opencagedata.com//">opencagedata api key</a></li>
    <li>mongodb uri</li>
    <li>the default prefix for the bot</li>
    <li>hex code for the bot</li>
    <li><a href="https://osu.ppy.sh/p/api/">TwitchAuth</a></li>
    </details>
    </ul>