import { Component } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { QuestionService } from "../../../questions/services/QuestionService";
import { QuestionGroupService } from "../../services/QuestionGroupService";
import { OrganizationService } from "../../../organization/services/OrganizationService";
import { NotificationService } from "../../../general/services/Notification.service";
import { withRouter } from '../../../general/components/withRouter';
import CustomEditor from "../../../general/components/CustomEditor";



class EditQuestionGroup extends Component{
    qService = new QuestionService();
    qGroupService = new QuestionGroupService();
    oService = new OrganizationService();
    noti = new NotificationService();


    constructor(props){
        super(props);
        this.state = {
            loading: false,
            id: props.params.id,
            versionNumber: {
                value: '',
                touched: false,
                error:''
            },
            organizationId: {
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
            organizationsLoaded: false,
            questionGroupLoaded: false,
            questionGroups: [],
            organizations: [],
        }
    }

    componentDidMount() {
        this.loadOrganizations();
    }

    componentDidUpdate() {
        if (!this.state.questionGroupLoaded && this.state.organizationsLoaded) 
        {
            this.loadQuestionGroupById();
        }
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
                                <div className="form-group row py-3">
                                    <label className="col-lg-3 control-label text-lg-end pt-2">Organization</label>
                                    <div className="col-lg-6">
                                        <select className={(this.state.organizationId.error !== "" && this.state.organizationId.touched ? "border-danger " : "")+"form-control populate"} value={this.state.organizationId.value} disabled={this.state.disableAll} onBlur={(e) => { this.setOrganizationIdTouched(); this.validateOrganizationId(e.target.value); }} onChange={(e) => this.validateOrganizationId(e.target.value)}>
                                            <option value="">---Select---</option>
                                            {
                                                this.getOrganizations()
                                            }
                                        </select>
                                        {this.state.organizationId.error !== "" && this.state.organizationId.touched &&
                                            <span className="text-danger">{this.state.organizationId.error}</span>
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
                                        <button className="btn btn-success w-100" disabled={this.state.loading} onClick={this.updateQuestionGroup}>
                                            {this.state.loading &&
												<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
											}
                                            Update Question Group
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

    loadQuestionGroupById = async () => {
        try {
            const response = await this.qGroupService.getQuestionGroupByVersionId(this.state.id);
            this.setQuestionGroupValues(response.data);
        }
        catch (error) {
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load questions group.');
        }
    }

    setQuestionGroupValues = (questionV) => {
        let organizationId = this.state.organizationId;
        let title = this.state.title;
        let body = this.state.body;
        
        organizationId.value = questionV.organizationId;
        title.value = questionV.title;
        body.value = questionV.body;
        this.setState({ organizationId, title, body, questionGroupLoaded: true });
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

    updateQuestionGroup = async () => {
        try {
            if(!this.validateQuestionGroupSave()) return;
            this.setState({ loading: true });
            const response = await this.qGroupService.updateQuestionGroup(this.state.id,{
                organization: this.state.organizationId.value,
                title: this.state.title.value,
                body: this.state.body.value,
            });
            this.noti.sendNotification(this.noti.types.success, 'Success', 'Question Group has been Updated.');
            this.setState({ loading: false, id: response.data });
            this.props.navigate('/dashboard/edit-question-group/' + response.data);
        }
        catch (err) {
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            this.setState({ loading: false});
        }
    }

    loadOrganizations = async () => {
        try{
            const response = await this.oService.getOrganizations();
            this.setState({ organizations: response.data, organizationsLoaded: true});
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load organizations.');
        }
    }

    getOrganizations = () => {
        let organizations = [];
        this.state.organizations.forEach((organizationId, i) => {
            organizations.push(
                <option key={i} value={organizationId.id}>{organizationId.name}</option>
            );
        });
        return organizations;
    }

    setBodyTouched = () => {
        let body = this.state.body;
        body.touched = true;
        this.setState({ body });
    }

    validateBody = (value) => {
        let body = this.state.body;
        body.value = value;
        if(value !== ''){
            body.error = '';
            this.setState({ body });
        }
        else{
            // body.error = 'Body is required.';
            this.setState({ body });
        }
    }

    setOrganizationIdTouched = () => {
        let organizationId = this.state.organizationId;
        organizationId.touched = true;
        this.setState({ organizationId });
    }

    validateOrganizationId = (value) => {   
        let organizationId = this.state.organizationId;
        organizationId.value = value;
        if (value === "") {
            organizationId.error = 'Organization ID is required.'
            this.setState({ organizationId });
        }   
        else {
            organizationId.error = '';
            this.setState({ organizationId });
        }
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
export default withRouter(EditQuestionGroup);