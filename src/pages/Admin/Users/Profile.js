import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Collapse,
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
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

function formatAccountDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function normalizeAnswerEntries(raw) {
  const list = Array.isArray(raw) ? raw : [];
  return list
    .map((a, i) => {
      const val = a.value;
      const values = Array.isArray(val)
        ? val.map((v) => String(v).trim()).filter(Boolean)
        : val != null && String(val).trim() !== ""
          ? [String(val).trim()]
          : [];
      const question =
        a.question ||
        a.question_text ||
        a.label ||
        (a.question_id != null ? `Question #${a.question_id}` : `Question ${i + 1}`);
      return { key: String(a.question_id ?? i), question, values };
    })
    .filter((x) => x.values.length);
}

function splitInterestAndNaming(entries) {
  const interest = [];
  const naming = [];
  entries.forEach((e) => {
    const joined = e.values.join(" ");
    const isLongForm = e.values.length === 1 && joined.length > 100;
    if (isLongForm) naming.push(e);
    else interest.push(e);
  });
  return { interest, naming };
}

function collectShortlistNames(favorites, rawProjects) {
  const names = [];
  const seen = new Set();
  const add = (n) => {
    if (!n || seen.has(n)) return;
    seen.add(n);
    names.push(n);
  };
  if (Array.isArray(favorites)) {
    favorites.forEach((fav) => {
      const items = fav?.response?.items;
      if (Array.isArray(items)) {
        items.forEach((it) => add(it?.name));
      }
    });
  }
  (rawProjects || []).forEach((proj) => {
    const items = proj?.response?.items;
    if (Array.isArray(items)) {
      items.forEach((it) => add(it?.name));
    }
  });
  return names;
}

