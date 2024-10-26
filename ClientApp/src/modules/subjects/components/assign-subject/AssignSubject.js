import React, { Component } from "react"
import { AuthService } from "../../../auth/services/AuthService";
import { NotificationService } from "../../../general/services/Notification.service";
import { SubjectService } from "../../services/SubjectService";


class AssignSubject extends Component {
    service = new SubjectService();
    aService = new AuthService();
    noti = new NotificationService();
    constructor(props){
        super(props);
        this.state = {
            assigning: false,
            subject: {
                value: '',
                touched: false,
                error:''
            },
            user: {
                value: '',
                touched: false,
                error:''
            },
            users: [],
            assignese: []
        }
    }

    componentDidMount(){
        this.loadUsers();
        this.loadAsiggneese();
    }
    
    render(){
        return(
            <>
                <div className="row p-5">
                    <div className="card card-default">
                        <div className="card-header">
                            <h4 className="card-title m-0">
                                <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion2" data-bs-target="#collapse2">
                                    Assign Subjects
                                </a>
                            </h4>
                        </div>
                        <div id="collapse2" className="collapse show" data-bs-parent="#accordion2">
                            <div className="card-body">
                                <div className="form-group row py-3">
                                    <label className= "col-lg-3 control-label text-lg-end pt-2">Subject</label>
                                    <div className="col-lg-6">
                                        <select className= {(this.state.subject.error !== "" && this.state.subject.touched ? "border-danger " : "")+"form-control populate"} value={this.state.subject.value} disabled={this.state.assigning} onBlur={(e) => { this.setSubjectTouched(); this.validateSubject(e.target.value); }} onChange={(e) => this.validateSubject(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getSubjects()
                                            }
                                        </select>
                                        {this.state.subject.error !== "" && this.state.subject.touched &&
                                            <span className="text-danger">{this.state.subject.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className= "col-lg-3 control-label text-lg-end pt-2">Users</label>
                                    <div className="col-lg-6">
                                        <select className= {(this.state.user.error !== "" && this.state.user.touched ? "border-danger " : "")+"form-control populate"} value={this.state.user.value} disabled={this.state.assigning} onBlur={(e) => { this.setUserTouched(); this.validateUser(e.target.value); }} onChange={(e) => this.validateUser(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getUsers()
                                            }
                                        </select>
                                        {this.state.user.error !== "" && this.state.user.touched &&
                                            <span className="text-danger">{this.state.user.error}</span>
                                        }
                                    </div>
                                </div>

                                <div className="form-group row py-3">
                                    <div className="col-lg-6 mx-auto">
                                        <button className="btn btn-success me-2" disabled={this.state.assigning} onClick={this.assignSubject}>
                                            {this.state.assigning &&
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            }
                                            Assign
                                        </button>
                                    </div>
                                </div>

                                <div className="row mt-5 mb-3 position-relative">
                                    <div className="col-lg-8 mx-auto">
                                        <ul className="list-group">
                                            {
                                                this.getAssignedSubjects()
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    getUsers = () => {
        let users = [];
        this.state.users.forEach((user, i) => {
            users.push(
                <option key={i} value={user.id}>{user.name}</option>
            );
        });
        return users;
    }

    getSubjects = () => {
        let subjects = [];
        this.props.subjectsList.forEach((subject, i) => {
            subjects.push(
                <option key={i} value={subject.id}>{subject.name}</option>
            );
        });
        return subjects;
    }

    validateSubject = (value) => {   
        let subject = this.state.subject;
        subject.value = value;
        if (value === "") {
            subject.error = 'Subject is required.'
            this.setState({ subject });
        }   
        else {
            subject.error = '';
            this.setState({ subject });
        }
    }

    setSubjectTouched = () => {
        let subject = this.state.subject;
        subject.touched = true;
        this.setState({ subject });
    }

    validateUser = (value) => {   
        let user = this.state.user;
        user.value = value;
        if (value === "") {
            user.error = 'User is required.'
            this.setState({ user });
        }   
        else {
            user.error = '';
            this.setState({ user });
        }
    }

    setUserTouched = () => {
        let user = this.state.user;
        user.touched = true;
        this.setState({ user });
    }

    assignSubject = async () => {
        if(this.state.user.value !== "" && this.state.subject.value !== ""){
            try{
                this.setState({ assigning: true });
                const response = await this.service.assignSubject(this.state.user.value, this.state.subject.value);
                let assignese = this.state.assignese;
                assignese.unshift(response.data);
                this.setState({ assignese, assigning: false });
                this.noti.sendNotification(this.noti.types.success, 'Success', 'Subject has been assigned to user.');
                this.clearForm();
            }
            catch(err){
                this.setState({ assigning: false });
                this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            }
        }
    }

    loadAsiggneese = async() => {
        try{
            const response = await this.service.loadAssignedSubjects();
            let assignese = this.state.assignese;
            assignese = response.data;
            this.setState({ assignese });
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    loadUsers = async() => {
        try{
            const response = await this.aService.getAllNonAdminUsers();
            let users = this.state.users;
            users = response.data;
            this.setState({ users });
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    getSubjectsList = () => {
        let subjects = [];
        this.props.subjectsList.forEach((subject, i) => {
            subjects.push(
                <li className="list-group-item" key={i}>
                    <div className="d-flex justify-content-between align-items-center">
                        {subject.name}
                        <div className="">
                            <i className="fas fa-pencil-alt pointer text-primary fs-6 me-2" onClick={() => this.selectSubjectForEdit(subject.id, i)} />
                            <i className="far fa-trash-alt pointer text-danger fs-6" onClick={() => this.deleteSubject(subject.id, i)}/>
                        </div>
                    </div>
                </li>
            );
        });
        return subjects;
    }

    getAssignedSubjects = () => {
        let assignedSubjects = [];
        this.state.assignese.forEach((aSubject, i) => {
            assignedSubjects.push(
                <li className="list-group-item" key={i}>
                    <div className="d-flex justify-content-between align-items-center">
                        {aSubject.user.name} ({aSubject.user.email}) - {aSubject.subject.name}
                        <i className="far fa-trash-alt pointer text-danger fs-6" onClick={() => this.unassignSubject(aSubject.id, i)}/>
                    </div>
                </li>
            );
        });
        return assignedSubjects;
    }

    unassignSubject = async (id, index) => {
        try{
            await this.service.unassignSubject(id);
            let assignese = this.state.assignese;
            assignese.splice(index, 1);
            this.setState({ assignese });
            this.noti.sendNotification(this.noti.types.success, 'Success', 'Subject has been unassigned to user.');
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    clearForm = () => {
        let subject = {
            value: '',
            touched: false,
            error:''
        }
        let user = {
            value: '',
            touched: false,
            error:''
        };
        this.setState({ subject, user });
    }
}
export default AssignSubject;

