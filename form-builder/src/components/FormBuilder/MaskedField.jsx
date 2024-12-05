import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';

const masks = {
  phone: '(99) 99999-9999',
  cpf: '999.999.999-99',
  cnpj: '99.999.999/9999-99',
  cep: '99999-999'
};

export function MaskedField({ type, value, onChange, className }) {
  return (
    <InputMask
      mask={masks[type]}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}

MaskedField.propTypes = {
  type: PropTypes.oneOf(Object.keys(masks)).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string
};