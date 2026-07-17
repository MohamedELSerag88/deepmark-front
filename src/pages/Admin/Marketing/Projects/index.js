import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Input, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from "reactstrap";
import MarketingProjectsService from "../../../../services/Admin/MarketingProjectsService";
import { toast } from "react-toastify";

const AdminMarketingProjects = () => {
  const service = new MarketingProjectsService();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await service.list();
      setList(data?.projects || []);
    } catch (e) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (row) => {
    setSelected(row);
    setForm({
      is_marketing_featured: !!row.is_marketing_featured,
      marketing_image_url: row.marketing_image_url || "",
      marketing_author_name: row.marketing_author_name || "",
      marketing_author_position: row.marketing_author_position || "",
      marketing_author_avatar_url: row.marketing_author_avatar_url || "",
      marketing_description_en: row.marketing_description_en || "",
      marketing_description_ar: row.marketing_description_ar || "",
      marketing_lead_en: row.marketing_lead_en || "",
      marketing_lead_ar: row.marketing_lead_ar || "",
      marketing_gallery_images: JSON.stringify(row.marketing_gallery_images || [], null, 2),
      marketing_content_en: JSON.stringify(row.marketing_content_en || [], null, 2),
      marketing_content_ar: JSON.stringify(row.marketing_content_ar || [], null, 2),
      marketing_deliverables_en: JSON.stringify(row.marketing_deliverables_en || [], null, 2),
      marketing_deliverables_ar: JSON.stringify(row.marketing_deliverables_ar || [], null, 2),
    });
    setEditOpen(true);
  };

  const save = async (e) => {
    e?.preventDefault?.();
    try {
      const payload = {
        is_marketing_featured: !!form.is_marketing_featured,
        marketing_image_url: form.marketing_image_url,
        marketing_author_name: form.marketing_author_name,
        marketing_author_position: form.marketing_author_position,
        marketing_author_avatar_url: form.marketing_author_avatar_url,
        marketing_description_en: form.marketing_description_en,
        marketing_description_ar: form.marketing_description_ar,
        marketing_lead_en: form.marketing_lead_en,
        marketing_lead_ar: form.marketing_lead_ar,
        marketing_gallery_images: JSON.parse(form.marketing_gallery_images || "[]"),
        marketing_content_en: JSON.parse(form.marketing_content_en || "[]"),
        marketing_content_ar: JSON.parse(form.marketing_content_ar || "[]"),
        marketing_deliverables_en: JSON.parse(form.marketing_deliverables_en || "[]"),
        marketing_deliverables_ar: JSON.parse(form.marketing_deliverables_ar || "[]"),
      };
      await service.update(selected.id, payload);
      toast.success("Project updated");
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

  return (
    <div className="admin-container">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col><h3 className="page-title mb-0">Marketing Portfolio (Brand Names)</h3></Col>
        </Row>
        <Card>
          <CardBody>
            {loading && <div className="text-muted">Loading...</div>}
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Archetype</th>
                  <th>Featured</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && list.length === 0 && (
                  <tr><td colSpan="4" className="text-center text-muted py-4">No suggestions found.</td></tr>
                )}
                {list.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.archetype || "—"}</td>
                    <td>{row.is_marketing_featured ? "Yes" : "No"}</td>
                    <td className="text-end">
                      <Button size="sm" outline color="primary" onClick={() => openEdit(row)}>
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

      <Modal isOpen={editOpen} toggle={() => setEditOpen(false)} size="lg" centered>
        <ModalHeader toggle={() => setEditOpen(false)}>Edit Portfolio Project — {selected?.name}</ModalHeader>
        <form onSubmit={save}>
          <ModalBody>
            <FormGroup check className="mb-3">
              <Label check>
                <Input type="checkbox" checked={!!form.is_marketing_featured} onChange={(e) => setForm({ ...form, is_marketing_featured: e.target.checked })} />
                {" "}Feature on marketing site
              </Label>
            </FormGroup>
            <FormGroup><Label>Image URL</Label><Input value={form.marketing_image_url || ""} onChange={(e) => setForm({ ...form, marketing_image_url: e.target.value })} /></FormGroup>
            <Row>
              <Col md="4"><FormGroup><Label>Author name</Label><Input value={form.marketing_author_name || ""} onChange={(e) => setForm({ ...form, marketing_author_name: e.target.value })} /></FormGroup></Col>
              <Col md="4"><FormGroup><Label>Author position</Label><Input value={form.marketing_author_position || ""} onChange={(e) => setForm({ ...form, marketing_author_position: e.target.value })} /></FormGroup></Col>
              <Col md="4"><FormGroup><Label>Author avatar URL</Label><Input value={form.marketing_author_avatar_url || ""} onChange={(e) => setForm({ ...form, marketing_author_avatar_url: e.target.value })} /></FormGroup></Col>
            </Row>
            <FormGroup><Label>Description EN</Label><Input type="textarea" rows={2} value={form.marketing_description_en || ""} onChange={(e) => setForm({ ...form, marketing_description_en: e.target.value })} /></FormGroup>
            <FormGroup><Label>Description AR</Label><Input type="textarea" rows={2} value={form.marketing_description_ar || ""} onChange={(e) => setForm({ ...form, marketing_description_ar: e.target.value })} /></FormGroup>
            <FormGroup><Label>Lead EN</Label><Input type="textarea" rows={3} value={form.marketing_lead_en || ""} onChange={(e) => setForm({ ...form, marketing_lead_en: e.target.value })} /></FormGroup>
            <FormGroup><Label>Lead AR</Label><Input type="textarea" rows={3} value={form.marketing_lead_ar || ""} onChange={(e) => setForm({ ...form, marketing_lead_ar: e.target.value })} /></FormGroup>
            <FormGroup><Label>Gallery images (JSON)</Label><Input type="textarea" rows={3} value={form.marketing_gallery_images || ""} onChange={(e) => setForm({ ...form, marketing_gallery_images: e.target.value })} /></FormGroup>
            <FormGroup><Label>Content EN (JSON array)</Label><Input type="textarea" rows={4} value={form.marketing_content_en || ""} onChange={(e) => setForm({ ...form, marketing_content_en: e.target.value })} /></FormGroup>
            <FormGroup><Label>Content AR (JSON array)</Label><Input type="textarea" rows={4} value={form.marketing_content_ar || ""} onChange={(e) => setForm({ ...form, marketing_content_ar: e.target.value })} /></FormGroup>
            <FormGroup><Label>Deliverables EN (JSON)</Label><Input type="textarea" rows={3} value={form.marketing_deliverables_en || ""} onChange={(e) => setForm({ ...form, marketing_deliverables_en: e.target.value })} /></FormGroup>
            <FormGroup><Label>Deliverables AR (JSON)</Label><Input type="textarea" rows={3} value={form.marketing_deliverables_ar || ""} onChange={(e) => setForm({ ...form, marketing_deliverables_ar: e.target.value })} /></FormGroup>
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

export default AdminMarketingProjects;
