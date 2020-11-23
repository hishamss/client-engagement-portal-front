import React from 'react';
import { Link } from 'react-router-dom';
import { Container, DropdownItem } from 'reactstrap';
import { BatchInformation } from '../../components/BatchInformation/BatchInformation';
import { NavBar } from '../../components/NavBar/NavBar';



export const BatchInformationPage: React.FC = () => {
    return (
        <>
            <Container style={{minHeight: "100vh", maxWidth: "100vw", backgroundColor:"#E3E3E3"}}>
                <NavBar>
                    <Link to="/home">
                        <DropdownItem>Return to Client Home</DropdownItem>
                    </Link>
                </NavBar>
                <BatchInformation name="TEST"/>
            </Container>
        </>
    );
}
