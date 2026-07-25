import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Input,
  FormGroup,
  Label,
  Badge,
} from "reactstrap";
import AiPromptsService from "../../../services/Admin/AiPromptsService";
import { toast } from "react-toastify";

const AdminAiPrompts = () => {
  const service = new AiPromptsService();
  const [list, setList] = useState([]);
  const [placeholders, setPlaceholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [form, setForm] = useState({
    name: "",
    system_template: "",
    user_template: "",
  });

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadList = async () => {
    try {
      setLoading(true);
      const { data } = await service.list();
      const prompts = data?.prompts || [];
      setList(prompts);
      setPlaceholders(data?.placeholders || []);
      if (prompts.length && !selectedKey) {
        selectPrompt(prompts[0]);
      }
    } catch (e) {
      toast.error("Failed to load AI prompts");
    } finally {
      setLoading(false);
    }
  };

  const selectPrompt = (row) => {
    setSelectedKey(row.key);
    setForm({
      name: row.name || "",
      system_template: row.system_template || "",
      user_template: row.user_template || "",
    });
  };

  const loadSelected = async (key) => {
    try {
      const { data } = await service.get(key);
      const prompt = data?.prompt;
      if (!prompt) return;
      setPlaceholders(data?.placeholders || placeholders);
      selectPrompt(prompt);
    } catch (e) {
      toast.error("Failed to load prompt");
    }
  };

  const save = async (e) => {
    e?.preventDefault?.();
    if (!selectedKey) return;
    try {
      setSaving(true);
      const { data } = await service.update(selectedKey, {
        name: form.name,
        system_template: form.system_template,
        user_template: form.user_template,
      });
      toast.success("Prompt saved");
      const prompt = data?.prompt;
      if (prompt) {
        setList((prev) =>
          prev.map((p) => (p.key === prompt.key ? { ...p, ...prompt } : p))
        );
        selectPrompt(prompt);
      } else {
        loadList();
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-container">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3 className="page-title mb-0">AI Prompts</h3>
            <div className="text-muted small mt-1">
              Edit system + user templates used for brand name generation. Use{" "}
              <code>{"{{placeholders}}"}</code> for dynamic questionnaire values.
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg="4" className="mb-3">
            <Card>
              <CardBody>
                {loading && <div className="text-muted">Loading...</div>}
                <Table hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((row) => (
                      <tr
                        key={row.key}
                        style={{ cursor: "pointer" }}
                        className={selectedKey === row.key ? "table-active" : ""}
                        onClick={() => loadSelected(row.key)}
                      >
                        <td>
                          <code>{row.key}</code>
                        </td>
                        <td>{row.name}</td>
                      </tr>
                    ))}
                    {!loading && list.length === 0 && (
                      <tr>
                        <td colSpan="2" className="text-muted text-center py-3">
                          No prompts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                {placeholders.length > 0 && (
                  <div className="mt-3">
                    <Label className="mb-2">Available placeholders</Label>
                    <div className="d-flex flex-wrap gap-1">
                      {placeholders.map((p) => (
                        <Badge key={p} color="light" className="text-dark border">
                          {`{{${p}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col lg="8" className="mb-3">
            <Card>
              <CardBody>
                {!selectedKey && (
                  <div className="text-muted">Select a prompt to edit.</div>
                )}
                {selectedKey && (
                  <form onSubmit={save}>
                    <FormGroup>
                      <Label>Key</Label>
                      <Input value={selectedKey} disabled />
                    </FormGroup>
                    <FormGroup>
                      <Label>Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>System template (master prompt)</Label>
                      <Input
                        type="textarea"
                        rows={16}
                        value={form.system_template}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            system_template: e.target.value,
                          }))
                        }
                        required
                        style={{ fontFamily: "monospace", fontSize: 12 }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>User template (JSON output instructions)</Label>
                      <Input
                        type="textarea"
                        rows={10}
                        value={form.user_template}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            user_template: e.target.value,
                          }))
                        }
                        style={{ fontFamily: "monospace", fontSize: 12 }}
                      />
                    </FormGroup>
                    <div className="d-flex justify-content-end">
                      <Button color="primary" type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save prompt"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminAiPrompts;
