[Based on this medium post by André Gardi.](https://medium.com/javascript-in-plain-english/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4) Huge thanks to him.

# Awesome Project Build with TypeORM

Created using TypeORM version 0.2.24
Commands used to create the repository:

```
sudo npm install -g typeorm eslint
typeorm init --name typeorm-jwt-mongodb --database mongodb --express
npm install --save @types/bcryptjs @types/body-parser @types/cors @types/helmet @types/jsonwebtoken
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin@latest
```

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Copy .env.example to .env and change the variables
4. Run `npm start` command
