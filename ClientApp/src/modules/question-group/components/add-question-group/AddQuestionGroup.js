import { Component } from "react";
import { NavLink } from "react-router-dom";
import { QuestionGroupService } from "../../services/QuestionGroupService";
import { NotificationService } from "../../../general/services/Notification.service";
import { OrganizationService } from "../../../organization/services/OrganizationService";
import CustomEditor from "../../../general/components/CustomEditor";


class AddQuestionGroup extends Component{
    qGroupService = new QuestionGroupService();
    oService = new OrganizationService();
    noti = new NotificationService();

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            organization: {
                value: '',
                touched: false,
                error:''
            },
            questionGroupId: {
                value: '',
                touched: false,
                error:'',
            },
            title: {
                value: '',
                touched: false,
                error:''
            },
            body: {
                value: '',
                touched: false,
                error: '',
            },
            questionGroups: [],
            organizations: [],
        }
    }

    componentDidMount(){
        this.loadOrganizations();
    }

    resetForm = ()=> {
        let state = {
            organization: {
                value: '',
                touched: false,
                error:''
            },
            questionGroupId: {
                value: '',
                touched: false,
                error:''
            },
            title: {
                value: '',
                touched: false,
                error:''
            },
            body: {
                value: '',
                touched: false,
                error: '',
            },
        }
        this.setState({...state});
    }

    render(){
        return(
            <>
                <div className="accordion accordion-primary" id="accordion">
                    <div className="card card-default">
                        <div className="card-header">
                            <h4 className="card-title m-0">
                                <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                    Add Question Group
                                </a>
                            </h4>
                        </div>
                        <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                            <div className="card-body">
                            <div className="row">
                                        <div className="col text-end">
                                            <NavLink className="btn btn-primary" to="/dashboard/question-groups-list">Question Group List</NavLink>
                                        </div>
                                    </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Organization</label>
                                    <div className="col-lg-6">
                                        <select className={(this.state.organization.error !== "" && this.state.organization.touched ? "border-danger " : "")+"form-control populate"} value={this.state.organization.value} disabled={this.state.disableAll} onBlur={(e) => { this.setOrganizationTouched(); this.validateOrganization(e.target.value); }} onChange={(e) => this.validateOrganization(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getOrganizations()
                                            }
                                        </select>
                                        {this.state.organization.error !== "" && this.state.organization.touched &&
                                            <span className="text-danger">{this.state.organization.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Title</label>
                                    <div className="col-lg-6">
                                        <input name="title" type="text" className={(this.state.title.error !== "" && this.state.title.touched ? "border-danger " : "")+"form-control populate"} value={this.state.title.value} disabled={this.state.disableAll} onBlur={(e) => { this.setTitleTouched(); this.validateTitle(e.target.value); }} onChange={(e) => this.validateTitle(e.target.value)} />
                                        {this.state.title.error !== "" && this.state.title.touched &&
                                            <span className="text-danger">{this.state.title.error}</span>
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <section className="card">
                                            <div className="card-body">
                                                <form className="form-horizontal form-bordered">
                                                    <div className="form-group row pb-3">
                                                        <label className="col-lg-3 control-label text-lg-end pt-2">Body</label>
                                                        <div className="col-lg-9">
                                                            <CustomEditor value={this.state.body.value} 
                                                            onBlur={(e) => {this.setBodyTouched(); this.validateBody(e.target.value);}} 
                                                            onChange={this.validateBody} 
                                                            />
                                                            {this.state.body.error !== "" && this.state.body.touched &&
                                                                <span className="text-danger">{this.state.body.error}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                <div className="row my-3">
                                    <div className="col-4 mx-auto">
                                        <button className="btn btn-success w-100" disabled={this.state.loading} onClick={this.saveQuestionGroup}>
                                            {this.state.loading &&
												<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
											}
                                            Add Question Group
                                        </button>
                                    </div>
                                </div>           
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    loadOrganizations = async () => {
        try{
            const response = await this.oService.getOrganizations();
            this.setState({ organizations: response.data });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load organizations.');
        }
    }
    
    getOrganizations = () => {
        let organizations = [];
        this.state.organizations.forEach((organization, i) => {
            organizations.push(
                <option key={i} value={organization.id}>{organization.name}</option>
            );
        });
        return organizations;
    }

    validateQuestionGroupSave = () => {
        if(this.state.organization.error !== '' || this.state.title.error !== ''
        || !this.state.organization.touched || !this.state.title.touched)
        {
            return false;
        }
        else{
            return true;
        }
    }

    saveQuestionGroup = async () => {
        try{
            this.setState({ loading: true });
            if(!this.validateQuestionGroupSave()) return;
            await this.qGroupService.addQuestionGroup({
                organization: this.state.organization.value,
                title: this.state.title.value,
                body: this.state.body.value,
            });
            this.noti.sendNotification(this.noti.types.success, 'Success', 'Question Group has been added.');
            this.resetForm();
            this.setState({ loading: false });
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            this.setState({ loading: false });
        }
    }

    setBodyTouched = () => {
        let body = this.state.body;
        body.touched = true;
        this.setState({ body });
    }

    validateBody = (value) => {
        let body = this.state.body;
        body.value = value;
        if(value !==''){
            body.error = '';
            this.setState({ body });
        }
        else{
            // body.error = 'Body is required.';
            this.setState({ body });
        }
    }

    setOrganizationTouched = () => {
        let organization = this.state.organization;
        organization.touched = true;
        this.setState({ organization });
    }

    validateOrganization = (value) => {   
        let organization = this.state.organization;
        organization.value = value;
        if (value === "") {
            organization.error = 'Organization ID is required.'
            this.setState({ organization });
        }   
        else {
            organization.error = '';
            this.setState({ organization });
        }
    }

    setQuestionGroupIdTouched = () => {
        let questionGroupId = this.state.questionGroupId;
        questionGroupId.touched = true;
        this.setState({ questionGroupId });
    }

    setTitleTouched = () => {
        let title = this.state.title;
        title.touched = true;
        this.setState({ title });
    }

    validateTitle = (value) => {   
        let title = this.state.title;
        title.value = value;
        if (value === "") {
            title.error = 'Title is required.'
            this.setState({ title });
        }   
        else {
            title.error = '';
            this.setState({ title });
        }
    }
}
export default AddQuestionGroup;
