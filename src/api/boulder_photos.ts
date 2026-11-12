import { fetchApi } from "./utils";

export async function addBoulderPhoto(boulderId: string, file: File, caption: string) {
    const body = new FormData();
    body.append('boulder_photo[image]', file);
    body.append('boulder_photo[caption]', caption);

    return fetchApi<{ id: number; caption: string }>(
        `/boulders/${boulderId}/boulder_photos`, 
        {
            method: 'POST',
            body: body,
        }
    );
}