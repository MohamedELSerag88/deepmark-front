import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Input, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from "reactstrap";
import MarketingPricingService from "../../../../services/Admin/MarketingPricingService";
import { toast } from "react-toastify";

const empty = {
  slug: "", name_en: "", name_ar: "", price_display: "", currency_symbol: "$",
  description_en: "", description_ar: "", features_en: "[]", features_ar: "[]",
  badge_en: "", badge_ar: "", is_recommended: false, cta_label_en: "Start Now", cta_label_ar: "",
  cta_url: "/contact", is_active: true, sort_order: 0,
};

const AdminMarketingPricing = () => {
  const service = new MarketingPricingService();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(empty);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await service.list();
      setList(data?.packages || []);
    } catch (e) {
      toast.error("Failed to load pricing");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setSelected(null); setForm(empty); setEditOpen(true); };

  const openEdit = (row) => {
    setSelected(row);
    setForm({
      slug: row.slug || "",
      name_en: row.name_en || "",
      name_ar: row.name_ar || "",
      price_display: row.price_display || "",
      currency_symbol: row.currency_symbol || "$",
      description_en: row.description_en || "",
      description_ar: row.description_ar || "",
      features_en: JSON.stringify(row.features_en || [], null, 2),
      features_ar: JSON.stringify(row.features_ar || [], null, 2),
      badge_en: row.badge_en || "",
      badge_ar: row.badge_ar || "",
      is_recommended: !!row.is_recommended,
      cta_label_en: row.cta_label_en || "Start Now",
      cta_label_ar: row.cta_label_ar || "",
      cta_url: row.cta_url || "/contact",
      is_active: !!row.is_active,
      sort_order: row.sort_order || 0,
    });
    setEditOpen(true);
  };

  const save = async (e) => {
    e?.preventDefault?.();
    try {
      const payload = {
        ...form,
        features_en: JSON.parse(form.features_en || "[]"),
        features_ar: JSON.parse(form.features_ar || "[]"),
        sort_order: parseInt(form.sort_order || "0", 10),
        is_active: !!form.is_active,
        is_recommended: !!form.is_recommended,
      };
      if (selected) await service.update(selected.id, payload);
      else await service.create(payload);
      toast.success(selected ? "Package updated" : "Package created");
      setEditOpen(false);
      load();
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

  const del = async (row) => {
    if (!window.confirm("Delete this package?")) return;
    try {
      await service.remove(row.id);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-container">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col><h3 className="page-title mb-0">Marketing Pricing</h3></Col>
          <Col md="auto"><Button color="primary" onClick={openCreate}><i className="fa fa-plus me-2"></i>New Package</Button></Col>
        </Row>
        <Card>
          <CardBody>
            {loading && <div className="text-muted">Loading...</div>}
            <Table hover responsive className="mb-0">
              <thead><tr><th>Name</th><th>Price</th><th>Recommended</th><th className="text-end">Actions</th></tr></thead>
              <tbody>
                {!loading && list.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-4">No packages found.</td></tr>}
                {list.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name_en}</td>
                    <td>{row.currency_symbol}{row.price_display}</td>
                    <td>{row.is_recommended ? "Yes" : "No"}</td>
                    <td className="text-end">
                      <Button size="sm" outline color="primary" className="me-2" onClick={() => openEdit(row)}><i className="fa fa-pencil"></i></Button>
                      <Button size="sm" outline color="danger" onClick={() => del(row)}><i className="fa fa-trash"></i></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
      <Modal isOpen={editOpen} toggle={() => setEditOpen(false)} size="lg" centered>
        <ModalHeader toggle={() => setEditOpen(false)}>{selected ? "Edit Package" : "New Package"}</ModalHeader>
        <form onSubmit={save}>
          <ModalBody>
            <Row>
              <Col md="6"><FormGroup><Label>Slug</Label><Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></FormGroup></Col>
              <Col md="3"><FormGroup><Label>Price</Label><Input value={form.price_display} onChange={(e) => setForm({ ...form, price_display: e.target.value })} /></FormGroup></Col>
              <Col md="3"><FormGroup><Label>Currency</Label><Input value={form.currency_symbol} onChange={(e) => setForm({ ...form, currency_symbol: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Name EN</Label><Input required value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Name AR</Label><Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Description EN</Label><Input type="textarea" rows={2} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Description AR</Label><Input type="textarea" rows={2} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Features EN (JSON)</Label><Input type="textarea" rows={5} value={form.features_en} onChange={(e) => setForm({ ...form, features_en: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Features AR (JSON)</Label><Input type="textarea" rows={5} value={form.features_ar} onChange={(e) => setForm({ ...form, features_ar: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Badge EN</Label><Input value={form.badge_en} onChange={(e) => setForm({ ...form, badge_en: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Badge AR</Label><Input value={form.badge_ar} onChange={(e) => setForm({ ...form, badge_ar: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>CTA label EN</Label><Input value={form.cta_label_en} onChange={(e) => setForm({ ...form, cta_label_en: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>CTA URL</Label><Input value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} /></FormGroup></Col>
              <Col md="4"><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={!!form.is_recommended} onChange={(e) => setForm({ ...form, is_recommended: e.target.checked })} /> Recommended</Label></FormGroup></Col>
              <Col md="4"><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</Label></FormGroup></Col>
              <Col md="4"><FormGroup><Label>Sort</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></FormGroup></Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" color="primary">Save</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMarketingPricing;
