# StudentRun

<!-- PROJECT LOGO -->
<br />

<p align="center">
  <a href="https://github.zhaw.ch/PathFinder/StudentRun">
    <img src="app/public/assets/webpage/logo.png" alt="Logo" height="160">
  </a>

  <h3 align="center">StudentRun</h3>

  <p align="center">
		Get ready for action packed races with your friends in StudentRun!
    <br />
    <a href="https://github.zhaw.ch/PathFinder/StudentRun/blob/master/doc/Dokumentation.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://studentrun.tseng.ch/">View Demo</a>
    ·
    <a href="https://github.zhaw.ch/PathFinder/StudentRun/issues">Report Bug</a>
    ·
    <a href="https://github.zhaw.ch/PathFinder/StudentRun/issues">Request Feature</a>
  </p>
</p>

[![Build status](https://dev.azure.com/zhaw-gruppe-x/Student%20Run/_apis/build/status/Student%20Run-CI%20CD)](https://dev.azure.com/zhaw-gruppe-x/Student%20Run/_build/latest?definitionId=1)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=alert_status)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=security_rating)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=bugs)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=code_smells)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=coverage)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=sqale_index)](https://sonarcloud.io/dashboard?id=StudentRun)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=StudentRun&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=StudentRun)

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#build-automation">Build Automation</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

StudentRun is a competitive multiplayer game. StudentRun enables you to play versus online opponents with the goal to reach the finsh line as quickly as possible.


### Built With

* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [Node.js](https://nodejs.org/en/)
* [Phaser](https://phaser.io/)
* [Matter.js](https://brm.io/matter-js/)
* [Socket.IO](https://socket.io/)


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.zhaw.ch/PathFinder/StudentRun.git
   ```
2. Change into the app directory
   ```sh
   cd app/
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Start the app
   ```sh
   npm run dev
   ```
5. Open game in the browser
   `http://localhost:8082/`



<!-- BUILD AUTOMATION -->
## Build Automation

- [Azure DevOps](https://dev.azure.com/zhaw-gruppe-x/Student%20Run)
- Triggers:
  - Continuous integration: Polling `master`-Branch
  - Scheduled Nightly: MO-SO, 02:00 UTC


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/github_username/repo_name/issues) for a list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

* Adrian Schrempp - schreadr@students.zhaw.ch
* Marvin Tseng - tsengmar@students.zhaw.ch
* Marco Forster - forstma1@students.zhaw.ch
* Dan Hochstrasser - hochsdan@students.zhaw.ch
* Manuel Berweger - berweman@students.zhaw.ch

Project Link: [https://github.zhaw.ch/PathFinder/StudentRun](https://github.zhaw.ch/PathFinder/StudentRun)


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Bulma](https://bulma.io/)
* [Sass](https://sass-lang.com/)
* [Font Awesome](https://fontawesome.com)
* [Jest](https://jestjs.io/)
* [npm](https://www.npmjs.com/)
* [Browserify](http://browserify.org/)
* [Winston](https://github.com/winstonjs/winston#readme)
* [ESLint](https://eslint.org/)
* [Prettier](https://prettier.io/)
* [JQuery](https://jquery.com/)
* [Mongoose](https://mongoosejs.com/)
* [cross-env](https://github.com/kentcdodds/cross-env#readme)
* [npm-run-all](https://github.com/mysticatea/npm-run-all)
* [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/)
* [SonarCloud](https://sonarcloud.io/)
* [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
* [Semantic Versioning 2.0.0](https://semver.org/)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
