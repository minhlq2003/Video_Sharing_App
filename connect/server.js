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
  password: 'sapassword',
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
    const [rows] = await req.app.locals.db.execute(`
      SELECT * FROM Post p 
      INNER JOIN Users u ON p.idUser = u.idUser
      WHERE p.type = 'image'
      ORDER BY p.idPost DESC
      LIMIT 4;
    `);
    res.json(rows);
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
    const [rows] = await req.app.locals.db.execute(`
      SELECT c.text, c.time, u.avatar, u.username
      FROM Comment c
      INNER JOIN Post p ON c.idPost = p.idPost
      INNER JOIN Users u ON u.idUser = c.idUser
      WHERE p.idPost = ?
      ORDER BY p.idPost DESC`, [id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching comments:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/commentCount', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).send('Invalid id parameter');
  }

  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT COUNT(*) AS comment_count FROM Comment WHERE idPost = ?`, [id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching comment count:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/likeCount', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).send('Invalid id parameter');
  }

  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT COUNT(*) AS like_count FROM \`Like\` WHERE idPost = ?`, [id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching like count:', err);
    res.status(500).send('Server Error');
  }
});

app.post('/savePost', async (req, res) => {
  const { idUser, type, url, content } = req.body;
  if (!idUser || !type || !url || !content) {
    return res.status(400).json({ error: 'Vui lòng cung cấp idUser, type, url và content.' });
  }

  try {
    const [result] = await req.app.locals.db.execute(`
      INSERT INTO Post (idUser, type, url, content, upload_at)
      VALUES (?, ?, ?, ?, NOW())`, [idUser, type, url, content]);
    res.status(201).json({ message: 'Bài viết đã được lưu thành công!', insertId: result.insertId });
  } catch (error) {
    console.error("Lỗi cơ sở dữ liệu:", error);
    res.status(500).json({ error: 'Lỗi khi lưu bài viết vào cơ sở dữ liệu.' });
  }
});

app.put('/updateProfile', async (req, res) => {
  const { idUser, username, avatar, sdt, email, birthDay } = req.body;

  if (!idUser || !username || !sdt || !email || !birthDay) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await req.app.locals.db.execute(`
      UPDATE Users
      SET 
        username = ?,
        avatar = ?,
        sdt = ?,
        email = ?,
        birthDay = ?
      WHERE idUser = ?`, [username, avatar, sdt, email, birthDay, idUser]);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/insertComment', async (req, res) => {
  const { idPost, idUser, text } = req.body;
  if (!idUser || !idPost || !text) {
    return res.status(400).json({ error: 'Vui lòng cung cấp idUser, idPost và text.' });
  }

  try {
    const [result] = await req.app.locals.db.execute(`
      INSERT INTO Comment (idUser, idPost, text, time)
      VALUES (?, ?, ?, NOW())`, [idUser, idPost, text]);
    res.status(201).json({ message: 'Bình luận thành công!', insertId: result.insertId });
  } catch (error) {
    console.error("Lỗi cơ sở dữ liệu:", error);
    res.status(500).json({ error: 'Lỗi khi thêm bình luận vào cơ sở dữ liệu.' });
  }
});


app.post('/register', async (req, res) => {
  const { username, sdt, email, accname, pass } = req.body;
  if (!username || !sdt || !email || !accname || !pass) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const [resultUser] = await connection.execute(`
      INSERT INTO Users (username, sdt, email, avatar, birthDay)
      VALUES (?, ?, ?, 'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg', NOW())`,
      [username, sdt, email + "@gmail.com"]);
    const idUser = resultUser.insertId;

    await connection.execute(`
      INSERT INTO Account (idUser, username, pass)
      VALUES (?, ?, ?)`, [idUser, accname, pass]);

    await connection.commit();
    connection.release();
    res.status(201).json({ message: 'Tạo tài khoản thành công!' });
  } catch (error) {
    console.error("Lỗi cơ sở dữ liệu:", error);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    res.status(500).json({ error: 'Lỗi khi tạo tài khoản.' });
  }
});

app.get('/is-following', async (req, res) => {
  const { id_following, id_followed } = req.query;
  if (!id_following || !id_followed) {
    return res.status(400).json({ error: 'Thiếu id_following hoặc id_followed' });
  }

  try {
    const [result] = await req.app.locals.db.execute(`
      SELECT COUNT(*) AS is_following
      FROM Follow
      WHERE id_following = ? AND id_followed = ?`, [id_following, id_followed]);
    const isFollowing = result[0].is_following > 0;
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error("Lỗi kiểm tra follow:", error);
    res.status(500).json({ error: 'Lỗi khi kiểm tra trạng thái follow.' });
  }
});

