import { FileObjectType } from "types";
import { request } from "utils/request";

interface ServerResponseType {
  data: FileObjectType;
  status: string;
}

type DownloadFileReturnType = FileObjectType | null;

const downloadFileAPI = async (id: string): Promise<DownloadFileReturnType> => {
  const { data, error } = await request<ServerResponseType>({
    method: "POST",
    url: "/api/download",
    params: {
      id,
    },
  });

  if (error && !data) {
    throw new Error((error as Error).message);
  }

  if (!error && data) {
    return data.data as FileObjectType;
  }

  return null;
};

export default downloadFileAPI;
