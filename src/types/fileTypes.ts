export interface FileObjectType {
    file: {
      data: {
        type: "Buffer";
        data: any;
      };
      contentType: string;
    };
    _id: string;
    name: string;
    size: string;
  }