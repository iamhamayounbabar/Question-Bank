import React, { Component } from "react"
import { Link } from "react-router-dom";
import { AuthService } from '../../services/AuthService';

class Login extends Component {
    service = new AuthService();
	constructor(props){
		super(props);
		this.state = {
            loading: false,
            disableAll: false,
            errorLogin: '',
			email: {
				value: '',
				touched: false,
				error: ''
			},
			password: {
				value: '',
				touched: false,
				error: ''
			},
			loadingPage: true
		}
	}

	render(){
		if(this.state.loadingPage){
            this.service.isAuthenticated().then(res => {
                window.location.replace('/dashboard');
            }).catch(err => {
                this.setState({ loadingPage: false });
            });
            return;
        }


		return (
			<>
				<section className="body-sign">
					<div className="center-sign">
						<div className="panel card-sign">
							<div className="d-flex justify-content-between">
								<Link href="/" className="logo float-left">
									<img src="/logo.png" height="80" alt="Logo" />
								</Link>
								<div className="card-title-sign mt-3 text-end">
									<h2 className="title text-uppercase font-weight-bold m-0"><i className="bx bx-user-circle me-1 text-6 position-relative top-5"></i> Sign In</h2>
								</div>
							</div>
							<div className="card-body">
								{this.state.errorLogin !== "" &&
									<div className="alert alert-danger alert-dismissible fade show" role="alert">
										{this.state.errorLogin}<button type="button"onClick={() => this.setState({ errorLogin: "" })} data-bs-dismiss="alert"  className="btn-close" aria-hidden="true" aria-label="Close"></button>
									</div>
								}
								<div className="form-group mb-3">
									<label>Email</label>
									<div className="input-group">
										<input name="email" type="text" className= {(this.state.email.error !== "" && this.state.email.touched ? "border-danger " : "") + "form-control form-control-lg" } disabled={this.state.disableAll} onBlur={(e) => { this.setEmailTouched(); this.validateAndSetEmail(e.target.value); }} onChange={(e) => this.validateAndSetEmail(e.target.value)}/>
										<span className={(this.state.email.error !== "" && this.state.email.touched ? "border-danger " : "") + "input-group-text"}>
											<i className={(this.state.email.error !== "" && this.state.email.touched ? "text-danger " : "") + "bx bx-user text-4"}></i>
										</span>
									</div>
									{this.state.email.error !== "" && this.state.email.touched &&
										<span className="text-danger">{this.state.email.error}</span>
									}
								</div>

								<div className="form-group mb-3">
									<div className="clearfix">
										<label className="float-left">Password</label>
										<a href="pages-recover-password.html" className="float-end">Lost Password?</a>
									</div>
									<div className="input-group">
										<input name="pwd" type="password" className= {(this.state.password.error !== "" && this.state.password.touched ? "border-danger " : "") +"form-control form-control-lg"} disabled={this.state.disableAll} onBlur={(e) => { this.setPasswordTouched(); this.validateAndSetPassword(e.target.value); }} onChange={(e) => this.validateAndSetPassword(e.target.value)}/>
										<span className={(this.state.password.error !== "" && this.state.password.touched ? "border-danger " : "") +"input-group-text"}>
											<i className={(this.state.password.error !== "" && this.state.password.touched ? "text-danger " : "") +"bx bx-lock text-4"}></i>
										</span>
									</div>
									{this.state.password.error !== "" && this.state.password.touched &&
										<span className="text-danger">{this.state.password.error}</span>
									}
								</div>

								<div className="row pb-4">
									<div className="col-sm-12 text-end">
										<button type="submit" onClick={this.login} disabled={this.state.loading || this.state.disableAll} className="btn btn-primary mt-2 w-100">
											{this.state.loading &&
												<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
											}
											Sign In
										</button>
									</div>
								</div>
							</div>
						</div>

						<p className="text-center text-muted mt-3 mb-3">&copy; Copyright 2023. All Rights Reserved.</p>
					</div>
				</section>
			</>
		)
	}

	validateAndSetEmail = (value)=>{
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let email = this.state.email;
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
			email.value = value;
            this.setState({ email });
        }
    }

	validateAndSetPassword = (value) => {
		let password = this.state.password;
        if (value === "") {
			password.error = 'Password is required.';
            this.setState({ password });
        }
        else {
			password.error = ''
			password.value = value;
            this.setState({ password });
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

	login = async () => {
        if (this.state.email.error === "" && this.state.password.error === "") {
            try {
                this.setState({ loading: true });
                const response = await this.service.loginProcess({
                    email: this.state.email.value,
                    password: this.state.password.value
                });

                localStorage.setItem("ASPNetAuthToken", JSON.stringify(response.data));
                window.location.reload();
            }
            catch (error) {
                if (error.response.status === 0) {
                    this.setState({ loading: false, errorLogin: "Server not responding, please try again." });
                }
                else {
                    this.setState({ errorLogin: error.response.data, loading: false });
                }
            }
        }
    }

}

export default Login;
