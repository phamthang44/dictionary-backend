import Word from "../models/Word.js";

export const getAllWords = async () => {
  return await Word.find();
};

export const createWord = async (data) => {
  const word = new Word(data);
  return await word.save();
};

export const updateWord = async (id, data) => {
  return await Word.findByIdAndUpdate(id, data, { new: true });
};

export const deleteWord = async (id) => {
  return await Word.findByIdAndDelete(id);
};
