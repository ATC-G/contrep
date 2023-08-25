import { useEffect } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Container, InputGroup, Row } from "reactstrap";
import FormAlumnos from "../../components/Alumnos/FormAlumnos";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import CellActions from "../../components/Tables/CellActions";
import Paginate from "../../components/Tables/Paginate";
import SimpleTable from "../../components/Tables/SimpleTable";
import { ERROR_SERVER } from "../../constants/messages";
import { getAlumnosList, getMultipleListAlumnos } from "../../helpers/alumnos";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { numberFormat } from "../../utils/numberFormat";

function Alumnos() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(10);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [reload, setReload] = useState(false);
  const [searchBy, setSearchBy] = useState("");
  const [colegioOpt, setColegioOpt] = useState([]);
  const [razonSocialOpt, setRazonSocialOpt] = useState([]);
  const [firstTime, setFirstTime] = useState(true);
  const [query, setQuery] = useState({
    PageNumber: 1,
    PageSize: totalRegistros,
  });

  const fetchAlumnosListPaginadoApi = async () => {
    setLoading(true);
    console.log(query);
    let q = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join("&");
    try {
      const response = await getAlumnosList(`?${q}`);
      //console.log(response)
      setItems(response.data);
      setTotalPaginas(response.totalPages);
      setTotalRegistros(response.totalRecords);
      setLoading(false);
    } catch (error) {
      let message = ERROR_SERVER;
      message = extractMeaningfulMessage(error, message);
      toast.error(message);
      setItems([]);
      setTotalPaginas(0);
      setTotalRegistros(10);
      setLoading(false);
    }
  };

  const fecthDataApis = async () => {
    const queryObj = {
      razonSocial: `?PageNumber=0&PageSize=2000`,
      alumnos: `?${Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join("&")}`,
    };
    try {
      const response = await getMultipleListAlumnos(queryObj);
      //console.log(response);
      setRazonSocialOpt(
        response[0].data.map((rz) => ({
          label: `${rz.familia} - ${rz.apellido}`,
          value: rz.id,
          codigo: rz.rfc,
          apellido: rz.apellido,
          familia: rz.familia,
        }))
      );
      setColegioOpt(
        response[1].map((r) => ({
          value: r.id,
          label: r.nombre,
          codigo: r.codigo,
        }))
      );
      //alumnos
      setItems(response[2].data);
      setTotalPaginas(response[2].totalPages);
      setTotalRegistros(response[2].totalRecords);
      setLoading(false);

      setFirstTime(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fecthDataApis();
    setFirstTime(false);
  }, []);

  useEffect(() => {
    if (!firstTime) {
      fetchAlumnosListPaginadoApi();
    }
  }, [query]);
  useEffect(() => {
    if (reload) {
      fetchAlumnosListPaginadoApi();
      setReload(false);
    }
  }, [reload]);

  const editAction = (row) => {
    console.log(row);
    console.log(razonSocialOpt);
    console.log(
      razonSocialOpt.filter((it) => it.value === row.original.razonSocial)
    );
    setItem(row.original);
    setOpenAccordion(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const columns = [
    {
      Header: "Colegio",
      accessor: "colegio", // accessor is the "key" in the data
    },
    {
      Header: "Cod. Familia",
      accessor: "razonSocial",
      Cell: ({ value }) => {
        return razonSocialOpt.find((rz) => rz.value === value)?.familia;
      },
    },
    {
      Header: "Apellido Familia",
      accessor: "apellidos",
      Cell: ({ row, value }) =>
        razonSocialOpt.find((rz) => rz.value === row.original.razonSocial)
          ?.apellido,
    },
    {
      Header: "Nombre",
      accessor: "nombre",
      Cell: ({ row, value }) => `${value} ${row.original.apellidos}`,
    },
    {
      Header: "Mensualidad",
      accessor: "mensualidad",
      Cell: ({ value }) => numberFormat(value),
    },
    {
      Header: "Correo electrónico",
      accessor: "email",
    },
    {
      id: "acciones",
      Header: "Acciones",
      Cell: ({ row }) => (
        <>
          <CellActions edit={{ allow: true, action: editAction }} row={row} />
        </>
      ),
      style: {
        width: "10%",
      },
    },
  ];

  const handlePageClick = (page) => {
    setQuery((prev) => ({
      ...prev,
      PageNumber: page,
    }));
  };

  const handleChangeLimit = (limit) => {
    setQuery((prev) => ({
      ...prev,
      PageNumber: 0,
      PageSize: limit,
    }));
  };

  const buscarAlumno = () => {
    let queryCopy = {
      PageNumber: 0,
      PageSize: 10,
    };
    queryCopy = {
      ...queryCopy,
      parameter: searchBy,
    };
    setQuery(queryCopy);
  };

  const cardChildren = (
    <Row>
      <Col>
        <FormAlumnos
          item={item}
          setItem={setItem}
          setReloadList={setReload}
          colegioOpt={colegioOpt}
          razonSocialOpt={razonSocialOpt}
        />
      </Col>
    </Row>
  );

  const cardHandleList = (
    <>
      <div className="d-flex justify-content-end">
        <div className="mb-1">
          <InputGroup>
            <input
              type="text"
              id="search"
              className="form-control"
              placeholder="Buscar alumno"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            />
            <div className="input-group-append" onClick={buscarAlumno}>
              <Button type="button" color="primary">
                <i className="bx bx-search-alt-2" />
              </Button>
            </div>
          </InputGroup>
        </div>
      </div>
      {loading ? (
        <Row>
          <Col xs="12" xl="12">
            <SimpleLoad />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xl="12">
            <SimpleTable columns={columns} data={items} />
          </Col>
          {items.length > 0 && (
            <Paginate
              page={query.PageNumber}
              totalPaginas={totalPaginas}
              totalRegistros={totalRegistros}
              handlePageClick={handlePageClick}
              limit={query.PageSize}
              handleChangeLimit={handleChangeLimit}
            />
          )}
        </Row>
      )}
    </>
  );

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={"Alumnos"} breadcrumbItem={"Alumnos"} />

          <Row>
            <Col xs="12" lg="12">
              <CardBasic
                title="Alumnos"
                children={cardChildren}
                openAccordion={openAccordion}
                setOpenAccordion={setOpenAccordion}
              />
            </Col>
          </Row>

          <Row className="pb-5">
            <Col lg="12">{cardHandleList}</Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default withRouter(Alumnos);
