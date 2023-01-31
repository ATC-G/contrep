import { useTable } from "react-table";
import { Col, Row } from "reactstrap";

export default function SimpleTable({columns, data}){
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({ columns, data })
    return (
        <Row>
            <Col>
                <div className="table-responsive">
                    <div className="react-bootstrap-table table-responsive">
                        <table {...getTableProps()} className="table table align-middle table-nowrap table-hover table-bg-info-light bg-white">
                            <thead>
                                {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                    <th
                                        {...column.getHeaderProps()}
                                    >
                                        {column.render('Header')}
                                    </th>
                                    ))}
                                </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.length > 0 ?
                                rows.map(row => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                        <td
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render('Cell')}
                                        </td>
                                        )
                                    })}
                                    </tr>
                                )
                                }) : <tr><td colSpan={columns.length}>No hay información disponible</td></tr>}
                            </tbody>
                            </table>
                    </div>
                </div>
            </Col>
        </Row>
    )
}