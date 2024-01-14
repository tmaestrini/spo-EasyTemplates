# Modern Version History for SharePoint

## Summary

A modern UI version of the traditional version history page for SharePoint lists and libraries. The web part is built using React and PnPjs.

![moderversionhistory](./assets//Demo.gif)

## Features

- [x] Modern UI of the traditional version history
- [x] See who changed what, and when
- [x] Filter by date range
- [x] Filter by user
- [x] Compare two different versions
- [x] Restore a previous version
- [x] Delete a previous version
- [x] View the full version
- [x] Approver (and comments)
- [ ] Show only changes to specific fields
- [ ] Show only changes to specific fields by specific users


## Compatibility

| :warning: Important                                                                                                                                                                                                                                                                           |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every SPFx version is only compatible with specific version(s) of Node.js. In order to be able to build this sample, please ensure that the version of Node on your workstation matches one of the versions listed in this section. This sample will not work on a different version of Node. |
| Refer to <https://aka.ms/spfx-matrix> for more information on SPFx compatibility.                                                                                                                                                                                                             |

This sample is optimally compatible with the following environment configuration:

![SPFx 1.17.4](https://img.shields.io/badge/SPFx-1.17.4-green.svg)
![Node.js v16](https://img.shields.io/badge/Node.js-v16-green.svg)
![Compatible with SharePoint Online](https://img.shields.io/badge/SharePoint%20Online-Compatible-green.svg)
![Does not work with SharePoint 2019](https://img.shields.io/badge/SharePoint%20Server%202019-Incompatible-red.svg "SharePoint Server 2019 requires SPFx 1.4.1 or lower")
![Does not work with SharePoint 2016 (Feature Pack 2)](https://img.shields.io/badge/SharePoint%20Server%202016%20(Feature%20Pack%202)-Incompatible-red.svg "SharePoint Server 2016 Feature Pack 2 requires SPFx 1.1")
![Local Workbench Unsupported](https://img.shields.io/badge/Local%20Workbench-Unsupported-red.svg "Local workbench is no longer available as of SPFx 1.13 and above")
![Hosted Workbench Compatible](https://img.shields.io/badge/Hosted%20Workbench-Compatible-green.svg)
![Compatible with Remote Containers](https://img.shields.io/badge/Remote%20Containers-Not%20Tested-yellow.svg)

For more information about SPFx compatibility, please refer to https://aka.ms/spfx-matrix
  
## Contributors

* [Dan Toft](https://github.com/Tanddant)
* [Emanuele Bartolesi](https://github.com/kasuken)
* [Tobias Maestrini](https://twitter.com/tmaestrini)


## Version history

| Version | Date            | Comments        |
| ------- | --------------- | --------------- |
| 1.0     | September 1, 2023 | Initial release |

## Prerequisites

A SharePoint Tenant with list or library with versioning enabled.

## Minimal path to awesome

* Clone this repository (or [download this solution as a .ZIP file](https://pnp.github.io/download-partial/?url=https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-modern-version-history) then unzip it)
* From your command line, change your current directory to the directory containing this sample (`react-modern-version-history`, located under `samples`)
* in the command line run:
  * `npm install`
  * `gulp serve`

> This sample can also be opened with [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview). Visit <https://aka.ms/spfx-devcontainer> for further instructions.
**

## How to run the solution locally

- Clone this repository
- Ensure that you are in the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

## Help

We do not support samples, but this community is always willing to help, and we want to improve these samples. We use GitHub to track issues, which makes it easy for  community members to volunteer their time and help resolve issues.

If you're having issues building the solution, please run [spfx doctor](https://pnp.github.io/cli-microsoft365/cmd/spfx/spfx-doctor/) from within the solution folder to diagnose incompatibility issues with your environment.

You can try looking at [issues related to this sample](https://github.com/pnp/sp-dev-fx-webparts/issues?q=label%3A%22sample%3A%20react-modern-version-history%22) to see if anybody else is having the same issues.

You can also try looking at [discussions related to this sample](https://github.com/pnp/sp-dev-fx-webparts/discussions?discussions_q=react-modern-version-history) and see what the community is saying.

If you encounter any issues using this sample, [create a new issue](https://github.com/pnp/sp-dev-fx-webparts/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Abug-suspected%2Csample%3A%20react-modern-version-history&template=bug-report.yml&sample=react-modern-version-history&authors=@Tanddant&title=react-modern-version-history%20-%20).

For questions regarding this sample, [create a new question](https://github.com/pnp/sp-dev-fx-webparts/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Aquestion%2Csample%3A%20react-modern-version-history&template=question.yml&sample=react-modern-version-history&authors=@Tanddant&title=react-modern-version-history%20-%20).

Finally, if you have an idea for improvement, [make a suggestion](https://github.com/pnp/sp-dev-fx-webparts/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2Ctype%3Aenhancement%2Csample%3A%20react-modern-version-history&template=suggestion.yml&sample=react-modern-version-history&authors=@Tanddant&title=react-modern-version-history%20-%20).

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

<img src="https://m365-visitor-stats.azurewebsites.net/sp-dev-fx-webparts/samples/react-modern-version-history" />