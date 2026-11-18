import { fetchApi } from "./utils";

import type { BoulderPhoto } from "../models/photo_models";

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

export async function getBoulderPhotos(boulderId: string) {
    return fetchApi<BoulderPhoto[]>(
        `/boulders/${boulderId}/boulder_photos`
    )
}

export async function deleteBoulderPhoto(boulderId: string, photoId: string) {
    return fetchApi<undefined>(
        `/boulders/${boulderId}/boulder_photos/${photoId}`,
        { method: 'DELETE' }
    );
}