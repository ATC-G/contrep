import { useState } from "react";
import { useEffect } from "react";
import { Card, CardBody, Col } from "reactstrap";
import { getAllCasesAndStatus } from "../../helpers/case";

function CasesTotalStatus(){
    const [reports, setReports] = useState([
        { title: "New cases", iconClass: "bx-news", description: 0 },
        { title: "Maintenance Cases", iconClass: "bx-archive-out", description: 0 },
        {
          title: "Close cases",
          iconClass: "bx-archive-in",
          description: 0
        },
    ])
    useEffect(() => {
        let isSubscribed = true;
        async function searchCaseStatusApi(){
            const response = await getAllCasesAndStatus(); 
            setReports([
                { title: "New cases", iconClass: "bx-news", description: response.content.statusActive },
                { title: "Maintenance Cases", iconClass: "bx-archive-out", description: response.content.statusMaintenance },
                {
                  title: "Close cases",
                  iconClass: "bx-archive-in",
                  description: response.content.statusClose
                },
            ])
        }
        if(isSubscribed) searchCaseStatusApi()

        return () => isSubscribed = false;

    }, [])

    return (
        reports.map((report, key) => (
        <Col md="4" key={"_col_" + key}>
            <Card className="mini-stats-wid">
                <CardBody>
                    <div className="d-flex">
                    <div className="flex-grow-1">
                        <p className="text-muted fw-medium">
                        {report.title}
                        </p>
                        <h4 className="mb-0">{report.description}</h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-info  align-self-center mini-stat-icon">
                        <span className="avatar-title rounded-circle bg-info ">
                        <i
                            className={
                            "bx " + report.iconClass + " font-size-24"
                            }
                        ></i>
                        </span>
                    </div>
                    </div>
                </CardBody>
            </Card>
        </Col>
        ))
        
    )
}

export default CasesTotalStatus