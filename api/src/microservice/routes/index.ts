import express from "express";

const router = express.Router();
router.get("/", function (req, res) {
    res.status(200).send({
        title: "Climapush API",
        version: "1.0.0",
    });
});

export default router;
