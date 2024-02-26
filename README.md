<div align=center>
	<h1>NodeJS Mongoose CRUD</h1>
</div>

<div align="center">
	<a href="https://gptgenius-ehkarabas-ii6irtqn2.vercel.app/">
		<img src="https://img.shields.io/badge/live-%23.svg?&style=for-the-badge&logo=www&logoColor=white%22&color=black">
	</a>
</div>

<div align="center">
      <p>You can check presentation as video from below</p>
</div>

[![Go To The Presentation Video](https://i.hizliresim.com/9lmf16h.png)](https://youtu.be/mwiHh2fPmlI)

<hr>

## Description

An employees API of which middlewares built with nodejs/expressjs and database built with MongoDB/mongoosejs. Authentication and authorization included.

## Goals

Practicing on NodeJS, ExpressJS, MongoDB, MongooseJS, node events, express middlewares & routing, MongoDB configuration & connection, mongooseJS schema & model API, intergrating static files via static middleware controller, integreating JWT for authentication & authorization and supporting it with htpp only cookies to store refresh tokens.

## Technologies

- NodeJS 20
- ExpressJS 4
- MongoDB 6
- MongooseJS 8
- JWT & Cookies

## Installation

To run this app on your local, run commands below on the terminal:

1. Clone the repo on your local.

   ```bash
   git clone https://github.com/ehkarabas/nodejs-exercises.git
   ```

2. Install node modules to this sub-repo..

   ```bash
   yarn install
   ```

   or

   ```bash
   npm install
   ```

3. Run the app on your browser.

   ```bash
   yarn dev
   ```

   or

   ```bash
   npm run dev
   ```

## Resource Structure

```
nodejs-mongoose-crud(folder)
|
├── README.md
├── config
│   ├── allowedOrigins.js
│   ├── corsOptions.js
│   ├── dbConn.js
│   └── roles_list.js
├── controllers
│   ├── authController.js
│   ├── employeesController.js
│   ├── logoutController.js
│   ├── refreshTokenController.js
│   └── registerController.js
├── logs
│   └── reqLog.txt
├── middleware
│   ├── credentials.js
│   ├── dbHandler.js
│   ├── errorHandler.js
│   ├── logEvents.js
│   ├── verifyJWT.js
│   └── verifyRoles.js
├── model
│   ├── Employee.js
│   ├── User.js
│   ├── employees.json
│   └── users.json
├── package.json
├── public
│   ├── css
│   │   └── style.css
│   ├── img
│   │   └── img1.jpg
│   └── text
│       └── data.txt
├── routes
│   ├── api
│   │   └── employees.js
│   ├── auth.js
│   ├── logout.js
│   ├── refresh.js
│   ├── register.js
│   └── root.js
├── server.js
├── views
│   ├── 404.html
│   └── index.html
└── yarn.lock
```
