const MAX_VGRADE = 18;

export default function GradeSelect(props: {
  id: string;
  name: string;
  value: number | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <select id={props.id} name={props.name} onChange={props.onChange} value={props.value ?? ''}>
      <option value="">— Select —</option>
      {[...Array(MAX_VGRADE).keys()].map((k) => (
        <option key={k} value={k}>
          V{k}
        </option>
      ))}
    </select>
  );
}