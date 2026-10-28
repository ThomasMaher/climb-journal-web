import type { Boulder } from '../../../../models/climbing_models';

export default function BoulderResults({ boulders }: { boulders: Boulder[] }) {
    return (
        <div>
            {boulders.map((boulder, idx) => (
                <div key={idx}>{boulder.nickname}</div>
            ))}
        </div>
    )
}