const AdminUserProfile = () => {
  const { id } = useParams();
  const history = useHistory();
  const user = { ...mockUserDetail, id: Number(id) };
  const [userDetail, setUserDetail] = useState(user);
  const service = new UsersService();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ fname: "", lname: "", email: "", phone: "", password: "" });
  const [favorites, setFavorites] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [rawProjects, setRawProjects] = useState([]);
  const [openNamingKey, setOpenNamingKey] = useState(null);
  const [internalNotes, setInternalNotes] = useState(
    "Followed up via email on Apr 1. Client prefers async review — schedule check-in next week."
  );
  const [notesSavedAt, setNotesSavedAt] = useState("Just now");

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const t = setTimeout(() => setNotesSavedAt("Just now"), 500);
    return () => clearTimeout(t);
  }, [internalNotes]);

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
        setImgSrc(
          data.user.image && String(data.user.image).trim() !== ""
            ? data.user.image
            : `https://i.pravatar.cc/100?u=${user.id}`
        );
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
        }
        setFavorites(data.favorites ?? null);
      }
    } catch (e) {
      // keep mock
    }
  };

  const primaryProject = useMemo(() => {
    if (!rawProjects.length) return null;
    const withAnswers = rawProjects.find((p) => Array.isArray(p.answers) && p.answers.length);
    return withAnswers || rawProjects[0];
  }, [rawProjects]);

  const answerEntries = useMemo(
    () => normalizeAnswerEntries(primaryProject?.answers),
    [primaryProject]
  );

  const { interest: interestAnswers, naming: namingAnswers } = useMemo(
    () => splitInterestAndNaming(answerEntries),
    [answerEntries]
  );

  const shortlistNames = useMemo(
    () => collectShortlistNames(favorites, rawProjects),
    [favorites, rawProjects]
  );

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

  const copyName = (name) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(name).then(() => toast.success("Copied"));
    } else {
      toast.error("Clipboard not available");
    }
  };

  const openNameSearch = (name) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(name)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="admin-container user-profile-page">
      <Container fluid className="user-profile-page-inner pt-4 pb-5">
        <div className="user-profile-main">
          <Row className="align-items-center mb-4 g-3">
            <Col>
              <h1 className="user-profile-title mb-0">User Profile</h1>
            </Col>
            <Col xs="12" md="auto" className="d-flex flex-wrap gap-2 justify-content-md-end">
              <Button color="primary" className="px-4" onClick={() => toast.info("Assign to rep — select a rep in the next step.")}>
                Assign to rep
              </Button>
              <Button outline color="secondary" className="px-4 bg-white" onClick={() => history.push("/admin/users")}>
                Close
              </Button>
            </Col>
          </Row>

          <Card className="profile-section-card mb-4">
            <CardBody>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <h2 className="profile-section-title mb-0">User Overview</h2>
                <Button color="link" className="p-0 text-decoration-none profile-edit-link" onClick={() => setEditOpen(true)}>
                  Edit user
                </Button>
              </div>
              <div className="profile-field">
                <div className="profile-field-label">Email</div>
                <div className="profile-field-value">{userDetail.email || "—"}</div>
              </div>
              <div className="profile-field mb-0">
                <div className="profile-field-label">Account Creation Date</div>
                <div className="profile-field-value">{formatAccountDate(userDetail.joinedAt)}</div>
              </div>
            </CardBody>
          </Card>

          <Card className="profile-section-card mb-4">
            <CardBody>
              <h2 className="profile-section-title mb-3">Interest Form Data</h2>
              {interestAnswers.length === 0 ? (
                <div className="text-muted small">No interest form responses yet.</div>
              ) : (
                interestAnswers.map((entry) => (
                  <div key={entry.key} className="profile-interest-block">
                    <div className="profile-interest-q">{entry.question}</div>
                    <div className="profile-pill-row">
                      {entry.values.map((v, idx) => (
                        <span
                          key={idx}
                          className={`profile-pill ${entry.values.length > 1 ? "profile-pill-muted" : "profile-pill-primary"}`}
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          <Card className="profile-section-card mb-4">
            <CardBody>
              <h2 className="profile-section-title mb-3">Shortlisted / Favorite Names</h2>
              {shortlistNames.length === 0 ? (
                <div className="text-muted small">No shortlisted names yet.</div>
              ) : (
                <div className="profile-name-grid">
                  {shortlistNames.map((name) => (
                    <div key={name} className="profile-name-chip">
                      <span className="profile-name-chip-label">{name}</span>
                      <span className="profile-name-chip-actions">
                        <button type="button" className="profile-icon-btn" aria-label="Copy" onClick={() => copyName(name)}>
                          <i className="fa fa-copy" />
                        </button>
                        <button
                          type="button"
                          className="profile-icon-btn"
                          aria-label="Open in search"
                          onClick={() => openNameSearch(name)}
                        >
                          <i className="fa fa-external-link" />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="profile-section-card mb-4">
            <CardBody>
              <h2 className="profile-section-title mb-3">Answers from Naming Flow</h2>
              {namingAnswers.length === 0 ? (
                <div className="text-muted small">No long-form naming answers yet.</div>
              ) : (
                <div className="profile-naming-accordion">
                  {namingAnswers.map((entry) => (
                    <div key={entry.key} className="profile-naming-item">
                      <button
                        type="button"
                        className="profile-naming-toggle"
                        onClick={() => setOpenNamingKey((k) => (k === entry.key ? null : entry.key))}
                      >
                        <span className="profile-naming-q">{entry.question}</span>
                        <i className={`fa fa-chevron-${openNamingKey === entry.key ? "up" : "down"}`} />
                      </button>
                      <Collapse isOpen={openNamingKey === entry.key}>
                        <div className="profile-naming-body">{entry.values.join("\n\n")}</div>
                      </Collapse>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="profile-section-card mb-4">
            <CardBody>
              <h2 className="profile-section-title mb-3">Internal Notes</h2>
              <Input
                type="textarea"
                rows={6}
                className="profile-notes-input"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
              />
              <div className="profile-notes-meta mt-2">
                <i className="fa fa-clock-o me-1" />
                Saved: {notesSavedAt}
              </div>
            </CardBody>
          </Card>

        </div>

        <footer className="user-profile-footer text-center">© 2026 LeadFlow Admin. All rights reserved.</footer>
      </Container>

      <Modal isOpen={editOpen} centered className="edit-user-modal">
        <ModalHeader>
          <div className="d-flex align-items-center gap-2">
            <div className="modal-avatar">
              {imgSrc ? (
                <img src={imgSrc} alt="" className="rounded-circle" width={36} height={36} referrerPolicy="no-referrer" />
              ) : (
                <i className="fa fa-user" />
              )}
            </div>
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
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Leave blank to keep current"
                value={form.password}
                onChange={handleChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter className="justify-content-between">
            <Button color="secondary" outline onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save changes
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserProfile;
