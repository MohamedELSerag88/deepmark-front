import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from "reactstrap";
import MeetingsService from "../../../services/Admin/MeetingsService";
import { toast } from "react-toastify";

const AdminMeetings = () => {
  const service = new MeetingsService();
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: "pending", meeting_at: "", notes: "" });

  useEffect(() => {
    load(1, pagination.per_page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async (page = 1, perPage = 10) => {
    try {
      setLoading(true);
      const { data } = await service.list({ page, per_page: perPage });
      setList(data?.meetings || []);
      if (data?.pagination) setPagination({ ...data.pagination });
    } catch (e) {
      setError("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (m) => {
    setSelected(m);
    setForm({
      status: m.status || "pending",
      meeting_at: m.meeting_at ? String(m.meeting_at).slice(0, 16).replace("T"," ").replace(" ","T") : "",
      notes: m.notes || "",
    });
    setEditOpen(true);
  };

  const save = async (e) => {
    e?.preventDefault?.();
    if (!selected) return;
    try {
      await service.update(selected.id, {
        status: form.status,
        meeting_at: form.meeting_at ? new Date(form.meeting_at) : undefined,
        notes: form.notes || undefined,
      });
      toast.success("Meeting updated");
      setEditOpen(false);
      load(pagination.current_page || 1, pagination.per_page || 10);
    } catch (err) {
      const data = err?.response?.data;
      let msg = data?.message || "Save failed";
      if (data?.errors) {
        const first = Object.values(data.errors).flat()[0];
        if (first) msg = first;
      }
      toast.error(msg);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const statusBadge = (status) => {
    const v = (status || "").toString().toLowerCase().trim();
    const cfg = {
      pending:   { bg: "bg-warning-subtle", text: "text-warning", icon: "fa-clock",     label: "Pending" },
      approved:  { bg: "bg-success-subtle", text: "text-success", icon: "fa-check-circle", label: "Approved" },
      done:      { bg: "bg-success-subtle", text: "text-success", icon: "fa-check-circle", label: "Done" },
      cancelled: { bg: "bg-danger-subtle",  text: "text-danger",  icon: "fa-ban",       label: "Cancelled" },
      canceled:  { bg: "bg-danger-subtle",  text: "text-danger",  icon: "fa-ban",       label: "Cancelled" },
    }[v] || { bg: "bg-light", text: "text-dark", icon: "fa-circle", label: status || "-" };
    return (
      <span className={`badge rounded-pill ${cfg.bg} ${cfg.text}`}>
        <i className={`fa ${cfg.icon} me-1`} />
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="admin-container meetings-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3 className="page-title mb-0">Meetings</h3>
          </Col>
        </Row>

        <Card>
          <CardBody>
            {loading && <div className="text-muted">Loading...</div>}
            {error && <div className="text-danger">{error}</div>}
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Brand</th>
                  <th className="w-25">Time</th>
                  <th className="w-25">Status</th>
                  <th>Notes</th>
                  <th className="text-end w-25">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No meetings found.</td>
                  </tr>
                )}
                {list.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="fw-semibold">{m.user?.name || `User #${m.user?.id}`}</div>
                      <div className="text-muted small">{m.user?.email || "-"}</div>
                    </td>
                    <td>
                      <div className="fw-semibold">{m.brand?.title || `Brand #${m.brand?.id}`}</div>
                      <div className="text-muted small">{m.brand?.topic}</div>
                    </td>
                    <td className="text-muted">{m.meeting_at ? String(m.meeting_at).slice(0, 19).replace("T"," ") : "-"}</td>
                    <td>{statusBadge(m.status || "-")}</td>
                    <td className="text-muted">
                      {m.notes ? (m.notes.length > 60 ? `${m.notes.slice(0, 60)}…` : m.notes) : "-"}
                    </td>
                    <td className="text-end">
                      <Button size="sm" outline color="primary" onClick={() => openEdit(m)}>
                        <i className="fa fa-pencil"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>

      <Modal isOpen={editOpen} toggle={() => setEditOpen(false)} centered>
        <form onSubmit={save}>
          <ModalHeader toggle={() => setEditOpen(false)}>Edit Meeting</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Status</Label>
              <Input type="select" name="status" value={form.status} onChange={onChange}>
                <option value="pending">pending</option>
                <option value="done">done</option>
                <option value="cancelled">cancelled</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Meeting time</Label>
              <Input
                type="datetime-local"
                name="meeting_at"
                value={form.meeting_at}
                onChange={onChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Notes</Label>
              <Input name="notes" value={form.notes} onChange={onChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button color="primary" type="submit">Save</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMeetings;

