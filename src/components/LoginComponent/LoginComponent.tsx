import React, { useState, useEffect } from "react";
import userThumb from "../../assets/user-thumb.png";
import passThumb from "../../assets/pass-thumb.png";
import "../../scss/loginStyles.scss";
import ceplogo2 from "../../assets/engagementPortalLogo.svg";
import { Spinner } from "reactstrap";
import { IUserAdmin, IUserClient } from "../../_reducers/UserReducer";
import { useDispatch } from 'react-redux';
import { adminLogin, clientLogin } from '../../actions/UserActions';
import firebase from 'firebase/app'
import 'firebase/auth'

import { useHistory } from "react-router-dom";
import { axiosInstance } from "../../util/axiosConfig";

interface ILoginProps {
    loginType?: string;
}

/**
 * @function LoginComponent
 * Component that allows login functionality. Takes in an email and password.
 *
 * @param props (DEPRECATED USAGE) Informs whether this component is rendered on the admin login or the client login.
 */
export const LoginComponent: React.FC<ILoginProps> = (props: ILoginProps) => {

    const [spinner, setSpinner] = useState(false);
    const [loginMsg, setLoginMsg] = useState<string>("");

    const dispatch = useDispatch();
    const history = useHistory();

    /**
     * @function handleSubmit
     * Handles authentication after the user presses the login button.
     * @async
     * Makes a call to AWS Cognito to authenticate login details,
     *  then makes a call to the API gateway to retrieve user info.
     *
     * @param event contains the click event that calls this function.
     */
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setSpinner(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false)
            event.stopPropagation();

        try {
            const loginCredentials = {
                email: form["email"].value,
                password: form["password"].value
            }

            // const user = await Auth.signIn(loginCredentials.email, loginCredentials.password); // user.attributes.email contains the user email

            const user = await firebase
                .auth()
                .signInWithEmailAndPassword(loginCredentials.email, loginCredentials.password);
            console.log(user);

            checkCurrentUser();

        } catch (error) {
            setSpinner(false);
            setLoginMsg(error.message);
        }
    }

    const checkCurrentUser = () => {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                firebase.auth().currentUser?.getIdTokenResult(true).then((idTokenResult) => {
                    // Confirm the user is an Admin.
                    // console.log(idTokenResult.claims);
                    if (idTokenResult.claims.role) {
                        //no api for admin by email
                        const statefulClient: IUserAdmin = {
                            email: idTokenResult.claims.email || "",
                            firstName: "HardcodedFirstName",
                            lastName: "HardcodedLastName",
                            role: "admin"
                        }
        
                        dispatch(adminLogin(statefulClient));
        
                        // Show admin UI.
                        history.replace("/admin")
        
                        // SHOULD only be role: admin if admin, ELSE if client role will not exist
                        // console.log(idTokenResult)
                    } else {
        
                        axiosInstance()
                            .then((i) => i.get('/client/email/' + idTokenResult.claims.email)
                                .then((r) => {
                                    const statefulClient: IUserClient = {
                                        //retrieved from firebase
                                        email: idTokenResult.claims.email || "",
                                        //unfortunately cognito stores this, NOT backend db
                                        firstName: "HardcodedFirstName",
                                        lastName: "HardcodedLastName",
                                        //retrieved from backend db
                                        companyName: r.data.companyName,
                                        role: "client"
                                    }
                                    console.log(r)
                                    dispatch(clientLogin(statefulClient));
                                    //Show client UI
                                    history.replace("/home")
        
                                }))
                    }
                })
                    .catch((error) => {
                        setSpinner(false);
                        console.log(error.response.status);
                    })
            } 
        });
    }

    // useEffect(() => {
    //     checkCurrentUser();
    // })

    return (
        <>

            <form onSubmit={handleSubmit} className="login-form">

                <div style={{ maxHeight: "90%" }}>
                    <div style={{ position: "relative", textAlign: "center" }}>
                        <div className="login-header">
                            Client Engagement Portal
                        </div>
                        <div className="cep-logo-area">
                            <img src={ceplogo2} alt="cep-logo" className="cep-logo" />
                        </div>
                    </div>

                    <div style={{ color: "#FF0000" }}>{loginMsg}</div>

                    <div style={{ position: "relative" }}>
                        <input type="email" required className="form-control" name="email" placeholder="E-mail"
                            style={new CEPLoginInputStyle()} />
                        <div style={{ position: "absolute", top: "45%", left: "21%", transform: "translate(-50%, -50%)" }}>
                            <img src={userThumb} alt="email thumbnail" className="userthumbcheck" />
                        </div>
                    </div>

                    <div style={{ position: "relative" }}>
                        <input type="password" required className="form-control" name="password" placeholder="Password"
                            style={new CEPLoginInputStyle()} />
                        <div style={{ position: "absolute", top: "45%", left: "21%", transform: "translate(-50%, -50%)" }}>
                            <img src={passThumb} alt="password thumbnail" className="passthumbcheck" />
                        </div>
                    </div>

                    <button className="test2 login-submit" type="submit">
                        Login
                            {spinner ? <Spinner color="info" className="spinner" /> : <span />}
                    </button>
                </div >
            </form >
        </>
    );
};


export class CEPLoginInputStyle implements React.CSSProperties {
    lineHeight: number;
    paddingLeft: string;
    borderRadius: string;
    margin: string;
    width: string;
    display: string;
    boxShadow: string;

    constructor() {
        this.lineHeight = 2.2;
        this.paddingLeft = "30px";
        this.borderRadius = "5px";
        this.margin = "2px";
        this.width = "70%";
        this.display = "inline-block";
        this.boxShadow = "inset 1px 2px 0 0 #ddd, inset 0 4px 0 0 #eee, inset 2px 6px 0 0 #fef";
    }
}
