# EASY Templates

## Summary

Useful scenario to make centrally managed company templates (from a document library in SharePoint Online) available in every document library within the whole SharePoint tenant. 
Under the hood, the extension is built using React and PnPjs.

## Features

- [x] List files that serve as company templates in a tree structure
- [x] Filter by file category
- [x] Filter by name
- [x] Copy selected files fom template repository to the current document library
- [x] Show a settings page to all users who have permissions to manage lists

Uses several ["Reusable React controls"](https://pnp.github.io/sp-dev-fx-controls-react/) for an awesome user experience.

### Feature ideas

- [ ] Display additional metadata (filesize, current version) of the template file
- [ ] Show a preview of a selected template file by clicking on its file name

## Compatibility

| :warning: Important                                                                                                                                                                                                                                                                           |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every SPFx version is only compatible with specific version(s) of Node.js. In order to be able to build this sample, please ensure that the version of Node on your workstation matches one of the versions listed in this section. This sample will not work on a different version of Node. |
| Refer to <https://aka.ms/spfx-matrix> for more information on SPFx compatibility.                                                                                                                                                                                                             |

This sample is optimally compatible with the following environment configuration:

![SPFx 1.17.4](https://img.shields.io/badge/SPFx-1.17.4-green.svg)
![PnPJs 3.22.0](https://img.shields.io/badge/PnPJs-3.22.0-green.svg)
![Reusable React Controls 3.17.0](https://img.shields.io/badge/spfx--controls--react-3.17.0-green.svg)
![Node.js v16](https://img.shields.io/badge/Node.js-v16-green.svg)
![Compatible with SharePoint Online](https://img.shields.io/badge/SharePoint%20Online-Compatible-green.svg)
![Does not work with SharePoint 2019](https://img.shields.io/badge/SharePoint%20Server%202019-Incompatible-red.svg "SharePoint Server 2019 requires SPFx 1.4.1 or lower")
![Does not work with SharePoint 2016 (Feature Pack 2)](https://img.shields.io/badge/SharePoint%20Server%202016%20(Feature%20Pack%202)-Incompatible-red.svg "SharePoint Server 2016 Feature Pack 2 requires SPFx 1.1")
![Local Workbench Unsupported](https://img.shields.io/badge/Local%20Workbench-Unsupported-red.svg "Local workbench is no longer available as of SPFx 1.13 and above")
![Hosted Workbench Compatible](https://img.shields.io/badge/Hosted%20Workbench-Compatible-green.svg)
![Compatible with Remote Containers](https://img.shields.io/badge/Remote%20Containers-Not%20Tested-yellow.svg)

For more information about SPFx compatibility, please refer to <https://aka.ms/spfx-matrix>
  
## Contributors

- [Tobias Maestrini](https://github.com/tmaestrini)
- [Dan Toft (Code Reviews)](https://github.com/Tanddant)

## Version history

| Version | Date            | Comments        |
| ------- | --------------- | --------------- |
| 1.0     | April 1, 2024   | Initial release |

## Prerequisites

A SharePoint Tenant with a dedicated document library that serves as repository for company templates. Any document library is allowed; we suggest to make proper use of a SharePoint [organization assets library](https://learn.microsoft.com/en-us/sharepoint/organization-assets-library).

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
