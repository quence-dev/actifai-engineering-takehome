WITH grouped_sales AS (
  SELECT 
    DATE_TRUNC('month', s.date::DATE) AS sales_month,
    g.name AS group_name,
    SUM(s.amount) AS total_revenue,
    COUNT(s.id) AS total_sales_count
  FROM user_groups ug
  LEFT JOIN users u ON u.id = ug.user_id
  LEFT JOIN groups g ON g.id = ug.group_id
  LEFT JOIN sales s ON s.user_id = u.id
  WHERE s.date IS NOT NULL -- Ensure there are sales to count
  GROUP BY DATE_TRUNC('month', s.date::DATE), g.name
)
SELECT 
  sales_month,
  group_name,
  total_revenue,
  (total_revenue / NULLIF(total_sales_count, 0)) AS average_revenue
FROM grouped_sales
ORDER BY sales_month, group_name;
