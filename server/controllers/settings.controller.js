const { exec } = require("child_process");

exports.backupDatabase = async (req, res) => {
  // You may want to secure this endpoint in production!
  const backupPath = `./db_backups/backup_${Date.now()}`;
  const cmd = `mongodump --uri='${process.env.MONGODB_URI}' --out='${backupPath}'`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ message: "Backup failed", error: stderr });
    }
    res.json({ message: "Backup successful", backupPath });
  });
};
