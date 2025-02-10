interface InputProps {
  placeholder: string;
  type: string;
  reference: any;
}

export function Input({ placeholder, reference, type }: InputProps) {
  return (
    <div>
      <input
        placeholder={placeholder}
        type={type}
        ref={reference}
        className="rounded"
      />
      ;
    </div>
  );
}
