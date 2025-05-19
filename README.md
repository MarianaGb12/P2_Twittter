# Build X

User stories

- As a User, I can create an account, and authenticate (recover my password only Firebase)
- As a User, I can visit my profile page to read all my Posts.
- As a User, I can see only my Posts in the Timeline ordered by the most recent date.
- As a User, I can create a Post or delete a Post that I created.
- As a User, I can Reply and Like my Posts.

- Configuración de Sentry
- Al menos 3 Pruebas unitarias de diferentes componentes o funciones
- Configuración de CI para verificación de pruebas - no tienen que implementar el despliegue
- Configuración de un feature flag para ejecutar un experimento. Si el feature flag está activo, renderizar un botón; sino, renderizar un link. Pueden utilizar growthbook.
----------------------------------
# Clone repository
> https://github.com/MarianaGb12/P2_Twittter.git

# Enter to folder project
> cd P2_Twittter

# Install dependencies
> npm install

Correr repositorio API_Twitter, con el DB_CONNECTION_STRING

# Run app
> npm run dev

# Run Test
> npm run test

--------------------------------
Se debe crear un archivo .env con lo siguiente: 
 ```
 VITE_API_URL=http://localhost:8083/api
 VITE_SENTRY_DSN=https://498a7177b1149d6540a593a470b195e3@o4509317240455168.ingest.us.sentry.io/4509317263589376 
 VITE_GROWTHBOOK_CLIENT_KEY=<Growthbook_keyy>
 ```

 Se debe crear un archivo .env.sentry-build-plugin con lo siguiente: 
 ```
# DO NOT commit this file to your repository!
# The SENTRY_AUTH_TOKEN variable is picked up by the Sentry Build Plugin.
# It's used for authentication when uploading source maps.
# You can also set this env variable in your own .env files and remove this file.
SENTRY_AUTH_TOKEN=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
```
 
