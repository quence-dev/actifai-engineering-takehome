'use strict';

const express = require('express');
const seeder = require('./seed');
const db = require('./db');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

async function start() {
  // Seed the database
  await seeder.seedDatabase();

  // App
  const app = express();

  // Health check
  app.get('/health', (req, res) => {
    res.send('Hello World');
  });

  // Write your endpoints here

  app.get('/total-sales/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Fetching total sales for user ID: ${id}`);
    try {
      const result = await db.call('db/get_total_sales_by_user_id.sql', {user_id: id});
      res.json(result);
      console.log(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    }
  });
  
  app.get('/user-sales', async (req, res) => {
    try {
      const result = await db.call('db/get_user_sales_summary.sql');
      res.json(result);
      console.log(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    }
  });

  app.get('/group-sales', async (req, res) => {
    try {
      const result = await db.call('db/get_group_sales_summary.sql');
      res.json(result);
      console.log(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    }
  });

  app.listen(PORT, HOST);
  console.log(`Server is running on http://${HOST}:${PORT}`);
}

start();
