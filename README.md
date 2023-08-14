 <p align="center">
  <a href="https://weddin.site/">
    <img src="https://weddin.site/images/logo_with_text_small.png" width="300px" alt="Weddin logo with text" />
  </a>
 </p>

<h3 align="center">Organize your wedding event and guest list.</h3>
<p align="center">Create a digital custom invitation card for your wedding with WeddIn and send the link to your guests. Playfully build a website with all the content around your event, without any programming knowledge.</p>
<p align="center"></p>
<p align="center">
  <a target="_blank" href="https://weddin.site/doc">Docs</a> · <a target="_blank" href="https://weddin.site/demo">Live Demo</a>
</p>

# Client - Single Page Application (SPA)<!-- omit in toc -->

<p>

  <a href="https://vuejs.org/">
    <img src="https://img.shields.io/badge/dynamic/json?label=Vue&query=dependencies.vue&url=https://raw.githubusercontent.com/Devtory-GbR/weddin-client/master/package.json" />
  </a>

  <a href="https://quasar.dev/">
    <img src="https://img.shields.io/badge/dynamic/json?label=Quasar&query=dependencies.quasar&url=https://raw.githubusercontent.com/Devtory-GbR/weddin-client/master/package.json" />
  </a>

</p>

WeddIn Client - for you guest to sign in for the best wedding ever and provide with some nice informations. Build with [Vue](https://vuejs.org/) and [Quasar Framework](https://quasar.dev/).

_Table of Content_

- [🚀 Gettign started](#-gettign-started)
- [🚢 Deploy](#-deploy)
- [🧾 License](#-license)
- [🚫 Disclaimer](#-disclaimer)

## 🚀 Gettign started

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm start
```

The project need the WeddIn server to work propably - [WeddIn Serer](https://github.com/Devtory-GbR/weddin-server). So check if you have also the server up and running.

## 🚢 Deploy

Create a _.env_ file in root and fill in the correct url's for your domain - have a look at [env.example](./env.example).

After that build the website.

```bash
# generate static web files
$ npm run build
```

Generate in _/dist_ a static web page. Just copy the sources on the webserver.

## 🧾 License

You can copy the source code, edit it and build totally new projects with it.
But however you are **not allowed to use the code for commorcial use**.

See the [LICENSE](./LICENSE) file for more licensing information.

## 🚫 Disclaimer

YOUR ARE FREE TO USE THE CODE IN YOUR PROJECTS HOWEVER MAKE CLEAR THAT THE CODE IS OFFERED "AS-IS, WITHOUT WARRANTY AND DISCLAIMING LIABILITY FOR DAMAGES RESULTING FROM USING THE CODE.
