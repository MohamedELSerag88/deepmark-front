import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, FormGroup, Label, Input } from "reactstrap";
import MarketingSettingsService from "../../../../services/Admin/MarketingSettingsService";
import { toast } from "react-toastify";

const empty = {
  brand_name_en: "",
  brand_name_ar: "",
  logo_url: "",
  login_cta_label_en: "",
  login_cta_label_ar: "",
  login_cta_url: "",
  start_cta_label_en: "",
  start_cta_label_ar: "",
  start_cta_url: "",
  footer_tagline_en: "",
  footer_tagline_ar: "",
  footer_copyright_en: "",
  footer_copyright_ar: "",
  newsletter_placeholder_en: "",
  newsletter_placeholder_ar: "",
  contact_email: "",
  contact_email_label_en: "",
  contact_email_label_ar: "",
  contact_email_desc_en: "",
  contact_email_desc_ar: "",
  contact_pill_en: "",
  contact_pill_ar: "",
  contact_form_label_en: "",
  contact_form_label_ar: "",
  contact_form_title_en: "",
  contact_form_title_ar: "",
  contact_form_lead_en: "",
  contact_form_lead_ar: "",
  contact_side_label_en: "",
  contact_side_label_ar: "",
  contact_side_title_en: "",
  contact_side_title_ar: "",
  contact_side_lead_en: "",
  contact_side_lead_ar: "",
  contact_response_note_en: "",
  contact_response_note_ar: "",
  blogs_pill_en: "",
  blogs_pill_ar: "",
  blogs_title_en: "",
  blogs_title_ar: "",
  blogs_subtitle_en: "",
  blogs_subtitle_ar: "",
  social_links_json: "[]",
  contact_checklist_en_json: "[]",
  contact_checklist_ar_json: "[]",
};

