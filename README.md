# CinemaTicket

The idea of this project is taken from [CinemaTicket](https://cinematicket.org) website.

My challenges in this project were using [Prisma](https://prisma.io), [PostgresSQL](https://postgresql.org) and writing documentation with [Swagger](https://swagger.io) for the first time.

The technologies I used:
- [TypeScript](https://typescriptlang.org) on server-side,
- [Node.js](https://nodejs.org/en) runtime environment,
- [Express.js](https://expressjs.com) framework,
- [PostgreSQL](https://postgresql.org) database,
- [Prisma](https://prisma.io) ORM,
- [Multer](https://github.com/expressjs/multer) to store images on disk storage,
- [Swagger](https://swagger.io/) for api documentation,
- [Passport.js](http://www.passportjs.org/) for authentication (using [local](https://www.passportjs.org/packages/passport-local/) and [JWT](http://www.passportjs.org/packages/passport-jwt/) strategies).

This repository only contains the back-end app. To access the client app please visit this [repo](https://github.com/peymanath/cinematicket.org).

The technologies used in client app:
- [Next.js](https://nextjs.org/) framework,
- [Tailwidn CSS](https://tailwindcss.com/) framework,
- Context,
- [Axios](https://axios-http.com/),
- [styled-components](https://styled-components.com/),
- [NProgress](https://www.npmjs.com/package/nprogress),
- [Formik](https://formik.org/),
- [HeadlessUI](https://headlessui.com/).

## How to run

To run this api and see if it works well, you need to take a few steps.

First, you need to download and install [Node.js](https://nodejs.org/en/download/) (I used v18.15.0).

Second, you need to have a PostgreSQL database so the app can connect to it. You can get whatever provider you want, and here's two options that I used:
- [Liara](https://liara.ir): good to use if you're in Iran. I used this provider for developemnt environtment.
- [ElephantSQL](https://elephantsql.com): I used this provider for production environment.

Third, you need an [ImageKit](https://imagekit.io) cloud storage. At the time of declaring this project for myself this provider didn't forbid me because of US sanctions, so I decided to use it for ease.

For the last part, you need to clone this repo. Go to any directory you want in your computer. Then, open the terminal and write the command below (I assume you already have Git installed):

```
git clone https://github.com/mahdiHash/cinemaTicket-server.git
```

After that:  

```
cd cinemaTicket-server
```

Now you need to create a `.env` file in the root directory. Here's the list of variables you need to create:
- `PORT`: the port that the app should be runned on,
- `ENV`: the runtime environment of the app (set it to "production"),
- `DB_URL`: the URL to your database,
- `JWT_TOKEN_SECRET`: a secret to be used for asigning JWTs,
- `COOKIE_SECRET`: a secret to be used for cookies,
- `CIPHER_KEY`: the key to be used by cipher functions for encryption/decryption,
- `CIPHER_ALGORITHM`: the algorithm that the cipher functions must use,
- `CIPHER_IV`: an initialization vector for the cipher functions to use,
- `IMAGEKIT_STORAGE_PUBLIC_KEY`: the public key you get after setting up ImageKit free tier,
- `IMAGEKIT_STORAGE_PRIVATE_KEY`: the private key you get after setting up ImageKit free tier,
- `IMAGEKIT_STORAGE_URL_ENDPOINT`: the url endpoint of your could storage.

**NOTE:** if you haven't installed TypeScript on your local system yet, please do it by install it globally: `npm install -g typescript`.

**NOTE:** to use ImageKit cloud services you need to use a VPN or a DNS changer (run the server with either of them enabled).

After these steps, you need to install the dependencies. For that, you can write `npm install` in the terminal. This will install all the dependencies the project needs.

Now to run a local server, enter `npm start`. After starting the server, you can send requests anyhow you're comfortable with (e.g. Postman) and get the response. The base URI is `http://127.0.0.1:{PORT OF .env FILE}` or `http://localhost:{PORT OF .env FILE}`.

## How to use

Done with the [How to run](#how-to-run) section? Great! You can now see the api documentation on `http://localhost:{PORT OF .env FILE}/apidocs`. All the information about the requests lies there. Have fun developing :)
