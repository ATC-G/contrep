import { useState, useEffect } from "react";
import moment from "moment";
import { Card, CardBody, CardTitle } from "reactstrap";
import { getSearchCaseByStatus } from "../../helpers/case";
import { months } from "../../constants/dates";
import { Link } from "react-router-dom";
import { rangeNumbers } from "../../utils/rangeNumbers";

function StaticsCase({title, type}){
    const [month, setMonth] = useState(moment().month())
    const [year, setYear] = useState(moment().year())
    const [totalCases, setTotalCases] = useState()
    const [query, setQuery] = useState({
        startDate: moment({year: year, month: month}).startOf('month').format("YYYY-MM-DD"),
        endDate: moment({year: year, month: month}).endOf('month').format("YYYY-MM-DD"),
        status: type
    }) 

    useEffect(() => {
        let isSubscribed = true;
        async function searchCaseApi(){
            let q = Object.keys(query).map(key=>`${key}=${query[key]}`).join("&")
            const response = await getSearchCaseByStatus(`?${q}`);
            setTotalCases(response.total)
            //console.log(response)
        }
        if(isSubscribed) searchCaseApi()

        return () => isSubscribed = false;

    }, [query])

    return (
        <Card>
            <CardBody>
            <CardTitle className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>{title}</div>
                    <div className="d-flex">
                        <div className="pe-2">
                            <select className="form-control" value={month} 
                                onChange={e=>{
                                    setMonth(e.target.value)
                                    setQuery(prev=>({
                                        ...prev,
                                        startDate: moment({year: year, month: e.target.value}).startOf('month').format("YYYY-MM-DD"),
                                        endDate: moment({year: year, month: e.target.value}).endOf('month').format("YYYY-MM-DD"),
                                    }))
                                }}>
                                {
                                    Array.from(Array(12).keys()).map(it => (
                                        <option value={it} key={it}>{months[it]}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <select className="form-control" value={year} 
                                onChange={e=>{
                                    setYear(e.target.value)
                                    setQuery(prev=>({
                                        ...prev,
                                        startDate: moment({year: e.target.value, month: month}).startOf('month').format("YYYY-MM-DD"),
                                        endDate: moment({year: e.target.value, month: month}).endOf('month').format("YYYY-MM-DD"),
                                    }))
                                }}
                            >
                                {
                                    rangeNumbers(moment().year()-5, moment().year()).map(it => (
                                        <option value={it} key={it}>{it}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
                
            </CardTitle>
            <div className="text-center">
                <div className="mb-4">
                {
                    type==='active' ? 
                    <i className="bx bxs-folder-open text-danger display-4" /> : 
                    <i className="bx bxs-folder text-success display-4" />
                }                
                </div>
                <h3>{totalCases}</h3>
                <p>{months[query.month-1]}</p>

                <Link
                    to="/case-list"
                    className="btn btn-primary  btn-sm"
                    >
                    View More <i className="mdi mdi-arrow-right ms-1" />
                </Link>
            </div>
            

            {/* <div className="table-responsive mt-4">
                <table className="table align-middle table-nowrap">
                <tbody>
                    <tr>
                    <td style={{ width: "30%" }}>
                        <p className="mb-0">San Francisco</p>
                    </td>
                    <td style={{ width: "25%" }}>
                        <h5 className="mb-0">1,456</h5>
                    </td>
                    <td>
                        <Progress
                        value="94"
                        color="primary"
                        className="bg-transparent progress-sm"
                        size="sm"
                        />
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <p className="mb-0">Los Angeles</p>
                    </td>
                    <td>
                        <h5 className="mb-0">1,123</h5>
                    </td>
                    <td>
                        <Progress
                        value="82"
                        color="success"
                        className="bg-transparent progress-sm"
                        size="sm"
                        />
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <p className="mb-0">San Diego</p>
                    </td>
                    <td>
                        <h5 className="mb-0">1,026</h5>
                    </td>
                    <td>
                        <Progress
                        value="70"
                        color="warning"
                        className="bg-transparent progress-sm"
                        size="sm"
                        />
                    </td>
                    </tr>
                </tbody>
                </table>
            </div> */}
            </CardBody>
        </Card>
    )
}
export default StaticsCase