import React, { Component } from "react"
import { NotificationService } from "../../../general/services/Notification.service";
import { OrganizationService } from "../../../organization/services/OrganizationService";
import { PaperTypeService } from "../../../paper-type/components/services/PaperTypeService";
import { PaperService } from "../Services/PaperService";
import CustomEditor from "../../../general/components/CustomEditor";
import { QuestionService } from "../../../questions/services/QuestionService";



class AddPaper extends Component{
    qService = new QuestionService();
    pTService = new PaperTypeService();
    pService = new PaperService();
    oService = new OrganizationService();
    noti = new NotificationService();
    constructor(props){
        super (props);
        this.state = {
            loading: false,
            header : {
                value: '',
                touched: false,
                error: '',
            },
            footer : {
                value: '',
                touched: false,
                error: '',
            },
            timeAllowed : {
                value: '',
                touched: false,
                error: '',
            },
            name : {
                value: '',
                touched: false,
                error: '',
            },
            organization: {
                value: '',
                touched: false,
                error:'',
            },
            paperType: {
                value: '',
                touched: false,
                error:'',
            },
            yearGroup: {
                value: '',
                touched: false,
                error:'',
            },
            organizations: [],
            paperTypes: [],
            yearGroups: []
        }
        
    }

    componentDidMount(){
        this.loadOrganizations();
        this.loadYearGroups();
        this.loadPaperTypes();
    }

    loadYearGroups = async () => {
        try{
            const response = await this.qService.getYearGroups();
            this.setState({ yearGroups: response.data });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load year groups.');
        }
    }