const AdminMarketingSettings = () => {
  const service = new MarketingSettingsService();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await service.get();
      const s = data?.settings || {};
      setForm({
        ...empty,
        ...s,
        social_links_json: JSON.stringify(s.social_links || [], null, 2),
        contact_checklist_en_json: JSON.stringify(s.contact_checklist_en || [], null, 2),
        contact_checklist_ar_json: JSON.stringify(s.contact_checklist_ar || [], null, 2),
      });
    } catch (e) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const save = async (e) => {
    e?.preventDefault?.();
    try {
      setSaving(true);
      const payload = { ...form };
      delete payload.social_links_json;
      delete payload.contact_checklist_en_json;
      delete payload.contact_checklist_ar_json;
      payload.social_links = JSON.parse(form.social_links_json || "[]");
      payload.contact_checklist_en = JSON.parse(form.contact_checklist_en_json || "[]");
      payload.contact_checklist_ar = JSON.parse(form.contact_checklist_ar_json || "[]");
      await service.update(payload);
      toast.success("Settings saved");
      load();
    } catch (err) {
      const data = err?.response?.data;
      let msg = data?.message || "Save failed";
      if (data?.errors) {
        const first = Object.values(data.errors).flat()[0];
        if (first) msg = first;
      }
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const field = (label, name, type = "text") => (
    <FormGroup>
      <Label>{label}</Label>
      {type === "textarea" ? (
        <Input type="textarea" rows={3} name={name} value={form[name] || ""} onChange={onChange} />
      ) : (
        <Input type={type} name={name} value={form[name] || ""} onChange={onChange} />
      )}
    </FormGroup>
  );

  return (
    <div className="admin-container">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3 className="page-title mb-0">Marketing Settings</h3>
          </Col>
          <Col md="auto">
            <Button color="primary" onClick={save} disabled={saving || loading}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </Col>
        </Row>
        <Card>
          <CardBody>
            {loading && <div className="text-muted">Loading...</div>}
            {!loading && (
              <form onSubmit={save}>
                <Row>
                  <Col md="6">{field("Brand name (EN)", "brand_name_en")}</Col>
                  <Col md="6">{field("Brand name (AR)", "brand_name_ar")}</Col>
                  <Col md="12">{field("Logo URL", "logo_url")}</Col>
                  <Col md="6">{field("Login CTA (EN)", "login_cta_label_en")}</Col>
                  <Col md="6">{field("Login CTA (AR)", "login_cta_label_ar")}</Col>
                  <Col md="6">{field("Login CTA URL", "login_cta_url")}</Col>
                  <Col md="6">{field("Start CTA (EN)", "start_cta_label_en")}</Col>
                  <Col md="6">{field("Start CTA (AR)", "start_cta_label_ar")}</Col>
                  <Col md="6">{field("Start CTA URL", "start_cta_url")}</Col>
                  <Col md="6">{field("Footer tagline (EN)", "footer_tagline_en", "textarea")}</Col>
                  <Col md="6">{field("Footer tagline (AR)", "footer_tagline_ar", "textarea")}</Col>
                  <Col md="6">{field("Copyright (EN)", "footer_copyright_en")}</Col>
                  <Col md="6">{field("Copyright (AR)", "footer_copyright_ar")}</Col>
                  <Col md="6">{field("Newsletter placeholder (EN)", "newsletter_placeholder_en")}</Col>
                  <Col md="6">{field("Newsletter placeholder (AR)", "newsletter_placeholder_ar")}</Col>
                  <Col md="12">{field("Social links (JSON)", "social_links_json", "textarea")}</Col>
                  <Col md="6">{field("Contact email", "contact_email")}</Col>
                  <Col md="6">{field("Contact email label (EN)", "contact_email_label_en")}</Col>
                  <Col md="6">{field("Contact email label (AR)", "contact_email_label_ar")}</Col>
                  <Col md="6">{field("Contact email desc (EN)", "contact_email_desc_en")}</Col>
                  <Col md="6">{field("Contact email desc (AR)", "contact_email_desc_ar")}</Col>
                  <Col md="6">{field("Contact checklist EN (JSON)", "contact_checklist_en_json", "textarea")}</Col>
                  <Col md="6">{field("Contact checklist AR (JSON)", "contact_checklist_ar_json", "textarea")}</Col>
                  <Col md="6">{field("Contact pill (EN)", "contact_pill_en")}</Col>
                  <Col md="6">{field("Contact pill (AR)", "contact_pill_ar")}</Col>
                  <Col md="6">{field("Form label (EN)", "contact_form_label_en")}</Col>
                  <Col md="6">{field("Form label (AR)", "contact_form_label_ar")}</Col>
                  <Col md="6">{field("Form title (EN)", "contact_form_title_en")}</Col>
                  <Col md="6">{field("Form title (AR)", "contact_form_title_ar")}</Col>
                  <Col md="6">{field("Form lead (EN)", "contact_form_lead_en", "textarea")}</Col>
                  <Col md="6">{field("Form lead (AR)", "contact_form_lead_ar", "textarea")}</Col>
                  <Col md="6">{field("Side label (EN)", "contact_side_label_en")}</Col>
                  <Col md="6">{field("Side label (AR)", "contact_side_label_ar")}</Col>
                  <Col md="6">{field("Side title (EN)", "contact_side_title_en")}</Col>
                  <Col md="6">{field("Side title (AR)", "contact_side_title_ar")}</Col>
                  <Col md="6">{field("Side lead (EN)", "contact_side_lead_en", "textarea")}</Col>
                  <Col md="6">{field("Side lead (AR)", "contact_side_lead_ar", "textarea")}</Col>
                  <Col md="6">{field("Response note (EN)", "contact_response_note_en")}</Col>
                  <Col md="6">{field("Response note (AR)", "contact_response_note_ar")}</Col>
                  <Col md="6">{field("Blogs pill (EN)", "blogs_pill_en")}</Col>
                  <Col md="6">{field("Blogs pill (AR)", "blogs_pill_ar")}</Col>
                  <Col md="6">{field("Blogs title (EN)", "blogs_title_en")}</Col>
                  <Col md="6">{field("Blogs title (AR)", "blogs_title_ar")}</Col>
                  <Col md="6">{field("Blogs subtitle (EN)", "blogs_subtitle_en", "textarea")}</Col>
                  <Col md="6">{field("Blogs subtitle (AR)", "blogs_subtitle_ar", "textarea")}</Col>
                </Row>
              </form>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AdminMarketingSettings;
