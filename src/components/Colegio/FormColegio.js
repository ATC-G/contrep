import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import {
  ERROR_SERVER,
  FIELD_REQUIRED,
  SAVE_SUCCESS,
  UPDATE_SUCCESS,
} from "../../constants/messages";
import { saveColegio, updateColegio } from "../../helpers/colegios";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import SubmitingForm from "../Loader/SubmitingForm";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function FormColegio({ item, setItem, setReloadList }) {
  const [isSubmit, setIsSubmit] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: item?.id ?? "",
      codigo: item?.codigo ?? "",
      nombre: item?.nombre ?? "",
      convenio: item?.convenio ?? "",
      extraInfo: item?.extraInfo ?? "",
      direccion: {
        calle: item?.direccion?.calle ?? "",
        numero: item?.direccion?.numero ?? "",
        codigoPostal: item?.direccion?.codigoPostal ?? "",
        colonia: item?.direccion?.colonia ?? "",
        municipioDelegacion: item?.direccion?.municipioDelegacion ?? "",
        estado: item?.direccion?.estado ?? "",
        pais: item?.direccion?.pais ?? "",
      },
      costeUnidad: item?.costeUnidad ?? "",
      costeOperador: item?.costeOperador ?? "",
      costeCliente: item?.costeCliente ?? "",
      costeZona: item?.costeZona ?? "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required(FIELD_REQUIRED),
      codigo: Yup.string().required(FIELD_REQUIRED),
      convenio: Yup.string().required(FIELD_REQUIRED),
    }),
    onSubmit: async (values) => {
      setIsSubmit(true);
      //validaciones antes de enviarlo
      //console.log(values)
      if (values.id) {
        //update
        try {
          let response = await updateColegio(values, values.id);
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
          let response = await saveColegio(values);
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
      <Row>
        <Col xs="12" md="3">
          <Label htmlFor="codigo" className="mb-0">
            Código
          </Label>
          <Input
            id="codigo"
            name="codigo"
            className={`form-control ${
              formik.errors.codigo ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.codigo}
          />
          {formik.errors.codigo && (
            <div className="invalid-tooltip">{formik.errors.codigo}</div>
          )}
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="nombre" className="mb-0">
            Nombre
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
        <Col xs="12" md="3">
          <Label htmlFor="convenio" className="mb-0">
            Convenio
          </Label>
          <Input
            id="convenio"
            name="convenio"
            className={`form-control ${
              formik.errors.convenio ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.convenio}
          />
          {formik.errors.convenio && (
            <div className="invalid-tooltip">{formik.errors.convenio}</div>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs="12" md="3">
          <Label htmlFor="calle" className="mb-0">
            Calle
          </Label>
          <Input
            id="calle"
            name="direccion.calle"
            className={`form-control ${
              formik.errors.direccion?.calle ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.direccion.calle}
          />
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="numero" className="mb-0">
            Número
          </Label>
          <Input
            id="numero"
            name="direccion.numero"
            className={`form-control ${
              formik.errors.direccion?.numero ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.direccion.numero}
          />
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="codigoPostal" className="mb-0">
            Código postal
          </Label>
          <Input
            id="codigoPostal"
            name="direccion.codigoPostal"
            className={`form-control ${
              formik.errors.direccion?.codigoPostal ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.direccion.codigoPostal}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="12" md="3">
          <Label htmlFor="colonia" className="mb-0">
            Colonia
          </Label>
          <Input
            id="colonia"
            name="direccion.colonia"
            className={`form-control ${
              formik.errors.direccion?.colonia ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.direccion.colonia}
          />
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="municipioDelegacion" className="mb-0">
            Municipio
          </Label>
          <Input
            id="municipioDelegacion"
            name="direccion.municipioDelegacion"
            className={`form-control ${
              formik.errors.direccion?.municipioDelegacion ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.direccion.municipioDelegacion}
          />
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="estado" className="mb-0">
            Estado
          </Label>
          <Input
            id="estado"
            name="direccion.estado"
            className={`form-control ${
              formik.errors.direccion?.estado ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.direccion.estado}
          />
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="pais" className="mb-0">
            País
          </Label>
          <Input
            id="pais"
            name="direccion.pais"
            className={`form-control ${
              formik.errors.direccion?.pais ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.direccion.pais}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="12" md="3">
          <Label htmlFor="costeUnidad" className="mb-0">
            Precio coste unidad
          </Label>
          <Input
            id="costeUnidad"
            name="costeUnidad"
            className={`form-control ${
              formik.errors.costeUnidad ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.costeUnidad}
          />
          {formik.errors.costeUnidad && (
            <div className="invalid-tooltip">{formik.errors.costeUnidad}</div>
          )}
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="costeOperador" className="mb-0">
            Precio coste operador
          </Label>
          <Input
            id="costeOperador"
            name="costeOperador"
            className={`form-control ${
              formik.errors.costeOperador ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.costeOperador}
          />
          {formik.errors.costeOperador && (
            <div className="invalid-tooltip">{formik.errors.costeOperador}</div>
          )}
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="costeCliente" className="mb-0">
            Precio coste cliente
          </Label>
          <Input
            id="costeCliente"
            name="costeCliente"
            className={`form-control ${
              formik.errors.costeCliente ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.costeCliente}
          />
          {formik.errors.costeCliente && (
            <div className="invalid-tooltip">{formik.errors.costeCliente}</div>
          )}
        </Col>
        <Col xs="12" md="3">
          <Label htmlFor="costeZona" className="mb-0">
            Precio coste zona
          </Label>
          <Input
            id="costeZona"
            name="costeZona"
            className={`form-control ${
              formik.errors.costeZona ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.costeZona}
          />
          {formik.errors.costeZona && (
            <div className="invalid-tooltip">{formik.errors.costeZona}</div>
          )}
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xs="12" md="12">
          <Label htmlFor="extraInfo" className="mb-0">
            Información sobre pago
          </Label>
          <CKEditor
            editor={ClassicEditor}
            data={formik.values.extraInfo}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              //console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              formik.setFieldValue("extraInfo", data);
              //console.log({ event, editor, data });
            }}
            // onBlur={(event, editor) => {
            //   console.log("Blur.", editor);
            // }}
            // onFocus={(event, editor) => {
            //   console.log("Focus.", editor);
            // }}
          />
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
