// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./db');
const { Parent, Child } = require('./models');

const app = express();
app.use(express.json());
app.use(morgan('dev')); // логирование запросов

// healthcheck
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// POST /parents — создать родителя
app.post('/parents', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'name is required' });

        const parent = await Parent.create({ name });
        res.status(201).json(parent);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /parents — список родителей
app.get('/parents', async (req, res) => {
    try {
        const parents = await Parent.findAll();
        res.json(parents);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /parents/:id — один родитель
app.get('/parents/:id', async (req, res) => {
    try {
        const parent = await Parent.findByPk(req.params.id);
        if (!parent) return res.status(404).json({ error: 'Parent not found' });
        res.json(parent);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /parents/:id/children — все дети родителя
app.get('/parents/:id/children', async (req, res) => {
    try {
        const parent = await Parent.findByPk(req.params.id, {
            include: { model: Child, as: 'children' },
        });
        if (!parent) return res.status(404).json({ error: 'Parent not found' });

        res.json(parent.children);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// POST /children — создать ребёнка
app.post('/children', async (req, res) => {
    try {
        const { name, parentId } = req.body;

        if (!name || !parentId) {
            return res
                .status(400)
                .json({ error: 'name and parentId are required' });
        }

        // Валидация существования родителя
        const parent = await Parent.findByPk(parentId);
        if (!parent) {
            return res.status(400).json({ error: 'Parent does not exist' });
        }

        const child = await Child.create({ name, parentId });
        res.status(201).json(child);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /children — список всех детей
app.get('/children', async (req, res) => {
    try {
        const children = await Child.findAll();
        res.json(children);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /children/:id — один ребёнок
app.get('/children/:id', async (req, res) => {
    try {
        const child = await Child.findByPk(req.params.id, {
            include: { model: Parent, as: 'parent' },
        });
        if (!child) return res.status(404).json({ error: 'Child not found' });

        res.json(child);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');

        // В учебных целях можно sync({ alter: true }) / { force: true }
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.error('Unable to start', e);
        process.exit(1);
    }
})();
