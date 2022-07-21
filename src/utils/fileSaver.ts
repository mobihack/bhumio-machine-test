interface FileSaverProps {
    fileData: Blob;
    name: string;
}

export const fileSaver = ({ fileData, name }: FileSaverProps): void => {
    const fileUrl = window.URL.createObjectURL(fileData);
    const link = document.createElement('a');
    link.setAttribute('href', fileUrl);
    link.setAttribute('download', name);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
};
