# MyVC (MySQL Version Control)

Utilities to ease the maintenance of MySQL or MariaDB database versioning using
a Git repository.

This project is just to bring an idea to life and is still in an early stage of
development, so it may not be fully functional.

Any help is welcomed! Feel free to contribute.

## Prerequisites

Required applications.

* Node.js = 12.17.0 LTS
* Git
* Docker

## Installation

It's recommended to install the package globally.
```text
# npm install -g myvc
$ myvc [action]
```

You can also install locally and use the *npx* command to execute it.
```text
$ npm install myvc
$ npx myvc [action]
```

## How to use

Execute *myvc* with the desired action.
```text
$ myvc [-w|--workdir] [-e|--env] [-h|--help] action
```
The default working directory is the current one and unless otherwise indicated,
the default environment is *production*.

Available actions are:
 * **structure**: Export database structure.
 * **fixtures**: Export database fixtures.
 * **routines**: Export database routines.
 * **apply**: Apply changes into database, uses *local* environment by default.
 * **run**: Builds and starts local database server container.
 * **start**: Starts local database server container.

Each action can have its own specific commandline options.

## Basic information

First of all you have to import *structure.sql* into your database. This script
includes the tables where MyVC stores information about applied versions.

Create *myvc.config.json* main configuration file at the root of your project 
folder, this file should include the project codename and schemas/tables wich 
are exported when you use *structure*, *fixtures* or *routines* actions. You 
have an example of a configuration file in the root folder of this project.

### Environments

Create database connection configuration files for each environment at main 
project folder using standard MySQL *.ini*. The predefined environment names 
are *production* and *testing*.
```text
db.[environment].ini
```

### Dumps

Structure and fixture dumps will be created inside *dump* folder.

* *structure.sql*
* *fixtures.sql*

### Local

You can also create your local fixture and structure files inside *dump* folder.

* *structure.local.sql*
* *fixtures.local.sql*

### Routines

Routines should be placed inside *routines* folder. All objects that have
PL/SQL code are considered routines. It includes events, functions, procedures,
triggers and views with the following structure.
```text
  routines
  `- schema
     |- events
     |  `- eventName.sql
     |- functions
     |  `- functionName.sql
     |- procedures
     |  `- procedureName.sql
     |- triggers
     |  `- triggerName.sql
     `- views
        `- viewName.sql
```

### Versions

Versions should be placed inside *changes* folder with the following structure.
```text
  changes
  |- 00001-firstVersionCodeName
  |  |- 00-firstExecutedScript.sql
  |  |- 01-secondScript.sql
  |  `- 99-lastScript.sql
  `- 00002-secondVersion
     |- 00-firstExecutedScript.sql
     `- 00-sameNumbers.sql
```
## Built With

* [Git](https://git-scm.com/)
* [nodejs](https://nodejs.org/)
* [docker](https://www.docker.com/)
