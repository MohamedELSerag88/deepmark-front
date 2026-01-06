import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Badge, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import { useParams } from "react-router-dom";
import "./profile.scss";
import UsersService from "../../../services/Admin/UsersService";
import { toast } from "react-toastify";

const mockUserDetail = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  role: "Admin",
  status: "Active",
  joinedAt: "2025-06-01",
  lastLogin: "2026-01-05 14:22",
};

const AdminUserProfile = () => {
  const { id } = useParams();
  const user = { ...mockUserDetail, id: Number(id) };
  const [active, setActive] = useState("overview");
  const [userDetail, setUserDetail] = useState(user);
  const service = new UsersService();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ fname: "", lname: "", email: "", phone: "", password: "" });
  const [projects, setProjects] = useState([]);
  const [projPagination, setProjPagination] = useState({ current_page: 1, last_page: 1 });

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadUser = async () => {
    try {
      const { data } = await service.find(id);
      if (data?.user) {
        setUserDetail({
          ...user,
          name: data.user.name,
          email: data.user.email,
          joinedAt: data.user.joined_at || user.joinedAt,
          lastLogin: data.user.last_login || user.lastLogin,
        });
        const [fn, ...lnParts] = (data.user.name || "").split(" ");
        setForm({
          fname: data.user.fname || fn || "",
          lname: data.user.lname || lnParts.join(" ") || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          password: "",
        });
      }
    } catch (e) {
      // keep mock
    }
  };

  useEffect(() => {
    if (active === "projects") {
      loadProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const loadProjects = async (page = 1) => {
    try {
      const { data } = await service.projects(id, { page });
      setProjects(data?.projects || []);
      if (data?.pagination) setProjPagination(data.pagination);
    } catch (e) {
      setProjects([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fname: form.fname || null,
        lname: form.lname || null,
        email: form.email || null,
        phone: form.phone || null,
      };
      if (form.password) payload.password = form.password;
      const { data } = await service.update(id, payload);
      if (data?.user) {
        setUserDetail((prev) => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
          lastLogin: prev.lastLogin,
        }));
        toast.success("User updated successfully");
        setEditOpen(false);
        await loadUser();
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Update failed";
      toast.error(msg);
    }
  };

  return (
    <div className="admin-container user-profile-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3 g-3">
          <Col md="auto">
            <div className="avatar">
              <img src={`https://i.pravatar.cc/100?u=${userDetail.id}`} alt="" />
            </div>
          </Col>
          <Col md={6}>
            <h3 className="mb-1">{userDetail.name}</h3>
            <div className="muted">Join date: 21Sep 2025</div>
          </Col>
          <Col className="text-end">
            <div className="d-inline-flex gap-2">
              <Button outline color="primary" onClick={() => setEditOpen(true)}>
                <i className="fa fa-pencil me-1"></i>
                Edit profile
              </Button>
              <Button outline color="primary">
                <i className="fa fa-link"></i>
              </Button>
              <Button outline color="secondary">
                <i className="fa fa-user-plus"></i>
              </Button>
              <Button outline color="danger">
                <i className="fa fa-trash"></i>
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <Nav tabs className="profile-tabs">
              {[
                { id: "overview", label: "Overview" },
                { id: "projects", label: "Projects" },
                { id: "answers", label: "Answers" },
                { id: "favorites", label: "Names Shortlist (Favorites)" },
                { id: "payment", label: "Payment" },
              ].map((t) => (
                <NavItem key={t.id}>
                  <NavLink
                    className={active === t.id ? "active" : ""}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(t.id);
                    }}
                  >
                    {t.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Col>
        </Row>

        {active === "overview" && (
          <Row>
            <Col md={8}>
              <Card className="info-card">
                <CardBody>
                  <div className="field-row">
                    <div>
                      <div className="label">Name</div>
                      <div className="value">{userDetail.name}</div>
                    </div>
                  </div>
                  <div className="field-row">
                    <div>
                      <div className="label">Email address</div>
                      <div className="value">{userDetail.email}</div>
                    </div>
                  </div>
                  <div className="field-row mb-0">
                    <div>
                      <div className="label">Last login</div>
                      <div className="value">{userDetail.lastLogin}</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {active === "projects" && (
          <Row className="mt-3">
            <Col md={8}>
              <Card className="projects-card">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Projects</h6>
                  </div>
                  <div>
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th className="w-25">Status</th>
                          <th className="w-25">Created</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center text-muted py-4">No projects yet</td>
                          </tr>
                        )}
                        {projects.map((p) => (
                          <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>
                              <span className={`badge rounded-pill ${p.status === "Paid" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="text-muted">{p.created_at}</td>
                            <td className="text-end">
                              <Button outline color="primary" size="sm" onClick={() => window.location.assign(`/admin/brand?id=${p.id}`)}>
                                Open
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
                    <ul className="pagination-simple">
                      <li className="disabled"><span>&lt;</span></li>
                      {Array.from({ length: projPagination.last_page || 1 }, (_, i) => i + 1).map((n) => {
                        const activePg = n === (projPagination.current_page || 1);
                        return (
                          <li key={n} className={activePg ? "active" : ""} onClick={() => loadProjects(n)}>
                            <span>{n}</span>
                          </li>
                        );
                      })}
                      <li><span>&gt;</span></li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {active === "payment" && (
          <Row className="mt-3">
            <Col md={8}>
              <Card className="payments-card">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Payments</h6>
                  </div>
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th>Plan</th>
                        <th className="w-25">Amount</th>
                        <th className="w-25">Status</th>
                        <th className="w-25">Started</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1, plan_name: "Standard Plan", amount: "$25.00", status: "Paid", started_at: "2025-09-21" },
                        { id: 2, plan_name: "Free Plan", amount: "$0.00", status: "Pending", started_at: "2025-10-05" },
                        { id: 3, plan_name: "Premium Plan", amount: "$49.00", status: "Paid", started_at: "2025-11-18" },
                      ].map((row) => (
                        <tr key={row.id}>
                          <td>{row.plan_name}</td>
                          <td>{row.amount} <span className="text-muted">USD</span></td>
                          <td>
                            <span className={`badge rounded-pill ${row.status === "Paid" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="text-muted">{row.started_at}</td>
                          <td className="text-end">
                            <Button outline color="primary" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      <Modal isOpen={editOpen} centered className="edit-user-modal">
        <ModalHeader>
          <div className="d-flex align-items-center gap-2">
            <div className="modal-avatar"><i className="fa fa-user"></i></div>
            <div>
              <div className="title">Edit User</div>
              <div className="subtitle text-muted">{userDetail.name}</div>
            </div>
          </div>
        </ModalHeader>
        <Form onSubmit={handleSave}>
          <ModalBody>
            <Row className="g-3 form-grid">
              <Col md={6}>
                <FormGroup>
                  <Label for="fname">First name</Label>
                  <Input id="fname" name="fname" value={form.fname} onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="lname">Last name</Label>
                  <Input id="lname" name="lname" value={form.lname} onChange={handleChange} />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Leave blank to keep current" value={form.password} onChange={handleChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter className="justify-content-between">
            <Button color="secondary" outline onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button color="primary" type="submit">Save changes</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserProfile;