app.post('/follow', async (req, res) => {
  const { idFollowing, idFollowed } = req.body;
  try {
    await req.app.locals.db.execute(`
            INSERT INTO Follow (id_following, id_followed)
            VALUES (?, ?)`, [idFollowing, idFollowed]);
    res.status(200).json({ message: 'Đã theo dõi người dùng thành công' });
  } catch (error) {
    console.error("Lỗi khi theo dõi:", error);
    res.status(500).json({ error: 'Lỗi khi theo dõi người dùng.' });
  }
});

app.delete('/unfollow', async (req, res) => {
  const { idFollowing, idFollowed } = req.body;
  try {
    await req.app.locals.db.execute(`
            DELETE FROM Follow
            WHERE id_following = ? AND id_followed = ?`, [idFollowing, idFollowed]);
    res.status(200).json({ message: 'Đã hủy theo dõi người dùng thành công' });
  } catch (error) {
    console.error("Lỗi khi hủy theo dõi:", error);
    res.status(500).json({ error: 'Lỗi khi hủy theo dõi người dùng.' });
  }
});

app.get('/is-like', async (req, res) => {
  const { idPost, idUser } = req.query;
  if (!idPost || !idUser) {
    return res.status(400).json({ error: 'Thiếu idPost hoặc idUser' });
  }

  try {
    const [result] = await req.app.locals.db.execute(`
      SELECT COUNT(*) AS is_like
      FROM \`Like\`
      WHERE idPost = ? AND idUser = ?`, [idPost, idUser]);
    const is_Like = result[0].is_like > 0;
    res.status(200).json({ is_Like });
  } catch (error) {
    console.error("Lỗi kiểm tra Like:", error);
    res.status(500).json({ error: 'Lỗi khi kiểm tra trạng thái Like.' });
  }
});

app.post('/like', async (req, res) => {
  const { idUser, idPost } = req.body;
  try {
    await req.app.locals.db.execute(`INSERT INTO \`Like\` (idUser, idPost) VALUES (?, ?)`, [idUser, idPost]);
    res.status(200).send({ message: "Liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).send("Server error");
  }
});

app.post('/unlike', async (req, res) => {
  const { idUser, idPost } = req.body;
  try {
    await req.app.locals.db.execute(`DELETE FROM \`Like\` WHERE idUser = ? AND idPost = ?`, [idUser, idPost]);
    res.status(200).send({ message: "Unliked successfully" });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).send("Server error");
  }
});


app.get('/stories', async (req, res) => {
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT p.*, u.avatar, u.username 
      FROM Post p
      INNER JOIN Users u ON p.idUser = u.idUser
      WHERE type = 'story' AND TIMESTAMPDIFF(HOUR, upload_at, NOW()) <= 24
      ORDER BY p.idPost DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching stories:', err);
    res.status(500).send('Error fetching stories');
  }
});

app.get('/Userstories', async (req, res) => {
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT u.idUser, u.avatar, u.username, MAX(p.upload_at) AS latest_upload_at 
      FROM Post p 
      INNER JOIN Users u ON p.idUser = u.idUser
      WHERE p.type = 'story' AND TIMESTAMPDIFF(HOUR, p.upload_at, NOW()) <= 24
      GROUP BY u.idUser, u.avatar, u.username 
      ORDER BY latest_upload_at DESC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching user stories:', err);
    res.status(500).send('Error fetching stories');
  }
});

app.get('/searchKeyWord', async (req, res) => {
  const { keyword } = req.query;
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT * FROM Post p
      INNER JOIN Users u ON p.idUser = u.idUser
      WHERE p.content LIKE ? OR u.username LIKE ?
      AND p.type = 'video'`, [`%${keyword}%`, `%${keyword}%`]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching searchKeyword:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/search', async (req, res) => {
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT * FROM Post p 
      INNER JOIN Users u ON p.idUser = u.idUser
      WHERE p.type = 'video'
    `);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching search:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/suggest', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter. Must be a number." });
  }
  try {
    const [rows] = await req.app.locals.db.execute(`
      SELECT u.* 
      FROM Users u 
      WHERE u.idUser != ?
      AND NOT EXISTS (
          SELECT 1 
          FROM Follow f
          WHERE f.id_following = ? AND f.id_followed = u.idUser
      )
      LIMIT 3`, [id, id]);
    res.json(rows);
  } catch (err) {
    console.log('Error fetching suggest:', err);
    res.status(500).send('Server Error');
  }
});

// Khởi chạy server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
