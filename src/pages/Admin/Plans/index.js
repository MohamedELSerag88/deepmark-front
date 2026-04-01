import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Input, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from "reactstrap";
import PlansService from "../../../services/Admin/PlansService";
import { toast } from "react-toastify";

const AdminPlans = () => {
  const service = new PlansService();
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_cents: 0,
    currency: "USD",
    interval: "month",
    stripe_price_id: "",
  });

  useEffect(() => {
    load(1, pagination.per_page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async (page = 1, perPage = 10) => {
    try {
      setLoading(true);
      const { data } = await service.list({ page, per_page: perPage });
      setList(data?.plans || []);
      if (data?.pagination) setPagination({ ...data.pagination });
    } catch (e) {
      setError("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelected(null);
    setForm({
      name: "",
      description: "",
      price_cents: 0,
      currency: "USD",
      interval: "month",
      stripe_price_id: "",
    });
    setEditOpen(true);
  };

  const openEdit = (p) => {
    setSelected(p);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price_cents: p.price_cents || 0,
      currency: p.currency || "USD",
      interval: p.interval || "month",
      stripe_price_id: p.stripe_price_id || "",
    });
    setEditOpen(true);
  };

  const save = async (e) => {
    e?.preventDefault?.();
    try {
      if (selected) {
        await service.update(selected.id, form);
        toast.success("Plan updated");
      } else {
        await service.create(form);
        toast.success("Plan created");
      }
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

  const del = async (p) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await service.remove(p.id);
      toast.success("Deleted");
      load(pagination.current_page || 1, pagination.per_page || 10);
    } catch (err) {
      const data = err?.response?.data;
      let msg = data?.message || "Delete failed";
      if (data?.errors) {
        const first = Object.values(data.errors).flat()[0];
        if (first) msg = first;
      }
      toast.error(msg);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "price_cents" ? parseInt(value || "0", 10) : value }));
  };

  return (
    <div className="admin-container plans-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3 className="page-title mb-0">Plans</h3>
          </Col>
          <Col md="auto">
            <Button color="primary" onClick={openCreate}>
              <i className="fa fa-plus me-2"></i>
              New Plan
            </Button>
          </Col>
        </Row>

        <Card>
          <CardBody>
            {loading && <div className="text-muted">Loading...</div>}
            {error && <div className="text-danger">{error}</div>}
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="w-25">Price</th>
                  <th className="w-25">Interval</th>
                  <th className="text-end w-25">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">No plans found.</td>
                  </tr>
                )}
                {list.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{(p.price_cents || 0) / 100} <span className="text-muted">{p.currency || "USD"}</span></td>
                    <td>{p.interval}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <Button size="sm" outline color="primary" onClick={() => openEdit(p)}>
                          <i className="fa fa-pencil"></i>
                        </Button>
                        <Button size="sm" outline color="danger" onClick={() => del(p)}>
                          <i className="fa fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
              <span className="small text-muted">Rows per page</span>
              <Input
                type="select"
                bsSize="sm"
                style={{ width: 90 }}
                value={pagination.per_page || 10}
                onChange={(e) => {
                  const per = parseInt(e.target.value, 10) || 10;
                  load(1, per);
                }}
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Input>
            </div>
          </CardBody>
        </Card>
      </Container>

      <Modal isOpen={editOpen} toggle={() => setEditOpen(false)} centered>
        <form onSubmit={save}>
          <ModalHeader toggle={() => setEditOpen(false)}>
            {selected ? "Edit Plan" : "New Plan"}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Name</Label>
              <Input name="name" value={form.name} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input name="description" value={form.description} onChange={onChange} />
            </FormGroup>
            <Row className="g-2">
              <Col md={4}>
                <FormGroup>
                  <Label>Price (cents)</Label>
                  <Input type="number" min="0" name="price_cents" value={form.price_cents} onChange={onChange} required />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Currency</Label>
                  <Input name="currency" value={form.currency} onChange={onChange} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Interval</Label>
                  <Input type="select" name="interval" value={form.interval} onChange={onChange}>
                    <option value="month">month</option>
                    <option value="year">year</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Stripe Price ID</Label>
              <Input name="stripe_price_id" value={form.stripe_price_id} onChange={onChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button color="primary" type="submit">{selected ? "Save" : "Create"}</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPlans;

