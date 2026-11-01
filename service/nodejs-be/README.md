Backstage service template skeleton for a Node.js (Express) backend service.

This template leverages Express.js, structured directory separation (src/ for application logic and tests), automated testing with Jest and Supertest, and Backstage scaffolding descriptors.

Steps for initial setup of nodejs app with jest and vitest:

npm install

update the package.json, test/package.json and .package-lock.json with the following:
    "name": "${{ values.componentId }}"