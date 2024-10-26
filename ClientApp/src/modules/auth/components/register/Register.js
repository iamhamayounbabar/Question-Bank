import React, { Component } from "react"
import { NotificationService } from "../../../general/services/Notification.service";
import { AuthService } from '../../services/AuthService';

class Register extends Component {
    service = new AuthService();
    noti = new NotificationService();
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            disableAll: false,
            errorRegister: '',
            name: {
                value: '',
                touched: false,
                error:'',
            },
			email: {
				value: '',
				touched: false,
				error: '',
			},
            role: {
                value: '',
                touched: false,
                error:'',
            },
			password: {
				value: '',
				touched: false,
				error: '',
			},
            confirmPassword: {
                value: '',
                touched: false,
                error: '',
            },
        }
    }

    render(){
        return(
            <>
                <section className="body-sign" style={{height: 'calc(100vh - 70px)'}}>
                    <div className="center-sign" style={{paddingTop: '0px'}}>
                        <div className="panel card-sign">
                            <div className="card-body">
                            {this.state.errorRegister !== "" &&
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {this.state.errorRegister}<button type="button"onClick={() => this.setState({ errorRegister: "" })} data-bs-dismiss="alert"  className="btn-close" aria-hidden="true" aria-label="Close"></button>
                                </div>
                            }
                                <div className="form-group mb-3">
                                    <label>Name</label>
                                    <input name="name" type="text" value={this.state.name.value} className= {(this.state.name.error !== "" && this.state.name.touched ? "border-danger " : "") +"form-control form-control-lg"} disabled={this.state.disableAll} onBlur={(e) => { this.setNameTouched(); this.validateName(e.target.value); }} onChange={(e) => this.validateName(e.target.value)} />
                                    {this.state.name.error !== "" && this.state.name.touched &&
                                        <span className="text-danger">{this.state.name.error}</span>
                                    }
                                </div>

                                <div className="form-group mb-3">
                                    <label>E-mail Address</label>
                                    <input name="email" type="email" value={this.state.email.value} className= {(this.state.email.error !== "" && this.state.email.touched ? "border-danger " : "") +"form-control form-control-lg"} disabled={this.state.disableAll} onBlur={(e) => { this.setEmailTouched(); this.validateAndSetEmail(e.target.value); }} onChange={(e) => this.validateAndSetEmail(e.target.value)} />
                                    {this.state.email.error !== "" && this.state.email.touched &&
                                        <span className="text-danger">{this.state.email.error}</span>
                                    }
                                </div>

                                <div className="form-group mb-3">
                                    <label>Select Role</label>
                                    <select  class= {(this.state.role.error !== "" && this.state.role.touched ? "border-danger " : "")+"form-control form-control-lg fs-6"} value={this.state.role.value} disabled={this.state.disableAll} onBlur={(e) => { this.setRoleTouched(); this.validateRole(e.target.value); }} onChange={(e) => this.validateRole(e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Content Creator">Content Creator</option>
                                        <option value="Approver">Approver</option>
                                        <option value="Test Creator">Test Creator</option>
                                    </select>
                                    {this.state.role.error !== "" && this.state.role.touched &&
                                        <span className="text-danger">{this.state.role.error}</span>
                                    }
                                </div>

                                <div className="form-group mb-3">
                                    <label>Password</label>
                                    <input name="pwd" type="password" value={this.state.password.value} className= {(this.state.password.error !== "" && this.state.password.touched ? "border-danger " : "") + "form-control form-control-lg"} disabled={this.state.disableAll} onBlur={(e) => { this.setPasswordTouched(); this.validateAndSetPassword(e.target.value); }} onChange={(e) => this.validateAndSetPassword(e.target.value)} />
                                    {this.state.password.error !== "" && this.state.password.touched &&
                                        <span className="text-danger">{this.state.password.error}</span>
                                    }
                                </div>

                                <div className="form-group mb-3">
                                    <label>Password Confirmation</label>
                                    <input name="pwd_confirm" type="password" value={this.state.confirmPassword.value} className= {(this.state.confirmPassword.error !== "" && this.state.confirmPassword.touched ? "border-danger " : "") +"form-control form-control-lg"} disabled={this.state.disableAll} onBlur={(e) => { this.setConfirmPasswordTouched(); this.validateAndSetConfirmPassword(e.target.value); }} onChange={(e) => this.validateAndSetConfirmPassword(e.target.value)} />
                                    {this.state.confirmPassword.error !== "" && this.state.confirmPassword.touched &&
                                        <span className="text-danger">{this.state.confirmPassword.error}</span>
                                    }
                                </div>

                                <div className="row">
                                        <div className="col-sm-12 text-right">
                                            <button  type="submit" onClick={this.signup} disabled={this.state.loading || this.state.disableAll} className="btn btn-primary mt-2 w-100">
                                                {this.state.loading &&
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                }
                                                Register User
                                            </button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
		        </section>
            </>
        )
    }

    resetForm = () =>{
       let state = this.state;
       state = {
            loading: false,
            disableAll: false,
            errorRegister: "",
            name: {
                value: '',
                touched: false,
                error:'',
            },
            email: {
                value: '',
                touched: false,
                error: '',
            },
            password: {
                value: '',
                touched: false,
                error: '',
            },
            role: {
                value: '',
                touched: false,
                error:'',
            },
            confirmPassword: {
                value: '',
                touched: false,
                error: '',
            },
        }
        this.setState({...state});
    }

    validateName = (value) => {   
        let name = this.state.name;
        name.value = value;
        if (value === "") {
            name.error = 'Name is required.'
            this.setState({ name });
        }   
        else {
            name.error = '';
            this.setState({ name });
        }
    }

    setNameTouched =(value) => {
        let name = this.state.name;
        name.touched = true;
        this.setState({ name });
    }

    validateAndSetEmail = (value)=>{
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let email = this.state.email;
        email.value = value;
		if (value === ""){
			email.error = 'Email is required.';
            this.setState({ email });
        }
        else if (!re.test(value.toLowerCase())) {
			email.error='Please enter a valid email address.';
            this.setState({ email });
        }
        else {
            email.error = '';
            this.setState({ email });
        }
    }

    validateRole = (value) => {   
        let role = this.state.role;
        role.value = value;
        if (value === "") {
            role.error = 'Role is required.'
            this.setState({ role });
        }   
        else {
            role.error = '';
            this.setState({ role });
        }
    }

    setRoleTouched =(value) => {
        let role = this.state.role;
        role.touched = true;
        this.setState({ role });
    }

    validateAndSetPassword = (value) => {
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        let password = this.state.password;
        password.value = value;
        if (value === "") {
            password.error = "Password is required.";
            this.setState({ password });
        }
        else if(value.length < 8){
            password.error = "Password must be 8 characters long.";
            this.setState({ password });
        }
        else if(!re.test(value)){
            password.error = "The password must contain at least 1 upper case, 1 lower case and 1 number.";
            this.setState({ password });
        }
        else {
            password.error = "";
            this.setState({ password });
        }
    }

    validateAndSetConfirmPassword = (value) => {
        let confirmPassword = this.state.confirmPassword;
        confirmPassword.value = value;
        if (value === "") {
            confirmPassword.error = 'Confirm Password Required.';
            this.setState({ confirmPassword });
        }
        else if (value !== this.state.password.value) {
            confirmPassword.error = 'Password and Confirm password do not match.';
            this.setState({ confirmPassword });
        }
        else {
            confirmPassword.error = '';
            this.setState({ confirmPassword });
        }
    }

    setEmailTouched = () => {
		let email = this.state.email;
		email.touched = true;
		this.setState({ email });
	}

	setPasswordTouched = () => {
		let password = this.state.password;
		password.touched = true;
		this.setState({ password });
	}

    setConfirmPasswordTouched = () => {
		let confirmPassword = this.state.confirmPassword;
		confirmPassword.touched = true;
		this.setState({ confirmPassword });
	}


    signup = async () => {
        if(this.state.name.error === "" && this.state.password.error === "" 
        && this.state.email.error === "" && this.state.confirmPassword.error === ""){
            try {
                this.setState({ loading: true, disableAll: true });
                const response = await this.service.signupProcess({
                    name: this.state.name.value,
                    email: this.state.email.value,
                    password: this.state.password.value,
                    role: this.state.role.value
                });
                this.noti.sendNotification(this.noti.types.success, 'Success', response.data);
                this.resetForm();
            }
            catch (error) {
                if(error.response.status === 0){
                    this.setState({ loading: false, disableAll: false, errorRegister: "Server not responding, please try again." });
                }
                else {
                    this.setState({ errorRegister: error.response.data, loading: false, disableAll: false });
                }
            }
        }
    }
}
export default Register;

