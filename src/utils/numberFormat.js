import { NumericFormat } from 'react-number-format';

export const numberFormat = (number) => {

    return (
        <NumericFormat
            value={number || 0}
            displayType="text"
            prefix='$'
            thousandSeparator={true}
            allowedDecimalSeparators={true}
            fixedDecimalScale={2}
            decimalScale={2}            
        />
    )
}