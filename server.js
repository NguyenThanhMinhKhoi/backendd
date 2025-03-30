const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.post("/students", (req, res) => {
  const { name, email, age } = req.body;
  const sql = "INSERT INTO students (name, email, age) VALUES (?, ?, ?)";
  db.query(sql, [name, email, age], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, name, email, age });
  });
});


app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  if (!name || !age) {
      return res.status(400).json({ error: 'Thiếu thông tin' });
  }

  try {
      const [result] = await db.execute('UPDATE students SET name = ?, age = ? WHERE id = ?', [name, age, id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
      }

      res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
      console.error('Lỗi khi cập nhật sinh viên:', error);
      res.status(500).json({ error: 'Lỗi server' });
  }
});


app.delete("/students/:id", (req, res) => {
  db.query("DELETE FROM students WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Student deleted successfully" });
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
