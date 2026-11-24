import { fetchApi } from './utils';

import type { TagModel } from '../models/climbing_models';

export async function getAllTags() {
    return fetchApi<TagModel[]>('/tags');
}