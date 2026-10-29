import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Boulder } from '../../../models/climbing_models';
import { vGradeRange } from '../../../utils/utils';
import AddBoulderToSession from './addBoulderToSession';

export default function BoulderResults({ boulders }: { boulders: Boulder[] }) {
    const [selectedBoulder, setSelectedBoulder] = useState<Boulder | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const NAME_LIMIT = 25;
    const CREATOR_NAME_LIMIT = 15;

    const displayString = (name: string, limit: number) => {
        return name.length > limit ? `${name.slice(0, limit-3)}...` : name;
    }

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (selectedBoulder && !dialog.open) {
            dialog.showModal();
        } else if (!selectedBoulder && dialog.open) {
            dialog.close();
        }
    }, [selectedBoulder]);

    const closeAddPrompt = () => {
        setSelectedBoulder(null);
    }

    if (boulders.length === 0) return null;

    return (
        <section className="boulder-results" aria-labelledby="boulder-results-title">
            <div className="boulder-results__header">
                <h3 id="boulder-results-title">Search results</h3>
                <span className="boulder-results__count">
                    {boulders.length} {boulders.length === 1 ? 'boulder' : 'boulders'}
                </span>
            </div>

            <div className="boulder-results__table-wrap">
                <table className="boulder-results__table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col" className="boulder-results__action">
                                <span className="visually-hidden">Actions</span>
                            </th>
                            <th scope="col">Grade</th>
                            <th scope="col">Type</th>
                            <th scope="col">Created by</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boulders.map((boulder, index) => (
                            <tr key={boulder.boulder_id ?? `${boulder.nickname}-${index}`}>
                                <td className="boulder-results__name" title={boulder.nickname}>
                                    <Link to={`/sessionClimbBoulders/${boulder.boulder_id}`}>
                                        {displayString(boulder.nickname, NAME_LIMIT)}
                                    </Link>
                                </td>
                                <td className="boulder-results__action">
                                    <button
                                        type="button"
                                        className="btn btn--sm"
                                        onClick={() => setSelectedBoulder(boulder)}
                                    >
                                        Add
                                    </button>
                                </td>
                                <td>
                                    <span className="badge">{vGradeRange(boulder)}</span>
                                </td>
                                <td>{boulder.boulder_type}</td>
                                <td>
                                    <code className="boulder-results__creator">
                                        {displayString(boulder.creator_name, CREATOR_NAME_LIMIT)}
                                    </code>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <dialog
                ref={dialogRef}
                className="boulder-modal"
                aria-labelledby="boulder-modal-title"
                onClose={closeAddPrompt}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        closeAddPrompt();
                    }
                }}
            >
                <div className="boulder-modal__content">
                    <h3 id="boulder-modal-title">Add boulder</h3>
                    
                    {selectedBoulder && (
                        <AddBoulderToSession
                            boulder={selectedBoulder}
                            onClose={closeAddPrompt}
                        />
                    )}
                </div>
            </dialog>
        </section>
    )
}