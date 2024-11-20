const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối với MariaDB
const config = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'anhthang123',
  database: 'my_db',
};

// Kết nối MariaDB
const pool = mysql.createPool(config);
app.locals.db = pool.promise();  // Để sử dụng Promise

// API Endpoint để lấy danh sách người dùng
app.get('/account', async (req, res) => {
  try {
    const [rows, fields] = await req.app.locals.db.execute(`
      SELECT u.*, a.username as account_user, a.pass 
      FROM Account a 
      INNER JOIN Users u ON a.idUser = u.idUser
    `);
    res.json(rows); // Trả về dữ liệu
  } catch (err) {
    console.log('Error fetching Accounts from MariaDB:', err);
    res.status(500).send('Server Error');
  }
});


// All other endpoints updated to use MySQL syntax
app.get('/data', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter. Must be a number." });
  }
  try {
    const [rows] = await req.app.locals.db.execute(`SELECT * FROM Users WHERE idUser = ?`, [id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching data:', err);
    res.status(500).send('Server Error');
  }
});


app.get('/follow', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter. Must be a number." });
  }
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT 
        SUM(CASE WHEN f.id_following = ? THEN 1 ELSE 0 END) AS following_count,
        SUM(CASE WHEN f.id_followed = ? THEN 1 ELSE 0 END) AS followers_count
      FROM Follow f`, [id, id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching follow counts:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/followed', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter. Must be a number." });
  }
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT f.id_following, u.*
      FROM Follow f
      INNER JOIN Users u ON u.idUser = f.id_following
      WHERE f.id_followed = ?`, [id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching followed:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/following', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter. Must be a number." });
  }
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT f.id_followed, u.*
      FROM Follow f
      INNER JOIN Users u ON u.idUser = f.id_followed
      WHERE f.id_following = ?`, [id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching following:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/profilevideos', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter. Must be a number." });
  }
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT p.url, p.idPost, u.idUser, u.avatar 
      FROM Post p 
      INNER JOIN Users u ON p.idUser = u.idUser 
      WHERE p.type = 'video' AND p.idUser = ?`, [id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching profile videos:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/profileimages', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter. Must be a number." });
  }
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT p.url, p.idPost, u.idUser, u.avatar 
      FROM Post p 
      INNER JOIN Users u ON p.idUser = u.idUser 
      WHERE p.type = 'image' AND p.idUser = ?`, [id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching profile images:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/videoStreaming', async (req, res) => {
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT * FROM Post p 
      INNER JOIN Users u ON p.idUser = u.idUser
      WHERE p.type = 'video'
      ORDER BY p.idPost DESC;
    `);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching video details:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/imageStreaming4', async (req, res) => {
  try {
    const pool = req.app.locals.db;
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query(`
        select p.url from Post p inner join Users u
        on p.idUser = u.idUser where p.type= 'video' and p.idUser = @id
        ORDER BY p.idPost DESC;
      `);
    res.json(result.recordset);
  } catch (err) {
    console.log('Error fetching image details:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/imageStreaming', async (req, res) => {
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT * FROM Post p 
      INNER JOIN Users u ON p.idUser = u.idUser
      WHERE p.type = 'image'
      ORDER BY p.idPost DESC;
    `);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching image details:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/videoDetails', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter. Must be a number." });
  }
  try {
    const [rows] = await req.app.locals.db.execute(`SELECT * FROM Post WHERE idPost = ?`, [id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching video details:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/comment', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).send('Invalid id parameter');
  }

  try {
    const pool = req.app.locals.db;
    const result = await pool.request()
      .input('id', mssql.Int, parsedId)
      .query(`
        select c.text, c.time, u.avatar, u.username from Comment c
        inner join Post p on c.idPost = p.idPost 
        inner join Users u on u.idUser = c.idUser
        where c.idPost = @id
      `);

    res.json(result.recordset);
  } catch (err) {
    console.log('Error fetching comments:', err);
    res.status(500).send('Server Error');
  }
});

// Endpoint để lưu bài viết mới
app.post('/savePost', async (req, res) => {
  const { idUser, type, url, content } = req.body;
  const count_like = 0;
  const count_comment = 0;
  if (!idUser || !type || !url || !content) {
    return res.status(400).json({ error: 'Vui lòng cung cấp idUser, type, url và content.' });
  }

  try {
    const pool = req.app.locals.db;
    const result = await pool.request()
      .input('idUser', mssql.Int, idUser)
      .input('type', mssql.NVarChar, type)
      .input('url', mssql.NVarChar, url)
      .input('content', mssql.NVarChar, content)
      .input('count_like', mssql.Int, count_like)
      .input('count_comment', mssql.Int, count_comment)
      .query(`
        INSERT INTO dbo.Post (idUser, type, url, content, upload_at, count_like, count_comment)
        VALUES (@idUser, @type, @url, @content, GETDATE(), @count_like, @count_comment)
      `);

    res.status(201).json({ message: 'Bài viết đã được lưu thành công!' });
  } catch (error) {
    console.error("Lỗi cơ sở dữ liệu:", error);
    res.status(500).json({ error: 'Lỗi khi lưu bài viết vào cơ sở dữ liệu.' });
  }
});

// Khởi chạy server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
