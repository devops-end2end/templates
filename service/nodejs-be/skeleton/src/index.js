const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const appName = process.env.APP_NAME || '${{ values.componentId }}';

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: `Welcome to ${appName}`,
        status: 'healthy',
        docs_url: '/docs'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

/* Exporting module.exports = app alongside the if (require.main === module) check
is a best-practice pattern for Node.js backends.  It lets your server run normally 
when started via node index.js, but it also allows your test suite (like Jest and Supertest) 
to import the app cleanly without spinning up port conflicts during testing. */
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
