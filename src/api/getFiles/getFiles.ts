import { FileObjectType } from "types";
import { request } from "utils/request";

interface ServerResponseType {
    data: Array<FileObjectType>;
    status: string;
}

type GetFilesReturnType = Array<any>;

const getFilesAPI = async (url: string): Promise<GetFilesReturnType> => {
  const { data, error } = await request<ServerResponseType>({
    method: "GET",
    url,
  });

  if (error && !data) {
    throw new Error((error as Error).message);
  }

  if (!error && data) {
    return data.data as GetFilesReturnType;
  }

  return [];
};

export default getFilesAPI;
