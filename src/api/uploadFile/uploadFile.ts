import { fileSaver } from "utils/fileSaver";
import { request } from "utils/request";

type SendImageDataResponseType = Array<{
  link: string;
  id: number;
}>;

interface ServerResponse {
  data: null | Array<{
    link: string;
    id: number;
  }>;
}

interface APIProps {
  formData: Blob;
  mimeType: string;
  name: string;
}

const uploadFile = async (
  formData: APIProps
): Promise<SendImageDataResponseType | null> => {
  const { data, error } = await request<ServerResponse>(
    {
      url: "/api/upload",
      method: "POST",
      headers: { 'content-type': 'multipart/form-data' },
      data: formData,
    }
  );
  if (error && !data) {
    throw new Error((error as Error).message);
  }

  return data?.data as SendImageDataResponseType | null;
};

export default uploadFile;
