import { useEffect, useState } from 'react';
import { deleteBoulderPhoto, getBoulderPhotos } from '../../api/boulder_photos';

import type { BoulderPhoto } from '../../models/photo_models';

export default function BoulderImages({ boulderId, canDeletePhotos }: { boulderId: string; canDeletePhotos: boolean }) {
    const [photos, setPhotos] = useState<BoulderPhoto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deletingPhoto, setDeletingPhoto] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchPhotos() {
            setLoading(true);
            setError(null);
            setDeleteError(null);
            setActiveIndex(0);

            try {
                const response = await getBoulderPhotos(boulderId);

                if (cancelled) return;

                if (response.ok && response.data) {
                    setPhotos(response.data);
                } else if (response.ok) {
                    setPhotos([]);
                } else {
                    setPhotos([]);
                    setError(response.error || 'Failed to load photos.');
                }
            } catch {
                if (!cancelled) {
                    setPhotos([]);
                    setError('Failed to load photos.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchPhotos();
        return () => {
            cancelled = true;
        };
    }, [boulderId]);

    const showPrevious = () => {
        setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
    };

    const showNext = () => {
        setActiveIndex((index) => (index + 1) % photos.length);
    };

    const activePhoto = photos[activeIndex];

    const handleDeletePhoto = async () => {
        if (!activePhoto || deletingPhoto || !window.confirm('Delete this photo?')) return;

        setDeletingPhoto(true);
        setDeleteError(null);

        try {
            const response = await deleteBoulderPhoto(boulderId, activePhoto.id);
            if (!response.ok) {
                setDeleteError(response.error || 'Failed to delete photo.');
                return;
            }

            const remainingPhotos = photos.filter((photo) => photo.id !== activePhoto.id);
            setPhotos(remainingPhotos);
            setActiveIndex((index) => Math.min(index, Math.max(remainingPhotos.length - 1, 0)));
        } catch {
            setDeleteError('Failed to delete photo.');
        } finally {
            setDeletingPhoto(false);
        }
    };

    return (
        <section className="photo-carousel" aria-label="Boulder photos">
            {loading ? (
                <p className="photo-carousel__message" role="status">Loading photos...</p>
            ) : error ? (
                <p className="photo-carousel__message photo-carousel__message--error" role="alert">{error}</p>
            ) : !activePhoto ? (
                <p className="photo-carousel__message">No photos yet.</p>
            ) : (
                <>
                    <div className="photo-carousel__stage" role="group" aria-roledescription="slide" aria-label={`${activeIndex + 1} of ${photos.length}`}>
                        <img
                            className="photo-carousel__image"
                            src={activePhoto.image_url}
                            alt={activePhoto.caption || `Boulder photo ${activeIndex + 1}`}
                        />
                        {canDeletePhotos && (
                            <button
                                className="photo-carousel__delete"
                                type="button"
                                onClick={handleDeletePhoto}
                                disabled={deletingPhoto}
                                aria-label="Delete photo"
                                title="Delete photo"
                            >
                                <span className="photo-carousel__trash-icon" aria-hidden="true" />
                            </button>
                        )}
                        {photos.length > 1 && (
                            <>
                                <button
                                    className="photo-carousel__arrow photo-carousel__arrow--previous"
                                    type="button"
                                    onClick={showPrevious}
                                    aria-label="Previous photo"
                                    title="Previous photo"
                                >
                                    <span className="photo-carousel__chevron photo-carousel__chevron--previous" aria-hidden="true" />
                                </button>
                                <button
                                    className="photo-carousel__arrow photo-carousel__arrow--next"
                                    type="button"
                                    onClick={showNext}
                                    aria-label="Next photo"
                                    title="Next photo"
                                >
                                    <span className="photo-carousel__chevron photo-carousel__chevron--next" aria-hidden="true" />
                                </button>
                            </>
                        )}
                    </div>
                    <div className="photo-carousel__footer">
                        <p className="photo-carousel__caption">{activePhoto.caption || 'Boulder photo'}</p>
                        <span className="photo-carousel__count" aria-live="polite">
                            {activeIndex + 1} / {photos.length}
                        </span>
                    </div>
                    {deleteError && <p className="photo-carousel__delete-error" role="alert">{deleteError}</p>}
                </>
            )}
        </section>
    );
}