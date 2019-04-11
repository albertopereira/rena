# rena

> Project Management Software

## Intro
#### Description
rena is a fullscreen project management software, built with electron-vue. It is roughly inspired by the beautiful [eDEX-UI](https://github.com/GitSquared/edex-ui/), but with a real world use. It has binaries working for windows, linux and osx (download below). It's stable enough for daily use but it will, probably, not be updated often.

#### Features
* Terminal windows;
* Knowledge base;
* Some tasks automated:
  * open code folder;
  * ssh into server;
  * open winscp session;
* Save server data;
* Group tasks;
* Time tracking per task;
* Set tasks priorities;
* System Vagrant boxes info (list and status);
* Vagrant boxes actions (start, stop);
* Window with weather info (you may want to disable this one - it's set to Lisbon/Portugal - will be configurable in the next version);
* Two default themes;
* Some configuration possible (see below - configuration);
* 21 default background images (you can add more or change them in app);

#### Screenshots
![rena screenshot 1](https://i.imgur.com/q1jjnZQ.jpg "rena screenshot 1")
_Default theme 1_

![rena screenshot 1](https://i.imgur.com/nDP91qM.jpg "rena screenshot 1")
_Default theme 2_


## Downloads
* Windows ([download](https://github.com/albertopereira/rena/releases/download/V0.1.0-beta1/rena.Setup.0.1.0.exe))
* Linux
* macOS ([download](https://github.com/albertopereira/rena/releases/download/V0.1.0-beta1/rena-0.0.1.dmg))

## Configuration
The configuration file can be found in %APPDATA%/rena/config.json and has the following parameters:
* __altBlocks__ - an array with the 4 blocks in the lower left corner of the app. You can remove any of them;
* __locale__ - the language locale you wish the app to use. This is used to format the presentation of the dates;
* __allTasksGroups__ - the names of the task groups to be included in the all tasks by priority section;
* __infoButtons__ - an array with the action buttons for each project. You can remove any of them;
* __theme__ - the app theme. Right now, there's only 2 options: "default" or "orange";
* __bgImage__ - the number of the image for the background. You can change it by hand or in the app (use the ctrl+arrow combination);
* __color__ - the overall color of the app. This accepts any css color code.

## FAQ
__Is it scalable?__  
Not really, no. The entirety of the data is loaded into memory. For a single user, after a few years (probably), it will show. Working on a scalable version.

## Development
#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# lint all JS/Vue component files in `src/`
npm run lint

```

#### Tests
It doesn't have a single one.

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
