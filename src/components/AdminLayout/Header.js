import React , { useState } from 'react';
import {
	Navbar,
	NavItem,
	NavbarToggler,
	Collapse,
	Nav,
	NavbarBrand,
	DropdownMenu,
	DropdownToggle,
	Dropdown,
	DropdownItem
} from 'reactstrap';
import logo from '../../assets/images/logo.png';
import './style.css'
import { NavLink } from 'react-router-dom';
import { adminPrefix } from './../../configs/routePrefix';
const Header = () => {

	// Collapse isOpen State
	const [isOpen, setIsOpen] = React.useState(false);
	const [account, setAccount] = useState(false)
	return (
		<div>
			<Navbar light className='navbarDashboard px-2' expand="md">
				<NavbarBrand href="/">
                    <img src={logo} alt="" className="imgLogo" />
                </NavbarBrand>
				<NavbarToggler onClick={() => { setIsOpen(!isOpen) }} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="me-auto" navbar>
						<NavItem>
							<NavLink to={`${adminPrefix}/dashboard`}  className="nav-link">Dashboard</NavLink>
						</NavItem>
						<NavItem>
							<NavLink to={`${adminPrefix}/users`} className="nav-link">Users</NavLink>
						</NavItem>
						<NavItem>
							<NavLink to={`${adminPrefix}/brand`} className="nav-link">Brand</NavLink>
						</NavItem>
					</Nav>
					<Nav className="ms-auto" navbar>
					<Dropdown
						className="dropdown-mega d-none d-lg-block ms-2"
						isOpen={account}
						toggle={() => {
							setAccount(!account)
						}}
						>
							<DropdownToggle
							className="btn header-item waves-effect"
							caret
							tag="button"
						>
							<i className='fa fa-user fa-lg'></i> Account Manager
						</DropdownToggle>
							<DropdownMenu>
								<DropdownItem>
									<NavLink className='nav-link py-0' to={`${adminPrefix}/users`}>Profile</NavLink>	
								</DropdownItem>
								<DropdownItem>
									<NavLink className='nav-link py-0' to="/admin/logout">Logout</NavLink>
								</DropdownItem>
							</DropdownMenu>
							
					</Dropdown>
					</Nav>
				</Collapse>
			</Navbar>
		</div >
	);
}

export default Header;