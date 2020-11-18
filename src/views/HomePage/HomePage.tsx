import React, { useState } from 'react';
import { Col, Container, DropdownItem, Row } from 'reactstrap';
import { BatchCard } from '../../components/BatchCard/BatchCard';
import { NavBar } from '../../components/NavBar/NavBar';
import reactReduxLogo from '../../assets/react-redux-logo.png';
import javaLogo from '../../assets/java-logo.png';
import RequestBatchCard from '../../components/RequestBatchCard/RequestBatchCard'
import RequestBatchCardModal from '../../components/RequestBatchCard/RequestBatchCardModal'
import PlanIntervetionModal from '../../components/PlanInterventionModal/PlanInterventionModal'

export const HomePage:React.FC<undefined> = () => {

    const [hasBatches, setHasBatches] = useState(true);
    const [showInterventionModal, setShowInterventionModal] = useState(true);

    return(
        <Container style={{height: "100vh", maxWidth: "100vw", backgroundColor:"#B9B9BA"}}>
            <NavBar>
                <DropdownItem header>Development Options</DropdownItem>
                <DropdownItem onClick={() => setHasBatches(false)}>Simulate no batches</DropdownItem>
                <DropdownItem onClick={() => setHasBatches(true)}>Simulate 3 batches</DropdownItem>
            </NavBar>

            {/* Modal for Requesting An Intervention, Will Be Moved To Batch Info Page */}
            <button onClick={() => setShowInterventionModal(!showInterventionModal)}>Temporary Test Intervention Modal (Will Go On Batch Info Page)</button>
            <PlanIntervetionModal show={showInterventionModal} setShow={setShowInterventionModal} />
            {/* Modal for Requesting An Intervention, Will Be Moved To Batch Info Page */}
            
            {hasBatches ?

            <Row className="justify-content-between">
                <Col xs="auto">
                </Col>
                <Col xs="8" className="text-left" style={{marginTop:"50px"}}>
                    
                    <h1>Your Batches:</h1>
                    <hr style={{borderTop:"2px solid #474C55"}} />
                    <p style={{color: "#474C55", fontSize:"1.2em"}}>Click to find out more...</p>
                    <br />
                    <Container>
                        <Row>
                            <Col xl="2" lg="3" md="4" sm="4" xs="6">
                                <BatchCard titlePic={reactReduxLogo} specialization="React-Redux" batchName="Batch Name" />
                            </Col>
                            <Col xl="2" lg="3" md="4" sm="4" xs="6">
                                <BatchCard titlePic={javaLogo} specialization="Java" batchName="Batch Name" />
                            </Col>
                            <Col xl="2" lg="3" md="4" sm="4" xs="6">
                                <BatchCard titlePic={reactReduxLogo} specialization="React-Redux" batchName="Batch Name" />
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col xs="auto">
                    
                </Col>
            </Row>
            :
            <><RequestBatchCard />
            <RequestBatchCardModal /></>
            
            }
        </Container>
    )
}