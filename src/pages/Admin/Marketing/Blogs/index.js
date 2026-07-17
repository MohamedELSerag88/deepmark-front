import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Input, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from "reactstrap";
import MarketingBlogsService from "../../../../services/Admin/MarketingBlogsService";
import { toast } from "react-toastify";

const empty = {
  slug: "", published_at: "", title_en: "", title_ar: "", badge_en: "", badge_ar: "",
  image_url: "", author_name: "", author_title_en: "", author_title_ar: "", author_avatar_url: "",
  lead_en: "", lead_ar: "", content_en: "[]", content_ar: "[]", is_active: true, sort_order: 0,
};

const AdminMarketingBlogs = () => {
  const service = new MarketingBlogsService();
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
      setList(data?.posts || []);
    } catch (e) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setSelected(null); setForm(empty); setEditOpen(true); };

  const openEdit = (row) => {
    setSelected(row);
    setForm({
      slug: row.slug || "",
      published_at: row.published_at ? String(row.published_at).slice(0, 10) : "",
      title_en: row.title_en || "",
      title_ar: row.title_ar || "",
      badge_en: row.badge_en || "",
      badge_ar: row.badge_ar || "",
      image_url: row.image_url || "",
      author_name: row.author_name || "",
      author_title_en: row.author_title_en || "",
      author_title_ar: row.author_title_ar || "",
      author_avatar_url: row.author_avatar_url || "",
      lead_en: row.lead_en || "",
      lead_ar: row.lead_ar || "",
      content_en: JSON.stringify(row.content_en || [], null, 2),
      content_ar: JSON.stringify(row.content_ar || [], null, 2),
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
        content_en: JSON.parse(form.content_en || "[]"),
        content_ar: JSON.parse(form.content_ar || "[]"),
        sort_order: parseInt(form.sort_order || "0", 10),
        is_active: !!form.is_active,
      };
      if (selected) await service.update(selected.id, payload);
      else await service.create(payload);
      toast.success(selected ? "Post updated" : "Post created");
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
    if (!window.confirm("Delete this post?")) return;
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
          <Col><h3 className="page-title mb-0">Marketing Blogs</h3></Col>
          <Col md="auto"><Button color="primary" onClick={openCreate}><i className="fa fa-plus me-2"></i>New Post</Button></Col>
        </Row>
        <Card>
          <CardBody>
            {loading && <div className="text-muted">Loading...</div>}
            <Table hover responsive className="mb-0">
              <thead><tr><th>Title EN</th><th>Slug</th><th>Active</th><th className="text-end">Actions</th></tr></thead>
              <tbody>
                {!loading && list.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-4">No posts found.</td></tr>}
                {list.map((row) => (
                  <tr key={row.id}>
                    <td>{row.title_en}</td>
                    <td>{row.slug}</td>
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
      <Modal isOpen={editOpen} toggle={() => setEditOpen(false)} size="lg" centered>
        <ModalHeader toggle={() => setEditOpen(false)}>{selected ? "Edit Post" : "New Post"}</ModalHeader>
        <form onSubmit={save}>
          <ModalBody>
            <Row>
              <Col md="6"><FormGroup><Label>Slug</Label><Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Published at</Label><Input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Title EN</Label><Input required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Title AR</Label><Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Badge EN</Label><Input value={form.badge_en} onChange={(e) => setForm({ ...form, badge_en: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Badge AR</Label><Input value={form.badge_ar} onChange={(e) => setForm({ ...form, badge_ar: e.target.value })} /></FormGroup></Col>
              <Col md="12"><FormGroup><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></FormGroup></Col>
              <Col md="4"><FormGroup><Label>Author</Label><Input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} /></FormGroup></Col>
              <Col md="4"><FormGroup><Label>Author title EN</Label><Input value={form.author_title_en} onChange={(e) => setForm({ ...form, author_title_en: e.target.value })} /></FormGroup></Col>
              <Col md="4"><FormGroup><Label>Author title AR</Label><Input value={form.author_title_ar} onChange={(e) => setForm({ ...form, author_title_ar: e.target.value })} /></FormGroup></Col>
              <Col md="12"><FormGroup><Label>Author avatar URL</Label><Input value={form.author_avatar_url} onChange={(e) => setForm({ ...form, author_avatar_url: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Lead EN</Label><Input type="textarea" rows={2} value={form.lead_en} onChange={(e) => setForm({ ...form, lead_en: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Lead AR</Label><Input type="textarea" rows={2} value={form.lead_ar} onChange={(e) => setForm({ ...form, lead_ar: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Content EN (JSON)</Label><Input type="textarea" rows={5} value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Content AR (JSON)</Label><Input type="textarea" rows={5} value={form.content_ar} onChange={(e) => setForm({ ...form, content_ar: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup><Label>Sort</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></FormGroup></Col>
              <Col md="6"><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</Label></FormGroup></Col>
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

export default AdminMarketingBlogs;
