WITH grouped_sales AS (
  SELECT 
    DATE_TRUNC('month', s.date) AS sales_month, -- Truncate date to the first day of the month
    g.name AS group_name, -- Group name
    SUM(s.amount) AS total_revenue, -- Total sales for the group in the month
    COUNT(s.id) AS total_sales_count -- Total number of sales for the group in the month
  FROM user_groups ug
  LEFT JOIN users u ON u.id = ug.user_id
  LEFT JOIN groups g ON g.id = ug.group_id
  LEFT JOIN sales s ON s.user_id = u.id
  WHERE s.date IS NOT NULL -- Ensure there are sales to count
  GROUP BY DATE_TRUNC('month', s.date), g.name
)
SELECT 
  sales_month,
  group_name,
  total_revenue AS group_total_revenue, -- Total sales for the group in the month
  (total_revenue / NULLIF(total_sales_count, 0)) AS group_average_revenue -- Average sales for the group in the month
FROM grouped_sales
ORDER BY sales_month, group_name;
