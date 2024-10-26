import React, { Component } from "react"
import { NotificationService } from "../../general/services/Notification.service";
import { QuestionTypeService } from "../services/QuestionTypeService";


class ManageQuestionType extends Component {
    qService = new QuestionTypeService();
    noti = new NotificationService();
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            questionTypeToEditId: '',
            questionType: {
                value: '',
                touched: false,
                error:''
            },
            questionTypeList: [],
        }
    }

    componentDidMount(){
        this.loadQuestionTypes();
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
                                        Add Question Type
                                    </a>
                                </h4>
                            </div>
                            <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                                <div className="card-body">
                                    <div className="form-group row">
                                        <label className="col-lg-3 control-label text-lg-end mt-3">Question Type</label>
                                        <div className="col-lg-5 mt-2">
                                            <input name="marks" type="text" className={(this.state.questionType.error !== "" && this.state.questionType.touched ? "border-danger " : "")+"form-control populate"} value={this.state.questionType.value} disabled={this.state.loading} onBlur={(e) => { this.setQuestionTypeTouched(); this.validateQuestionType(e.target.value); }} onChange={(e) => this.validateQuestionType(e.target.value)} />
                                            {this.state.questionType.error !== "" && this.state.questionType.touched &&
                                                <span className="text-danger">{this.state.questionType.error}</span>
                                            }
                                        </div>
                                        <div className="col-lg-4 mt-2">
                                            <button className="btn btn-success me-2" disabled={this.state.loading} onClick={this.addUpdateQuestionType}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            }
                                            {this.state.questionTypeToEditId === '' ? 'Add' : 'Update'}
                                            </button>
                                            {this.state.questionTypeToEditId !== '' && 
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
                                                    this.getQuestionTypesList()
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

    validateQuestionType = (value) => {   
        let questionType = this.state.questionType;
        questionType.value = value;
        if (value === "") {
            questionType.error = 'Question Type is required.'
            this.setState({ questionType });
        }   
        else {
            questionType.error = '';
            this.setState({ questionType });
        }
    }

    setQuestionTypeTouched = () => {
        let questionType = this.state.questionType;
        questionType.touched = true;
        this.setState({ questionType });
    }

    getQuestionType = () => {
        let questionTypeList = [];
        this.props.questionTypeList.forEach((questionType, i) => {
            questionType.push(
                <option key={i} value={questionType.id}>{questionType.name}</option>
            );
        });
        return questionTypeList;
    }

    addUpdateQuestionType = async () => {
        if(this.state.questionType.value !== ""){
            try{
                this.setState({ loading: true });
                if(this.state.questionTypeToEditId === ''){
                    const response = await this.qService.addQuestionType(this.state.questionType.value);
                    let questionTypeList = this.state.questionTypeList;
                    questionTypeList.unshift(response.data);
                    this.setState({ questionTypeList });
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Question Type has been added.');
                }
                else{
                    const response = await this.qService.editQuestionType(this.state.questionTypeToEditId, this.state.questionType.value);
                    let questionTypeList = this.state.questionTypeList;
                    let index = this.state.questionTypeList.findIndex(f => f.id === this.state.questionTypeToEditId);
                    questionTypeList[index] = response.data;
                    this.setState({ questionTypeList })
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Question Type has been updated.');
                }
                this.clearForm();
            }
            catch(err){
                this.setState({ loading: false });
                this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            }
        }
    }

    loadQuestionTypes = async() => {
        try{
            const response = await this.qService.loadQuestionTypes();
            let questionTypeList = this.state.questionTypeList;
            questionTypeList = response.data;
            this.setState({ questionTypeList });
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    getQuestionTypesList = () => {
        let questionTypeList = [];
        this.state.questionTypeList.forEach((questionType, i) => {
            questionTypeList.push(
                <li className="list-group-item" key={i}>
                    <div className="d-flex justify-content-between align-items-center">
                        {questionType.name}
                        <div className="">
                            <i className="fas fa-pencil-alt pointer text-primary fs-6 me-2" onClick={() => this.selectQuestionTypeForEdit(questionType.id, i)} />
                            <i className="far fa-trash-alt pointer text-danger fs-6" onClick={() => this.deleteQuestionType(questionType.id, i)}/>
                        </div>
                    </div>
                </li>
            );
        });
        return questionTypeList;
    }

    selectQuestionTypeForEdit = (id, index) => {
        let questionType = this.state.questionType;
        questionType.value = this.state.questionTypeList[index].name;
        this.setState({ questionTypeToEditId: id, questionType }); 
    }

    deleteQuestionType = async (id, index) => {
        try{
            await this.qService.deleteQuestionType(id);
            let questionTypeList = this.state.questionTypeList;
            questionTypeList.splice(index, 1);
            this.setState({ questionTypeList });
            this.noti.sendNotification(this.noti.types.success, 'Success', "QuestionType has been deleted");
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    clearForm = () => {
        let questionType = {
            value: '',
            touched: false,
            error:''
        }
        this.setState({ questionType, loading: false, questionTypeToEditId: '' });
    }
}
export default ManageQuestionType;

