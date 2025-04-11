WITH grouped_users AS (
  SELECT 
    ug.group_id,
    u.id AS user_id,
    u.name AS user_name
  FROM user_groups ug
  LEFT JOIN users u ON u.id = ug.user_id
), grouped_sales AS (
  SELECT 
    g.id AS group_id,
    g.name AS group_name,
    gu.user_id,
    gu.user_name,
    SUM(s.amount) AS total_revenue,
    ROUND(AVG(s.amount)) AS average_revenue -- Round to the nearest whole number
  FROM groups g
  LEFT JOIN grouped_users gu ON gu.group_id = g.id
  LEFT JOIN sales s ON s.user_id = gu.user_id
  WHERE 
    s.date >= ${begin_date}::DATE AND
    s.date < ${end_date}::DATE
  GROUP BY g.id, g.name, gu.user_id, gu.user_name
) SELECT 
  group_name,
  user_name,
  total_revenue,
  average_revenue
FROM grouped_sales
ORDER BY group_name, user_name;