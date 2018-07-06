# <a name="top"></a>Changes from [telefonicaid/ckanext-ngsiview](https://github.com/telefonicaid/ckanext-ngsiview)

<!-- Documentation badge line is processed by release.sh. Thus, if the structure of the URL changes,
     release.sh needs to be changed also -->

[![License badge](https://img.shields.io/badge/license-AGPL-blue.svg)](https://opensource.org/licenses/AGPL-3.0)
[![Support badge]( https://img.shields.io/badge/support-sof-yellowgreen.svg)](http://stackoverflow.com/questions/tagged/fiware-orion)

* [Introduction](#introduction)
* [Use case](#use-case)
		  
## Introduction

This is the code repository for the CKAN extension ngsiview which has some changes from base [telefonicaid/ckanext-ngsiview](https://github.com/telefonicaid/ckanext-ngsiview)
In [telefonicaid/ckanext-ngsiview](https://github.com/telefonicaid/ckanext-ngsiview) ckan extension for ngsiview is not allowed to communicate with the Orion contextBroker in same domain. But sometimes, according to the requirement we need a communication between Orion context Broker and CKAN in same domain. For this we changed few things in [telefonicaid/ckanext-ngsiview](https://github.com/telefonicaid/ckanext-ngsiview), to make ckan extension to communicate with orion context broker in same domain. 

Any feedback on this documentation is highly welcome, including bugs, typos
or things you think should be included but aren't. You can mail me at saurabhjangir@gmail.com to provide feedback.

You can find the User & Programmer's Manual and the Installation & Administration Manual on [README.md](ithub.com/saurabhjangir/ckanext-ngsiview/blob/master/README.md)

[Top](#top)

## Use case
Below is the setup in which communication between same domain Orion context broker and CKAN is required.

CKAN <---> NGINX(For Reverse Proxy) <---> Orion context broker.

[Top](#top)
