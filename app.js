const express = require('express');
const app = express();
const apiRoutes = require('./api/api');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.render('index', { });
});
app.get('/game', (req, res) => {
    res.render('game', { });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});