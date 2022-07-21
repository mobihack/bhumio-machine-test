// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import Joi from "joi";

import connectMongo from "utils/connectMongo";
import { FileSchema } from "models";

type Data = {
  error?: any;
  status: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await connectMongo();

    const data: { fields: any; files: any } = await new Promise(
      (resolve, reject) => {
        const form = new formidable.IncomingForm();

        form.parse(req, (err: any, fields: any, files: any) => {
          if (err) reject({ err });
          resolve({ fields, files });
        });
      }
    );

    const schema = Joi.object({
      name: Joi.string().required(),
      type: Joi.string().required(),
    });

    const value = await schema.validateAsync({
      name: data.fields.name,
      type: data.fields.mimeType,
    });

    var obj = {
      name: data.fields.name,
      size: data.files.formData.size,
      file: {
        data: fs.readFileSync(data.files.formData.filepath),
        contentType: data.fields.mimeType,
      },
    };
    FileSchema.create(obj, (err: any) => {
      if (err) {
        res
          .status(400)
          .json({ error: "Error creating File.", status: "error" });
      } else {
        res.status(200).json({ status: "success" });
      }
    });
  } catch (error) {

    res.status(400).json({ error: "Error uploading file.", status: "error" });
  }
}
