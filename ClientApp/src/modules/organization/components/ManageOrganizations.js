import React, { Component } from "react"
import { NotificationService } from "../../general/services/Notification.service";
import { OrganizationService } from "../services/OrganizationService";


class ManageOrganizations extends Component {
    orgService = new OrganizationService();
    noti = new NotificationService();
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dataloading: false,
            organizationToEditId: '',
            name: {
                value: '',
                touched: false,
                error: ''
            },
            website: {
                value: '',
                touched: false,
                error: ''
            },
            logo: {
                value: '',
                touched: false,
                error: ''
            },
            copyright: {
                value: '',
                touched: false,
                error: ''
            },
            organizationList: [],
        }
    }

    componentDidMount() {
        this.loadOrganizations();
    }

    render() {
        return (
            <>
                <div className="col-md-11 col-xl-9 mx-auto">
                    <div className="accordion accordion-primary" id="accordion">
                        <div className="row p-5">
                            <div className="card card-default">
                                <div className="card-header">
                                    <h4 className="card-title m-0">
                                        <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                            Add Organization
                                        </a>
                                    </h4>
                                </div>
                                <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                                    <div className="card-body">
                                        <div className="form-group row">
                                            <label className="col-lg-3 control-label text-lg-end mt-3">Organization Name</label>
                                            <div className="col-lg-5 mt-2">
                                                <input name="marks" type="text" className={(this.state.name.error !== "" && this.state.name.touched ? "border-danger " : "") + "form-control populate"} value={this.state.name.value} disabled={this.state.loading} onBlur={(e) => { this.setNameTouched(); this.validateName(e.target.value); }} onChange={(e) => this.validateName(e.target.value)} />
                                                {this.state.name.error !== "" && this.state.name.touched &&
                                                    <span className="text-danger">{this.state.name.error}</span>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-lg-3 control-label text-lg-end mt-3">Logo</label>
                                            <div className="col-lg-5 mt-2">
                                                <input name="marks" type="text" className={(this.state.logo.error !== "" && this.state.logo.touched ? "border-danger " : "") + "form-control populate"} value={this.state.logo.value} disabled={this.state.loading} onBlur={(e) => { this.setLogoTouched(); this.validateLogo(e.target.value); }} onChange={(e) => this.validateLogo(e.target.value)} />
                                                {this.state.logo.error !== "" && this.state.logo.touched &&
                                                    <span className="text-danger">{this.state.logo.error}</span>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-lg-3 control-label text-lg-end mt-3">Website</label>
                                            <div className="col-lg-5 mt-2">
                                                <input name="marks" type="text" className={(this.state.website.error !== "" && this.state.website.touched ? "border-danger " : "") + "form-control populate"} value={this.state.website.value} disabled={this.state.loading} onBlur={(e) => { this.setWebsiteTouched(); this.validateWebsite(e.target.value); }} onChange={(e) => this.validateWebsite(e.target.value)} />
                                                {this.state.website.error !== "" && this.state.website.touched &&
                                                    <span className="text-danger">{this.state.website.error}</span>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-lg-3 control-label text-lg-end mt-3">Copyright</label>
                                            <div className="col-lg-5 mt-2">
                                                <input name="marks" type="text" className={(this.state.copyright.error !== "" && this.state.copyright.touched ? "border-danger " : "") + "form-control populate"} value={this.state.copyright.value} disabled={this.state.loading} onBlur={(e) => { this.setCopyrightTouched(); this.validateCopyright(e.target.value); }} onChange={(e) => this.validateCopyright(e.target.value)} />
                                                {this.state.copyright.error !== "" && this.state.copyright.touched &&
                                                    <span className="text-danger">{this.state.copyright.error}</span>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-lg-4 mt-2 mx-auto text-end">
                                            <button className="btn btn-success me-2" disabled={this.state.loading} onClick={this.addUpdateOrganization}>
                                                {this.state.loading &&
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                }
                                                {this.state.organizationToEditId === '' ? 'Add' : 'Update'}
                                            </button>
                                            {this.state.organizationToEditId !== '' &&
                                                <button className="btn btn-warning" onClick={this.clearForm}>
                                                    Cancel
                                                </button>
                                            }
                                        </div>
                                        <div className="row mt-5 mb-3 position-relative">
                                            <div className="col-lg-12 mx-auto">
                                                <table className="table table-sm table-bordered">
                                                    <thead className="table-info">
                                                        <tr>
                                                            <th>Organization Name</th>
                                                            <th>Logo</th>
                                                            <th>Website</th>
                                                            <th>Copyright</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.getOrganizationList()
                                                        }
                                                        {this.state.organizationList.length === 0 && !this.state.dataloading &&
                                                            <tr>
                                                                <td colSpan={5} className="text-center">No records found</td>
                                                            </tr>
                                                        }
                                                        {this.state.dataloading &&
                                                            <tr>
                                                                <td colSpan={5} className="text-center">Loading...</td>
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



    validateName = (value) => {
        let name = this.state.name;
        name.value = value;
        if (value === "") {
            name.error = 'Organization Name is required.'
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

    validateLogo = (value) => {
        let logo = this.state.logo;
        logo.value = value;
        if (value === "") {
            logo.error = 'Logo is required.'
            this.setState({ logo });
        }
        else {
            logo.error = '';
            this.setState({ logo });
        }
    }

    setLogoTouched = () => {
        let logo = this.state.logo;
        logo.touched = true;
        this.setState({ logo });
    }

    validateWebsite = (value) => {
        let website = this.state.website;
        website.value = value;
        if (value === "") {
            website.error = 'Website is required.'
            this.setState({ website });
        }
        else {
            website.error = '';
            this.setState({ website });
        }
    }

    setWebsiteTouched = () => {
        let website = this.state.website;
        website.touched = true;
        this.setState({ website });
    }

    validateCopyright = (value) => {
        let copyright = this.state.copyright;
        copyright.value = value;
        if (value === "") {
            copyright.error = 'Copyright is required.'
            this.setState({ copyright });
        }
        else {
            copyright.error = '';
            this.setState({ copyright });
        }
    }

    setCopyrightTouched = () => {
        let copyright = this.state.copyright;
        copyright.touched = true;
        this.setState({ copyright });
    }

    addUpdateOrganization = async () => {
        if (this.state.name.value !== "" && this.state.copyright.value !== "" && this.state.logo.value !== "" && this.state.website.value !== "") {
            try {
                this.setState({ loading: true });
                if (this.state.organizationToEditId === '') {
                    const response = await this.orgService.addOrganization(this.state.name.value, this.state.logo.value, this.state.website.value, this.state.copyright.value);
                    let Organizations = this.state.organizationList
                    Organizations.unshift(response.data);
                    this.setState({ Organizations });
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Organization has been added.');
                }
                else {
                    const response = await this.orgService.editOrganization(this.state.organizationToEditId, this.state.name.value, this.state.logo.value, this.state.website.value, this.state.copyright.value);
                    let organizationList = this.state.organizationList;
                    let index = this.state.organizationList.findIndex(f => f.id === this.state.organizationToEditId);
                    organizationList[index] = response.data;
                    this.setState({ organizationList })
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Organization has been updated.');
                }
                this.clearForm();
            }
            catch (err) {
                this.setState({ loading: false });
                this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            }
        }
    }

    loadOrganizations = async () => {
        try {
            this.setState({ dataloading: true })
            const response = await this.orgService.getOrganizations();
            let organizationList = this.state.organizationList;
            organizationList = response.data;
            this.setState({ organizationList, dataloading: false });
        }
        catch (err) {
            this.setState({ dataloading: false })
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    getOrganizationList = () => {
        let organizationList = [];
        this.state.organizationList.forEach((org, i) => {
            organizationList.push(
                <tr key={i}>
                    <td>{org.name}</td>
                    <td>{org.logo}</td>
                    <td>{org.website}</td>
                    <td>{org.copyRight}</td>
                    <td>
                        <i className="fas fa-pencil-alt pointer text-primary fs-6 me-2" onClick={() => this.selectOrganizationForEdit(org.id, i)} />
                        <i className="far fa-trash-alt pointer text-danger fs-6" onClick={() => this.deleteOrganization(org.id, i)} />
                    </td>
                </tr>
            );
        });
        return organizationList;
    }

    selectOrganizationForEdit = (id, index) => {
        let name = this.state.name;
        let logo = this.state.logo;
        let website = this.state.website;
        let copyright = this.state.copyright;
        name.value = this.state.organizationList[index].name;
        logo.value = this.state.organizationList[index].logo;
        website.value = this.state.organizationList[index].website;
        copyright.value = this.state.organizationList[index].copyRight;
        this.setState({ organizationToEditId: id, name, logo, website, copyright });
    }

    deleteOrganization = async (id, index) => {
        try {
            await this.orgService.deleteOrganization(id);
            let organizationList = this.state.organizationList;
            organizationList.splice(index, 1);
            this.setState({ organizationList });
            this.noti.sendNotification(this.noti.types.success, 'Success', "Organization has been deleted");
        }
        catch (err) {
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    clearForm = () => {
        let name = {
            value: '',
            touched: false,
            error: ''
        }
        let logo = {
            value: '',
            touched: false,
            error: ''
        }
        let website = {
            value: '',
            touched: false,
            error: ''
        }
        let copyright = {
            value: '',
            touched: false,
            error: ''
        }
        this.setState({ name, logo, website, copyright, loading: false, organizationToEditId: '' });
    }
}
export default ManageOrganizations;

