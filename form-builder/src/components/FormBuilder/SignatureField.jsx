import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import PropTypes from 'prop-types';

export function SignatureField({ onChange }) {
  const signatureRef = useRef();

  const handleClear = () => {
    signatureRef.current.clear();
    onChange(null);
  };

  const handleSave = () => {
    onChange(signatureRef.current.toDataURL());
  };

  return (
    <div className="border rounded p-2">
      <SignatureCanvas
        ref={signatureRef}
        canvasProps={{
          className: 'border w-full h-32 bg-white',
        }}
        onEnd={handleSave}
      />
      <button
        type="button" // Adicionado aqui
        onClick={handleClear}
        className="mt-2 text-sm text-blue-500"
      >
        Limpar Assinatura
      </button>
    </div>
  );
}

SignatureField.propTypes = {
  onChange: PropTypes.func.isRequired,
};