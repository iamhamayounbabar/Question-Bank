import React, { Component } from "react"
import { SubjectService } from "../../services/SubjectService";
import AddSubject from "../add-subject/AddSubject";
import AssignSubject from "../assign-subject/AssignSubject";


class ManageSubjects extends Component {
    service = new SubjectService();
    constructor(props){
        super(props);
        this.state = {
            subjectsList: [],
        }
    }

    componentDidMount(){
        this.loadSubjects();
    }

    loadSubjects = async() => {
        try{
            const response = await this.service.loadSubjects();
            let subjectsList = this.state.subjectsList;
            subjectsList = response.data;
            this.setState({ subjectsList });
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    subjectDeleted = (index) => {
        let subjectsList = this.state.subjectsList;
        subjectsList.splice(index, 1);
        this.setState({ subjectsList });
    }

    subjectAdded = (subject) => {
        let subjectsList = this.state.subjectsList;
        subjectsList.unshift(subject);
        this.setState({ subjectsList });
    }

    subjectUpdated = (index, subject) => {
        let subjectsList = this.state.subjectsList;
        subjectsList[index] = subject;
        this.setState({ subjectsList });
    }

    render(){
        return(
            <>
            <div className="col-md-11 col-xl-9 mx-auto">
                <div className="accordion accordion-primary" id="accordion">
                    <AddSubject subjectsList={this.state.subjectsList} 
                    onSubjectDelete={this.subjectDeleted} 
                    onSubjectAdded={this.subjectAdded} 
                    onSubjectUpdated={this.subjectUpdated}/>

                    <AssignSubject subjectsList={this.state.subjectsList}/>
                </div>
            </div>
            </>
        )
    }
}
export default ManageSubjects;

