import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Input, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from "reactstrap";
import MarketingFaqsService from "../../../../services/Admin/MarketingFaqsService";
import { toast } from "react-toastify";

const AdminMarketingFaqs = () => {
  const service = new MarketingFaqsService();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ question_en: "", question_ar: "", answer_en: "", answer_ar: "", is_active: true, sort_order: 0 });

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await service.list();
      setList(data?.faqs || []);
    } catch (e) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelected(null);
    setForm({ question_en: "", question_ar: "", answer_en: "", answer_ar: "", is_active: true, sort_order: 0 });
    setEditOpen(true);
  };

  const openEdit = (row) => {
    setSelected(row);
    setForm({
      question_en: row.question_en || "",
      question_ar: row.question_ar || "",
      answer_en: row.answer_en || "",
      answer_ar: row.answer_ar || "",
      is_active: !!row.is_active,
      sort_order: row.sort_order || 0,
    });
    setEditOpen(true);
  };

  const save = async (e) => {
    e?.preventDefault?.();
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order || "0", 10), is_active: !!form.is_active };
      if (selected) await service.update(selected.id, payload);
      else await service.create(payload);
      toast.success(selected ? "FAQ updated" : "FAQ created");
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
    if (!window.confirm("Delete this FAQ?")) return;
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
          <Col><h3 className="page-title mb-0">Marketing FAQs</h3></Col>
          <Col md="auto"><Button color="primary" onClick={openCreate}><i className="fa fa-plus me-2"></i>New FAQ</Button></Col>
        </Row>
        <Card>
          <CardBody>
            {loading && <div className="text-muted">Loading...</div>}
            <Table hover responsive className="mb-0">
              <thead><tr><th>Question EN</th><th>Sort</th><th>Active</th><th className="text-end">Actions</th></tr></thead>
              <tbody>
                {!loading && list.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-4">No FAQs found.</td></tr>}
                {list.map((row) => (
                  <tr key={row.id}>
                    <td>{row.question_en}</td>
                    <td>{row.sort_order}</td>
                    <td>{row.is_active ? "Yes" : "No"}</td>
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
      <Modal isOpen={editOpen} toggle={() => setEditOpen(false)} centered size="lg">
        <ModalHeader toggle={() => setEditOpen(false)}>{selected ? "Edit FAQ" : "New FAQ"}</ModalHeader>
        <form onSubmit={save}>
          <ModalBody>
            <FormGroup><Label>Question EN</Label><Input required value={form.question_en} onChange={(e) => setForm({ ...form, question_en: e.target.value })} /></FormGroup>
            <FormGroup><Label>Question AR</Label><Input value={form.question_ar} onChange={(e) => setForm({ ...form, question_ar: e.target.value })} /></FormGroup>
            <FormGroup><Label>Answer EN</Label><Input type="textarea" rows={4} required value={form.answer_en} onChange={(e) => setForm({ ...form, answer_en: e.target.value })} /></FormGroup>
            <FormGroup><Label>Answer AR</Label><Input type="textarea" rows={4} value={form.answer_ar} onChange={(e) => setForm({ ...form, answer_ar: e.target.value })} /></FormGroup>
            <FormGroup><Label>Sort</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></FormGroup>
            <FormGroup check><Label check><Input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</Label></FormGroup>
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

export default AdminMarketingFaqs;
