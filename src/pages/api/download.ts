// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

import connectMongo from "utils/connectMongo";
import { FileSchema } from "models";
import { FileObjectType } from "types";

type Data = {
  data?: Array<FileObjectType>;
  error?: any;
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(403).json({ error: "unknown route", status: "error" });
  }
  try {
    await connectMongo();

    const schema = Joi.object({
      id: Joi.string()
        .alphanum()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
    });

    try {
      const value = await schema.validateAsync({
        id: req.query?.id,
      });
      const file = await FileSchema.find({ _id: value.id });
      if (file.length === 1)
        res.status(200).json({
          status: "success",
          data: JSON.parse(JSON.stringify(file[0])),
        });
      else throw "no result";
    } catch (err) {
      res.status(400).json({ error: "invalid id", status: "error" });
    }
  } catch (error) {
    console.log(error);
    res.json({ error, status: "error" });
  }
}
