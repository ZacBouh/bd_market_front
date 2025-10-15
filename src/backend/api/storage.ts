import { api } from "./api";

const STORAGE_ENDPOINT = "/storage" as const;

type ListUploadedImagesResponse = {
  data: UploadedImage[];
};

type ApiCallResult<T> = {
  request: Promise<T>;
  cancel: () => void;
  signal: AbortSignal;
};

export const listUploadedImages = (
  callback?: (images: UploadedImage[]) => unknown,
): ApiCallResult<UploadedImage[]> => {
  const controller = new AbortController();

  const request = api
    .get<ListUploadedImagesResponse>(STORAGE_ENDPOINT, { signal: controller.signal })
    .then((response) => {
      callback && callback(response.data.data);
      return response.data.data;
    });

  return {
    request,
    cancel: () => controller.abort(),
    signal: controller.signal,
  };
};

type DeleteUploadedImagesResponse = DeleteResponse;

export const deleteUploadedImages = (
  ids: number[],
  callback?: (response: DeleteUploadedImagesResponse) => unknown,
): ApiCallResult<DeleteUploadedImagesResponse | void> => {
  const controller = new AbortController();

  const request = ids.length
    ? api
        .delete<DeleteUploadedImagesResponse>(STORAGE_ENDPOINT, {
          data: { ids },
          params: { ids: ids.join(",") },
          signal: controller.signal,
        })
        .then((response) => {
          callback && callback(response.data);
          return response.data;
        })
    : Promise.resolve();

  return {
    request,
    cancel: () => controller.abort(),
    signal: controller.signal,
  };
};
