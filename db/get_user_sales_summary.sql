WITH grouped_users AS (
  SELECT 
    u.id AS user_id,
    u.name AS user_name,
    ARRAY_AGG(DISTINCT g.name ORDER BY g.name) AS group_names -- Aggregate group names into an array
  FROM user_groups ug
  LEFT JOIN users u ON u.id = ug.user_id
  LEFT JOIN groups g ON g.id = ug.group_id
  GROUP BY u.id, u.name
), grouped_sales AS (
  SELECT 
    DATE_TRUNC('month', s.date::DATE) AS sales_month, -- Truncate date to the first day of the month
    gu.user_id,
    gu.user_name,
    gu.group_names,
    SUM(s.amount) AS total_revenue, -- Total sales for the user in the month
    COUNT(s.id) AS total_sales_count -- Total number of sales for the user in the month
  FROM grouped_users gu
  LEFT JOIN sales s ON s.user_id = gu.user_id
  GROUP BY DATE_TRUNC('month', s.date::DATE), gu.user_id, gu.user_name, gu.group_names
)
SELECT 
  gs.sales_month,
  gs.user_name,
  gs.group_names,
  gs.total_revenue AS total_revenue,
  COALESCE(gs.total_revenue / NULLIF(gs.total_sales_count, 0), 0) AS average_revenue -- Average sales for the user in the month
FROM grouped_sales gs
ORDER BY gs.sales_month, gs.user_name;