import express from "express";

const router = express.Router();

// Rota de verificação de status da API
router.get("/health", (req, res) => {
  res.status(200).json({ status: "API funcionando corretamente!" });
});

export default router;