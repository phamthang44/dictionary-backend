import * as wordService from "../services/WordService.js";

export const getWords = async (req, res) => {
  const words = await wordService.getAllWords();
  res.json(words);
};

export const addWord = async (req, res) => {
  const newWord = await wordService.createWord(req.body);
  res.status(201).json(newWord);
};

export const updateWord = async (req, res) => {
  const updated = await wordService.updateWord(req.params.id, req.body);
  res.json(updated);
};

export const deleteWord = async (req, res) => {
  await wordService.deleteWord(req.params.id);
  res.json({ message: "Deleted successfully" });
};
