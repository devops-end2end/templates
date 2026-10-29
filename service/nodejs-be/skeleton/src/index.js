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

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
