import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import {
  ERROR_SERVER,
  FIELD_EMAIL,
  FIELD_REQUIRED,
  SAVE_SUCCESS,
  SELECT_OPTION,
  UPDATE_SUCCESS,
} from "../../constants/messages";
import { saveRazonSocial, updateRazonSocial } from "../../helpers/razonsocial";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import SubmitingForm from "../Loader/SubmitingForm";
import Select from "react-select";
import { getColegiosList } from "../../helpers/colegios";
export default function FormRazonSocial({ item, setItem, setReloadList }) {
  //console.log(item)
  const [isSubmit, setIsSubmit] = useState(false);
  const [colegioOpt, setColegioOpt] = useState([]);

  const fetchColegios = async () => {
    try {
      const response = await getColegiosList();
      setColegioOpt(response.map((r) => ({ value: r.id, label: r.nombre })));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchColegios();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: item?.id ?? "",
      cardCode: item?.cardCode ?? "",
      nombre: item?.nombre ?? "",
      rfc: item?.rfc ?? "",
      regimen: item?.regimen ?? "",
      codigoPostal: item?.codigoPostal ?? "",
      tipo: item?.tipo ?? "",
      familia: item?.familia ?? "",
      apellido: item?.apellido ?? "",
      padre: item?.padre ?? "",
      colegioId: item?.colegioId ?? "",
      usoCFDI: item?.usoCFDI ?? "",
      email: item?.email ?? "",
      extraInfo: item?.extraInfo ?? "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required(FIELD_REQUIRED),
      rfc: Yup.string().required(FIELD_REQUIRED),
      regimen: Yup.string().required(FIELD_REQUIRED),
      codigoPostal: Yup.string().required(FIELD_REQUIRED),
      tipo: Yup.string().required(FIELD_REQUIRED),
      familia: Yup.string().required(FIELD_REQUIRED),
      apellido: Yup.string().required(FIELD_REQUIRED),
      //padre: Yup.string().required(FIELD_REQUIRED),
      colegioId: Yup.string().required(FIELD_REQUIRED),
      usoCFDI: Yup.string().required(FIELD_REQUIRED),
      email: Yup.string().email(FIELD_EMAIL).required(FIELD_REQUIRED),
    }),
    onSubmit: async (values) => {
      setIsSubmit(true);
      //validaciones antes de enviarlo
      //console.log(values)
      if (values.id) {
        //update
        try {
          let response = await updateRazonSocial(values.id, values);
          if (response) {
            toast.success(UPDATE_SUCCESS);
            setReloadList(true);
            resetForm();
          } else {
            toast.error(ERROR_SERVER);
          }
          setIsSubmit(false);
        } catch (error) {
          let message = ERROR_SERVER;
          message = extractMeaningfulMessage(error, message);
          toast.error(message);
          setIsSubmit(false);
        }
      } else {
        //save
        try {
          let response = await saveRazonSocial(values);
          if (response) {
            toast.success(SAVE_SUCCESS);
            setReloadList(true);
            resetForm();
          } else {
            toast.error(ERROR_SERVER);
          }
          setIsSubmit(false);
        } catch (error) {
          let message = ERROR_SERVER;
          message = extractMeaningfulMessage(error, message);
          toast.error(message);
          setIsSubmit(false);
        }
      }
    },
  });

  const resetForm = () => {
    setItem(null);
    formik.resetForm();
  };
  const handleChange = (value) => {
    if (value) {
      formik.setFieldValue("tipo", value.value);
    } else {
      formik.setFieldValue("tipo", "");
    }
  };

  return (
    <Form
      className="needs-validation"
      id="tooltipForm"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
        return false;
      }}
    >
      {isSubmit && <SubmitingForm />}
      {formik.values.cardCode && (
        <div className="d-flex justify-content-end">
          {formik.values.cardCode}
        </div>
      )}
      <Row>
        <Col xs="12" md="6">
          <Row>
            <Col xs="12" md="6">
              <Label htmlFor="nombre" className="mb-0">
                Razón Social
              </Label>
              <Input
                id="nombre"
                name="nombre"
                className={`form-control ${
                  formik.errors.nombre ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.nombre}
              />
              {formik.errors.nombre && (
                <div className="invalid-tooltip">{formik.errors.nombre}</div>
              )}
            </Col>
            <Col xs="12" md="6">
              <Label htmlFor="colegioId" className="mb-0">
                Colegio
              </Label>
              <Select
                classNamePrefix="select2-selection"
                placeholder={SELECT_OPTION}
                options={colegioOpt}
                value={
                  formik.values.colegioId
                    ? {
                        value: formik.values.colegioId,
                        label:
                          colegioOpt.find(
                            (it) => it.value === formik.values.colegioId
                          )?.label ?? "",
                      }
                    : null
                }
                onChange={(value) => {
                  if (value) {
                    formik.setFieldValue("colegioId", value.value);
                  } else {
                    formik.setFieldValue("colegioId", "");
                  }
                }}
                isClearable
              />
              {formik.errors.colegioId && (
                <div className="invalid-tooltip d-block">
                  {formik.errors.colegioId}
                </div>
              )}
            </Col>
            <Col xs="12" md="6">
              <Label htmlFor="rfc" className="mb-0">
                RFC
              </Label>
              <Input
                id="rfc"
                name="rfc"
                className={`form-control ${
                  formik.errors.rfc ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.rfc}
              />
              {formik.errors.rfc && (
                <div className="invalid-tooltip">{formik.errors.rfc}</div>
              )}
            </Col>
            <Col xs="12" md="6">
              <Label htmlFor="regimen" className="mb-0">
                Régimen
              </Label>
              <Input
                id="regimen"
                name="regimen"
                className={`form-control ${
                  formik.errors.regimen ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.regimen}
              />
              {formik.errors.regimen && (
                <div className="invalid-tooltip">{formik.errors.regimen}</div>
              )}
            </Col>
            <Col xs="12" md="6">
              <Label htmlFor="codigoPostal" className="mb-0">
                Código postal
              </Label>
              <Input
                id="codigoPostal"
                name="codigoPostal"
                className={`form-control ${
                  formik.errors.codigoPostal ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.codigoPostal}
              />
              {formik.errors.codigoPostal && (
                <div className="invalid-tooltip">
                  {formik.errors.codigoPostal}
                </div>
              )}
            </Col>
            <Col xs="12" md="6">
              <Label htmlFor="tipo" className="mb-0">
                Tipo
              </Label>
              <Select
                classNamePrefix="select2-selection"
                placeholder={SELECT_OPTION}
                options={[
                  { value: "Fisica", label: "Física" },
                  { value: "Moral", label: "Moral" },
                ]}
                value={
                  formik.values.tipo
                    ? { label: formik.values.tipo, value: formik.values.tipo }
                    : null
                }
                onChange={handleChange}
                isClearable
              />
              {formik.errors.tipo && (
                <div className="invalid-tooltip d-block">
                  {formik.errors.tipo}
                </div>
              )}
            </Col>
            <Col xs="12" md="6">
              <Label htmlFor="usoCFDI" className="mb-0">
                Uso CFDI
              </Label>
              <Input
                id="usoCFDI"
                name="usoCFDI"
                className={`form-control ${
                  formik.errors.usoCFDI ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.usoCFDI}
              />
              {formik.errors.usoCFDI && (
                <div className="invalid-tooltip">{formik.errors.usoCFDI}</div>
              )}
            </Col>
            <Col xs="12" md="6">
              <Label htmlFor="email" className="mb-0">
                Correo electrónico de facturación
              </Label>
              <Input
                id="email"
                name="email"
                className={`form-control ${
                  formik.errors.email ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && (
                <div className="invalid-tooltip">{formik.errors.email}</div>
              )}
            </Col>
          </Row>
        </Col>
        <Col xs="12" md="6">
          <Row>
            <Col xs="12" md="12">
              <Label htmlFor="familia" className="mb-0">
                Código Familia
              </Label>
              <Input
                id="familia"
                name="familia"
                className={`form-control ${
                  formik.errors.familia ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.familia}
              />
              {formik.errors.familia && (
                <div className="invalid-tooltip">{formik.errors.familia}</div>
              )}
            </Col>
            <Col xs="12" md="12">
              <Label htmlFor="apellido" className="mb-0">
                Apellido
              </Label>
              <Input
                id="apellido"
                name="apellido"
                className={`form-control ${
                  formik.errors.apellido ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.apellido}
              />
              {formik.errors.apellido && (
                <div className="invalid-tooltip">{formik.errors.apellido}</div>
              )}
            </Col>
            <Col xs="12" md="12">
              <Label htmlFor="padre" className="mb-0">
                Padre / Titular
              </Label>
              <Input
                id="padre"
                name="padre"
                className={`form-control ${
                  formik.errors.padre ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                value={formik.values.padre}
              />
              {formik.errors.padre && (
                <div className="invalid-tooltip">{formik.errors.padre}</div>
              )}
            </Col>
            {item?.id && (
              <Col xs="12" md="6">
                <Label htmlFor="codSap" className="mb-0">
                  Código SAP
                </Label>
                <div
                  className="form-control"
                  style={{ backgroundColor: "#eee" }}
                >
                  {formik.values?.cardCode === ""
                    ? "No Disponible"
                    : formik.values.cardCode}
                </div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <hr />
      <div className="d-flex justify-content-end">
        <Button color="success" className="btn btn-success" type="submit">
          {formik.values.id ? "Actualizar" : "Guardar"}
        </Button>
        {formik.values.id && (
          <Button
            color="link"
            type="button"
            className="text-danger"
            onClick={() => {
              setItem(null);
              resetForm();
            }}
          >
            Cancelar
          </Button>
        )}
      </div>
    </Form>
  );
}
