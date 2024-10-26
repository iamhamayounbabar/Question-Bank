import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthService } from "../../auth/services/AuthService";


export const Layout = (props) => {
    const user = JSON.parse(localStorage.getItem("ASPNetAuthToken"));
    let location = useLocation();

    useEffect(() => {
        doAuth();
        // updateThemeJs();
    }, [location]);

    const doAuth = () => {
        const service = new AuthService();
        service.isAuthenticated().then(res => {
        }).catch(err => {
            window.location.replace('/');
        });
    }

    // const updateThemeJs = () => {
    //     const existingScript = document.getElementById('theme-init');
    //     if(existingScript){
    //         existingScript.parentNode.removeChild(existingScript);
    //     } 
    //     const script = document.createElement('script');
    //     script.src = '/assets/js/theme.init.js';
    //     script.id = 'theme-init';
    //     document.body.appendChild(script);
    // }

    const logout = () => {
        localStorage.removeItem('ASPNetAuthToken');
        window.location.replace('/');
    }

    if (!user)
        return;

    return (
        <>
            <section className="body">

                {/* start: header */}
                <header className="header header-nav-menu header-nav-links">
                    <div className="logo-container">
                        <Link to="/" className="logo">
                            <img src="/assets/img/logo-modern.png" className="logo-image" width="90" height="24" alt="Porto Admin" /><img src="/assets/img/logo-default.png" className="logo-image-mobile" width="90" height="41" alt="Porto Admin" />
                        </Link>
                        <button className="btn header-btn-collapse-nav d-lg-none" data-bs-toggle="collapse" data-bs-target=".header-nav">
                            <i className="fas fa-bars"></i>
                        </button>

                        {/* start: header nav menu */}
                        <div className="header-nav collapse">
                            <div className="header-nav-main header-nav-main-effect-1 header-nav-main-sub-effect-1 header-nav-main-square">
                                <nav>
                                    <ul className="nav nav-pills" id="mainNav">
                                        <li className="">
                                            <a className="nav-link" href="layouts-default.html">
                                                Dashboard
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        {/* end: header nav menu */}
                    </div>

                    {/* start: search & user box */}
                    <div className="header-right">

                        <button className="btn search-toggle d-none d-md-inline-block d-xl-none" data-target=".search"><i className="bx bx-search"></i></button>
                        <div className="search search-style-1 nav-form d-none d-xl-inline-block">
                            <div className="input-group">
                                <input type="text" className="form-control" name="q" id="q" placeholder="Search..." />
                                <button className="btn btn-default" type="submit"><i className="bx bx-search"></i></button>
                            </div>
                        </div>

                        <span className="separator"></span>
                        <ul className="notifications">
                            <li>
                                <button className="dropdown-toggle notification-icon border-0" data-bs-toggle="dropdown">
                                    <i className="bx bx-envelope"></i>
                                    <span className="badge">4</span>
                                </button>

                                <div className="dropdown-menu notification-menu">
                                    <div className="notification-title">
                                        <span className="float-end badge badge-default">230</span>
                                        Messages
                                    </div>

                                    <div className="content">
                                        <ul>
                                            <li>
                                                <Link to="/dashboard" className="clearfix">

                                                    <span className="image image-as-text">JD</span>

                                                    <span className="title">Joseph Doe</span>
                                                    <span className="message">Lorem ipsum dolor sit.</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/dashboard" className="clearfix">

                                                    <span className="image image-as-text bg-secondary">JJ</span>

                                                    <span className="title">Joseph Junior</span>
                                                    <span className="message truncate">Truncated message. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet lacinia orci. Proin vestibulum eget risus non luctus. Nunc cursus lacinia lacinia. Nulla molestie malesuada est ac tincidunt. Quisque eget convallis diam, nec venenatis risus. Vestibulum blandit faucibus est et malesuada. Sed interdum cursus dui nec venenatis. Pellentesque non nisi lobortis, rutrum eros ut, convallis nisi. Sed tellus turpis, dignissim sit amet tristique quis, pretium id est. Sed aliquam diam diam, sit amet faucibus tellus ultricies eu. Aliquam lacinia nibh a metus bibendum, eu commodo eros commodo. Sed commodo molestie elit, a molestie lacus porttitor id. Donec facilisis varius sapien, ac fringilla velit porttitor et. Nam tincidunt gravida dui, sed pharetra odio pharetra nec. Duis consectetur venenatis pharetra. Vestibulum egestas nisi quis elementum elementum.</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/dashboard" className="clearfix">

                                                    <span className="image image-as-text bg-tertiary">MD</span>

                                                    <span className="title">Monica Doe</span>
                                                    <span className="message">Lorem ipsum dolor sit.</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/dashboard" className="clearfix">

                                                    <span className="image image-as-text bg-quaternary">RD</span>

                                                    <span className="title">Robert Doe</span>
                                                    <span className="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet lacinia orci. Proin vestibulum eget risus non luctus. Nunc cursus lacinia lacinia. Nulla molestie malesuada est ac tincidunt. Quisque eget convallis diam.</span>
                                                </Link>
                                            </li>
                                        </ul>

                                        <hr />

                                        <div className="text-end">
                                            <Link to="/dashboard" className="view-more">View All</Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <button className="dropdown-toggle notification-icon border-0" data-bs-toggle="dropdown">
                                    <i className="bx bx-bell"></i>
                                    <span className="badge">3</span>
                                </button>

                                <div className="dropdown-menu notification-menu">
                                    <div className="notification-title">
                                        <span className="float-end badge badge-default">3</span>
                                        Alerts
                                    </div>

                                    <div className="content">
                                        <ul>
                                            <li>
                                                <Link to="/dashboard" className="clearfix">
                                                    <div className="image">
                                                        <i className="bx bx-dislike bg-danger"></i>
                                                    </div>
                                                    <span className="title">Server is Down!</span>
                                                    <span className="message">Just now</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/dashboard" className="clearfix">
                                                    <div className="image">
                                                        <i className="bx bx-lock-alt bg-warning"></i>
                                                    </div>
                                                    <span className="title">User Locked</span>
                                                    <span className="message">15 minutes ago</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/dashboard" className="clearfix">
                                                    <div className="image">
                                                        <i className="bx bx-wifi bg-success"></i>
                                                    </div>
                                                    <span className="title">Connection Restaured</span>
                                                    <span className="message">10/10/2021</span>
                                                </Link>
                                            </li>
                                        </ul>

                                        <hr />

                                        <div className="text-end">
                                            <Link to="/dashboard" className="view-more">View All</Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <span className="separator"></span>

                        <div id="userbox" className="userbox">
                            <button data-bs-toggle="dropdown" className="border-0 bg-white">

                                <span className="profile-picture profile-picture-as-text">JD</span>
                                <div className="profile-info profile-info-no-role" data-lock-name={user.name} data-lock-email="johndoe@okler.com">
                                    <span className="name">Hi, <strong className="font-weight-semibold">{user.name}</strong></span>
                                </div>

                                <i className="fas fa-chevron-down text-color-dark"></i>
                            </button>

                            <div className="dropdown-menu">
                                <ul className="list-unstyled mt-3">
                                    <li>
                                        <Link role="menuitem" tabIndex="-1" to="/dashboard"><i className="bx bx-user"></i> My Profile</Link>
                                    </li>
                                    <li>
                                        <Link role="menuitem" tabIndex="-1" to="/dashboard" data-lock-screen="true"><i className="bx bx-lock-open-alt"></i> Lock Screen</Link>
                                    </li>
                                    <li>
                                        <Link onClick={logout} role="menuitem" tabIndex="-1" to="/dashboard"><i className="bx bx-log-out"></i> Logout</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* end: search & user box */}
                </header>
                {/* end: header */}

                <div className="inner-wrapper">
                    {/* start: sidebar */}
                    <aside id="sidebar-left" className="sidebar-left">

                        <div className="sidebar-header">
                            <div className="sidebar-toggle d-none d-md-flex" data-target="html" data-fire-event="sidebar-left-toggle">
                                <i className="fas fa-bars" aria-label="Toggle sidebar"></i>
                            </div>
                        </div>

                        <div className="nano">
                            <div className="nano-content">
                                <nav id="menu" className="nav-main" role="navigation">

                                    <ul className="nav nav-main">
                                        <li>
                                            <Link className="nav-link" to="/dashboard">
                                                <i className="bx bx-home-alt" aria-hidden="true"></i>
                                                <span>Dashboard</span>
                                            </Link>
                                        </li>
                                        {user.role === 'Admin' &&
                                            <>
                                                <li className="nav-group-label">User Management</li>
                                                <li>
                                                    <Link className="nav-link" to="register">
                                                        <i className="bx bx-user" aria-hidden="true"></i>
                                                        <span>Add Users</span>
                                                    </Link>
                                                </li>
                                            </>
                                        }
                                        {user.role === 'Admin' &&
                                            <>
                                                <li className="nav-group-label">Manage Metadata</li>
                                                <li>
                                                    <Link className="nav-link" to="subjects">
                                                        <i className="bx bx-book-add" aria-hidden="true"></i>
                                                        <span>Manage Subjects</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="nav-link" to="topics">
                                                        <i className="bx bx-book-content" aria-hidden="true"></i>
                                                        <span>Manage Topics</span>
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <Link className="nav-link" to="question-type">
                                                        <i className="bx bx-book-alt" aria-hidden="true"></i>
                                                        <span>Manage Question Types</span>
                                                    </Link>
                                                </li> */}
                                                <li>
                                                    <Link className="nav-link" to="complexity">
                                                        <i className="bx bx-book-open" aria-hidden="true"></i>
                                                        <span>Manage Complexities</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="nav-link" to="organizations">
                                                        <i className="bx bx-book-reader" aria-hidden="true"></i>
                                                        <span>Manage Organizations</span>
                                                    </Link>
                                                </li>

                                            </>
                                        }
                                        {(user.role === 'Content Creator') &&
                                            <>
                                                <li className="nav-group-label">Question Management</li>
                                                <li>
                                                    <Link className="nav-link" to="questions-list">
                                                        <i className="bx bx-book-content" aria-hidden="true"></i>
                                                        <span>List Of Questions</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="nav-link" to="add-question">
                                                        <i className="bx bx-book-content" aria-hidden="true"></i>
                                                        <span>Add Question</span>
                                                    </Link>
                                                </li>
                                                <li className="nav-group-label">Paper Management</li>
                                                <li>
                                                    <Link className="nav-link" to="add-paper">
                                                        <i className="bx bx-book-content" aria-hidden="true"></i>
                                                        <span>Add Paper</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="nav-link" to="paper-list">
                                                        <i className="bx bx-book-content" aria-hidden="true"></i>
                                                        <span>Paper List</span>
                                                    </Link>
                                                </li>
                                            </>
                                        }
                                        {user.role === 'Approver' &&
                                            <>
                                                <li className="nav-group-label">Question Management</li>
                                                <li>
                                                    <Link className="nav-link" to="questions-list-for-approval">
                                                        <i className="bx bx-book-content" aria-hidden="true"></i>
                                                        <span>Questions For Approval</span>
                                                    </Link>
                                                </li>
                                            </>
                                        }
                                        {user.role === 'Content Creator' &&
                                            <>
                                                <li className="nav-group-label">Manage Metadata</li>
                                                <li>
                                                    <Link className="nav-link" to="question-groups-list">
                                                        <i className="bx bx-book-content" aria-hidden="true"></i>
                                                        <span>Manage Question Group </span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="nav-link" to="tags">
                                                        <i className="bx bx-tag" aria-hidden="true"></i>
                                                        <span>Manage Tags</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="nav-link" to="paper-type">
                                                        <i className="bx bx-tag" aria-hidden="true"></i>
                                                        <span>Manage Paper Types</span>
                                                    </Link>
                                                </li>
                                            </>
                                        }
                                    </ul>
                                </nav>

                                {/* <hr className="separator" /> */}

                            </div>
                        </div>

                    </aside>
                    {/* end: sidebar */}

                    <section role="main" className="content-body" style={{ marginTop: '0px', paddingTop: '0px', marginBottom: '0px', paddingBottom: '0px' }}>
                        <Outlet />
                    </section>
                </div>

                <aside id="sidebar-right" className="sidebar-right">
                    <div className="nano">
                        <div className="nano-content">
                            <a href="collapse" className="mobile-close d-md-none">
                                Collapse <i className="fas fa-chevron-right"></i>
                            </a>

                            <div className="sidebar-right-wrapper">

                                <div className="sidebar-widget widget-calendar">
                                    <h6>Upcoming Tasks</h6>
                                    <div data-plugin-datepicker data-plugin-skin="dark"></div>

                                    <ul>
                                        <li>
                                            <time dateTime="2021-04-19T00:00+00:00">04/19/2021</time>
                                            <span>Company Meeting</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="sidebar-widget widget-friends">
                                    <h6>Friends</h6>
                                    <ul>
                                        <li className="status-online">
                                            <figure className="profile-picture">
                                                <img src="/assets/img/!sample-user.jpg" alt="Joseph Doe" className="rounded-circle" />
                                            </figure>
                                            <div className="profile-info">
                                                <span className="name">Joseph Doe Junior</span>
                                                <span className="title">Hey, how are you?</span>
                                            </div>
                                        </li>
                                        <li className="status-online">
                                            <figure className="profile-picture">
                                                <img src="/assets/img/!sample-user.jpg" alt="Joseph Doe" className="rounded-circle" />
                                            </figure>
                                            <div className="profile-info">
                                                <span className="name">Joseph Doe Junior</span>
                                                <span className="title">Hey, how are you?</span>
                                            </div>
                                        </li>
                                        <li className="status-offline">
                                            <figure className="profile-picture">
                                                <img src="/assets/img/!sample-user.jpg" alt="Joseph Doe" className="rounded-circle" />
                                            </figure>
                                            <div className="profile-info">
                                                <span className="name">Joseph Doe Junior</span>
                                                <span className="title">Hey, how are you?</span>
                                            </div>
                                        </li>
                                        <li className="status-offline">
                                            <figure className="profile-picture">
                                                <img src="/assets/img/!sample-user.jpg" alt="Joseph Doe" className="rounded-circle" />
                                            </figure>
                                            <div className="profile-info">
                                                <span className="name">Joseph Doe Junior</span>
                                                <span className="title">Hey, how are you?</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </aside>

            </section>
        </>
    )
}