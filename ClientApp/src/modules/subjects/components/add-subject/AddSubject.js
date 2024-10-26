import React, { Component } from "react"
import { NotificationService } from "../../../general/services/Notification.service";
import { SubjectService } from "../../services/SubjectService";


class AddSubject extends Component {
    service = new SubjectService();
    noti = new NotificationService();
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            assigning: false,
            subjectToEditId: '',
            subject: {
                value: '',
                touched: false,
                error:''
            },
            subjectDropdown: {
                value: '',
                touched: false,
                error:''
            },
        }
    }

    render(){
        return(
            <>
                <div className="row p-5">
                    <div className="card card-default">
                        <div className="card-header">
                            <h4 className="card-title m-0">
                                <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                    Add Subject
                                </a>
                            </h4>
                        </div>
                        <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                            <div className="card-body">
                                <div className="form-group row">
                                    <label className="col-lg-3 control-label text-lg-end mt-3">Subject Name</label>
                                    <div className="col-lg-5 mt-2">
                                        <input name="subject" type="text" className={(this.state.subject.error !== "" && this.state.subject.touched ? "border-danger " : "")+"form-control populate"} value={this.state.subject.value} disabled={this.state.loading} onBlur={(e) => { this.setSubjectTouched(); this.validateSubject(e.target.value); }} onChange={(e) => this.validateSubject(e.target.value)} />
                                        {this.state.subject.error !== "" && this.state.subject.touched &&
                                            <span className="text-danger">{this.state.subject.error}</span>
                                        }
                                    </div>
                                    <div className="col-lg-4 mt-2">
                                        <button className="btn btn-success me-2" disabled={this.state.loading} onClick={this.addUpdateSubject}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            }
                                            {this.state.subjectToEditId === '' ? 'Add' : 'Update'}
                                        </button>
                                        {this.state.subjectToEditId !== '' && 
                                            <button className="btn btn-warning" onClick={this.clearForm}>
                                                Cancel
                                            </button>
                                        }
                                    </div>
                                </div>
                                <div className="row mt-5 mb-3 position-relative">
                                    <div className="col-lg-8 mx-auto">
                                        <ul className="list-group">
                                            {
                                                this.getSubjectsList()
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

    addUpdateSubject = async () => {
        if(this.state.subject.value !== ""){
            try{
                this.setState({ loading: true });
                if(this.state.subjectToEditId === ''){
                    const response = await this.service.addSubject(this.state.subject.value);
                    this.props.onSubjectAdded(response.data);
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Subject has been added.');
                }
                else{
                    const response = await this.service.editSubject(this.state.subjectToEditId, this.state.subject.value);
                    let index = this.props.subjectsList.findIndex(f => f.id === this.state.subjectToEditId);
                    this.props.onSubjectUpdated(index, response.data);
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Subject has been updated.');
                }
                this.clearForm();
            }
            catch(err){
                this.setState({ loading: false });
                this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            }
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

    deleteSubject = async (id, index) => {
        try{
            await this.service.deleteSubject(id);
            this.props.onSubjectDelete(index);
            this.noti.sendNotification(this.noti.types.success, 'Success', "Subject has been deleted");
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    selectSubjectForEdit = (id, index) => {
        let subject = this.state.subject;
        subject.value = this.props.subjectsList[index].name;
        this.setState({ subjectToEditId: id, subject }); 
    }

    clearForm = () => {
        let subject = {
            value: '',
            touched: false,
            error:''
        }
        this.setState({ subject, subjectToEditId: '', loading: false });
    }
}
export default AddSubject;

