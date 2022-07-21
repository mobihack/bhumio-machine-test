// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

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
  try {
    await connectMongo();

    const files = await FileSchema.find().select({
      file: 0,
    });

    res
      .status(200)
      .json({ status: "success", data: JSON.parse(JSON.stringify(files)) });
  } catch (error) {
    res.json({ error: "error", status: "error" });
  }
}
