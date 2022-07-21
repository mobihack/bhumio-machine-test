import { Schema, model, models } from 'mongoose';

var fileSchema = new Schema({
  name: String,
  size: String,
  file: {
    data: Buffer,
    contentType: String,
  },
});

const FileSchema = models.File || model("File", fileSchema);

export default FileSchema;
