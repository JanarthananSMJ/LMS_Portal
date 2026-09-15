const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

const uploadsDir = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

function buildFileUrl(req, filename) {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
}

router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    res.status(200).json({
      success: true,
      data: {
        url: buildFileUrl(req, req.file.filename),
        public_id: req.file.filename,
      },
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assest Id is required",
      });
    }

    const filePath = path.join(uploadsDir, path.basename(id));

    await fs.promises.unlink(filePath).catch((e) => {
      if (e.code !== "ENOENT") throw e;
    });

    res.status(200).json({
      success: true,
      message: "Assest deleted successfully",
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

router.post("/bulk-upload", authenticate, upload.array("files", 10), async (req, res) => {
  try {
    const results = req.files.map((fileItem) => ({
      url: buildFileUrl(req, fileItem.filename),
      public_id: fileItem.filename,
    }));

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (event) {
    console.log(event);

    res
      .status(500)
      .json({ success: false, message: "Error in bulk uploading files" });
  }
});

module.exports = router;