    loadPaperTypes = async () => {
        try{
            const response = await this.pTService.loadPaperTypes();
            this.setState({ paperTypes: response.data });
        }
        catch(error){
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load paper types.');
        }
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
    
    render(){
        return(
            <>
                <div className="accordion accordion-primary" id="accordion">
                    <div className="card card-default">
                        <div className="card-header">
                            <h4 className="card-title m-0">
                                <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                    Add Paper
                                </a>
                            </h4>
                        </div>
                        <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <div className="card-body">
                                            <div className="form-group row pb-3">
                                                <label className="col-lg-3 control-label text-lg-end pt-2">Header</label>
                                                <div className="col-lg-6">
                                                <CustomEditor value={this.state.header.value} 
                                                    onBlur={(e) => {this.setHeaderTouched(); this.validateHeader(e.target.value);}} 
                                                    onChange={this.validateHeader} 
                                                    />
                                                    {this.state.header.error !== "" && this.state.header.touched &&
                                                        <span className="text-danger">{this.state.header.error}</span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row py-3">
                                                <label className="col-lg-3 control-label text-lg-end pt-2">Time Allowed</label>
                                                <div className="col-lg-6">
                                                    <input name="timeAllowed" type="text" className={(this.state.timeAllowed.error !== "" && this.state.timeAllowed.touched ? "border-danger " : "")+"form-control populate"} value={this.state.timeAllowed.value} disabled={this.state.disableAll} onBlur={(e) => { this.setTimeAllowedTouched(); this.validateTimeAllowed(e.target.value); }} onChange={(e) => this.validateTimeAllowed(e.target.value)} />
                                                    {this.state.timeAllowed.error !== "" && this.state.timeAllowed.touched &&
                                                        <span className="text-danger">{this.state.timeAllowed.error}</span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row py-3">
                                                <label className="col-lg-3 control-label text-lg-end pt-2">Name</label>
                                                <div className="col-lg-6">
                                                    <input name="name" type="text" className={(this.state.name.error !== "" && this.state.name.touched ? "border-danger " : "")+"form-control populate"} value={this.state.name.value} disabled={this.state.disableAll} onBlur={(e) => { this.setNameTouched(); this.validateName(e.target.value); }} onChange={(e) => this.validateName(e.target.value)} />
                                                    {this.state.name.error !== "" && this.state.name.touched &&
                                                        <span className="text-danger">{this.state.name.error}</span>
                                                    }
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
                                                <label className="col-lg-3 control-label text-lg-end pt-2">Paper Type</label>
                                                <div className="col-lg-6">
                                                    <select className={(this.state.paperType.error !== "" && this.state.paperType.touched ? "border-danger " : "")+"form-control populate"}value={this.state.paperType.value} disabled={this.state.disableAll} onBlur={(e) => { this.setPaperTypeTouched(); this.validatePaperType(e.target.value); }} onChange={(e) => this.validatePaperType(e.target.value)}>
                                                        <option value="">---Select---</option>
                                                        {
                                                            this.getPaperTypes()
                                                        }
                                                    </select>
                                                    {this.state.paperType.error !== "" && this.state.paperType.touched &&
                                                        <span className="text-danger">{this.state.paperType.error}</span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row pb-3">
                                                <label className="col-lg-3 control-label text-lg-end pt-2">Year Group </label>
                                                <div className="col-lg-6">
                                                    <select className={(this.state.yearGroup.error !== "" && this.state.yearGroup.touched ? "border-danger " : "")+"form-control populate"} value={this.state.yearGroup.value} disabled={this.state.disableAll} onBlur={(e) => { this.setYearGroupTouched(); this.validateYearGroup(e.target.value); }} onChange={(e) => this.validateYearGroup(e.target.value)}>
                                                        <option value="">---Select---</option>
                                                        {
                                                            this.getYearGroups()
                                                        }
                                                    </select>
                                                    {this.state.yearGroup.error !== "" && this.state.yearGroup.touched &&
                                                        <span className="text-danger">{this.state.yearGroup.error}</span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row pb-3">
                                                <label className="col-lg-3 control-label text-lg-end pt-2">Footer</label>
                                                <div className="col-lg-6">
                                                <CustomEditor value={this.state.footer.value} 
                                                    onBlur={(e) => {this.setFooterTouched(); this.validateFooter(e.target.value);}} 
                                                    onChange={this.validateFooter} 
                                                    />
                                                    {this.state.footer.error !== "" && this.state.footer.touched &&
                                                        <span className="text-danger">{this.state.footer.error}</span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="row my-3">
                                                <div className="col-4 mx-auto">
                                                    <button className="btn btn-success w-100" disabled={this.state.loading} onClick={this.savePaper}>
                                                        {this.state.loading &&
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        }
                                                        Add Paper
                                                    </button>
                                                </div>
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

    validatePaperSave = () => {
        if(this.state.header.error !== '' || this.state.timeAllowed.error !== ''
        || this.state.name.error !== '' || this.state.organization.error !== ''
        || this.state.footer.error !== ''
        || !this.state.header.touched || !this.state.timeAllowed.touched 
        || !this.state.name.touched || !this.state.organization.touched 
        || !this.state.footer.touched)
        {
            return false;
        }
        else{
            return true;
        }
    }

    savePaper = async () => {
        try{
            if(!this.validatePaperSave()) return;
            this.setState({ loading: true });
            await this.pService.addPaper({
                header: this.state.header.value,
                timeAllowed: this.state.timeAllowed.value,
                name: this.state.name.value,
                organization: this.state.organization.value,
                paperType: this.state.paperType.value,
                yearGroup: this.state.yearGroup.value,
                footer: this.state.footer.value,
            });
            this.noti.sendNotification(this.noti.types.success, 'Success', 'Paper has been added.');
            this.resetForm();
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            this.setState({ loading: false });
        }
    }

    getYearGroups = () => {
        let yearGroups = [];
        this.state.yearGroups.forEach((yearGroup, i) => {
            yearGroups.push(
                <option key={i} value={yearGroup.id}>{yearGroup.name}</option>
            );
        });
        return yearGroups;
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


    getPaperTypes = () => {
        let paperTypes = [];
        this.state.paperTypes.forEach((paperType, i) => {
            paperTypes.push(
                <option key={i} value={paperType.id}>{this.seperateWords(paperType.name)}</option>
            );
        });
        return paperTypes;
    }

    seperateWords(words){
        return words.replace(/([a-z])([A-Z])/g, "$1 $2");
    }

    // Validators
    validateHeader = (value) => {
        let header = this.state.header;
        header.value = value;
        if(value !== ''){
            header.error = '';
            this.setState({ header });
        }
        else{
            header.error = 'Header is required.';
            this.setState({ header });
        }
    }

    setHeaderTouched = () => {
        let header = this.state.header;
        header.touched = true;
        this.setState({ header });
    }

    validateFooter = (value) => {
        let footer = this.state.footer;
        footer.value = value;
        if(value !== ''){
            footer.error = '';
            this.setState({ footer });
        }
        else{
            footer.error = 'Footer is required.';
            this.setState({ footer });
        }
    }

    setFooterTouched = () => {
        let footer = this.state.footer;
        footer.touched = true;
        this.setState({ footer });
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

    setNameTouched = () => {
        let name = this.state.name;
        name.touched = true;
        this.setState({ name });
    }

    validateTimeAllowed = (value) => {   
        let timeAllowed = this.state.timeAllowed;
        timeAllowed.value = value;
        if (value === "") {
            timeAllowed.error = 'Time Allowed is required.'
            this.setState({ timeAllowed });
        }   
        else {
            timeAllowed.error = '';
            this.setState({ timeAllowed });
        }
    }

    setTimeAllowedTouched = () => {
        let timeAllowed = this.state.timeAllowed;
        timeAllowed.touched = true;
        this.setState({ timeAllowed });
    }

    validateOrganization = (value) => {   
        let organization = this.state.organization;
        organization.value = value;
        if (value === "") {
            organization.error = 'Organization is required.'
            this.setState({ organization });
        }   
        else {
            organization.error = '';
            this.setState({ organization });
        }
    }

    setOrganizationTouched = () => {
        let organization = this.state.organization;
        organization.touched = true;
        this.setState({ organization });
    }

    validatePaperType = (value) => {   
        let paperType = this.state.paperType;
        paperType.value = value;
        this.setState({ paperType });
        // if (value === "") {
        //     paperType.error = 'Paper Type is required.'
        //     this.setState({ paperType });
        // }   
        // else {
        //     paperType.error = '';
        // }
    }

    setPaperTypeTouched = () => {
        let paperType = this.state.paperType;
        paperType.touched = true;
        this.setState({ paperType });
    }

    validateYearGroup = (value) => {   
        let yearGroup = this.state.yearGroup;
        yearGroup.value = value;
        if (value === "") {
            yearGroup.error = 'Year Group is required.'
            this.setState({ yearGroup });
        }   
        else {
            yearGroup.error = '';
            this.setState({ yearGroup });
        }
    }

    setYearGroupTouched = () => {
        let yearGroup = this.state.yearGroup;
        yearGroup.touched = true;
        this.setState({ yearGroup });
    }
}
export default AddPaper;