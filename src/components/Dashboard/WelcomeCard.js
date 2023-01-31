import { Row, Col, Card, CardBody } from "reactstrap"

import avatar1 from "../../assets/images/users/avatar-1.jpg"
import profileImg from "../../assets/images/profile-img.png"
import useLoguedUser from "../../hooks/useLoguedUser"

const WelcomeCard = () => {
  const userLogued  = useLoguedUser();

  return (
    <>
      <Card className="overflow-hidden">
        <div className="bg-primary bg-soft">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary">Welcome Back !</h5>
                <p>Plannex Dashboard</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row>
            <Col sm="12"> 
              <div className="avatar-md profile-user-wid mb-4">
                <img
                  src={avatar1}
                  alt=""
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15">{'----'}</h5>
              <p className="text-muted mb-0">{'-'}</p>
              {/* <h5 className="font-size-15">{userLogued?.name ?? '----'}</h5>
              <p className="text-muted mb-0">{userLogued?.Role?.name ?? '-'}</p> */}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}
export default WelcomeCard
