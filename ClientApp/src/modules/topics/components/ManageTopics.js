import React, { Component } from "react"
import { AuthService } from "../../auth/services/AuthService";
import { NotificationService } from "../../general/services/Notification.service";
import { TopicService } from "../services/TopicService";
import { SubjectService } from "../../subjects/services/SubjectService";


class ManageTopics extends Component {
    service = new TopicService();
    sService = new SubjectService();
    aService = new AuthService();
    noti = new NotificationService();
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            topic: {
                value: '',
                touched: false,
                error:''
            },
            parentTopic: {
                value: '',
                touched: false,
                error:''
            },
            subject: {
                value: '',
                touched: false,
                error:''
            },
            subjectsList: [],
            topicsList: [],
        }
    }

    componentDidMount(){
        this.loadTopics();
        this.loadSubjects();
    }
    
    render(){
        return(
            <>
            <div className="col-md-11 col-xl-9 mx-auto">
                <div className="accordion accordion-primary" id="accordion">
                    <div className="row p-5">
                        <div className="card card-default">
                            <div className="card-header">
                                <h4 className="card-title m-0">
                                    <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                        Add Topic
                                    </a>
                                </h4>
                            </div>
                            <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                                <div className="card-body">
                                    <div className="form-group row py-3">
                                        <label className= "col-lg-3 control-label text-lg-end pt-2">Subject</label>
                                        <div className="col-lg-6">
                                            <select className= {(this.state.subject.error !== "" && this.state.subject.touched ? "border-danger " : "")+"form-control populate"} value={this.state.subject.value} disabled={this.state.loading} onBlur={(e) => { this.setSubjectTouched(); this.validateSubject(e.target.value); }} onChange={(e) => this.validateSubject(e.target.value)}>
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
                                        <label className= "col-lg-3 control-label text-lg-end pt-2">Parent Topic</label>
                                        <div className="col-lg-6">
                                            <select className= {(this.state.parentTopic.error !== "" && this.state.parentTopic.touched ? "border-danger " : "")+"form-control populate"} value={this.state.parentTopic.value} disabled={this.state.loading} onBlur={(e) => { this.setParentTopicTouched(); this.validateParentTopic(e.target.value); }} onChange={(e) => this.validateParentTopic(e.target.value)}>
                                                <option value="">---Select---</option>
                                                {
                                                    this.getTopics()
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-lg-3 control-label text-lg-end mt-3">Topic Name</label>
                                        <div className="col-lg-5 mt-2">
                                            <input name="marks" type="text" className={(this.state.topic.error !== "" && this.state.topic.touched ? "border-danger " : "")+"form-control populate"} value={this.state.topic.value} disabled={this.state.loading} onBlur={(e) => { this.setTopicTouched(); this.validateTopic(e.target.value); }} onChange={(e) => this.validateTopic(e.target.value)} />
                                            {this.state.topic.error !== "" && this.state.topic.touched &&
                                                <span className="text-danger">{this.state.topic.error}</span>
                                            }
                                        </div>
                                        <div className="col-lg-4 mt-2">
                                            <button className="btn btn-success me-2" disabled={this.state.loading} onClick={this.addTopic}>
                                                {this.state.loading &&
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                }
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row mt-5 mb-3 position-relative">
                                        <div className="col-lg-8 mx-auto">
                                            <ul className="list-group">
                                                {
                                                    this.getTopicsList()
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }

    loadSubjects = async() => {
        try{
            const response = await this.sService.loadSubjects();
            let subjectsList = this.state.subjectsList;
            subjectsList = response.data;
            this.setState({ subjectsList });
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    getSubjects = () => {
        let subjects = [];
        this.state.subjectsList.forEach((subject, i) => {
            subjects.push(
                <option key={i} value={subject.id}>{subject.name}</option>
            );
        });
        return subjects;
    }

    getTopics = () => {
        let topics = [];
        this.state.topicsList.filter(f => f.subjectId === this.state.subject.value).forEach((topic, i) => {
            topics.push(
                <option key={i} value={topic.id}>{topic.name}</option>
            );
        });
        return topics;
    }

    validateTopic = (value) => {   
        let topic = this.state.topic;
        topic.value = value;
        if (value === "") {
            topic.error = 'Topic Name is required.'
            this.setState({ topic });
        }   
        else {
            topic.error = '';
            this.setState({ topic });
        }
    }

    setTopicTouched = () => {
        let topic = this.state.topic;
        topic.touched = true;
        this.setState({ topic });
    }

    validateParentTopic = (value) => {   
        let parentTopic = this.state.parentTopic;
        parentTopic.value = value;
        this.setState({ parentTopic });
    }

    setParentTopicTouched = () => {
        let parentTopic = this.state.parentTopic;
        parentTopic.touched = true;
        this.setState({ parentTopic });
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

    addTopic = async () => {
        if(this.state.topic.value !== ""){
            try{
                this.setState({ loading: true });
                const response = await this.service.addTopic(this.state.topic.value, this.state.parentTopic.value, this.state.subject.value);
                let topicsList = this.state.topicsList;
                topicsList.unshift(response.data);
                this.setState({ topicsList, loading: false });
                this.noti.sendNotification(this.noti.types.success, 'Success', 'Topic has been added.');
                this.clearForm();
            }
            catch(err){
                this.setState({ loading: false });
                this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            }
        }
    }

    loadTopics = async() => {
        try{
            const response = await this.service.loadTopics();
            let topicsList = this.state.topicsList;
            topicsList = response.data;
            this.setState({ topicsList });
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    getTopicsList = () => {
        let topicsList = [];
        this.state.topicsList.forEach((topic, i) => {
            topicsList.push(
                <li className="list-group-item" key={i}>
                    <div className="d-flex justify-content-between align-items-center">
                        {topic.name} {topic.parentTopicNavigation ? (' - ' + topic.parentTopicNavigation.name) : ''} - {topic.subject.name}
                        <div className="">
                            <i className="far fa-trash-alt pointer text-danger fs-6" onClick={() => this.deleteTopic(topic.id, i)}/>
                        </div>
                    </div>
                </li>
            );
        });
        return topicsList;
    }

    deleteTopic = async (id, index) => {
        try{
            await this.service.deleteTopic(id);
            let topicsList = this.state.topicsList;
            topicsList.splice(index, 1);
            this.setState({ topicsList });
            this.noti.sendNotification(this.noti.types.success, 'Success', "Topic has been deleted");
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    clearForm = () => {
        let topic = {
            value: '',
            touched: false,
            error:''
        }
        let subject = {
            value: '',
            touched: false,
            error:''
        };
        let user = {
            value: '',
            touched: false,
            error:''
        };
        this.setState({ topic, user, subject });
    }
}
export default ManageTopics;

