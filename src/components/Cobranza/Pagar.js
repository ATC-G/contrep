import { useFormik } from "formik";
import { Button, Col, Form, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { FIELD_REQUIRED, SELECT_OPTION } from "../../constants/messages";
import Select from "react-select";
import { formaPagoOpt, metodoPagoOpt } from "../../constants/utils";

const Pagar = ({ onHandlePayment, setOpen, row, idx }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      formaPago: "",
    },
    validationSchema: Yup.object({
      formaPago: Yup.string().required(FIELD_REQUIRED),
      metodoPago: Yup.string().required(FIELD_REQUIRED),
    }),
    onSubmit: async (values) => {
      console.log(values);
      //validaciones antes de enviarlo
      onHandlePayment(row, idx, values.formaPago, values.metodoPago);
    },
  });

  return (
    <>
      <Form
        className="needs-validation"
        id="tooltipForm"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
          return false;
        }}
      >
        <h4>Seguro que deseas pagar la referencia?</h4>
        <Row>
          <Col xs="12" md="12" className="mb-3">
            <Label className="mb-0">Forma de pago</Label>
            <Select
              classNamePrefix="select2-selection"
              placeholder={SELECT_OPTION}
              options={formaPagoOpt}
              value={
                formik.values.formaPago
                  ? {
                      value: formik.values.formaPago,
                      label:
                        formaPagoOpt.find(
                          (it) => it.value === formik.values.formaPago
                        )?.label ?? "",
                    }
                  : null
              }
              onChange={(value) => {
                formik.setFieldValue("formaPago", value.value);
              }}
            />
            {formik.errors.formaPago && (
              <div className="invalid-tooltip d-block">
                {formik.errors.formaPago}
              </div>
            )}
          </Col>
          <Col xs="12" md="12">
            <Label className="mb-0">Método de pago</Label>
            <Select
              classNamePrefix="select2-selection"
              placeholder={SELECT_OPTION}
              options={metodoPagoOpt}
              value={
                formik.values.metodoPago
                  ? {
                      value: formik.values.metodoPago,
                      label:
                        metodoPagoOpt.find(
                          (it) => it.value === formik.values.metodoPago
                        )?.label ?? "",
                    }
                  : null
              }
              onChange={(value) => {
                formik.setFieldValue("metodoPago", value.value);
              }}
            />

            {formik.errors.metodoPago && (
              <div className="invalid-tooltip d-block">
                {formik.errors.metodoPago}
              </div>
            )}
          </Col>
        </Row>
        <hr />
        <div className="d-flex">
          <div className="pe-2">
            <Button color="primary" type="submit" className="me-2">
              Aceptar
            </Button>
          </div>
          <div>
            <Button
              color="light"
              type="button"
              className="me-2"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Pagar;
