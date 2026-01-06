import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import "./styles.scss";

const StatCard = ({ icon, amount, currency, label, variant }) => (
  <Card className="stat-card">
    <CardBody>
      <div className={`icon ${variant ? `variant-${variant}` : ""}`}>{icon}</div>
      <div className="amount">
        {amount} <span className="currency">{currency}</span>
      </div>
      <div className="label">{label}</div>
    </CardBody>
  </Card>
);

const MiniCard = ({ icon, value, label, variant }) => (
  <Card className="mini-card">
    <CardBody>
      <div className={`icon ${variant ? `variant-${variant}` : ""}`}>{icon}</div>
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </CardBody>
  </Card>
);

const SectionTable = ({ title }) => (
  <Card className="section-card">
    <CardBody>
      <div className="section-title">{title}</div>
      <Row className="g-0 section-grid">
        {["Brief", "Content", "Feedback", "Publish"].map((stage, idx) => (
          <Col md={3} key={stage} className="stage">
            <div className="stage-title">{stage}</div>
            <div className="projects-count">5 Projects</div>
            <div className="stage-row">
              <span>In Progress</span>
              <span className="ok">2</span>
            </div>
            <div className="stage-row">
              <span>Pending</span>
              <span className="ok">3</span>
            </div>
          </Col>
        ))}
      </Row>
    </CardBody>
  </Card>
);

const AdminDashBoard = () => {
  return (
    <div className="admin-container dashboard-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-2">
          <Col>
            <h3 className="page-title mb-0">Dashboard</h3>
            <div className="page-subtitle">
              Description Here Description Here Description Here Description Here
            </div>
          </Col>
          <Col md="auto">
            <input className="date-input" placeholder="dd/mm/yyyy" />
          </Col>
        </Row>

        <div className="section-heading">Payments</div>
        <Row className="g-3 mb-3">
          <Col md={4}>
            <StatCard variant="gold" icon={<i className="fa fa-usd"></i>} amount="$2,568" currency="USD" label="Total Payments" />
          </Col>
          <Col md={4}>
            <StatCard variant="blue" icon={<span className="flag">🇦🇪</span>} amount="$2,568" currency="AED" label="Paid Payments" />
          </Col>
          <Col md={4}>
            <StatCard variant="green" icon={<span className="flag">🇸🇦</span>} amount="$2,568" currency="SAR" label="Pending Payments" />
          </Col>
        </Row>

        <div className="section-heading">Projects</div>
        <Row className="g-3 mb-3">
          <Col md={3}>
            <MiniCard variant="indigo" icon={<i className="fa fa-folder"></i>} value="85" label="Active Projects" />
          </Col>
          <Col md={3}>
            <MiniCard variant="emerald" icon={<i className="fa fa-check-circle"></i>} value="60" label="Completed Projects" />
          </Col>
          <Col md={3}>
            <MiniCard variant="amber" icon={<i className="fa fa-sun-o"></i>} value="62" label="In progress Projects" />
          </Col>
          <Col md={3}>
            <MiniCard variant="slate" icon={<i className="fa fa-archive"></i>} value="21" label="Pending Projects" />
          </Col>
        </Row>

        <SectionTable title="Total Active Projects 20" />
      </Container>
    </div>
  );
};

export default AdminDashBoard;
