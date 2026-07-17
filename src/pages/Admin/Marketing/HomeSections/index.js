import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Input, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from "reactstrap";
import MarketingHomeSectionsService from "../../../../services/Admin/MarketingHomeSectionsService";
import { toast } from "react-toastify";

const AdminMarketingHomeSections = () => {
  const service = new MarketingHomeSectionsService();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    section_key: "",
    content_en: "{}",
    content_ar: "{}",
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await service.list();
      setList(data?.sections || []);
    } catch (e) {
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelected(null);
    setForm({ section_key: "", content_en: "{}", content_ar: "{}", is_active: true, sort_order: 0 });
    setEditOpen(true);
  };

  const openEdit = (row) => {
    setSelected(row);
    setForm({
      section_key: row.section_key || "",
      content_en: JSON.stringify(row.content_en || {}, null, 2),
      content_ar: JSON.stringify(row.content_ar || {}, null, 2),
      is_active: !!row.is_active,
      sort_order: row.sort_order || 0,
    });
    setEditOpen(true);
  };

  const save = async (e) => {
    e?.preventDefault?.();
    try {
      const payload = {
        section_key: form.section_key,
        content_en: JSON.parse(form.content_en || "{}"),
        content_ar: JSON.parse(form.content_ar || "{}"),
        is_active: !!form.is_active,
        sort_order: parseInt(form.sort_order || "0", 10),
      };
      if (selected) {
        await service.update(selected.id, payload);
        toast.success("Section updated");
      } else {
        await service.create(payload);
        toast.success("Section created");
      }
      setEditOpen(false);
      load();
    } catch (err) {
      const data = err?.response?.data;
      let msg = data?.message || "Save failed (check JSON)";
      if (data?.errors) {
        const first = Object.values(data.errors).flat()[0];
        if (first) msg = first;
      }
      toast.error(msg);
    }
  };

  const del = async (row) => {
    if (!window.confirm("Delete this section?")) return;
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
          <Col><h3 className="page-title mb-0">Home Sections</h3></Col>
          <Col md="auto">
            <Button color="primary" onClick={openCreate}><i className="fa fa-plus me-2"></i>New Section</Button>
          </Col>
        </Row>
        <Card>
          <CardBody>
            {loading && <div className="text-muted">Loading...</div>}
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Sort</th>
                  <th>Active</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && list.length === 0 && (
                  <tr><td colSpan="4" className="text-center text-muted py-4">No sections found.</td></tr>
                )}
                {list.map((row) => (
                  <tr key={row.id}>
                    <td>{row.section_key}</td>
                    <td>{row.sort_order}</td>
                    <td>{row.is_active ? "Yes" : "No"}</td>
                    <td className="text-end">
                      <Button size="sm" outline color="primary" className="me-2" onClick={() => openEdit(row)}>
                        <i className="fa fa-pencil"></i>
                      </Button>
                      <Button size="sm" outline color="danger" onClick={() => del(row)}>
                        <i className="fa fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>

      <Modal isOpen={editOpen} toggle={() => setEditOpen(false)} size="lg" centered>
        <ModalHeader toggle={() => setEditOpen(false)}>{selected ? "Edit Section" : "New Section"}</ModalHeader>
        <form onSubmit={save}>
          <ModalBody>
            <FormGroup>
              <Label>Section key</Label>
              <Input name="section_key" value={form.section_key} onChange={(e) => setForm({ ...form, section_key: e.target.value })} required />
            </FormGroup>
            <FormGroup>
              <Label>Content EN (JSON)</Label>
              <Input type="textarea" rows={8} value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Content AR (JSON)</Label>
              <Input type="textarea" rows={8} value={form.content_ar} onChange={(e) => setForm({ ...form, content_ar: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active
              </Label>
            </FormGroup>
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

export default AdminMarketingHomeSections;
