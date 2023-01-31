import "react-datepicker/dist/react-datepicker.css";
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { InputGroup } from "reactstrap";

function SimpleDate({date, setDate, element, options, placeholder}){


    return (
        <InputGroup>
            <Flatpickr
                className="form-control d-block"
                placeholder={placeholder ? placeholder : 'dd-MM-YYYY'}
                options={{
                    ...options,
                    altInput: true,
                    altFormat: "d-m-Y",
                    dateFormat: "d-m-Y",
                }}
                value={date}
                onChange={date=>setDate(date, element)}
            />
        </InputGroup>
    )

}

export default SimpleDate