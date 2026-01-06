import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  FormGroup,
  Label,
  Collapse,
} from "reactstrap";
import "./styles.scss";
import http from "../../../services/HttpService";
import { API_BASE_URL_ENV } from "../../../helpers/common";

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="section">
      <CardBody>
        <div className="section-head" onClick={() => setOpen(!open)}>
          <div className="title">{title}</div>
          <i className={`fa fa-chevron-${open ? "up" : "down"}`}></i>
        </div>
        <Collapse isOpen={open}>
          <div className="section-content">{children}</div>
        </Collapse>
      </CardBody>
    </Card>
  );
};

const AdminBrand = () => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      const { data } = await http.get(`${API_BASE_URL_ENV()}/admin/projects/1`);
      setProject(data?.project || null);
    } catch (e) {
      setProject(null);
    }
  };

  return (
    <div className="admin-container brand-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <div className="page-title">
              <h3 className="mb-1">{project?.name || "Project Name 1"}</h3>
              <span className="badge bg-warning-subtle text-warning">{project?.status_badge || "Pending"}</span>
            </div>
            <div className="muted">Join date: {project?.joined_at || "21Sep 2025"}</div>
          </Col>
          <Col className="text-end d-inline-flex gap-2" md="auto">
            <Button outline color="primary">
              <i className="fa fa-pencil"></i>
            </Button>
            <Button outline color="secondary">
              <i className="fa fa-user-plus"></i>
            </Button>
          </Col>
        </Row>

        <Row className="g-3 top-cards">
          <Col md={3}>
            <Card className="info">
              <CardBody>
                <div className="label">Project Name</div>
                <div className="value">{project?.name || "Name goes here"}</div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="info">
              <CardBody>
                <div className="label">Plan</div>
                <div className="value">
                  {project?.plan || "Standard Plan"} <span className="badge bg-success-subtle text-success ms-2">{project?.plan_badge || "Paid Plan"}</span>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="info">
              <CardBody>
                <div className="label">Status</div>
                <div className="value">
                  {project?.status || "Pending Feedback"} <span className="badge bg-warning-subtle text-warning ms-2">{project?.status_badge || "Pending"}</span>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="info">
              <CardBody>
                <div className="label">Assigned to</div>
                <div className="value">{project?.assigned_to || "Farouk Ahmed"}</div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={12}>
            <Section title="Project brief" defaultOpen>
              <div className="muted">Information about what the user has submitted in the chat</div>
            </Section>
            <Section title="Concept Stage">
              <div className="muted">Initial design concepts (images, PDFs, etc.).</div>
            </Section>
            <Section title="Feedback Stage" defaultOpen>
              <div className="comment-row">
                <div className="comment-text">
                  The overall layout feels clean, but we’d like the navigation bar to be more prominent...
                </div>
                <div className="comment-user">
                  <img src="https://i.pravatar.cc/40?img=12" alt="" />
                  <div className="name">Mohamed Samir</div>
                </div>
              </div>
              <div className="comment-row">
                <div className="comment-text">Increase the visibility of the navigation bar (spacing + bolder labels).</div>
                <div className="comment-user">
                  <div className="name">Admin</div>
                </div>
              </div>
              <div className="notes-box">
                <Input placeholder="Add a notes here" />
                <Button color="primary">Add</Button>
              </div>
            </Section>
            <Section title="Files (Delivery)">
              <div className="muted">Final files ready to be delivered</div>
            </Section>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminBrand;

