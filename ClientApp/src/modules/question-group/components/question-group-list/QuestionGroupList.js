import { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { NotificationService } from "../../../general/services/Notification.service";
import { QuestionGroupService } from "../../services/QuestionGroupService";


class QuestionGroupList extends Component{
    qGroupService = new QuestionGroupService();
    noti = new NotificationService();
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            questionGroupList: [],
        }
    }

    componentDidMount(){
        this.loadQuestionGroups();
    }

    render(){
        return(
            <>
            <div className="col-md-12 col-xl-12 mx-auto mt-4">
                <div className="accordion accordion-primary" id="accordion">
                    <div className="row">
                        <div className="card card-default">
                            <div className="card-header">
                                <h4 className="card-title m-0">
                                    <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                        List Of Questions
                                    </a>
                                </h4>
                            </div>
                            <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col text-end">
                                            <NavLink className="btn btn-primary" to="/dashboard/question-group">Add Question Group</NavLink>
                                        </div>
                                    </div>
                                    <div className="row mt-2 mb-3">
                                        <div className="col-lg-12">
                                            <table className="table table-sm table-bordered">
                                                <thead className="table-info text-center">
                                                    <tr>
                                                        <th>Organization</th>
                                                        <th>Title</th>
                                                        <th>Body</th>
                                                        <th>Created By</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.getQuestionGroupList()
                                                    } 
                                                    {this.state.questionGroupList.length === 0 && !this.state.loading &&
                                                        <tr>
                                                            <td colSpan={6} className="text-center">No records found</td>
                                                        </tr>
                                                    }
                                                    {this.state.loading && 
                                                        <tr>
                                                            <td colSpan={6} className="text-center">Loading...</td>
                                                        </tr>
                                                    }                                            
                                                </tbody>
                                            </table>
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

    loadQuestionGroups = async () => {
        try{
            this.setState({ loading: true });
            const response = await this.qGroupService.getQuestionGroups();
            this.setState({ questionGroupList: response.data, loading: false });
        }
        catch(error){
            this.setState({ loading: false });
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load Question Group.');
        }
    }

    getQuestionGroupList = () => {
        let questionGroupList = [];
        this.state.questionGroupList.forEach((q, i) => {
            questionGroupList.push(
                <tr key={i}>
                    <td>{q.organization.name}</td>
                    <td>{q.title}</td>
                    {!q.body && <td>N.A</td>}
                    {q.body && <td dangerouslySetInnerHTML={{__html: q.body}}></td>}
                    <td>{q.user.name}</td>
                    <td className="text-center">
                        <Link to={'/dashboard/edit-question-group/' + q.id}><i className="fas fa-pencil-alt pointer text-primary fs-6 me-2" /></Link>
                        <i className="far fa-trash-alt pointer text-danger fs-6 me-2" onClick={() => this.deleteQuestionGroup(q.questionGroupId, i)}/>
                        <Link title="Add Question using this question group" to={'/dashboard/add-question/' + q.questionGroupId}><i className="fas fa-plus pointer text-success fs-6" /></Link>
                    </td>
                </tr>
            );
        });
        return questionGroupList;
    }

    deleteQuestionGroup = async (id, index) => {
        try{
            await this.qGroupService.deleteQuestionGroups(id);
            let questionGroupList = this.state.questionGroupList;
            questionGroupList.splice(index, 1);
            this.setState({ questionGroupList });
            this.noti.sendNotification(this.noti.types.success, 'Success', "Question Group has been deleted");
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }
}
export default QuestionGroupList;