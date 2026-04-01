import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Input, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from "reactstrap";
import QuestionsService from "../../../services/Admin/QuestionsService";
import { toast } from "react-toastify";

const AdminQuestions = () => {
  const service = new QuestionsService();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    question_en: "",
    question_ar: "",
    question_type: "",
    description_en: "",
    description_ar: "",
    why_matters: "",
    video_url: "",
    image_url: "",
    example_answer: "",
    resources: [],
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await service.list();
      setList(data?.data || []);
    } catch (e) {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelected(null);
    setForm({
      question_en: "",
      question_ar: "",
      question_type: "",
      description_en: "",
      description_ar: "",
      why_matters: "",
      video_url: "",
      image_url: "",
      example_answer: "",
      resources: [],
    });
    setEditOpen(true);
  };

  const openEdit = (q) => {
    setSelected(q);
    setForm({
      question_en: q.question_en || "",
      question_ar: q.question_ar || "",
      question_type: q.question_type || "",
      description_en: q.description_en || "",
      description_ar: q.description_ar || "",
      why_matters: q.why_matters || "",
      video_url: q.video_url || "",
      image_url: q.image_url || "",
      example_answer: q.example_answer || "",
      resources: Array.isArray(q.resources) ? q.resources : [],
    });
    setEditOpen(true);
  };

  const save = async (e) => {
    e?.preventDefault?.();
    try {
      const resources = Array.isArray(form.resources)
        ? form.resources
            .map((r) => ({
              url: (r?.url || "").trim(),
              text: (r?.text || "").trim(),
            }))
            .filter((r) => r.url !== "" || r.text !== "")
        : [];
      if (selected) {
        await service.update(selected.id, {
          question_en: form.question_en,
          question_ar: form.question_ar,
          question_type: form.question_type,
          description_en: form.description_en,
          description_ar: form.description_ar,
          why_matters: form.why_matters,
          video_url: form.video_url,
          image_url: form.image_url,
          example_answer: form.example_answer,
          resources,
        });
        toast.success("Question updated");
      } else {
        await service.create({
          question_en: form.question_en,
          question_ar: form.question_ar,
          question_type: form.question_type,
          description_en: form.description_en,
          description_ar: form.description_ar,
          why_matters: form.why_matters,
          video_url: form.video_url,
          image_url: form.image_url,
          example_answer: form.example_answer,
          resources,
        });
        toast.success("Question created");
      }
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

  const del = async (q) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await service.remove(q.id);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const changeResource = (idx, key, value) => {
    setForm((prev) => {
      const next = Array.isArray(prev.resources) ? [...prev.resources] : [];
      next[idx] = { ...(next[idx] || {}), [key]: value };
      return { ...prev, resources: next };
    });
  };

  const addResource = () => {
    setForm((prev) => ({ ...prev, resources: [...(prev.resources || []), { url: "", text: "" }] }));
  };

  const removeResource = (idx) => {
    setForm((prev) => {
      const next = [...(prev.resources || [])];
      next.splice(idx, 1);
      return { ...prev, resources: next };
    });
  };

  return (
    <div className="admin-container questions-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3 className="page-title mb-0">Questions</h3>
          </Col>
          <Col md="auto">
            <Button color="primary" onClick={openCreate}>
              <i className="fa fa-plus me-2"></i>
              New Question
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
                  <th className="w-50">Question (EN)</th>
                  <th className="w-25">Type</th>
                  <th className="text-end w-25">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && !loading && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">No questions found.</td>
                  </tr>
                )}
                {list.map((q) => (
                  <tr key={q.id}>
                    <td>{q.question_en}</td>
                    <td className="text-muted">{q.question_type || "-"}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <Button size="sm" outline color="primary" onClick={() => openEdit(q)}>
                          <i className="fa fa-pencil"></i>
                        </Button>
                        <Button size="sm" outline color="danger" onClick={() => del(q)}>
                          <i className="fa fa-trash"></i>
                        </Button>
                      </div>
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
          <ModalHeader toggle={() => setEditOpen(false)}>
            {selected ? "Edit Question" : "New Question"}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Question (EN)</Label>
              <Input name="question_en" value={form.question_en} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Question (AR)</Label>
              <Input name="question_ar" value={form.question_ar} onChange={onChange} />
            </FormGroup>
            <Row className="g-2">
              <Col md={6}>
                <FormGroup>
                  <Label>Type</Label>
                  <Input name="question_type" value={form.question_type} onChange={onChange} placeholder="text, select, multi_select ..." />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Example answer</Label>
                  <Input name="example_answer" value={form.example_answer} onChange={onChange} />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Description (EN)</Label>
              <Input name="description_en" value={form.description_en} onChange={onChange} />
            </FormGroup>
            <FormGroup>
              <Label>Description (AR)</Label>
              <Input name="description_ar" value={form.description_ar} onChange={onChange} />
            </FormGroup>
            <FormGroup>
              <Label>Why it matters</Label>
              <Input name="why_matters" value={form.why_matters} onChange={onChange} />
            </FormGroup>
            <Row className="g-2">
              <Col md={6}>
                <FormGroup>
                  <Label>Video URL</Label>
                  <Input name="video_url" value={form.video_url} onChange={onChange} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Image URL</Label>
                  <Input name="image_url" value={form.image_url} onChange={onChange} />
                </FormGroup>
              </Col>
            </Row>
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Label className="mb-0">Helpful resources</Label>
                <Button size="sm" color="secondary" outline onClick={addResource}>
                  <i className="fa fa-plus me-1"></i>Add
                </Button>
              </div>
              {(form.resources || []).length === 0 && (
                <div className="text-muted small mb-2">Add links or notes that help users answer this question.</div>
              )}
              {(form.resources || []).map((r, idx) => (
                <Row className="g-2 align-items-start mb-2" key={`res-${idx}`}>
                  <Col md={5}>
                    <Input
                      placeholder="URL or title"
                      value={r?.url || ""}
                      onChange={(e) => changeResource(idx, "url", e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      placeholder="Short description"
                      value={r?.text || ""}
                      onChange={(e) => changeResource(idx, "text", e.target.value)}
                    />
                  </Col>
                  <Col md={1} className="text-end">
                    <Button size="sm" color="danger" outline onClick={() => removeResource(idx)}>
                      <i className="fa fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>
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

export default AdminQuestions;

