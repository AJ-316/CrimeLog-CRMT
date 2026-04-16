export interface UploadedImageData {
    base64Data: string;
    contentType: string;
}

export const readImageFileAsBase64 = (file: File): Promise<UploadedImageData> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;

            if (typeof result !== "string") {
                reject(new Error("Unable to read the selected image."));
                return;
            }

            const separatorIndex = result.indexOf(",");
            if (separatorIndex < 0) {
                reject(new Error("Unable to read the selected image."));
                return;
            }

            resolve({
                base64Data: result.slice(separatorIndex + 1),
                contentType: file.type || "application/octet-stream"
            });
        };

        reader.onerror = () => {
            reject(new Error("Unable to read the selected image."));
        };

        reader.readAsDataURL(file);
    });