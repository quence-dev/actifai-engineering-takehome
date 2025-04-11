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
  
  app.get('/sales-summary', async (req, res) => {
    const {
      begin_date,
      end_date,
      user_id,
      min_amount,
      max_amount,
    } = req.query;
    console.log(`Fetching sales data for ${begin_date} to ${end_date}`);

    // TODO: error handling for invalid dates and invalid amounts

    try {
      const result = await db.call('db/get_avg_sales_by_month.sql', {
        begin_date,
        end_date,
        user_id,
        min_amount,
        max_amount,
      });
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
