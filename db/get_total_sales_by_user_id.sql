SELECT u.name, SUM(s.amount) FROM sales s
INNER JOIN users u ON s.user_id = u.id
WHERE s.user_id = ${user_id}
GROUP BY u.name;
