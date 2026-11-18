import { useState, useEffect } from 'react'
import { getBoulderPhotos } from '../../api/boulder_photos';

import type { BoulderPhoto } from '../../models/photo_models';

export default function BoulderImages({ boulderId }: { boulderId: string }) {
    const [photos, setPhotos] = useState<BoulderPhoto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPhotos() {
            try {
                const response = await getBoulderPhotos(boulderId);
    
                if (response.ok && response.data) {
                    setPhotos(response.data);
                } else if (response.ok) {
                    setPhotos([]);
                } else {
                    setPhotos([]);
                    setError('Failed to fetch photos');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch photos');
            } finally {
    
            }
        }

        fetchPhotos();
    }, [boulderId])

    return(
        <div className="session-boulder__pictureblock">
            {error && <p style={{marginTop: '20px', color: 'red'}}>{error}</p>}
            {!error && !photos.length && <p style={{marginTop: '20px'}}>(Photo uploads coming soon...)</p>}
            {photos.map(photo => (
                <div key={photo.id} className="session-boulder__picture">
                    <img src={photo.image_url} alt={photo.caption} />
                    <p>{photo.caption}</p>
                </div>
            ))}
        </div>
    )
}