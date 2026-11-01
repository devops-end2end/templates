ackstage software template skeleton for a Node.js Frontend application (React + Vite)

This template uses React with Vite for lightning-fast builds, includes Vitest and React Testing Library for component unit testing, and is pre-configured with a clean UI rendering the service welcome message and health status.

Steps for initial setup of nodejs app with jest and vitest:

npm install
npm install -D jsdom
echo "import '@testing-library/jest-dom';" > test/setup.js
npm install -D @testing-library/jest-dom

update the package.json, test/package.json and .package-lock.json with the following:
    "name": "${{ values.componentId }}"