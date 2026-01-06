import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Input,
  FormGroup,
  Label,
  InputGroup,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import "./styles.scss";
import UsersService from "../../../services/Admin/UsersService";
import { toast } from "react-toastify";

const seedUsers = [
  { id: 1, name: "WebKicks Admin", email: "admin12@gmail.com", plan: "Paid" },
  { id: 2, name: "kkkkkkkkkkkkk", email: "admin55@gmail.com", plan: "Free Plan" },
  { id: 3, name: "Khaled", email: "admin1@gmail.com", plan: "Paid" },
  { id: 4, name: "Khaled", email: "admi254@gmail.com", plan: "Free Plan" },
  { id: 5, name: "Khaled", email: "admi25jjl4@gmail.com", plan: "Paid" },
  { id: 6, name: "Khaled", email: "admi2ss5jjl4@gmail.com", plan: "Paid" },
  { id: 7, name: "Khaled", email: "admiknss@gmail.com", plan: "Paid" },
  { id: 8, name: "Khaled", email: "admiknssk@gmail.com", plan: "Paid" },
  { id: 9, name: "Khaled", email: "admikssssk@gmail.com", plan: "Paid" },
  { id: 10, name: "WebKicks Admin", email: "admin12l@gmail.com", plan: "Paid" },
];

const AdminUsers = () => {
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [exportFile, setExportFile] = useState(null);
  const service = new UsersService();
  const debounceRef = useRef();
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ fname: "", lname: "", email: "", phone: "", password: "" });

  const filteredUsers = list;

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // debounce filter changes
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadUsers(1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status, dateJoined]);

  const loadUsers = async (page = 1) => {
    try {
      const { data } = await service.getList({
        q: query,
        status,
        date_joined: dateJoined,
        page,
      });
      const items = (data?.users || []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        plan: u.plan || "Paid",
      }));
      setList(items);
      if (data?.pagination) setPagination(data.pagination);
    } catch (e) {
      // fallback remains seed
    }
  };

  const handleExport = async () => {
    try {
      const { data } = await service.export();
      setExportFile(data?.file || null);
      setExportOpen(true);
    } catch (e) {
      setExportFile(null);
      setExportOpen(true);
    }
  };

  const openEdit = (u) => {
    setSelected(u);
    const [fn, ...lnParts] = (u.name || "").split(" ");
    setForm({
      fname: fn || "",
      lname: lnParts.join(" ") || "",
      email: u.email || "",
      phone: u.phone || "",
      password: "",
    });
    setEditOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    if (!selected) return;
    try {
      const payload = {
        fname: form.fname || null,
        lname: form.lname || null,
        email: form.email || null,
        phone: form.phone || null,
      };
      if (form.password) payload.password = form.password;
      const { data } = await service.update(selected.id, payload);
      if (data?.user) {
        toast.success("User updated");
        setEditOpen(false);
        loadUsers(pagination.current_page || 1);
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Update failed";
      toast.error(msg);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.name}"?`)) return;
    try {
      await service.remove(u.id);
      toast.success("User deleted");
      const nextPage = pagination.current_page || 1;
      loadUsers(nextPage);
    } catch (err) {
      const msg = err?.response?.data?.message || "Delete failed";
      toast.error(msg);
    }
  };

  return (
    <div className="admin-container users-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3 className="page-title mb-0">Registered Users</h3>
            <div className="page-subtitle">List of Registered Users on webkicks</div>
          </Col>
          <Col className="text-end">
            <Button color="primary" className="export-btn" onClick={handleExport}>
              <i className="fa fa-download me-2"></i>
              Export Data
            </Button>
          </Col>
        </Row>

        <Row className="mb-3 g-2">
          <Col md={6} lg={6}>
            <FormGroup className="mb-0">
              <InputGroup>
                <InputGroupText className="bg-white">
                  <i className="fa fa-search"></i>
                </InputGroupText>
                <Input
                  placeholder="Search by user name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md={3} lg={3}>
            <Input
              type="select"
              value={dateJoined}
              onChange={(e) => setDateJoined(e.target.value)}
            >
              <option value="">Date joined</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </Input>
          </Col>
          <Col md={3} lg={3}>
            <Input type="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Status</option>
              <option value="paid">Paid</option>
              <option value="free">Free Plan</option>
            </Input>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="users-card">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th className="w-25">Name</th>
                    <th className="w-25">Email</th>
                    <th className="w-25">Plan</th>
                    <th className="text-end w-25">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.plan === "Paid" ? (
                          <span className="status-paid">Paid</span>
                        ) : (
                          <span className="status-free">Free Plan</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="action-group">
                          <Button
                            outline
                            color="primary"
                            size="sm"
                            onClick={() => history.push(`/admin/users/${user.id}`)}
                          >
                            View profile
                          </Button>
                          <Button outline color="primary" size="sm" onClick={() => openEdit(user)}>
                            <i className="fa fa-pencil"></i>
                          </Button>
                          <Button outline color="danger" size="sm" onClick={() => handleDelete(user)}>
                            <i className="fa fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <ul className="pagination-simple">
              <li className="disabled">
                <span>&lt;</span>
              </li>
              {Array.from({ length: pagination.last_page || 1 }, (_, i) => i + 1).map((n) => {
                const active = n === (pagination.current_page || 1);
                return (
                  <li key={n} className={active ? "active" : ""} onClick={() => loadUsers(n)}>
                    <span>{n}</span>
                  </li>
                );
              })}
              <li>
                <span>&gt;</span>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={editOpen} centered className="edit-user-modal">
        <ModalHeader>
          <div className="d-flex align-items-center gap-2">
            <div className="modal-avatar">
              <i className="fa fa-user"></i>
            </div>
            <div>
              <div className="title">Edit User</div>
              <div className="subtitle text-muted">{selected?.name || ""}</div>
            </div>
          </div>
        </ModalHeader>
        <form onSubmit={handleSave}>
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
              <Col md={12}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label for="phone">Phone</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup className="mb-0">
                  <Label for="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Leave blank to keep current" value={form.password} onChange={handleChange} />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="justify-content-between">
            <Button color="secondary" outline onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button color="primary" type="submit">Save changes</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={exportOpen} toggle={() => setExportOpen(false)} centered>
        <ModalHeader toggle={() => setExportOpen(false)}>Export</ModalHeader>
        <ModalBody>
          <div className="export-ready">Your file is ready</div>
          <div className="export-filebox">
            <i className="fa fa-file-excel-o me-2"></i>
            <div>
              <div>{exportFile?.name || "Spreadsheet1.xlsx"}</div>
              <small className="text-muted">{exportFile?.size_kb ? `${exportFile.size_kb} KB` : "200 KB"}</small>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {exportFile?.url ? (
            <a href={exportFile.url} className="btn btn-primary w-100" target="_blank" rel="noreferrer">
              Download
            </a>
          ) : (
            <Button color="primary" className="w-100" onClick={() => setExportOpen(false)}>
              Close
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AdminUsers;

