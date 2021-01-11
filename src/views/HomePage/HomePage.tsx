import React, { useState, useEffect, useCallback } from "react";
import { Col, Container, Row, Spinner } from "reactstrap";
import { BatchCard } from "../../components/BatchCard/BatchCard";
import { NavBar } from "../../components/NavBar/NavBar";
import RequestTalent from "../../components/RequestTalentModal/RequestTalent";
import RequestBatchCard from "../../components/RequestBatchCard/RequestBatchCard";
import { useSelector, useDispatch } from "react-redux";
import {
  setBatchState,
} from "../../actions/BatchCardActions";
import { Auth } from "aws-amplify";
import { axiosInstance } from "../../util/axiosConfig";
import { Store, BasicBatchData, BatchState } from '../../types';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  batches : BasicBatchData[];
}

/**
 * Will show the batches that were mapped to the logged in client. Unless they were not mapped any
 * batches. In that case, they will be shown a message which assures them that they will be mapped
 * one in the near future and can even notify the admin users with the "request batch" button.
 *
 * @param props Basic batch information. Should be pulled from the database whenever this component loads
 */
const HomePage: React.FC<Props> = ({ history }) => {
  const [hasBatches, setHasBatches] = useState(false);
  const [hasSpinner, setSpinner] = useState(false);
  const { batches } = useSelector((store : Store) => store.batchState);
  const dispatch = useDispatch();

  /**
   * This function gets all of the batch data currently in the Caliber
   *  db. It places all of the data from that endpoint into the "batch
   *  state".
   *
   * @param userId The passed in user id (currently does nothing)
   *
   * @returns This function just changes the batch state to contain
   * each currently avaiable batch in the db.
   */
  const getBatchCardData = useCallback((userEmail: string) => async () => {
    /** array to place batch data into */
    const batchArray: BatchState = {
      batches: [],
    };
    setSpinner(true);

    //get data from server based on user id that was given

    await axiosInstance().then((result) => {
      result
        .get("/client/batch/email/" + userEmail)
        .then((response: any) => {
          if (response != null) {
            //individual batch info is placed into the array from above
            for (const batchData of response.data) {
              const batchCardInfo = { ...batchData };
              batchArray.batches.push(batchCardInfo);
            }

            //if there were no batches found, then don't show any batch card data
            if (batchArray.batches.length !== 0) {
              setHasBatches(true);
            }

            //the "batch state" is set to be whatever was extracted from the db
            dispatch(setBatchState(batchArray));
          }
          setSpinner(false);
        })
        .catch((error: any) => {
          console.log(error);
          setSpinner(false);
        });
    });
  }, [dispatch]);

  /**
   * @function getBatches
   * DEVELOPER function used to retrieve mock data for display
   */

    // const getBatches = (userEmail:string) => {
    //   //gets batch data from caliber
    //   dispatch(getBatchCardData(userEmail));
    // }


  /**
   * @function getBatches
   * DEVELOPER function used to simulate having zero batches
   */

/**
*  const resetBatches = () => {
*    setHasBatches(false);
*
*    //removes batches' data / resets the batch state
*    dispatch(setBatchState(initialBatchState));
*  };
*/

  /**
   * @function getBatches
   * DEVELOPER function used to simulate having 3 batches
   */
/**  const getSimulatedBatches = () => {
*    setHasBatches(true);
*
*    //displays simulated batch data
*    setSpinner(true);
*
*    const fakeBatchArray: IBatchState = {
*      batches: [
*        { id: 1, skill: "Java React", name: "The Batchelors" },
*        { id: 2, skill: "SalesForce", name: "Ala-batch-ter" },
*        { id: 3, skill: ".NET/Microservices", name: "Some of a Batch" },
*      ],
*    };
*
*    dispatch(setBatchState(fakeBatchArray));
*
*    setSpinner(false);
*  };
*/

  //should run on page load only once
  useEffect(() => {
    (async () => {
      setSpinner(true);

      const result = await Auth.currentUserInfo();
      //if there is no AWS cognito token information at all, then redirect to the login page
      !result && history.push('/');

      //if the AWS congito token contains an email value, check for batches associated
      // with that email address
      result.attributes["email"]
        ? dispatch( getBatchCardData(result.attributes["email"]) )
        : setSpinner(false);
    })();
  }, [history, dispatch, getBatchCardData]);

  return (
    <Container style={{ minHeight: "100vh", maxWidth: "100vw" }}>
      <NavBar route="/home">
       {/* DEVELOPER items for selecting to mock batch data
       
        <DropdownItem header>Development Options</DropdownItem>
        <DropdownItem onClick={() => resetBatches()}>
          Simulate no batches
        </DropdownItem>
        <DropdownItem onClick={() => getSimulatedBatches()}>
          Simulate 3 batches
        </DropdownItem> */}
      </NavBar>

      {/* Modal for Requesting an Intervention, will be moved to batch info page */}
      {hasBatches ? (
        <Row className="justify-content-between">
          <Col md="auto"></Col>
          <Col md="8" className="text-left" style={{ marginTop: "50px" }}>
            <h1>Your Batches:</h1>
            <hr style={{ borderTop: "2px solid #474C55" }} />
            <Container>
              {/* displays spinner while loading */}
              {hasSpinner ? (
                <div className="row justify-content-center">
                  <Spinner color="info" style={{ margin: 20 }} />
                </div>
              ) : (
                <Row>
                  {
                    /* displays all of the batch cards that are mapped to the client */
                    batches?.map((element, index) => (
                      <Col xl="3" lg="4" md="5" sm="6" xs="6" key={index}>
                        <BatchCard
                          batchId={element.batchId}
                          skill={element.skill}
                          name={element.name}
                        />
                      </Col>
                    ))
                  }
                </Row>
              )}
            </Container>
          </Col>
          <Col md="auto"></Col>
        </Row>
      ) : (
        <>
          {/* displays spinner while loading */}
          {hasSpinner ? (
            <div className="row justify-content-center">
              <Spinner color="info" style={{ margin: 20 }} />
            </div>
          ) : (
            <RequestBatchCard />
          )}
        </>
      )}

          <RequestTalent />
    </Container>
  );
};

export default HomePage;
