import mongoose from "mongoose";

export const formatArrayOfObjectIds = (arrayOfStringObjectId) => {
  if (!Array.isArray(arrayOfStringObjectId)) return [];

  return arrayOfStringObjectId
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));
};
