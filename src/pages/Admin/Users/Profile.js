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
  const [favorites, setFavorites] = useState(null);
  const [plans, setPlans] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [rawProjects, setRawProjects] = useState([]);

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
          image: data.user.image,
          bio: data.user.bio,
          joinedAt: data.user.joined_at || user.joinedAt,
          lastLogin: data.user.last_login || user.lastLogin,
        });
        setImgSrc((data.user.image && String(data.user.image).trim() !== "")
          ? data.user.image
          : `https://i.pravatar.cc/100?u=${user.id}`);
        const [fn, ...lnParts] = (data.user.name || "").split(" ");
        setForm({
          fname: data.user.fname || fn || "",
          lname: data.user.lname || lnParts.join(" ") || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          password: "",
        });
        if (Array.isArray(data.projects)) {
          setRawProjects(data.projects || []);
          setProjects(
            data.projects.map((p) => ({
              id: p.id,
              name: p.topic || "Project",
              status: "Pending",
              created_at: (p.created_at || "").toString().slice(0, 10),
            }))
          );
          setProjPagination({ current_page: 1, last_page: 1 });
        }
        setFavorites(data.favorites || null);
        setPlans(data.plans || null);
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
              <img
                src={imgSrc || `https://i.pravatar.cc/100?u=${userDetail.id}`}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setImgSrc(`https://i.pravatar.cc/100?u=${userDetail.id}`)}
              />
            </div>
          </Col>
          <Col md={6}>
            <h3 className="mb-1">{userDetail.name}</h3>
            <div className="muted">Join date: {userDetail.joinedAt}</div>
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
                  {userDetail.bio && (
                    <div className="field-row">
                      <div>
                        <div className="label">Bio</div>
                        <div className="value">{userDetail.bio}</div>
                      </div>
                    </div>
                  )}
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


                  {/* Detailed section from API projects payload */}
                  <div className="mt-4">
                    <h6 className="mb-2">Project Details</h6>
                    {rawProjects.length === 0 && (
                      <div className="text-muted">No details available.</div>
                    )}
                    {rawProjects.map((proj) => {
                      const answers = Array.isArray(proj.answers) ? proj.answers : [];
                      const items = proj?.response?.items || [];
                      return (
                        <Card className="mb-3" key={`detail-${proj.id}`}>
                          <CardBody>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <div className="fw-semibold">
                                  #{proj.id} • {proj.topic || "brand"} • {proj.language || "-"}
                                </div>
                                <div className="text-muted small">
                                  Created: {proj.created_at ? String(proj.created_at).slice(0, 19).replace("T"," ") : "-"}
                                  {proj.device_token ? ` • Device: ${proj.device_token}` : ""}
                                </div>
                              </div>
                            </div>
                            <div className="mb-2">
                              <div className="fw-semibold mb-1">Subscription</div>
                              {favorites && typeof favorites === "object" ? (
                                <table className="table table-sm mb-2">
                                  <thead>
                                    <tr>
                                      <th>Plan</th>
                                      <th>Amount</th>
                                      <th>Status</th>
                                      <th>Started</th>
                                      <th>Ends</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{favorites.plan_name || `Plan #${favorites.plan_id}`}</td>
                                      <td>
                                        {typeof favorites.amount_cents === "number"
                                          ? `$${(favorites.amount_cents / 100).toFixed(2)}`
                                          : "-"}{" "}
                                        <span className="text-muted">{favorites.currency || "USD"}</span>
                                      </td>
                                      <td>
                                        <span className={`badge rounded-pill ${favorites.status === "active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}>
                                          {favorites.status || "-"}
                                        </span>
                                      </td>
                                      <td className="text-muted">
                                        {favorites.started_at ? String(favorites.started_at).slice(0, 10) : "-"}
                                      </td>
                                      <td className="text-muted">
                                        {favorites.ends_at ? String(favorites.ends_at).slice(0, 10) : "-"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              ) : (
                                <div className="text-muted small">No subscription.</div>
                              )}
                            </div>
                            <div>
                              <div className="fw-semibold mb-1">Suggestions</div>
                              {Array.isArray(items) && items.length > 0 ? (
                                <Row className="g-2">
                                  {items.map((it) => (
                                    <Col md={6} key={`${proj.id}-${it.id || it.name}`}>
                                      <Card className="h-100">
                                        <CardBody className="py-2">
                                          <div className="d-flex justify-content-between align-items-center">
                                            <div className="fw-semibold">{it.name}</div>
                                            <span className="badge bg-light text-dark">{it.archetype || "-"}</span>
                                          </div>
                                          {it.domains && (
                                            <div className="mt-2 small">
                                              <div className="text-muted">Primary: {it.domains.primary?.domain} {it.domains.primary?.available ? "(available)" : "(taken)"}</div>
                                              {Array.isArray(it.domains.list) && it.domains.list.length > 0 && (
                                                <div className="text-muted">List: {it.domains.list.slice(0,3).map(d => d.domain).join(", ")}</div>
                                              )}
                                            </div>
                                          )}
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  ))}
                                </Row>
                              ) : (
                                <div className="text-muted small">No suggestions.</div>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })}
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
                  {plans ? (
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th>Plan</th>
                          <th className="w-25">Amount</th>
                          <th className="w-25">Status</th>
                          <th className="w-25">Started</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{plans.plan_name || `Plan #${plans.plan_id}`}</td>
                          <td>
                            {typeof plans.amount_cents === "number"
                              ? `$${(plans.amount_cents / 100).toFixed(2)}`
                              : "-"}{" "}
                            <span className="text-muted">{plans.currency || "USD"}</span>
                          </td>
                          <td>
                            <span className={`badge rounded-pill ${plans.status === "active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}>
                              {plans.status || "-"}
                            </span>
                          </td>
                          <td className="text-muted">
                            {plans.started_at ? String(plans.started_at).slice(0, 10) : "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-muted">No payment records.</div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {active === "favorites" && (
          <Row className="mt-3">
            <Col md={8}>
              <Card className="favorites-card">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Names Shortlist (Favorites)</h6>
                  </div>
                  {Array.isArray(favorites) ? (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="small text-muted">
                          {favorites.length} shortlist{favorites.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      {favorites.length === 0 ? (
                        <div className="text-muted">No favorites yet</div>
                      ) : (
                        <Row className="g-3">
                          {favorites.map((fav) => {
                            const items = Array.isArray(fav?.response?.items) ? fav.response.items : [];
                            const names = items.map((it) => it?.name).filter(Boolean);
                            const more = names.length > 8 ? names.length - 8 : 0;
                            const created = fav.created_at ? String(fav.created_at).slice(0,10) : "-";
                            return (
                              <Col md={6} key={`fav-${fav.id}`}>
                                <Card className="h-100">
                                  <CardBody>
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div>
                                        <div className="fw-semibold d-flex align-items-center gap-2">
                                          <i className="fa fa-heart text-danger"></i>
                                          Favorite #{fav.id}
                                        </div>
                                        <div className="small text-muted mt-1">
                                          <i className="fa fa-tag me-1"></i>{fav.topic || "brand_names"}
                                          <span className="mx-2">•</span>
                                          <i className="fa fa-language me-1"></i>{fav.language || "-"}
                                          <span className="mx-2">•</span>
                                          <i className="fa fa-calendar me-1"></i>{created}
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        outline
                                        color="primary"
                                        onClick={() => window.location.assign(`/admin/brand?id=${fav.id}`)}
                                      >
                                        Open
                                      </Button>
                                    </div>
                                    <div className="mt-3">
                                      <div className="fw-semibold mb-2">Saved names</div>
                                      {names.length ? (
                                        <div className="d-flex flex-wrap gap-2">
                                          {names.slice(0, 8).map((n, idx) => (
                                            <span key={idx} className="badge rounded-pill bg-light text-dark px-3 py-2">
                                              {n}
                                            </span>
                                          ))}
                                          {more > 0 && (
                                            <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2">
                                              +{more} more
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-muted small">No suggestions</span>
                                      )}
                                    </div>
                                  </CardBody>
                                </Card>
                              </Col>
                            );
                          })}
                        </Row>
                      )}
                    </>
                  ) : (
                    // If backend provided a single subscription-like object under "favorites"
                    favorites && typeof favorites === "object" ? (
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Plan</th>
                            <th className="w-25">Amount</th>
                            <th className="w-25">Status</th>
                            <th className="w-25">Started</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{favorites.plan_name || `Plan #${favorites.plan_id}`}</td>
                            <td>
                              {typeof favorites.amount_cents === "number"
                                ? `$${(favorites.amount_cents / 100).toFixed(2)}`
                                : "-"}{" "}
                              <span className="text-muted">{favorites.currency || "USD"}</span>
                            </td>
                            <td>
                              <span className={`badge rounded-pill ${favorites.status === "active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}>
                                {favorites.status || "-"}
                              </span>
                            </td>
                            <td className="text-muted">
                              {favorites.started_at ? String(favorites.started_at).slice(0, 10) : "-"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-muted">No favorites yet</div>
                    )
                  )}
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

